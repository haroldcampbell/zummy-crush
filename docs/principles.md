# Principles

- Build small playable experiments before large refactors.
- Prefer reversible, low-risk decisions early.
- Keep specs tight and testable.
- Use lightweight domain-driven design for core concepts.
- Write tests around core logic and regressions.
- Separate fun-validation from scale-building.
- Treat ADRs/XDRs as durable decisions (supersede, don’t overwrite).
- Never merge PRs into `main` without explicit user approval.
- Favor vertical slices over layer-only milestones.
- Specs should be scoped so a single developer can finish in ~1–3 focused workdays.
- Decouple features via shared event contracts instead of hard dependencies.
- Minimize cross-branch file contention by assigning modules per agent when possible.
