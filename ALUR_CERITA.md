# 📖 ALUR_CERITA.md — Narrative & Story Content Audit

> **Reverse-engineered dari codebase `src/` — status per 2026-07-14**
>
> Format: `[IMPLEMENTED]` = kode & konten sudah ada | `[EMPTY]` = slot ada, konten kosong | `[NOT_IMPLEMENTED]` = tidak ada sama sekali

---

## 1. MAIN QUEST CHAIN

### [IMPLEMENTED] `main-1` — "A New Life Begins" / 「新しい生活」

| Field | Value |
|-------|-------|
| **File** | `src/data/quests.ts` |
| **Type** | `main` |
| **Trigger** | Auto-start via `ensureMainQuest()` di `src/game/systems/quests.ts:177` |
| **Objectives** | ① `study` via `activity` event → belajar grammar di meja (1×) ② `school` via `activity` event → ikut kelas di sekolah (1×) |
| **Description (jp/en/idn)** | "新しい街での生活が始まりました。机で勉強して、学校の授業に出ましょう。" / "Settle into Sakura Town: study once at your desk and attend your first class." / "Mulai kehidupan baru di kota Sakura: belajar sekali di meja dan ikuti kelas pertama." |
| **Reward** | ¥500, `{ grammar: 10 }` XP |
| **Next** | `main-2` (auto-start on complete) |
| **Status** | [IMPLEMENTED] — full trilingual, 2 objectives, chained |

### [IMPLEMENTED] `main-2` — "First Errands" / 「初めてのおつかい」

| Field | Value |
|-------|-------|
| **File** | `src/data/quests.ts` |
| **Type** | `main` |
| **Trigger** | Auto-start dari `main-1.next` |
| **Objectives** | ① `shopping` via `activity` event → beli sesuatu di toko (1×) ② `cooking` via `activity` event → masak di dapur (1×) |
| **Description (jp/en/idn)** | "買い物をして、料理を作ってみましょう。" / "Buy ingredients at a shop and cook your first meal at home." / "Belilah bahan di toko dan masak makanan pertama di rumah." |
| **Reward** | ¥500, `{ vocabulary: 10 }` XP |
| **Next** | `main-3` (auto-start on complete) |
| **Status** | [IMPLEMENTED] |

### [IMPLEMENTED] `main-3` — "The Interview" / 「面接」

| Field | Value |
|-------|-------|
| **File** | `src/data/quests.ts` |
| **Type** | `main` |
| **Trigger** | Auto-start dari `main-2.next` |
| **Objectives** | ① `train` via `activity` event → naik kereta (1×) ② `work` via `activity` event → selesaikan shift kerja IT (1×) |
| **Description (jp/en/idn)** | "電車に乗ってIT会社に行き、初めての仕事をしましょう。" / "Take the train to the IT company and complete your first work shift." / "Naik kereta ke perusahaan IT dan selesaikan shift kerja pertama." |
| **Reward** | ¥1,000, `{ reading: 10, kanji: 5 }` XP |
| **Next** | `undefined` — **RANTAI BERHENTI DI SINI** |
| **Status** | [IMPLEMENTED] — final story quest saat ini |

### [NOT_IMPLEMENTED] `main-4` dan seterusnya
```
Slot TypeScript untuk N4/N3 main quest: TIDAK ADA.
Tidak ada quest_def dengan type "main" selain main-1/2/3.
Rantai cerita utama selesai setelah 3 quest tutorial N5.
```

---

## 2. SIDE & RELATIONSHIP QUESTS

### [IMPLEMENTED] `side-yuki-1` — "Hanami Promise" / 「花見の約束」

| Field | Value |
|-------|-------|
| **File** | `src/data/quests.ts` |
| **Type** | `relationship` |
| **Giver** | `yuki` (Yuki NPC) |
| **Trigger** | Auto-start saat friendship Yuki ≥ 3 (`adjustFriendship()` di `quests.ts:100`) |
| **Prereq** | Tidak ada |
| **Objectives** | ① `gift yuki` via `gift` event → beri Yuki hadiah (1×) |
| **Description (jp/en/idn)** | "ゆきは花見のために手作りおにぎりがほしいと言っています。おにぎりを作って持っていきましょう。" / "Yuki wants handmade onigiri for hanami. Cook onigiri and bring it to her." / "Yuki ingin onigiri buatan tangan untuk hanami. Masak onigiri dan bawakan untuknya." |
| **Reward** | ¥0, `{ friendship: 2 }` (Yuki), `{ listening: 10 }` XP |
| **Next** | `undefined` — **standalone, tidak ada lanjutan** |
| **Status** | [IMPLEMENTED] — satu-satunya side quest |

