import {
  applyRotation,
  createGrid,
  fillGridNoMatches,
  findMatches,
  findMatchRuns,
  clearMatches,
  collapseGrid,
  refillGrid,
} from "./board-logic.mjs";
import { isInputLocked } from "./input-lock.mjs";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const resetButton = document.getElementById("reset");
const exportButton = document.getElementById("export-state");
const statusEl = document.getElementById("status");
const scoreValueEl = document.getElementById("score-value");
const helpButton = document.getElementById("help-button");
const helpModal = document.getElementById("help-modal");
const helpClose = document.getElementById("help-close");
const helpContent = document.getElementById("help-content");

let swRegistration = null;

const TAP_SCALE_FALLBACK = {
  scaleDown: 0,
  scaleDurationMs: 0,
};

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
  now: 0,
  score: 0,
  preselect: null,
  lastFrameTime: 0,
  vfx: {
    particles: [],
    dropped: 0,
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

function updateScoreDisplay() {
  if (scoreValueEl) scoreValueEl.textContent = state.score.toLocaleString("en-US");
}

function buildHelpContent() {
  const scoring = state.config.scoring || {};
  const tileValues = scoring.tileValues || {};
  const bonusByLength = scoring.bonusByLength || {};
  const rows = Object.entries(tileValues)
    .map(([shape, value]) => `<li><strong>${shape}</strong>: ${value} points</li>`)
    .join("");
  const bonuses = Object.entries(bonusByLength)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([length, bonus]) => `<li>Match ${length}: +${bonus} bonus</li>`)
    .join("");
  return `
    <div><strong>Score Basics</strong></div>
    <div>Every tile in a match adds its base value.</div>
    <ul>${rows || "<li>No tile values configured</li>"}</ul>
    <div><strong>Match Bonuses</strong></div>
    <ul>${bonuses || "<li>No bonuses configured</li>"}</ul>
    <div class="note">Longer matches stack base points plus the listed bonus.</div>
  `;
}

function openHelp() {
  if (!helpModal) return;
  if (helpContent) helpContent.innerHTML = buildHelpContent();
  helpModal.hidden = false;
}

function closeHelp() {
  if (!helpModal) return;
  helpModal.hidden = true;
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
  if (isInputLocked({ snapping: state.snapping, cascadeActive: state.cascade.active })) return;
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
  const boardPos = screenToBoard(pointerState.startX, pointerState.startY);
  const { row, col } = pickLineIndex(boardPos.x, boardPos.y);
  const tile = state.grid[row]?.[col];
  if (tile) tile.tapImpactStart = state.now;
  state.preselect = { row, col, startedAt: state.now };
  setStatus("Selecting line...");
}

