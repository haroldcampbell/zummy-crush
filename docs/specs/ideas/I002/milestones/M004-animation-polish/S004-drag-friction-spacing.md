# Spec: I002-M004-S004: Drag Friction Spacing

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Row/column rotation feels rigid; a subtle spacing shift can sell friction and directionality during drag.

## Goals

- Add a subtle compression in the drag direction
- Add a subtle stretch in the opposite direction
- Keep motion readable and not distracting

## Non-Goals

- Changing the match logic or rotation rules
- Large elastic deformations

## Functional Requirements

- When dragging a row, spacing between tiles along the drag direction compresses slightly
- Spacing in the opposite direction stretches slightly
- Effect is subtle and scales with drag distance
- Effect resets on release/snap

## Non-Functional Requirements

- No layout jitter or tile overlap
- Stable performance at 360 x 640

## UX Notes

- The effect should feel like friction, not rubber bands

## Notes

- Assumption: Implemented as a render-only offset without changing grid state.
- Config: `input.dragFriction` with `enabled`, `maxPx` (px), and `maxTiles` (tiles).
- Repulsion should remain subtle; avoid visible gaps during drag.
- Status: Will not implement due to visual artifacts; see `docs/ideas/I002/xdrs.md` (XDR-002).

## Definition of Done (DoD)

- Dragging shows subtle compression/stretch without affecting final tile positions

## Out of Scope

- Haptics or sound

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete (will not implement per XDR-002)
- [x] Tests added/updated (not applicable)
- [x] Docs updated
