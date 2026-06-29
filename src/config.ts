// World units: 1 PICO-8 pixel = DISPLAY_SCALE world units.
// Physics values converted from PICO-8 per-frame rates (30 fps assumed):
//   velocity:     pico_val × DISPLAY_SCALE × 30
//   acceleration: pico_val × DISPLAY_SCALE × 30²
export const DISPLAY_SCALE   = 4;

export const TILE_SIZE        = 8 * DISPLAY_SCALE;   // 32

export const GRAVITY          = 0.5  * DISPLAY_SCALE * 900;  // 1800 world units/s²
export const JUMP_FORCE       = 6    * DISPLAY_SCALE * 30;   // 720  world units/s
export const MOVE_SPEED       = 2.5  * DISPLAY_SCALE * 30;   // 300  world units/s
export const MOVE_ACCEL       = 0.5  * DISPLAY_SCALE * 900;  // 1800 world units/s²
export const MOVE_FRICTION    = 0.15 * DISPLAY_SCALE * 900;  // 540  world units/s² (grounded only)
