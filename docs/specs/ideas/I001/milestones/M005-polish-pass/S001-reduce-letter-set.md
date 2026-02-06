# Spec: M005-S001: Reduce Letter Set for Matching

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The current letter set can feel dense on small screens, slowing recognition and increasing misreads.

## Goals

- Improve scan speed and readability by reducing the number of distinct letters
- Keep matches easy to identify at 360 x 640

## Non-Goals

- Changing match rules or cascade behavior
- Removing letters entirely (handled in S002)

## Functional Requirements

- Tile generation supports a configurable, smaller letter set (candidate: 4 letters)
- The game can switch between baseline and reduced letter sets via config
- Pre-match avoidance (XDR-001) remains intact

## Non-Functional Requirements

- No performance regressions in board generation or shuffling

## UX Notes

- Test at least two letter-set sizes (e.g., 4 and 5) for clarity and variety
- Prefer letters with distinct shapes at small sizes (avoid ambiguous forms)

## Data / State

- Tile alphabet configuration (size + values)

## Decisions

- Capture the chosen letter set and rationale in an XDR after quick playtest

## Definition of Done (DoD)

- Reduced letter set can be toggled on/off via config
- Readability improves in at least one quick playtest

## Out of Scope

- Tile art overhaul

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
