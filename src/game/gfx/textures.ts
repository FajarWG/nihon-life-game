import type * as Phaser from "phaser";
import { PAL } from "./palette";

export const TILE = 16;

/** Tile indices into the generated "tiles" tileset texture. */
export enum T {
  GRASS = 0, GRASS2, ROAD, ROAD_LINE, SIDEWALK, WATER, TREE, SAKURA, FLOWERS, PATH,
  WALL, WALL_WINDOW, DOOR, ROOF_RED, ROOF_BLUE, ROOF_GRAY,
  FLOOR_WOOD, TATAMI, FLOOR_TILE, CARPET, WALL_IN, COUNTER, SHELF, TABLE,
  CHAIR, BED, DESK, STOVE, FRIDGE, BOOKSHELF, BLACKBOARD, PC_DESK,
  VENDING, GATE, PLATFORM, RAIL, FENCE, SIGN, CROSSWALK, DARK,
  BENCH, LAMP, BUSH, PLAZA,
}

const COLS = 8;
export const TILE_COUNT = 44;

type Ctx = CanvasRenderingContext2D;

function makeCanvas(w: number, h: number): [HTMLCanvasElement, Ctx] {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return [c, ctx];
}

/* ── tile painters ─────────────────────────────────────────────────────── */

function fillNoise(ctx: Ctx, x: number, y: number, base: string, fleck: string, n: number, seed: number) {
  ctx.fillStyle = base; ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = fleck;
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const fx = s % TILE; s = (s * 9301 + 49297) % 233280;
    const fy = s % TILE;
    ctx.fillRect(x + fx, y + fy, 1, 1);
  }
}

