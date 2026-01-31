import {
  buildLineClearSet,
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
import {
  applyMatch4LootDrops,
  createLootSession,
  formatLootLabel,
  pickWeightedChoice,
} from "./loot-utils.mjs";
import { shouldTriggerFirstMatch5Reward } from "./micro-reward-utils.mjs";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const resetButton = document.getElementById("reset");
const toastLayer = document.getElementById("toast-layer");

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
  debug: {
    match4Test: {
      enabled: false,
      mode: "horizontal",
    },
    match5Test: {
      enabled: false,
      mode: "horizontal",
    },
  },
  powerUps: {
    comboBonusMultiplier: 0.5,
    "line-clear": {
      fill: "#fef2de",
      stroke: "#a96a1d",
      textColor: "#2a1b09",
      stripeColor: "#a96a1d",
      markerText: "L",
      badge: {
        enabled: true,
        fill: "#a96a1d",
        stroke: "#2a1b09",
        textColor: "#fff8e6",
        radiusRatio: 0.18,
        offsetRatio: 0.08,
        fontScale: 0.85,
      },
    },
    "color-clear": {
      fill: "#fff3c4",
      stroke: "#7a4f12",
      textColor: "#2a1b09",
      badge: {
        enabled: true,
        fill: "#7a4f12",
        stroke: "#1e1206",
        text: "XX",
        textColor: "#fff6d6",
        radiusRatio: 0.18,
        offsetRatio: 0.08,
        fontScale: 0.9,
      },
    },
  },
  loot: {
    match4: {
      enabled: true,
      sessionCap: 2,
      types: [
        { id: "gem", weight: 60 },
        { id: "card", weight: 40 },
      ],
      toast: {
        enabled: true,
        durationMs: 1200,
        text: "Match-4 loot: {loot}",
      },
    },
    match5Bonus: {
      enabled: true,
      sessionCap: 3,
      types: [
        { id: "gem", weight: 60 },
        { id: "card", weight: 30 },
        { id: "relic", weight: 10 },
      ],
      toast: {
        enabled: true,
        durationMs: 1600,
        text: "Match-5 bonus: {loot}",
      },
    },
  },
  microRewards: {
    firstMatch5: {
      enabled: true,
      cooldownMs: 2000,
      toast: {
        enabled: true,
        durationMs: 1800,
        text: "First Match-5!",
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
  loot: createLootSession(),
  debugMatch4Keys: new Set(),
  microRewards: {
    firstMatch5Triggered: false,
    lastFirstMatch5At: -Infinity,
  },
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

function getLootConfig(key) {
  return state.config.loot?.[key] || {};
}

function getLootTypes(config) {
  if (Array.isArray(config.types)) return config.types;
  if (Array.isArray(config.weights)) return config.weights;
  return [];
}

function showToast(message, { durationMs = 1600 } = {}) {
  if (!toastLayer) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.setProperty("--toast-duration", `${durationMs}ms`);
  toastLayer.appendChild(toast);
  const cleanup = () => {
    toast.removeEventListener("animationend", cleanup);
    toast.remove();
  };
  toast.addEventListener("animationend", cleanup);
}

function resetLootSession() {
  state.loot = createLootSession();
}

function recordLootDrop({ type, event, source = "match5-bonus" }) {
  const entry = {
    id: state.loot.nextLootId,
    type,
    source,
    eventId: event?.id ?? null,
    cascadeIndex: event?.cascadeIndex ?? null,
    orientation: event?.orientation ?? null,
    length: event?.length ?? null,
    atMs: performance.now(),
  };
  state.loot.nextLootId += 1;
  state.loot.session.push(entry);
  return entry;
}

function handleMatch4LootDrops(events) {
  const config = getLootConfig("match4");
  if (!config.enabled) return;
  const drops = applyMatch4LootDrops(events, config, state.loot);
  if (drops.length === 0) return;

  for (const drop of drops) {
    recordLootDrop({ type: drop.type, event: drop.event, source: "match4" });
  }

  const toastConfig = config.toast || {};
  if (toastConfig.enabled) {
    const durationMs = toastConfig.durationMs ?? 1200;
    if (drops.length === 1) {
      const label = formatLootLabel(drops[0].type);
      const template = toastConfig.text || "Match-4 loot: {loot}";
      const message = template.replace("{loot}", label);
      showToast(message, { durationMs });
    } else {
      showToast(`Match-4 loot x${drops.length}`, { durationMs });
    }
  }
}

function handleMatch5LootBonus(events) {
  const config = getLootConfig("match5Bonus");
  if (!config.enabled) return;
  const types = getLootTypes(config);
  if (types.length === 0) return;

  const cap = Number(config.sessionCap);
  const hasCap = Number.isFinite(cap) && cap > 0;

  for (const event of events) {
    if (event.length !== 5) continue;
    if (hasCap && state.loot.match5BonusCount >= cap) return;
    const choice = pickWeightedChoice(types);
    if (!choice) return;
    state.loot.match5BonusCount += 1;
    const lootType = choice.id || choice.type || "loot";
    recordLootDrop({ type: lootType, event, source: "match5-bonus" });

    const toastConfig = config.toast || {};
    if (toastConfig.enabled) {
      const label = formatLootLabel(lootType);
      const template = toastConfig.text || "Match-5 bonus: {loot}";
      const message = template.replace("{loot}", label);
      showToast(message, { durationMs: toastConfig.durationMs });
    }
  }
}
function getFirstMatch5RewardConfig() {
  return state.config.microRewards?.firstMatch5 || {};
}

function resetMicroRewards() {
  state.microRewards.firstMatch5Triggered = false;
  state.microRewards.lastFirstMatch5At = -Infinity;
}

function handleFirstMatch5Reward(events) {
  const config = getFirstMatch5RewardConfig();
  if (!config.enabled) return;
  const now = performance.now();
  const shouldTrigger = shouldTriggerFirstMatch5Reward({
    events,
    alreadyTriggered: state.microRewards.firstMatch5Triggered,
    lastTriggeredAt: state.microRewards.lastFirstMatch5At,
    now,
    cooldownMs: config.cooldownMs,
  });
  if (!shouldTrigger) return;

  state.microRewards.firstMatch5Triggered = true;
  state.microRewards.lastFirstMatch5At = now;

  const toastConfig = config.toast || {};
  if (toastConfig.enabled) {
    const message = toastConfig.text || "First Match-5!";
    showToast(message, { durationMs: toastConfig.durationMs });
  }
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

function drawLineClearBadge(tile, dx, dy, size, style) {
  if (!isLineClearTile(tile)) return;
  const badge = style?.badge;
  if (!badge || badge.enabled === false) return;
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

  const markerText = style?.markerText || "L";
  ctx.fillStyle = badge.textColor || "#fff";
  ctx.font = `${Math.floor(radius * (badge.fontScale ?? 0.85))}px Georgia`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(markerText, badgeX, badgeY + 1);
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

function findCenteredMaskRun(mask, rows, cols, length, orientation) {
  const centerRow = (rows - 1) / 2;
  const centerCol = (cols - 1) / 2;
  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;

  const considerWindow = (startRow, startCol) => {
    const midOffset = (length - 1) / 2;
    const runCenterRow = orientation === "horizontal" ? startRow : startRow + midOffset;
    const runCenterCol = orientation === "horizontal" ? startCol + midOffset : startCol;
    const dr = runCenterRow - centerRow;
    const dc = runCenterCol - centerCol;
    const dist = dr * dr + dc * dc;
    if (dist < bestDist) {
      bestDist = dist;
      const cells = [];
      for (let i = 0; i < length; i += 1) {
        const row = orientation === "horizontal" ? startRow : startRow + i;
        const col = orientation === "horizontal" ? startCol + i : startCol;
        cells.push({ row, col });
      }
      best = cells;
    }
  };

  if (orientation === "horizontal") {
    for (let row = 0; row < rows; row += 1) {
      let runStart = null;
      let runLength = 0;
      for (let col = 0; col <= cols; col += 1) {
        const isFilled = col < cols && mask[row][col] === 1;
        if (isFilled) {
          if (runStart === null) runStart = col;
          runLength += 1;
        }
        if (!isFilled || col === cols) {
          if (runStart !== null && runLength >= length) {
            for (let start = runStart; start <= runStart + runLength - length; start += 1) {
              considerWindow(row, start);
            }
          }
          runStart = null;
          runLength = 0;
        }
      }
    }
  } else {
    for (let col = 0; col < cols; col += 1) {
      let runStart = null;
      let runLength = 0;
      for (let row = 0; row <= rows; row += 1) {
        const isFilled = row < rows && mask[row][col] === 1;
        if (isFilled) {
          if (runStart === null) runStart = row;
          runLength += 1;
        }
        if (!isFilled || row === rows) {
          if (runStart !== null && runLength >= length) {
            for (let start = runStart; start <= runStart + runLength - length; start += 1) {
              considerWindow(start, col);
            }
          }
          runStart = null;
          runLength = 0;
        }
      }
    }
  }

  return best;
}

function buildMatchTestGrid(length, mode) {
  const grid = [];
  for (let row = 0; row < state.gridRows; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < state.gridCols; col += 1) {
      if (state.mask[row][col] !== 1) {
        rowTiles.push(null);
        continue;
      }
      const letter = letters[(row + col) % letters.length];
      rowTiles.push(createTile(row, col, letter));
    }
    grid.push(rowTiles);
  }

  const wantsHorizontal = mode === "horizontal" || mode === "both";
  const wantsVertical = mode === "vertical" || mode === "both";

  const ensureDifferent = (row, col, disallowLetter) => {
    if (row < 0 || col < 0 || row >= state.gridRows || col >= state.gridCols) return;
    if (state.mask[row][col] !== 1) return;
    const tile = grid[row][col];
    if (!tile) return;
    if (tile.letter !== disallowLetter) return;
    const options = letters.filter((letter) => letter !== disallowLetter);
    tile.letter = options.length ? options[0] : tile.letter;
  };

  const horizontalLetter = letters[0];
  const verticalLetter =
    mode === "both" ? horizontalLetter : letters[1] || letters[0];
  const highlightKeys = new Set();

  if (wantsHorizontal) {
    const run = findCenteredMaskRun(
      state.mask,
      state.gridRows,
      state.gridCols,
      length,
      "horizontal"
    );
    if (run) {
      for (const cell of run) {
        const tile = grid[cell.row][cell.col];
        if (tile) tile.letter = horizontalLetter;
        highlightKeys.add(`${cell.row},${cell.col}`);
      }
      const left = run[0];
      const right = run[run.length - 1];
      ensureDifferent(left.row, left.col - 1, horizontalLetter);
      ensureDifferent(right.row, right.col + 1, horizontalLetter);
    }
  }

  if (wantsVertical) {
    const run = findCenteredMaskRun(
      state.mask,
      state.gridRows,
      state.gridCols,
      length,
      "vertical"
    );
    if (run) {
      for (const cell of run) {
        const tile = grid[cell.row][cell.col];
        if (tile) tile.letter = verticalLetter;
        highlightKeys.add(`${cell.row},${cell.col}`);
      }
      const top = run[0];
      const bottom = run[run.length - 1];
      ensureDifferent(top.row - 1, top.col, verticalLetter);
      ensureDifferent(bottom.row + 1, bottom.col, verticalLetter);
    }
  }

  return { grid, highlightKeys };
}

function buildMatch4TestGrid(mode) {
  return buildMatchTestGrid(4, mode);
}

function buildMatch5TestGrid(mode) {
  return buildMatchTestGrid(5, mode);
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

function isPowerUpTile(tile) {
  return Boolean(tile && tile.powerUp && tile.powerUp.type);
}

function isLineClearTile(tile) {
  return tile && tile.powerUp && tile.powerUp.type === "line-clear";
}

function drawLineClearStripe(tile, dx, dy, size, style) {
  if (!isLineClearTile(tile)) return;
  const orientation = tile.powerUp.orientation || "horizontal";
  const stripeColor = style?.stripeColor || "#2b2b2b";
  const inset = size * 0.2;
  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = Math.max(2, size * 0.08);
  ctx.beginPath();
  if (orientation === "vertical") {
    const x = dx + size / 2;
    ctx.moveTo(x, dy + inset);
    ctx.lineTo(x, dy + size - inset);
  } else {
    const y = dy + size / 2;
    ctx.moveTo(dx + inset, y);
    ctx.lineTo(dx + size - inset, y);
  }
  ctx.stroke();
}

function initGrid() {
  const match4Config = state.config.debug?.match4Test;
  const match5Config = state.config.debug?.match5Test;
  if (match4Config && match4Config.enabled) {
    const result = buildMatch4TestGrid(match4Config.mode || "horizontal");
    state.grid = result.grid;
    state.debugMatch4Keys = result.highlightKeys;
  } else if (match5Config && match5Config.enabled) {
    const result = buildMatch5TestGrid(match5Config.mode || "horizontal");
    state.grid = result.grid;
    state.debugMatch4Keys = new Set();
  } else {
    state.grid = fillGridNoMatches(
      state.gridRows,
      state.gridCols,
      state.mask,
      letters,
      createTile
    );
    state.debugMatch4Keys = new Set();
  }
}

function resetScore() {
  state.score = 0;
  updateScore();
}

function resetGame() {
  initGrid();
  resetScore();
  resetLootSession();
  resetMicroRewards();
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

  if (state.config.debug?.match4Test?.enabled) {
    const key = `${tile.row},${tile.col}`;
    if (state.debugMatch4Keys.has(key)) {
      ctx.fillStyle = "rgba(255, 173, 46, 0.35)";
      ctx.beginPath();
      ctx.roundRect(dx + 2, dy + 2, scaledSize - 4, scaledSize - 4, 8);
      ctx.fill();
    }
  }

  drawColorClearBadge(tile, dx, dy, scaledSize, powerUpStyle);
  drawLineClearStripe(tile, dx, dy, scaledSize, powerUpStyle);
  drawLineClearBadge(tile, dx, dy, scaledSize, powerUpStyle);

  if (tile.letter) {
    ctx.fillStyle = textColor;
    ctx.font = `${Math.floor(scaledSize * 0.5)}px Georgia`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tile.letter, dx + scaledSize / 2, dy + scaledSize / 2);
  }
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

async function collapseAndRefill() {
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
    perColumnTime.set(move.to.col, currentTime + Math.max(spacingTimeMs, staggerMs));
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
    const spawnSwapDestination = cascadeIndex === 0 ? swapDestination : null;
    for (const run of runs) {
      if (run.length !== 5) continue;
      const spawnCell = selectMatchPowerUpCell(run.cells, {
        swapDestination: spawnSwapDestination,
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
    for (const run of runs) {
      if (run.length !== 4) continue;
      const spawnCell = selectMatchPowerUpCell(run.cells, {
        swapDestination: spawnSwapDestination,
        reserved: reservedPowerUpCells,
      });
      if (!spawnCell) continue;
      const key = `${spawnCell.row},${spawnCell.col}`;
      reservedPowerUpCells.add(key);
      clearSet.delete(key);
      const tile = state.grid[spawnCell.row][spawnCell.col];
      if (tile) {
        tile.powerUp = { type: "line-clear", orientation: run.orientation };
      }
    }

    const points = scoreMatches(matched);
    state.score += points;
    updateScore();
    clearMatches(state.grid, clearSet);
    await delay(state.config.animations.matchResolveMs);
    await collapseAndRefill();
    matched = findMatches(state.grid, state.gridRows, state.gridCols);
    cascadeIndex += 1;
  }

  return didMatch;
}

function mergeKeySet(target, source) {
  if (!source) return;
  for (const key of source) {
    target.add(key);
  }
}

async function activateLineClearSwap(lineClearTiles, { hasCombo = false } = {}) {
  if (!lineClearTiles || lineClearTiles.length === 0) return false;
  const clearSet = new Set();
  for (const tile of lineClearTiles) {
    if (!tile || !tile.powerUp) continue;
    const keys = buildLineClearSet(state.grid, state.gridRows, state.gridCols, {
      row: tile.row,
      col: tile.col,
      orientation: tile.powerUp.orientation,
    });
    mergeKeySet(clearSet, keys);
  }
  if (clearSet.size === 0) return false;
  const clearPoints = scoreMatches(clearSet);
  const comboMultiplier = Number(state.config.powerUps?.comboBonusMultiplier) || 0;
  const comboBonus = hasCombo ? Math.round(clearPoints * comboMultiplier) : 0;
  state.score += clearPoints + comboBonus;
  updateScore();
  clearMatches(state.grid, clearSet);
  await delay(state.config.animations.matchResolveMs);
  await collapseAndRefill();
  await resolveMatchesAnimated();
  return true;
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
  const lineClearTiles = [first, second].filter(isLineClearTile);
  const hasCombo = isPowerUpTile(first) && isPowerUpTile(second) && lineClearTiles.length > 0;

  try {
    await animateSwap(first, second);
    swapTiles(first, second);
    const activated = await activateLineClearSwap(lineClearTiles, { hasCombo });
    if (activated) return;
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
  const colorClearOverrides =
    powerUpOverrides["color-clear"] || powerUpOverrides.colorClear || {};
  const lineClearOverrides =
    powerUpOverrides["line-clear"] || powerUpOverrides.lineClear || {};
  const lootOverrides = config.loot || {};
  const lootMatch5Overrides = lootOverrides.match5Bonus || {};
  const microRewardOverrides = config.microRewards || {};
  const firstMatch5Overrides = microRewardOverrides.firstMatch5 || {};
  const lootMatch4Overrides = lootOverrides.match4 || {};
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
    debug: {
      ...defaultConfig.debug,
      ...(config.debug || {}),
      match4Test: {
        ...defaultConfig.debug.match4Test,
        ...((config.debug && config.debug.match4Test) || {}),
      },
      match5Test: {
        ...defaultConfig.debug.match5Test,
        ...((config.debug && config.debug.match5Test) || {}),
      },
    },
    powerUps: {
      ...defaultConfig.powerUps,
      ...powerUpOverrides,
      "line-clear": {
        ...defaultConfig.powerUps["line-clear"],
        ...lineClearOverrides,
        badge: {
          ...defaultConfig.powerUps["line-clear"].badge,
          ...(lineClearOverrides.badge || {}),
        },
      },
      "color-clear": {
        ...defaultConfig.powerUps["color-clear"],
        ...colorClearOverrides,
        badge: {
          ...defaultConfig.powerUps["color-clear"].badge,
          ...(colorClearOverrides.badge || {}),
        },
      },
    },
    loot: {
      ...defaultConfig.loot,
      ...lootOverrides,
      match4: {
        ...defaultConfig.loot.match4,
        ...lootMatch4Overrides,
        toast: {
          ...defaultConfig.loot.match4.toast,
          ...(lootMatch4Overrides.toast || {}),
        },
      },
      match5Bonus: {
        ...defaultConfig.loot.match5Bonus,
        ...lootMatch5Overrides,
        toast: {
          ...defaultConfig.loot.match5Bonus.toast,
          ...(lootMatch5Overrides.toast || {}),
        },
      },
    },
    microRewards: {
      ...defaultConfig.microRewards,
      ...microRewardOverrides,
      firstMatch5: {
        ...defaultConfig.microRewards.firstMatch5,
        ...firstMatch5Overrides,
        toast: {
          ...defaultConfig.microRewards.firstMatch5.toast,
          ...(firstMatch5Overrides.toast || {}),
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
  state.matchEventListeners.add(handleMatch4LootDrops);
  state.matchEventListeners.add(handleMatch5LootBonus);
  state.matchEventListeners.add(handleFirstMatch5Reward);
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
