# Multi-Agent Workflow Strategy

## Goal

Enable multiple agents to work independently without duplicating effort or conflicting changes.

## Recommended Structure

- One milestone per agent at a time.
- Each milestone is decomposed into independent specs where possible.
- Each spec has its own branch and PR, or a single PR per milestone if tightly coupled.

## Work Allocation Rules

- Agents do not work on the same spec concurrently.
- Agents do not work on the same milestone concurrently.
- Each PR references:
    - Milestone ID
    - Spec ID
    - Decisions made to unblock work
- If a spec depends on another, mark it explicitly in the spec.

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
10. Open a PR into `main` and wait for explicit approval to merge.
11. After merge approval, delete the branch and remove lock files.

## Stop Conditions

- If a spec requires a decision not captured, stop and request clarification before coding.

## Review Flow

- One agent implements, another reviews (when possible).
- PRs are merged only with explicit user approval.