function paintTile(ctx: Ctx, id: T, ox: number, oy: number) {
  const p = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(ox + x, oy + y, w, h); };
  switch (id) {
    case T.GRASS: fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 9, 7); break;
    case T.GRASS2: fillNoise(ctx, ox, oy, PAL.grass, PAL.grassLight, 8, 13); break;
    case T.ROAD: fillNoise(ctx, ox, oy, PAL.road, "#64646f", 6, 5); break;
    case T.ROAD_LINE: fillNoise(ctx, ox, oy, PAL.road, "#64646f", 6, 5); p(0, 7, 16, 2, PAL.roadLine); break;
    case T.SIDEWALK:
      p(0, 0, 16, 16, PAL.sidewalk); p(0, 0, 16, 1, PAL.sidewalkDark); p(0, 8, 16, 1, PAL.sidewalkDark);
      p(7, 0, 1, 8, PAL.sidewalkDark); p(3, 8, 1, 8, PAL.sidewalkDark); p(11, 8, 1, 8, PAL.sidewalkDark); break;
    case T.WATER:
      p(0, 0, 16, 16, PAL.water); p(2, 3, 5, 1, PAL.waterLight); p(9, 8, 5, 1, PAL.waterLight);
      p(4, 12, 4, 1, PAL.waterDark); p(11, 2, 3, 1, PAL.waterDark); break;
    case T.TREE:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 6, 7);
      p(6, 10, 4, 5, PAL.trunk);
      p(2, 2, 12, 9, PAL.leaf); p(1, 4, 14, 5, PAL.leaf); p(4, 1, 8, 2, PAL.leaf);
      p(3, 3, 5, 2, PAL.leafLight); p(9, 5, 4, 2, PAL.leafLight); break;
    case T.SAKURA:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 6, 11);
      p(6, 10, 4, 5, PAL.trunk);
      p(2, 2, 12, 9, PAL.sakura); p(1, 4, 14, 5, PAL.sakura); p(4, 1, 8, 2, PAL.sakura);
      p(3, 3, 4, 2, PAL.sakuraLight); p(9, 4, 4, 2, PAL.sakuraLight); p(6, 7, 3, 2, PAL.sakuraLight); break;
    case T.FLOWERS:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 6, 3);
      p(3, 3, 2, 2, PAL.flowerRed); p(10, 5, 2, 2, PAL.flowerYellow); p(6, 10, 2, 2, PAL.flowerRed);
      p(12, 11, 2, 2, PAL.flowerYellow); p(2, 12, 2, 2, "#e8e8f0"); break;
    case T.PATH: fillNoise(ctx, ox, oy, PAL.path, PAL.pathDark, 10, 9); break;
    case T.WALL:
      p(0, 0, 16, 16, PAL.wall); p(0, 13, 16, 3, PAL.wallShadow);
      p(0, 4, 16, 1, PAL.wallDark); p(0, 9, 16, 1, PAL.wallDark); break;
    case T.WALL_WINDOW:
      p(0, 0, 16, 16, PAL.wall); p(0, 13, 16, 3, PAL.wallShadow);
      p(3, 3, 10, 8, PAL.windowDark); p(4, 4, 8, 6, PAL.window); p(7, 4, 1, 6, PAL.windowDark); p(4, 6, 8, 1, PAL.windowDark); break;
    case T.DOOR:
      p(0, 0, 16, 16, PAL.wall);
      p(2, 1, 12, 15, PAL.doorDark); p(3, 2, 10, 14, PAL.doorWood);
      p(10, 8, 2, 2, PAL.uiAccent); p(4, 3, 8, 3, PAL.doorDark); break;
    case T.ROOF_RED:
      p(0, 0, 16, 16, PAL.roofRed); p(0, 0, 16, 2, PAL.roofRedDark);
      p(0, 6, 16, 1, PAL.roofRedDark); p(0, 12, 16, 1, PAL.roofRedDark); break;
    case T.ROOF_BLUE:
      p(0, 0, 16, 16, PAL.roofBlue); p(0, 0, 16, 2, PAL.roofBlueDark);
      p(0, 6, 16, 1, PAL.roofBlueDark); p(0, 12, 16, 1, PAL.roofBlueDark); break;
    case T.ROOF_GRAY:
      p(0, 0, 16, 16, PAL.roofGray); p(0, 0, 16, 2, PAL.roofGrayDark);
      p(0, 6, 16, 1, PAL.roofGrayDark); p(0, 12, 16, 1, PAL.roofGrayDark); break;
    case T.FLOOR_WOOD:
      p(0, 0, 16, 16, PAL.floorWood); p(0, 3, 16, 1, PAL.floorWoodDark);
      p(0, 8, 16, 1, PAL.floorWoodDark); p(0, 13, 16, 1, PAL.floorWoodDark); p(8, 0, 1, 3, PAL.floorWoodDark); p(4, 8, 1, 5, PAL.floorWoodDark); break;
    case T.TATAMI:
      p(0, 0, 16, 16, PAL.tatami); p(0, 0, 1, 16, PAL.tatamiDark); p(15, 0, 1, 16, PAL.tatamiDark);
      p(0, 7, 16, 1, PAL.tatamiDark); break;
    case T.FLOOR_TILE:
      p(0, 0, 16, 16, PAL.floorTile); p(0, 0, 16, 1, PAL.floorTileDark); p(0, 8, 16, 1, PAL.floorTileDark);
      p(0, 0, 1, 16, PAL.floorTileDark); p(8, 0, 1, 16, PAL.floorTileDark); break;
    case T.CARPET:
      p(0, 0, 16, 16, PAL.carpet); p(1, 1, 14, 14, "#8aa8d4"); p(3, 3, 10, 10, PAL.carpet); break;
    case T.WALL_IN:
      p(0, 0, 16, 16, PAL.wallIn); p(0, 12, 16, 4, PAL.wallInDark); p(0, 11, 16, 1, "#b8ae98"); break;
    case T.COUNTER:
      p(0, 0, 16, 16, PAL.counter); p(0, 0, 16, 5, "#d8a878"); p(0, 5, 16, 1, PAL.counterDark); break;
    case T.SHELF:
      p(0, 0, 16, 16, PAL.shelf); p(1, 2, 14, 4, "#7a4e2a"); p(1, 9, 14, 4, "#7a4e2a");
      p(2, 3, 3, 2, PAL.flowerRed); p(6, 3, 3, 2, PAL.flowerYellow); p(10, 3, 3, 2, "#6ab04c");
      p(2, 10, 3, 2, "#5a7aa8"); p(6, 10, 3, 2, "#e8e8f0"); p(10, 10, 3, 2, PAL.flowerRed); break;
    case T.TABLE:
      p(2, 3, 12, 9, PAL.counterDark); p(3, 4, 10, 7, "#d8a878"); p(3, 12, 2, 3, PAL.counterDark); p(11, 12, 2, 3, PAL.counterDark); break;
    case T.CHAIR:
      p(4, 5, 8, 7, PAL.counter); p(4, 2, 8, 3, PAL.counterDark); p(4, 12, 2, 3, PAL.counterDark); p(10, 12, 2, 3, PAL.counterDark); break;
    case T.BED:
      p(1, 0, 14, 16, "#8a5a34"); p(2, 1, 12, 14, "#e8e8f0"); p(2, 1, 12, 5, "#c86464"); p(3, 6, 10, 2, "#d8d8e0"); break;
    case T.DESK:
      p(1, 3, 14, 9, PAL.counterDark); p(2, 4, 12, 7, "#d8a878");
      p(3, 5, 5, 4, "#f0f0e8"); p(9, 5, 3, 3, "#5a7aa8"); p(2, 12, 2, 3, PAL.counterDark); p(12, 12, 2, 3, PAL.counterDark); break;
    case T.STOVE:
      p(1, 2, 14, 12, PAL.metal); p(2, 3, 12, 6, PAL.metalDark);
      p(3, 4, 4, 4, "#3a3040"); p(9, 4, 4, 4, "#3a3040"); p(4, 5, 2, 2, "#e05555"); p(2, 10, 12, 2, "#787c86"); break;
    case T.FRIDGE:
      p(2, 0, 12, 15, PAL.metal); p(3, 1, 10, 5, "#c8ccd4"); p(3, 7, 10, 7, "#c8ccd4"); p(11, 2, 1, 3, PAL.metalDark); p(11, 8, 1, 3, PAL.metalDark); break;
    case T.BOOKSHELF:
      p(0, 0, 16, 16, "#7a4e2a"); p(1, 1, 14, 6, "#5e3c20"); p(1, 8, 14, 6, "#5e3c20");
      p(2, 2, 2, 5, "#c05a4a"); p(5, 2, 2, 5, "#5a7aa8"); p(8, 2, 2, 5, "#6ab04c"); p(11, 2, 3, 5, "#f0c040");
      p(2, 9, 3, 5, "#5a7aa8"); p(6, 9, 2, 5, "#e05555"); p(9, 9, 2, 5, "#f0e8d8"); p(12, 9, 2, 5, "#6ab04c"); break;
    case T.BLACKBOARD:
      p(0, 0, 16, 16, PAL.wallIn); p(1, 2, 14, 10, "#5e3c20"); p(2, 3, 12, 8, "#2e5e46");
      p(3, 4, 4, 1, "#f0e8d8"); p(3, 6, 6, 1, "#f0e8d8"); p(3, 8, 3, 1, "#f0c040"); break;
    case T.PC_DESK:
      p(1, 3, 14, 9, "#6a6a74"); p(2, 4, 12, 7, "#8a8a94");
      p(4, 0, 8, 6, "#3a3040"); p(5, 1, 6, 4, "#6ab0e0"); p(2, 12, 2, 3, "#6a6a74"); p(12, 12, 2, 3, "#6a6a74"); break;
    case T.VENDING:
      p(2, 0, 12, 15, "#e05555"); p(3, 1, 10, 8, "#f0f0e8");
      p(4, 2, 2, 3, "#5a7aa8"); p(7, 2, 2, 3, "#6ab04c"); p(10, 2, 2, 3, "#f0c040"); p(4, 10, 8, 3, "#3a3040"); break;
    case T.GATE:
      p(0, 0, 16, 16, PAL.floorTile); p(0, 0, 3, 16, PAL.metal); p(13, 0, 3, 16, PAL.metal);
      p(3, 4, 10, 2, "#f0c040"); p(0, 0, 3, 2, PAL.metalDark); p(13, 0, 3, 2, PAL.metalDark); break;
    case T.PLATFORM:
      p(0, 0, 16, 16, PAL.sidewalk); p(0, 13, 16, 2, "#f0c040"); p(0, 15, 16, 1, PAL.sidewalkDark); break;
    case T.RAIL:
      p(0, 0, 16, 16, "#4a4a52"); p(0, 3, 16, 2, "#8a8a92"); p(0, 11, 16, 2, "#8a8a92");
      p(2, 0, 2, 16, "#5e3c20"); p(8, 0, 2, 16, "#5e3c20"); p(14, 0, 2, 16, "#5e3c20"); break;
    case T.FENCE:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 6, 17);
      p(0, 6, 16, 2, "#8a7a5c"); p(2, 3, 2, 10, "#8a7a5c"); p(12, 3, 2, 10, "#8a7a5c"); break;
    case T.SIGN:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 6, 21);
      p(7, 7, 2, 8, PAL.trunk); p(2, 2, 12, 6, "#d8a878"); p(3, 3, 10, 4, "#8a5a34"); break;
    case T.CROSSWALK:
      fillNoise(ctx, ox, oy, PAL.road, "#64646f", 4, 5);
      p(1, 0, 3, 16, PAL.roadLine); p(6, 0, 3, 16, PAL.roadLine); p(11, 0, 3, 16, PAL.roadLine); break;
    case T.DARK: p(0, 0, 16, 16, "#181420"); break;
    case T.BENCH:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 5, 23);
      p(1, 5, 14, 4, "#a06a3c"); p(1, 5, 14, 1, "#c08a52");
      p(2, 9, 2, 5, "#7a4e2a"); p(12, 9, 2, 5, "#7a4e2a");
      p(1, 2, 14, 2, "#c08a52"); break; // backrest
    case T.LAMP:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 5, 29);
      p(7, 4, 2, 11, "#3a3040");
      p(5, 1, 6, 4, "#f0e0a0"); p(6, 0, 4, 1, "#3a3040"); p(6, 5, 4, 1, "#3a3040"); break;
    case T.BUSH:
      fillNoise(ctx, ox, oy, PAL.grass, PAL.grassDark, 5, 31);
      p(2, 4, 12, 10, PAL.leaf); p(1, 6, 14, 6, PAL.leaf);
      p(3, 5, 4, 3, PAL.leafLight); p(9, 8, 4, 2, PAL.leafLight); break;
    case T.PLAZA:
      p(0, 0, 16, 16, "#cfc8ba"); p(0, 0, 16, 1, "#b8b0a0"); p(0, 8, 16, 1, "#b8b0a0");
      p(0, 0, 1, 8, "#b8b0a0"); p(8, 8, 1, 8, "#b8b0a0");
      p(4, 4, 2, 2, "#dcd6c8"); p(11, 11, 2, 2, "#dcd6c8"); break;
  }
}

