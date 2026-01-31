# Multi-Agent Workflow Strategy

## Goal

Enable multiple agents to work independently without duplicating effort or conflicting changes.

## Recommended Structure

- One milestone per agent at a time.
- Each milestone is decomposed into independent specs where possible.
- Each spec has its own branch and PR, or a single PR per milestone if tightly coupled.

## Recommended Slicing (Layer-Crossing)

To reduce coupling and enable true parallel delivery, milestones should be vertical slices that include a mechanic + reward/feedback layer rather than layer-only milestones.

### Slicing Model

- M003: Match-4 Slice (Power-Up + Loot + Micro-Reward)
- M004: Match-5 Slice (Power-Up + Loot + Micro-Reward)
- M006: Power-Up Activation Slice + Micro-Reward
- M007: Loot Gallery Slice

When adding or revising milestones, prefer these slice boundaries and avoid introducing dependencies between M003 and M004.

### Parallelization Pattern

- Agent A: core mechanic spec
- Agent B: loot/reward spec
- Agent C: micro-reward + shared event contract spec

### Shared Event Contract Guidance

To keep slices decoupled, emit a minimal match-event payload from match resolution:

- match length
- match orientation
- swap origin (if any)
- cascade index
- stable event id or timestamp

Consumers (loot, micro-rewards) depend only on payload fields.

### Risks

- Event contract instability can create merge conflicts
- Shared files (e.g., `app/client/main.js`) can become hotspots if modules are not split
## Work Allocation Rules

- Agents do not work on the same spec concurrently.
- Agents do not work on the same milestone concurrently.
- Each PR references:
    - Milestone ID
    - Spec ID
    - Decisions made to unblock work
- If a spec depends on another, mark it explicitly in the spec.

## Assignment Protocol

- The user (or a designated coordinator) assigns milestones/specs in a shared note or hand-off.
- Agents claim assignments by creating lock files with the assigned milestone/spec and their branch name.
- If no assignment exists, agents should stop and ask for assignment before creating locks.

## Orchestration Process

- Agents create lock files before starting work:
    - `locks/milestone.MXXX.lock`
    - `locks/spec.MXXX-SYYY.lock`
    - Lock files include: agent name, branch name, start time, and short intent note
- Agents will not start working on a spec if a corresponding lock file already exists
- Source of truth for availability:
    - `specs/milestones.md` for milestone availability
    - `specs/milestones/<Milestone>/milestone.md` for spec availability
- Once an agent has completed their work, they will:
    - update the checklist for the specs and milestone
    - create sesion hand-off, commit their code to the branch, and create the PRs
    - update their `logs/agent-<id>.status.md` with completed PRs/specs and current status
    - remove the .lock files
    - move on to the next available milestone
- Agents should follow the Multi-Agent Kickoff Checklist before starting implementation work.

## Lock TTL + Recovery

- Lock TTL is 24 hours unless extended in the lock file.
- If a lock is stale, agents must request user confirmation before removing it.

## Branching Convention

- `feature/M00X-S00Y-<short-name>` for spec work
- `chore/M00X-closeout` for milestone documentation updates

## Conflict Avoidance

- Specs should target distinct files/modules when possible.
- Shared files (e.g., `app/client/main.js`) should be edited by one agent at a time.
- If shared file edits are needed, coordinate by creating a stub PR and locking the file for that agent.

## Spec Readiness Checklist

Before work begins, confirm:

- Local `main` is up to date
- Lock files do not exist for the target milestone/spec
- Scope and non-scope are explicit
- Decisions are captured or flagged as open
- Acceptance checklist is complete

## Multi-Agent Kickoff Checklist

1. Confirm the spec is approved and all open questions are resolved.
2. Pull latest `main` and create a branch with the naming convention.
3. Create lock files for the milestone/spec (include agent name, branch, start time, intent).
4. Re-check `specs/milestones.md` and the milestone spec folder to confirm availability.
5. Log planned scope and any constraints in the lock file or hand-off draft.
6. Implement only the assigned spec; avoid cross-spec changes.
7. Commit regularly (small, focused commits).
8. Add/update tests for core logic and regressions where applicable.
9. Write a session hand-off in `hand-offs/` before opening the PR.
10. Ensure the worktree `origin` remote points to the GitHub repo (copy the URL from `main`).
11. Open a PR into `main` using the git-control MCP tools and wait for explicit approval to merge.
12. After merge approval, delete the branch and remove lock files.

## Stop Conditions

- If a spec requires a decision not captured, stop and request clarification before coding.

## Review Flow

- One agent implements, another reviews (when possible).
- PRs are merged only with explicit user approval.

## Rebase Standard

- Before opening a PR, rebase your feature branch onto `origin/main` to incorporate the latest shared changes.
- Resolve any conflicts during the rebase; do not force-update `main`.
