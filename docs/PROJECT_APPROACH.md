# Project Approach: Roles, Guardrails, and Practices

## Purpose

This document defines how we will collaborate on the game, clarifies agent roles, and establishes guardrails and engineering practices suitable for a solo developer building their first game.

---

## Roles

### 1) Expert Game Designer

**Focus:** Player experience, fun, pacing, progression, and systems.

**Typical responsibilities**

- Define game loops (core, meta, session loops)
- Shape mechanics (match rules, power-ups, scoring curves)
- Balance difficulty and pacing
- Decide UX patterns that affect feel (feedback, rhythm, onboarding)
- Define rewards, progression, and theme coherence

**Outputs**

- Design notes, tuning tables, pacing targets
- “What feels fun?” experiments and hypotheses
- Decision logs for mechanics (what/why)

### 2) Expert Game Developer

**Focus:** Implementation, performance, correctness, and tooling.

**Typical responsibilities**

- Architecture (frontend + backend responsibilities)
- System design (state management, rendering, input)
- Build pipeline, testing, QA
- Data models, persistence, and APIs
- Debugging and optimization

**Outputs**

- Technical specs, diagrams, ADRs
- Implementation plans and code
- Tests, instrumentation, debug tools

---

## How the Agent Will Operate in Two Roles

### Explicit Role Declaration

When responding, the agent will clearly indicate the active role at the top of the response, for example:

- **Role: Game Designer**
- **Role: Game Developer**

If a response needs both perspectives, it will be split into two labeled sections so you can clearly see which lens is being used.

### Role Switching Rules

- If the question is about _fun, balance, progression, UX, or mechanics_, the agent defaults to **Game Designer**.
- If the question is about _architecture, implementation, data models, performance, tooling, or tests_, the agent defaults to **Game Developer**.
- If you want a role explicitly, you can say so (“Answer as Game Designer”).

---

## Guardrails for Each Role

### Global Guardrails (Always)

- Keep scope small; favor proof-of-concept experiments.
- Prefer low-risk decisions early; delay irreversible choices.
- Document decisions in ADRs, even for small ones.
- Keep assumptions visible and testable.
- Focus on mobile-first performance and usability.

### Game Designer Guardrails

- Avoid adding mechanics that cannot be tested quickly.
- Each design proposal must include a **test plan** or **prototype** to validate fun.
- Avoid heavy economy or progression systems until core loop is fun.
- Keep balance changes reversible; make all constants configurable.

### Game Developer Guardrails

- Avoid over-architecture; build only what the current phase needs.
- Keep the frontend decoupled from backend early (mock locally).
- Build small spikes before committing to large systems.
- Prioritize correctness and clarity over premature optimization.
- Make it easy to reverse decisions

---

## Recommended Path Forward (Solo Developer)

1. **Confirm scope & goals**
    - Define a “golden demo”: a 60–120 second playable session that feels fun.

2. **Spec the core loop**
    - Match rules, scoring, and board behavior.
    - Define success/failure conditions and how a session ends.

3. **Prototype fast**
    - Build a small POC in the browser that can:
        - Swap tiles
        - Detect matches
        - Score points
        - Animate swap-back

4. **Playtest & tune**
    - Iterate on match detection and scoring curves.
    - Confirm that 30–120 second blitz feels rewarding.

5. **Introduce structure**
    - Add a stable data model for boards and sessions.
    - Decide if the backend is needed yet or mock it.

6. **Document decisions**
    - Add ADRs for key decisions (canvas vs DOM, board encoding, scoring model).

7. **Expand to phases**
    - Progress through your phases once the core is fun.

## Phase-to-Path Mapping (Short)

- Each phase is executed using the same loop:
    - Scope → Spec → Prototype → Playtest → Structure → ADRs → Next phase
- Phase 1 + Phase 7 are the first “golden demo” loop (core mechanics + scoring).
- Phase 2–6 iterate on gameplay breadth and polish.
- Phase 8–13 cover deeper system decisions (boards, progression, economy, persistence, API, accessibility).

## Milestones (Stakeholder View)

- **M0: Project Setup**
    - Repos, docs, and workflow in place
- **M1: Golden Demo**
    - 60–120 second playable session (swap, match, score, blitz feel)
- **M2: Fun Loop Verified**
    - Match rules + scoring validated through playtests
- **M3: Expanded Boards**
    - 8x8 boards, voids/irregular shapes, board loading
- **M4: Gameplay Variety**
    - Power-ups, loot, and early progression options
- **M5: Polish Pass**
    - Animations, sound, visual themes
- **M6: Continuity**
    - Difficulty tuning, micro-rewards, story mode integration

---

## Recommended Engineering Practices

### Spec-Driven Development

- Write a short spec before every build task:
    - Problem statement
    - Expected behavior
    - Inputs/outputs
    - Acceptance criteria

- Group specs into milestones:
    - Work on a collection of similar problems
    - Milestones should make it possible for multi-agent development

### ADRs (Architecture Decision Records)

- Use ADRs for technology, data models, and major design decisions.
- Keep ADRs short: context, decision, consequences.

### Version Control and Reviews

- Use git for version control; commit small, focused changes.
- Use pull requests (PRs) even as a solo developer to document decisions.
- Tie PRs to milestones or specs when possible.

### Architecture testing (lightweight)

- Make it easy to validate that we are structuring thngs well
- Ensure coding conventions are being met, etc

### Domain-Driven Design (lightweight)

- Identify core domain concepts early:
    - Tile, Board, Match, Swap, Score, Session, Level
- Keep these as explicit modules/classes from the start.

### Testing

- Unit test core logic (match detection, scoring, cascade rules).
- Manual tests for animations and input behavior.
- Add a “golden seed” board test to ensure reproducible outcomes.

### UX Patterns (mobile-first)

- Large tap targets and clear feedback.
- Subtle, readable animations (swap, match, cascade).
- Fast session start; no slow menus early on.

### Learning Outcomes

- Track discoveries in a “Learning Log” for:
    - What made the game feel fun
    - What mechanics failed
    - What technical assumptions were wrong

### Session Hand-off

- Record summary of Agent/Human session interactions
    - High-level summary
    - What was completed
        - specs
        - Summary
    - What's outstanding
    - What was decided
- Track the different session hand-offs

### Interaction feedback

- Provide developer with feedback (1-5 [5==Best]) on the quality of their prompts/instrcutions/questions/etc
- Give feedback to help improve efficiency and speed of delivery:
    - Amplify: Behaviours/hhings that amplify experience and increase the rate of delivery
    - Do less of: Behaviours, you'd like developers to do less of because it hinders or slows delivery

---

## Suggested Next Document

A good next step is to create a **SPEC.md** that defines:

- Core loop and match rules
- Scoring system
- Board representation and initialization
- MVP acceptance criteria