/* ── characters ────────────────────────────────────────────────────────── */

export interface CharColors { hair: string; shirt: string; pants: string; skin?: string }

export const CHAR_W = 16;
export const CHAR_H = 20;

/**
 * dir: 0 down, 1 left, 2 right, 3 up.
 * frame: 0 idle · 1 stride A · 2 passing (body lifts 1px) · 3 stride B.
 * Legs alternate a 2px stride, arms counter-swing, body bobs on the pass —
 * played as [1,2,3,2] the cycle reads as a natural gait.
 */
function paintChar(ctx: Ctx, ox: number, dir: number, frame: number, c: CharColors) {
  const skin = c.skin ?? PAL.skin;
  const p = (x: number, y: number, w: number, h: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(ox + x, y, w, h); };
  const mirror = dir === 2;
  const mx = (x: number, w: number) => (mirror ? CHAR_W - x - w : x);
  const pm = (x: number, y: number, w: number, h: number, col: string) => p(mx(x, w), y, w, h, col);

  const dy = frame === 2 ? -1 : 0;          // body bob on the passing frame
  const shoe = "#3a3040";

  if (dir === 0 || dir === 3) {
    // ── front / back view ──
    // legs: extended leg reaches the ground, the other lifts its foot
    const lLift = frame === 1 ? 2 : frame === 2 ? 1 : 0;
    const rLift = frame === 3 ? 2 : frame === 2 ? 1 : 0;
    p(4, 14 + dy, 3, 5 - lLift, c.pants);
    p(9, 14 + dy, 3, 5 - rLift, c.pants);
    p(4, 18 - lLift, 3, 1, shoe);
    p(9, 18 - rLift, 3, 1, shoe);
    // body
    p(3, 8 + dy, 10, 7, c.shirt);
    // arms counter-swing (down 3px range)
    const lArm = frame === 3 ? 5 : frame === 1 ? 2 : 4;
    const rArm = frame === 1 ? 5 : frame === 3 ? 2 : 4;
    p(2, 9 + dy, 1, lArm, skin);
    p(13, 9 + dy, 1, rArm, skin);
    // head
    p(4, 1 + dy, 8, 8, skin);
    if (dir === 0) {
      p(3, 0 + dy, 10, 4, c.hair); p(3, 3 + dy, 2, 3, c.hair); p(11, 3 + dy, 2, 3, c.hair);
      p(6, 5 + dy, 1, 2, "#3a3040"); p(9, 5 + dy, 1, 2, "#3a3040");
    } else {
      p(3, 0 + dy, 10, 6, c.hair); p(3, 5 + dy, 10, 2, c.hair);
    }
  } else {
    // ── side view (left drawn, right mirrored) ──
    // legs scissor: front foot ahead, back foot behind
    const stride = frame === 1 ? 2 : frame === 3 ? -2 : 0;
    pm(6 + stride, 14 + dy, 3, 5, c.pants);
    pm(6 + stride, 18, 3, 1, shoe);
    pm(7 - stride, 14 + dy, 3, 4, c.pants);
    pm(7 - stride, 17, 3, 1, shoe);
    // body
    pm(4, 8 + dy, 8, 7, c.shirt);
    // visible arm swings with the opposite leg
    pm(6 - stride, 9 + dy, 2, 4, c.shirt);
    pm(6 - stride, 12 + dy, 2, 2, skin);
    // head
    pm(4, 1 + dy, 8, 8, skin);
    pm(3, 0 + dy, 10, 4, c.hair); pm(9, 3 + dy, 4, 4, c.hair);
    pm(5, 5 + dy, 1, 2, "#3a3040");
  }
}

