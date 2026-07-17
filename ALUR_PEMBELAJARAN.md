# 📚 ALUR_PEMBELAJARAN.md — Learning Flow & Pedagogy Audit

> **Reverse-engineered dari codebase `src/` — status per 2026-07-17 (revisi ke-2)**
>
> Revisi sebelumnya (2026-07-14) mencatat gap terbesar: **tidak ada sistem review/SRS sama sekali**,
> `learnedVocab` adalah data mati, tidak ada in-game settings UI, exam tidak memberi XP saat lulus,
> dan ReadScene tidak dibatasi harian. **Semua lima ini sudah diperbaiki.**

---

## 1. BAGAIMANA PEMAIN PERTAMA KALI BERTEMU KONTEN BARU

### 1.1 Kosakata Baru (Vocabulary)

**SchoolScene tetap jadi jalur utama, tapi sekarang dengan seleksi Leitner-aware (bukan cuma sliding-window murni).**

| Mekanisme | Detail |
|-----------|--------|
| **File** | `src/game/scenes/activities/SchoolScene.ts` |
| **Seleksi kata due-review** | `s.learnedVocab.filter(id => { interval = BOX_INTERVALS[box]; return today >= lastSeenDay + interval })` — kata yang sudah dipelajari dan jatuh tempo direview diambil dulu (maks 2 per sesi) |
| **Seleksi kata baru** | Sisa slot (sampai total 4) diisi dari `pool.filter(v => !learnedVocab.includes(id))`, sliding-window berdasarkan hari |
| **Metode** | Pair-matching (`pairs()` widget), sekarang menampilkan romaji juga kalau toggle `getShowRomaji()` aktif |
| **Recording** | `learnedVocab` + `vocabReview[id] = { box, lastSeenDay }` di-update setelah tiap sesi |
| **Status `learnedVocab`** | ✅ **[FIXED]** — dulu "data mati" (ditulis tapi tak pernah dibaca), sekarang **aktif dipakai** untuk menentukan kata mana yang jatuh tempo direview (lihat §4) |

**Cara lain bertemu kosakata (tidak terstruktur, tidak berubah dari sebelumnya):**

| Sumber | Konteks | Terstruktur? |
|--------|---------|-------------|
| **ShopScene** | Nama item di toko | ❌ Hanya pajangan |
| **CookScene** | Nama bahan & langkah resep | ❌ Hanya display |
| **TrainScene** | Pengumuman stasiun, nama stasiun | ❌ Tidak di-test sebagai vocab |
| **ExamScene** | 3 pertanyaan vocab meaning (kini bisa tampil dengan romaji jika toggle aktif) | ⚠️ Testing saja |
| **WorkScene** | Briefing kerja dalam JP | ❌ Tidak di-test |
| **StoryScene** | Vocab recap setelah cerita (7 built-in + AI) | ⚠️ Review, bukan first encounter |
| **Board Notices** | 3 notifikasi papan kantor | ❌ Pajangan pasif |
| **Dialog NPC** (talk) | 40 baris dialog (4 NPC × 5 tier) | ❌ Tidak di-test sebagai vocab, tapi kini didampingi toggle furigana/romaji/translate (lihat §2) |

### 1.2 Grammar Baru

**Tidak berubah secara mekanisme, tapi kini dengan bilingual explanation penuh dan sistem peek-penalty.**

| Mekanisme | Detail |
|-----------|--------|
| **File** | `src/game/scenes/activities/StudyScene.ts` |
| **Seleksi** | `grammarByLevel(s.jlpt).find(g => !learnedGrammar.includes(g.id))` — cari yang belum dipelajari; kalau semua sudah, rotasi `(day-1) % pool.length` |
| **Penyajian** | Card: title (JP), meaning, **explanation dwibahasa (EN/IDN — dulu selalu EN)**, contoh kalimat |
| **Latihan** | 2–4 exercise (`order`/`fill`), masing-masing kini punya opsi **"👁 Peek"** — buka hint selama 7 detik, ditandai `peeked` |
| **Recording** | `G().learnGrammarPoint(id)` dipanggil **hanya jika `score > 0`** (minimal 1 exercise benar) — ⚠️ **[SEBAGIAN FIXED]**: dulu di-mark "learned" tanpa syarat sama sekali (0/3 pun tetap "learned"); sekarang ada syarat minimal, tapi belum ada threshold performa penuh (mis. wajib ≥50%) |
| **XP** | `10 + (score × 5)`, dikurangi penalti kalau memakai peek: `penaltyXp = round(peekCount × 5 × 0.2)`, minimum XP akhir 1 |

