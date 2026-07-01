## 1. Update the constant

- [ ] 1.1 Change `GRAVITY` in `src/config.ts` from `1800` to `3300` (world units/s²), updating the derivation comment to note it's empirically tuned rather than a literal 30fps conversion
- [ ] 1.2 Leave `JUMP_FORCE` unchanged at `720`

## 2. Verify against measured target

- [ ] 2.1 Build (`GITHUB_ACTIONS=true npm run build`) and run `vite preview`
- [ ] 2.2 Using the `window._k.k` debug handle (as in this session's investigation), script a grounded, unobstructed jump and measure the peak height
- [ ] 2.3 Confirm the measured peak lands within ~5% of 71 world units; if not, adjust `GRAVITY` and re-measure until it does
- [ ] 2.4 Visually sanity-check 2-3 other jumps around the level (not just the calibration spot near the right wall) to confirm the arc still clears the platforms it needs to

## 3. Update specs and ship

- [ ] 3.1 Archive this change (`openspec archive retune-jump-physics`) so `openspec/specs/player-movement/spec.md` picks up the modified Jump requirement
- [ ] 3.2 Commit `src/config.ts` on a new branch off latest `origin/main`, push, and open a PR summarizing the video-comparison methodology and the before/after peak height numbers