/* ── item icons (12x12) ────────────────────────────────────────────────── */

const ICON_SIZE = 14;

function paintIcon(ctx: Ctx, ox: number, icon: string) {
  const p = (x: number, y: number, w: number, h: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(ox + x, y, w, h); };
  switch (icon) {
    case "rice": p(2, 4, 10, 8, "#f0f0e8"); p(3, 2, 8, 3, "#e05555"); p(5, 6, 4, 3, "#3a3040"); break;
    case "egg": p(4, 3, 6, 8, "#f8f4e8"); p(3, 5, 8, 5, "#f8f4e8"); p(5, 4, 2, 2, "#fff"); break;
    case "milk": p(4, 2, 6, 10, "#f0f0f0"); p(4, 2, 6, 3, "#5a7aa8"); p(5, 6, 4, 3, "#5a7aa8"); break;
    case "bread": p(2, 4, 10, 7, "#d8a860"); p(2, 4, 10, 3, "#e8c088"); break;
    case "meat": p(2, 4, 10, 7, "#e07070"); p(3, 5, 4, 3, "#f0a0a0"); p(8, 7, 3, 2, "#f0a0a0"); break;
    case "fish": p(2, 5, 8, 4, "#8ab0d0"); p(10, 4, 3, 6, "#6a90b0"); p(3, 6, 1, 1, "#3a3040"); break;
    case "carrot": p(5, 4, 4, 8, "#f08030"); p(5, 1, 4, 3, "#6ab04c"); break;
    case "potato": p(3, 4, 8, 7, "#c8a060"); p(5, 6, 2, 1, "#a88448"); p(8, 8, 2, 1, "#a88448"); break;
    case "onion": p(4, 4, 6, 7, "#e8d8b0"); p(6, 1, 2, 3, "#6ab04c"); break;
    case "cabbage": p(3, 3, 8, 8, "#8ac860"); p(4, 4, 4, 3, "#a8e080"); break;
    case "tofu": p(3, 4, 8, 7, "#f8f8f0"); p(3, 4, 8, 2, "#e8e8dc"); break;
    case "miso": p(3, 4, 8, 7, "#a06a3c"); p(3, 3, 8, 2, "#e05555"); break;
    case "soysauce": p(5, 2, 4, 10, "#3a3040"); p(5, 2, 4, 2, "#e05555"); p(6, 6, 2, 4, "#5e2c20"); break;
    case "nori": p(3, 3, 8, 8, "#2e4634"); p(4, 4, 6, 6, "#3a5a42"); break;
    case "curryroux": p(2, 4, 10, 6, "#8a5a34"); p(2, 4, 10, 2, "#f0c040"); break;
    case "noodles": p(3, 4, 8, 7, "#f0e0b0"); p(4, 2, 1, 4, "#f0e0b0"); p(6, 2, 1, 4, "#f0e0b0"); p(8, 2, 1, 4, "#f0e0b0"); break;
    case "sauce": p(5, 2, 4, 10, "#5e2c20"); p(5, 2, 4, 2, "#f0c040"); break;
    case "dashi": p(3, 4, 8, 7, "#e8c088"); p(3, 3, 8, 2, "#c05a4a"); break;
    case "greenonion": p(6, 1, 3, 11, "#6ab04c"); p(6, 1, 3, 4, "#f0f0e8"); break;
    case "sugar": p(3, 4, 8, 7, "#f8f8f8"); p(3, 3, 8, 2, "#9ac8e8"); break;
    case "onigiri": p(4, 3, 6, 3, "#f8f8f0"); p(3, 5, 8, 5, "#f8f8f0"); p(5, 8, 4, 3, "#2e4634"); break;
    case "bento": p(2, 4, 10, 7, "#c05a4a"); p(3, 5, 4, 3, "#f8f8f0"); p(8, 5, 3, 2, "#f0c040"); p(8, 8, 3, 2, "#6ab04c"); break;
    case "sandwich": p(2, 5, 10, 2, "#e8c088"); p(2, 7, 10, 2, "#f0c040"); p(2, 9, 10, 2, "#e8c088"); break;
    case "coffee": p(4, 3, 6, 9, "#8a5a34"); p(4, 3, 6, 2, "#c8ccd4"); break;
    case "greentea": p(4, 3, 6, 9, "#6ab04c"); p(4, 3, 6, 2, "#4a8a34"); break;
    case "melonpan": p(3, 4, 8, 7, "#e8d8a0"); p(4, 5, 2, 1, "#c8b070"); p(7, 6, 2, 1, "#c8b070"); p(5, 8, 2, 1, "#c8b070"); break;
    case "pocky": p(3, 2, 2, 10, "#e88098"); p(6, 3, 2, 9, "#8a5a34"); p(9, 2, 2, 10, "#e88098"); break;
    case "curry": p(2, 5, 10, 6, "#f8f8f0"); p(6, 4, 6, 5, "#8a5a34"); break;
    case "misosoup": p(3, 5, 8, 6, "#c05a4a"); p(4, 4, 6, 2, "#a06a3c"); break;
    case "tamagoyaki": p(3, 5, 8, 5, "#f0c040"); p(4, 6, 6, 1, "#e8a838"); p(4, 8, 6, 1, "#e8a838"); break;
    case "yakisoba": p(2, 5, 10, 6, "#3a3040"); p(3, 4, 8, 5, "#c88848"); p(4, 3, 2, 2, "#e05555"); break;
    case "nikujaga": p(2, 5, 10, 6, "#5e3c20"); p(4, 4, 3, 3, "#c8a060"); p(8, 5, 3, 2, "#e07070"); break;
    case "flowers": p(3, 6, 2, 2, "#e05555"); p(7, 4, 2, 2, "#f0c040"); p(10, 7, 2, 2, "#e88098"); p(5, 8, 4, 4, "#6ab04c"); break;
    case "manga": p(3, 2, 8, 10, "#5a7aa8"); p(4, 3, 6, 4, "#f0e8d8"); break;
    case "techbook": p(3, 2, 8, 10, "#2e5e8e"); p(4, 4, 6, 2, "#61dafb"); break;
    case "jlptbook": p(3, 2, 8, 10, "#c05a4a"); p(4, 4, 6, 3, "#f0e8d8"); break;
    case "omamori": p(4, 3, 6, 8, "#c05a4a"); p(5, 4, 4, 4, "#f0c040"); p(6, 1, 2, 2, "#f0c040"); break;
    default: p(3, 3, 8, 8, "#8a7a5c"); p(4, 4, 6, 6, "#a89a78"); break;
  }
}