function updateDrag(event) {
  if (pointerState.id !== event.pointerId) return;
  if (isInputLocked({ snapping: state.snapping, cascadeActive: state.cascade.active })) return;
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
    state.preselect = null;
    const boardPos = screenToBoard(pointerState.startX, pointerState.startY);
    const { row, col } = pickLineIndex(boardPos.x, boardPos.y);
    pointerState.index = pointerState.axis === "row" ? row : col;
    if (pointerState.axis === "row") {
      for (let c = 0; c < state.cols; c += 1) {
        const tile = state.grid[pointerState.index]?.[c];
        if (tile) tile.tapImpactStart = state.now;
      }
    } else {
      for (let r = 0; r < state.rows; r += 1) {
        const tile = state.grid[r]?.[pointerState.index];
        if (tile) tile.tapImpactStart = state.now;
      }
    }
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
  if (isInputLocked({ snapping: state.snapping, cascadeActive: state.cascade.active })) return;
  state.preselect = null;

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
  const variantMode =
    config.debug.forceVariant ||
    (tile.powerUp ? "powerup" : tile.variant) ||
    config.tile.variant;
  const tileSet = getActiveTileSet(config);
  const type = tileSet.types.find((entry) => entry.id === tile.typeId) || tileSet.types[0];
  const powerUpStyle = tile.powerUp
    ? config.powerUps?.visuals?.styles?.[tile.powerUp.type] || null
    : null;
  const shape = powerUpStyle?.shape || type.shape;
  const fill = powerUpStyle?.fill || type.fill;
  const stroke = powerUpStyle?.stroke || type.stroke;
  const iconScale = config.tile.iconScale;
  const iconSize = size * iconScale;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const tapConfig = config.physics?.tap || TAP_SCALE_FALLBACK;
  const scale = computeTapScale(state.now, tile.tapImpactStart, tapConfig.scaleDurationMs, tapConfig.scaleDown);
  const rotationConfig = config.powerUps?.visuals?.rotation;
  const shouldRotate = tile.powerUp && rotationConfig?.enabled;
  const rotationRadians = shouldRotate
    ? (state.now * (rotationConfig.radiansPerMs || 0)) % (Math.PI * 2)
    : 0;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);
  ctx.fillStyle = baseFill;
  ctx.fillRect(x, y, size, size);

  if (shouldRotate) {
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRadians);
    ctx.translate(-centerX, -centerY);
  }
  drawShape(shape, centerX, centerY, iconSize / 2, fill, stroke);

  if (tile.powerUp) {
    const dotConfig = config.powerUps?.visuals?.coreDot;
    const dotTypes = dotConfig?.types || [];
    if (dotConfig?.enabled && dotTypes.includes(tile.powerUp.type)) {
      const colors = dotConfig.colors || [];
      const cycleMs = Math.max(dotConfig.cycleMs || 0, 1);
      const sizeRatio = dotConfig.sizeRatio || 0.2;
      const dotSize = iconSize * sizeRatio;
      const colorIndex = colors.length
        ? Math.floor((state.now / cycleMs) % colors.length)
        : 0;
      const dotColor = colors[colorIndex] || "#fff";
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (variantMode === "powerup") {
    const style = {
      ...config.variantStyle,
      badge: {
        ...config.variantStyle.badge,
        enabled: false,
      },
    };
    drawVariantFrame(x, y, size, style);
  }
  ctx.restore();
}

function getTileFillColor(tile, config) {
  if (!tile) return "#fff";
  const tileSet = getActiveTileSet(config);
  const type = tileSet.types.find((entry) => entry.id === tile.typeId) || tileSet.types[0];
  const powerUpStyle = tile.powerUp
    ? config.powerUps?.visuals?.styles?.[tile.powerUp.type] || null
    : null;
  return powerUpStyle?.fill || type.fill;
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
  const animatedTiles = state.animation?.tileIndex || new Map();
  const tilesToDraw = [];

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
      const tile = state.grid[r][c];
      if (tile && animatedTiles.has(tile)) continue;
      const x = originX + c * cell;
      const y = originY + r * cell;
      if (tile) tilesToDraw.push({ tile, x, y });
    }
  }

  if (active) {
    drawActiveLine(active);
  }

  if (state.dragging) {
    drawLineHighlight(state.dragging.axis, state.dragging.index);
  } else if (state.preselect && !state.snapping) {
    const affordance = state.config.input?.affordance;
    if (affordance?.enabled) {
      const color = affordance.color || "#f6d36a";
      const opacity = Number.isFinite(affordance.opacity) ? affordance.opacity : 0.08;
      drawLineHighlight("row", state.preselect.row, { color, opacity });
      if (affordance.showBothAxis) {
        drawLineHighlight("col", state.preselect.col, { color, opacity });
      }
    }
  }

  if (state.animation?.tiles) {
    state.animation.tiles.forEach((tile) => {
      const entry = state.animation.tileIndex.get(tile);
      if (!entry) return;
      const progress = state.animation.progresses[entry.index] ?? 0;
      const x = entry.from.x + (entry.to.x - entry.from.x) * progress;
      const y = entry.from.y + (entry.to.y - entry.from.y) * progress;
      tilesToDraw.push({ tile, x, y });
    });
  }

  const offsets = computeRepulsionOffsets(
    tilesToDraw,
    state.config.board.tileSize,
    state.config.physics
  );
  tilesToDraw.forEach((entry) => {
    const offset = offsets.get(entry.tile) || { x: 0, y: 0 };
    drawTile(
      entry.x + offset.x,
      entry.y + offset.y,
      state.config.board.tileSize,
      entry.tile,
      state.config
    );
  });

  if (
    state.config.debug?.matchPreview &&
    !state.dragging &&
    !state.snapping &&
    !state.cascade.active
  ) {
    drawMatchPreview();
  }

  drawParticles();

  if (state.config.debug?.vfxStats) {
    drawVfxStats();
  }
}

function drawMatchPreview() {
  const matches = findMatches(state.grid);
  if (!matches.size) return;
  const { cell } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  ctx.save();
  ctx.strokeStyle = "rgba(90, 76, 67, 0.45)";
  ctx.lineWidth = 2;
  matches.forEach((key) => {
    const [row, col] = key.split(",").map(Number);
    const x = originX + col * cell + 2;
    const y = originY + row * cell + 2;
    ctx.strokeRect(x, y, cell - 4, cell - 4);
  });
  ctx.restore();
}

function drawVfxStats() {
  ctx.save();
  ctx.fillStyle = "rgba(34, 34, 34, 0.7)";
  ctx.font = "11px Trebuchet MS";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  const label = `particles: ${state.vfx.particles.length} (dropped ${state.vfx.dropped})`;
  ctx.fillText(label, canvas.width - 8, 8);
  ctx.restore();
}

function getCellCenter(row, col) {
  const { cell } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  return {
    x: originX + col * cell + state.config.board.tileSize / 2,
    y: originY + row * cell + state.config.board.tileSize / 2,
  };
}

