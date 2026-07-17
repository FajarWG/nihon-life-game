# 📖 ALUR_CERITA.md — Narrative & Story Content Audit

> **Reverse-engineered dari codebase `src/` — status per 2026-07-17 (revisi ke-2)**
>
> Format: `[IMPLEMENTED]` = kode & konten sudah ada | `[EMPTY]` = slot ada, konten kosong | `[NOT_IMPLEMENTED]` = tidak ada sama sekali
>
> Revisi sebelumnya (2026-07-14) mencatat rantai cerita berhenti di `main-3` dengan hanya 1 side quest dan tanpa intro/epilogue. **Semua itu sudah diperbaiki** pada Fase 4–5 — lihat perubahan di tiap bagian.

---

## 1. MAIN QUEST CHAIN

Rantai sekarang mencakup **5 quest**, membawa pemain dari N5 sampai penutup arc N3 (MVP finale), bukan berhenti di 3 quest tutorial N5 seperti sebelumnya.

### [IMPLEMENTED] `main-1` — "A New Life Begins" / 「新しい生活」

| Field | Value |
|-------|-------|
| **File** | `src/data/quests.ts` |
| **Type** | `main` |
| **Trigger** | Auto-start via `ensureMainQuest()` di `src/game/systems/quests.ts:107` |
| **Objectives** | ① `study` via `activity` event → belajar grammar di meja (1×) ② `school` via `activity` event → ikut kelas di sekolah (1×) |
| **Reward** | ¥500, `{ grammar: 10 }` XP |
| **Next** | `main-2` (auto-start on complete) |

### [IMPLEMENTED] `main-2` — "First Errands" / 「初めてのおつかい」

| Field | Value |
|-------|-------|
| **Objectives** | ① `shopping` via `activity` event → beli sesuatu di toko (1×) ② `cooking` via `activity` event → masak di dapur (1×) |
| **Reward** | ¥500, `{ vocabulary: 10 }` XP |
| **Next** | `main-3` |

### [IMPLEMENTED] `main-3` — "The Interview" / 「面接」

| Field | Value |
|-------|-------|
| **Objectives** | ① `train` via `activity` event → naik kereta (1×) ② `work` via `activity` event → selesaikan shift kerja IT (1×) |
| **Reward** | ¥1,000, `{ reading: 10, kanji: 5 }` XP |
| **Next** | `main-4` — **rantai berlanjut (dulu berhenti di sini)** |

### [IMPLEMENTED] `main-4` — "Trust and Friends" / 「信頼と友情」 *(baru — Fase 5)*

| Field | Value |
|-------|-------|
| **Level** | N4 |
| **Desc (en)** | "Prove your reliability at work and build real connections. Complete another shift and get to know two people in town." |
| **Desc (idn)** | "Buktikan keandalanmu di tempat kerja dan bangun hubungan yang nyata. Selesaikan satu shift lagi dan kenali dua orang di kota." |
| **Objectives** | ① `work` via `activity` event → shift kerja IT lagi (1×) ② `talk` event → ngobrol dengan orang di kota (2×, siapa saja) |
| **Reward** | ¥1,500, `{ reading: 15, listening: 15, grammar: 10 }` XP |
| **Next** | `main-5` |

### [IMPLEMENTED] `main-5` — "A Place to Call Home" / 「ここが私の居場所」 *(baru — Fase 5, penutup arc MVP)*

| Field | Value |
|-------|-------|
| **Level** | N3 |
| **Desc (en)** | "Cook a proper meal with your own hands, go shopping, and hit the books — you're not just surviving anymore, you're building a life here. (MVP arc finale.)" |
| **Objectives** | ① `cooking` via `activity` event → masak di rumah (1×) ② `shopping` via `activity` event → belanja untuk rumah (1×) |
| **Reward** | ¥2,500, `{ grammar: 20, vocabulary: 20, reading: 15, kanji: 10 }` XP |
| **Next** | *(tidak ada — akhir arc utama saat ini, memicu epilog — lihat §6.2)* |

### [NOT_IMPLEMENTED] `main-6` dan seterusnya (N2/N1)
```
Belum ada slot quest main untuk N2/N1 — konsisten dengan belum adanya
konten kurikulum N2/N1 di ALUR_KURIKULUM.md. Rantai utama berhenti secara
sengaja di main-5 sebagai "MVP arc finale" (disebut eksplisit di deskripsi
quest itu sendiri).
```

---

## 2. SIDE & RELATIONSHIP QUESTS

