import assert from "node:assert/strict";
import { resolvePowerUpStyle } from "../client/powerup-style-utils.mjs";

function testNoTierStyle() {
  const base = {
    fill: "#fff",
    badge: { text: "XX", fill: "#000" },
  };
  const result = resolvePowerUpStyle(base, null);
  assert.equal(result.fill, "#fff", "base fill preserved");
  assert.equal(result.badge.text, "XX", "badge text preserved");
}

function testTierOverrides() {
  const base = {
    fill: "#fff",
    stroke: "#111",
    badge: { text: "XX", fill: "#000", radiusRatio: 0.18 },
  };
  const tier = {
    fill: "#ffe2a1",
    badge: { text: "X5", radiusRatio: 0.2 },
  };
  const result = resolvePowerUpStyle(base, tier);
  assert.equal(result.fill, "#ffe2a1", "tier fill overrides base");
  assert.equal(result.stroke, "#111", "base stroke preserved");
  assert.equal(result.badge.text, "X5", "tier badge text overrides");
  assert.equal(result.badge.radiusRatio, 0.2, "tier badge radius overrides");
  assert.equal(result.badge.fill, "#000", "base badge fill preserved");
}

function runTests() {
  testNoTierStyle();
  testTierOverrides();
  console.log("All power-up style utils tests passed.");
}

runTests();