function emitMatchClearVfx(runs) {
  const vfx = state.config.vfx?.matchClear;
  if (!vfx?.enabled) return;
  const { cell } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  runs.forEach((run) => {
    const centerCell = run.cells[Math.floor(run.cells.length / 2)];
    const centerTile = state.grid[centerCell.row]?.[centerCell.col];
    const center = {
      x: originX + centerCell.col * cell + state.config.board.tileSize / 2,
      y: originY + centerCell.row * cell + state.config.board.tileSize / 2,
    };
    const color = getTileFillColor(centerTile, state.config);
    const burstConfig = {
      count: vfx.burstCount,
      lifeMs: vfx.burstLifeMs,
      sizePx: vfx.burstSizePx,
      speedPxPerMs: vfx.burstSpeedPxPerMs,
      spreadRadians: Math.PI * 2,
      colorPalette: vfx.burstColorMode === "tile" ? [color] : undefined,
    };
    spawnParticles(center, burstConfig);
    if (vfx.directional?.enabled && run.length >= 4) {
      const dirConfig = {
        count: Math.max(4, Math.floor((vfx.burstCount || 10) / 2)),
        lifeMs: vfx.burstLifeMs,
        sizePx: vfx.burstSizePx,
        speedPxPerMs: vfx.directional.speedPxPerMs ?? vfx.burstSpeedPxPerMs,
        spreadRadians: vfx.directional.spreadRadians ?? 0.8,
        colorPalette: vfx.burstColorMode === "tile" ? [color] : undefined,
      };
      if (run.orientation === "row") {
        spawnParticles(center, { ...dirConfig, startAngle: 0 });
        spawnParticles(center, { ...dirConfig, startAngle: Math.PI });
      } else {
        spawnParticles(center, { ...dirConfig, startAngle: -Math.PI / 2 });
        spawnParticles(center, { ...dirConfig, startAngle: Math.PI / 2 });
      }
    }
  });
}

function emitPowerUpCreateVfx(position, powerUpType) {
  const vfx = state.config.vfx?.powerUp;
  if (!vfx) return;
  const tile = state.grid[position.row]?.[position.col];
  const color = getTileFillColor(tile, state.config);
  spawnParticles(getCellCenter(position.row, position.col), {
    count: vfx.createBurstCount,
    lifeMs: vfx.createBurstLifeMs,
    sizePx: vfx.explosionSizePx ?? 3,
    speedPxPerMs: (vfx.explosionSpeedPxPerMs ?? 0.2) * 0.6,
    spreadRadians: Math.PI * 2,
    colorPalette: [color],
  });
}

function emitPowerUpActivateVfx(position, powerUpType) {
  const vfx = state.config.vfx?.powerUp;
  if (!vfx) return;
  const tile = state.grid[position.row]?.[position.col];
  const baseColor = getTileFillColor(tile, state.config);
  const colors = ["void", "tornado"].includes(powerUpType)
    ? vfx.fireColors || [baseColor]
    : [baseColor];
  const center = getCellCenter(position.row, position.col);
  spawnParticles(center, {
    count: vfx.activateBurstCount,
    lifeMs: vfx.activateBurstLifeMs,
    sizePx: vfx.explosionSizePx ?? 3,
    speedPxPerMs: vfx.explosionSpeedPxPerMs ?? 0.22,
    spreadRadians: Math.PI * 2,
    colorPalette: colors,
  });
  if (["void", "tornado"].includes(powerUpType)) {
    spawnParticles(center, {
      count: vfx.explosionCount,
      lifeMs: vfx.explosionLifeMs,
      sizePx: vfx.explosionSizePx ?? 4,
      speedPxPerMs: vfx.explosionSpeedPxPerMs ?? 0.24,
      spreadRadians: Math.PI * 2,
      colorPalette: colors,
    });
  }
}

function emitPowerUpTrailVfx(position, powerUpType) {
  const vfx = state.config.vfx?.powerUp;
  if (!vfx) return;
  const colors = vfx.fireColors || ["#fff"];
  spawnParticles(getCellCenter(position.row, position.col), {
    count: Math.max(2, Math.floor((vfx.activateBurstCount || 12) / 6)),
    lifeMs: vfx.trailLifeMs,
    sizePx: vfx.trailSizePx,
    speedPxPerMs: vfx.trailSpeedPxPerMs,
    spreadRadians: Math.PI * 2,
    colorPalette: colors,
  });
}

function drawLineHighlight(axis, index, options = {}) {
  const { cell, boardWidth, boardHeight } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  const color = options.color || "#f6d36a";
  const opacity = Number.isFinite(options.opacity) ? options.opacity : 0.12;
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
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
  const deltaMs = state.lastFrameTime ? timestamp - state.lastFrameTime : 16;
  state.lastFrameTime = timestamp;
  state.now = timestamp;
  updateAnimation(timestamp);
  updateParticles(deltaMs);
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
      updateStateExport();
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

function capturePositions(grid) {
  const map = new Map();
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[r].length; c += 1) {
      const tile = grid[r][c];
      if (tile && tile.typeId) {
        map.set(tile, { row: r, col: c });
      }
    }
  }
  return map;
}

