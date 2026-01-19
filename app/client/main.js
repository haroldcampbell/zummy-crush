(() => {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  const letters = ["A", "B", "C", "D", "E"];
  const gridSize = 3;
  const state = {
    tiles: [],
    tileSize: 0,
    gap: 8,
    padding: 12,
    selected: null,
    dragging: false,
    animation: null,
    inputLocked: false,
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

  function initTiles() {
    state.tiles = [];
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        state.tiles.push({
          row,
          col,
          letter: randomLetter(),
        });
      }
    }
  }

  function tileRect(row, col) {
    const x = state.padding + col * (state.tileSize + state.gap);
    const y = state.padding + row * (state.tileSize + state.gap);
    return { x, y, size: state.tileSize };
  }

  function getTileAt(x, y) {
    for (const tile of state.tiles) {
      const rect = tileRect(tile.row, tile.col);
      if (x >= rect.x && x <= rect.x + rect.size && y >= rect.y && y <= rect.y + rect.size) {
        return tile;
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

    for (const tile of state.tiles) {
      drawTile(tile);
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

  function handleSwap(targetTile) {
    const selected = state.selected;
    if (!selected || !targetTile || selected === targetTile) return;
    if (!isAdjacent(selected, targetTile)) return;

    const first = selected;
    const second = targetTile;
    state.selected = null;

    animateSwap(first, second, () => {
      swapTiles(first, second);
      // No match detection in S001; always revert swap.
      animateSwap(first, second, () => {
        swapTiles(first, second);
      });
    });
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

  function tick(timestamp) {
    updateAnimation(timestamp);
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  resizeCanvas();
  initTiles();
  requestAnimationFrame(render);
  requestAnimationFrame(tick);
})();
