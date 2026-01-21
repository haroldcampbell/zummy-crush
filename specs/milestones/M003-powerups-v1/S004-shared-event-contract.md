# Spec: M003-S004: Shared Event Contract v1

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Parallel feature work needs a shared, minimal match-event contract to avoid coupling between power-ups, loot, and micro-rewards.

## Goals
- Define a minimal match-event payload
- Keep the contract stable and backward-compatible

## Non-Goals
- Full analytics or telemetry schema
- Power-up activation events (handled in later slices)

## Functional Requirements
- Event emitted on each match resolution (including cascades)
- Payload includes: match length, match orientation, swap origin (if any), cascade index
- Event includes a stable event id or timestamp for sequencing

## Non-Functional Requirements
- Contract must be simple and usable across features

## UX Notes
- None

## Data / State
- Match event payload stored or passed during resolution

## Decisions
- Contract owned by match resolution logic
- Consumers (loot, micro-rewards) depend only on payload fields

## Definition of Done (DoD)
- Contract defined and documented

## Out of Scope
- Power-up activation events

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
