import type kaplay from "kaplay";
import {
  DISPLAY_SCALE,
  JUMP_FORCE,
  MOVE_ACCEL,
  MOVE_FRICTION,
  MOVE_SPEED,
  WALL_JUMP_FORCE,
  WALL_SLIDE_GRAVITY_MULT,
} from "../config";
import { createTouchControls } from "../input/touch-controls";

type K = ReturnType<typeof kaplay>;

export function spawnPlayer(k: K, x: number, y: number) {
  const player = k.add([
    k.sprite("char1", { anim: "stand" }),
    k.pos(x, y),
    k.scale(DISPLAY_SCALE),
    // Inset from the full 8×8 sprite frame to match the original's bbox collision
    // points (left=1, right=6, top=0, bottom=7) — the sprite's visible art has the
    // same margin, so this keeps the player visually flush against solid tiles.
    k.area({ shape: new k.Rect(k.vec2(1, 0), 5, 7) }),
    k.body({ jumpForce: JUMP_FORCE }),
    k.anchor("topleft"),
    "player",
  ]);

  // Wall side contact, refreshed every physics tick via collision events and
  // consumed (then re-derived) each onUpdate frame — see onWall below. This is
  // "am I currently overlapping a wall on this side", independent of input.
  let touchWallLeft = false;
  let touchWallRight = false;
  player.onCollideUpdate((obj, col) => {
    if (!obj.is("tile")) return;
    if (col?.isLeft()) touchWallLeft = true;
    if (col?.isRight()) touchWallRight = true;
  });

  // Recomputed fresh every onUpdate frame in the loop below — touching a wall
  // alone isn't enough, the player must also be actively holding the direction
  // into that wall (matches the original: contact is re-probed by movement,
  // not persisted, so releasing the key drops it immediately).
  let onWall = false;

  const doJump = () => {
    if (onWall && player.vel.y > 0) {
      player.vel.y = -WALL_JUMP_FORCE;
      player.vel.x = player.flipX ? -MOVE_SPEED : MOVE_SPEED;
    } else if (player.isGrounded()) {
      player.jump();
    }
  };

  const touch = createTouchControls(doJump);

  // Horizontal movement and friction via vel.x — body() applies it to pos each frame.
  k.onUpdate(() => {
    const dt = k.dt();
    const goLeft  = k.isKeyDown("left")  || k.isKeyDown("a") || touch.left;
    const goRight = k.isKeyDown("right") || k.isKeyDown("d") || touch.right;

    // Wall contact requires actively pressing into the touching side this frame —
    // re-derived from scratch every tick, not a sticky flag. Consume this frame's
    // collision signal, then reset it so next frame needs a fresh touch event.
    onWall = (touchWallLeft && goLeft) || (touchWallRight && goRight);
    touchWallLeft = false;
    touchWallRight = false;

    if (goLeft) {
      player.vel.x = Math.max(player.vel.x - MOVE_ACCEL * dt, -MOVE_SPEED);
      player.flipX = false;
    } else if (goRight) {
      player.vel.x = Math.min(player.vel.x + MOVE_ACCEL * dt, MOVE_SPEED);
      player.flipX = true;
    } else {
      // Friction now applies whether grounded or airborne.
      const decel = MOVE_FRICTION * dt;
      if (Math.abs(player.vel.x) <= decel) {
        player.vel.x = 0;
      } else {
        player.vel.x -= Math.sign(player.vel.x) * decel;
      }
    }

    // Wall-slide: reduced gravity while pressed against a wall and falling.
    player.gravityScale = (onWall && player.vel.y > 0) ? WALL_SLIDE_GRAVITY_MULT : 1;

    // Animation state, in priority order: wall-slide > airborne (jump) > grounded (run/stand).
    const wallSliding = onWall && player.vel.y > 0;
    const target = wallSliding
      ? "wallslide"
      : !player.isGrounded()
      ? "jump"
      : Math.abs(player.vel.x) > 1
      ? "run"
      : "stand";
    if (player.getCurAnim()?.name !== target) {
      player.play(target);
    }
  });

  k.onKeyPress(["space", "z"], doJump);

  return player;
}
