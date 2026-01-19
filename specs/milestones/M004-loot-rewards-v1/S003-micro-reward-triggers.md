# Spec: M004-S003: Micro-Reward Triggers

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add simple micro-reward triggers (visual feedback) based on gameplay.

## Goals
- Trigger rewards on score thresholds or match streaks
- Show lightweight feedback

## Non-Goals
- Social sharing
- Persistent rewards

## Functional Requirements
- Define threshold rules
- Trigger feedback UI

## Non-Functional Requirements
- No interruption to gameplay flow

## UX Notes
- Subtle, celebratory feedback

## Data / State
- Threshold counters

## Decisions
- Trigger sources: score milestones + match streaks
- Default thresholds (configurable):
  - Score: every 1,000 points
  - Streaks: 3 in a row and 5 in a row
- Frequency control: 5-second cooldown per trigger type, max 6 micro-reward triggers per board session
- Feedback: lightweight animation (sparkle burst) plus small toast/banner

## Definition of Done (DoD)
- Micro-reward triggers fire and display feedback

## Out of Scope
- Sharing features

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
