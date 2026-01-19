# Multi-Agent Workflow Strategy

## Goal
Enable multiple agents to work independently without duplicating effort or conflicting changes.

## Recommended Structure

- One milestone per agent at a time.
- Each milestone is decomposed into independent specs where possible.
- Each spec has its own branch and PR, or a single PR per milestone if tightly coupled.

## Work Allocation Rules

- Agents do not work on the same spec concurrently.
- Each PR references:
  - Milestone ID
  - Spec ID
  - Decisions made to unblock work
- If a spec depends on another, mark it explicitly in the spec.

## Branching Convention

- `feature/M00X-S00Y-<short-name>` for spec work
- `chore/M00X-closeout` for milestone documentation updates

## Conflict Avoidance

- Specs should target distinct files/modules when possible.
- Shared files (e.g., `app/client/main.js`) should be edited by one agent at a time.
- If shared file edits are needed, coordinate by creating a stub PR and locking the file for that agent.

## Spec Readiness Checklist

Before work begins, confirm:
- Scope and non-scope are explicit
- Decisions are captured or flagged as open
- Acceptance checklist is complete

## Review Flow

- One agent implements, another reviews (when possible).
- PRs are merged only with explicit user approval.