> ✅ **[BARU]** Sistem peek dengan penalti kecil (`STUDY_PEEK_PENALTY = 0.2`) memberi jalan keluar untuk pemain yang benar-benar buntu, tanpa membuat "mencontek" sepenuhnya gratis.

### 1.3 Kanji

**Data sekarang jauh lebih kaya (306 entri terstruktur — lihat ALUR_KURIKULUM.md §2), tapi ALUR PENGAJARANNYA belum berubah dari sebelumnya.**

Kanji masih hanya muncul secara implisit melalui:
- **ReadScene "Kanji Corner"** — puzzle match kanji↔kana untuk 3 kata dari `vocabByLevel(level).filter(v => v.jp !== v.kana)`, diseleksi `(day * 3) % pool.length`. Kini punya kolam kata yang lebih besar (172 dari 180 kata punya kanji) berkat penambahan Fase 3.
- **Tampilan kosakata** di SchoolScene/ShopScene/dialog — pemain melihat kanji tapi tidak diajari stroke order, radical, atau distinction on/kun secara eksplisit dalam UI, **meskipun data untuk itu (`onyomi`, `kunyomi`, `strokeCount`) sudah tersedia penuh di `kanji.ts`**.

> 🟡 **Gap yang masih terbuka:** infrastruktur data kanji sudah lengkap (306 entri dengan bacaan on/kun + jumlah goresan), tapi belum ada scene/UI yang benar-benar memanfaatkannya untuk pengajaran terstruktur (mis. flashcard kanji dengan stroke order, atau quiz on'yomi vs kun'yomi). Ini adalah gap arsitektur berikutnya yang paling jelas untuk ditutup, karena datanya sudah siap pakai.

---

## 2. [BARU] SISTEM TAMPILAN: KANA, FURIGANA, TRANSLATE, ROMAJI

Bagian ini berubah signifikan sejak revisi sebelumnya — dulu toggle hanya bisa diubah lewat localStorage manual ("Tidak ada in-game settings menu yang terlihat di codebase"). **Sekarang ada dua lapis kontrol: menu Settings permanen, dan toggle cepat per sesi dialog.**

### 2.1 Toggle Settings (Permanen, via Menu)

| Setting | localStorage Key | Values | Default |
|---------|-------------------|--------|---------|
| UI Language | `nihon-ui-lang` | `"ja-en"`, `"ja"`, `"en"` | `"ja-en"` |
| Meaning Language | `nihon-meaning-lang` | `"idn"`, `"en"` | `"idn"` |
| Show Kana | `nihon-show-kana` | `"1"`, `"0"` | `"0"` (OFF) |
| Show Meaning | `nihon-show-meaning` | `"1"`, `"0"` | `"0"` (OFF) |
| Show Romaji **(baru)** | `nihon-show-romaji` | `"1"`, `"0"` | `"0"` (OFF) |

> ✅ **[FIXED]** Semua 5 toggle di atas kini bisa diubah langsung dari **tab ⚙ Settings di Menu** (`MenuScene.renderSettings()`), bukan cuma lewat localStorage manual dari developer console. Ini menutup gap 🟠 LOW lama "Tidak Ada In-Game Settings UI".

### 2.2 [BARU] Toggle Cepat Per-Dialog (Session-Scoped)

Selain setting permanen di atas, sejak sesi bug-fix terakhir setiap **kotak dialog** (NPC talk box di `UIScene`, dan `StoryScene`) punya 3 tombol kecil di kanan-atas:

| Tombol | Fungsi |
|--------|--------|
| 振 (Furigana) | Nyalakan/matikan tampilan kana untuk sesi dialog ini |
| Aa (Romaji) | Nyalakan/matikan romaji (dihasilkan on-the-fly dari kana via `kanaToRomaji()`) |
| 訳 (Translate) | Nyalakan/matikan terjemahan baris saat ini |

**Perilaku:**
- Toggle ini **mulai dari nilai setting global** (§2.1) tiap kali dialog baru dibuka, lalu bisa diubah bebas selama sesi tanpa mengubah setting permanen.
- Menyalakan salah satu untuk **pertama kali** dalam satu sesi dialog memotong **2 XP vocabulary** (`PEEK_XP_COST`), dicatat lewat flag `dlgPeeked` per jenis (kana/romaji/meaning) — hanya kena sekali per toggle per sesi, bukan tiap kali switch on/off berulang.
- Berlaku identik di `StoryScene` (baik cerita bawaan maupun AI-generated).

