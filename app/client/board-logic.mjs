export function createMask(rows, cols, fill = 1) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function normalizeMask(mask, rows, cols) {
  if (!Array.isArray(mask) || mask.length !== rows) {
    return createMask(rows, cols, 1);
  }

  const normalized = [];
  for (let row = 0; row < rows; row += 1) {
    const sourceRow = mask[row];
    if (!Array.isArray(sourceRow) || sourceRow.length !== cols) {
      return createMask(rows, cols, 1);
    }
    const normalizedRow = [];
    for (let col = 0; col < cols; col += 1) {
      const value = Number(sourceRow[col]);
      normalizedRow.push(value === 1 ? 1 : 0);
    }
    normalized.push(normalizedRow);
  }

  return normalized;
}

export function buildGrid(rows, cols, mask, createTile) {
  const grid = [];
  for (let row = 0; row < rows; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < cols; col += 1) {
      if (mask[row][col] === 1) {
        rowTiles.push(createTile(row, col));
      } else {
        rowTiles.push(null);
      }
    }
    grid.push(rowTiles);
  }
  return grid;
}

export function findMatches(grid, rows, cols) {
  const matches = new Set();

  for (let row = 0; row < rows; row += 1) {
    let runStart = 0;
    for (let col = 1; col <= cols; col += 1) {
      const current = col < cols ? grid[row][col] : null;
      const prev = grid[row][col - 1];
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

  for (let col = 0; col < cols; col += 1) {
    let runStart = 0;
    for (let row = 1; row <= rows; row += 1) {
      const current = row < rows ? grid[row][col] : null;
      const prev = grid[row - 1][col];
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

export function clearMatches(grid, matchSet) {
  for (const key of matchSet) {
    const [row, col] = key.split(",").map(Number);
    grid[row][col] = null;
  }
}

export function collapseColumns(grid, rows, cols, mask, createTile) {
  for (let col = 0; col < cols; col += 1) {
    const columnTiles = [];
    for (let row = rows - 1; row >= 0; row -= 1) {
      if (mask[row][col] !== 1) continue;
      const tile = grid[row][col];
      if (tile) columnTiles.push(tile);
    }

    for (let row = rows - 1; row >= 0; row -= 1) {
      if (mask[row][col] === 1) {
        const tile = columnTiles.shift() || createTile(row, col);
        tile.row = row;
        tile.col = col;
        grid[row][col] = tile;
      } else {
        grid[row][col] = null;
      }
    }
  }
}
