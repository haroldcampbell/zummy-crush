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
    let runId = null;
    let runLength = 0;
    let runStart = 0;
    for (let c = 0; c <= cols; c += 1) {
      const currentId = c < cols ? grid[r][c]?.typeId : null;
      if (currentId && currentId === runId) {
        runLength += 1;
        continue;
      }
      if (runId && runLength >= 3) {
        for (let k = runStart; k < runStart + runLength; k += 1) {
          matches.add(`${r},${k}`);
        }
      }
      runId = currentId || null;
      runStart = c;
      runLength = currentId ? 1 : 0;
    }
  }

  for (let c = 0; c < cols; c += 1) {
    let runId = null;
    let runLength = 0;
    let runStart = 0;
    for (let r = 0; r <= rows; r += 1) {
      const currentId = r < rows ? grid[r][c]?.typeId : null;
      if (currentId && currentId === runId) {
        runLength += 1;
        continue;
      }
      if (runId && runLength >= 3) {
        for (let k = runStart; k < runStart + runLength; k += 1) {
          matches.add(`${k},${c}`);
        }
      }
      runId = currentId || null;
      runStart = r;
      runLength = currentId ? 1 : 0;
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
  while (findMatches(grid).size > 0 && attempts < 50) {
    grid = createGrid(rows, cols, tileTypes, options);
    attempts += 1;
  }
  if (findMatches(grid).size === 0) {
    return grid;
  }

  const rowsCount = grid.length;
  const colsCount = grid[0]?.length || 0;
  for (let r = 0; r < rowsCount; r += 1) {
    for (let c = 0; c < colsCount; c += 1) {
      let guard = 0;
      while (guard < 10) {
        const candidate = createTile(tileTypes, options);
        const left1 = grid[r][c - 1]?.typeId;
        const left2 = grid[r][c - 2]?.typeId;
        const up1 = grid[r - 1]?.[c]?.typeId;
        const up2 = grid[r - 2]?.[c]?.typeId;
        const createsRowMatch = left1 && left2 && left1 === left2 && candidate.typeId === left1;
        const createsColMatch = up1 && up2 && up1 === up2 && candidate.typeId === up1;
        if (!createsRowMatch && !createsColMatch) {
          grid[r][c] = candidate;
          break;
        }
        guard += 1;
      }
    }
  }
  return grid;
}
