## 1. Update the constant

- [x] 1.1 Change `GRAVITY` in `src/config.ts` from `1800` to `3300` (world units/s²), updating the derivation comment to note it's empirically tuned rather than a literal 30fps conversion
- [x] 1.2 Leave `JUMP_FORCE` unchanged at `720`

## 2. Verify against measured target

- [x] 2.1 Build (`GITHUB_ACTIONS=true npm run build`) and run `vite preview`
- [x] 2.2 Using the `window._k.k` debug handle (as in this session's investigation), script a grounded, unobstructed jump and measure the peak height
- [x] 2.3 Confirm the measured peak lands within ~5% of 71 world units; if not, adjust `GRAVITY` and re-measure until it does — measured 72.46 (target 71, ~2% off). Note: discovered `game.ts` had `k.setGravity(1800)` hardcoded instead of importing `GRAVITY` from config — fixed as part of this task, otherwise the config change would have had no effect at all.
- [x] 2.4 Visually sanity-check 2-3 other jumps around the level (not just the calibration spot near the right wall) to confirm the arc still clears the platforms it needs to — tested 4 locations (spawn, small floating platform, right-wall ledge, left-wall floor), all measured 71-72 world units consistently; screenshots confirm platforms are still cleared normally

## 3. Update specs and ship

- [x] 3.1 Archive this change (`openspec archive retune-jump-physics`) so `openspec/specs/player-movement/spec.md` picks up the modified Jump requirement
- [ ] 3.2 Commit `src/config.ts` on a new branch off latest `origin/main`, push, and open a PR summarizing the video-comparison methodology and the before/after peak height numbers
