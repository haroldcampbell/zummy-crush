# Spec: M003-S002: Match-4 Loot Trigger (Minimal)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add a minimal loot trigger tied to match-4 events for this slice.

## Goals
- Trigger loot drops on match-4 events
- Keep drop logic minimal and configurable

## Non-Goals
- Full loot economy or gallery UI
- Match-5 loot bonuses

## Functional Requirements
- Loot drop check occurs on match-4 events only
- Drop cap per session (configurable)
- Loot type is a placeholder (card/gem) with simple weighting

## Non-Functional Requirements
- Drop logic must be configurable

## UX Notes
- Minimal popup/notification for drops

## Data / State
- Session-only loot inventory

## Decisions
- Drop evaluation occurs per match event (including cascades)
- If multiple match-4 events occur in a cascade, evaluate each event

## Definition of Done (DoD)
- Match-4 loot drops can be triggered and recorded

## Out of Scope
- Persistent inventory or gallery UI

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