/* ── public API ────────────────────────────────────────────────────────── */

export function generateTileset(scene: Phaser.Scene) {
  const rows = Math.ceil(TILE_COUNT / COLS);
  const [canvas, ctx] = makeCanvas(COLS * TILE, rows * TILE);
  for (let i = 0; i < TILE_COUNT; i++) {
    paintTile(ctx, i as T, (i % COLS) * TILE, Math.floor(i / COLS) * TILE);
  }
  scene.textures.addCanvas("tiles", canvas);
}

/** 4 dirs × 4 frames; frame index = dir * 4 + frame. */
export const CHAR_FRAMES = 4;

export function generateCharSheet(scene: Phaser.Scene, key: string, colors: CharColors) {
  const total = 4 * CHAR_FRAMES;
  const [canvas, ctx] = makeCanvas(CHAR_W * total, CHAR_H);
  for (let dir = 0; dir < 4; dir++) {
    for (let f = 0; f < CHAR_FRAMES; f++) {
      paintChar(ctx, (dir * CHAR_FRAMES + f) * CHAR_W, dir, f, colors);
    }
  }
  const tex = scene.textures.addCanvas(key, canvas);
  if (!tex) return;
  for (let i = 0; i < total; i++) tex.add(i, 0, i * CHAR_W, 0, CHAR_W, CHAR_H);
}

