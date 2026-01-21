import assert from "node:assert/strict";
import { formatLootLabel, pickWeightedChoice } from "../client/loot-utils.mjs";

function testPickWeightedChoice() {
  const items = [
    { id: "gem", weight: 60 },
    { id: "card", weight: 30 },
    { id: "relic", weight: 10 },
  ];

  const low = pickWeightedChoice(items, () => 0);
  assert.equal(low.id, "gem", "low roll picks first weighted item");

  const mid = pickWeightedChoice(items, () => 0.7);
  assert.equal(mid.id, "card", "mid roll lands in middle weight");

  const high = pickWeightedChoice(items, () => 0.99);
  assert.equal(high.id, "relic", "high roll picks last weighted item");
}

function testFormatLootLabel() {
  assert.equal(formatLootLabel("gem"), "Gem", "formatLootLabel title-cases");
  assert.equal(formatLootLabel("spell_card"), "Spell Card", "underscores become spaces");
  assert.equal(formatLootLabel("ancient-relic"), "Ancient Relic", "dashes become spaces");
}

function runTests() {
  testPickWeightedChoice();
  testFormatLootLabel();
  console.log("All loot utils tests passed.");
}

runTests();
