# Spec: I002-M007-S001: Asset Cache Busting (Query Versioning)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Mobile Safari often serves cached assets after deploys, and hard refresh is not easily accessible.

## Goals

- Provide a simple, mobile-friendly cache-busting mechanism
- Avoid build steps or hashing pipelines

## Non-Goals

- Implementing a full asset pipeline
- Service-worker-based cache management

## Functional Requirements

- Add a cache-buster version string for `main.js` and `style.css`
- Version string is easy to bump without rewriting large files
- Default behavior uses query-string versioning (e.g. `main.js?v=...`)
- Cache-buster value is configurable via a single in-document setting

## Non-Functional Requirements

- Must work on mobile Safari
- Avoid additional network requests beyond assets

## UX Notes

- None

## Definition of Done (DoD)

- Cache-buster exists for JS and CSS assets
- Version can be bumped in one place

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated (not applicable)
- [x] Docs updated
