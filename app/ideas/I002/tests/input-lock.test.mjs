import assert from "node:assert/strict";
import { isInputLocked } from "../client/input-lock.mjs";

assert.equal(
  isInputLocked({ snapping: null, cascadeActive: false }),
  false,
  "input unlocks when idle"
);
assert.equal(
  isInputLocked({ snapping: { axis: "row" }, cascadeActive: false }),
  true,
  "input locks during snapping"
);
assert.equal(
  isInputLocked({ snapping: null, cascadeActive: true }),
  true,
  "input locks during cascade"
);

console.log("input lock tests passed");
