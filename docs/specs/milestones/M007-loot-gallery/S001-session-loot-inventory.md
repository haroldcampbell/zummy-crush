# Spec: M007-S001: Session Loot Inventory Model

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Loot drops need a simple, session-only inventory to display in the gallery.

## Goals
- Track loot items in session memory

## Non-Goals
- Persistence or account-level inventory

## Functional Requirements
- Append loot drops to a session list
- Include type and timestamp

## Non-Functional Requirements
- Lightweight data model

## UX Notes
- None

## Data / State
- Session loot list

## Decisions
- Reset on session restart

## Definition of Done (DoD)
- Loot drops stored and retrievable

## Out of Scope
- Inventory persistence

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
