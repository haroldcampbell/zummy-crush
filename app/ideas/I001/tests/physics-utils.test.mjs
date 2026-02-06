import assert from "node:assert/strict";
import {
  computeRepulsionOffsets,
  computeTapScale,
  decayBoost,
} from "../client/physics-utils.mjs";

function testComputeTapScale() {
  const start = 100;
  const duration = 200;
  const scaleDown = 0.1;
  const startScale = computeTapScale(start, start, duration, scaleDown);
  assert.equal(startScale, 0.9, "tap scale starts reduced");
  const midScale = computeTapScale(200, start, duration, scaleDown);
  assert.ok(midScale > 0.9 && midScale < 1, "tap scale interpolates back");
  const endScale = computeTapScale(400, start, duration, scaleDown);
  assert.equal(endScale, 1, "tap scale returns to 1");
}

function testDecayBoost() {
  const next = decayBoost(1, 200, 400);
  assert.equal(next, 0.5, "decayBoost reduces linearly");
  const zero = decayBoost(0.1, 500, 400);
  assert.equal(zero, 0, "decayBoost floors at 0");
}

function testComputeRepulsionOffsets() {
  const tileA = { id: "A" };
  const tileB = { id: "B" };
  const tiles = [tileA, tileB];
  const positions = new Map([
    [tileA, { x: 0, y: 0 }],
    [tileB, { x: 30, y: 0 }],
  ]);
  const boosts = new Map([
    [tileA, 0],
    [tileB, 0],
  ]);
  const physics = {
    enabled: true,
    repulsionRadius: 10,
    repulsionStrength: 5,
  };
  const offsets = computeRepulsionOffsets(tiles, positions, 30, physics, boosts);
  const offsetA = offsets.get(tileA);
  const offsetB = offsets.get(tileB);
  assert.ok(offsetA.x < 0, "tileA pushes left");
  assert.ok(offsetB.x > 0, "tileB pushes right");
}

function runTests() {
  testComputeTapScale();
  testDecayBoost();
  testComputeRepulsionOffsets();
  console.log("All physics utils tests passed.");
}

runTests();