function getCascadeStaggerMs() {
  const staggerConfig = state.config.animations?.cascadeStaggerMs || { min: 0, max: 0 };
  const min = Math.min(staggerConfig.min ?? 0, staggerConfig.max ?? 0);
  const max = Math.max(staggerConfig.min ?? 0, staggerConfig.max ?? 0);
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}

function computeFallDuration(fromRect, toRect) {
  const distance = Math.abs(toRect.y - fromRect.y);
  const gravity = state.config.physics?.gravityPxPerMs ?? 0;
  const base = state.config.animations?.cascadeMs ?? 180;
  if (gravity <= 0) return base;
  return Math.max(base, distance / gravity);
}

function computeSpacingTime() {
  const gravity = state.config.physics?.gravityPxPerMs ?? 0;
  const spacingGap = state.config.physics?.cascadeSpacingGapMultiplier ?? 2;
  if (gravity <= 0) return getCascadeStaggerMs();
  const spacingPx = state.config.board.gap * spacingGap;
  return spacingPx / gravity;
}

function buildAnimation(tiles, fromPositions, toPositions, duration) {
  if (!tiles.length) return Promise.resolve();
  const { cell } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  const tileIndex = new Map();
  const from = [];
  const to = [];
  const progresses = [];
  const delays = [];
  const durations = [];
  const moves = [];

  tiles.forEach((tile) => {
    const fromPos = fromPositions.get(tile);
    const toPos = toPositions.get(tile);
    if (!fromPos || !toPos) return;
    moves.push({ tile, from: fromPos, to: toPos });
  });

  moves.sort((a, b) => {
    if (a.to.col !== b.to.col) return a.to.col - b.to.col;
    return b.from.row - a.from.row;
  });

  const perColumnTime = new Map();
  const spacingTimeMs = computeSpacingTime();
  moves.forEach((move) => {
    const index = from.length;
    const fromRect = {
      x: originX + move.from.col * cell,
      y: originY + move.from.row * cell,
    };
    const toRect = {
      x: originX + move.to.col * cell,
      y: originY + move.to.row * cell,
    };
    from.push(fromRect);
    to.push(toRect);
    progresses.push(0);
    tileIndex.set(move.tile, { index, from: fromRect, to: toRect });
    const currentTime = perColumnTime.get(move.to.col) || 0;
    delays.push(currentTime);
    const staggerMs = getCascadeStaggerMs();
    perColumnTime.set(move.to.col, currentTime + Math.max(spacingTimeMs, staggerMs));
    durations.push(computeFallDuration(fromRect, toRect));
  });

  return new Promise((resolve) => {
    state.animation = {
      tiles: moves.map((move) => move.tile),
      from,
      to,
      progresses,
      tileIndex,
      delays,
      durations,
      start: performance.now(),
      duration,
      onComplete: resolve,
    };
  });
}

function buildSpawnAnimation(spawnedTiles, toPositions, duration) {
  if (!spawnedTiles.length) return Promise.resolve();
  const { cell } = getBoardMetrics();
  const { x: originX, y: originY } = boardOrigin();
  const tileIndex = new Map();
  const from = [];
  const to = [];
  const progresses = [];
  const delays = [];
  const durations = [];
  const slots = [];

  spawnedTiles.forEach((tile) => {
    const toPos = toPositions.get(tile);
    if (!toPos) return;
    slots.push({ tile, to: toPos });
  });

  slots.sort((a, b) => {
    if (a.to.col !== b.to.col) return a.to.col - b.to.col;
    return b.to.row - a.to.row;
  });

  const perColumnTime = new Map();
  const perColumnCount = new Map();
  const spacingTimeMs = computeSpacingTime();
  slots.forEach((slot) => {
    const index = from.length;
    const count = perColumnCount.get(slot.to.col) || 0;
    perColumnCount.set(slot.to.col, count + 1);
    const spawnRow = -1 - count;
    const fromRect = {
      x: originX + slot.to.col * cell,
      y: originY + spawnRow * cell,
    };
    const toRect = {
      x: originX + slot.to.col * cell,
      y: originY + slot.to.row * cell,
    };
    from.push(fromRect);
    to.push(toRect);
    progresses.push(0);
    tileIndex.set(slot.tile, { index, from: fromRect, to: toRect });
    const currentTime = perColumnTime.get(slot.to.col) || 0;
    delays.push(currentTime);
    const staggerMs = getCascadeStaggerMs();
    perColumnTime.set(slot.to.col, currentTime + Math.max(spacingTimeMs, staggerMs));
    durations.push(computeFallDuration(fromRect, toRect));
  });

  return new Promise((resolve) => {
    state.animation = {
      tiles: slots.map((slot) => slot.tile),
      from,
      to,
      progresses,
      tileIndex,
      delays,
      durations,
      start: performance.now(),
      duration,
      onComplete: resolve,
    };
  });
}