### [NOT_IMPLEMENTED] Side quest untuk NPC lain
```
Tanaka-sensei: questId = undefined → TIDAK ADA QUEST
Yamada-san:   questId = undefined → TIDAK ADA QUEST
Sato-san:     questId = undefined, hanya 1 tier dialogue → TIDAK ADA QUEST
```

### [NOT_IMPLEMENTED] Quest type lain
| Quest Type | Status |
|------------|--------|
| `festival` | Type ada di `core/types.ts` tapi **0 quest** |
| `story` | Type ada di `core/types.ts` tapi **0 quest** |
| `cooking` | Type ada di `core/types.ts` tapi **0 quest** |
| `school` | Type ada — belum ada quest spesifik (hanya dipakai daily) |
| `work` | Type ada — belum ada quest spesifik (hanya dipakai daily) |

---

## 3. DAILY QUESTS

### [IMPLEMENTED] 3 Template Rotasi Harian

| Template | Objective | Reward |
|----------|-----------|--------|
| "Morning Routine" | Study at desk (1×) | ¥200, `{ grammar: 5 }` |
| "Social Butterfly" | Talk to 2 people | ¥200, `{ listening: 5 }` |
| "Balanced Diet" | Eat a food item (1×) | ¥150, `{ vocabulary: 5 }` |

**Mechanism:** `rollDailyQuest(day)` di `src/game/systems/quests.ts:166` — dipanggil tiap pagi saat `sleep()`. Quest daily sebelumnya yang belum selesai **dihapus** (tidak bisa diakumulasi). Rotasi menggunakan `day % 3`.

**Status:** [IMPLEMENTED] — semua 3 template punya `descriptionJp`, `description`, `descriptionIdn` lengkap.

---

## 4. NPC DIALOGUE & ARC CERITA

### 4.1 Tanaka-sensei (田中先生)

| Field | Value |
|-------|-------|
| **File** | `src/data/npcs.ts` |
| **Sprite** | `npc-tanaka` |
| **Bio** | "Warm but strict teacher at the language school. Loves melon bread." |
| **Schedule** | Sekolah (8–17) tile (7,2), Town (17–20) tile (5,17) |
| **Favorites** | `melonpan`, `greentea` |

#### Dialogue Sets

**`tanaka-0` (minFriendship 0)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | tanaka | おはようございます！今日も日本語を頑張りましょう。 | Good morning! Let's work hard on Japanese today. | Selamat pagi! Ayo semangat belajar bahasa Jepang hari ini. |
| 2 | tanaka | わからないことがあったら、いつでも聞いてくださいね。 | If there's anything you don't understand, please ask anytime. | Kalau ada yang tidak dimengerti, tanya saja kapan pun. |

**`tanaka-3` (minFriendship 3)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | tanaka | 日本語がだんだん上手になってきましたね。 | Your Japanese has been getting better and better. | Bahasa Jepangmu semakin lama semakin bagus. |
| 2 | tanaka | この調子で続ければ、エンジニアになる夢もきっと叶いますよ。 | If you keep this up, your dream of becoming an engineer will surely come true. | Kalau terus seperti ini, mimpimu menjadi engineer pasti akan tercapai. |

**Status:** [IMPLEMENTED] — 2 dialogue tiers, 4 lines total, full kana+idn. **Tidak ada quest** (questId = undefined). **Tidak ada tier di atas f3** (f6, f8, f10).

### 4.2 Yuki (ゆき)

| Field | Value |
|-------|-------|
| **File** | `src/data/npcs.ts` |
| **Sprite** | `npc-yuki` |
| **Bio** | "Cheerful classmate from Korea. Dreams of opening a cafe in Osaka." |
| **Schedule** | Sekolah (8–13) tile (4,6), Town (13–18) tile (33,20) |
| **Favorites** | `pocky`, `flowers` |
| **Quest** | `side-yuki-1` |

