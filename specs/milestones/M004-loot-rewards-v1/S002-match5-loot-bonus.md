# Spec: M004-S002: Match-5 Loot Bonus

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add a loot bonus triggered by match-5 events without depending on power-up activation.

## Goals
- Trigger a loot bonus when a match-5 occurs
- Keep bonus rules configurable

## Non-Goals
- Loot gallery UI
- Economy balancing

## Functional Requirements
- Match-5 event grants a bonus loot drop
- Bonus respects session cap
- Uses shared event contract fields

## Non-Functional Requirements
- Bonus logic is configurable

## UX Notes
- Minimal popup/notification for bonus drops

## Data / State
- Session-only loot inventory

## Decisions
- Bonus applies to match-5 events only
- Bonus can be disabled via config

## Definition of Done (DoD)
- Match-5 bonus loot can be triggered and recorded

## Out of Scope
- Persistent loot inventory

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
