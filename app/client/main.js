import {
  clearMatches,
  buildMatchEvents,
  collapseExistingTiles,
  createMask,
  fillGridNoMatches,
  findMatchRuns,
  findMatches,
  normalizeMask,
  selectMatchPowerUpCell,
} from "./board-logic.mjs";
import { computeRepulsionOffsets, computeTapScale, decayBoost } from "./physics-utils.mjs";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const resetButton = document.getElementById("reset");

const letters = ["A", "B", "C", "D", "E"];
const letterValues = {
  A: 10 ** 2,
  B: 10 ** 3,
  C: 10 ** 4,
  D: 10 ** 5,
  E: 10 ** 6,
};

const defaultConfig = {
  fallbackGridDimension: {
    rows: 8,
    cols: 8,
  },
  board: {
    gap: 8,
    padding: 8,
    maxWidth: 320,
  },
  animations: {
    swapMs: 500,
    cascadeMs: 500,
    matchResolveMs: 800,
    cascadeStaggerMs: {
      min: 5,
      max: 10,
    },
  },
  physics: {
    enabled: true,
    gravityPxPerMs: 1.2,
    collisionDecel: 0.9,
    bounceElasticity: 0.2,
    repulsion: {
      radius: 10,
      strength: 6,
      decayMs: 400,
      tapBoost: 0.35,
    },
    tap: {
      scaleDown: 0.08,
      scaleDurationMs: 140,
    },
    cascadeSpacingGapMultiplier: 2,
  },
  powerUps: {
    colorClear: {
      fill: "#fff3c4",
      stroke: "#7a4f12",
      textColor: "#2a1b09",
      badge: {
        enabled: true,
        fill: "#7a4f12",
        stroke: "#1e1206",
        text: "",
        textColor: "#fff6d6",
        radiusRatio: 0.18,
        offsetRatio: 0.08,
        fontScale: 0.9,
      },
    },
  },
};

const scoreFormatter = new Intl.NumberFormat("en-US");

const state = {
  grid: [],
  gridRows: defaultConfig.fallbackGridDimension.rows,
  gridCols: defaultConfig.fallbackGridDimension.cols,
  mask: createMask(
    defaultConfig.fallbackGridDimension.rows,
    defaultConfig.fallbackGridDimension.cols,
    1
  ),
  tileSize: 0,
  gap: defaultConfig.board.gap,
  padding: defaultConfig.board.padding,
  selected: null,
  dragging: false,
  animation: null,
  inputLocked: false,
  score: 0,
  config: defaultConfig,
  boardDefinition: null,
  now: 0,
  lastFrameTime: 0,
  matchEventIdCounter: 1,
  matchEventListeners: new Set(),
  lastMatchEvents: [],
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function emitMatchEvents(events) {
  state.lastMatchEvents = events;
  for (const listener of state.matchEventListeners) {
    listener(events);
  }
}

function updateScore() {
  scoreEl.textContent = scoreFormatter.format(state.score);
}

function isColorClearTile(tile) {
  return tile && tile.powerUp && tile.powerUp.type === "color-clear";
}

function getPowerUpStyle(tile) {
  if (!tile || !tile.powerUp) return null;
  const palette = state.config.powerUps || {};
  return palette[tile.powerUp.type] || null;
}

function drawColorClearBadge(tile, dx, dy, size, style) {
  if (!isColorClearTile(tile)) return;
  const badge = style?.badge;
  if (!badge || !badge.enabled) return;
  const radius = size * (badge.radiusRatio ?? 0.18);
  const offsetRatio = badge.offsetRatio ?? 0.08;
  const badgeX = dx + size - radius - size * offsetRatio;
  const badgeY = dy + radius + size * offsetRatio;
  ctx.fillStyle = badge.fill || "#2b2b2b";
  ctx.strokeStyle = badge.stroke || "#1f1f1f";
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (badge.text) {
    ctx.fillStyle = badge.textColor || "#fff";
    ctx.font = `${Math.floor(radius * (badge.fontScale ?? 0.9))}px Georgia`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badge.text, badgeX, badgeY);
  }
}

