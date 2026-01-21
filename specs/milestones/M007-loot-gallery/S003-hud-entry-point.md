# Spec: M007-S003: HUD Entry Point

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Players need a simple way to open the loot gallery during play.

## Goals
- Add a small HUD button to open the gallery

## Non-Goals
- Complex navigation

## Functional Requirements
- HUD button opens the gallery overlay
- Button is visible but unobtrusive

## Non-Functional Requirements
- No interruption to gameplay flow

## UX Notes
- Small icon or label

## Data / State
- HUD state: gallery open/closed

## Decisions
- Default hidden until loot is earned (optional)

## Definition of Done (DoD)
- Gallery can be opened from HUD

## Out of Scope
- Progression UI

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
