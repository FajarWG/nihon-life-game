# 🎮 GDD Reverse-Engineered — Nihon Life: Live, Learn, Work

> **Dokumen ini dibuat secara otomatis dengan memindai seluruh codebase (`src/`).**
> Tanggal reverse-engineer: 2026-07-17 (revisi ke-2 — setelah Fase 1–5 + putaran bug-fix UI)
> Status project: Alpha (core loop stabil, sebagian besar loophole Fase 1 sudah diperbaiki, konten narasi & kurikulum diperluas signifikan)

---

## 1. CORE SYSTEM & ARCHITECTURE (SISTEM INTI)

### 1.1 File-File Utama

| Layer | File | Peran |
|-------|------|-------|
| **State** | `src/game/state/gameState.ts` | Zustand store — seluruh state game (waktu, uang, energi, skill, inventory, quest). `addXp` sekarang clamp di 0 (tidak bisa minus) |
| **Types** | `src/core/types.ts` | TypeScript definitions: `SaveData`, `SkillId`, `JlptLevel`, `Season`, `ItemDef`, `NpcDef`, `QuestDef`, `KanjiEntry`, `StoryEvent`, dll |
| **Events** | `src/game/events.ts` | Typed event bus (`Bus`) — komunikasi antar scene via `"time"`, `"money"`, `"xp"`, `"quest-event"`, `"toast"`, `"quest-completed"`, `"leveled-up"`, dll |
| **Time** | `gameState.ts` (actions: `advanceMinutes`, `sleep`) | Engine waktu & siklus hari |
| **Energy** | `gameState.ts` (actions: `addEnergy`) | Sistem stamina karakter (0–100), sekarang dengan forced-sleep gate |
| **Money** | `gameState.ts` (actions: `addMoney`, `spendMoney`) | Sistem ekonomi (¥) |
| **Inventory** | `gameState.ts` (actions: `addItem`, `removeItem`, `eatItem`) | Inventory `Record<string, number>` berbasis item ID |
| **Skills/XP** | `gameState.ts` (actions: `addXp`, `totalXp`, `examReady`, `passExam`) | 5 skill + JLPT level-up |
| **SRS Vocab** | `gameState.vocabReview` + `SchoolScene.ts` | Leitner box (1–5) spaced-repetition untuk kosakata yang sudah dipelajari |
| **Quests** | `src/game/systems/quests.ts` + `src/data/quests.ts` | Engine quest + definisi quest (5 main + 4 side + 3 daily template) |
| **Save/Load** | `src/core/db.ts` (Dexie/IndexedDB) + `src/game/systems/save.ts` | Persistensi data game |
| **NPC** | `src/data/npcs.ts` + `UIScene.ts` (talk/gift) | 4 NPC, masing-masing 5 dialogue tier (f0/f3/f6/f8/f10) + 1 quest |
| **Items** | `src/data/items.ts` | 38 item definitions + shop stock (konbini 11 item, supermarket 22 item) |
| **Maps** | `src/game/maps/maps.ts` + Tiled JSON di `/public/maps/` | 9 lokasi (town, apartment, school, station, konbini, supermarket, company, restaurant, library) |
| **Game Config** | `src/game/index.ts` | Phaser config (960×540 logis, FIT scaling). `render.resolution` sekarang memperhitungkan rasio stretch dari `Scale.FIT` (bukan cuma `devicePixelRatio`) supaya teks tidak blur di layar besar |
| **i18n** | `src/game/i18n.ts` | UI language (ja/en/ja-en), meaning language (idn/en), toggle show kana/meaning/**romaji**, plus `kanaToRomaji()` — transliterasi mekanis kana→romaji on-the-fly |
| **Content Pipeline** | `src/features/content/{schema,prompts,registry}.ts` + `src/app/admin/page.tsx` | "Content Workshop" — 13 content type (`vocabulary`, `grammar`, `items`, `recipes`, `stations`, `lines`, `npcs`, `quests`, `workTasks`, `readings`, `listenings`, `kanji`, `stories`), validasi struktural, merge ke array built-in saat boot |
| **Auth** | `src/server/auth.ts` | Username/password + HMAC session cookie. `isAdmin()` via env `ADMIN_USERNAME` — men-gate akses `/admin` dan endpoint tulis `/api/content` |

### 1.2 Mekanisme Sistem Waktu (Time Engine)

```
KONVERSI: 1 detik real-time = 2 menit in-game
          1 hari in-game  = 12 menit real-time (jika terus berjalan)
```

| Konstanta | Nilai | Keterangan |
|-----------|-------|------------|
| `DAY_START` | 390 menit (06:30) | Hari dimulai pukul 06:30 |
| `DAY_END` | 1440 menit (24:00) | Tengah malam = forced sleep |
| `MAX_ENERGY` | 100 | Energi maksimum |

**Alur waktu:**
1. Waktu berjalan otomatis di `MapScene.update()` — setiap 1 detik real = +2 menit via `G().advanceMinutes(2)`
2. Aktivitas menambah waktu: `G().advanceMinutes(timeCost)` saat selesai
3. Saat `minutes >= DAY_END` **ATAU** `energy <= 0` → scene `Sleep` auto-launch dengan `forced: true` (lihat 5.2 — ini fix dari loophole lama)
4. `sleep()` → reset jam ke `DAY_START (06:30)`, increment `day`, reset `activitiesDone[]`, recalculate season & weather

**Musim (Season):**
- Setiap musim = 28 hari. Siklus penuh = 112 hari
- `(day - 1) % 112 / 28` → spring (hari 1–28), summer (29–56), autumn (57–84), winter (85–112)

**Cuaca (Weather):**
- Di-roll tiap pagi via `rollWeather(season)`
- Winter: 20% snow
- Non-winter: ~22% rain, ~28% cloudy, ~50% sunny

### 1.3 Kebutuhan Dasar Karakter (Needs/Attributes)

Hanya ada **satu atribut kebutuhan**: **Energy** (0–100).

| Atribut | Range | Decay Rate | Recovery |
|---------|-------|------------|----------|
| **Energy** | 0–100 | Via aktivitas: −5 s/d −20 per aksi | Makan: +5 s/d +60 per item; Tidur normal: +100; Tidur paksa: +60 |

**TIDAK ada sistem:** hunger, thirst, hygiene, social, atau happiness sebagai atribut terpisah. Game tetap memiliki 1 dimensi kebutuhan eksplisit, tapi lihat 1.4 untuk gate-gate baru yang menambal dampaknya.

### 1.4 [BARU] Energy Gates per Aktivitas

Setiap aktivitas berenergi kini punya **pintu masuk minimum energy**, dicek di `MapScene.routeInteract()` sebelum scene dibuka:

| Aktivitas | Minimum Energy | Toast jika gagal |
|-----------|-----------------|-------------------|
| Study | 10 | "Too tired to focus…" |
| School | 15 | "Too tired for class…" |
| Work | 20 | "Too tired to work…" |
| Read | 8 | "Too tired to read…" |

Ditambah **forced sleep otomatis saat `energy <= 0`** (dicek tiap frame di `MapScene.update()`, sama seperti gate `DAY_END`). Ini menutup loophole "player bisa jalan-jalan dengan energy 0 tanpa konsekuensi" dari revisi dokumen sebelumnya.

**Catatan:** Sleep (di apartemen) juga sekarang punya jam gate — hanya bisa dipakai mulai `minutes >= 1200` (20:00). Sebelum itu, interact menampilkan toast "It's too early to sleep…". Ini menutup exploit "day-skipping" (spam tidur pagi/siang).

---

## 2. GAMEPLAY LOOP & ACTIONS

### 2.1 Daftar Aktivitas

| # | Aktivitas | Lokasi | Time (min) | Energy | Repeatable? |
|---|-----------|--------|------------|--------|-------------|
| 1 | **Study** (belajar grammar) | Meja apartemen | 60 | −10 | ❌ 1×/hari |
| 2 | **School** (kelas bahasa, 08–16) | Sekolah | 180 | −15 | ❌ 1×/hari |
| 3 | **Work** (kerja IT, 10–19) | Kantor | 240 | −20 | ❌ 1×/hari |
| 4 | **Shop** (belanja) | Konbini/Supermarket/Vending/Restaurant | 30 | −5 | ✅ Bebas |
| 5 | **Cook** (masak) | Dapur apartemen | 45 | −10 | ✅ Bebas |
| 6 | **Read** (baca di perpus) | Perpustakaan | 40 | −8 | ✅ **1×/hari** (fixed — dulu tidak terbatas) |
| 7 | **Train** (naik kereta) | Stasiun | 30–60 | −5 | ✅ Bebas |
| 8 | **Sleep** (tidur) | Tempat tidur | Ke hari berikutnya | +100 / +60 | 1×/hari (malam, **hanya setelah 20:00**) |
| 9 | **Exam** (ujian JLPT) | Perpustakaan | 90 | −15 | ❌ 1×/hari (jika gagal) |
| 10 | **Story** (cerita, kini dengan pool bawaan + AI opsional) | Meja apartemen | 30 | −5 | ✅ Bebas |
| 11 | **Talk/Gift NPC** | Tergantung NPC | 0 | 0 | Talk: 1×/hari/NPC; Gift: 1×/hari/NPC |

### 2.2 Efek Aktivitas terhadap Status

#### XP Rewards per Skill

| Aktivitas | Grammar | Vocab | Reading | Listening | Kanji | Money |
|-----------|---------|-------|---------|-----------|-------|-------|
| **Study** | 10 + (score×5), dikurangi penalti peek | — | — | — | — | — |
| **School** | — | 4–12 | 4–10 | 4–10 | 3 | — |
| **Work** | — | 4 | 6–14 | — | 4–8 | +¥700–2000 |
| **Shop** | — | 0–16 | 0–4 | — | — | −cost |
| **Cook** | — | 5 | 5–10 | — | — | — |
| **Read** | — | — | 3–8 | — | 2–8 | — |
| **Train** | — | — | 5 | 3–8 | 4 | — |
| **Exam** | **20 (lulus) / 5 (gagal)** | — | 10 (lulus) | — | — | — |
| **Story** | (dinamis per cerita, ¥0–500) | (dinamis) | (dinamis) | (dinamis) | (dinamis) | (dinamis) |

> ✅ **[FIXED]** Exam sekarang memberi **+20 grammar & +10 reading XP saat LULUS** (dulu 0 XP saat lulus, hanya dapat XP saat gagal — sudah dibalik logikanya sesuai rekomendasi Fase 1).

### 2.3 Daily Reset (Tidur)

Setiap tidur, yang di-reset:
- `activitiesDone[]` → dikosongkan (semua aktivitas bisa dilakukan lagi, termasuk `"reading"` yang sekarang ikut di-track)
- `npcs[*].talkedToday` → false
- `npcs[*].giftedToday` → false
- `flags.xpToday` → 0
- Energy → 100 (normal) atau 60 (forced)
- Daily quest di-roll ulang

---

## 3. IN-GAME ECONOMY (EKONOMI GAME)

### 3.1 Starting Economy

| Item | Nilai |
|------|-------|
| Uang awal | **¥3,000** |
| Inventory awal | `bread` (×1), `greentea` (×1) |
| Energy awal | 100 |

### 3.2 Sumber Pendapatan

| Sumber | Estimasi Income | Frekuensi |
|--------|-----------------|-----------|
| **Work (shift IT)** | ¥700–2,000 | 1×/hari |
| **Main Quest** (5 quest, N5→N4→N3) | ¥500+¥500+¥1,000+¥1,500+¥2,500 | One-time, berurutan |
| **Side Quest** (4 quest — 1 per NPC) | ¥0 (reward berupa friendship + XP, bukan uang) | One-time per NPC |
| **Daily Quest** | ¥150–200 | 1×/hari |
| **Story (built-in pool / AI)** | ¥0–500 | Setiap sesi Story |

**Work detail:** 2 tiket kerja per shift. Tiap tiket punya `pay` (¥700–1000, khusus level konten N5/N4 — belum ada tiket N3+). Jika perfect → full pay. Jika salah → `round(pay / 2)`.

### 3.3 Pengeluaran

| Kategori | Range Harga |
|----------|-------------|
| Bahan masak (ingredients) | ¥60 – ¥400 |
| Makanan siap saji | ¥110 – ¥480 |
| Minuman | ¥110 – ¥130 |
| Hadiah (gifts) | ¥160 – ¥500 |
| Buku (books) | ¥900 – ¥1,200 |
| Jimat (omamori) | ¥400 |

### 3.4 Analisis Ekonomi

```
Pendapatan harian maksimal:   ~¥2,000 (work) + ¥200 (daily quest) = ~¥2,200
Pengeluaran makan 1×/hari:     ~¥110–480 (makanan siap saji dari konbini)
Biaya masak (semua bahan):     ~¥1,100–1,400 (untuk 1 resep lengkap)

Kesimpulan: Ekonomi masih longgar — belum ada pengeluaran rutin (sewa,
tagihan). Ini rekomendasi Fase 2 yang BELUM diimplementasikan (lihat §5.3).
```

---

## 4. PROGRESSION & STATS

### 4.1 Skill System

**5 Skill (semua start dari 0):**

| Skill | Cara Naik |
|-------|-----------|
| `grammar` | Study, Exam (lulus **dan** gagal), Quest |
| `vocabulary` | School, Shop, Work, Cook, Quest, Story |
| `reading` | School, Work, Cook, Read, Train, Exam (lulus), Quest |
| `listening` | School, Train, Quest |
| `kanji` | School, Work, Read, Train, Quest |

### 4.2 JLPT Level-Up System

```
N5 (start) ──[300 total XP]──▶ N4 ──[700 total XP]──▶ N3 ──[1400 total XP]──▶ N2/N1 (locked)
```

- **Unlock exam:** Ketika `totalXp() >= LEVEL_XP[currentLevel]`, toast muncul: "JLPT exam unlocked!" — dan sekarang **HUD kanan atas menampilkan progress real-time** `230/300 XP → N4` (lihat §6.1)
- **Ujian:** 6 soal (2 grammar fill, 3 vocabulary, 1 reading). Harus benar ≥ 4/6.
- **Pass:** Level naik, emit event `"leveled-up"`, **+20 grammar & +10 reading XP**
- **Fail:** Tidak bisa ujian lagi hari itu. Konsolasi: +5 grammar XP.

### 4.3 Quest System

**Tipe Quest:** `main`, `daily`, `side`, `school`, `work`, `cooking`, `relationship`, `festival`, `story`

| Quest ID | Tipe | Trigger | Reward |
|----------|------|---------|--------|
| `main-1` → `main-5` | main | Auto-chain (lihat ALUR_CERITA.md §1) | ¥500 → ¥2,500 bertahap, XP campuran |
| `side-yuki-1` | relationship | Friendship Yuki ≥ 3 | friendship+2, listening+10 |
| `side-tanaka-1` | relationship | Friendship Tanaka ≥ 3 | friendship+2, grammar+10 |
| `side-yamada-1` | relationship | Friendship Yamada ≥ 3 | friendship+2, reading+10 |
| `side-sato-1` | relationship | Friendship Sato ≥ 3 | friendship+2, vocabulary+10 |
| Daily (×3 rotasi) | daily | Roll tiap pagi | ¥150–200 + 5 XP |

> ✅ **[FIXED]** Setiap dari 4 NPC kini punya tepat 1 side quest sendiri (dulu hanya Yuki). Lihat ALUR_CERITA.md untuk detail naratif tiap quest.

**Event tracking:** Quest objective mendengarkan `Bus` event: `"talk"`, `"gift"`, `"buy"`, `"cook"`, `"eat"`, `"activity"`, dll. Progress otomatis bertambah saat event terjadi.

### 4.4 Friendship System

**4 NPC**, masing-masing sekarang punya **5 dialogue tier** (f0/f3/f6/f8/f10 — dulu cuma f0/f3):
- **Tanaka-sensei** — Guru di sekolah
- **Yuki** — Teman sekelas (relationship quest: hanami/onigiri)
- **Yamada-san** — Rekan kerja senior di kantor
- **Sato-san** — Pegawai konbini

**Friendship range:** 0–10

| Aksi | Δ Friendship |
|------|--------------|
| Ngobrol pertama kali/hari | +1 |
| Kasih hadiah biasa | +1 |
| Kasih hadiah favorit | +2 |
| Quest reward | +2 (tiap side quest) |

**Milestone:** Friendship ≥ 3 + NPC punya `questId` → relationship quest auto-start. Tier dialogue f6/f8/f10 memberi arc personal tiap NPC (lihat ALUR_CERITA.md §4).

---

## 5. ALUR & REKOMENDASI (GAMEPLAY FLOW ANALYSIS)

### 5.1 Core Loop — Flowchart (Mermaid)

```mermaid
flowchart TD
    WAKE[🌅 Bangun 06:30] --> CHECK{Energy < gate aktivitas?}
    CHECK -->|Ya| EAT[🍙 Makan / Minum dari inventory]
    CHECK -->|Tidak| PLAN[📋 Pilih aktivitas]
    EAT --> PLAN

    PLAN --> SCHOOL[🏫 School 08-16<br/>+vocab/reading/listening/kanji<br/>SRS review kata lama<br/>-180min -15e]
    PLAN --> WORK[💼 Work 10-19<br/>+reading/kanji +¥700-2000<br/>-240min -20e]
    PLAN --> STUDY[📚 Study di meja<br/>+grammar (peek = penalti kecil)<br/>-60min -10e]
    PLAN --> SHOP[🛒 Shop<br/>+vocab -¥<br/>-30min -5e]
    PLAN --> COOK[🍳 Cook<br/>+reading/vocab<br/>-45min -10e]
    PLAN --> READ[📖 Read di perpus (1x/hari)<br/>+reading/kanji<br/>-40min -8e]
    PLAN --> TRAIN[🚃 Train ke kantor<br/>+listening<br/>-30~60min -5e]
    PLAN --> STORY[📖 Story (pool bawaan/AI)<br/>+XP dinamis<br/>-30min -5e]
    PLAN --> EXAM[📝 JLPT Exam<br/>+20 grammar/+10 reading jika lulus<br/>-90min -15e]

    SCHOOL --> TICK[⏰ Waktu + energy berkurang]
    WORK --> TICK
    STUDY --> TICK
    SHOP --> TICK
    COOK --> TICK
    READ --> TICK
    TRAIN --> TICK
    STORY --> TICK
    EXAM --> TICK

    TICK --> DAYEND{Jam >= 24:00 ATAU Energy <= 0?}
    DAYEND -->|Ya| FORCED[😴 Forced Sleep]
    DAYEND -->|Tidak| CHECK

    FORCED --> SLEEP_SCREEN[💤 Sleep Screen<br/>+60 energy · XP today · Autosave]
    CHECK -->|Player pilih tidur (hanya ≥20:00)| SLEEP_SCREEN
    SLEEP_SCREEN --> WAKE
```

### 5.2 Status Loophole Lama (dari revisi dokumen sebelumnya)

| Masalah lama | Status sekarang |
|--------------|------------------|
| 🔴 Tidak ada hukuman energy = 0 | ✅ **FIXED** — forced sleep otomatis saat `energy <= 0`, plus energy gate per aktivitas (§1.4) |
| 🟡 Exam tidak memberi XP saat lulus | ✅ **FIXED** — sekarang +20 grammar +10 reading saat lulus |
| 🟡 Read activity tidak bisa di-mark daily | ✅ **FIXED** — `ReadScene.finishActivity({ activity: "reading", ... })` sekarang memanggil `markActivity()`, dibatasi 1×/hari |
| 🟠 Tidak ada pembatas waktu tidur | ✅ **FIXED** — sleep hanya bisa dipakai mulai jam 20:00 |
| 🟡 Ekonomi terlalu mudah (tidak ada pengeluaran rutin) | ⚠️ **BELUM** — masih belum ada sewa/tagihan berkala |
| 🟠 Vending machine & Restaurant langsung consume item | ⚠️ **BELUM** — masih instant-buy only |
| 🟠 Story scene dependensi API eksternal | ✅ **FIXED** — kini ada 7 cerita bawaan (`src/data/stories.ts`) yang dimainkan tanpa API key; AI generation tetap tersedia sebagai tambahan opsional |
| 🟡 Train selalu mengarah ke company | ⚠️ **BELUM** — masih 1 rute, 6 stasiun didefinisikan tapi tidak bisa dipilih |

### 5.3 Rekomendasi yang Masih Terbuka

#### Balancing (belum dikerjakan)

| # | Rekomendasi | Dampak |
|---|-------------|--------|
| 1 | **Tambahkan pengeluaran rutin** | Sewa apartemen ¥500/minggu, atau biaya makan otomatis ¥100/hari |
| 2 | **Turunkan work pay atau tambah variasi** | Sistem performa 3 tingkat (perfect/good/bad), atau tambah tiket level N3+ |
| 3 | **Vending & Restaurant: opsi "beli untuk nanti"** | Biarkan player memilih: langsung makan/minum atau simpan di inventory |
| 4 | **Train multi-rute** | 6 stasiun sudah ada datanya — tinggal buka pilihan destinasi selain company |

#### Kedalaman Gameplay (belum dikerjakan)

| # | Rekomendasi | Dampak |
|---|-------------|--------|
| 5 | **Unlock N2 & N1 exam content** | Slot type system sudah siap; vocabulary/kanji/grammar/drills N3 sudah solid sebagai basis pola konten |
| 6 | **Sistem mingguan: hari libur & event spesial** | Story pool sudah punya `kind: "festival"` — bisa diperluas jadi event kalender |
| 7 | **Tambahkan random encounter di jalan** | Story `kind: "encounter"` sudah ada infrastrukturnya (2 dari 7 built-in story), tinggal dipicu dari world-walk bukan hanya dari menu Story |
| 8 | **Kebutuhan kedua: Social/Mood** | Masih belum ada dimensi kedua selain Energy |

### 5.4 Arsitektur — Status Update

| Komponen | Status | Catatan |
|----------|--------|---------|
| Save/Load (IndexedDB) | ✅ Berfungsi | Auto-save tiap malam |
| UI HUD | ✅ Berfungsi | Jam, uang, energy bar, **XP progress ke level berikutnya**, quest tracker, weather icon |
| Dialogue System | ✅ Berfungsi | Typewriter, choices, **toggle furigana/romaji/translate per-dialog** (lihat §6.1), one-time XP peek fee |
| Shop System | ✅ Berfungsi | 4 tipe toko, cart-based + instant. Cart list di-cap agar tidak overflow layar saat belanja banyak item sekaligus |
| Cook System | ✅ Berfungsi | 3 resep, step-ordering game |
| Train System | ⚠️ Parsial | Hanya 1 rute, selalu ke company (belum berubah) |
| Quest Engine | ✅ Berfungsi | Event-driven, auto-progress, 5 main + 4 side + 3 daily |
| Story System | ✅ Berfungsi (offline-ready) | 7 cerita bawaan + AI generation opsional (Groq→Gemini fallback) |
| Content Pipeline | ✅ Berfungsi | Postgres + IndexedDB cache, 13 content type, admin-gated via `ADMIN_USERNAME` |
| i18n (3 bahasa) | ✅ Berfungsi | UI: ja/en/ja-en; Meaning: idn/en; Kana/Romaji/Meaning: on/off per dialog |
| Exam System | ✅ Berfungsi | Reward XP saat lulus sudah konsisten; N2/N1 masih belum tersedia |
| NPC Schedule | ✅ Berfungsi | NPC muncul/pulang sesuai jam; wander-tween tidak lagi crash saat jadwal berganti mid-animasi |
| Kanji Curriculum | ✅ **BARU** | 306 entri (`src/data/kanji.ts`) dengan onyomi/kunyomi/stroke count/exampleVocabIds — dulu tidak ada sama sekali |
| SRS Vocabulary | ✅ **BARU** | Leitner box 1–5 di `SchoolScene`, kata lama otomatis muncul lagi untuk direview |

---

## 6. [BARU] UI/UX — Perubahan Sesi Bug-Fix Terakhir

### 6.1 Toggle Furigana/Romaji/Translate per Dialog

Tiga tombol kecil di kanan-atas setiap kotak dialog (NPC talk, story scene) memungkinkan pemain baru menyalakan/mematikan furigana, romaji, dan terjemahan **per sesi dialog**, tanpa harus keluar ke menu Settings. Menyalakan salah satu untuk pertama kali dalam satu sesi dialog memotong 2 XP vocabulary (sekali saja per toggle per sesi) — insentif kecil supaya pemain tetap mencoba membaca tanpa bantuan dulu.

Romaji dihasilkan on-the-fly dari field `kana` via `kanaToRomaji()` (transliterasi Hepburn mekanis), bukan field data statis — jadi berlaku otomatis untuk semua dialog/cerita yang sudah punya `kana`, tanpa perlu backfill data romaji manual.

### 6.2 HUD — Progress XP ke Level Berikutnya

Card kanan-atas kini menampilkan progress eksplisit, misalnya `230/300 XP → N4`, mengganti tampilan lama yang hanya menunjukkan level saat ini tanpa indikasi seberapa dekat ke level berikutnya.

### 6.3 Perbaikan Bug UI

- **Shop cart** kini selalu ter-render sejak dibuka (dulu kosong sampai interaksi pertama), latar cart tidak lagi salah sembunyi di mode restoran, dan grid item toko tidak lagi tertutup oleh panel latarnya sendiri.
- **Cart overflow**: baris cart dibatasi sesuai ruang panel yang tersedia (dengan indikator "+N barang lainnya") — supermarket menjual 22 item berbeda, jadi tanpa cap ini daftar belanja bisa meluber ke luar layar.
- **Menu tab**: grid statistik skill (5 skill, 2 baris) tidak lagi tertutup tombol "Lanjut"; baris hint di tab Settings tidak lagi tumpang tindih dengan tombol baris berikutnya.
- **Navigasi menu**: tombol ESC/I/Q sekarang berperilaku konsisten — I/Q berpindah tab kalau menu sudah terbuka (bukan diam atau menutup menu secara tak terduga), ESC selalu buka/tutup menu secara eksplisit.
- **Render resolution**: teks tidak lagi blur di layar besar — kalkulasi resolusi kanvas sekarang memperhitungkan rasio stretch dari `Scale.FIT`, bukan hanya `devicePixelRatio`.

---

## Appendix: Ringkasan Angka Penting

```
ENERGY
  Max:              100
  Normal Sleep:      +100 (ke max)
  Forced Sleep:      +60
  Work cost:         −20 (gate: perlu ≥20)
  School cost:       −15 (gate: perlu ≥15)
  Exam cost:         −15
  Study cost:        −10 (gate: perlu ≥10)
  Cook cost:         −10
  Read cost:         −8  (gate: perlu ≥8, 1x/hari)
  Shop cost:         −5
  Train cost:        −5
  Story cost:        −5
  Forced sleep trigger: energy <= 0 (otomatis, di manapun berada)

WAKTU
  1 real sec = 2 game min
  1 game day = 720 game min (06:30–24:00) = ~12 real min
  Sleep hanya bisa mulai jam 20:00 (kecuali forced)
  Work duration:     240 min (10:00–19:00 buka)
  School duration:   180 min (08:00–16:00 buka)
  Exam duration:     90 min
  Study duration:    60 min
  Cook duration:     45 min
  Read duration:     40 min
  Shop duration:     30 min
  Train duration:    30–60 min
  Story duration:    30 min

JLPT
  N5→N4: 300 total XP
  N4→N3: 700 total XP
  N3→N2: 1,400 total XP (locked — belum ada konten)
  Exam: 6 soal, pass ≥ 4 benar, +20 grammar +10 reading saat lulus

MONEY
  Start:             ¥3,000
  Max daily income:  ~¥2,200
  Main quest total:  ¥500+¥500+¥1,000+¥1,500+¥2,500 = ¥6,000
  Min daily food:    ¥110 (coffee) / ¥480 (bento)
  Min ingredients:   ¥60 (greenonion)
  Max ingredient:    ¥400 (meat)

KONTEN (per 2026-07-17)
  Vocabulary:  180 kata (N5:90 · N4:50 · N3:40)
  Kanji:       306 entri (N5:112 · N4:105 · N3:89)
  Grammar:     30 poin (10 per level N5/N4/N3)
  Reading:     7 passage (N5:1 · N4:1 · N3:5)
  Listening:   7 drill (N5:1 · N4:1 · N3:5)
  Items:       38 item, 2 toko fisik (konbini 11 stok, supermarket 22 stok)
  Recipes:     3 resep (N5:2 · N4:1 · N3:0)
  Work tasks:  5 tiket (N5:2 · N4:3 · N3:0)
  NPC:         4, masing-masing 5 dialogue tier + 1 quest
  Main quest:  5 (N5→N4→N3 arc)
  Side quest:  4 (1 per NPC)
  Built-in stories: 7 (grammarFocus N5–N3, kind daily/encounter/festival)
  Stations:    6 (1 jalur kereta, belum bisa multi-rute)
```

---

*Dokumen ini digenerate/direvisi oleh CommandCode berdasarkan pemindaian otomatis seluruh source code di `D:\Projects\nihon-life-game\src\`, mencakup perubahan Fase 1–5 dan sesi perbaikan bug UI/UX terakhir.*