Sebelumnya hanya Yuki yang punya side quest. Sekarang **keempat NPC** masing-masing punya 1 relationship quest sendiri (Fase 5), dipicu otomatis saat friendship NPC tersebut mencapai ≥ 3 (`adjustFriendship()` di `quests.ts:94`).

### [IMPLEMENTED] `side-yuki-1` — "Hanami Promise" / 「花見の約束」

| Field | Value |
|-------|-------|
| **Giver** | `yuki` |
| **Objective** | Beri Yuki hadiah (`gift` event, 1×) |
| **Reward** | friendship+2 (Yuki), `{ listening: 10 }` XP |

### [IMPLEMENTED] `side-tanaka-1` — "Thank You, Sensei" / 「先生、ありがとう」 *(baru)*

| Field | Value |
|-------|-------|
| **Giver** | `tanaka` |
| **Desc** | "Tanaka-sensei has been guiding you since day one. Bring him his favorite melon bread as a small thank-you." |
| **Objective** | Beri Tanaka-sensei hadiah (`gift` event, 1×) |
| **Reward** | friendship+2 (Tanaka), `{ grammar: 10 }` XP |

### [IMPLEMENTED] `side-yamada-1` — "Review Session" / 「コードレビュー会」 *(baru)*

| Field | Value |
|-------|-------|
| **Giver** | `yamada` |
| **Desc** | "Yamada-san stayed late to help with your bug fix. Bring him some coffee as thanks — he'll need it for the next sprint." |
| **Objective** | Beri Yamada-san hadiah (`gift` event, 1×) |
| **Reward** | friendship+2 (Yamada), `{ reading: 10 }` XP |

### [IMPLEMENTED] `side-sato-1` — "The Regular Customer" / 「常連さんの話」 *(baru)*

| Field | Value |
|-------|-------|
| **Giver** | `sato` |
| **Desc** | "Sato-san is worried — Yuki, his favorite regular, hasn't stopped by the konbini in a while. He asks you to check on her." |
| **Objective** | Ngobrol dengan Yuki atas nama Sato-san (`talk` event, target `yuki`, 1×) — satu-satunya side quest dengan objective silang-NPC |
| **Reward** | friendship+2 (Sato), `{ vocabulary: 10 }` XP |

### [NOT_IMPLEMENTED] Quest type lain
| Quest Type | Status |
|------------|--------|
| `festival` | Type ada di `core/types.ts` — belum ada `QuestDef` bertipe ini, tapi konten naratif festival sudah ada lewat Story (`kind: "festival"`, lihat §5) |
| `story` | Type ada — masih 0 `QuestDef`, meskipun Story scene sendiri sudah kaya konten |
| `cooking` | Type ada — masih 0 `QuestDef` khusus (objective cooking dipakai lewat main-2/main-5 dengan type `main`) |
| `school` / `work` | Type ada — masih dipakai lewat daily template, belum ada quest khusus bertipe ini |

---

## 3. DAILY QUESTS

Tidak berubah dari revisi sebelumnya — masih 3 template rotasi.

### [IMPLEMENTED] 3 Template Rotasi Harian

| Template | Objective | Reward |
|----------|-----------|--------|
| "Morning Routine" / 朝の習慣 | Study at desk (1×) | ¥200, `{ grammar: 5 }` |
| "Social Butterfly" / おしゃべり | Talk to 2 people | ¥200, `{ listening: 5 }` |
| "Balanced Diet" / バランスのいい食事 | Eat a food item (1×) | ¥150, `{ vocabulary: 5 }` |

**Mechanism:** `rollDailyQuest(day)` di `src/game/systems/quests.ts:34` — dipanggil tiap pagi saat `sleep()`. Quest daily sebelumnya yang belum selesai dihapus (tidak bisa diakumulasi). Rotasi menggunakan `(day - 1) % 3`.

---

## 4. NPC DIALOGUE & ARC CERITA

**Perubahan besar sejak revisi sebelumnya:** setiap NPC sekarang punya **5 dialogue tier** (f0/f3/f6/f8/f10), bukan cuma 2 (f0/f3). Tier f6/f8/f10 memberi arc personal yang lebih dalam untuk tiap karakter (ditambahkan di Fase 5).

### 4.1 Tanaka-sensei (田中先生)

| Field | Value |
|-------|-------|
| **Bio** | "Warm but strict teacher at the language school. Loves melon bread." |
| **Schedule** | Sekolah (8–17) tile (7,2), Town (17–20) tile (5,17) |
| **Favorites** | `melonpan`, `greentea` |
| **Quest** | `side-tanaka-1` *(baru)* |

