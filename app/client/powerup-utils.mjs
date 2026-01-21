function sortCells(cells, orientation) {
  const sorted = [...cells];
  if (orientation === "vertical") {
    sorted.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col));
  } else {
    sorted.sort((a, b) => (a.col !== b.col ? a.col - b.col : a.row - b.row));
  }
  return sorted;
}

function cellsContain(cells, target) {
  if (!target) return false;
  return cells.some((cell) => cell.row === target.row && cell.col === target.col);
}

export function selectPowerUpCell(
  cells,
  { orientation = "horizontal", swapDestination = null, cascadeIndex = 0 } = {}
) {
  if (!Array.isArray(cells) || cells.length === 0) return null;
  if (cascadeIndex === 0 && swapDestination && cellsContain(cells, swapDestination)) {
    return swapDestination;
  }
  const sorted = sortCells(cells, orientation);
  const centerIndex = Math.floor(sorted.length / 2);
  return sorted[centerIndex];
}
