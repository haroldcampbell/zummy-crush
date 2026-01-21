import assert from "node:assert/strict";
import { selectPowerUpCell } from "../client/powerup-utils.mjs";

function testSelectPowerUpCellPrefersSwapDestination() {
  const cells = [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
    { row: 1, col: 4 },
  ];
  const swapDestination = { row: 1, col: 3 };
  const selected = selectPowerUpCell(cells, {
    orientation: "horizontal",
    swapDestination,
    cascadeIndex: 0,
  });
  assert.deepEqual(selected, swapDestination, "uses swap destination on initial match");
}

function testSelectPowerUpCellIgnoresSwapDestinationOnCascade() {
  const cells = [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
  ];
  const swapDestination = { row: 2, col: 0 };
  const selected = selectPowerUpCell(cells, {
    orientation: "horizontal",
    swapDestination,
    cascadeIndex: 1,
  });
  assert.deepEqual(selected, { row: 2, col: 2 }, "uses center-most cell on cascades");
}

function testSelectPowerUpCellEvenHorizontalPicksRightCenter() {
  const cells = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
  ];
  const selected = selectPowerUpCell(cells, { orientation: "horizontal" });
  assert.deepEqual(selected, { row: 0, col: 2 }, "uses right center for even horizontal");
}

function testSelectPowerUpCellEvenVerticalPicksLowerCenter() {
  const cells = [
    { row: 0, col: 5 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
  ];
  const selected = selectPowerUpCell(cells, { orientation: "vertical" });
  assert.deepEqual(selected, { row: 2, col: 5 }, "uses lower center for even vertical");
}

function runTests() {
  testSelectPowerUpCellPrefersSwapDestination();
  testSelectPowerUpCellIgnoresSwapDestinationOnCascade();
  testSelectPowerUpCellEvenHorizontalPicksRightCenter();
  testSelectPowerUpCellEvenVerticalPicksLowerCenter();
  console.log("All power-up util tests passed.");
}

runTests();
