# Spec: I002-M001-S003: Input Feedback and Constraints

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Rotation input needs strong feedback so players understand which line is active and when a move is valid.

## Goals

- Make the active row/column obvious during drag
- Prevent multi-line or diagonal inputs

## Non-Goals

- Match feedback

## Functional Requirements

- Highlight the active row/column while dragging
- Lock to a single axis once selection is determined
- Ignore additional pointers while a move is active
- Cancel the move if the pointer is released before the selection threshold

## Non-Functional Requirements

- Feedback remains readable on small screens

## UX Notes

- Consider slight scale or tint on active tiles

## Data / State

- Input state (idle, selecting, dragging, snapping)

## Definition of Done (DoD)

- Players can consistently identify the active line and complete a move without confusion

## Out of Scope

- Sound or haptics

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
