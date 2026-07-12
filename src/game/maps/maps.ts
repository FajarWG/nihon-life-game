import type { LocationId } from "@/core/types";
import { T } from "@/game/gfx/textures";

/**
 * Maps are authored as ASCII art. Every char maps to a tile via LEGEND;
 * per-map SPECIAL chars additionally define doors (walk onto → transition)
 * and interactables (face + press action key).
 */

export interface DoorDef { x: number; y: number; to: LocationId; tx: number; ty: number; label: string }
export interface InteractDef { x: number; y: number; kind: string; label: string }

export interface MapDef {
  id: LocationId;
  outdoor: boolean;
  rows: string[];
  /** char → tile override + door/interact meta (door target uses `to`,`tx`,`ty`) */
  special: Record<string, { tile: T; door?: Omit<DoorDef, "x" | "y">; interact?: Omit<InteractDef, "x" | "y"> }>;
}

export interface CompiledMap {
  def: MapDef;
  width: number;
  height: number;
  grid: number[][];
  doors: DoorDef[];
  interacts: InteractDef[];
}

const LEGEND: Record<string, T> = {
  ".": T.GRASS, ",": T.GRASS2, r: T.ROAD, s: T.SIDEWALK, "~": T.WATER,
  t: T.TREE, S: T.SAKURA, f: T.FLOWERS, p: T.PATH,
  W: T.WALL, w: T.WALL_WINDOW, "1": T.ROOF_RED, "2": T.ROOF_BLUE, "3": T.ROOF_GRAY,
  o: T.FLOOR_WOOD, m: T.TATAMI, l: T.FLOOR_TILE, c: T.CARPET, I: T.WALL_IN,
  C: T.COUNTER, H: T.SHELF, T: T.TABLE, h: T.CHAIR, B: T.BED, K: T.DESK,
  V: T.STOVE, F: T.FRIDGE, k: T.BOOKSHELF, b: T.BLACKBOARD, P: T.PC_DESK,
  v: T.VENDING, G: T.GATE, "=": T.PLATFORM, "#": T.RAIL, x: T.FENCE,
  g: T.SIGN, X: T.CROSSWALK, " ": T.DARK,
  e: T.BENCH, d: T.LAMP, a: T.BUSH, q: T.PLAZA,
};

export const SOLID_TILES = new Set<number>([
  T.WATER, T.TREE, T.SAKURA, T.WALL, T.WALL_WINDOW, T.ROOF_RED, T.ROOF_BLUE, T.ROOF_GRAY,
  T.WALL_IN, T.COUNTER, T.SHELF, T.TABLE, T.BED, T.DESK, T.STOVE, T.FRIDGE,
  T.BOOKSHELF, T.BLACKBOARD, T.PC_DESK, T.VENDING, T.RAIL, T.FENCE, T.SIGN, T.DARK,
  T.BENCH, T.LAMP, T.BUSH,
]);

export function compileMap(def: MapDef): CompiledMap {
  const width = def.rows[0].length;
  const height = def.rows.length;
  const grid: number[][] = [];
  const doors: DoorDef[] = [];
  const interacts: InteractDef[] = [];

  def.rows.forEach((row, y) => {
    if (row.length !== width) {
      throw new Error(`Map ${def.id}: row ${y} has length ${row.length}, expected ${width}`);
    }
    const line: number[] = [];
    for (let x = 0; x < width; x++) {
      const ch = row[x];
      const sp = def.special[ch];
      if (sp) {
        line.push(sp.tile);
        if (sp.door) doors.push({ x, y, ...sp.door });
        if (sp.interact) interacts.push({ x, y, ...sp.interact });
      } else {
        const tile = LEGEND[ch];
        if (tile === undefined) throw new Error(`Map ${def.id}: unknown char "${ch}" at ${x},${y}`);
        line.push(tile);
      }
    }
    grid.push(line);
  });
  return { def, width, height, grid, doors, interacts };
}

/* ══ TOWN ═══════════════════════════════════════════════════════════════ */

