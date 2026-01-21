# Zummy Crush

## Run The Game (Static Server)

From the repo root:

```sh
cd app
python3 -m http.server 5173
```

Then open:

- `http://localhost:5173/client/`

Notes:

- The client expects `/assets` to be available at the same server root as `/client`.
- Serving from `app/` ensures `client/` and `assets/` resolve correctly.

## Tests

From the repo root:

```sh
node app/tests/board-logic.test.mjs
node app/tests/physics-utils.test.mjs
```

## Branching Convention

- `feature/M00X-S00Y-<short-name>` for spec work
- `chore/M00X-closeout` for milestone documentation updates
