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

export function fillGridNoMatches(rows, cols, mask, letters, createTile, rng = Math.random) {
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (mask[row][col] !== 1) continue;

      const forbidden = new Set();
      if (col >= 2) {
        const left1 = grid[row][col - 1];
        const left2 = grid[row][col - 2];
        if (left1 && left2 && left1.letter === left2.letter) {
          forbidden.add(left1.letter);
        }
      }
      if (row >= 2) {
        const up1 = grid[row - 1][col];
        const up2 = grid[row - 2][col];
        if (up1 && up2 && up1.letter === up2.letter) {
          forbidden.add(up1.letter);
        }
      }

      const options = letters.filter((letter) => !forbidden.has(letter));
      const pool = options.length > 0 ? options : letters;
      const letter = pool[Math.floor(rng() * pool.length)];
      grid[row][col] = createTile(row, col, letter);
    }
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
