import assert from "node:assert/strict";
import {
  applyMatch4LootDrops,
  formatLootLabel,
  pickWeightedChoice,
} from "../client/loot-utils.mjs";

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

function testApplyMatch4LootDrops() {
  const events = [
    { id: 1, length: 4, cascadeIndex: 0 },
    { id: 2, length: 5, cascadeIndex: 0 },
  ];
  const config = {
    sessionCap: 1,
    types: [{ id: "gem", weight: 1 }],
  };
  const session = { match4DropCount: 0 };
  const drops = applyMatch4LootDrops(events, config, session, () => 0);

  assert.equal(drops.length, 1, "applyMatch4LootDrops drops once for match-4");
  assert.equal(session.match4DropCount, 1, "match4DropCount increments");
  assert.equal(drops[0].type, "gem", "drop type derived from weighted choice");
}

function testApplyMatch4LootDropsRespectsCap() {
  const events = [
    { id: 1, length: 4, cascadeIndex: 0 },
    { id: 2, length: 4, cascadeIndex: 1 },
  ];
  const config = { sessionCap: 1, types: [{ id: "card", weight: 1 }] };
  const session = { match4DropCount: 0 };
  const drops = applyMatch4LootDrops(events, config, session, () => 0);

  assert.equal(drops.length, 1, "session cap limits total drops");
  assert.equal(session.match4DropCount, 1, "match4DropCount respects cap");
}

testPickWeightedChoice();
testFormatLootLabel();
testApplyMatch4LootDrops();
testApplyMatch4LootDropsRespectsCap();
