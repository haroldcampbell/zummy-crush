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

## Stop Conditions

- If a spec requires a decision not captured, stop and request clarification before coding.

## Review Flow

- One agent implements, another reviews (when possible).
- PRs are merged only with explicit user approval.
