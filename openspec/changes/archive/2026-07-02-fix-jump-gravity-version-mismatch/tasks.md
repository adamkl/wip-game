## 1. Update the constant

- [x] 1.1 Change `GRAVITY` in `src/config.ts` from `3300` to `1800` (world units/s²)
- [x] 1.2 Rewrite the derivation comment to state the literal formula (`0.5 × 4 × 30² = 1800`) and briefly note that the prior `3300` "empirical ~60fps" tuning was based on comparing against a pre-wall-jump revision of the source cart, not a real engine-timing effect
- [x] 1.3 Leave `JUMP_FORCE`, `MOVE_SPEED`, `MOVE_ACCEL`, `MOVE_FRICTION`, `WALL_JUMP_FORCE`, and `WALL_SLIDE_GRAVITY_MULT` unchanged

## 2. Verify against the original

- [x] 2.1 Build (`GITHUB_ACTIONS=true npm run build`) and run `vite preview` — build succeeded with no type errors; used `npm run dev` + Playwright for the scripted measurement below instead of `vite preview`, to avoid base-path complications for a throwaway debug session
- [x] 2.2 Using a temporary `window._k` debug handle (added to `main.ts`, reverted after measuring — not part of the shipped diff), scripted a grounded jump via a real keyboard `Space` press and sampled `player.pos.y` every animation frame
- [x] 2.3 Measured peak: **75.99 world units** — matches the discrete-simulated target (75.6) within <1%, and is within ~7% of the original's measured ~71 wu (well inside the ~10% tolerance)
- [x] 2.4 Screenshot of a mid-air jump shows the arc reaching a height comparable to the nearby floating platforms, consistent with clearing them as before. Confirmed wall/floor collision still resolves correctly (player blocked cleanly at a wall, `isGrounded()` correct). Did not isolate a precise numeric wall-jump measurement — `WALL_JUMP_FORCE`/`WALL_SLIDE_GRAVITY_MULT` are unchanged constants and `WALL_SLIDE_GRAVITY_MULT` is a straight multiplier of `GRAVITY`, so wall-slide fall speed scales proportionally with this fix (softer, not disproportionate) by construction, not by re-measurement

## 3. Update specs and ship

- [x] 3.1 Sync the `player-movement` delta spec into `openspec/specs/player-movement/spec.md` (or archive this change) so the Jump requirement reflects `GRAVITY=1800` and the corrected peak height
- [x] 3.2 Commit `src/config.ts` with a message explaining the version-mismatch root cause, on the designated branch