> Tujuan desainnya eksplisit: pemain baru yang bingung "ini percakapan apa" bisa langsung intip furigana/romaji/arti tanpa keluar ke menu, dengan trade-off XP kecil yang menjaga insentif untuk mencoba membaca dulu.

### 2.3 Romaji — Kini Ditampilkan, Bukan Cuma Data Statis

```
Gap lama: "Romaji hanya ada di data, tidak pernah ditampilkan di UI game."

Status sekarang: ✅ FIXED. Field `romaji` di VocabEntry kini dipakai aktif
(SchoolScene pair-matching, ExamScene vocab question). Untuk konten yang
TIDAK punya field romaji statis (dialogue line, story line, quest text),
dibuatkan utility kanaToRomaji() yang mentransliterasi field `kana` secara
mekanis (Hepburn-style, termasuk youon/sokuon/choonpu) — sehingga romaji
tetap muncul di dialog & cerita tanpa perlu backfill data manual di semua
konten lama.
```

### 2.4 Di Mana Kana/Furigana/Romaji/Translate Ditampilkan (Ringkasan Terbaru)

| Lokasi | Kana | Romaji | Translate | Catatan |
|--------|------|--------|-----------|---------|
| **Dialogue Box** (NPC talk) | ✅ | ✅ **(baru)** | ✅ | Toggle per-sesi + setting permanen |
| **StoryScene** | ✅ | ✅ **(baru)** | ✅ | Sama seperti dialogue box, plus vocab recap |
| **SchoolScene vocab** | ✅ | ✅ **(baru)** | via `M()` | Dulu romaji tidak ditampilkan sama sekali |
| **StudyScene card** | ✅ | — | ✅ (dwibahasa, dulu EN-only) | |
| **CookScene steps** | ✅ | — | ✅ | |
| **ReadScene passage** | ✅ | — | — | |
| **ExamScene questions** | ✅ (selalu) | ✅ **(baru, opsional)** | via `M()` untuk distractor | |
| **ShopScene shelf** | ✅ | — | — | |

---

## 3. ALUR XP → SKILL → JLPT LEVEL

### 3.1 Diagram Alur (Diperbarui)

```
AKTIVITAS                     SKILL XP                  TOTAL XP          JLPT
─────────                     ────────                  ────────          ────
StudyScene ──(peek penalty)─▶ grammar XP ──┐
SchoolScene ───┬──────────▶ vocab XP (SRS-aware) ─┤
               ├──────────▶ reading XP ─┤
               ├──────────▶ listening ──┤
               └──────────▶ kanji XP ───┤
WorkScene ────┬───────────▶ vocab XP ───┤
              ├───────────▶ reading XP ─┤
              └───────────▶ kanji XP ───┤
ReadScene (1×/hari) ─┬─────▶ reading XP ─┤    sum()     ┌──────────────┐
                     └─────▶ kanji XP ───┤───────────▶  │ totalXp()    │
TrainScene ───┬───────────▶ reading XP ─┤              │ >= threshold? │
              ├───────────▶ listening ──┤              └──────┬───────┘
              └───────────▶ kanji XP ───┤                     │
ShopScene ────┬───────────▶ vocab XP ───┤              ┌──────▼───────┐
              └───────────▶ reading XP ─┤              │ examReady()  │
CookScene ────┬───────────▶ vocab XP ───┤              └──────┬───────┘
              └───────────▶ reading XP ─┤                     │
StoryScene ───▶ (dinamis, built-in + AI)│                     │
ExamScene ────▶ grammar+reading (LULUS) atau grammar (GAGAL) ─┘
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
                                                   +20 grammar +10 reading  (atau N3)
                                                   (dulu: 0 XP saat lulus!)
```

**[BARU]** HUD kanan-atas kini menampilkan progress real-time menuju level berikutnya, mis. `230/300 XP → N4`, bukan cuma level saat ini tanpa konteks jarak.

### 3.2 Threshold Level-Up

**Tidak berubah** — N5≥300, N4≥700, N3≥1400 (locked ke N2).

### 3.3 Detail Exam System — Perubahan Utama

| Aspek | Dulu | Sekarang |
|-------|------|----------|
| **Bonus saat lulus** | ❌ Tidak ada XP sama sekali | ✅ **+20 grammar, +10 reading** |
| **Konsolasi saat gagal** | +5 grammar XP | +5 grammar XP (tidak berubah) |
| **Soal vocab** | `「jp」（kana）` selalu | Kini opsional tampil **+ romaji** kalau toggle aktif |
| **Retry gate** | 1×/hari via `flags.examFailedDay` | Tidak berubah |
| **Soal & passing grade** | 6 soal (2 grammar, 3 vocab, 1 reading), pass ≥4/6 | Tidak berubah |

