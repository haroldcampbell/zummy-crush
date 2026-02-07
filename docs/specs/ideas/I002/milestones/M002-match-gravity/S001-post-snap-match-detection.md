# Spec: I002-M002-S001: Post-Snap Match Detection

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Matches must resolve only after a row/column rotation completes and snaps into place.

## Goals

- Detect straight-line matches (3+) after snap
- Ensure no matches resolve during drag

## Non-Goals

- L/T shapes or special pattern detection

## Functional Requirements

- Match scan triggers only after the snap completes
- Detect horizontal and vertical runs of length 3+
- No mid-drag match previews or resolves

## Non-Functional Requirements

- Match scan should be fast enough for cascade loops

## UX Notes

- Consider a short settle delay before the first match resolve for clarity

## Data / State

- Board grid state post-snap

## Definition of Done (DoD)

- After any rotation move, matches resolve only after snap and trigger clears

## Out of Scope

- Power-up creation

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
