# Spec: M006-S002: Activate Color Clear Power-Up

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Enable activation of color clear power-ups created in earlier slices.

## Goals
- Trigger color clear on swap activation

## Non-Goals
- Power-up chains

## Functional Requirements
- Power-up triggers on swap
- Clear all tiles of a chosen letter

## Non-Functional Requirements
- Activation integrates with cascades

## UX Notes
- Visual feedback on activation

## Play Test
- Swap a color-clear tile with a normal tile and confirm all tiles of the swapped letter clear, the power-up is consumed, and cascades resolve.
- Question: How do I generate a color-tile?
- Answer
- You get a color-clear tile by making an exact 5-in-a-row match.
- Quick ways:
-   - Normal play: line up 5 identical letters in a straight row/column (exact-5 only).
-   - Debug shortcut: set debug.match5Test.enabled to true in app/assets/config/gameplay.json. It will
-     start a board with a guaranteed 5-run so you can spawn one immediately. You can switch mode to
-     horizontal or vertical.

## Data / State
- Power-up type enum

## Decisions
- Activation only via swap (no tap)

## Definition of Done (DoD)
- Color clear power-ups activate and clear tiles

## Out of Scope
- Combined power-up effects

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [ ] Docs updated
