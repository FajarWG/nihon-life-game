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

/* ── Kana → Romaji (mechanical Hepburn-ish transliteration) ─────────────────
 * Used to derive romaji on the fly from kana so we don't need a separate
 * romaji field on every dialogue line / story line / quest text. */

const KANA_ROMAJI: Record<string, string> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "o", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ー: "-", "、": ",", "。": ".", "！": "!", "？": "?", "「": "\"", "」": "\"", "・": " ",
};

const YOUON: Record<string, string> = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
};

/** Katakana → hiragana (shift by the fixed Unicode offset shared by both blocks). */
function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

/** Mechanically transliterate hiragana/katakana into romaji. Best-effort, not a full IME. */
export function kanaToRomaji(kana: string): string {
  if (!kana) return "";
  const hira = kataToHira(kana.trim());
  let out = "";
  for (let i = 0; i < hira.length; i++) {
    const two = hira.slice(i, i + 2);
    if (YOUON[two]) { out += YOUON[two]; i++; continue; }
    const ch = hira[i];
    if (ch === "っ") {
      // sokuon: double the next consonant
      const next = hira.slice(i + 1, i + 3);
      const nextRomaji = YOUON[next] ?? KANA_ROMAJI[hira[i + 1]];
      out += nextRomaji ? nextRomaji[0] : "";
      continue;
    }
    if (ch === "ー") { out += out.slice(-1); continue; } // long vowel mark: repeat previous vowel
    out += KANA_ROMAJI[ch] ?? ch;
  }
  return out;
}
