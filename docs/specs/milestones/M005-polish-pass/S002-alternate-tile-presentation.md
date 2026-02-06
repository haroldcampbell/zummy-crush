# Spec: M005-S002: Alternate Tile Presentation Experiment

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Letters may not be the strongest visual identity for a fantasy puzzle game; alternate presentations could improve immediate recognition and theme fit.

## Goals

- Prototype at least two non-letter tile presentations (e.g., gems, colored dots, runes)
- Preserve match readability and quick recognition

## Non-Goals

- Full art pipeline or final asset production
- Changing match mechanics

## Functional Requirements

- Tile rendering supports a configurable visual variant (letters vs alternate)
- Alternate presentation still encodes the same color/category mapping
- Visual treatment is consistent across normal tiles and power-up tiers

## Non-Functional Requirements

- Maintain contrast against the background at 360 x 640
- Keep asset sizes light to avoid load regressions

## UX Notes

- Avoid relying solely on color; add shape or icon differences where possible
- Ensure power-up tiers remain distinct (reuse M004 visual identity cues)

## Data / State

- Tile render variant setting

## Decisions

- Choose one preferred presentation for further refinement; capture in XDR

## Definition of Done (DoD)

- At least two alternate presentations are playable via config toggle
- One preferred direction is selected after quick playtest

## Out of Scope

- Animation/VFX pass

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
