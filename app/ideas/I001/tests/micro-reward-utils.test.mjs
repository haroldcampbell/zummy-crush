import assert from "node:assert/strict";
import {
  shouldTriggerFirstMatch5Reward,
  shouldTriggerFirstPowerUpReward,
} from "../client/micro-reward-utils.mjs";

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
  testNoPowerUp();
  testTriggersOnPowerUp();
  testPowerUpCooldownBlocks();
  testPowerUpAlreadyTriggeredBlocks();
  testPowerUpAllowRepeat();
  console.log("All micro-reward utils tests passed.");
}

runTests();

function testNoPowerUp() {
  const result = shouldTriggerFirstPowerUpReward({
    events: [{ length: 3 }],
    now: 1000,
  });
  assert.equal(result, false, "no power-up match should not trigger");
}

function testTriggersOnPowerUp() {
  const result = shouldTriggerFirstPowerUpReward({
    events: [{ length: 4 }],
    now: 1000,
  });
  assert.equal(result, true, "match-4 triggers power-up reward");
}

function testPowerUpCooldownBlocks() {
  const result = shouldTriggerFirstPowerUpReward({
    events: [{ length: 5 }],
    now: 1200,
    lastTriggeredAt: 1000,
    cooldownMs: 500,
  });
  assert.equal(result, false, "power-up cooldown blocks rapid repeat");
}

function testPowerUpAlreadyTriggeredBlocks() {
  const result = shouldTriggerFirstPowerUpReward({
    events: [{ length: 4 }],
    now: 2000,
    alreadyTriggered: true,
  });
  assert.equal(result, false, "already triggered blocks power-up reward");
}

function testPowerUpAllowRepeat() {
  const result = shouldTriggerFirstPowerUpReward({
    events: [{ length: 4 }],
    now: 2000,
    alreadyTriggered: true,
    allowRepeat: true,
  });
  assert.equal(result, true, "allowRepeat bypasses already-triggered");
}
