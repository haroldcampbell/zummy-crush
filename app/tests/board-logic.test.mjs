import assert from "node:assert/strict";
import {
  buildGrid,
  buildMatchEvents,
  collapseExistingTiles,
  collapseColumns,
  createMask,
  fillGridNoMatches,
  findMatchRuns,
  findMatches,
  normalizeMask,
  selectMatchPowerUpCell,
} from "../client/board-logic.mjs";

function makeTile(row, col, letter) {
  return { row, col, letter };
}

function testNormalizeMask() {
  const mask = normalizeMask([[1, 0], [1, 1]], 2, 2);
  assert.deepEqual(mask, [[1, 0], [1, 1]], "normalizeMask keeps valid mask");

  const fallbackMask = normalizeMask([[1]], 2, 2);
  assert.deepEqual(fallbackMask, createMask(2, 2, 1), "normalizeMask falls back on invalid");
}

function testFindMatchesSkipsVoids() {
  const rows = 3;
  const cols = 3;
  const mask = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ];
  const baseLetters = [
    ["C", "C", "C"],
    ["D", "X", "E"],
    ["F", "G", "H"],
  ];
  const grid = buildGrid(rows, cols, mask, (row, col) =>
    makeTile(row, col, baseLetters[row][col])
  );
  grid[0][0].letter = "C";
  grid[0][1].letter = "C";
  grid[0][2].letter = "C";

  const matches = findMatches(grid, rows, cols);
  assert.equal(matches.size, 3, "findMatches detects horizontal match with void ignored");
}

function testFillGridNoMatches() {
  const rows = 6;
  const cols = 6;
  const mask = createMask(rows, cols, 1);
  let counter = 0;
  const rng = () => {
    counter = (counter + 1) % 10;
    return counter / 10;
  };
  const grid = fillGridNoMatches(
    rows,
    cols,
    mask,
    ["A", "B", "C", "D"],
    (row, col, letter) => makeTile(row, col, letter),
    rng
  );
  const matches = findMatches(grid, rows, cols);
  assert.equal(matches.size, 0, "initial grid should not contain matches");
}

function testCollapseRespectsVoids() {
  const rows = 4;
  const cols = 1;
  const voidMask = [
    [1],
    [0],
    [1],
    [1],
  ];
  const grid = [
    [makeTile(0, 0, "A")],
    [null],
    [makeTile(2, 0, "B")],
    [null],
  ];

  collapseColumns(grid, rows, cols, voidMask, (row, col) => makeTile(row, col, "C"));
  assert.equal(grid[3][0].letter, "B", "bottom tile falls to lowest non-void cell");
  assert.equal(grid[2][0].letter, "A", "upper tile falls above the bottom tile");
  assert.equal(grid[1][0], null, "void cell remains empty");
}

function testCollapseExistingTiles() {
  const rows = 4;
  const cols = 1;
  const mask = [
    [1],
    [1],
    [1],
    [1],
  ];
  const grid = [
    [makeTile(0, 0, "A")],
    [null],
    [makeTile(2, 0, "B")],
    [null],
  ];
  const { nextGrid, moves, emptySlots } = collapseExistingTiles(grid, rows, cols, mask);
  assert.equal(nextGrid[3][0].letter, "B", "bottom tile moves down");
  assert.equal(nextGrid[2][0].letter, "A", "upper tile moves above bottom");
  assert.equal(emptySlots.length, 2, "empty slots are tracked after collapse");
  assert.equal(moves.length, 2, "moves include both falling tiles");
}

function testBuildGridCreatesNullsForVoids() {
  const rows = 2;
  const cols = 2;
  const mask = [
    [1, 0],
    [0, 1],
  ];
  const grid = buildGrid(rows, cols, mask, (row, col) => makeTile(row, col, "Z"));
  assert.ok(grid[0][0], "tile exists where mask is 1");
  assert.equal(grid[0][1], null, "tile missing where mask is 0");
  assert.equal(grid[1][0], null, "tile missing where mask is 0");
  assert.ok(grid[1][1], "tile exists where mask is 1");
}

