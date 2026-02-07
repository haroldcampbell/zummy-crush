# Spec: I002-M001-S002: Line Wrap + Snap Behavior

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Rotation must wrap within the dragged row or column and snap to an integer offset when released.

## Goals

- Ensure wrap behavior is deterministic and readable
- Snap to the nearest tile offset on release

## Non-Goals

- Match resolution
- Gravity or refills

## Functional Requirements

- A row rotates horizontally with wrap within that row only
- A column rotates vertically with wrap within that column only
- On release, the line snaps to the nearest integer tile offset
- Offset is modulo the line length

## Non-Functional Requirements

- No visual tearing during drag

## UX Notes

- While dragging, show tiles moving continuously; on release, animate a short snap

## Data / State

- Line length (board width/height)
- Computed offset (integer)

## Definition of Done (DoD)

- The wrap and snap behavior matches the expected example (AABC left by 2 -> BCAA)

## Out of Scope

- Match handling

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