const TOWN: MapDef = {
  id: "town",
  outdoor: true,
  special: {
    A: { tile: T.DOOR, door: { to: "apartment", tx: 5, ty: 6, label: "Apartment" } },
    L: { tile: T.DOOR, door: { to: "school", tx: 6, ty: 8, label: "Language School" } },
    Y: { tile: T.DOOR, door: { to: "library", tx: 5, ty: 6, label: "Library" } },
    N: { tile: T.DOOR, door: { to: "konbini", tx: 5, ty: 6, label: "Konbini" } },
    M: { tile: T.DOOR, door: { to: "supermarket", tx: 6, ty: 7, label: "Supermarket" } },
    U: { tile: T.DOOR, door: { to: "restaurant", tx: 5, ty: 6, label: "Restaurant" } },
    E: { tile: T.DOOR, door: { to: "station", tx: 6, ty: 6, label: "Station" } },
  },
  rows: [
    "tttttttttttttttttttttttttttttttttttttttttttttt",
    "t..,....,......,.....,........,......,...~~~.t",
    "t.1111111...S..3333333333333.S.......S.S.~~~.t",
    "t.1111111.f....3333333333333...22222.....~~~.t",
    "t.WwWAWww......WwWwWLWwWwWww...22222...f.~~~.t",
    "t.sssssss..,...sssssssssssss...WwYww.....~~~.t",
    "t.a..s..e........,..s..e.......sssss.....~~~.t",
    "t..d.s.,...d...,....s....,d......s.,d..S.~~~.t",
    "trrrrXrrrrrrrrrrrrrrXrrrrrrrrrrrrXrrrrr..~~~.t",
    "t....s.f....,.......s............s..,.af.~~~.t",
    "t.22222222.....11111111111.ae....s.f.....~~~.t",
    "t.22222222....a11111111111.......s..S....~~~.t",
    "t.WwWNWwWw.....WwWwWMWwWww.......s.f...S.~~~.t",
    "t.ssssssss.....sssssssssss.......s.......~~~.t",
    "t....s..............s..,......,..s.....f.~~~.t",
    "trrrrXrrrrrrrrrrrrrrXrrrrrrrrrrrrXrrrrr..~~~.t",
    "t.a..s.....d....s...,.....d......s..d....~~~.t",
    "t.S..s.f........s....333333333...s....aS.~~~.t",
    "t.f.ppppp.......s....333333333...s..S....~~~.t",
    "t...p~~~p.S.....s....WwWUWwWww...s.f...f.~~~.t",
    "t.S.p~~~p...e...s....sssssssss...s.......~~~.t",
    "t...ppppp.f.....s.......s........s..e....~~~.t",
    "t.f...,....33333333.....s.....d,.......S.~~~.t",
    "t.S.....d..33333333.....s..........S.....~~~.t",
    "t.,........WwWEWwWw.....s.......,......f.~~~.t",
    "t..........ssssssss.....s..,f..S.........~~~.t",
    "t...,....S....s..f......s.....,....,.....~~~.t",
    "t........dqqqqqqqqqqqqqqqqd............S.~~~.t",
    "t..S.f....qqeqqqqeqqqqeqqq....S..........~~~.t",
    "t.a...S.....................a......S.a.f.~~~.t",
    "t...S...f...........f..........f.S.......~~~.t",
    "tttttttttttttttttttttttttttttttttttttttttttttt",
  ],
};

/* ══ INTERIORS ══════════════════════════════════════════════════════════ */

const APARTMENT: MapDef = {
  id: "apartment",
  outdoor: false,
  special: {
    B: { tile: T.BED, interact: { kind: "sleep", label: "Sleep (ends the day)" } },
    K: { tile: T.DESK, interact: { kind: "study", label: "Study grammar" } },
    V: { tile: T.STOVE, interact: { kind: "cook", label: "Cook" } },
    F: { tile: T.FRIDGE, interact: { kind: "fridge", label: "Eat something" } },
    T: { tile: T.TABLE, interact: { kind: "story", label: "Story time" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 5, ty: 5, label: "Go outside" } },
  },
  rows: [
    "IIIIIIIIIII",
    "IBKoooFVCoI",
    "ImooooooooI",
    "ImmoooToooI",
    "IoooooooooI",
    "IoooooooooI",
    "IoooooDoooI",
    "IIIIIIIIIII",
  ],
};

const SCHOOL: MapDef = {
  id: "school",
  outdoor: false,
  special: {
    b: { tile: T.BLACKBOARD, interact: { kind: "lesson", label: "Join the lesson" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 20, ty: 6, label: "Leave school" } },
  },
  rows: [
    "IIIIIbbbIIIIII",
    "IllllllllllllI",
    "IllllllllllllI",
    "IllThllThllllI",
    "IllllllllllllI",
    "IllThllThllllI",
    "IllllllllllllI",
    "IllllllllllllI",
    "IllllllDllllll",
    "IIIIIIIIIIIIII",
  ],
};

