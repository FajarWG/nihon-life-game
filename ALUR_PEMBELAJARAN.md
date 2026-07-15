# 📚 ALUR_PEMBELAJARAN.md — Learning Flow & Pedagogy Audit

> **Reverse-engineered dari codebase `src/` — status per 2026-07-14**

---

## 1. BAGAIMANA PEMAIN PERTAMA KALI BERTEMU KONTEN BARU

### 1.1 Kosakata Baru (Vocabulary)

**Satu-satunya cara pemain bertemu kosakata baru yang terstruktur: SchoolScene (kelas)**

| Mekanisme | Detail |
|-----------|--------|
| **File** | `src/game/scenes/activities/SchoolScene.ts` |
| **Seleksi** | `vocabByLevel(G().jlpt)` — 4 kata per sesi, sliding window `(day-1)*4 % (pool.length - 4)` |
| **Metode** | Pair-matching (`pairs()` widget): JP term kiri, arti (EN/IDN) kanan, shuffled |
| **Recording** | Kata yang sudah dimainkan di pair-matching ditulis ke `gameStore.setState({ learnedVocab: [...s.learnedVocab, id] })` di `SchoolScene.ts` |
| **Status `learnedVocab`** | [DATA MATI] — ditulis ke save data tapi **tidak pernah dibaca kembali** oleh sistem manapun. Tidak ada logic yang pakai `learnedVocab` untuk filtering/review/repetition |

**Cara lain bertemu kosakata (tidak terstruktur):**

| Sumber | Konteks | Terstruktur? |
|--------|---------|-------------|
| **ShopScene** | Nama item di toko (onigiri, bento, dll) | ❌ Hanya pajangan, tidak di-test |
| **CookScene** | Nama bahan & langkah resep | ❌ Hanya display, tidak di-test |
| **TrainScene** | Pengumuman stasiun, nama stasiun (kanji + kana) | ❌ Tidak di-test sebagai vocab |
| **ExamScene** | 3 pertanyaan vocab meaning (multiple choice) | ⚠️ Testing saja, bukan teaching |
| **WorkScene** | Briefing kerja dalam JP | ❌ Tidak di-test sebagai vocab |
| **StoryScene** | Vocab recap setelah cerita AI | ⚠️ Hanya review, bukan first encounter |
| **Board Notices** | 3 notifikasi di papan kantor | ❌ Pajangan pasif |

### 1.2 Grammar Baru

**Satu-satunya cara: StudyScene (belajar di meja)**

| Mekanisme | Detail |
|-----------|--------|
| **File** | `src/game/scenes/activities/StudyScene.ts` |
| **Seleksi** | `grammarByLevel(s.jlpt).find(g => !s.learnedGrammar.includes(g.id))` — cari grammar yang belum pernah dipelajari. Jika semua sudah dipelajari, rotasi via `(day - 1) % pool.length` |
| **Penyajian** | Card dengan: title (JP), meaning (EN), explanation (EN — `explanationIdn` tidak pernah diisi!), 2 example sentences (JP + EN + kana) |
| **Latihan** | 2–4 exercises per grammar point (mix `order` untuk menyusun kalimat, `fill` untuk memilih kata/partikel) |
| **Recording** | `G().learnGrammarPoint(id)` dipanggil setelah sesi selesai — **tanpa memandang performa**. Meskipun 0/3 benar, grammar tetap di-mark sebagai "learned" |
| **XP** | `10 + (perfectExercises × 5)` |

### 1.3 Kanji

**Tidak ada sistem pengajaran kanji terpisah.**

Kanji hanya muncul secara **implisit** melalui:
- **ReadScene "Kanji Corner"** — puzzle match kanji↔kana untuk 3 kata dari `vocabByLevel(level).filter(v => v.jp !== v.kana)`, diseleksi dengan `(day * 3) % pool.length`
- **Tampilan kosakata** di SchoolScene/ShopScene — pemain melihat kanji tapi tidak diajari stroke order, radical, on/kun reading

**Tidak ada:** daftar kanji per level, pengajaran stroke order, radical breakdown, on-yomi/kun-yomi distinction, atau kanji-specific exercise.

---

## 2. SISTEM TAMPILAN: KANA, FURIGANA, TRANSLATE, ROMAJI

### 2.1 Toggle Settings

