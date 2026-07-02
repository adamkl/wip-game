## 1. Update the constant

- [ ] 1.1 Change `GRAVITY` in `src/config.ts` from `3300` to `1800` (world units/s²)
- [ ] 1.2 Rewrite the derivation comment to state the literal formula (`0.5 × 4 × 30² = 1800`) and briefly note that the prior `3300` "empirical ~60fps" tuning was based on comparing against a pre-wall-jump revision of the source cart, not a real engine-timing effect
- [ ] 1.3 Leave `JUMP_FORCE`, `MOVE_SPEED`, `MOVE_ACCEL`, `MOVE_FRICTION`, `WALL_JUMP_FORCE`, and `WALL_SLIDE_GRAVITY_MULT` unchanged

## 2. Verify against the original

- [ ] 2.1 Build (`GITHUB_ACTIONS=true npm run build`) and run `vite preview`
- [ ] 2.2 Using the `window._k` debug handle, script a grounded, unobstructed jump and measure the peak height
- [ ] 2.3 Confirm the measured peak lands within ~10% of ~75 world units (the discrete-simulated target for `JUMP_FORCE=540`/`GRAVITY=1800`); if not, investigate before adjusting further rather than re-introducing an empirical multiplier
- [ ] 2.4 Visually sanity-check 2-3 jumps around the level (including at least one wall-jump) to confirm arcs still clear the platforms they need to, and that the jump doesn't now feel "too floaty" compared to the original

## 3. Update specs and ship

- [ ] 3.1 Sync the `player-movement` delta spec into `openspec/specs/player-movement/spec.md` (or archive this change) so the Jump requirement reflects `GRAVITY=1800` and the corrected peak height
- [ ] 3.2 Commit `src/config.ts` with a message explaining the version-mismatch root cause, on the designated branch
