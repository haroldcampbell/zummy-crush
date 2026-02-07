# I002 - Rotate and Match

This folder contains the idea-scoped docs for I002.

## Run

From repo root:

```sh
cd app/ideas/I002
python3 -m http.server 5173
```

Then open:

- http://localhost:5173/client/

Notes:

- The client expects /assets to be available at the same server root as /client.
- If `debug.enableStateExport` is true, you can fetch the latest state at
  `http://localhost:5173/client/current-game-state.json`.
- If the URL returns 404, reload the page once so the service worker can attach.

## Tests

From repo root:

```sh
node app/ideas/I002/tests/board-logic.test.mjs
node app/ideas/I002/tests/input-lock.test.mjs
```

## Docs

- Idea brief: docs/ideas/I002/idea-brief.md
- Roadmap: docs/ideas/I002/roadmap.md
- Specs: docs/specs/ideas/I002/
- Hand-offs: docs/ideas/I002/hand-offs/