function resizeCanvas() {
  const width = canvas.clientWidth;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = width * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  const totalGap = state.gap * (state.gridCols - 1);
  const available = width - state.padding * 2 - totalGap;
  state.tileSize = Math.floor(available / state.gridCols);
}

function randomLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
}

function createTile(row, col, letter = randomLetter()) {
  return {
    row,
    col,
    letter,
    powerUp: null,
    repulseBoost: 0,
    tapImpactStart: 0,
  };
}

function initGrid() {
  state.grid = fillGridNoMatches(
    state.gridRows,
    state.gridCols,
    state.mask,
    letters,
    createTile
  );
}

function resetScore() {
  state.score = 0;
  updateScore();
}

function resetGame() {
  initGrid();
  resetScore();
  state.selected = null;
  state.dragging = false;
}

function tileRect(row, col) {
  const x = state.padding + col * (state.tileSize + state.gap);
  const y = state.padding + row * (state.tileSize + state.gap);
  return { x, y, size: state.tileSize };
}

function getTileAt(x, y) {
  for (let row = 0; row < state.gridRows; row += 1) {
    for (let col = 0; col < state.gridCols; col += 1) {
      const tile = state.grid[row][col];
      if (!tile) continue;
      const rect = tileRect(tile.row, tile.col);
      if (x >= rect.x && x <= rect.x + rect.size && y >= rect.y && y <= rect.y + rect.size) {
        return tile;
      }
    }
  }
  return null;
}

function getAnimatedPosition(tile) {
  const rect = tileRect(tile.row, tile.col);
  let dx = rect.x;
  let dy = rect.y;

  if (state.animation && state.animation.tiles.includes(tile)) {
    const anim = state.animation;
    const tIndex = anim.tiles.indexOf(tile);
    const from = anim.from[tIndex];
    const to = anim.to[tIndex];
    const progress = anim.progresses ? anim.progresses[tIndex] : anim.progress;
    dx = from.x + (to.x - from.x) * progress;
    dy = from.y + (to.y - from.y) * progress;
  }

  return { x: dx, y: dy, size: rect.size };
}

function drawTile(tile, offset, scale) {
  const rect = tileRect(tile.row, tile.col);
  const animPos = getAnimatedPosition(tile);
  let dx = animPos.x + offset.x;
  let dy = animPos.y + offset.y;
  const tileSize = rect.size;
  const scaledSize = tileSize * scale;
  dx -= (scaledSize - tileSize) / 2;
  dy -= (scaledSize - tileSize) / 2;

  const powerUpStyle = getPowerUpStyle(tile);
  const baseFill = powerUpStyle?.fill || "#fff";
  const baseStroke = powerUpStyle?.stroke || "#2b2b2b";
  const textColor = powerUpStyle?.textColor || "#1f1f1f";

  ctx.fillStyle = state.selected === tile ? "#f6b48c" : baseFill;
  ctx.strokeStyle = baseStroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(dx, dy, scaledSize, scaledSize, 10);
  ctx.fill();
  ctx.stroke();

  drawColorClearBadge(tile, dx, dy, scaledSize, powerUpStyle);

  ctx.fillStyle = textColor;
  ctx.font = `${Math.floor(scaledSize * 0.5)}px Georgia`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tile.letter, dx + scaledSize / 2, dy + scaledSize / 2);
}

