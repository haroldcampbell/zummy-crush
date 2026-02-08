# Milestone: I002-M004 - Animation Polish (Physics-Based)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Goal

Improve spawn and cascade animations so new tiles fall in with a physical feel similar to I001.

## Scope (In)

- Physics-driven spawn and cascade motion (reuse I001 physics model)
- Smoother snap and settle timing
- Config-driven tuning for gravity and bounce

## Scope (Out)

- New gameplay mechanics
- Sound or VFX

## Success Criteria

- New tiles fall in with visible motion instead of appearing instantly
- Cascades are readable and feel physical

## Specs

- [x] S001 - Port Physics Utilities from I001
- [x] S002 - Physics-Based Spawn + Cascade Animation
- [x] S003 - Tuning Controls + Baseline Update
- [x] S004 - Drag Friction Spacing (WNI; XDR-002)

## Dependencies

- I002-M003

## Risks

- Animation timing might slow input feel if over-tuned