| Setting | localStorage Key | Values | Default | File |
|---------|-----------------|--------|---------|------|
| UI Language | `nihon-ui-lang` | `"ja-en"`, `"ja"`, `"en"` | `"ja-en"` | `src/game/i18n.ts:95` |
| Meaning Language | `nihon-meaning-lang` | `"idn"`, `"en"` | `"idn"` | `src/game/i18n.ts:96` |
| Show Kana | `nihon-show-kana` | `"1"`, `"0"` | `"0"` (OFF) | `src/game/i18n.ts:97` |
| Show Meaning | `nihon-show-meaning` | `"1"`, `"0"` | `"0"` (OFF) | `src/game/i18n.ts:98` |

### 2.2 Bagaimana Toggle Bekerja

#### `L(jp, en, idn?)` — Label Fitur (tombol, judul scene, prompt)
```typescript
// src/game/i18n.ts:79-94
export function L(jp: string, en: string, idn?: string): string {
  const ui = getUiLang();
  if (ui === "ja") return jp;                                    // かばん
  if (ui === "en") return getMeaningLang() === "idn" && idn ? idn : en;  // Tas
  return `${jp} (${getMeaningLang() === "idn" && idn ? idn : en})`;      // かばん (Tas)
}
```

#### `M(obj)` — Arti dari Objek Konten (dialogue line, step resep, vocab)
```typescript
// src/game/i18n.ts:102-104
export function M(o: { en: string; idn?: string }): string {
  return getMeaningLang() === "idn" && o.idn ? o.idn : o.en;
}
```

#### `meaning(en, idn?)` — Pasangan String Lepas
```typescript
// src/game/i18n.ts:106-108
export function meaning(en: string, idn?: string): string {
  return getMeaningLang() === "idn" && idn ? idn : en;
}
```

### 2.3 Di Mana Kana/Furigana Ditampilkan

Kana (furigana/reading) ditampilkan di **semua lokasi teks Jepang utama** dengan pola yang konsisten:

| Lokasi | File | Kapan Kana Muncul |
|--------|------|-------------------|
| **Dialogue Box** | `UIScene.ts:191` | Setelah typewriter selesai, jika `getShowKana()` true DAN `line.kana` ada |
| **SchoolScene vocab** | Pairs widget teks JP (ada kana di VocabEntry, tapi pairs hanya menampilkan `jp`) | — |
| **StudyScene card** | Example sentences punya `kana` di data grammar | Jika `getShowKana()` true |
| **CookScene steps** | `JpText.kana` per step resep | Jika `getShowKana()` true |
| **ReadScene passage** | `ReadingPassage.lines[].kana` | Jika `getShowKana()` true |
| **ExamScene questions** | Vocab questions: `jp（kana）` — SELALU ditampilkan dengan kana | `src/game/scenes/activities/ExamScene.ts` |
| **ShopScene shelf** | `ITEM_MAP[id].kana` di bawah nama item | Jika `getShowKana()` true |
| **StoryScene cards** | `line.kana` dari AI-generated story | Jika `getShowKana()` true |

### 2.4 Di Mana Terjemahan Ditampilkan

| Lokasi | Kapan Meaning Muncul |
|--------|---------------------|
| **Dialogue Box** | Setelah typewriter selesai, jika `getShowMeaning()` true |
| **StudyScene card** | Explanation selalu EN (`explanationIdn` tidak diisi!) |
| **ExamScene choices** | Vocab distractors pakai `M()` (EN atau IDN) |
| **StoryScene cards** | Jika `getShowMeaning()` true |
| **Semua label tombol** | Via `L()` — tergantung `uiLang` setting |

### 2.5 Romaji

**Romaji hanya ada di data, tidak pernah ditampilkan di UI game.**

Field `romaji` di `VocabEntry` (`src/data/vocabulary.ts`) tersedia untuk semua 128 kata sebagai data statis, tapi tidak ada kode game yang membaca atau menampilkan `romaji`. Fungsinya murni referensi development.

### 2.6 Menu Toggle UI

Setting language & kana/meaning diubah melalui:
- **LocalStorage langsung** (developer)
- **Tidak ada in-game settings menu yang terlihat di codebase**

---

## 3. ALUR XP → SKILL → JLPT LEVEL

### 3.1 Diagram Alur