function render(timestamp) {
  updateAnimation(timestamp);
  const dt = state.lastFrameTime ? timestamp - state.lastFrameTime : 0;
  state.lastFrameTime = timestamp;
  state.now = timestamp;
  if (dt > 0) updateTileEffects(dt);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fdfbf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tiles = [];
  const positions = new Map();
  const boosts = new Map();
  for (let row = 0; row < state.gridRows; row += 1) {
    for (let col = 0; col < state.gridCols; col += 1) {
      const tile = state.grid[row][col];
      if (!tile) continue;
      tiles.push(tile);
      const animPos = getAnimatedPosition(tile);
      positions.set(tile, {
        x: animPos.x + animPos.size / 2,
        y: animPos.y + animPos.size / 2,
      });
      boosts.set(tile, tile.repulseBoost || 0);
    }
  }
  const offsets = computeRepulsionOffsets(
    tiles,
    positions,
    state.tileSize,
    state.config.physics,
    boosts
  );

  for (let row = 0; row < state.gridRows; row += 1) {
    for (let col = 0; col < state.gridCols; col += 1) {
      const tile = state.grid[row][col];
      if (tile) {
        const offset = offsets.get(tile) || { x: 0, y: 0 };
        const scale = computeTapScale(
          state.now,
          tile.tapImpactStart,
          state.config.physics.tap.scaleDurationMs,
          state.config.physics.tap.scaleDown
        );
        drawTile(tile, offset, scale);
      }
    }
  }

  requestAnimationFrame(render);
}

function swapTiles(a, b) {
  const tempRow = a.row;
  const tempCol = a.col;
  a.row = b.row;
  a.col = b.col;
  b.row = tempRow;
  b.col = tempCol;
  state.grid[a.row][a.col] = a;
  state.grid[b.row][b.col] = b;
}

function animateSwap(a, b) {
  const rectA = tileRect(a.row, a.col);
  const rectB = tileRect(b.row, b.col);
  return new Promise((resolve) => {
    state.animation = {
      tiles: [a, b],
      from: [rectA, rectB],
      to: [rectB, rectA],
      progress: 0,
      start: performance.now(),
      duration: state.config.animations.swapMs,
      onComplete: resolve,
    };
  });
}

function animateCascade(tiles, from, to, delays) {
  if (tiles.length === 0) return Promise.resolve();
  return new Promise((resolve) => {
    state.animation = {
      tiles,
      from,
      to,
      progresses: new Array(tiles.length).fill(0),
      delays: delays || null,
      durations: null,
      start: performance.now(),
      duration: state.config.animations.cascadeMs,
      staggerMs: state.config.animations.cascadeStaggerMs,
      onComplete: resolve,
    };
  });
}

function animateCascadeWithDurations(tiles, from, to, delays, durations) {
  if (tiles.length === 0) return Promise.resolve();
  return new Promise((resolve) => {
    state.animation = {
      tiles,
      from,
      to,
      progresses: new Array(tiles.length).fill(0),
      delays: delays || null,
      durations: durations || null,
      start: performance.now(),
      duration: state.config.animations.cascadeMs,
      staggerMs: state.config.animations.cascadeStaggerMs,
      onComplete: resolve,
    };
  });
}

function updateAnimation(timestamp) {
  if (!state.animation) return;
  const anim = state.animation;
  if (anim.staggerMs != null) {
    let completed = 0;
    for (let i = 0; i < anim.tiles.length; i += 1) {
      const delay = anim.delays ? anim.delays[i] : anim.staggerMs * i;
      const localElapsed = timestamp - (anim.start + delay);
      const duration = anim.durations ? anim.durations[i] : anim.duration;
      const linear = Math.min(Math.max(localElapsed / duration, 0), 1);
      const eased = easeCascade(
        linear,
        state.config.physics.bounceElasticity,
        state.config.physics.collisionDecel
      );
      anim.progresses[i] = eased;
      if (linear >= 1) completed += 1;
    }

    if (completed === anim.tiles.length) {
      const callback = anim.onComplete;
      state.animation = null;
      if (callback) callback();
    }
  } else {
    const elapsed = timestamp - anim.start;
    anim.progress = Math.min(elapsed / anim.duration, 1);

    if (anim.progress >= 1) {
      const callback = anim.onComplete;
      state.animation = null;
      if (callback) callback();
    }
  }
}