**Arc naratif (f0→f10):** guru yang hangat & tegas → memuji progres bahasa Jepang pemain (f3) → mengaku dulu ingin jadi engineer juga tapi lebih suka mengajar (f6) → bercanda kalau tanpa melonpan mungkin sudah berhenti mengajar (f8) → menyatakan bangga sebagai muridnya yang paling ia banggakan (f10). Total **10 baris** dialogue terstruktur (2 baris × 5 tier).

### 4.2 Yuki (ゆき)

| Field | Value |
|-------|-------|
| **Bio** | "Cheerful classmate from Korea. Dreams of opening a cafe in Osaka." |
| **Schedule** | Sekolah (8–13) tile (4,6), Town (13–18) tile (33,20) |
| **Favorites** | `pocky`, `flowers` |
| **Quest** | `side-yuki-1` |

**Arc naratif (f0→f10):** teman sekelas ceria yang ajak belajar bareng → ajak hanami + minta onigiri (f3, memicu quest) → cerita soal belajar masak dari teman-teman Korea, mimpi buka kafe (f6) → janji pemain jadi pelanggan pertama di Osaka (f8) → penutup emosional "親友" (sahabat), bersyukur bertemu pemain (f10). Total **10 baris**.

### 4.3 Yamada-san (山田さん)

| Field | Value |
|-------|-------|
| **Bio** | "Senior frontend engineer. Mentors at the IT company. Reviews code kindly but thoroughly." |
| **Schedule** | Company (10–19) tile (10,5) |
| **Favorites** | `coffee`, `techbook` |
| **Quest** | `side-yamada-1` *(baru)* |

**Arc naratif (f0→f10):** mentor yang mengecek progres tugas → memuji kode yang makin rapi (f3) → cerita dulu ia juga tidak bisa coding sama sekali (f6) → bercanda soal "deploy Friday" dan lembur bareng (f8) → mengakui berkat pemain seluruh tim jadi lebih kuat, ajak terus membangun produk bersama (f10). Total **10 baris**.

### 4.4 Sato-san (佐藤さん)

| Field | Value |
|-------|-------|
| **Bio** | "Has worked at the konbini for 20 years. Knows everyone in town." |
| **Schedule** | Konbini (7–22) tile (6,3) |
| **Favorites** | `greentea` |
| **Quest** | `side-sato-1` *(baru)* |

**Arc naratif (f0→f10):** dulunya hanya 1 tier dialogue (NPC dengan konten paling sedikit) — sekarang punya arc penuh: sapaan ramah → mengucap terima kasih sudah jadi pelanggan tetap, menyebut Tanaka-sensei juga pelanggan (f3) → refleksi 20 tahun bekerja di konbini melihat kehidupan warga kota, termasuk pemain yang dulu gugup (f6) → bercanda sudah hafal pesanan pemain (f8) → penutup hangat, menyebut akan terus mengawasi "kisah perjalanan" pemain dari balik konter (f10). Total **10 baris**.

### Ringkasan NPC Dialogue

| NPC | Dialogue Tiers | Total Lines | Quest | Arc Naratif |
|-----|---------------|-------------|-------|-------------|
| Tanaka-sensei | f0, f3, f6, f8, f10 | 10 | ✅ side-tanaka-1 | Guru → pengakuan personal → kebanggaan pada murid |
| Yuki | f0, f3, f6, f8, f10 | 10 | ✅ side-yuki-1 | Hanami invitation → mimpi kafe → sahabat |
| Yamada-san | f0, f3, f6, f8, f10 | 10 | ✅ side-yamada-1 | Mentor kerja → cerita masa lalu → rekan setara |
| Sato-san | f0, f3, f6, f8, f10 | 10 | ✅ side-sato-1 | Pelayan ramah → saksi kehidupan kota → figure keakraban |
| **TOTAL** | | **40 lines** | **4 quest** | Semua NPC kini punya arc lengkap |

---

## 5. STORY SCENE (Narasi Bawaan + AI-Generated)

**Perubahan besar:** dulu StoryScene 100% bergantung API eksternal (Groq/Gemini) tanpa fallback offline. Sekarang ada **7 cerita bawaan** (`src/data/stories.ts`) yang selalu bisa dimainkan tanpa API key, sementara AI generation tetap tersedia sebagai tambahan opsional.

### [IMPLEMENTED] Full Pipeline

