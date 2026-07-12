import * as Phaser from "phaser";
import type { LocationId } from "@/core/types";
import { CHAR_FRAMES, generateCharSheet, generateIcons, generateTileset, generateUiTextures, TILE, TILE_COUNT } from "@/game/gfx/textures";
import { getMap } from "@/game/maps/maps";
import { ITEMS } from "@/data/items";
import { NPCS } from "@/data/npcs";
import { G } from "@/game/state/gameState";

const CHAR_COLORS: Record<string, { hair: string; shirt: string; pants: string }> = {
  player: { hair: "#4a3428", shirt: "#4a7ab8", pants: "#3a3a4a" },
  "npc-tanaka": { hair: "#2a2a34", shirt: "#7a5a8a", pants: "#4a4a54" },
  "npc-yuki": { hair: "#c87850", shirt: "#e88098", pants: "#5a6a8a" },
  "npc-yamada": { hair: "#3a3040", shirt: "#3a8a6a", pants: "#3a3a4a" },
  "npc-sato": { hair: "#6a6a74", shirt: "#4a90d9", pants: "#4a4a54" },
};

export class BootScene extends Phaser.Scene {
  constructor() { super("Boot"); }

  create() {
    generateTileset(this);
    generateUiTextures(this);
    generateIcons(this, ITEMS.map(i => i.icon));
    for (const [key, colors] of Object.entries(CHAR_COLORS)) {
      generateCharSheet(this, key, colors);
      this.createWalkAnims(key);
    }
    // NPCs without explicit colors get a default sheet
    for (const npc of NPCS) {
      if (!this.textures.exists(npc.sprite)) {
        generateCharSheet(this, npc.sprite, { hair: "#5a4632", shirt: "#8a6a4a", pants: "#3a3a4a" });
        this.createWalkAnims(npc.sprite);
      }
    }
    this.boot();
  }

  private createWalkAnims(key: string) {
    const dirs = ["down", "left", "right", "up"];
    dirs.forEach((dir, d) => {
      this.anims.create({
        key: `${key}-walk-${dir}`,
        // stride A → pass → stride B → pass: a proper 4-beat gait
        frames: [1, 2, 3, 2].map(f => ({ key, frame: d * CHAR_FRAMES + f })),
        frameRate: 10,
        repeat: -1,
      });
    });
  }

  /**
   * Tiled workflow:
   * - Drop a Tiled JSON map at /public/maps/<locationId>.json and it replaces
   *   the built-in ASCII map's visuals (doors/interactables stay data-driven).
   * - In the browser console, `__nihon.exportTiledMap("town")` downloads the
   *   current map as Tiled JSON and `__nihon.exportTilesetPNG()` downloads the
   *   generated tileset, so maps can be opened and edited in Tiled directly.
   */
  private async loadTiledOverrides() {
    const ids: LocationId[] = ["town", "apartment", "school", "konbini", "supermarket", "station", "company", "restaurant", "library"];
    await Promise.all(ids.map(async id => {
      try {
        const res = await fetch(`/maps/${id}.json`);
        if (!res.ok) return;
        const data = await res.json();
        this.cache.tilemap.add(`tiled-${id}`, { format: Phaser.Tilemaps.Formats.TILED_JSON, data });
      } catch { /* no override — use the built-in ASCII map */ }
    }));
  }

  private installExportHelpers() {
    const download = (name: string, url: string) => {
      const a = document.createElement("a");
      a.href = url; a.download = name; a.click();
    };
    (window as unknown as Record<string, unknown>).__nihon = {
      exportTilesetPNG: () => {
        const src = this.textures.get("tiles").getSourceImage() as HTMLCanvasElement;
        download("tileset.png", src.toDataURL("image/png"));
      },
      exportTiledMap: (id: LocationId) => {
        const m = getMap(id);
        const json = {
          type: "map", version: "1.10", orientation: "orthogonal", renderorder: "right-down",
          width: m.width, height: m.height, tilewidth: TILE, tileheight: TILE, infinite: false,
          layers: [{
            type: "tilelayer", name: "ground", id: 1, width: m.width, height: m.height,
            opacity: 1, visible: true, x: 0, y: 0,
            data: m.grid.flat().map(t => t + 1), // Tiled gids are 1-based
          }],
          tilesets: [{
            firstgid: 1, name: "tiles", image: "tileset.png",
            tilewidth: TILE, tileheight: TILE, tilecount: TILE_COUNT, columns: 8,
            imagewidth: 8 * TILE, imageheight: Math.ceil(TILE_COUNT / 8) * TILE,
          }],
          nextlayerid: 2, nextobjectid: 1,
        };
        download(`${id}.json`, "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json)));
      },
    };
  }

  /**
   * Game state is already initialized by the React shell (initializeRun).
   * Here we only wait briefly for the pixel font, with a hard timer fallback,
   * and guard against the scene being torn down mid-boot (dev StrictMode).
   */
  private boot() {
    this.installExportHelpers();
    void this.loadTiledOverrides(); // best-effort; MapScene falls back to ASCII maps

    let started = false;
    const start = () => {
      if (started) return;
      if (!this.sys || !this.sys.game || !this.scene.isActive("Boot")) return;
      started = true;
      try {
        const s = G();
        this.scene.launch("UI");
        this.scene.start("Map", { mapId: s.location, spawnX: s.posX, spawnY: s.posY });
      } catch { /* scene torn down — nothing to start */ }
    };
    try {
      // Explicitly load the JP glyph subsets so canvas text never falls back
      // to a hard-to-read font. (Google Fonts JP splits into lazy subsets.)
      Promise.all([
        document.fonts.load('16px "Noto Sans JP"', "日本語あいうアイウ英語ABCabc0123｜「」"),
        document.fonts.load('bold 16px "Noto Sans JP"', "日本語ABC"),
        document.fonts.load('16px "Noto Sans"', "abcABC0123"),
        document.fonts.load('16px "M PLUS Rounded 1c"', "日本語あいうアイウ英語ABCabc0123｜「」"),
      ]).then(() => start()).catch(() => start());
    } catch { /* no Font Loading API */ }
    this.time.delayedCall(1500, start); // dies with the scene, so always safe
  }
}
