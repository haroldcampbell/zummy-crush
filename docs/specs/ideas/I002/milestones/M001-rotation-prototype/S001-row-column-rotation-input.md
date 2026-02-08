# Spec: I002-M001-S001: Row/Column Rotation Input

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The core novelty of I002 is rotating a row or column instead of swapping tiles; we need a reliable input model.

## Goals

- Allow the player to drag exactly one row or one column per move
- Make rotation direction and magnitude obvious during drag

## Non-Goals

- Match resolution
- Gravity or refills

## Functional Requirements

- Pointer down selects the nearest row or column based on initial drag direction
- Dragging horizontally rotates the selected row; dragging vertically rotates the selected column
- Only one line can be active per move
- Drag distance maps to an integer tile offset after release

## Non-Functional Requirements

- Input feels responsive on 360 x 640

## UX Notes

- Delay line selection until a small threshold is crossed to avoid accidental axis choice
- Use a clear highlight for the active row/column

## Notes

- Assumption: Pointer threshold defaults to ~10px before axis selection locks.
- Assumption: Only one pointer is tracked; additional pointers are ignored.

## Data / State

- Active line (row/column index)
- Drag start position
- Current drag offset

## Definition of Done (DoD)

- Player can rotate any row/column via drag, and the game commits the move on release

## Out of Scope

- Invalid move handling (no matches yet)

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
