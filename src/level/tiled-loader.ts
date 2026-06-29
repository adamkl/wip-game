import type kaplay from "kaplay";
import { DISPLAY_SCALE, TILE_SIZE } from "../config";

type K = ReturnType<typeof kaplay>;

interface TiledProperty {
  name: string;
  type: string;
  value: unknown;
}

interface TiledTiledef {
  id: number;
  properties?: TiledProperty[];
}

export interface TiledTileset {
  tilecount: number;
  tilewidth: number;
  tileheight: number;
  tiles?: TiledTiledef[];
}

interface TiledLayer {
  type: string;
  data: number[];
  width: number;
  height: number;
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  tilesets: Array<{ firstgid: number; source: string }>;
}

interface TileProps {
  solid: boolean;
  sprite: string;
}

export function spawnTiledLevel(k: K, mapData: TiledMap, tilesetData: TiledTileset): { mapWidth: number; mapHeight: number } {
  const firstgid = mapData.tilesets[0].firstgid;

  const tileProps = new Map<number, TileProps>();
  for (const tile of (tilesetData.tiles ?? [])) {
    const props: Record<string, unknown> = {};
    for (const p of (tile.properties ?? [])) {
      props[p.name] = p.value;
    }
    if (props.solid && typeof props.sprite === "string") {
      tileProps.set(tile.id, { solid: true, sprite: props.sprite });
    }
  }

  const tileLayer = mapData.layers.find(l => l.type === "tilelayer");
  if (!tileLayer) return { mapWidth: 0, mapHeight: 0 };

  const { data, width, height } = tileLayer;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const gid = data[row * width + col];
      if (gid === 0) continue;

      const tileId = gid - firstgid;
      const props = tileProps.get(tileId);
      if (!props) continue;

      k.add([
        k.sprite(props.sprite),
        k.pos(col * TILE_SIZE, row * TILE_SIZE),
        k.scale(DISPLAY_SCALE),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("topleft"),
        "tile",
      ]);
    }
  }

  return { mapWidth: width * TILE_SIZE, mapHeight: height * TILE_SIZE };
}
