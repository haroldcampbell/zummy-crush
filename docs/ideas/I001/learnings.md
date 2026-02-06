# Learnings

- Board layouts are now driven by JSON definitions (index + board files) so new masks can be tested without code edits.
- Void masks need explicit handling in collapse logic to keep gaps empty and allow tiles to fall through.
- Initial boards must not start with pre-existing matches.
- Cascades should resolve bottom-first per column with no overlap; only swaps may overlap.
- New tiles should spawn only after space opens during cascades.
- Selected tiles should be indicated by full-tile color instead of an outline.
- Tile gap and board padding should feel balanced (keep them aligned for readability).
- Lightweight physics (repulsion + bounce easing) can improve fall readability without changing grid logic.