function scoreMatches(matchSet) {
  let points = 0;
  for (const key of matchSet) {
    const [row, col] = key.split(",").map(Number);
    const tile = state.grid[row][col];
    if (tile) points += letterValues[tile.letter] || 0;
  }
  return points;
}

function easeCascade(t, elasticity, decel) {
  const clamped = Math.min(Math.max(t, 0), 1);
  const decelFactor = Math.min(Math.max(decel, 0), 1);
  const exponent = 2 + decelFactor * 2;
  const base = 1 - Math.pow(1 - clamped, exponent);
  if (elasticity <= 0) return base;
  const wobble =
    Math.sin(clamped * Math.PI * 2) * (1 - clamped) * Math.min(elasticity, 1) * 0.12;
  return Math.min(Math.max(base - wobble, 0), 1);
}

function updateTileEffects(dt) {
  for (let row = 0; row < state.gridRows; row += 1) {
    for (let col = 0; col < state.gridCols; col += 1) {
      const tile = state.grid[row][col];
      if (!tile) continue;
      tile.repulseBoost = decayBoost(
        tile.repulseBoost || 0,
        dt,
        state.config.physics.repulsion.decayMs
      );
    }
  }
}

function computeFallDuration(fromRect, toRect) {
  const distance = Math.abs(toRect.y - fromRect.y);
  const gravity = state.config.physics.gravityPxPerMs;
  if (gravity <= 0) return state.config.animations.cascadeMs;
  return Math.max(state.config.animations.cascadeMs, distance / gravity);
}

function computeSpacingTime() {
  const gravity = state.config.physics.gravityPxPerMs;
  if (gravity <= 0) return getCascadeStaggerMs();
  const spacingPx = state.gap * state.config.physics.cascadeSpacingGapMultiplier;
  return spacingPx / gravity;
}

function getCascadeStaggerMs() {
  const staggerConfig = state.config.animations.cascadeStaggerMs || { min: 0, max: 0 };
  const min = Math.min(staggerConfig.min ?? 0, staggerConfig.max ?? 0);
  const max = Math.max(staggerConfig.min ?? 0, staggerConfig.max ?? 0);
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}

