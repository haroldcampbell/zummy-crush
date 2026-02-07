# Spec: I002-M005-S003: Configurable Scoring Parameters

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Scoring needs to be tunable during playtests without code changes.

## Goals

- Store tile values and bonuses in config
- Allow easy tweaks between sessions

## Non-Goals

- Runtime settings UI

## Functional Requirements

- Tile value table is read from config
- Bonus per match length is read from config

## Non-Functional Requirements

- Defaults exist for all tile types in the active tile set

## UX Notes

- Keep config naming simple and explicit

## Notes

- Assumption: Config lives in `app/ideas/I002/assets/config/gameplay.json`.

## Definition of Done (DoD)

- Changing config values updates scoring without code changes

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
