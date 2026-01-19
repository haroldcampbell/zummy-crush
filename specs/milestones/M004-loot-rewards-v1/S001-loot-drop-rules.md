# Spec: M004-S001: Loot Drop Rules

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Define rules for simple loot drops during play.

## Goals
- Basic drop chance model
- Simple loot types (card/gem placeholders)

## Non-Goals
- Rarity balancing
- Economy integration

## Functional Requirements
- Loot drops triggered by match events
- Drops are capped at 5 per board session
- Drops are phase-based (start/mid/end) with configurable thresholds

## Non-Functional Requirements
- Drop logic is configurable

## UX Notes
- Minimal popup/notification for drops

## Data / State
- Loot inventory (session-only)

## Decisions
- Phase model (default, configurable):
  - Start: after 3 match events -> 1 drop
  - Mid: after 10 and 18 match events -> 2 drops (plus a bonus third drop if a match-5+ occurs during mid phase)
  - End: after 26 match events -> remaining 1-2 drops until cap of 5
- Drop checks: evaluated per match event (including cascades)
- Loot types: weighted mix of card/gem placeholders, with weights configurable per phase
- Special matches (match-5+, line clear, color clear) can shift weights toward rarer loot
- Rare loot: at most once per theme per board session

## Definition of Done (DoD)
- Loot can drop and be recorded

## Out of Scope
- Persistent loot inventory

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
