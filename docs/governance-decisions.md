# Governance Decisions

This document captures non‑negotiable governance rules. These are enforced like ADRs and must not be altered except by a new governance decision that supersedes the previous one.

## GD-001: Roadmap Scope Control

- Agents must not create new milestones or specs beyond those listed in `docs/roadmap.md` without explicit user approval.
- If new milestones/specs are desired, update `docs/roadmap.md` first after user approval.

## GD-002: PR Merge Approval

- Agents must not merge PRs into `main` without explicit user approval.

## GD-003: Spec-First Discipline

- Implementation cannot begin until the spec is reviewed and approved.
- Any missing decision must pause implementation until clarified.
