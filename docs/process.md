# Process

This process governs how we move from ideas to specs to implementation. It prioritizes safety, clarity, and incremental progress.

## Workflow (Spec-Driven)

1. Spec definition
    - Draft a spec with scope, non-scope, and DoD.
2. Collaborative spec review
    - Agent asks clarifying questions; spec updated based on discussion.
3. Spec approved
    - Ensure clear boundaries to support multi-agent work.
4. Implementation on branch
    - Work happens on a feature branch (not on main).
    - Main is protected by policy: no direct commits.
5. Spec assignment decision
    - Decide whether the agent works on a single spec or multiple specs.
6. DoD checks
    - Spec and milestone DoDs are verified and checked off.
7. Commit + PR
    - Each spec results in a git commit and a PR (or one PR per milestone if needed).
    - PRs are always from a branch into main.
    - Required workflow:
        1. Create a branch
        2. Commit
        3. PR into main
        4. Merge
        5. Delete branch
8. Testing
    - User runs tests as needed; results recorded.
9. Merge + sync
    - After merge, update local repo head and continue.

## Role Integration

- Each agent response declares its role (Game Designer or Game Developer).
- Design questions go through the Game Designer lens first.
- Implementation questions go through the Game Developer lens first.
- If both roles are needed, responses are split into two labeled sections.

## Feedback Loop

- Agent provides brief feedback on prompt quality (1–5) when appropriate.
- Feedback includes:
    - Amplify: behaviors that improve speed/clarity
    - Do less of: behaviors that slow progress

## Session Hand-offs

- Hand-offs are a log of completed work and decisions from a collaborative session.
- Create a hand-off after the session concludes and just before a PR is opened. Ideally it is the last commit before the PR is created/merged. If more work is committed afterward, update the hand-off or create a new one if it represents a new session.
- Hand-offs are stored in `hand-offs/`.
- Each hand-off includes: summary, completed items, next steps, decisions, risks.
- Hand-off filename format is `yyyy-mm-dd-nn-MXXX-SYYY-<title>.md`.
  - `yyyy` = 4-digit year, `mm` = 2-digit month (01–12), `dd` = 2-digit day (01–31)
  - `nn` = sequence number for that date (01, 02, 03…)
  - `MXXX` = milestone identifier, `SYYY` = spec identifier, `<title>` = short readable slug
- Sequence number resets per date (e.g., `2026-01-19-01`, `2026-01-19-02`, then `2026-01-20-01`).
- Hand-off dates must not be later than the commit date.

## Guardrails

- Safety over speed
- No work outside the repo
- No destructive changes unless explicitly requested
- ADRs and XDRs are immutable; changes require a new record
- Governance decisions in `docs/governance-decisions.md` are mandatory.
