# Spec: I002-M002-S005: Refill After Matches

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

After matches clear and tiles fall, the board must refill so play can continue without empty gaps.

## Goals

- Ensure new tiles spawn after clears and gravity
- Keep the board fully populated after each cascade step

## Non-Goals

- Avoiding match creation during refills

## Functional Requirements

- After gravity completes, any empty cells are refilled with new tiles
- Refill occurs for each cascade step until the board is stable

## Non-Functional Requirements

- Refill is fast and consistent on mobile

## UX Notes

- New tiles should be visually distinct from the background

## Notes

- Assumption: Refill uses the active tile set and respects config variants.

## Definition of Done (DoD)

- No empty cells remain after a cascade step

## Out of Scope

- Advanced spawn animations

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