#### Dialogue Sets

**`yuki-0` (minFriendship 0)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | yuki | あ、おはよう！今日も一緒に勉強しようね。 | Oh, good morning! Let's study together today too. | Oh, selamat pagi! Ayo belajar bareng lagi hari ini. |
| 2 | yuki | 宿題おわった？むずかしかったら教えるよ。 | Did you finish the homework? I'll help if it was hard. | PR-nya sudah selesai? Nanti kubantu kalau susah. |

**`yuki-3` (minFriendship 3)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | yuki | ねえねえ、来週お花見に行かない？ | Hey hey, want to go see the cherry blossoms next week? | Eh eh, minggu depan mau pergi lihat bunga sakura nggak? |
| 2 | yuki | 私おにぎり作っていくから、何か持ってきてくれるとうれしいな！ | I'll bring onigiri, so I'd be happy if you brought something too! | Aku bawa onigiri, jadi senang deh kalau kamu bawa sesuatu juga! |

**Status:** [IMPLEMENTED] — 2 dialogue tiers, 4 lines. Dialogue tier-3 terhubung naratif ke quest `side-yuki-1`. **Tidak ada tier di atas f3**.

### 4.3 Yamada-san (山田さん)

| Field | Value |
|-------|-------|
| **File** | `src/data/npcs.ts` |
| **Sprite** | `npc-yamada` |
| **Bio** | "Senior frontend engineer. Mentors at the IT company. Reviews code kindly but thoroughly." |
| **Schedule** | Company (10–19) tile (10,5) |
| **Favorites** | `coffee`, `techbook` |

#### Dialogue Sets

**`yamada-0` (minFriendship 0)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | yamada | お疲れ様です。今日のタスク、確認しましたか？ | Good work today. Have you checked today's tasks? | Selamat bekerja. Sudah cek tugas hari ini? |
| 2 | yamada | わからないところがあったら、いつでも聞いてください。 | If there's something you don't understand, please ask anytime. | Kalau ada yang kurang jelas, tanya saja kapan pun. |

**`yamada-3` (minFriendship 3)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | yamada | 最近、コードがだいぶきれいになってきましたね。 | Lately your code has gotten quite clean. | Akhir-akhir ini kodinganmu sudah cukup rapi ya. |
| 2 | yamada | この調子なら、正社員も夢じゃないですよ。 | At this pace, a full-time position isn't just a dream. | Kalau terus begini, jadi karyawan tetap bukan cuma mimpi lho. |

**Status:** [IMPLEMENTED] — 2 dialogue tiers, 4 lines. **Tidak ada quest** (questId = undefined). **Tidak ada tier di atas f3**.

### 4.4 Sato-san (佐藤さん)

| Field | Value |
|-------|-------|
| **File** | `src/data/npcs.ts` |
| **Sprite** | `npc-sato` |
| **Bio** | "Konbini clerk for 20 years. Knows everyone in town." |
| **Schedule** | Konbini (7–22) tile (6,3) |
| **Favorites** | `greentea` |

#### Dialogue Sets

**`sato-0` (minFriendship 0)** — [IMPLEMENTED]

| Line | Speaker | JP | EN | IDN |
|------|---------|-----|----|-----|
| 1 | sato | いらっしゃい！今日もいい天気だね。 | Welcome! Nice weather again today, huh. | Selamat datang! Cuacanya cerah lagi ya hari ini. |
| 2 | sato | 新しいおにぎりが入ったよ。よかったら見ていって。 | We got new onigiri in. Take a look if you like. | Ada onigiri baru masuk lho. Lihat-lihat saja kalau mau. |

**Status:** [IMPLEMENTED] — **HANYA 1 dialogue tier** (tidak ada tier f3, f6, f8, f10). Sato-san adalah NPC dengan konten naratif paling sedikit.

---

### Ringkasan NPC Dialogue

