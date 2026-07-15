/**
 * Language rules for the game UI:
 *  - uiLang    — how FEATURE NAMES are shown:  "ja-en" (日本語 + English),
 *                "ja" (日本語 only) or "en" (English only).
 *  - meaningLang — the language of MEANINGS/translations of Japanese content:
 *                "idn" (Bahasa Indonesia, default) or "en" (English).
 * Content carries optional `idn` fields; when missing we fall back to `en`.
 */

export type UiLang = "ja-en" | "ja" | "en";
export type MeaningLang = "idn" | "en";

const UI_KEY = "nihon-ui-lang";
const MEANING_KEY = "nihon-meaning-lang";
const KANA_KEY = "nihon-show-kana";
const MEANING_SHOW_KEY = "nihon-show-meaning";
const ROMAJI_KEY = "nihon-show-romaji";

let uiLang: UiLang = "ja-en";
let meaningLang: MeaningLang = "idn";
let showKana = false;
let showMeaning = false;
let showRomaji = false;

if (typeof window !== "undefined") {
  const u = localStorage.getItem(UI_KEY) as UiLang | null;
  const m = localStorage.getItem(MEANING_KEY) as MeaningLang | null;
  const k = localStorage.getItem(KANA_KEY);
  const s = localStorage.getItem(MEANING_SHOW_KEY);
  const r = localStorage.getItem(ROMAJI_KEY);
  if (u === "ja-en" || u === "ja" || u === "en") uiLang = u;
  if (m === "idn" || m === "en") meaningLang = m;
  showKana = k === "1";
  showMeaning = s === "1";
  showRomaji = r === "1";
}

export function getUiLang(): UiLang { return uiLang; }
export function getMeaningLang(): MeaningLang { return meaningLang; }

export function setUiLang(l: UiLang) {
  uiLang = l;
  try { localStorage.setItem(UI_KEY, l); } catch { /* private mode */ }
}

export function setMeaningLang(l: MeaningLang) {
  meaningLang = l;
  try { localStorage.setItem(MEANING_KEY, l); } catch { /* private mode */ }
}

export function getShowKana(): boolean { return showKana; }
export function setShowKana(v: boolean) {
  showKana = v;
  try { localStorage.setItem(KANA_KEY, v ? "1" : "0"); } catch { /* private mode */ }
}

export function getShowMeaning(): boolean { return showMeaning; }
export function setShowMeaning(v: boolean) {
  showMeaning = v;
  try { localStorage.setItem(MEANING_SHOW_KEY, v ? "1" : "0"); } catch { /* private mode */ }
}

export function getShowRomaji(): boolean { return showRomaji; }
export function setShowRomaji(v: boolean) {
  showRomaji = v;
  try { localStorage.setItem(ROMAJI_KEY, v ? "1" : "0"); } catch { /* private mode */ }
}

/** Meaning/translation of Japanese content: Indonesian when available & selected. */
export function M(o: { en: string; idn?: string }): string {
  return meaningLang === "idn" && o.idn ? o.idn : o.en;
}

/** Same, for loose fields (e.g. grammar meaning + meaningIdn). */
export function meaning(en: string, idn?: string): string {
  return meaningLang === "idn" && idn ? idn : en;
}

/** Feature label, e.g. L("かばん", "Bag", "Tas") → 「かばん (Tas)」. */
export function L(jp: string, en: string, idn?: string): string {
  const tr = meaningLang === "idn" && idn ? idn : en;
  switch (uiLang) {
    case "ja": return jp;
    case "en": return tr;
    default: return `${jp} (${tr})`;
  }
}
