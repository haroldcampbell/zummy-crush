import {
  applyRotation,
  createGrid,
  fillGridNoMatches,
  findMatches,
  clearMatches,
  collapseGrid,
  refillGrid,
} from "./board-logic.mjs";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const resetButton = document.getElementById("reset");
const statusEl = document.getElementById("status");

const state = {
  config: null,
  tileTypes: [],
  grid: [],
  rows: 0,
  cols: 0,
  dragging: null,
  snapping: null,
  cascade: {
    active: false,
    index: 0,
  },
};

const pointerState = {
  id: null,
  startX: 0,
  startY: 0,
  axis: null,
  index: null,
  offsetPx: 0,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function getConfigUrl() {
  return new URL("../assets/config/gameplay.json", window.location.href);
}

async function loadConfig() {
  const response = await fetch(getConfigUrl());
  if (!response.ok) throw new Error("Failed to load config");
  return response.json();
}

function getActiveTileSet(config) {
  const variant = config.tileSet.active;
  return config.tileSet.variants[variant];
}

function createBoard(config) {
  const { rows, cols } = config.board;
  const tileSet = getActiveTileSet(config);
  const tileTypes = tileSet.types;
  const grid = fillGridNoMatches(rows, cols, tileTypes, {
    variant: config.tile.variant,
  });
  return { grid, tileTypes };
}

function getBoardMetrics() {
  const { board } = state.config;
  const size = Math.min(board.maxWidth, board.tileSize * state.cols + board.gap * (state.cols - 1));
  const cell = board.tileSize + board.gap;
  const boardWidth = state.cols * board.tileSize + (state.cols - 1) * board.gap;
  const boardHeight = state.rows * board.tileSize + (state.rows - 1) * board.gap;
  const padding = board.padding;
  return {
    cell,
    boardWidth,
    boardHeight,
    padding,
    canvasWidth: Math.max(boardWidth + padding * 2, size + padding * 2),
    canvasHeight: Math.max(boardHeight + padding * 2, size + padding * 2),
  };
}

function resizeCanvas() {
  const { canvasWidth, canvasHeight } = getBoardMetrics();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvasWidth * ratio);
  canvas.height = Math.floor(canvasHeight * ratio);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function boardOrigin() {
  const { padding } = getBoardMetrics();
  return { x: padding, y: padding };
}

function screenToBoard(x, y) {
  const { x: originX, y: originY } = boardOrigin();
  return { x: x - originX, y: y - originY };
}

function pickLineIndex(x, y) {
  const { cell } = getBoardMetrics();
  const col = clamp(Math.floor(x / cell), 0, state.cols - 1);
  const row = clamp(Math.floor(y / cell), 0, state.rows - 1);
  return { row, col };
}

function startDrag(event) {
  if (state.snapping || state.cascade.active) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  pointerState.id = event.pointerId;
  pointerState.startX = x;
  pointerState.startY = y;
  pointerState.axis = null;
  pointerState.index = null;
  pointerState.offsetPx = 0;
  canvas.setPointerCapture(event.pointerId);
  setStatus("Selecting line...");
}

function updateDrag(event) {
  if (pointerState.id !== event.pointerId) return;
  if (state.snapping || state.cascade.active) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const dx = x - pointerState.startX;
  const dy = y - pointerState.startY;
  const threshold = state.config.input.dragThresholdPx;

  if (!pointerState.axis) {
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      return;
    }
    pointerState.axis = Math.abs(dx) >= Math.abs(dy) ? "row" : "col";
    const boardPos = screenToBoard(pointerState.startX, pointerState.startY);
    const { row, col } = pickLineIndex(boardPos.x, boardPos.y);
    pointerState.index = pointerState.axis === "row" ? row : col;
  }

  pointerState.offsetPx = pointerState.axis === "row" ? dx : dy;
  state.dragging = {
    axis: pointerState.axis,
    index: pointerState.index,
    offsetPx: pointerState.offsetPx,
  };
  setStatus(`Rotating ${pointerState.axis} ${pointerState.index + 1}`);
}

