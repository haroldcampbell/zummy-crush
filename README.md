# Zummy Crush

## Run The Game (Static Server)

From the repo root (pick an idea):

```sh
cd app/ideas/I001
python3 -m http.server 5173
```

```sh
cd app/ideas/I002
python3 -m http.server 5173
```

Then open:

- `http://localhost:5173/client/`

Notes:

- The client expects `/assets` to be available at the same server root as `/client`.
- Serving from `app/ideas/I001/` ensures `client/` and `assets/` resolve correctly.
- Serving from `app/ideas/I002/` ensures `client/` and `assets/` resolve correctly.

## Tests

From the repo root:

```sh
node app/ideas/I001/tests/board-logic.test.mjs
node app/ideas/I001/tests/physics-utils.test.mjs
node app/ideas/I002/tests/board-logic.test.mjs
```

## Branching Convention

- `feature/M00X-S00Y-<short-name>` for spec work
- `chore/M00X-closeout` for milestone documentation updates

## Documentation

- Start here: `docs/index.md`
