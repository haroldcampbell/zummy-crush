import assert from "node:assert/strict";
import { shouldTriggerFirstMatch5Reward } from "../client/micro-reward-utils.mjs";

function testNoMatch5() {
  const result = shouldTriggerFirstMatch5Reward({
    events: [{ length: 4 }],
    now: 1000,
  });
  assert.equal(result, false, "no match-5 should not trigger");
}

function testTriggersOnMatch5() {
  const result = shouldTriggerFirstMatch5Reward({
    events: [{ length: 5 }],
    now: 1000,
  });
  assert.equal(result, true, "match-5 triggers when not yet rewarded");
}

function testCooldownBlocks() {
  const result = shouldTriggerFirstMatch5Reward({
    events: [{ length: 5 }],
    now: 1500,
    lastTriggeredAt: 1000,
    cooldownMs: 1000,
  });
  assert.equal(result, false, "cooldown blocks rapid repeat");
}

function testAlreadyTriggeredBlocks() {
  const result = shouldTriggerFirstMatch5Reward({
    events: [{ length: 5 }],
    now: 2000,
    alreadyTriggered: true,
  });
  assert.equal(result, false, "already triggered blocks");
}

function runTests() {
  testNoMatch5();
  testTriggersOnMatch5();
  testCooldownBlocks();
  testAlreadyTriggeredBlocks();
  console.log("All micro-reward utils tests passed.");
}

runTests();
