# Spec: I002-M006-S005: Configurable Power-Up Tuning

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-up behavior and visuals should be tunable during playtests.

## Goals

- Expose power-up toggles and parameters in config
- Keep default values sensible for early tests

## Non-Goals

- Settings UI

## Functional Requirements

- Power-up enable flags in config
- Power-up clear parameters in config (line direction, color clear scope)
- Mega power-up clear scope in config

## Non-Functional Requirements

- Safe defaults when config values are missing

## UX Notes

- Keep config names explicit

## Notes

- Assumption: Config lives in `app/ideas/I002/assets/config/gameplay.json`.

## Definition of Done (DoD)

- Changing config alters power-up behavior without code changes

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
