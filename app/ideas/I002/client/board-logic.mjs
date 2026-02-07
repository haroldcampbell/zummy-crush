function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function normalizeOffset(offset, length) {
  if (length === 0) return 0;
  const normalized = offset % length;
  return (normalized + length) % length;
}

export function createGrid(rows, cols, tileTypes, options = {}) {
  const grid = [];
  for (let r = 0; r < rows; r += 1) {
    const row = [];
    for (let c = 0; c < cols; c += 1) {
      row.push(createTile(tileTypes, options));
    }
    grid.push(row);
  }
  return grid;
}

export function createTile(tileTypes, options = {}) {
  const index = Math.floor(Math.random() * tileTypes.length);
  const type = tileTypes[index];
  const variant = options.variant || "base";
  return { typeId: type.id, variant };
}

export function rotateRow(grid, rowIndex, offset) {
  const row = grid[rowIndex];
  const length = row.length;
  const normalized = normalizeOffset(offset, length);
  const newRow = row.map((_, col) => row[(col - normalized + length) % length]);
  const nextGrid = cloneGrid(grid);
  nextGrid[rowIndex] = newRow.map((cell) => ({ ...cell }));
  return nextGrid;
}

export function rotateCol(grid, colIndex, offset) {
  const length = grid.length;
  const normalized = normalizeOffset(offset, length);
  const nextGrid = cloneGrid(grid);
  for (let row = 0; row < length; row += 1) {
    const sourceRow = (row - normalized + length) % length;
    nextGrid[row][colIndex] = { ...grid[sourceRow][colIndex] };
  }
  return nextGrid;
}

export function applyRotation(grid, axis, index, offset) {
  if (offset === 0) return cloneGrid(grid);
  if (axis === "row") return rotateRow(grid, index, offset);
  if (axis === "col") return rotateCol(grid, index, offset);
  return cloneGrid(grid);
}

export function findMatches(grid) {
  const matches = new Set();
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  for (let r = 0; r < rows; r += 1) {
    let runStart = 0;
    for (let c = 1; c <= cols; c += 1) {
      const currentId = grid[r][c]?.typeId;
      const prevId = grid[r][c - 1]?.typeId;
      if (c < cols && currentId === prevId) {
        continue;
      }
      const runLength = c - runStart;
      if (runLength >= 3) {
        for (let k = runStart; k < c; k += 1) {
          matches.add(`${r},${k}`);
        }
      }
      runStart = c;
    }
  }

  for (let c = 0; c < cols; c += 1) {
    let runStart = 0;
    for (let r = 1; r <= rows; r += 1) {
      const currentId = grid[r]?.[c]?.typeId;
      const prevId = grid[r - 1]?.[c]?.typeId;
      if (r < rows && currentId === prevId) {
        continue;
      }
      const runLength = r - runStart;
      if (runLength >= 3) {
        for (let k = runStart; k < r; k += 1) {
          matches.add(`${k},${c}`);
        }
      }
      runStart = r;
    }
  }

  return matches;
}

export function clearMatches(grid, matchSet) {
  const nextGrid = cloneGrid(grid);
  matchSet.forEach((key) => {
    const [row, col] = key.split(",").map(Number);
    nextGrid[row][col] = null;
  });
  return nextGrid;
}

export function collapseGrid(grid) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const nextGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

  for (let c = 0; c < cols; c += 1) {
    let writeRow = rows - 1;
    for (let r = rows - 1; r >= 0; r -= 1) {
      const cell = grid[r][c];
      if (cell) {
        nextGrid[writeRow][c] = { ...cell };
        writeRow -= 1;
      }
    }
  }

  return nextGrid;
}

export function refillGrid(grid, tileTypes, options = {}) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const nextGrid = cloneGrid(grid);

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (!nextGrid[r][c]) {
        nextGrid[r][c] = createTile(tileTypes, options);
      }
    }
  }

  return nextGrid;
}

export function fillGridNoMatches(rows, cols, tileTypes, options = {}) {
  let grid = createGrid(rows, cols, tileTypes, options);
  let attempts = 0;
  while (findMatches(grid).size > 0 && attempts < 25) {
    grid = createGrid(rows, cols, tileTypes, options);
    attempts += 1;
  }
  return grid;
}
