# Milestone: I002-M007 - Mobile Gameplay Improvements

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Goal

Improve mobile playability and presentation for I002 without changing core mechanics.

## Scope (In)

- Cache-busting for client assets (mobile-friendly reload)
- Mobile board centering with safe-area padding
- Mobile input ergonomics (touch affordances + layout adjustments)

## Scope (Out)

- New gameplay mechanics
- Particle effects or VFX (moved to M009)
- Power-up behavior changes (M008)

## Success Criteria

- Mobile reload reliably pulls newest assets
- Board is visually centered on mobile (CandyCrush/Bejeweled-style layout)
- Touch interactions feel accurate and readable

## Specs

- [ ] S001 - Asset Cache Busting (Query Versioning)
- [ ] S002 - Mobile Board Centering + Safe-Area Padding
- [ ] S003 - Mobile Input Affordances

## Dependencies

- I002-M003

## Risks

- Mobile layout changes could introduce spacing regressions on desktop
