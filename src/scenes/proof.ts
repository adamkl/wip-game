import type kaplay from "kaplay";

type KAPLAYCtx = ReturnType<typeof kaplay>;

export function registerProofScene(k: KAPLAYCtx) {
  k.scene("proof", () => {
    // Display one character sprite and one tile sprite to confirm loading worked.
    // char1 has two animation frames; play the run anim to show both cycle.
    k.add([
      k.sprite("char1", { anim: "run" }),
      k.pos(k.width() / 2 - 32, k.height() / 2 - 8),
      k.scale(4),
      k.anchor("center"),
    ]);

    k.add([
      k.sprite("tile_block"),
      k.pos(k.width() / 2 + 16, k.height() / 2 - 8),
      k.scale(4),
      k.anchor("center"),
    ]);

    k.add([
      k.sprite("tile_wall"),
      k.pos(k.width() / 2 + 48, k.height() / 2 - 8),
      k.scale(4),
      k.anchor("center"),
    ]);
  });
}