```
AKTIVITAS                     SKILL XP                  TOTAL XP          JLPT
─────────                     ────────                  ────────          ────
StudyScene ──────────────▶ grammar XP ──┐
SchoolScene ───┬──────────▶ vocab XP ───┤
               ├──────────▶ reading XP ─┤
               ├──────────▶ listening ──┤
               └──────────▶ kanji XP ───┤
WorkScene ────┬───────────▶ vocab XP ───┤
              ├───────────▶ reading XP ─┤
              └───────────▶ kanji XP ───┤
ReadScene ────┬───────────▶ reading XP ─┤
              └───────────▶ kanji XP ───┤    sum()     ┌──────────────┐
TrainScene ───┬───────────▶ reading XP ─┤───────────▶  │ totalXp()    │
              ├───────────▶ listening ──┤              │              │
              └───────────▶ kanji XP ───┤              │ >= threshold? │
ShopScene ────┬───────────▶ vocab XP ───┤              │              │
              └───────────▶ reading XP ─┤              └──────┬───────┘
CookScene ────┬───────────▶ vocab XP ───┤                     │
              └───────────▶ reading XP ─┤              ┌──────▼───────┐
StoryScene ───▶ (dinamis)               │              │ examReady()  │
ExamScene ────▶ grammar XP (jika gagal)─┘              └──────┬───────┘
                                                              │
                              ┌───────────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  ExamScene      │
                    │  6 soal         │
                    │  pass ≥ 4/6     │
                    └────┬────────┬───┘
                    pass  │        │ fail
                          ▼        ▼
                   passExam()  flags.examFailedDay = day
                   jlpt = N4   +5 grammar XP (konsolasi)
                   (atau N3)
```

### 3.2 Threshold Level-Up

| Current Level | XP Dibutuhkan (`totalXp()`) | Exam Unlock | Status Exam Content |
|---------------|----------------------------|-------------|---------------------|
| N5 | ≥ 300 | N4 | [IMPLEMENTED] |
| N4 | ≥ 700 | N3 | [IMPLEMENTED] |
| N3 | ≥ 1400 | N2 | [BLOCKED] — `next === "N2"` ditolak oleh `examReady()` |
| N2 | (tidak ada threshold) | N1 | [BLOCKED] |
| N1 | — | — | Max level |

```typescript
// src/game/state/gameState.ts:136-140
examReady: () => {
  const s = get();
  const need = LEVEL_XP[s.jlpt];
  const next = NEXT_LEVEL[s.jlpt];
  return need !== undefined && (next === "N4" || next === "N3") && s.totalXp() >= need;
},
```

### 3.3 Detail Exam System

| Aspek | Detail |
|-------|--------|
| **File** | `src/game/scenes/activities/ExamScene.ts` |
| **Soal** | 6 total: 2 grammar fill, 3 vocab meaning, 1 reading comprehension |
| **Sumber soal grammar** | `grammarByLevel(curJlpt)` → filter exercise `kind === "fill"` → shuffle → take 2 |
| **Sumber soal vocab** | `vocabByLevel(curJlpt)` → shuffle → take 3. Tiap soal: `「jp」（kana）` + 2 distractor random dari pool yang sama |
| **Sumber reading** | `READINGS.filter(r => r.level === curJlpt)[0]` → fallback ke `READINGS[0]` (N5) |
| **Pass** | ≥ 4/6 benar → `passExam()` |
| **Fail** | < 4/6 → `flags.examFailedDay = day`, +5 grammar XP |
| **Bonus pass** | **TIDAK ADA XP** — `passExam()` hanya advance level tanpa memberi XP. Hanya fail yang dapat XP |
| **Retry gate** | Hanya bisa 1× per hari. Dicek via `if (s.flags["examFailedDay"] === s.day)` di `MapScene.ts:294` |
| **Time cost** | 90 menit |
| **Energy cost** | 15 |
| **Exam tests CURRENT level content** | N5 exam pakai N5 vocabulary/grammar/reading. Bukan tes penempatan ke level berikutnya |

---

## 4. MEKANISME REVIEW / PENGULANGAN

### 4.1 Status: [TIDAK ADA SISTEM REVIEW]

Setelah investigasi menyeluruh:

| Mekanisme | Status |
|-----------|--------|
| **Spaced Repetition (SRS)** | ❌ Tidak ada |
| **Leitner Box / SM-2** | ❌ Tidak ada |
| **Flashcard / Quiz review** | ❌ Tidak ada |
| **Due-for-review indicator** | ❌ Tidak ada |
| **Forgetting curve** | ❌ Tidak ada |
| **Grammar re-study gating** | ⚠️ Parsial — `learnedGrammar` dipakai StudyScene untuk memprioritaskan grammar baru, tapi setelah semua "learned", rotasi deterministik tanpa review mechanism |

### 4.2 Apa yang Sebenarnya Terjadi dengan Konten "Lama"

