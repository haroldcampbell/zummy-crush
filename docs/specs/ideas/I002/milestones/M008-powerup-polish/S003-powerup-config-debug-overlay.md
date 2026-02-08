# Spec: I002-M008-S003: Power-Up Configuration + Debug Overlay

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-up durations and behaviors need to be configurable, and match clarity needs a debug tool.

## Goals

- Make power-up durations and behavior parameters configurable
- Provide a match preview/debug overlay behind a toggle

## Non-Goals

- User-facing UI toggle for production (debug only)

## Functional Requirements

- Config entries for:
  - Void duration (ms)
  - Tornado duration (ms)
  - Tornado path behavior settings
- Debug flag to enable a match preview overlay
- Overlay visualizes potential matches after a snap

## Non-Functional Requirements

- Debug overlay must be off by default

## UX Notes

- Overlay is for testing and tuning only

## Definition of Done (DoD)

- Configuration controls are wired and respected
- Debug overlay works when enabled

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