| NPC | Dialogue Tiers | Total Lines | Quest | Arc Naratif |
|-----|---------------|-------------|-------|-------------|
| Tanaka-sensei | f0, f3 | 4 | ❌ | Tidak ada arc |
| Yuki | f0, f3 | 4 | ✅ side-yuki-1 | Hanami invitation → gift quest |
| Yamada-san | f0, f3 | 4 | ❌ | Tidak ada arc |
| Sato-san | f0 | 2 | ❌ | Tidak ada arc |
| **TOTAL** | | **14 lines** | **1 quest** | |

---

## 5. STORY SCENE (AI-Generated Narrative)

### [IMPLEMENTED] Full Pipeline

| Layer | File | Status |
|-------|------|--------|
| **Scene** | `src/game/scenes/activities/StoryScene.ts` | [IMPLEMENTED] — Full card-by-card playback, choice handling, vocab recap |
| **Orchestrator** | `src/game/features/story/StoryGenerator.ts` | [IMPLEMENTED] — Provider chain (Groq → Gemini fallback) |
| **Groq Provider** | `src/game/features/story/GroqProvider.ts` | [IMPLEMENTED] — `llama-3.3-70b-versatile`, JSON mode, 25s timeout |
| **Gemini Provider** | `src/game/features/story/GeminiProvider.ts` | [IMPLEMENTED] — `gemini-2.5-flash`, 25s timeout, fallback |
| **Validation** | `src/game/features/story/validate.ts` | [IMPLEMENTED] — Strict parsing + field validation |
| **Prompt Template** | `src/game/features/story/StoryProvider.ts` | [IMPLEMENTED] — English prompt, slice-of-life tone, 6–9 lines, 3–5 vocab |
| **API Route** | `src/app/api/story/route.ts` | [IMPLEMENTED] — POST `/api/story` |
| **Persistence** | `src/core/db.ts` (Dexie stories table) | [IMPLEMENTED] — Store + playback + mark played |
| **Prefetch** | `SleepScene.endDay()` → `/api/story` overnight | [IMPLEMENTED] — Generates 1 new story per night if none pending |

### [EMPTY] Offline Fallback
```
TIDAK ADA cerita offline/built-in. Jika GROQ_API_KEY dan GEMINI_API_KEY
tidak dikonfigurasi di server, StoryScene hanya menampilkan pesan:
"API key required" dan tidak ada konten cerita yang bisa dimainkan.
```

### [IMPLEMENTED] Story Event Shape (`StoryEvent`)

| Field | Description |
|-------|-------------|
| `title.jp` / `title.en` | Judul cerita bilingual |
| `setting` | Lokasi cerita |
| `grammarFocus` | Grammar point yang difokuskan |
| `level` | JLPT level target |
| `lines[]` | 3–15 baris dialog (speaker, jp, kana?, en, idn?) |
| `choice?` | Pilihan interaktif (2–3 opsi) + NPC reply |
| `vocabulary[]` | 1–8 kata baru dari cerita |
| `reward?` | `{ money?: 0–500, xp?: Partial<Record<SkillId, 1–10>> }` |

### Story Kind Variants (dipilih berdasarkan hari)

| Day Condition | `kind` | Keterangan |
|---------------|--------|------------|
| `day % 28 === 14` | `"festival"` | Cerita festival tengah musim |
| `day % 7 === 0` | `"encounter"` | Pertemuan random |
| Default | `"daily"` | Kehidupan sehari-hari |

---

## 6. KONTEN NARATIF LAIN

### [IMPLEMENTED] Board Notices (Papan Pengumuman Kantor)

**File:** `src/game/scenes/MapScene.ts` (konstanta `BOARD_NOTICES`)

| # | JP | EN | IDN |
|---|-----|----|-----|
| 1 | 金曜日の15時からデザインレビューがあります。 | There's a design review Friday from 3 PM. | Ada design review hari Jumat mulai pukul 15.00. |
| 2 | 来週、新しいメンバーが入ります。よろしくお願いします。 | A new member joins next week. Please welcome them. | Minggu depan ada anggota baru. Mohon sambutannya. |
| 3 | エアコンの温度は26度にしてください。 | Please keep the AC at 26 degrees. | Tolong atur suhu AC di 26 derajat. |

