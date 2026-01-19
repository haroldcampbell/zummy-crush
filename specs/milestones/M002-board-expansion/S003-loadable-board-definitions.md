# Spec: M002-S003: Loadable Board Definitions

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Load board layouts from a static JSON file to allow multiple boards without code changes.

## Goals
- Define a board JSON format
- Load a board definition at startup
- Support future expansion to multiple boards

## Non-Goals
- Server-side board delivery
- Full board editor

## Functional Requirements
- Board definition contains grid size and mask
- Game uses board definition to initialize grid

## Non-Functional Requirements
- Board file is easy to edit manually

## UX Notes
- None

## Data / State
- Board definition source is local file

## Open Questions
- File location and naming convention TBD

## Definition of Done (DoD)
- Board loads from JSON file
- Swaps/matches respect loaded definition

## Out of Scope
- Dynamic board selection UI

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