function endDrag(event) {
  if (pointerState.id !== event.pointerId) return;
  if (state.snapping || state.cascade.active) return;

  const { cell } = getBoardMetrics();
  const axis = pointerState.axis;
  const index = pointerState.index;
  const offsetPx = pointerState.offsetPx;

  pointerState.id = null;
  pointerState.axis = null;
  pointerState.index = null;
  pointerState.offsetPx = 0;
  canvas.releasePointerCapture(event.pointerId);

  if (!axis || index === null) {
    state.dragging = null;
    setStatus("Ready");
    return;
  }

  const offsetTiles = Math.round(offsetPx / cell);
  if (offsetTiles === 0) {
    state.dragging = null;
    setStatus("Ready");
    return;
  }

  state.snapping = {
    axis,
    index,
    fromPx: offsetPx,
    toPx: offsetTiles * cell,
    offsetTiles,
    start: performance.now(),
    duration: state.config.input.snapMs,
  };
  state.dragging = null;
}

function drawTile(x, y, size, tile, config) {
  const baseFill = config.render?.tileBase || "#12110f";
  if (!tile) {
    ctx.fillStyle = baseFill;
    ctx.fillRect(x, y, size, size);
    return;
  }
  const variantMode = config.debug.forceVariant || tile.variant || config.tile.variant;
  const tileSet = getActiveTileSet(config);
  const type = tileSet.types.find((entry) => entry.id === tile.typeId) || tileSet.types[0];
  const iconScale = config.tile.iconScale;
  const iconSize = size * iconScale;
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  ctx.fillStyle = baseFill;
  ctx.fillRect(x, y, size, size);

  drawShape(type.shape, centerX, centerY, iconSize / 2, type.fill, type.stroke);

  if (variantMode === "powerup") {
    drawVariantFrame(x, y, size, config.variantStyle);
  }
}