| Konten | Setelah "Learned" |
|--------|-------------------|
| **Grammar** | StudyScene akan merotasi ulang SEMUA grammar (termasuk yang sudah dipelajari) via `(day-1) % pool.length` setelah semua point di level tersebut "learned". Tidak ada tracking seberapa baik pemain menguasainya |
| **Vocabulary** | Tidak ada mekanisme. `learnedVocab` disimpan ke state tapi tidak pernah dibaca. SchoolScene selalu sliding-window next 4 kata tanpa memandang mana yang sudah/belum dipelajari |
| **Kanji** | Tidak ada tracking. ReadScene kanji corner selalu random 3 kata dari vocab pool |

### 4.3 Satu-satunya Bentuk "Pengulangan" yang Ada

1. **Daily quest** kadang meminta aktivitas yang sudah pernah dilakukan (study, talk, eat) — tapi ini pengulangan aktivitas, bukan pengulangan konten pembelajaran
2. **ReadScene** bisa diulang berkali-kali dalam sehari — tapi passage yang sama akan muncul lagi (cycle by day+minute)
3. **Grammar rotation** setelah semua grammar dipelajari — pemain akan melihat grammar yang sama setiap ~10 hari (N5=10 grammar, 1/hari)

---

## 5. GAP DALAM ALUR PEMBELAJARAN

### 🔴 HIGH — Tidak Ada Review System

Pemain belajar grammar/vocab SEKALI lalu tidak pernah di-test lagi sampai ketemu secara kebetulan. Tidak ada retention mechanism. Setelah 128 kata + 30 grammar "dipelajari", tidak ada cara sistematis untuk memastikan pemain benar-benar ingat.

### 🔴 HIGH — learnedVocab Data Mati

`learnedVocab` ditulis tapi tidak pernah dibaca. 128 vocabulary entries with full tracking infrastructure that goes completely unused. Ini buang-buang potensi untuk spaced repetition, progress tracking, atau personalized review.

### 🟡 MEDIUM — Tidak Ada Pengajaran Kanji Terstruktur

Kanji hanya muncul sebagai "bonus" di ReadScene dan sebagai tampilan pasif di teks. Pemain tidak pernah diajari: stroke order, radical, on-yomi vs kun-yomi, atau kanji composition. Padahal JLPT N5 saja butuh ~100 kanji.

### 🟡 MEDIUM — Grammar "Learned" Tanpa Mastery Check

`learnGrammarPoint(id)` dipanggil setelah sesi StudyScene SELESAI — tanpa memandang berapa banyak exercise yang benar. Pemain bisa gagal total (0/3) dan grammar tetap di-mark "learned". Tidak ada threshold minimal performa.

### 🟡 MEDIUM — Exam Tidak Memberi XP Saat Lulus

Logika reward terbalik: lulus ujian = 0 XP, gagal ujian = +5 grammar XP. Ini membuat grinding dengan sengaja gagal exam lebih menguntungkan untuk XP daripada lulus.

### 🟠 LOW — Tidak Ada Progression Content di N3

Begitu pemain mencapai N3, SchoolScene dan ReadScene kehabisan konten (0 N3 reading/listening). Yang tersedia hanya StudyScene (grammar) dan vocabulary pool (40 N3 kata). Exam N3→N2 diblokir total.

### 🟠 LOW — Tidak Ada In-Game Settings UI

Toggle kana/meaning/UI language hanya bisa diubah via localStorage. Pemain biasa tidak bisa mengubah preferensi tampilan tanpa bantuan developer.

### 🟠 LOW — ReadScene Tidak Terbatas Harian

ReadScene bisa diulang tanpa batas dalam sehari (tidak pakai `markActivity()`). Ini membuat grinding reading+kanji XP sangat mudah dengan modal makanan murah — tidak seimbang dengan aktivitas lain yang dibatasi 1×/hari.

---

## 6. RINGKASAN ALUR IDEAL vs AKTUAL

| Tahap | Ideal | Aktual |
|-------|-------|--------|
| **Encounter** | Pemain bertemu kata/grammar baru dalam konteks | ✅ SchoolScene, StudyScene, konteks gameplay |
| **Teach** | Penjelasan arti, cara pakai, contoh | ✅ Grammar card, vocab pairs |
| **Practice** | Latihan interaktif | ✅ order/fill exercises, pair matching |
| **Record** | Tracking apa yang sudah dipelajari | ⚠️ Grammar: iya. Vocab: dicatat tapi dead data |
| **Review** | Pengulangan terjadwal (SRS) | ❌ Tidak ada |
| **Master** | Ujian / production task | ⚠️ Exam hanya 1× per level, tidak menguji mastery per item |
| **Apply** | Penggunaan dalam konteks baru | ✅ Work tasks, resep, dialogue — implicit application |