function updateAnimation(timestamp) {
  const anim = state.animation;
  if (!anim) return;
  const physics = state.config.physics || {};
  let completed = 0;
  for (let i = 0; i < anim.tiles.length; i += 1) {
    const delay = anim.delays ? anim.delays[i] : 0;
    const duration = anim.durations ? anim.durations[i] : anim.duration;
    const localElapsed = timestamp - (anim.start + delay);
    const linear = Math.min(Math.max(localElapsed / duration, 0), 1);
    anim.progresses[i] = easeCascade(
      linear,
      physics.bounceElasticity,
      physics.collisionDecel
    );
    if (linear >= 1) completed += 1;
  }
  if (completed === anim.tiles.length) {
    const callback = anim.onComplete;
    state.animation = null;
    if (callback) callback();
  }
}

function easeCascade(t, elasticity, decel) {
  const clamped = Math.min(Math.max(t, 0), 1);
  const decelFactor = Math.min(Math.max(decel ?? 0, 0), 1);
  const exponent = 2 + decelFactor * 2;
  const base = 1 - Math.pow(1 - clamped, exponent);
  if (!elasticity || elasticity <= 0) return base;
  const wobble =
    Math.sin(clamped * Math.PI * 2) * (1 - clamped) * Math.min(elasticity, 1) * 0.12;
  return Math.min(Math.max(base - wobble, 0), 1);
}

function scoreMatches(runs, grid) {
  const scoring = state.config.scoring || {};
  const tileValues = scoring.tileValues || {};
  const bonusByLength = scoring.bonusByLength || {};
  let points = 0;
  runs.forEach((run) => {
    run.cells.forEach((cell) => {
      const tile = grid[cell.row]?.[cell.col];
      const baseValue = tileValues[tile?.typeId] ?? 0;
      points += baseValue;
    });
    const bonus = bonusByLength[String(run.length)] ?? 0;
    points += bonus;
  });
  return points;
}

function computeTapScale(now, tapStart, durationMs, scaleDown) {
  if (!tapStart || durationMs <= 0 || scaleDown <= 0) return 1;
  const elapsed = now - tapStart;
  if (elapsed >= durationMs) return 1;
  const progress = Math.min(Math.max(elapsed / durationMs, 0), 1);
  return 1 - scaleDown * (1 - progress);
}

function computeRepulsionOffsets(entries, tileSize, physics = {}) {
  const offsets = new Map();
  entries.forEach((entry) => offsets.set(entry.tile, { x: 0, y: 0 }));
  if (!physics.enabled) return offsets;

  const repulsion = physics.repulsion || { radius: 0, strength: 0 };
  const effectiveRadius = tileSize + repulsion.radius;
  const maxOffset = Math.max(repulsion.strength, 0);

  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const a = entries[i];
      const b = entries[j];
      const ax = a.x + tileSize / 2;
      const ay = a.y + tileSize / 2;
      const bx = b.x + tileSize / 2;
      const by = b.y + tileSize / 2;
      const dx = ax - bx;
      const dy = ay - by;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) continue;
      const overlap = effectiveRadius - dist;
      if (overlap <= 0) continue;

      const strength = repulsion.strength;
      const push = (overlap / effectiveRadius) * strength;
      const nx = dx / dist;
      const ny = dy / dist;
      const offsetA = offsets.get(a.tile);
      const offsetB = offsets.get(b.tile);
      offsetA.x += nx * push;
      offsetA.y += ny * push;
      offsetB.x -= nx * push;
      offsetB.y -= ny * push;
    }
  }

  for (const [tile, offset] of offsets.entries()) {
    const magnitude = Math.hypot(offset.x, offset.y);
    if (magnitude > maxOffset && magnitude > 0) {
      const scale = maxOffset / magnitude;
      offset.x *= scale;
      offset.y *= scale;
    }
    offsets.set(tile, offset);
  }
  return offsets;
}

