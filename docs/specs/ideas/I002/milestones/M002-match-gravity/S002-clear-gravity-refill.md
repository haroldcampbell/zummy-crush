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

## Data / State

- Empty cell tracking per column

## Definition of Done (DoD)

- Clearing and refilling works across multi-cascade sequences

## Out of Scope

- Score or rewards

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
