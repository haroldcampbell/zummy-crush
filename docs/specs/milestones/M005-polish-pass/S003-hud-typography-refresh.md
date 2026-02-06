# Spec: M005-S003: HUD Layout + Typography Refresh

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The HUD hierarchy and typography are currently undefined, which weakens readability and overall presentation.

## Goals

- Establish a clear HUD hierarchy for score, moves, and loot
- Select a typography direction that supports a DnD/fantasy feel without hurting readability

## Non-Goals

- Full UI redesign beyond the HUD
- Localization or extensive accessibility work

## Functional Requirements

- HUD layout can be adjusted without altering board logic
- Typography choices are applied consistently across HUD elements
- At least two typography candidates can be toggled for comparison

## Non-Functional Requirements

- Keep text legible at 360 x 640
- Avoid large layout shifts during gameplay

## UX Notes

- Favor a readable display font for headings and a simpler body font for numbers
- Preserve number formatting (thousands separators)

## Data / State

- HUD layout config (spacing, grouping)
- Typography config (font family, sizes, weights)

## Decisions

- Pick a single HUD/typography direction and capture in an XDR
- Update `docs/design-baseline.md` once a direction is chosen

## Definition of Done (DoD)

- HUD readability improves in quick playtest
- A preferred typography direction is selected

## Out of Scope

- New HUD features

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