function testBuildMatchEvents() {
  const rows = 3;
  const cols = 3;
  const grid = [
    [makeTile(0, 0, "A"), makeTile(0, 1, "A"), makeTile(0, 2, "A")],
    [makeTile(1, 0, "B"), makeTile(1, 1, "C"), makeTile(1, 2, "D")],
    [makeTile(2, 0, "B"), makeTile(2, 1, "C"), makeTile(2, 2, "D")],
  ];
  const { events, nextEventId } = buildMatchEvents(grid, rows, cols, {
    swapOrigin: { row: 1, col: 1 },
    cascadeIndex: 2,
    eventIdStart: 10,
  });
  assert.equal(events.length, 1, "buildMatchEvents creates a single horizontal event");
  assert.equal(events[0].orientation, "horizontal", "event orientation matches row run");
  assert.equal(events[0].length, 3, "event length matches run length");
  assert.deepEqual(events[0].swapOrigin, { row: 1, col: 1 }, "swap origin preserved");
  assert.equal(events[0].cascadeIndex, 2, "cascade index preserved");
  assert.equal(events[0].id, 10, "event id starts at configured value");
  assert.equal(nextEventId, 11, "nextEventId increments after events");

  const verticalGrid = [
    [makeTile(0, 0, "A"), makeTile(0, 1, "C"), makeTile(0, 2, "D")],
    [makeTile(1, 0, "B"), makeTile(1, 1, "C"), makeTile(1, 2, "E")],
    [makeTile(2, 0, "F"), makeTile(2, 1, "C"), makeTile(2, 2, "G")],
  ];
  const verticalResult = buildMatchEvents(verticalGrid, rows, cols, { eventIdStart: 1 });
  assert.equal(
    verticalResult.events[0].orientation,
    "vertical",
    "event orientation matches column run"
  );
}

function testFindMatchRuns() {
  const rows = 1;
  const cols = 6;
  const grid = [[
    makeTile(0, 0, "A"),
    makeTile(0, 1, "A"),
    makeTile(0, 2, "A"),
    makeTile(0, 3, "A"),
    makeTile(0, 4, "A"),
    makeTile(0, 5, "B"),
  ]];
  const runs = findMatchRuns(grid, rows, cols);
  assert.equal(runs.length, 1, "findMatchRuns returns a single run");
  assert.equal(runs[0].length, 5, "run length matches");
  assert.equal(runs[0].orientation, "horizontal", "orientation matches");
}

function testFindMatchRunsVertical() {
  const rows = 6;
  const cols = 1;
  const grid = [
    [makeTile(0, 0, "C")],
    [makeTile(1, 0, "C")],
    [makeTile(2, 0, "C")],
    [makeTile(3, 0, "C")],
    [makeTile(4, 0, "C")],
    [makeTile(5, 0, "D")],
  ];
  const runs = findMatchRuns(grid, rows, cols);
  assert.equal(runs.length, 1, "findMatchRuns returns a single vertical run");
  assert.equal(runs[0].length, 5, "vertical run length matches");
  assert.equal(runs[0].orientation, "vertical", "orientation matches");
}

function testSelectMatchPowerUpCell() {
  const cells = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 0, col: 4 },
  ];
  const swapDestination = { row: 0, col: 4 };
  const chosenSwap = selectMatchPowerUpCell(cells, { swapDestination });
  assert.deepEqual(chosenSwap, swapDestination, "swap destination wins when in match");

  const chosenCenter = selectMatchPowerUpCell(cells);
  assert.deepEqual(chosenCenter, { row: 0, col: 2 }, "center-most chosen by default");

  const reserved = new Set(["0,2"]);
  const chosenRight = selectMatchPowerUpCell(cells, { reserved });
  assert.deepEqual(
    chosenRight,
    { row: 0, col: 3 },
    "reserved center falls back to right before left"
  );
}

function runTests() {
  testNormalizeMask();
  testFindMatchesSkipsVoids();
  testFillGridNoMatches();
  testCollapseRespectsVoids();
  testCollapseExistingTiles();
  testBuildGridCreatesNullsForVoids();
  testBuildMatchEvents();
  testFindMatchRuns();
  testFindMatchRunsVertical();
  testSelectMatchPowerUpCell();
  console.log("All board logic tests passed.");
}

runTests();