const KONBINI: MapDef = {
  id: "konbini",
  outdoor: false,
  special: {
    H: { tile: T.SHELF, interact: { kind: "shop-konbini", label: "Browse shelves" } },
    C: { tile: T.COUNTER, interact: { kind: "shop-konbini", label: "Shop" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 5, ty: 13, label: "Leave" } },
  },
  rows: [
    "IIIIIIIIIIII",
    "ICCCllllHHlI",
    "IllllllllllI",
    "IllHHllHHllI",
    "IllllllllllI",
    "IllHHllHHllI",
    "IllllllllllI",
    "IlllllDlllll",
    "IIIIIIIIIIII",
  ],
};

const SUPERMARKET: MapDef = {
  id: "supermarket",
  outdoor: false,
  special: {
    H: { tile: T.SHELF, interact: { kind: "shop-super", label: "Browse shelves" } },
    C: { tile: T.COUNTER, interact: { kind: "shop-super", label: "Shop" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 20, ty: 13, label: "Leave" } },
  },
  rows: [
    "IIIIIIIIIIIIII",
    "IllHHllHHllHHI",
    "IllllllllllllI",
    "IllHHllHHllHHI",
    "IllllllllllllI",
    "IllHHllHHllHHI",
    "IllllllllllllI",
    "ICCClllllllllI",
    "IllllllDllllll",
    "IIIIIIIIIIIIII",
  ],
};

const STATION: MapDef = {
  id: "station",
  outdoor: false,
  special: {
    "=": { tile: T.PLATFORM, interact: { kind: "train", label: "Take the train" } },
    v: { tile: T.VENDING, interact: { kind: "vending", label: "Buy a drink" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 15, ty: 25, label: "Leave station" } },
  },
  rows: [
    "IIIIIIIIIIIIII",
    "I############I",
    "I============I",
    "IlllllllllllvI",
    "IllllGGllllllI",
    "IllllllllllllI",
    "IllllllllllllI",
    "IlllllDlllllll",
    "IIIIIIIIIIIIII",
  ],
};

const COMPANY: MapDef = {
  id: "company",
  outdoor: false,
  special: {
    P: { tile: T.PC_DESK, interact: { kind: "work", label: "Start your shift" } },
    b: { tile: T.BLACKBOARD, interact: { kind: "meeting-board", label: "Check the schedule" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 15, ty: 25, label: "Take the train home" } },
  },
  rows: [
    "IIIIIbbIIIIIIIII",
    "IccccccccccccccI",
    "IccPPccPPccPPccI",
    "IccccccccccccccI",
    "IccPPccPPccPPccI",
    "IccccccccccccccI",
    "IccPPccPPccccccI",
    "IccccccccccccccI",
    "IccccccDcccccccI",
    "IIIIIIIIIIIIIIII",
  ],
};

const RESTAURANT: MapDef = {
  id: "restaurant",
  outdoor: false,
  special: {
    C: { tile: T.COUNTER, interact: { kind: "shop-restaurant", label: "Order food" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 24, ty: 21, label: "Leave" } },
  },
  rows: [
    "IIIIIIIIIIII",
    "ICCCCooooooI",
    "IooooooooooI",
    "IooThooThooI",
    "IooooooooooI",
    "IooThooThooI",
    "IooooooooooI",
    "IoooooDooooI",
    "IIIIIIIIIIII",
  ],
};

const LIBRARY: MapDef = {
  id: "library",
  outdoor: false,
  special: {
    k: { tile: T.BOOKSHELF, interact: { kind: "read", label: "Reading practice" } },
    K: { tile: T.DESK, interact: { kind: "exam", label: "JLPT exam desk" } },
    D: { tile: T.DOOR, door: { to: "town", tx: 33, ty: 6, label: "Leave" } },
  },
  rows: [
    "IIIIIIIIIIII",
    "IkkkoookkkkI",
    "IooooooooooI",
    "IkkkooKooooI",
    "IooooooooooI",
    "IkkkoookkkkI",
    "IooooooooooI",
    "IoooooDooooI",
    "IIIIIIIIIIII",
  ],
};

export const MAPS: Record<LocationId, MapDef> = {
  town: TOWN,
  apartment: APARTMENT,
  school: SCHOOL,
  konbini: KONBINI,
  supermarket: SUPERMARKET,
  station: STATION,
  company: COMPANY,
  restaurant: RESTAURANT,
  library: LIBRARY,
  park: TOWN, // park is part of the town map (south-west pond area)
};

const compiled = new Map<LocationId, CompiledMap>();

export function getMap(id: LocationId): CompiledMap {
  if (!compiled.has(id)) compiled.set(id, compileMap(MAPS[id]));
  return compiled.get(id)!;
}