| Layer | File | Status |
|-------|------|--------|
| **Scene** | `src/game/scenes/activities/StoryScene.ts` | Card-by-card playback, choice handling, vocab recap, **plus toggle furigana/romaji/translate per baris (baru)** |
| **Built-in Pool** | `src/data/stories.ts` | **[BARU]** 7 `StoryEvent` siap pakai, tidak butuh API |
| **Orchestrator** | `src/features/story/StoryGenerator.ts` | Provider chain (Groq → Gemini fallback), dipakai kalau pemain memilih generate cerita baru |
| **Prefetch** | `SleepScene` overnight | Generate 1 cerita AI baru per malam **jika** API key dikonfigurasi; kalau tidak, pool bawaan tetap mengisi kebutuhan cerita |

### [IMPLEMENTED] Daftar 7 Cerita Bawaan

| ID | Judul | Level | Kind | Grammar Focus |
|----|-------|-------|------|----------------|
| `story-builtin-morning` | 朝の通勤 (Morning Commute) | N5 | daily | ます form — polite verbs |
| `story-builtin-konbini` | コンビニの店員さん (The Helpful Clerk) | N5 | encounter | 〜はありますか / 〜をください |
| `story-builtin-meeting` | 月曜日の会議 (The Monday Meeting) | N4 | daily | 〜てください / 〜までに |
| `story-builtin-rain` | 夕立 (Sudden Rain) | N4 | encounter | 〜ましょうか |
| `story-builtin-overtime` | 残業の夜 (Overtime Night) | N3 | daily | 〜ないと / 〜ようです |
| `story-builtin-matsuri` | 夏祭り (Summer Festival) | N5 | **festival** | 〜たい |
| `story-builtin-delay` | 電車の遅延 (Train Delay) | N3 | encounter | 〜そうです / 〜なければいけません |

Semua punya `choice` interaktif (kecuali morning & delay), `vocabulary[]` recap (4–5 kata), dan `reward.xp` (vocabulary/grammar/reading campuran).

### [IMPLEMENTED] Story Kind Variants (dipilih berdasarkan hari)

| Day Condition | `kind` | Keterangan |
|---------------|--------|------------|
| `day % 28 === 14` | `"festival"` | Cerita festival tengah musim — kini sudah ada 1 built-in (`story-builtin-matsuri`) |
| `day % 7 === 0` | `"encounter"` | Pertemuan random — 3 built-in tersedia |
| Default | `"daily"` | Kehidupan sehari-hari — 3 built-in tersedia |

---

## 6. KONTEN NARATIF LAIN

### [IMPLEMENTED] Board Notices (Papan Pengumuman Kantor)

Tidak berubah — 3 notice rotasi via `BOARD_NOTICES[(day - 1) % 3]` di `MapScene.ts`.

### [IMPLEMENTED] Sleep Confirm Dialogue

Tidak berubah secara naratif, tapi sekarang digated jam (`s.minutes < 1200` → toast "It's too early to sleep…" alih-alih langsung membuka dialog konfirmasi tidur).

### [IMPLEMENTED] Intro / Opening Narrative *(baru — Fase 5)*

```
File: MapScene.ts create(), dicek via flags.introPlayed === false.

Trigger otomatis sekali di awal permainan baru (delay 400ms setelah scene
Map pertama kali render), memutar 3 baris narrator:

1. ようこそ、桜町へ。(Welcome to Sakura Town.)
2. 新しい仕事と新しい生活が、ここで始まります。
   (A new job and a new life begin here.)
3. 日本語を学びながら、自分の物語を紡いでいきましょう。
   (Learn Japanese as you weave your own story.)

Setelah diputar sekali, flags.introPlayed = true — tidak diulang lagi.
Ini menutup gap lama "game langsung mulai tanpa konteks naratif".
```

### [IMPLEMENTED] Ending / Epilogue *(baru — Fase 5)*

```
File: UIScene.ts, listener Bus.on("quest-completed", ...).

Trigger otomatis saat questId === "main-5" selesai (dan belum pernah
diputar — dicek via flags.epiloguePlayed), memutar 6 baris:

1. narrator: あれから…たくさんの日々が過ぎました。
   (Since then… so many days have passed.)
2. narrator: 知らない街だったのに、今ではここが「日常」です。
   (A city that was once unknown — now it's simply everyday life.)
3. tanaka: 君の日本語、本当にすごい成長だよ。
   (Your Japanese has really come a long way.)
4. yuki: 友達になってくれてありがとう！また遊ぼうね。
   (Thanks for being my friend! Let's hang out again.)
5. narrator: 桜町での生活は、まだまだこれからです。
   (Your life in Sakura Town — there's still so much ahead.)
6. narrator: 物語は続きます。自分のペースで、一歩ずつ。
   (The story continues. At your own pace, one step at a time.)

Game TIDAK berhenti/"complete" setelah ini — tetap sandbox terbuka
(disebut eksplisit di baris terakhir: "cerita terus berlanjut"), tapi
kini ada penutup naratif yang jelas untuk arc utama alih-alih tiba-tiba
menjadi sandbox tanpa penjelasan.
```

