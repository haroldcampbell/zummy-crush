# Portfolio Structure for Multiple Game Ideas

Intent: Enable multiple game ideas to be explored in parallel without contaminating each other, while preserving a lightweight path to promote a winning idea into the core track.

## Goals

- Keep each idea isolated (specs, code, assets, playtests).
- Allow multiple teams to work in parallel with minimal contention.
- Maintain a simple portfolio view of all ideas and their status.
- Promote only validated ideas into shared/core space.

## Proposed Directory Structure

- docs/ideas/
  - <IDEA-ID>/
    - idea-brief.md (1-page experience brief)
    - hypotheses.md
    - risks.md
- docs/specs/ideas/<IDEA-ID>/
  - Specs scoped to that idea only
- docs/playtests/<IDEA-ID>/
  - Playtest notes, rubrics, findings, decisions
- app/ideas/<IDEA-ID>/
  - Isolated prototype code per idea
- app/shared/
  - Explicitly shared code only when two or more ideas need it
- docs/roadmap-ideas.md
  - Portfolio roadmap with status and next experiments
- docs/teams.md
  - Team ownership and active focus per idea

## Idea IDs

- Use I001, I002, etc. for idea identifiers.
- Specs become idea-scoped (e.g., I001-S001).
- Hand-offs include idea ID in filenames for clarity.

## Workflow (Idea Track)

1. Create idea brief (player fantasy, loop, 30-second pitch, first 3 minutes).
2. Define hypotheses and success criteria (testable in 1-3 days).
3. Implement isolated prototype under app/ideas/<IDEA-ID>/.
4. Run quick playtests and log findings in docs/playtests/<IDEA-ID>/.
5. Decide to iterate, pause, or graduate the idea.

## Graduation Rules (Idea to Core)

- At least one playtest shows clear improvement on target metrics.
- The loop is understandable in under 60 seconds without explanation.
- The idea has at least one spec that can be merged into the core roadmap.
- Shared code is promoted only after a second idea demonstrates reuse.

## Governance and Safety

- No cross-idea changes without explicit rationale and review.
- Keep decisions (XDR/ADR) scoped to the idea unless promoted.
- Avoid speculative sharing; default to isolation.

## Open Questions

- What is the minimum success rubric for graduation?
- Which ideas (if any) should share the current core board logic?
- How many concurrent ideas should be active at once?
