# Spec: I002-M003-S003: Readability Pass + Config Toggles

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

We need to tune readability quickly during playtests without code changes.

## Goals

- Allow quick toggles for tile size, gap, and icon scale
- Support swapping between two tile-set variants if needed

## Non-Goals

- Full UI redesign

## Functional Requirements

- Tile size and gap are driven by config
- Icon scale or inset is driven by config
- Tile set is fixed to runes for clarity

## Non-Functional Requirements

- No layout instability during cascades

## UX Notes

- Capture preferred settings after a quick playtest

## Notes

- Assumption: Toggles are handled via config file edits (no settings UI yet).
- Assumption: Tile set is fixed to runes until further notice.

## Data / State

- Tile render config

## Definition of Done (DoD)

- Readability settings can be adjusted without code changes

## Out of Scope

- Settings UI

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
