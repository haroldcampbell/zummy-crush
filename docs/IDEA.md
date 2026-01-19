# Game Concept Capture: Letter Match Puzzle (A–E)

## Concept Summary

- Match-3 style puzzle game inspired by Candy Crush and Bejeweled.
- Instead of candy/jewels, the game board uses letter tiles A through E.
- Tile matches and combinations award points based on letter values.

## Tile Set

- Letters: A, B, C, D, E.

## Scoring (Initial Proposal)

- Letter base values follow powers of ten:
    - A = 10^2
    - B = 10^3
    - C = 10^4
    - D = 10^5
    - E = 10^6
- Different combinations of tiles will yield different points (details to be specified in the spec).

## Platform & Experience

- Web-based game built with standard web technologies (HTML, CSS, JavaScript).
- Mobile-first design target; primary experience optimized for phones.

## Frontend Direction

- Canvas for rendering and animation
- HTML-based audio

## Backend Direction

- Rust-based backend to track:
    - Players
    - Points / scores
    - Game assets
    - Sessions
    - Board/maps
    - Other game state as needed

## Phases

- Phase 1: Proof of concept
    - Basic game board:
        - Create a 3x3 board with tiles
        - Make the tiles draggable so that they swap positions with other tiles like Match-3 games
    - Match-3 logic
        - Basic match-3 game logic (with new tiles appearing randomly)
        - Basic game menus (e.g. new game, start game)
    - Game scoring
        - Assign points to different tiles
        - Introduce points for score different types combination
        - Showing game-play scoring

- Phase 2: Game-play and "fun-ability"
    - Selectable boards:
        - Add additional boards beyond 3x3
        - Loadable boards
        - Boards with null/void areas
        - Irregular boards
    - Power-ups:
        - Match 3 power-up
        - Match 4 & 5 power-up
        - Time-based tiles power-up
        - Cascading power-ups
    - Loot
        - Collectable loot (possible cards or rare gems that users collect)
        - Loot-based power-ups that can be applied to board
        - Loot gallery and index (similar to pocket frogs Frog Sets we could have gem or card sets)
    - Level specific:
        - Power-up based on level or level-theme
        - Level specific loot

- Phase 3: Polish
    - Tile animation (when selected)
    - Tile animation (after board loaded)
    - Match animation (i.e. match-3/4/5/row)
    - Background that change based on level
    - Sound FX

- Phase 4: Game-play continuity
    - Adjust difficulty to keep game-play interesting
    - Make game-play simplistic
    - Add micro-rewards
    - Shareable moments (what can we do to get people to share their wins?)

- Phase 5: Polish

- Phase 6: Game-play continuity (Story mode)

### Exploration Phases for Outstanding Items

- Phase 7: Match Rules + Scoring Experiments
    - Define legal swaps, match shapes, and combo/cascade behavior
    - Prototype scoring multipliers and chain bonuses
    - Decide how blitz timing impacts scoring

- Phase 8: Tile Distribution + Board Initialization
    - Explore weighted distributions and difficulty curves
    - Evaluate per-board weights vs global weights
    - Define how predetermined starting states are authored/stored

- Phase 9: Progression + Game Loop Options
    - Compare move-limited vs time-limited vs endless loops
    - Decide how blitz integrates with story mode or as standalone
    - Define level progression and pacing principles

- Phase 10: Economy + Rewards
    - Specify loot types, drop rates, and collection sets
    - Define micro-reward cadence and shareable moments
    - Decide if any rewards affect gameplay balance

- Phase 11: Session + Persistence Model
    - Define anonymous session lifecycle and data retention
    - Decide what is stored client-side vs server-side
    - Establish minimal persistence for POC

- Phase 12: Backend API + Data Models
    - Draft API boundary (frontend vs backend responsibilities)
    - Define core data entities and versioning needs
    - Plan for anti-tamper validation at later stages

- Phase 13: Accessibility + Localization
    - Identify key mobile accessibility requirements (contrast, touch targets)
    - Define localization scope (strings, numeral formats)
    - Ensure sound is optional with clear toggles

## Process & Planning Preferences

- Collaboratively build the spec before development begins.
- Establish guardrails and documentation before implementation.
- This document serves as the initial capture to drive:
    - Roadmap
    - Specifications
    - Designs
    - Development process and workflow
    - Architecture Decision Records (ADRs)

## Decisions / Clarifications (Captured So Far)

- Board expansion:
    - Standard board size target: 8x8 (after 3x3 POC).
    - Voids: one or more gaps in a board where there are no cells.
    - Void/shape encoding: TBD.
- Swap behavior:
    - Allow swaps that do not create a match; swap back with animation.
    - Sound and sound settings are a later-phase feature.
- Blitz mode:
    - Time-limited variant, roughly 30–120 seconds.
- Tile distribution:
    - Likely weighted distribution, exact weights TBD.
    - Predetermined starting state needed for some boards.
    - Per-board configurable weights are a possible feature (TBD).
- Board security:
    - Not a near-term focus; prioritize playability and fun in early phases.
- Editor scope:
    - Internal-only; possibly separate app in the future.
    - POC can be purely procedurally generated.
- Themes:
    - Keep conceptual; avoid specific aesthetic references for now.
