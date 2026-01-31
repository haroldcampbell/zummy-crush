# Roadmap

This roadmap is a milestone-based checklist. Each milestone links to its specs.

## Milestones

- [x] M001 - Golden Demo
  - Specs: `specs/milestones/M001-golden-demo/`

- [ ] M002 - Core Board Expansion (8x8 + voids)
  - Specs: `specs/milestones/M002-board-expansion/`
  - Planned: S004 Gravity + Repulsion Feel Experiment

- [ ] M003 - Match-4 Slice (Power-Up + Loot + Micro-Reward)
  - Specs: `specs/milestones/M003-powerups-v1/`

- [ ] M004 - Match-5 Slice (Power-Up + Loot + Micro-Reward)
  - Specs: `specs/milestones/M004-loot-rewards-v1/`

- [ ] M005 - Polish Pass
  - Note: Review tile sizes for readability and feel

- [ ] M006 - Power-Up Activation Slice + Micro-Reward
  - Specs: `specs/milestones/M006-powerup-activation/`

- [ ] M007 - Loot Gallery Slice
  - Specs: `specs/milestones/M007-loot-gallery/`

## Recommended Slicing

Use layer-crossing milestones that ship small, playable slices and avoid coupling between power-ups and loot layers.

### Slice Overview

- M003: Match-4 Slice (Power-Up + Loot + Micro-Reward)
- M004: Match-5 Slice (Power-Up + Loot + Micro-Reward)
- M006: Power-Up Activation Slice + Micro-Reward
- M007: Loot Gallery Slice

### Spec Breakdown

- M003: Match-4 power-up creation, match-4 loot trigger, first power-up micro-reward, shared event contract v1
- M004: Match-5 power-up creation, match-5 loot bonus, first match-5 micro-reward, match-5 visual identity
- M006: Activate line clear, activate color clear, first activation micro-reward, activation feedback
- M007: Session loot inventory, loot tray + activation interaction, loot gallery placeholder, HUD entry point

### Parallelization Pattern

- Agent A: core mechanic spec
- Agent B: loot/reward spec
- Agent C: micro-reward + shared event contract spec

## Notes

- Milestones beyond M007 will be added after validation of core fun/loop.
