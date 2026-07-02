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
    k.area(),
    k.body({ jumpForce: JUMP_FORCE }),
    k.anchor("topleft"),
    "player",
  ]);

  // Wall contact, tracked independently of body()'s ground state — mirrors how
  // body() itself tracks curPlatform via collision events.
  let onWall = false;
  player.onCollideUpdate((obj, col) => {
    if (obj.is("tile") && (col?.isLeft() || col?.isRight())) onWall = true;
  });
  player.onCollideEnd("tile", () => {
    onWall = false;
  });

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
