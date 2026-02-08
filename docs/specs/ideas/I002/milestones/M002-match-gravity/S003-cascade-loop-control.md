# Spec: I002-M002-S003: Cascade Loop Control

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Rotation moves can create multi-step cascades; we need a stable loop that resolves until no matches remain.

## Goals

- Resolve cascades until the board is stable
- Avoid infinite loops or premature stops

## Non-Goals

- Complex chain scoring

## Functional Requirements

- After each clear + gravity + refill, re-scan for matches
- Stop when no matches are present
- Track cascade index for future reward hooks

## Non-Functional Requirements

- Loop should not block input longer than necessary

## UX Notes

- Consider a subtle per-cascade delay to improve readability

## Notes

- Assumption: A short per-cascade delay (~180ms) is acceptable for clarity.

## Data / State

- Cascade index counter

## Definition of Done (DoD)

- Cascades resolve correctly and stop when stable

## Out of Scope

- Reward triggers

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
