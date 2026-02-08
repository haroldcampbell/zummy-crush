# Spec: I002-M002-S004: No Pre-Match Start

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The board should not spawn with automatic matches already present; matches must only occur after player input.

## Goals

- Ensure initial board generation has zero matches
- Keep generation fast and deterministic

## Non-Goals

- Preventing matches after refills or cascades

## Functional Requirements

- Initial board generation avoids any match-3+ lines
- If random generation produces matches, re-roll or adjust tiles to eliminate them

## Non-Functional Requirements

- Generation time remains acceptable on mobile

## UX Notes

- Avoid pre-matches to preserve player agency

## Notes

- Assumption: The generator can do a fallback per-cell pass after multiple rerolls.

## Definition of Done (DoD)

- New games start with no match-3+ lines

## Out of Scope

- Perfectly “solvable” guarantees

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