function drawShape(shape, cx, cy, radius, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(2, radius * 0.12);
  ctx.beginPath();
  switch (shape) {
    case "diamond":
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx + radius, cy);
      ctx.lineTo(cx, cy + radius);
      ctx.lineTo(cx - radius, cy);
      ctx.closePath();
      break;
    case "triangle":
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx + radius, cy + radius);
      ctx.lineTo(cx - radius, cy + radius);
      ctx.closePath();
      break;
    case "hex": {
      const angleStep = (Math.PI * 2) / 6;
      for (let i = 0; i < 6; i += 1) {
        const angle = angleStep * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }
    case "square":
      ctx.rect(cx - radius, cy - radius, radius * 2, radius * 2);
      break;
    case "oval":
      ctx.ellipse(cx, cy, radius * 1.1, radius * 0.8, 0, 0, Math.PI * 2);
      break;
    case "star": {
      const spikes = 5;
      const outer = radius;
      const inner = radius * 0.45;
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      ctx.moveTo(cx, cy - outer);
      for (let i = 0; i < spikes; i += 1) {
        x = cx + Math.cos(rot) * outer;
        y = cy + Math.sin(rot) * outer;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * inner;
        y = cy + Math.sin(rot) * inner;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      break;
    }
    case "drop":
      ctx.moveTo(cx, cy - radius);
      ctx.quadraticCurveTo(cx + radius, cy, cx, cy + radius);
      ctx.quadraticCurveTo(cx - radius, cy, cx, cy - radius);
      ctx.closePath();
      break;
    case "circle":
    default:
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      break;
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawVariantFrame(x, y, size, style) {
  ctx.save();
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);

  if (style.badge?.enabled) {
    const badgeSize = size * 0.3;
    ctx.fillStyle = style.badge.fill;
    ctx.beginPath();
    ctx.arc(x + size - badgeSize / 2, y + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = style.badge.textColor;
    ctx.font = `bold ${badgeSize * 0.5}px Trebuchet MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(style.badge.text, x + size - badgeSize / 2, y + badgeSize / 2 + 1);
  }
  ctx.restore();
}

function drawGrid() {
  const { cell, boardWidth, boardHeight } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();

  ctx.fillStyle = state.config.render.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = state.config.render.panel;
  ctx.fillRect(originX - 6, originY - 6, boardWidth + 12, boardHeight + 12);

  const active = state.dragging || state.snapping;
  const skipAxis = active?.axis;
  const skipIndex = active?.index;

  for (let r = 0; r < state.rows; r += 1) {
    for (let c = 0; c < state.cols; c += 1) {
      if (skipAxis === "row" && skipIndex === r) continue;
      if (skipAxis === "col" && skipIndex === c) continue;
      const x = originX + c * cell;
      const y = originY + r * cell;
      drawTile(x, y, state.config.board.tileSize, state.grid[r][c], state.config);
    }
  }

  if (active) {
    drawActiveLine(active);
  }

  if (state.dragging) {
    drawLineHighlight(state.dragging.axis, state.dragging.index);
  }
}

function drawLineHighlight(axis, index) {
  const { cell, boardWidth, boardHeight } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  ctx.save();
  ctx.fillStyle = "rgba(246, 211, 106, 0.12)";
  if (axis === "row") {
    ctx.fillRect(originX, originY + index * cell, boardWidth, cell);
  } else {
    ctx.fillRect(originX + index * cell, originY, cell, boardHeight);
  }
  ctx.restore();
}

function drawActiveLine(active) {
  const { cell } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  const axis = active.axis;
  const index = active.index;
  const offsetPx = active.offsetPx;

  if (axis === "row") {
    const total = state.cols * cell;
    for (let c = 0; c < state.cols; c += 1) {
      const base = c * cell;
      const wrapped = ((base + offsetPx) % total + total) % total;
      const x = originX + wrapped;
      const y = originY + index * cell;
      drawTile(x, y, state.config.board.tileSize, state.grid[index][c], state.config);
    }
  } else if (axis === "col") {
    const total = state.rows * cell;
    for (let r = 0; r < state.rows; r += 1) {
      const base = r * cell;
      const wrapped = ((base + offsetPx) % total + total) % total;
      const x = originX + index * cell;
      const y = originY + wrapped;
      drawTile(x, y, state.config.board.tileSize, state.grid[r][index], state.config);
    }
  }
}

function step(timestamp) {
  if (state.snapping) {
    const elapsed = timestamp - state.snapping.start;
    const t = clamp(elapsed / state.snapping.duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const offsetPx = state.snapping.fromPx + (state.snapping.toPx - state.snapping.fromPx) * eased;
    state.snapping.offsetPx = offsetPx;

    if (t >= 1) {
      const { axis, index, offsetTiles } = state.snapping;
      state.grid = applyRotation(state.grid, axis, index, offsetTiles);
      state.snapping = null;
      setStatus("Ready");
      startCascadeIfNeeded();
    }
  }

  drawGrid();
  requestAnimationFrame(step);
}

function startCascadeIfNeeded() {
  if (!state.config.features?.matchesEnabled) return;
  if (state.cascade.active) return;
  const matches = findMatches(state.grid);
  if (matches.size === 0) return;
  state.cascade.active = true;
  state.cascade.index = 0;
  resolveCascade(matches);
}

function resolveCascade(matchSet) {
  const tileTypes = getActiveTileSet(state.config).types;
  const variant = state.config.tile.variant;
  state.grid = clearMatches(state.grid, matchSet);
  drawGrid();
  setTimeout(() => {
    state.grid = collapseGrid(state.grid);
    drawGrid();
    setTimeout(() => {
      state.grid = refillGrid(state.grid, tileTypes, { variant });
      drawGrid();
      const nextMatches = findMatches(state.grid);
      if (nextMatches.size > 0) {
        state.cascade.index += 1;
        resolveCascade(nextMatches);
      } else {
        state.cascade.active = false;
      }
    }, 180);
  }, 180);
}

function resetBoard() {
  const { grid, tileTypes } = createBoard(state.config);
  state.grid = grid;
  state.tileTypes = tileTypes;
  setStatus("Ready");
}

async function init() {
  state.config = await loadConfig();
  state.rows = state.config.board.rows;
  state.cols = state.config.board.cols;
  resetBoard();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("pointerdown", startDrag);
  canvas.addEventListener("pointermove", updateDrag);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  resetButton.addEventListener("click", resetBoard);
  requestAnimationFrame(step);
}

init().catch((error) => {
  console.error(error);
  setStatus("Failed to load config");
});