export function generateIcons(scene: Phaser.Scene, iconKeys: string[]) {
  const keys = [...new Set([...iconKeys, "default"])];
  const [canvas, ctx] = makeCanvas(ICON_SIZE * keys.length, ICON_SIZE);
  keys.forEach((k, i) => paintIcon(ctx, i * ICON_SIZE, k));
  const tex = scene.textures.addCanvas("icons", canvas);
  if (!tex) return;
  keys.forEach((k, i) => tex!.add(k, 0, i * ICON_SIZE, 0, ICON_SIZE, ICON_SIZE));
}

export function generateUiTextures(scene: Phaser.Scene) {
  // 9-slice panel
  {
    const [canvas, ctx] = makeCanvas(24, 24);
    const p = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    p(0, 0, 24, 24, PAL.uiBorder);
    p(1, 1, 22, 22, PAL.uiBorderLight);
    p(2, 2, 20, 20, PAL.uiBorder);
    p(3, 3, 18, 18, PAL.uiBg);
    // corner accents
    p(0, 0, 2, 2, PAL.uiBorderLight); p(22, 0, 2, 2, PAL.uiBorderLight);
    p(0, 22, 2, 2, PAL.uiBorderLight); p(22, 22, 2, 2, PAL.uiBorderLight);
    scene.textures.addCanvas("panel", canvas);
  }
  // lighter inner panel
  {
    const [canvas, ctx] = makeCanvas(24, 24);
    const p = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    p(0, 0, 24, 24, "#544a68");
    p(1, 1, 22, 22, PAL.uiBgLight);
    scene.textures.addCanvas("panel-light", canvas);
  }
  // small particles
  {
    const [canvas, ctx] = makeCanvas(6, 6);
    ctx.fillStyle = "#9ac8e8"; ctx.fillRect(2, 0, 1, 5); ctx.fillRect(3, 2, 1, 3);
    scene.textures.addCanvas("rain", canvas);
  }
  {
    const [canvas, ctx] = makeCanvas(4, 4);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(1, 0, 2, 4); ctx.fillRect(0, 1, 4, 2);
    scene.textures.addCanvas("snow", canvas);
  }
  {
    const [canvas, ctx] = makeCanvas(8, 4);
    ctx.fillStyle = "rgba(20,16,28,0.35)";
    ctx.fillRect(1, 0, 6, 4); ctx.fillRect(0, 1, 8, 2);
    scene.textures.addCanvas("shadow", canvas);
  }
  // weather icons (14x14)
  const wx = (key: string, draw: (p: (x: number, y: number, w: number, h: number, c: string) => void) => void) => {
    const [canvas, ctx] = makeCanvas(14, 14);
    draw((x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); });
    scene.textures.addCanvas(key, canvas);
  };
  wx("wx-sunny", p => {
    p(4, 4, 6, 6, "#f0c040"); p(5, 3, 4, 8, "#f0c040"); p(3, 5, 8, 4, "#f0c040");
    p(6, 0, 2, 2, "#f0c040"); p(6, 12, 2, 2, "#f0c040"); p(0, 6, 2, 2, "#f0c040"); p(12, 6, 2, 2, "#f0c040");
  });
  wx("wx-cloudy", p => {
    p(2, 5, 10, 5, "#c8ccd4"); p(4, 3, 6, 4, "#c8ccd4"); p(1, 7, 12, 3, "#b0b4bc");
  });
  wx("wx-rain", p => {
    p(2, 2, 10, 5, "#a8acb4"); p(4, 1, 6, 3, "#a8acb4");
    p(3, 9, 1, 3, "#6aa8e8"); p(7, 8, 1, 3, "#6aa8e8"); p(10, 10, 1, 3, "#6aa8e8");
  });
  wx("wx-snow", p => {
    p(2, 2, 10, 5, "#c8ccd4"); p(4, 1, 6, 3, "#c8ccd4");
    p(3, 9, 2, 2, "#ffffff"); p(7, 11, 2, 2, "#ffffff"); p(10, 8, 2, 2, "#ffffff");
  });
}
