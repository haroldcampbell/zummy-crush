import assert from "node:assert/strict";
import {
  rotateRow,
  rotateCol,
  applyRotation,
  findMatches,
  clearMatches,
  collapseGrid,
  refillGrid,
  createTile,
  fillGridNoMatches,
} from "../client/board-logic.mjs";

const rowGrid = [
  [
    { typeId: "A" },
    { typeId: "A" },
    { typeId: "B" },
    { typeId: "C" },
  ],
];

const rotatedLeftTwo = rotateRow(rowGrid, 0, -2);
assert.deepEqual(
  rotatedLeftTwo[0].map((cell) => cell.typeId),
  ["B", "C", "A", "A"],
  "rotateRow left by 2 wraps correctly"
);

const rotatedRightOne = rotateRow(rowGrid, 0, 1);
assert.deepEqual(
  rotatedRightOne[0].map((cell) => cell.typeId),
  ["C", "A", "A", "B"],
  "rotateRow right by 1 wraps correctly"
);

const colGrid = [
  [{ typeId: "A" }],
  [{ typeId: "B" }],
  [{ typeId: "C" }],
  [{ typeId: "D" }],
];

const rotatedDownOne = rotateCol(colGrid, 0, 1);
assert.deepEqual(
  rotatedDownOne.map((row) => row[0].typeId),
  ["D", "A", "B", "C"],
  "rotateCol down by 1 wraps correctly"
);

const rotatedUpTwo = applyRotation(colGrid, "col", 0, -2);
assert.deepEqual(
  rotatedUpTwo.map((row) => row[0].typeId),
  ["C", "D", "A", "B"],
  "applyRotation supports column offset"
);

console.log("board-logic rotation tests passed");

const matchGrid = [
  [{ typeId: "A" }, { typeId: "A" }, { typeId: "A" }],
  [{ typeId: "B" }, { typeId: "C" }, { typeId: "D" }],
  [{ typeId: "B" }, { typeId: "C" }, { typeId: "D" }],
];

const matches = findMatches(matchGrid);
assert.equal(matches.size, 3, "findMatches detects horizontal runs");

const cleared = clearMatches(matchGrid, matches);
assert.equal(cleared[0][0], null, "clearMatches removes matched tiles");

const collapsed = collapseGrid(cleared);
assert.equal(collapsed[2][0]?.typeId, "B", "collapseGrid drops tiles down");

const refilled = refillGrid(collapsed, [{ id: "X" }]);
assert.ok(refilled[0][0], "refillGrid fills empty cells");

console.log("board-logic match and gravity tests passed");

const variantTile = createTile([{ id: "Z" }], { variant: "powerup" });
assert.equal(variantTile.variant, "powerup", "createTile respects variant override");

const noMatchGrid = fillGridNoMatches(6, 6, [
  { id: "A" },
  { id: "B" },
  { id: "C" },
  { id: "D" },
]);
assert.equal(findMatches(noMatchGrid).size, 0, "fillGridNoMatches avoids initial matches");

const nullGrid = [
  [null, null, null],
  [{ typeId: "A" }, null, { typeId: "B" }],
  [null, null, null],
];
assert.equal(findMatches(nullGrid).size, 0, "findMatches ignores empty cells");

const invalidGrid = [
  [{}, { typeId: "A" }],
  [{ typeId: "B" }, {}],
];
const collapsedInvalid = collapseGrid(invalidGrid);
assert.equal(collapsedInvalid[1][0]?.typeId, "B", "collapseGrid ignores invalid tiles");
const refilledInvalid = refillGrid(invalidGrid, [{ id: "X" }]);
assert.equal(refilledInvalid[0][0]?.typeId, "X", "refillGrid replaces invalid tiles");

function withSeededRandom(seed, fn) {
  const originalRandom = Math.random;
  let state = seed;
  Math.random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

function runCascadeLoop(grid, tileTypes, maxSteps = 10) {
  let steps = 0;
  let current = grid;
  while (steps <= maxSteps) {
    const matches = findMatches(current);
    if (matches.size === 0) break;
    current = refillGrid(collapseGrid(clearMatches(current, matches)), tileTypes);
    steps += 1;
  }
  assert.ok(steps <= maxSteps, "cascade loop terminates within limit");
  return { grid: current, steps };
}

withSeededRandom(42, () => {
  for (let i = 0; i < 20; i += 1) {
    const seededGrid = fillGridNoMatches(8, 8, [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
    ]);
    assert.equal(findMatches(seededGrid).size, 0, "seeded grid avoids pre-matches");
  }
});

withSeededRandom(7, () => {
  const cascadeGrid = [
    [{ typeId: "A" }, { typeId: "B" }, { typeId: "A" }],
    [{ typeId: "B" }, { typeId: "A" }, { typeId: "B" }],
    [{ typeId: "A" }, { typeId: "A" }, { typeId: "A" }],
  ];
  const result = runCascadeLoop(cascadeGrid, [{ id: "A" }, { id: "B" }], 6);
  assert.ok(result.steps >= 1, "cascade loop runs when matches exist");
  const hasInvalid = result.grid.some((row) =>
    row.some((cell) => !cell || !cell.typeId)
  );
  assert.equal(hasInvalid, false, "cascade loop ends with a full valid grid");
});
