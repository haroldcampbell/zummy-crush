(() => {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const resetButton = document.getElementById("reset");

  const letters = ["A", "B", "C", "D", "E"];
  const letterValues = {
    A: 10 ** 2,
    B: 10 ** 3,
    C: 10 ** 4,
    D: 10 ** 5,
    E: 10 ** 6,
  };

  const gridSize = 3;
  const defaultDurationMs = 60_000;
  const state = {
    grid: [],
    tileSize: 0,
    gap: 8,
    padding: 12,
    selected: null,
    dragging: false,
    animation: null,
    inputLocked: false,
    score: 0,
    session: {
      durationMs: defaultDurationMs,
      remainingMs: defaultDurationMs,
      active: false,
      startTime: null,
    },
  };

  function resizeCanvas() {
    const width = canvas.clientWidth;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = width * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    const totalGap = state.gap * (gridSize - 1);
    const available = width - state.padding * 2 - totalGap;
    state.tileSize = Math.floor(available / gridSize);
  }

  function randomLetter() {
    return letters[Math.floor(Math.random() * letters.length)];
  }

  function createTile(row, col) {
    return {
      row,
      col,
      letter: randomLetter(),
    };
  }

  function initGrid() {
    state.grid = [];
    for (let row = 0; row < gridSize; row += 1) {
      const rowTiles = [];
      for (let col = 0; col < gridSize; col += 1) {
        rowTiles.push(createTile(row, col));
      }
      state.grid.push(rowTiles);
    }
  }

  function resetScore() {
    state.score = 0;
    scoreEl.textContent = "0";
  }

  function startSession() {
    state.session.remainingMs = state.session.durationMs;
    state.session.startTime = performance.now();
    state.session.active = true;
    timerEl.textContent = Math.ceil(state.session.remainingMs / 1000).toString();
  }

  function endSession() {
    state.session.active = false;
    timerEl.textContent = "0";
  }

  function resetGame() {
    initGrid();
    resetScore();
    startSession();
  }

  function tileRect(row, col) {
    const x = state.padding + col * (state.tileSize + state.gap);
    const y = state.padding + row * (state.tileSize + state.gap);
    return { x, y, size: state.tileSize };
  }

  function getTileAt(x, y) {
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
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
      const progress = anim.progress;
      dx = from.x + (to.x - from.x) * progress;
      dy = from.y + (to.y - from.y) * progress;
    }

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#2b2b2b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(dx, dy, rect.size, rect.size, 10);
    ctx.fill();
    ctx.stroke();

    if (state.selected === tile) {
      ctx.strokeStyle = "#e36b2c";
      ctx.lineWidth = 3;
      ctx.strokeRect(dx + 2, dy + 2, rect.size - 4, rect.size - 4);
    }

    ctx.fillStyle = "#1f1f1f";
    ctx.font = `${Math.floor(rect.size * 0.5)}px Georgia`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tile.letter, dx + rect.size / 2, dy + rect.size / 2);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fdfbf8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const tile = state.grid[row][col];
        if (tile) drawTile(tile);
      }
    }

    requestAnimationFrame(render);
  }

  function isAdjacent(a, b) {
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    return dr + dc === 1;
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

  function animateSwap(a, b, onComplete) {
    state.inputLocked = true;
    const rectA = tileRect(a.row, a.col);
    const rectB = tileRect(b.row, b.col);
    state.animation = {
      tiles: [a, b],
      from: [rectA, rectB],
      to: [rectB, rectA],
      progress: 0,
      start: performance.now(),
      duration: 160,
      onComplete,
    };
  }

  function updateAnimation(timestamp) {
    if (!state.animation) return;
    const anim = state.animation;
    const elapsed = timestamp - anim.start;
    anim.progress = Math.min(elapsed / anim.duration, 1);

    if (anim.progress >= 1) {
      const callback = anim.onComplete;
      state.animation = null;
      state.inputLocked = false;
      if (callback) callback();
    }
  }

  function findMatches() {
    const matches = new Set();

    for (let row = 0; row < gridSize; row += 1) {
      let runStart = 0;
      for (let col = 1; col <= gridSize; col += 1) {
        const current = col < gridSize ? state.grid[row][col] : null;
        const prev = state.grid[row][col - 1];
        const isSame = current && prev && current.letter === prev.letter;
        if (!isSame) {
          const runLength = col - runStart;
          if (runLength >= 3) {
            for (let c = runStart; c < col; c += 1) {
              matches.add(`${row},${c}`);
            }
          }
          runStart = col;
        }
      }
    }

    for (let col = 0; col < gridSize; col += 1) {
      let runStart = 0;
      for (let row = 1; row <= gridSize; row += 1) {
        const current = row < gridSize ? state.grid[row][col] : null;
        const prev = state.grid[row - 1][col];
        const isSame = current && prev && current.letter === prev.letter;
        if (!isSame) {
          const runLength = row - runStart;
          if (runLength >= 3) {
            for (let r = runStart; r < row; r += 1) {
              matches.add(`${r},${col}`);
            }
          }
          runStart = row;
        }
      }
    }

    return matches;
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

  function clearMatches(matchSet) {
    for (const key of matchSet) {
      const [row, col] = key.split(",").map(Number);
      state.grid[row][col] = null;
    }
  }

  function collapseColumns() {
    for (let col = 0; col < gridSize; col += 1) {
      const columnTiles = [];
      for (let row = gridSize - 1; row >= 0; row -= 1) {
        const tile = state.grid[row][col];
        if (tile) columnTiles.push(tile);
      }

      for (let row = gridSize - 1; row >= 0; row -= 1) {
        const tile = columnTiles.shift() || createTile(row, col);
        tile.row = row;
        tile.col = col;
        state.grid[row][col] = tile;
      }
    }
  }

  function resolveMatches() {
    let matched = findMatches();
    let didMatch = false;

    while (matched.size > 0) {
      didMatch = true;
      const points = scoreMatches(matched);
      state.score += points;
      scoreEl.textContent = state.score.toString();
      clearMatches(matched);
      collapseColumns();
      matched = findMatches();
    }

    return didMatch;
  }

  function handleSwap(targetTile) {
    const selected = state.selected;
    if (!selected || !targetTile || selected === targetTile) return;
    if (!isAdjacent(selected, targetTile)) return;

    const first = selected;
    const second = targetTile;
    state.selected = null;

    animateSwap(first, second, () => {
      swapTiles(first, second);
      const matched = resolveMatches();
      if (!matched) {
        animateSwap(first, second, () => {
          swapTiles(first, second);
        });
      }
    });
  }

  function pointerToCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }

  function onPointerDown(event) {
    if (state.inputLocked || !state.session.active) return;
    const { x, y } = pointerToCanvas(event);
    const tile = getTileAt(x, y);
    if (!tile) return;
    state.selected = tile;
    state.dragging = true;
  }

  function onPointerUp(event) {
    if (state.inputLocked || !state.session.active) return;
    if (!state.dragging) return;
    const { x, y } = pointerToCanvas(event);
    const tile = getTileAt(x, y);
    handleSwap(tile);
    state.dragging = false;
  }

  function onPointerMove(event) {
    if (!state.dragging || state.inputLocked || !state.session.active) return;
    const { x, y } = pointerToCanvas(event);
    const tile = getTileAt(x, y);
    if (tile && tile !== state.selected) {
      handleSwap(tile);
      state.dragging = false;
    }
  }

  function updateTimer(timestamp) {
    if (!state.session.active || !state.session.startTime) return;
    const elapsed = timestamp - state.session.startTime;
    const remaining = Math.max(state.session.durationMs - elapsed, 0);
    state.session.remainingMs = remaining;
    timerEl.textContent = Math.ceil(remaining / 1000).toString();
    if (remaining <= 0) endSession();
  }

  function tick(timestamp) {
    updateAnimation(timestamp);
    updateTimer(timestamp);
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  resetButton.addEventListener("click", resetGame);

  resizeCanvas();
  resetGame();
  requestAnimationFrame(render);
  requestAnimationFrame(tick);
})();
