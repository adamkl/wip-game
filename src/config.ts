// World units: 1 PICO-8 pixel = DISPLAY_SCALE world units.
// Physics values converted from PICO-8 per-frame rates (30 fps assumed):
//   velocity:     pico_val × DISPLAY_SCALE × 30
//   acceleration: pico_val × DISPLAY_SCALE × 30²
export const DISPLAY_SCALE   = 4;

export const TILE_SIZE        = 8 * DISPLAY_SCALE;   // 32

// GRAVITY is empirically tuned (not a literal 30fps conversion): the deployed
// original cart's jump peak, measured from video, is ~half what the 30fps-literal
// value below would produce — its web export appears to run _update() at ~60fps,
// so gravity accumulates twice as fast per second as the source constants assume.
export const GRAVITY          = 3300;                        // world units/s² (30fps-literal conversion would be 1800)
export const JUMP_FORCE       = 6    * DISPLAY_SCALE * 30;   // 720  world units/s
export const MOVE_SPEED       = 2.5  * DISPLAY_SCALE * 30;   // 300  world units/s
export const MOVE_ACCEL       = 0.5  * DISPLAY_SCALE * 900;  // 1800 world units/s²
export const MOVE_FRICTION    = 0.15 * DISPLAY_SCALE * 900;  // 540  world units/s² (grounded only)