> ✅ **[FIXED]** Gap lama "logika reward terbalik: lulus = 0 XP, gagal = +5 XP, membuat grinding-gagal lebih menguntungkan" **sudah diperbaiki sepenuhnya**. Lulus sekarang jelas lebih menguntungkan (+30 total XP) daripada gagal (+5 XP), sekaligus tetap memberi sedikit konsolasi supaya kegagalan tidak terasa sia-sia.

---

## 4. [FIXED] MEKANISME REVIEW / PENGULANGAN — SRS Leitner Box

### 4.1 Status: Dari "Tidak Ada Sistem Review" → Leitner Box Aktif

| Mekanisme | Dulu | Sekarang |
|-----------|------|----------|
| **Spaced Repetition (SRS)** | ❌ Tidak ada | ✅ **Leitner box 1–5** via `gameState.vocabReview` |
| **Due-for-review logic** | ❌ Tidak ada | ✅ `SchoolScene` mengecek `today >= lastSeenDay + BOX_INTERVALS[box]` tiap sesi |
| **Forgetting curve** | ❌ Tidak ada | ⚠️ Masih sederhana (fixed interval per box, bukan kurva adaptif penuh) |
| **Grammar re-study gating** | ⚠️ Parsial (tidak berubah) | ⚠️ Sama — rotasi deterministik setelah semua "learned", tanpa interval SRS untuk grammar |

### 4.2 Cara Kerja Leitner Box (`SchoolScene.ts`)

```
BOX_INTERVALS = [0, 1, 2, 4, 8, 16]  // index 1-5, index 0 tak dipakai

Tiap sesi vocabulary di SchoolScene:
1. Cari kata di `learnedVocab` yang box-nya jatuh tempo
   (today >= lastSeenDay + BOX_INTERVALS[box]) → ambil maks 2, acak.
2. Isi sisa slot (sampai 4 kata/sesi) dengan kata BARU yang belum pernah
   dipelajari (sliding window per hari).
3. Setelah pair-matching selesai:
   - Kalau SEMPURNA (0 kesalahan) → box naik satu tingkat (maks box 5),
     lastSeenDay = hari ini. Interval review berikutnya makin panjang.
   - Kalau ADA kesalahan → box turun/reset ke 1, lastSeenDay = hari ini.
     Kata ini akan muncul lagi besok (interval box 1 = 1 hari).
```

Ini adalah implementasi SRS klasik (mirip Anki/SM-2 sederhana) yang benar-benar **menutup gap 🔴 HIGH terbesar** dari revisi dokumen sebelumnya: *"learnedVocab ditulis tapi tidak pernah dibaca... 128 vocabulary entries with full tracking infrastructure that goes completely unused."*

### 4.3 Apa yang Terjadi dengan Konten "Lama" Sekarang

| Konten | Dulu | Sekarang |
|--------|------|----------|
| **Grammar** | Rotasi ulang SEMUA setelah semua "learned", tanpa tracking mastery | Tidak berubah — masih rotasi deterministik, **belum** pakai Leitner box seperti vocabulary |
| **Vocabulary** | `learnedVocab` dead data, selalu sliding-window murni | ✅ **Leitner box aktif** — kata lama diprioritaskan ulang sesuai jadwal review, bukan sekadar diabaikan |
| **Kanji** | Tidak ada tracking, selalu random 3 kata | Tidak berubah — ReadScene Kanji Corner masih random per hari, belum terhubung ke sistem SRS yang sama seperti vocabulary |

### 4.4 Peek Mechanic — Bentuk "Bantuan Terkontrol" Baru (Fase 2 + sesi ini)

Selain SRS, ada dua sistem "bantuan dengan biaya kecil" yang saling melengkapi:

| Sistem | Lokasi | Biaya | Durasi |
|--------|--------|-------|--------|
| **👁 Peek button** | `ask()`/`order()` di `ActivityBase` — dipakai StudyScene, ExamScene | Penalti XP (`STUDY_PEEK_PENALTY = 0.2` × 5 per peek, khusus StudyScene) | Tampil 7 detik lalu hilang otomatis |
| **Toggle furigana/romaji/translate** | `UIScene` dialogue box, `StoryScene` | 2 XP vocabulary, sekali per toggle per sesi | Tetap menyala sampai dimatikan manual atau sesi berakhir |