function spawnParticles(origin, overrides = {}) {
  const vfx = state.config.vfx || {};
  if (vfx.enabled === false) return;
  const defaults = vfx.default || {};
  const count = overrides.count ?? defaults.count ?? 0;
  const maxParticles = vfx.maxParticles ?? 0;
  const colors = overrides.colorPalette || defaults.colorPalette || ["#fff"];
  const lifeMs = overrides.lifeMs ?? defaults.lifeMs ?? 600;
  const sizePx = overrides.sizePx ?? defaults.sizePx ?? 3;
  const speed = overrides.speedPxPerMs ?? defaults.speedPxPerMs ?? 0.15;
  const spread = overrides.spreadRadians ?? defaults.spreadRadians ?? Math.PI * 2;
  const gravity = overrides.gravityPxPerMs ?? vfx.gravityPxPerMs ?? 0;
  const alphaFalloff = overrides.alphaFalloff ?? vfx.alphaFalloff ?? 0;
  const startAngle = overrides.startAngle ?? -Math.PI / 2;

  for (let i = 0; i < count; i += 1) {
    if (state.vfx.particles.length >= maxParticles) {
      state.vfx.dropped += 1;
      break;
    }
    const angle = startAngle + (Math.random() - 0.5) * spread;
    const velocity = speed * (0.6 + Math.random() * 0.8);
    const color = colors[Math.floor(Math.random() * colors.length)] || "#fff";
    state.vfx.particles.push({
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      lifeMs,
      ageMs: 0,
      sizePx: sizePx * (0.7 + Math.random() * 0.6),
      color,
      gravity,
      alphaFalloff,
    });
  }
}

function updateParticles(deltaMs) {
  const particles = state.vfx.particles;
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.ageMs += deltaMs;
    if (p.ageMs >= p.lifeMs) {
      particles.splice(i, 1);
      continue;
    }
    p.vy += p.gravity * deltaMs;
    p.x += p.vx * deltaMs;
    p.y += p.vy * deltaMs;
  }
}

