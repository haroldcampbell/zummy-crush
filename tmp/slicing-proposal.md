# Slicing Proposal: Layer-Crossing Milestones for Parallel Delivery

Date: 2026-01-19

## Goal

Deliver small, playable slices that cut across layers (power-ups + loot + micro-rewards) with minimal coupling so multiple agents can work in parallel. Avoid “layer-only” milestones.

## Guiding Principles

- Each milestone should ship a playable, testable slice of the core loop.
- Specs should be small enough for 1–3 days and minimally coupled.
- Feature slices should be decoupled by shared event contracts instead of feature-to-feature dependencies.
- Avoid cross-branch file contention by assigning different files/modules per agent when possible.

## Proposed Milestone Restructure (Layer-Slicing)

### M003: Match-4 Slice (Power-Up + Loot + Micro-Rewards)

Playable slice: introduce match-4 power-up, a basic loot drop tied to match-4, and a simple micro-reward trigger.

Specs:

- M003-S001: Match-4 Power-Up Creation
    - Detect match-4; spawn line-clear power-up tile.
- M003-S002: Match-4 Loot Trigger (Minimal)
    - Loot drops triggered by match-4 events only; cap per session.
- M003-S003: Micro-Reward: “First Power-Up Created”
    - One-time toast/sparkle when first match-4 power-up appears.
- M003-S004: Shared Event Contract v1
    - Define “match event” payload (match length, swap origin, cascade index).

Parallelization:

- Agent A: S001
- Agent B: S002
- Agent C: S003 + S004

Dependencies:

- M002 board expansion only.

---

### M004: Match-5 Slice (Power-Up + Loot + Micro-Rewards)

Playable slice: match-5 power-up + related loot bonus + a different micro-reward.

Specs:

- M004-S001: Match-5 Power-Up Creation
    - Detect match-5; spawn color-clear power-up tile.
- M004-S002: Match-5 Loot Bonus
    - Add bonus loot drop on match-5 events using shared event contract.
- M004-S003: Micro-Reward: “First Match-5”
    - One-time celebratory feedback.
- M004-S004: Match-5 Visual Identity
    - Stronger visual marker for match-5 tile.

Parallelization:

- Agent A: S001
- Agent B: S002
- Agent C: S003 + S004

Dependencies:

- M003-S004 Shared Event Contract v1 (or redefined in M004 if needed).

---

### M006: Power-Up Activation Slice + Micro-Reward

Playable slice: enable activation rules for existing power-ups and add a micro-reward for first activation.

Specs:

- M006-S001: Power-Up Activation (Line Clear)
- M006-S002: Power-Up Activation (Color Clear)
- M006-S003: Micro-Reward: “First Power-Up Activation”
- M006-S004: Activation Feedback (VFX + sound placeholder)

Parallelization:

- Agent A: S001
- Agent B: S002
- Agent C: S003 + S004

Dependencies:

- M003/M004 power-up creation completed.

---

### M007: Loot Gallery Slice

Playable slice: minimal gallery UI showing loot collected during session.

Specs:

- M007-S001: Loot Inventory Model (Session-Only)
- M007-S002: Loot Gallery Placeholder UI
- M007-S003: HUD Entry Point

Parallelization:

- Agent A: S001
- Agent B: S002
- Agent C: S003

Dependencies:

- Loot drops already tracked in M003/M004.

---

## How This Enables Parallel Work

- Each milestone includes both gameplay and reward feedback, keeping releases playable.
- Specs are small and orthogonal; different agents touch different modules.
- Shared event contract minimizes cross-feature coupling.

## Suggested File Ownership to Reduce Conflicts

- Match detection / board logic: `app/client/board-logic.mjs`
- Power-up tiles / types: `app/client/powerups/*.mjs` (new folder)
- Loot logic: `app/client/loot/*.mjs` (new folder)
- Micro-rewards UI: `app/client/hud/*.mjs` (new folder)

## Gaps / Open Questions

1. Match Event Contract: what exact fields should it include (match length, swap origin, cascade index, tile types, power-up created)?
2. Visual asset approach: Do we want simple color/shape changes or new art for power-ups/loot?
3. Loot economy scope: Should loot drops be purely cosmetic in these slices?
4. Micro-reward UX: Should these be toasts, sparkles, or HUD counters?
5. Sound: Are we adding placeholders now or deferring?

## Risks

- Shared event contract may still cause contention if not stable early.
- Multiple agents changing `main.js` can conflict without modularization.

## Proposed Next Steps

1. Approve milestone slicing changes and update `docs/roadmap.md` + milestone specs.
2. Add a “Shared Event Contract v1” spec for the first slice.
3. Refactor minimal module boundaries to reduce conflicts.
4. Incorporate `## Guiding Principles` and `## Goal` into existing documents
5. Create a non-product spec to introduce the “Expert Agile Coach” role

## Note: Agile/XP Coach Role

Recommend adding an “Expert Agile Coach” role to guide slicing, WIP limits, and coordination practices.

# User Decision

DECISION: I accept this proposal. Please proceed with the Next Steps.