---

## 7. QUEST EVENT SYSTEM

Tidak berubah struktur dari revisi sebelumnya, tapi cakupan pemakaian bertambah karena side quest baru:

### [IMPLEMENTED] Semua Quest Event Kind

| Event Kind | Dipicu Oleh | Contoh Quest yang Menggunakan |
|------------|-------------|-------------------------------|
| `talk` | `UIScene.talkToNpc()` → `Bus.emit("quest-event", "talk", npcId)` | daily "Social Butterfly", `main-4` (talk ×2), `side-sato-1` (talk yuki ×1) |
| `gift` | `UIScene.giveGift()` → `Bus.emit("quest-event", "gift", npcId)` | `side-yuki-1`, `side-tanaka-1`, `side-yamada-1` (semua NPC kini pakai event ini) |
| `buy` | `ShopScene.checkout()` / `buyInstant()` | (belum ada quest yang pakai langsung — tetap tercatat) |
| `cook` | `CookScene` | (belum ada quest yang pakai langsung) |
| `eat` | `G().eatItem()` | daily "Balanced Diet" |
| `activity` | `G().markActivity()` | `main-1`–`main-5`, daily "Morning Routine" |
| `skill` / `reach-level` / `visit` | (tersedia di type, masih belum ada yang emit) | — |

---

## 8. KESIMPULAN: GAP NARATIF — STATUS TERKINI

| Gap (revisi 2026-07-14) | Status Sekarang |
|-----|-----------------|
| 🔴 Cerita utama berhenti setelah 3 quest tutorial | ✅ **FIXED** — 5 main quest (N5→N4→N3), penutup arc jelas di `main-5` |
| 🔴 Hanya 1 side quest | ✅ **FIXED** — 4 side quest, 1 per NPC |
| 🟡 Tidak ada intro/opening | ✅ **FIXED** — 3-baris intro narrator di awal game baru |
| 🟡 Tidak ada ending/epilogue | ✅ **FIXED** — 6-baris epilog saat `main-5` selesai (game tetap lanjut sebagai sandbox setelahnya, sesuai desain) |
| 🟡 AI Story bergantung API key | ✅ **FIXED** — 7 cerita bawaan offline-ready, AI generation jadi tambahan opsional |
| 🟡 Sato-san hanya 1 dialogue tier | ✅ **FIXED** — sekarang 5 tier seperti NPC lain |
| 🟠 Tidak ada dialogue tier di atas f3 | ✅ **FIXED** — semua NPC punya f6/f8/f10 |
| 🟠 Quest type festival/story/cooking tidak digunakan | ⚠️ **SEBAGIAN** — konten festival sudah ada lewat Story `kind`, tapi belum ada `QuestDef` bertipe `festival`/`story`/`cooking` murni |
| 🟠 Tidak ada seasonal event naratif | ⚠️ **SEBAGIAN** — `story-builtin-matsuri` mengisi slot festival tengah musim, tapi baru 1 event, belum bervariasi per musim (spring/summer/autumn/winter beda cerita) |

### Gap yang Masih Terbuka

| Gap | Severity | Detail |
|-----|----------|--------|
| **Belum ada arc N2/N1** | 🟡 MEDIUM | Konsisten dengan kurikulum — begitu konten N2/N1 ditambahkan, quest chain perlu diperpanjang lagi |
| **Festival event masih tunggal** | 🟠 LOW | Hanya 1 built-in story `kind: "festival"` — idealnya tiap musim (spring/summer/autumn/winter) punya event festival berbeda |
| **Quest type festival/story/cooking belum dipakai murni** | 🟠 LOW | Type system sudah siap, `QuestDef` khusus belum dibuat |
| **Cross-NPC storytelling masih minim** | 🟢 INFO | Baru `side-sato-1` yang melibatkan 2 NPC (Sato meminta cek Yuki) — pola ini bisa diperluas untuk arc antar-NPC yang lebih kaya |
