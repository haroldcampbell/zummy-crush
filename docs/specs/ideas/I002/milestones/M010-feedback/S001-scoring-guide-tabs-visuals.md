# Spec: I002-M010-S001: Scoring Guide Tabs + Visual Aids

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The scoring guide is long, lacks visuals, and does not explain power-ups.

## Goals

- Add tabbed sections to keep the guide concise
- Show tile visuals next to scoring notes
- Explain power-ups and their progression

## Non-Goals

- New scoring rules
- New power-up mechanics

## Functional Requirements

- Scoring guide is split into tabs:
  - "Scoring" (tile values + match bonuses)
  - "Power-Ups" (square/circle/void/tornado explanations)
- Each tile entry includes a small visual swatch or mini tile icon
- Power-up descriptions include visual indicators (shape + color)
- Tabs are keyboard and touch friendly

## Non-Functional Requirements

- Must render well on mobile screens
- No third-party UI libraries

## UX Notes

- Keep the guide readable in under two screens per tab

## Definition of Done (DoD)

- Tabs switch content without closing the guide
- Visuals appear next to each relevant note

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
