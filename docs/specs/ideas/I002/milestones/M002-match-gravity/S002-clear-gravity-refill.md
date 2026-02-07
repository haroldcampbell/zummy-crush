# Spec: I002-M002-S002: Clear + Gravity + Refill

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

After matches clear, tiles should fall and refill to keep the loop intact.

## Goals

- Clear matched tiles
- Apply gravity and refill until the board stabilizes

## Non-Goals

- Special power-up effects

## Functional Requirements

- Clear matched tiles after detection
- Apply gravity bottom-first per column (align with XDR-002)
- Spawn new tiles only when space opens (align with XDR-003)

## Non-Functional Requirements

- No overlap during cascades (align with XDR-002)

## UX Notes

- Keep cascade timing similar to I001 for readability

## Notes

- Assumption: I002 adopts bottom-first cascades and no-overlap behavior (aligned with I001 XDR-002).
- Assumption: Spawn only after space opens (aligned with I001 XDR-003).

## Data / State

- Empty cell tracking per column

## Definition of Done (DoD)

- Clearing and refilling works across multi-cascade sequences

## Out of Scope

- Score or rewards

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
