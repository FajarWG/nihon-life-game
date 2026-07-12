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

let uiLang: UiLang = "ja-en";
let meaningLang: MeaningLang = "idn";

if (typeof window !== "undefined") {
  const u = localStorage.getItem(UI_KEY) as UiLang | null;
  const m = localStorage.getItem(MEANING_KEY) as MeaningLang | null;
  if (u === "ja-en" || u === "ja" || u === "en") uiLang = u;
  if (m === "idn" || m === "en") meaningLang = m;
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
