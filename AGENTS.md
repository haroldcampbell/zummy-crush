# AGENTS.md

## Safety & Scope Guardrails

- Operate only within this repo: `/Users/haroldcampbell/work/ai-experiments/zummy-crush`.
- Do not read, write, or modify files outside this project.
- Do not delete files or directories unless explicitly requested.
- Prefer additive changes over destructive edits.
- Optimize for safety over speed.

## Change Confidence

- If uncertain about a change (especially non-reversible changes), stop and ask for confirmation.
- Avoid irreversible operations without explicit user direction.
- Never merge PRs into `main` without explicit user approval.
- Agents must adhere to `docs/principles.md`.

## Decision Records

- ADRs and XDRs are non-breakable once accepted; changes require a new record that supersedes the old one.
- Governance decisions in `docs/governance-decisions.md` are enforced like ADRs and must not be violated.

## Workflow

- Use spec-driven development; link work to a milestone and spec.
- Commit often with small, focused changes.
- Use PRs, even for solo work.
- Required git workflow:
  1) Create a branch
  2) Commit
  3) PR into main
  4) Merge
  5) Delete branch
- Agents must comply with `docs/process.md`, `docs/principles.md`, and `docs/governance-decisions.md`.
