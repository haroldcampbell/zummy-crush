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

function cellKey(cell) {
  return `${cell.row},${cell.col}`;
}

export function findMatchRuns(grid, rows, cols) {
  const runs = [];

  for (let row = 0; row < rows; row += 1) {
    let runStart = 0;
    for (let col = 1; col <= cols; col += 1) {
      const current = col < cols ? grid[row][col] : null;
      const prev = grid[row][col - 1];
      const isSame = current && prev && current.letter === prev.letter;
      if (!isSame) {
        const runLength = col - runStart;
        if (runLength >= 3) {
          const cells = [];
          for (let c = runStart; c < col; c += 1) {
            cells.push({ row, col: c });
          }
          runs.push({ cells, length: runLength, orientation: "horizontal" });
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
          const cells = [];
          for (let r = runStart; r < row; r += 1) {
            cells.push({ row: r, col });
          }
          runs.push({ cells, length: runLength, orientation: "vertical" });
        }
        runStart = row;
      }
    }
  }

  return runs;
}

export function selectMatchPowerUpCell(
  cells,
  { swapDestination = null, reserved = null } = {}
) {
  if (!Array.isArray(cells) || cells.length === 0) return null;
  const reservedSet = reserved instanceof Set ? reserved : new Set();

  if (swapDestination) {
    const isInMatch = cells.some(
      (cell) => cell.row === swapDestination.row && cell.col === swapDestination.col
    );
    if (isInMatch && !reservedSet.has(cellKey(swapDestination))) {
      return { row: swapDestination.row, col: swapDestination.col };
    }
  }

  const centerIndex = Math.floor(cells.length / 2);
  const indices = [centerIndex];
  for (let offset = 1; offset < cells.length; offset += 1) {
    const right = centerIndex + offset;
    if (right < cells.length) indices.push(right);
    const left = centerIndex - offset;
    if (left >= 0) indices.push(left);
  }

  for (const index of indices) {
    const cell = cells[index];
    if (!cell) continue;
    const key = cellKey(cell);
    if (!reservedSet.has(key)) {
      return { row: cell.row, col: cell.col };
    }
  }

  return null;
}

/**
 * Match-event contract v1.
 * Fields: id, length, orientation, swapOrigin (optional), cascadeIndex.
 * Includes cells for convenience in downstream features.
 */
export function buildMatchEvents(
  grid,
  rows,
  cols,
  { swapOrigin = null, cascadeIndex = 0, eventIdStart = 1 } = {}
) {
  const events = [];
  let nextEventId = eventIdStart;
  const normalizedSwapOrigin = swapOrigin ? { ...swapOrigin } : null;

  const pushEvent = (cells, orientation) => {
    if (cells.length < 3) return;
    events.push({
      id: nextEventId,
      length: cells.length,
      orientation,
      swapOrigin: normalizedSwapOrigin,
      cascadeIndex,
      cells,
    });
    nextEventId += 1;
  };

  for (let row = 0; row < rows; row += 1) {
    let runStart = 0;
    for (let col = 1; col <= cols; col += 1) {
      const current = col < cols ? grid[row][col] : null;
      const prev = grid[row][col - 1];
      const isSame = current && prev && current.letter === prev.letter;
      if (!isSame) {
        const runLength = col - runStart;
        if (runLength >= 3) {
          const cells = [];
          for (let c = runStart; c < col; c += 1) {
            cells.push({ row, col: c });
          }
          pushEvent(cells, "horizontal");
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
          const cells = [];
          for (let r = runStart; r < row; r += 1) {
            cells.push({ row: r, col });
          }
          pushEvent(cells, "vertical");
        }
        runStart = row;
      }
    }
  }

  return { events, nextEventId };
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

export function collapseExistingTiles(grid, rows, cols, mask) {
  const nextGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
  const moves = [];
  const emptySlots = [];

  for (let col = 0; col < cols; col += 1) {
    const columnTiles = [];
    for (let row = rows - 1; row >= 0; row -= 1) {
      if (mask[row][col] !== 1) continue;
      const tile = grid[row][col];
      if (tile) columnTiles.push(tile);
    }

    let targetRow = rows - 1;
    for (const tile of columnTiles) {
      while (targetRow >= 0 && mask[targetRow][col] !== 1) {
        targetRow -= 1;
      }
      if (targetRow < 0) break;
      const from = { row: tile.row, col: tile.col };
      const to = { row: targetRow, col };
      if (from.row !== to.row || from.col !== to.col) {
        moves.push({ tile, from, to });
      }
      tile.row = to.row;
      tile.col = to.col;
      nextGrid[to.row][to.col] = tile;
      targetRow -= 1;
    }

    for (let row = targetRow; row >= 0; row -= 1) {
      if (mask[row][col] !== 1) continue;
      emptySlots.push({ row, col });
    }
  }

  return { nextGrid, moves, emptySlots };
}