async function resolveMatchesAnimated({ swapOrigin = null, swapDestination = null } = {}) {
  let matched = findMatches(state.grid, state.gridRows, state.gridCols);
  let didMatch = false;
  let cascadeIndex = 0;

  while (matched.size > 0) {
    didMatch = true;
    const { events, nextEventId } = buildMatchEvents(
      state.grid,
      state.gridRows,
      state.gridCols,
      {
        swapOrigin,
        cascadeIndex,
        eventIdStart: state.matchEventIdCounter,
      }
    );
    state.matchEventIdCounter = nextEventId;
    emitMatchEvents(events);

    const runs = findMatchRuns(state.grid, state.gridRows, state.gridCols);
    const clearSet = new Set(matched);
    const reservedPowerUpCells = new Set();
    for (const run of runs) {
      if (run.length !== 5) continue;
      const spawnCell = selectMatchPowerUpCell(run.cells, {
        swapDestination: cascadeIndex === 0 ? swapDestination : null,
        reserved: reservedPowerUpCells,
      });
      if (!spawnCell) continue;
      const key = `${spawnCell.row},${spawnCell.col}`;
      reservedPowerUpCells.add(key);
      clearSet.delete(key);
      const tile = state.grid[spawnCell.row][spawnCell.col];
      if (tile) {
        tile.powerUp = { type: "color-clear" };
      }
    }

    const points = scoreMatches(matched);
    state.score += points;
    updateScore();
    clearMatches(state.grid, clearSet);
    await delay(state.config.animations.matchResolveMs);
    const { nextGrid, moves, emptySlots } = collapseExistingTiles(
      state.grid,
      state.gridRows,
      state.gridCols,
      state.mask
    );
    state.grid = nextGrid;

    const movingTiles = [];
    const fromRects = [];
    const toRects = [];
    const delays = [];
    const durations = [];
    moves.sort((a, b) => {
      if (a.to.col !== b.to.col) return a.to.col - b.to.col;
      return b.from.row - a.from.row;
    });
    const perColumnTime = new Map();
    const spacingTimeMs = computeSpacingTime();
    for (const move of moves) {
      movingTiles.push(move.tile);
      fromRects.push(tileRect(move.from.row, move.from.col));
      toRects.push(tileRect(move.to.row, move.to.col));
      const fromRect = fromRects[fromRects.length - 1];
      const toRect = toRects[toRects.length - 1];
      const duration = computeFallDuration(fromRect, toRect);
      durations.push(duration);
      const currentTime = perColumnTime.get(move.to.col) || 0;
      delays.push(currentTime);
      const staggerMs = getCascadeStaggerMs();
      perColumnTime.set(
        move.to.col,
        currentTime + Math.max(spacingTimeMs, staggerMs)
      );
    }
    await animateCascadeWithDurations(movingTiles, fromRects, toRects, delays, durations);

    const newTiles = [];
    const newFromRects = [];
    const newToRects = [];
    const newDelays = [];
    const newDurations = [];
    emptySlots.sort((a, b) => {
      if (a.col !== b.col) return a.col - b.col;
      return b.row - a.row;
    });
    const newPerColumnTime = new Map();
    const newPerColumnCount = new Map();
    const newSpacingTimeMs = spacingTimeMs;
    for (const slot of emptySlots) {
      const tile = createTile(slot.row, slot.col);
      newTiles.push(tile);
      const count = newPerColumnCount.get(slot.col) || 0;
      newPerColumnCount.set(slot.col, count + 1);
      newFromRects.push(tileRect(-1 - count, slot.col));
      newToRects.push(tileRect(slot.row, slot.col));
      const fromRect = newFromRects[newFromRects.length - 1];
      const toRect = newToRects[newFromRects.length - 1];
      const duration = computeFallDuration(fromRect, toRect);
      newDurations.push(duration);
      const currentTime = newPerColumnTime.get(slot.col) || 0;
      newDelays.push(currentTime);
      const staggerMs = getCascadeStaggerMs();
      newPerColumnTime.set(
        slot.col,
        currentTime + Math.max(newSpacingTimeMs, staggerMs)
      );
      state.grid[slot.row][slot.col] = tile;
    }
    await animateCascadeWithDurations(
      newTiles,
      newFromRects,
      newToRects,
      newDelays,
      newDurations
    );
    matched = findMatches(state.grid, state.gridRows, state.gridCols);
    cascadeIndex += 1;
  }

  return didMatch;
}
function isAdjacent(a, b) {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr + dc === 1;
}

async function handleSwap(targetTile) {
  const selected = state.selected;
  if (!selected || !targetTile || selected === targetTile) return;
  if (!isAdjacent(selected, targetTile)) return;

  const first = selected;
  const second = targetTile;
  const swapOrigin = { row: first.row, col: first.col };
  const swapDestination = { row: second.row, col: second.col };
  state.selected = null;
  state.inputLocked = true;

  try {
    await animateSwap(first, second);
    swapTiles(first, second);
    const matched = await resolveMatchesAnimated({ swapOrigin, swapDestination });
    if (!matched) {
      await animateSwap(first, second);
      swapTiles(first, second);
    }
  } finally {
    state.inputLocked = false;
  }
}

