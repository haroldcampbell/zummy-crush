# Spec: M002-S004: Gravity + Repulsion Feel Experiment

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Tile cascades feel too block-like and lack physicality. We need a lightweight, visual-only physics feel to improve perceived realism without altering gameplay outcomes.

## Goals

- Add a lightweight, visual-only gravity/repulsion model for falling tiles
- Make collisions feel physical via deceleration and a subtle bounce
- Allow per-tile repulsion to spike on tap and decay over time
- Keep 60fps on mobile baseline
- Make all physics parameters configurable via JSON

## Non-Goals

- Affecting match outcomes or final grid positions
- Power-ups, board selection UI, or non-physics features
- Full physics engine or rigid-body simulation

## Functional Requirements

- Falling tiles animate with a visible deceleration on collision and a minimal bounce
- Repulsive field (per tile) can be increased by tap and decays back to zero
- Repulsion interaction is visual-only (no grid logic changes)
- Visual collision uses an invisible “buffer” radius around each tile
- Overlap during cascades is not allowed except for swaps
- Physics parameters are loaded from `app/assets/config/gameplay.json`
- Maintain 60fps (profile and keep computations lightweight)

## Non-Functional Requirements

- Deterministic feel per config (same config yields same motion profile)
- Configurable values allow quick tuning during playtests

## UX Notes

- Tap feedback should include a brief scale-down to imply z-axis impact
- Repulsion should be subtle; no chaotic jitter

## Data / State

- New physics config block in `gameplay.json`
- Per-tile transient values: repulsion strength, decay timer, and optional scale

## Decisions

- Approach: lightweight, damped spring/repulsion interpolation (not a full physics engine)
- Repulsion is applied as a small offset in render only
- Collision response uses deceleration + small bounce tuned via config
- Tap increases repulsion strength and triggers a brief scale-down effect

## Proposed Config Fields (gameplay.json)

- `physics.enabled` (boolean)
- `physics.gravityPxPerMs` (number)
- `physics.collisionDecel` (number)
- `physics.bounceElasticity` (0-1)
- `physics.repulsionRadius` (px)
- `physics.repulsionStrength` (number)
- `physics.repulsionDecayMs` (number)
- `physics.tapRepulsionBoost` (number)
- `physics.tapScaleDown` (0-1 scale factor)
- `physics.tapScaleDurationMs` (number)

## Definition of Done (DoD)

- Visual-only physics is in place and configurable
- Tap repulsion and scale-down effect function and decay properly
- Cascades remain readable and stable at 60fps

## Out of Scope

- Grid logic changes or match logic changes
- Power-ups, board selection UI, or other milestones

## Acceptance Checklist

- [x] Spec reviewed
- [x] Physics config block added
- [x] Tap repulsion + scale-down implemented
- [x] Cascades show deceleration + minimal bounce
- [x] No overlap during cascades (except swap)
- [ ] ~60fps target verified on mobile baseline~ (Won't ~do)
- [x] Tests added/updated
- [x] Docs updated
