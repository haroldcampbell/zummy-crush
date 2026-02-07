# Spec: I002-M004-S003: Tuning Controls + Baseline Update

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Animation tuning needs quick iteration to balance readability and speed.

## Goals

- Add config-driven tuning for physics parameters
- Update I002 design baseline once values are chosen

## Non-Goals

- Settings UI

## Functional Requirements

- Physics parameters live in `app/ideas/I002/assets/config/gameplay.json`
- Baseline captures chosen defaults

## Non-Functional Requirements

- Keep adjustments reversible

## UX Notes

- Prefer slightly slower cascades for readability in early tests

## Notes

- Assumption: Defaults are aligned to I001 physics until proven otherwise.

## Definition of Done (DoD)

- Physics tuning is configurable and documented

## Out of Scope

- Accessibility settings

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
