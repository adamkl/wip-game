## 1. Input-gated wall contact

- [ ] 1.1 In `src/entities/player.ts`, remove the `onCollideUpdate`/`onCollideEnd`-based `onWall` tracking
- [ ] 1.2 Recompute `onWall` inside the existing `k.onUpdate()` block each frame as `touching-a-wall-tile-on-a-side && goLeft/goRight matches that side`, reusing the already-computed `goLeft`/`goRight` booleans
- [ ] 1.3 Verify wall-slide (`gravityScale`) and wall-jump (`doJump`) still read from this recomputed `onWall` correctly — no other code should reference the old sticky flag

## 2. Inset collision box

- [ ] 2.1 Derive the inset `k.area({ shape: new k.Rect(...) })` values from the source's `bbox` local points (left=1, right=6, top=0, bottom=7 in an 8×8 local frame), scaled by `DISPLAY_SCALE`
- [ ] 2.2 Apply the inset area shape to the player in `spawnPlayer()`
- [ ] 2.3 Confirm tile collision objects (`spawnTiledLevel`) are unaffected — only the player's own area changes

## 3. Verify

- [ ] 3.1 Build (`GITHUB_ACTIONS=true npm run build`) and confirm no type errors
- [ ] 3.2 Manually playtest: approach a wall, hold the direction key to start wall-sliding, release the key mid-slide — confirm the slide stops immediately (gravity returns to full, animation leaves wall-slide) even though still touching
- [ ] 3.3 Manually playtest: approach a wall and confirm the player's sprite now rests visually flush against it, no gap
- [ ] 3.4 Spot-check ground/ceiling collision still feels normal (no new sinking or snagging) with the inset area applied
- [ ] 3.5 Re-run the debug-harness jump height measurement (`window._k.k.get("player")[0]`) to confirm the inset area hasn't changed jump peak height, since collision timing against the floor could shift by up to ~1 world unit
