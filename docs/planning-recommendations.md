# Planning Recommendations (M002–M004 + Multi-Agent Workflow)

## Intent
Provide recommendations for the next 2–3 milestones, define a multi‑agent strategy, and tie milestones to the IDEA.md phases with a trackable roadmap.

---

## Recommendations (High-Level)

1. **Align milestones to IDEA phases**
   - Treat M002–M004 as concrete deliverables for Phase 2 (“game‑play and fun‑ability”).
   - Keep Phase 7–13 as exploration spikes that can inform future milestones.

2. **One agent per milestone**
   - Assign one agent to one milestone at a time.
   - Within a milestone, specs should be independent enough to avoid touching the same files in parallel.

3. **Spec readiness before implementation**
   - Use the spec review loop to finalize decisions (tile sizes, mask format, power‑up behaviors).
   - “Open questions” must be resolved before coding begins.

4. **Roadmap as a single source of truth**
   - Use `docs/roadmap.md` as the canonical list of milestones and their status.
   - Each milestone references its spec folder.

5. **Document decisions explicitly**
   - Any decision made during implementation must be added to the spec (Decisions/Notes) and reflected in the PR summary.

---

## Proposed Milestones (Next 2–3)

### M002 – Core Board Expansion (8x8 + voids)
- **Why now:** expands the playable space and sets up future irregular boards.
- **Key specs:** 8x8 layout, void masks, loadable board definitions.

### M003 – Power‑Ups v1
- **Why now:** introduces new “fun” mechanics without full economy.
- **Key specs:** match‑4 power‑up, match‑5 power‑up, activation rules.

### M004 – Loot + Micro‑Rewards v1
- **Why now:** adds light engagement without full progression/economy.
- **Key specs:** loot drops, gallery placeholder, micro‑reward triggers.

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

- M002: board mask format (JSON schema)
- M002: tile size + spacing targets for 8x8 mobile
- M003: power‑up effects (row/column clear vs area)
- M004: loot drop rates and trigger thresholds

---

## Suggested Next Step

- Review and approve M002–M004 specs.
- Confirm decisions for open questions.
- Assign one milestone per agent and begin branch work.