function pointerToCanvas(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

function onPointerDown(event) {
  if (state.inputLocked) return;
  const { x, y } = pointerToCanvas(event);
  const tile = getTileAt(x, y);
  if (!tile) return;
  state.selected = tile;
  tile.repulseBoost = Math.min(
    (tile.repulseBoost || 0) + state.config.physics.repulsion.tapBoost,
    1
  );
  tile.tapImpactStart = state.now;
  state.dragging = true;
}

function onPointerUp(event) {
  if (state.inputLocked) return;
  if (!state.dragging) return;
  const { x, y } = pointerToCanvas(event);
  const tile = getTileAt(x, y);
  handleSwap(tile);
  state.dragging = false;
}

function onPointerMove(event) {
  if (!state.dragging || state.inputLocked) return;
  const { x, y } = pointerToCanvas(event);
  const tile = getTileAt(x, y);
  if (tile && tile !== state.selected) {
    handleSwap(tile);
    state.dragging = false;
  }
}

function normalizeBoardDefinition(board) {
  if (!board || !board.grid) {
    return {
      id: "default",
      name: "Default Board",
      theme: "default",
      level: 1,
      grid: { ...state.config.fallbackGridDimension },
      mask: createMask(
        state.config.fallbackGridDimension.rows,
        state.config.fallbackGridDimension.cols,
        1
      ),
    };
  }

  const rows = Number(board.grid.rows) || state.config.fallbackGridDimension.rows;
  const cols = Number(board.grid.cols) || state.config.fallbackGridDimension.cols;
  const mask = normalizeMask(board.mask, rows, cols);

  return {
    id: board.id || "default",
    name: board.name || "Default Board",
    theme: board.theme || "default",
    level: board.level || 1,
    grid: { rows, cols },
    mask,
  };
}

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Board config load failed", error);
    return null;
  }
}

async function loadConfig() {
  const configUrl = new URL("../assets/config/gameplay.json", window.location.href);
  const config = await fetchJson(configUrl);
  if (!config) return defaultConfig;
  const powerUpOverrides = config.powerUps || {};
  const colorClearOverrides = powerUpOverrides.colorClear || {};
  return {
    ...defaultConfig,
    ...config,
    fallbackGridDimension: {
      ...defaultConfig.fallbackGridDimension,
      ...(config.fallbackGridDimension || {}),
    },
    board: { ...defaultConfig.board, ...(config.board || {}) },
    animations: { ...defaultConfig.animations, ...(config.animations || {}) },
    physics: { ...defaultConfig.physics, ...(config.physics || {}) },
    powerUps: {
      ...defaultConfig.powerUps,
      ...powerUpOverrides,
      colorClear: {
        ...defaultConfig.powerUps.colorClear,
        ...colorClearOverrides,
        badge: {
          ...defaultConfig.powerUps.colorClear.badge,
          ...(colorClearOverrides.badge || {}),
        },
      },
    },
  };
}

async function loadBoardDefinition() {
  const indexUrl = new URL("../assets/boards/index.json", window.location.href);
  const index = await fetchJson(indexUrl);
  if (!index || !Array.isArray(index.themes) || index.themes.length === 0) {
    return normalizeBoardDefinition(null);
  }

  const theme = index.themes[0];
  if (!theme || !Array.isArray(theme.boards) || theme.boards.length === 0) {
    return normalizeBoardDefinition(null);
  }

  const firstBoard = theme.boards[0];
  const boardPath = typeof firstBoard === "string" ? firstBoard : firstBoard.path;
  if (!boardPath) {
    return normalizeBoardDefinition(null);
  }

  const boardUrl = new URL(boardPath, indexUrl);
  const board = await fetchJson(boardUrl);
  return normalizeBoardDefinition(board);
}

async function init() {
  state.config = await loadConfig();
  document.documentElement.style.setProperty(
    "--board-max-width",
    `${state.config.board.maxWidth}px`
  );
  const boardDefinition = await loadBoardDefinition();

  state.gridRows = boardDefinition.grid.rows;
  state.gridCols = boardDefinition.grid.cols;
  state.mask = boardDefinition.mask;
  state.gap = state.config.board.gap;
  state.padding = state.config.board.padding;
  state.boardDefinition = boardDefinition;

  resizeCanvas();
  resetGame();
  requestAnimationFrame(render);
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerup", onPointerUp);
resetButton.addEventListener("click", resetGame);

init();
