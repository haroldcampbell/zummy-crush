# Game Brief: Letter Match Puzzle (A–E)

## Intent

Ship a fun, fast, mobile-first match puzzle with the least user effort and shortest path to “fun.”

## Concept Summary

- Match-3 style puzzle with letter tiles A–E (instead of candy/jewels).
- Core loop: swap → match → score → refill → cascade.
- Sessions favor short, replayable bursts.

## Tile Set + Scoring (Baseline)

- Letters: A, B, C, D, E.
- Base values: A=10^2, B=10^3, C=10^4, D=10^5, E=10^6.
- Combos and bonuses are defined per spec.

## Platform + Experience

- Web-based client (HTML/CSS/JS), mobile-first.
- Canvas-based rendering and animation.
- Audio via HTML (later phase).

## Backend Direction (Later)

- Rust backend for players, sessions, boards, and assets (not in near-term scope).

## Session Mode

- No persistence in early phases.
- Timer-based sessions are deferred (see Future Exploration).

## Near-Term Scope (Now)

- See `docs/ideas/I001/roadmap.md` for milestones and `docs/specs/ideas/I001/` for details.
- Early focus: board expansion, power-up creation, loot triggers, activation, and minimal gallery UI.

## Future Exploration (Later)

- Blitz-style sessions (30–120 seconds configurable).
- Match rules and scoring experiments.
- Tile distribution and board initialization strategies.
- Progression and game loop options.
- Economy/rewards and persistence.
- Backend API and data models.
- Accessibility and localization.

## Decisions (Current)

- Board expansion targets 8x8 after the 3x3 POC.
- Voids are supported via masks (format defined in specs).
- Invalid swaps swap back with animation.
- Blitz mode is the default early session loop.
- Security, editor tooling, and themes are deferred.