function drawParticles() {
  const particles = state.vfx.particles;
  if (!particles.length) return;
  ctx.save();
  particles.forEach((p) => {
    const lifeRatio = Math.min(Math.max(p.ageMs / p.lifeMs, 0), 1);
    let alpha = 1 - lifeRatio;
    if (p.alphaFalloff) {
      alpha = Math.max(0, alpha - p.alphaFalloff * p.ageMs);
    }
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.sizePx / 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPowerUpMatchId(tile, powerUpType, config) {
  if (!tile || !powerUpType) return null;
  const rules = config.powerUps?.matchRules || {};
  const colorAgnostic = rules.colorAgnosticTypes || [];
  if (colorAgnostic.includes(powerUpType)) return powerUpType;
  return `${powerUpType}:${tile.typeId}`;
}

function applyPowerUp(tile, powerUpType, config, position) {
  if (!tile) return;
  tile.powerUp = { type: powerUpType };
  tile.variant = "powerup";
  tile.matchId = getPowerUpMatchId(tile, powerUpType, config);
  if (position) {
    emitPowerUpCreateVfx(position, powerUpType);
  }
}

function buildAreaClearSet(centerRow, centerCol, radius) {
  const clearSet = new Set();
  for (let r = centerRow - radius; r <= centerRow + radius; r += 1) {
    for (let c = centerCol - radius; c <= centerCol + radius; c += 1) {
      if (r < 0 || c < 0 || r >= state.rows || c >= state.cols) continue;
      const tile = state.grid[r]?.[c];
      if (tile) clearSet.add(`${r},${c}`);
    }
  }
  return clearSet;
}

function scoreClearSet(clearSet, multiplier = 1) {
  const scoring = state.config.scoring || {};
  const tileValues = scoring.tileValues || {};
  let points = 0;
  clearSet.forEach((key) => {
    const [row, col] = key.split(",").map(Number);
    const tile = state.grid[row]?.[col];
    const baseValue = tileValues[tile?.typeId] ?? 0;
    points += baseValue * multiplier;
  });
  return Math.round(points);
}

async function applyClearAndRefill(clearSet, tileTypes, variant, cascadeDelay) {
  if (!clearSet.size) return;
  state.grid = clearMatches(state.grid, clearSet);
  drawGrid();
  await delay(cascadeDelay);
  const preCollapsePositions = capturePositions(state.grid);
  state.grid = collapseGrid(state.grid);
  const postCollapsePositions = capturePositions(state.grid);
  const movedTiles = Array.from(postCollapsePositions.keys()).filter((tile) => {
    const from = preCollapsePositions.get(tile);
    const to = postCollapsePositions.get(tile);
    return from && to && (from.row !== to.row || from.col !== to.col);
  });
  await buildAnimation(movedTiles, preCollapsePositions, postCollapsePositions, cascadeDelay);
  const preRefillGrid = state.grid.map((row) => row.slice());
  state.grid = refillGrid(state.grid, tileTypes, { variant });
  const postRefillPositions = capturePositions(state.grid);
  const spawnedTiles = [];
  for (let r = 0; r < preRefillGrid.length; r += 1) {
    for (let c = 0; c < preRefillGrid[r].length; c += 1) {
      const cell = preRefillGrid[r][c];
      if (!cell || !cell.typeId) {
        const tile = state.grid[r][c];
        if (tile) spawnedTiles.push(tile);
      }
    }
  }
  await buildSpawnAnimation(spawnedTiles, postRefillPositions, cascadeDelay);
  updateStateExport();
}

function pickTornadoStep(position) {
  const directions = [
    { dr: 1, dc: 0 },
    { dr: -1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 0, dc: -1 },
  ];
  const options = directions.filter((dir) => {
    const nextRow = position.row + dir.dr;
    const nextCol = position.col + dir.dc;
    return nextRow >= 0 && nextRow < state.rows && nextCol >= 0 && nextCol < state.cols;
  });
  if (!options.length) return position;
  const choice = options[Math.floor(Math.random() * options.length)];
  return { row: position.row + choice.dr, col: position.col + choice.dc };
}

async function runVoidEffect(origin, tileTypes, variant, cascadeDelay, config) {
  const durationMs = config.durationMs ?? 3000;
  const tickMs = config.tickMs ?? 240;
  const radius = config.radius ?? 1;
  const scoreMultiplier = config.scoreMultiplier ?? 1;
  const endTime = performance.now() + durationMs;
  while (performance.now() < endTime) {
    const start = performance.now();
    const clearSet = buildAreaClearSet(origin.row, origin.col, radius);
    if (clearSet.size) {
      state.score += scoreClearSet(clearSet, scoreMultiplier);
      updateScoreDisplay();
      await applyClearAndRefill(clearSet, tileTypes, variant, cascadeDelay);
    }
    const elapsed = performance.now() - start;
    const waitMs = tickMs - elapsed;
    if (waitMs > 0) await delay(waitMs);
  }
}

async function runTornadoEffect(origin, tileTypes, variant, cascadeDelay, config) {
  const durationMs = config.durationMs ?? 3000;
  const stepMs = config.stepMs ?? 220;
  const clearRadius = config.clearRadius ?? 0;
  const scoreMultiplier = config.scoreMultiplier ?? 1;
  const endTime = performance.now() + durationMs;
  let position = { ...origin };
  while (performance.now() < endTime) {
    const start = performance.now();
    const clearSet = buildAreaClearSet(position.row, position.col, clearRadius);
    if (clearSet.size) {
      state.score += scoreClearSet(clearSet, scoreMultiplier);
      updateScoreDisplay();
      await applyClearAndRefill(clearSet, tileTypes, variant, cascadeDelay);
    }
    emitPowerUpTrailVfx(position, "tornado");
    position = pickTornadoStep(position);
    const elapsed = performance.now() - start;
    const waitMs = stepMs - elapsed;
    if (waitMs > 0) await delay(waitMs);
  }
}

async function resolveCascade(matchSet) {
  const animations = state.config.animations || {};
  const matchDelay = animations.matchResolveMs ?? 120;
  const cascadeDelay = animations.cascadeMs ?? 180;
  const tileTypes = getActiveTileSet(state.config).types;
  const variant = state.config.tile.variant;
  const runs = findMatchRuns(state.grid);
  const powerUps = state.config.powerUps || {};
  const clearSet = new Set(matchSet);
  const reservedSpawnCells = new Set();
  const powerUpCells = [];
  const powerUpActivations = [];
  const match4Type = powerUps.match4?.type || "square";
  const match5Type = powerUps.match5?.type || "circle";
  const upgradeConfig = powerUps.upgrades || {};
  const upgradeMinRun = upgradeConfig.minRun ?? 4;
  const knownPowerUps = new Set([match4Type, match5Type, "void", "tornado"]);

  matchSet.forEach((key) => {
    const [row, col] = key.split(",").map(Number);
    const tile = state.grid[row]?.[col];
    if (tile?.powerUp) powerUpCells.push({ row, col, tile });
  });

  const selectSpawnCell = (run) => run.cells[Math.floor(run.cells.length / 2)];

  runs.forEach((run) => {
    const matchId = run.matchId || run.typeId;
    const matchType = matchId?.includes(":") ? matchId.split(":")[0] : matchId;
    const runPowerUpType = knownPowerUps.has(matchType) ? matchType : null;
    if (run.length >= upgradeMinRun && runPowerUpType === match4Type && upgradeConfig.squareToVoid) {
      const spawnCell = selectSpawnCell(run);
      const spawnKey = `${spawnCell.row},${spawnCell.col}`;
      if (!reservedSpawnCells.has(spawnKey) && powerUps.void?.enabled !== false) {
        const tile = state.grid[spawnCell.row][spawnCell.col];
        if (tile) {
          applyPowerUp(tile, "void", state.config, spawnCell);
          reservedSpawnCells.add(spawnKey);
          clearSet.delete(spawnKey);
        }
      }
      return;
    }
    if (run.length >= upgradeMinRun && runPowerUpType === match5Type && upgradeConfig.circleToTornado) {
      const spawnCell = selectSpawnCell(run);
      const spawnKey = `${spawnCell.row},${spawnCell.col}`;
      if (!reservedSpawnCells.has(spawnKey) && powerUps.tornado?.enabled !== false) {
        const tile = state.grid[spawnCell.row][spawnCell.col];
        if (tile) {
          applyPowerUp(tile, "tornado", state.config, spawnCell);
          reservedSpawnCells.add(spawnKey);
          clearSet.delete(spawnKey);
        }
      }
      return;
    }
    if (run.length === 4 && powerUps.match4?.enabled !== false && !runPowerUpType) {
      const spawnCell = selectSpawnCell(run);
      const spawnKey = `${spawnCell.row},${spawnCell.col}`;
      if (!reservedSpawnCells.has(spawnKey)) {
        const tile = state.grid[spawnCell.row][spawnCell.col];
        if (tile) {
          applyPowerUp(tile, match4Type, state.config, spawnCell);
          reservedSpawnCells.add(spawnKey);
          clearSet.delete(spawnKey);
        }
      }
    }
    if (run.length === 5 && powerUps.match5?.enabled !== false && !runPowerUpType) {
      const spawnCell = selectSpawnCell(run);
      const spawnKey = `${spawnCell.row},${spawnCell.col}`;
      if (!reservedSpawnCells.has(spawnKey)) {
        const tile = state.grid[spawnCell.row][spawnCell.col];
        if (tile) {
          applyPowerUp(tile, match5Type, state.config, spawnCell);
          reservedSpawnCells.add(spawnKey);
          clearSet.delete(spawnKey);
        }
      }
    }
  });

  if (powerUps.enabled !== false) {
    powerUpCells.forEach(({ row, col, tile }) => {
      const key = `${row},${col}`;
      if (!clearSet.has(key)) return;
      if (tile.powerUp?.type === "void" || tile.powerUp?.type === "tornado") {
        powerUpActivations.push({ row, col, type: tile.powerUp.type });
      }
    });
  }

  state.score += scoreMatches(runs, state.grid);
  updateScoreDisplay();
  emitMatchClearVfx(runs);
  await delay(matchDelay);
  await applyClearAndRefill(clearSet, tileTypes, variant, cascadeDelay);

  if (powerUpActivations.length) {
    for (const activation of powerUpActivations) {
      if (activation.type === "void") {
        emitPowerUpActivateVfx(activation, "void");
        await runVoidEffect(activation, tileTypes, variant, cascadeDelay, powerUps.void || {});
      } else if (activation.type === "tornado") {
        emitPowerUpActivateVfx(activation, "tornado");
        await runTornadoEffect(
          activation,
          tileTypes,
          variant,
          cascadeDelay,
          powerUps.tornado || {}
        );
      }
    }
  }
  const nextMatches = findMatches(state.grid);
  if (nextMatches.size > 0) {
    state.cascade.index += 1;
    await resolveCascade(nextMatches);
  } else {
    state.cascade.active = false;
    updateStateExport();
  }
}

function resetBoard() {
  const { grid, tileTypes } = createBoard(state.config);
  state.grid = grid;
  state.tileTypes = tileTypes;
  state.score = 0;
  updateScoreDisplay();
  setStatus("Ready");
  updateStateExport();
}

function buildExportState() {
  return {
    timestamp: new Date().toISOString(),
    rows: state.rows,
    cols: state.cols,
    cascade: { ...state.cascade },
    grid: state.grid.map((row) =>
      row.map((cell) =>
        cell && cell.typeId
          ? {
              typeId: cell.typeId,
              variant: cell.variant,
              powerUp: cell.powerUp || null,
            }
          : null
      )
    ),
    config: {
      board: state.config.board,
      tile: state.config.tile,
      tileSet: state.config.tileSet,
      render: state.config.render,
      features: state.config.features,
      debug: state.config.debug,
    },
  };
}

function updateStateExport() {
  if (!state.config?.debug?.enableStateExport) return;
  const payload = JSON.stringify(buildExportState());
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "STATE_UPDATE", payload });
    return;
  }
  if (swRegistration?.active) {
    swRegistration.active.postMessage({ type: "STATE_UPDATE", payload });
  }
}

function downloadState() {
  const payload = buildExportState();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `i002-state-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  if (helpButton) helpButton.addEventListener("click", openHelp);
  if (helpClose) helpClose.addEventListener("click", closeHelp);
  if (helpModal) {
    helpModal.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.dataset?.close === "true") {
        closeHelp();
      }
    });
  }
  if (state.config.debug?.enableStateExport && exportButton) {
    exportButton.hidden = false;
    exportButton.addEventListener("click", downloadState);
  }
  if (state.config.debug?.enableStateExport && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).then((registration) => {
      swRegistration = registration;
      updateStateExport();
    });
  } else if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        if (registration.scope.includes("/client/")) {
          registration.unregister();
        }
      });
    });
  }
  requestAnimationFrame(step);
}

init().catch((error) => {
  console.error(error);
  setStatus("Failed to load config");
});
