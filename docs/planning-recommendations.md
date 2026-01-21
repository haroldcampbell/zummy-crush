# Planning Recommendations (M002–M004 + Multi-Agent Workflow)

## Intent
Provide recommendations for the next 2–3 milestones, define a multi‑agent strategy, and tie milestones to the IDEA.md phases with a trackable roadmap.

## Goal
Enable small, playable releases that cut across layers (mechanics + rewards + feedback) so multiple agents can deliver in parallel without blocking each other.

---

## Recommendations (High-Level)

1. **Align milestones to IDEA phases**
   - Treat M002–M004 as concrete deliverables for Phase 2 (“game‑play and fun‑ability”).
   - Keep Phase 7–13 as exploration spikes that can inform future milestones.

2. **Ship vertical slices**
   - Each milestone should include a mechanic + reward/feedback element.
   - Avoid layer-only milestones (e.g., “all power-ups first”).

3. **One agent per milestone**
   - Assign one agent to one milestone at a time.
   - Within a milestone, specs should be independent enough to avoid touching the same files in parallel.

4. **Spec readiness before implementation**
   - Use the spec review loop to finalize decisions (tile sizes, mask format, power‑up behaviors).
   - “Open questions” must be resolved before coding begins.

5. **Roadmap as a single source of truth**
   - Use `docs/roadmap.md` as the canonical list of milestones and their status.
   - Each milestone references its spec folder.

6. **Document decisions explicitly**
   - Any decision made during implementation must be added to the spec (Decisions/Notes) and reflected in the PR summary.

---

## Proposed Milestones (Next 3–5)

### M003 – Match‑4 Slice (Power‑Up + Loot + Micro‑Reward)
- **Why now:** adds a new mechanic plus feedback in a single playable slice.
- **Key specs:** match‑4 power‑up, match‑4 loot trigger, micro‑reward for first power‑up, shared event contract v1.

### M004 – Match‑5 Slice (Power‑Up + Loot + Micro‑Reward)
- **Why now:** builds on match‑5 events without requiring power‑up activation.
- **Key specs:** match‑5 power‑up, match‑5 loot bonus, micro‑reward for first match‑5, match‑5 visual identity.

### M006 – Power‑Up Activation Slice + Micro‑Reward
- **Why now:** enables actual use of power‑ups after creation slices are validated.
- **Key specs:** activation rules for line clear + color clear, activation feedback, first‑activation micro‑reward.

### M007 – Loot Gallery Slice
- **Why now:** adds a light meta layer without blocking gameplay flow.
- **Key specs:** session loot inventory model, placeholder gallery UI, HUD entry point.

---

## Multi‑Agent Strategy (Practical)

- **Assignment:** one agent per milestone. Agents do not share spec ownership.
- **Branching:** one branch per spec (preferred), or a single branch per milestone if tightly coupled.
- **Conflict avoidance:** if multiple specs must touch a shared file, assign ownership to a single agent and stagger merges.
- **PR discipline:** no merges without explicit user approval (per principles + AGENTS).

---

## Roadmap Guidance

- Roadmap includes checkboxes for milestones, and each milestone links to its spec folder.
- Specs include Acceptance Checklists to drive completion.

---

## Open Questions to Resolve Before Implementation

- Shared event contract: minimum fields and ownership
- Visual language for power‑ups and loot indicators
- Loot drop cap + thresholds per slice
- Micro‑reward UX (toast vs sparkle vs HUD counters)

---

## Suggested Next Step

- Approve the slicing model and update M003–M007 specs.
- Confirm shared event contract fields.
- Assign one milestone per agent and begin branch work.
