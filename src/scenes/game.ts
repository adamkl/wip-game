import type kaplay from "kaplay";
import { DISPLAY_SCALE } from "../config";
import { spawnPlayer } from "../entities/player";
import { spawnTiledLevel, type TiledMap, type TiledTileset } from "../level/tiled-loader";

type K = ReturnType<typeof kaplay>;

export function registerGameScene(k: K) {
  k.scene("game", () => {
    k.setGravity(1800);

    const mapData    = k.getAsset("level-01-map")!.data    as TiledMap;
    const tilesetData = k.getAsset("level-01-tileset")!.data as TiledTileset;
    const { mapWidth, mapHeight } = spawnTiledLevel(k, mapData, tilesetData);

    // Spawn player in the open upper-left area of the cave.
    const player = spawnPlayer(k, 64 * DISPLAY_SCALE, 64 * DISPLAY_SCALE);

    // Camera follows player, clamped to map bounds.
    // When a map dimension fits inside the canvas, centre on that axis.
    k.onUpdate(() => {
      const hw = k.width()  / 2;
      const hh = k.height() / 2;
      const playerCx = player.pos.x + (8 * DISPLAY_SCALE) / 2;
      const playerCy = player.pos.y + (8 * DISPLAY_SCALE) / 2;
      const cx = mapWidth  > k.width()  ? k.clamp(playerCx, hw, mapWidth  - hw) : mapWidth  / 2;
      const cy = mapHeight > k.height() ? k.clamp(playerCy, hh, mapHeight - hh) : mapHeight / 2;
      k.camPos(cx, cy);
    });
  });
}
