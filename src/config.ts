// World units: 1 PICO-8 pixel = DISPLAY_SCALE world units.
// Physics values converted from PICO-8 per-frame rates (30 fps assumed):
//   velocity:     pico_val × DISPLAY_SCALE × 30
//   acceleration: pico_val × DISPLAY_SCALE × 30²
export const DISPLAY_SCALE   = 4;

export const TILE_SIZE        = 8 * DISPLAY_SCALE;   // 32

// GRAVITY follows the same literal 30fps-formula pattern as every other constant
// here (world.g × DISPLAY_SCALE × 30² = 0.5 × 4 × 900). A prior "~60fps web export"
// empirical tuning (GRAVITY=3300) turned out to be an artifact of comparing against
// a pre-wall-jump revision of the source cart (a_jump=-6) instead of the deployed
// one (a_jump=-4.5, see JUMP_FORCE below) — once JUMP_FORCE matches the real source,
// the literal formula already lands within measurement noise of the original's
// on-screen jump height, with no engine-timing correction needed.
export const GRAVITY          = 1800;                         // world units/s²
export const JUMP_FORCE       = 4.5  * DISPLAY_SCALE * 30;   // 540  world units/s (was 6/720 pre-wall-jump; a_jump not tick-rate-sensitive, formula still valid)
export const MOVE_SPEED       = 2.5  * DISPLAY_SCALE * 30;   // 300  world units/s
// MOVE_ACCEL is ratio-scaled (0.8x, matching the source's a_run 0.5->0.4) off the
// prior, formula-derived (and unverified) 1800 value -- see design.md's caveat that
// this quantity was never video-verified the way GRAVITY was.
export const MOVE_ACCEL       = 1440;                         // world units/s² (was 1800)
export const MOVE_FRICTION    = 0.15 * DISPLAY_SCALE * 900;  // 540  world units/s² (grounded and airborne)
export const WALL_JUMP_FORCE  = JUMP_FORCE * 0.75;            // 405  world units/s (w_jump_mult from source)
export const WALL_SLIDE_GRAVITY_MULT = 0.2;                   // gravity multiplier while wall-sliding