**Mechanism:** Rotasi per hari via `BOARD_NOTICES[(day - 1) % 3]`. Ditampilkan sebagai dialog narrator 1 kartu saat interact `"meeting-board"` di kantor.

### [IMPLEMENTED] Sleep Confirm Dialogue

**File:** `src/game/scenes/MapScene.ts:336`

```
Speaker: narrator
JP: もう寝ますか。
Kana: もうねますか。
EN: Sleep and end the day?
IDN: Tidur dan akhiri hari ini?

Choices:
  1. 寝る (Sleep / Tidur) → launch SleepScene
  2. まだ起きてる (Not yet / Nanti dulu) → close
```

### [EMPTY] Intro / Cutscene / Opening Narrative
```
TIDAK ADA. Game langsung start di apartemen hari 1, spring, jam 06:30.
Quest main-1 langsung aktif. Tidak ada intro cerita, tidak ada narrator
opening, tidak ada cutscene pembuka.
```

### [EMPTY] Ending / Epilogue
```
TIDAK ADA. Tidak ada kondisi "game complete". Rantai main quest
berhenti setelah main-3. Setelah itu game menjadi sandbox tanpa
naratif terstruktur.
```

---

## 7. QUEST EVENT SYSTEM

### [IMPLEMENTED] Semua Quest Event Kind

| Event Kind | Dipicu Oleh | Contoh Quest yang Menggunakan |
|------------|-------------|-------------------------------|
| `talk` | `UIScene.talkToNpc()` → `Bus.emit("quest-event", "talk", npcId)` | daily "Social Butterfly" (talk ×2) |
| `gift` | `UIScene.giveGift()` → `Bus.emit("quest-event", "gift", npcId)` | side-yuki-1 (gift yuki ×1) |
| `buy` | `ShopScene.checkout()` / `buyInstant()` → `Bus.emit("quest-event", "buy", id)` | (belum ada quest yang pakai) |
| `cook` | `CookScene` → `Bus.emit("quest-event", "cook", recipeId)` | (belum ada quest yang pakai) |
| `eat` | `G().eatItem()` → `Bus.emit("quest-event", "eat", id)` | daily "Balanced Diet" (eat ×1) |
| `activity` | `G().markActivity()` → `Bus.emit("quest-event", "activity", id)` | main-1/2/3, daily "Morning Routine" |
| `skill` | (tersedia di type, BELUM ADA yang emit) | (belum ada quest yang pakai) |
| `reach-level` | (tersedia di type, BELUM ADA yang emit) | (belum ada quest yang pakai) |
| `visit` | (tersedia di type, BELUM ADA yang emit) | (belum ada quest yang pakai) |

---

## 8. KESIMPULAN: GAP NARATIF

| Gap | Severity | Detail |
|-----|----------|--------|
| **Cerita utama berhenti setelah 3 quest tutorial** | 🔴 HIGH | Tidak ada main quest N4/N3. Player kehilangan arah naratif setelah N5 |
| **Hanya 1 side quest** | 🔴 HIGH | 4 NPC tapi hanya Yuki yang punya quest. Tidak ada quest untuk guru, mentor, atau pegawai konbini |
| **Tidak ada intro/opening** | 🟡 MEDIUM | Game mulai tanpa konteks naratif. Player tidak tahu kenapa karakter di Jepang |
| **Tidak ada ending/epilogue** | 🟡 MEDIUM | Game menjadi endless sandbox tanpa penutup naratif |
| **AI Story bergantung API key** | 🟡 MEDIUM | Tanpa API Groq/Gemini, StoryScene tidak bisa dimainkan. Tidak ada fallback cerita offline |
| **Sato-san hanya 1 dialogue tier** | 🟡 MEDIUM | NPC paling sedikit konten naratif. Tidak ada perkembangan hubungan |
| **Tidak ada dialogue tier di atas f3** | 🟠 LOW | Hubungan NPC tidak punya tahap "dekat" atau "sahabat" |
| **Quest type festival/story/cooking tidak digunakan** | 🟠 LOW | Type system sudah siap, tinggal isi konten |
| **Tidak ada seasonal event naratif** | 🟠 LOW | Tiap musim 28 hari tapi tidak ada event spesial (festival musim semi, matsuri musim panas, dll) |