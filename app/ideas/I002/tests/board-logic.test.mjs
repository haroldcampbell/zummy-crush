import assert from "node:assert/strict";
import {
  rotateRow,
  rotateCol,
  applyRotation,
  findMatches,
  clearMatches,
  collapseGrid,
  refillGrid,
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
