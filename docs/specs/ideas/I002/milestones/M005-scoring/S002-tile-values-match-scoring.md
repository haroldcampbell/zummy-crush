# Spec: I002-M005-S002: Tile Value Table + Match Scoring

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Matches should convert to points using a clear, tunable value table.

## Goals

- Assign values per tile type
- Award points for each matched tile
- Add a small bonus for matches longer than 3

## Non-Goals

- Complex multipliers or streak bonuses

## Functional Requirements

- Each tile type has a base value
- Score adds base value per tile in a match
- Matches of length 4+ receive a configurable bonus per extra tile

## Non-Functional Requirements

- Scoring does not slow cascade resolution

## UX Notes

- Keep values small for early playtests (easy to reason about)

## Notes

- Assumption: Base values use a simple 10/20/30/40 scale by tile type.
- Assumption: Bonus per extra tile defaults to +5.

## Definition of Done (DoD)

- Score increases deterministically based on match contents

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
