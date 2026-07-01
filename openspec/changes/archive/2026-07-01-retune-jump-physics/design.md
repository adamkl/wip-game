## Context

This session did a rigorous, evidence-based comparison of the ported game's jump against the original PICO-8 cart:

- Fetched the actual `wip.p8` Lua source (`world.g=0.5`, `player.a_jump=-6`) and hand-derived the "intended" 30fps discrete-physics jump peak: 33 pico-pixels.
- Recorded video of both the original cart (web export at `adamkl.github.io`) and the Kaplay port, performing the identical jump (standing at the base of the right-side wall, jumping straight up, no horizontal input).
- Extracted frames with `ffmpeg`, calibrated pixel-to-world-unit scale independently via tile width in each recording (assumption-free — doesn't depend on knowing which map row the player rests on), and tracked the character sprite's skin-tone color across every frame to build a precise y(t) trajectory.
- Cross-validated the port's measurement two ways (live `window._k` debug query during a scripted jump, and calibrated video pixel-tracking) — both agreed to within 1% (~137 world units).
- Measured the original's actual jump peak at ~17.7 pico-pixels (~71 world-units-equivalent) — **half** of the 33px the source code would produce if `_update()` ran at the standard PICO-8 30fps.

Conclusion: the deployed original cart's HTML5/WASM export likely runs its update loop at ~60fps rather than 30fps (a known quirk for carts that only define `_update()` without `_update60()`), so gravity and jump decel accumulate twice as fast per real second as the Lua constants were written for. The current `config.ts` conversion (`× 30`, `× 30²`) faithfully implements the *source code's stated intent*, but that no longer matches what the original actually looks like on screen — and matching what's on screen is the actual goal of the port.

## Goals / Non-Goals

**Goals:**
- Make the ported jump's peak height match the original cart's measured on-screen behavior (~71 world units), not the formula-derived "intended 30fps" value (~137-144 world units).
- Keep the fix to a single, well-justified constant change with a clear rationale, rather than an ad-hoc nerf.

**Non-Goals:**
- Retuning horizontal movement (`MOVE_SPEED`/`MOVE_ACCEL`/`MOVE_FRICTION`) — no evidence gathered yet that these are off; out of scope unless a future comparison surfaces a discrepancy.
- Explaining or fixing the *original* cart's web-export timing behavior — it's out of our control and out of scope; we're matching what players actually see.
- Re-deriving the conversion formula in `config.ts`'s comments to a new "assumed fps" — the formula stays as documented (30fps-based); only the `GRAVITY` value itself changes, treated as an empirically-tuned constant.

## Decisions

**Double gravity rather than reduce jump force.** The leading hypothesis (effective update rate ~2×) predicts gravity's per-second effect should be ~2× stronger, while `JUMP_FORCE` (an instantaneous velocity set on press, not a per-tick accumulation) is unaffected by tick rate. Doubling `GRAVITY` is the more physically-motivated fix and has a useful side effect: it directly addresses the earlier "floaty" complaint from this same investigation (higher gravity → faster fall → snappier feel), rather than just shrinking the jump arc symmetrically.

**Target value: `GRAVITY = 3300` wu/s² (from 1800), `JUMP_FORCE` unchanged at 720 wu/s.** Simulating Kaplay's actual discrete 50Hz physics tick (not the continuous-ideal formula) with these values gives a peak of ~71.4 world units, matching the measured original almost exactly. (Continuous-ideal doubling to `GRAVITY=3600` was tried first but the *discrete* engine simulation lands at 64.8 — 3300 accounts for the same discretization gap already observed between the original's 30fps-intended math and its real behavior.)

**Verify empirically after implementation, not just by calculation.** This whole investigation only succeeded because measured/live values were trusted over hand-derived ones at every step. The tasks include re-running the same debug-harness jump measurement used in this session to confirm the actual peak lands within ~5% of 71 world units, adjusting `GRAVITY` further if not.

## Risks / Trade-offs

**Doubling gravity affects fall speed and jump arc shape everywhere, not just at this one wall.** → Acceptable: this is the desired outcome (also addresses the earlier floatiness complaint); should be visually re-checked across a few other jumps in the level, not just the calibration spot.

**The "~60fps web export" root-cause theory is inferred from frame-timing analysis of a phone screen recording, not confirmed against the native PICO-8 desktop app.** → We're not fixing the cause, only matching the effect (measured pixel behavior), so the theory being imprecise doesn't block this change — the target number (71 world units) is directly measured, not derived from the theory.

**MOVE_SPEED/MOVE_ACCEL/MOVE_FRICTION may have the same "designed for 30fps, running at 60fps" mismatch as gravity did**, meaning horizontal movement could still be off by a similar factor. → Explicitly out of scope for this change (no video evidence gathered yet); flagged as a follow-up candidate.
