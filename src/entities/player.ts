import type kaplay from "kaplay";
import {
  DISPLAY_SCALE,
  JUMP_FORCE,
  MOVE_ACCEL,
  MOVE_FRICTION,
  MOVE_SPEED,
} from "../config";
import { createTouchControls } from "../input/touch-controls";

type K = ReturnType<typeof kaplay>;

// Maps 1-indexed character number (matching PICO-8 character_sprs) to atlas sprite name.
const CHAR_SPRITES: Record<number, string> = {
  1: "char1",
  2: "char2",
  3: "char3",
  4: "char4",
  5: "char5",
  6: "char6",
};

// Only these characters have a 2-frame run animation in the atlas.
const ANIMATED_CHARS = new Set([1, 4, 5, 6]);

const CHAR_COUNT = 6;

export function spawnPlayer(k: K, x: number, y: number) {
  let charIndex = 1;

  const player = k.add([
    k.sprite(CHAR_SPRITES[charIndex], { anim: "idle" }),
    k.pos(x, y),
    k.scale(DISPLAY_SCALE),
    k.area(),
    k.body({ jumpForce: JUMP_FORCE }),
    k.anchor("topleft"),
    "player",
  ]);

  const touch = createTouchControls(() => {
    if (player.isGrounded()) player.jump();
  });

  // Horizontal movement and friction via vel.x — body() applies it to pos each frame.
  k.onUpdate(() => {
    const dt = k.dt();
    const goLeft  = k.isKeyDown("left")  || k.isKeyDown("a") || touch.left;
    const goRight = k.isKeyDown("right") || k.isKeyDown("d") || touch.right;

    if (goLeft) {
      player.vel.x = Math.max(player.vel.x - MOVE_ACCEL * dt, -MOVE_SPEED);
      player.flipX = true;
    } else if (goRight) {
      player.vel.x = Math.min(player.vel.x + MOVE_ACCEL * dt, MOVE_SPEED);
      player.flipX = false;
    } else if (player.isGrounded()) {
      const decel = MOVE_FRICTION * dt;
      if (Math.abs(player.vel.x) <= decel) {
        player.vel.x = 0;
      } else {
        player.vel.x -= Math.sign(player.vel.x) * decel;
      }
    }

    // Animate: run when moving horizontally, idle otherwise.
    if (ANIMATED_CHARS.has(charIndex)) {
      const moving = Math.abs(player.vel.x) > 1;
      const target = moving ? "run" : "idle";
      if (player.getCurAnim()?.name !== target) {
        player.play(target);
      }
    }
  });

  k.onKeyPress(["space", "z"], () => {
    if (player.isGrounded()) player.jump();
  });

  // Cycle through all 6 characters (X key, matching PICO-8).
  k.onKeyPress("x", () => {
    charIndex = (charIndex % CHAR_COUNT) + 1;
    player.use(k.sprite(CHAR_SPRITES[charIndex]));
    if (ANIMATED_CHARS.has(charIndex)) player.play("idle");
  });

  return player;
}
