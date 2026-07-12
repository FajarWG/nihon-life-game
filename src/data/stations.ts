import type { Station, TrainLine } from "@/core/types";

/** Sample rail network — one line, six stations. Extend by following the types. */
export const STATIONS: Station[] = [
  { id: "sakuramachi", nameJp: "桜町", kana: "さくらまち", romaji: "Sakuramachi", lines: ["sakura"] },
  { id: "gakuenmae", nameJp: "学園前", kana: "がくえんまえ", romaji: "Gakuen-mae", lines: ["sakura"] },
  { id: "chuo", nameJp: "中央", kana: "ちゅうおう", romaji: "Chūō", lines: ["sakura"] },
  { id: "minatominami", nameJp: "港南", kana: "こうなん", romaji: "Kōnan", lines: ["sakura"] },
  { id: "midorigaoka", nameJp: "緑が丘", kana: "みどりがおか", romaji: "Midorigaoka", lines: ["sakura"] },
  { id: "kuko", nameJp: "空港", kana: "くうこう", romaji: "Airport", lines: ["sakura"] },
];

export const LINES: TrainLine[] = [
  {
    id: "sakura", nameJp: "さくら線", nameEn: "Sakura Line", color: 0xe86ca4,
    stations: ["sakuramachi", "gakuenmae", "chuo", "minatominami", "midorigaoka", "kuko"],
  },
];

export const STATION_MAP: Record<string, Station> = Object.fromEntries(STATIONS.map(s => [s.id, s]));
