import assert from "node:assert/strict";
import {
  buildGrid,
  collapseExistingTiles,
  collapseColumns,
  createMask,
  fillGridNoMatches,
  findMatches,
  normalizeMask,
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

function runTests() {
  testNormalizeMask();
  testFindMatchesSkipsVoids();
  testFillGridNoMatches();
  testCollapseRespectsVoids();
  testCollapseExistingTiles();
  testBuildGridCreatesNullsForVoids();
  console.log("All board logic tests passed.");
}

runTests();