Keduanya dirancang dengan filosofi sama: pemain baru tidak pernah benar-benar terjebak buntu, tapi tetap ada insentif kecil untuk mencoba tanpa bantuan dulu.

---

## 5. GAP DALAM ALUR PEMBELAJARAN — STATUS TERKINI

| Gap (revisi 2026-07-14) | Status Sekarang |
|-----|-----------------|
| 🔴 Tidak Ada Review System | ✅ **FIXED (untuk vocabulary)** — Leitner box SRS aktif; grammar & kanji masih belum punya SRS setara |
| 🔴 learnedVocab Data Mati | ✅ **FIXED** — kini jadi tulang punggung sistem SRS |
| 🟡 Tidak Ada Pengajaran Kanji Terstruktur | ⚠️ **SEBAGIAN** — data (306 entri) sudah lengkap, tapi UI/scene pengajaran khusus kanji (stroke order, on/kun quiz) masih belum ada |
| 🟡 Grammar "Learned" Tanpa Mastery Check | ⚠️ **SEBAGIAN FIXED** — kini butuh minimal 1 exercise benar (dulu 0/3 pun tetap "learned"), tapi belum ada threshold performa penuh |
| 🟡 Exam Tidak Memberi XP Saat Lulus | ✅ **FIXED** — +20 grammar +10 reading saat lulus |
| 🟠 Tidak Ada Progression Content di N3 | ✅ **MEMBAIK BESAR** — reading/listening N3 dari 0 jadi 5+5; vocab N3 tetap 40 (tidak bertambah); masih belum ada N2 |
| 🟠 Tidak Ada In-Game Settings UI | ✅ **FIXED** — tab ⚙ Settings di Menu, plus toggle cepat per-dialog |
| 🟠 ReadScene Tidak Terbatas Harian | ✅ **FIXED** — kini `markActivity("reading")` dipanggil, dibatasi 1×/hari seperti aktivitas lain |

### Gap yang Masih Terbuka

| Gap | Severity | Detail |
|-----|----------|--------|
| **Grammar belum punya SRS** | 🟡 MEDIUM | Vocabulary sudah punya Leitner box penuh; grammar masih rotasi deterministik sederhana tanpa interval berbasis performa |
| **Kanji belum punya alur pengajaran khusus** | 🟡 MEDIUM | Data (onyomi/kunyomi/strokeCount) sudah siap dipakai, tinggal dibuatkan scene/widget yang benar-benar mengajarkannya (bukan cuma match kanji↔kana pasif) |
| **Grammar mastery check belum penuh** | 🟠 LOW | Syarat "learned" masih longgar (≥1 exercise benar), belum ada threshold seperti "≥50% benar" |
| **N2/N1 belum ada konten** | 🟠 LOW | Konsisten dengan ALUR_KURIKULUM.md — begitu ditambahkan, alur pembelajaran perlu diperluas ke level ini juga |

---

## 6. RINGKASAN ALUR IDEAL vs AKTUAL — STATUS TERKINI

| Tahap | Ideal | Aktual (dulu) | Aktual (sekarang) |
|-------|-------|----------------|----------------------|
| **Encounter** | Pemain bertemu kata/grammar baru dalam konteks | ✅ SchoolScene, StudyScene | ✅ Sama, plus toggle furigana/romaji/translate di semua dialog untuk membantu encounter pertama |
| **Teach** | Penjelasan arti, cara pakai, contoh | ✅ Grammar card (EN-only) | ✅ **Grammar card kini dwibahasa (EN+IDN)** |
| **Practice** | Latihan interaktif | ✅ order/fill, pair matching | ✅ Sama, plus peek-with-penalty di StudyScene/ExamScene |
| **Record** | Tracking apa yang sudah dipelajari | ⚠️ Grammar: iya. Vocab: dead data | ✅ **Vocab kini benar-benar dipakai untuk SRS**; grammar tracking tidak berubah |
| **Review** | Pengulangan terjadwal (SRS) | ❌ Tidak ada | ✅ **Leitner box untuk vocabulary** (grammar & kanji belum) |
| **Master** | Ujian / production task | ⚠️ Exam 1×/level, reward XP terbalik | ✅ **Exam reward XP kini logis** (lulus > gagal); masih 1× per level, belum menguji mastery per-item |
| **Apply** | Penggunaan dalam konteks baru | ✅ Work tasks, resep, dialogue | ✅ Sama, plus 7 built-in story + side quest baru per NPC yang memberi konteks aplikasi tambahan |
