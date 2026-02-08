# Spec: I002-M004-S003: Tuning Controls + Baseline Update

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Animation tuning needs quick iteration to balance readability and speed.

## Goals

- Add config-driven tuning for physics parameters
- Update I002 design baseline once values are chosen

## Non-Goals

- Settings UI

## Functional Requirements

- Physics parameters live in `app/ideas/I002/assets/config/gameplay.json`
- Baseline captures chosen defaults

## Non-Functional Requirements

- Keep adjustments reversible

## UX Notes

- Prefer slightly slower cascades for readability in early tests

## Notes

- Assumption: Defaults are aligned to I001 physics until proven otherwise.

## Tuning Reference (Units + Effects)

Animations

- `animations.matchResolveMs` (ms): delay before clearing matched tiles. Higher = slower, more readable; lower = snappier.
- `animations.cascadeMs` (ms): baseline duration for a fall step. Higher = slower falls; lower = faster falls.
- `animations.cascadeStaggerMs` (ms range): per-column delay between falling tiles. Higher = more staggered/stepped; lower = more simultaneous.

Physics

- `physics.gravityPxPerMs` (px/ms): fall speed scaler. Higher = faster falls (shorter duration); lower = slower falls.
- `physics.bounceElasticity` (unitless 0..1): easing wobble on landing. Higher = more bounce; lower = flatter ease.
- `physics.collisionDecel` (unitless 0..1): controls ease-out curve. Higher = stronger ease-out (slower at end); lower = more linear.
- `physics.cascadeSpacingGapMultiplier` (unitless): multiplies `board.gap` to space falling tiles in time. Higher = more spacing between falls.

Other Physics (not currently used in I002)

- `physics.repulsion` (px + unitless): pushes nearby tiles apart to reduce visual overlap; higher `radius`/`strength` increases separation.
- `physics.tap` (ms + unitless): temporary tap scale effect; higher `scaleDown` shrinks more, higher `scaleDurationMs` lasts longer.

## Definition of Done (DoD)

- Physics tuning is configurable and documented

## Out of Scope

- Accessibility settings

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
