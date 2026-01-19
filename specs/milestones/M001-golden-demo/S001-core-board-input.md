# Spec: M001-S001: Core Board + Input

## Problem Statement

Create a minimal, responsive board that allows tile swaps and visibly reverts invalid swaps.

## Goals

- Render a 3x3 board with A–E tiles
- Support drag-to-swap interactions
- Show swap-back animation when no match is created

## Non-Goals

- Match detection and scoring (handled in M001-S002)
- Timer and session loop (handled in M001-S003)
- Sound or haptics

## Functional Requirements

- Tiles are laid out in a 3x3 grid
- User can swap adjacent tiles
- Invalid swaps visibly revert to original positions

## Non-Functional Requirements

- Mobile-first layout (touch-friendly)
- Input latency feels immediate

## UX Notes

- Use clear selection and swap feedback (visual highlight)
- Reference: `docs/design-baseline.md` for layout, typography, and interaction defaults.

## Data / State

- Board state: 3x3 array of tiles (A–E)
- Swap in progress state

## Open Questions

- Tap-to-swap vs drag-to-swap preference?
  - Decision: drag-to-swap for M001. Tap-to-swap can be explored later (e.g., Blitz).

## Definition of Done (DoD)

- 3x3 board renders and accepts input
- Adjacent swap works
- Invalid swap visibly reverts
- Touch interaction works on mobile-sized viewport

## Decisions / Notes

- Implementation note: S001 treats all swaps as invalid and swaps back (match detection arrives in S002).
- Tests: no automated tests in M001 POC (no harness yet).

## Out of Scope

- Match resolution and refill
- Score updates

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [ ] Tests added/updated
- [x] Docs updated
