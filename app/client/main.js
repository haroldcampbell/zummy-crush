import {
  buildGrid,
  clearMatches,
  collapseColumns,
  createMask,
  fillGridNoMatches,
  findMatches,
  normalizeMask,
} from "./board-logic.mjs";

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
  grid: {
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
    cascadeStaggerMs: 10,
  },
};

const scoreFormatter = new Intl.NumberFormat("en-US");

const state = {
  grid: [],
  gridRows: defaultConfig.grid.rows,
  gridCols: defaultConfig.grid.cols,
  mask: createMask(defaultConfig.grid.rows, defaultConfig.grid.cols, 1),
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
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateScore() {
  scoreEl.textContent = scoreFormatter.format(state.score);
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

function drawTile(tile) {
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

  ctx.fillStyle = state.selected === tile ? "#f6b48c" : "#fff";
  ctx.strokeStyle = "#2b2b2b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(dx, dy, rect.size, rect.size, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f1f1f";
  ctx.font = `${Math.floor(rect.size * 0.5)}px Georgia`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tile.letter, dx + rect.size / 2, dy + rect.size / 2);
}

function render(timestamp) {
  updateAnimation(timestamp);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fdfbf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < state.gridRows; row += 1) {
    for (let col = 0; col < state.gridCols; col += 1) {
      const tile = state.grid[row][col];
      if (tile) drawTile(tile);
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

function animateCascade(tiles, from, to) {
  if (tiles.length === 0) return Promise.resolve();
  return new Promise((resolve) => {
    state.animation = {
      tiles,
      from,
      to,
      progresses: new Array(tiles.length).fill(0),
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
      const localElapsed = timestamp - (anim.start + anim.staggerMs * i);
      const progress = Math.min(Math.max(localElapsed / anim.duration, 0), 1);
      anim.progresses[i] = progress;
      if (progress >= 1) completed += 1;
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

async function resolveMatchesAnimated() {
  let matched = findMatches(state.grid, state.gridRows, state.gridCols);
  let didMatch = false;

  while (matched.size > 0) {
    didMatch = true;
    const points = scoreMatches(matched);
    state.score += points;
    updateScore();
    clearMatches(state.grid, matched);
    await delay(state.config.animations.matchResolveMs);
    const previousPositions = new Map();
    for (let row = 0; row < state.gridRows; row += 1) {
      for (let col = 0; col < state.gridCols; col += 1) {
        const tile = state.grid[row][col];
        if (!tile) continue;
        previousPositions.set(tile, { row: tile.row, col: tile.col });
      }
    }
    collapseColumns(state.grid, state.gridRows, state.gridCols, state.mask, createTile);
    const movingTiles = [];
    const fromRects = [];
    const toRects = [];
    for (let row = 0; row < state.gridRows; row += 1) {
      for (let col = 0; col < state.gridCols; col += 1) {
        const tile = state.grid[row][col];
        if (!tile) continue;
        const previous = previousPositions.get(tile);
        if (!previous) continue;
        if (previous.row !== tile.row || previous.col !== tile.col) {
          movingTiles.push(tile);
          fromRects.push(tileRect(previous.row, previous.col));
          toRects.push(tileRect(tile.row, tile.col));
        }
      }
    }
    await animateCascade(movingTiles, fromRects, toRects);
    matched = findMatches(state.grid, state.gridRows, state.gridCols);
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
  state.selected = null;
  state.inputLocked = true;

  try {
    await animateSwap(first, second);
    swapTiles(first, second);
    const matched = await resolveMatchesAnimated();
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
      grid: { ...state.config.grid },
      mask: createMask(state.config.grid.rows, state.config.grid.cols, 1),
    };
  }

  const rows = Number(board.grid.rows) || state.config.grid.rows;
  const cols = Number(board.grid.cols) || state.config.grid.cols;
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
  return {
    ...defaultConfig,
    ...config,
    grid: { ...defaultConfig.grid, ...(config.grid || {}) },
    board: { ...defaultConfig.board, ...(config.board || {}) },
    animations: { ...defaultConfig.animations, ...(config.animations || {}) },
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
