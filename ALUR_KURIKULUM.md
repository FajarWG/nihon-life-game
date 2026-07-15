# 📐 ALUR_KURIKULUM.md — JLPT Curriculum Coverage Audit

> **Reverse-engineered dari `src/data/` — status per 2026-07-14**
>
> Semua angka diambil langsung dari file data. Tidak ada estimasi.

---

## 1. KOSAKATA PER LEVEL (src/data/vocabulary.ts)

### 1.1 Total Item per Level

| Level | Jumlah | Kanji (jp≠kana) | Kana-only | idn Coverage | kana Coverage |
|-------|--------|-----------------|-----------|-------------|---------------|
| **N5** | 48 | 43 (90%) | 5 (10%) | 48/48 (100%) | 48/48 (100%) |
| **N4** | 40 | 38 (95%) | 2 (5%) | 40/40 (100%) | 40/40 (100%) |
| **N3** | 40 | 40 (100%) | 0 (0%) | 40/40 (100%) | 40/40 (100%) |
| **N2** | **0** | — | — | — | — |
| **N1** | **0** | — | — | — | — |
| **Total** | **128** | 121 | 7 | 128/128 | 128/128 |

### 1.2 Distribusi per Kategori per Level

| Kategori | N5 | N4 | N3 | Total |
|----------|-----|-----|-----|-------|
| `food` | 10 | 3 | 0 | 13 |
| `shopping` | 6 | 6 | 2 | 14 |
| `train` | 6 | 7 | 3 | 16 |
| `school` | 6 | 5 | 0 | 11 |
| `work` | 4 | 9 | 16 | 29 |
| `time` | 6 | 1 | 0 | 7 |
| `place` | 3 | 0 | 0 | 3 |
| `daily` | 7 | 9 | 19 | 35 |
| **Total** | **48** | **40** | **40** | **128** |

**Pola:** N5 fokus ke kehidupan sehari-hari (food, time, place, school). N4 peralihan ke shopping/train/work. N3 **sangat condong** ke work (40%) dan daily (48%), tanpa konten food/school/time/place sama sekali.

### 1.3 Daftar Lengkap N5 (48 kata)

| # | ID | JP | Kana | EN | Kategori | Ada Kanji? |
|---|-----|----|------|----|----------|-----------|
| 1 | v5-mizu | 水 | みず | water | food | ✓ |
| 2 | v5-tamago | 卵 | たまご | egg | food | ✓ |
| 3 | v5-gohan | ご飯 | ごはん | rice/meal | food | ✓ |
| 4 | v5-pan | パン | パン | bread | food | ✗ |
| 5 | v5-gyunyu | 牛乳 | ぎゅうにゅう | milk | food | ✓ |
| 6 | v5-niku | 肉 | にく | meat | food | ✓ |
| 7 | v5-sakana | 魚 | さかな | fish | food | ✓ |
| 8 | v5-yasai | 野菜 | やさい | vegetables | food | ✓ |
| 9 | v5-ocha | お茶 | おちゃ | green tea | food | ✓ |
| 10 | v5-ringo | りんご | りんご | apple | food | ✗ |
| 11 | v5-kaimono | 買い物 | かいもの | shopping | shopping | ✓ |
| 12 | v5-okane | お金 | おかね | money | shopping | ✓ |
| 13 | v5-yasui | 安い | やすい | cheap | shopping | ✓ |
| 14 | v5-takai | 高い | たかい | expensive | shopping | ✓ |
| 15 | v5-mise | 店 | みせ | shop | shopping | ✓ |
| 16 | v5-ikura | いくら | いくら | how much | shopping | ✗ |
| 17 | v5-eki | 駅 | えき | station | train | ✓ |
| 18 | v5-densha | 電車 | でんしゃ | train | train | ✓ |
| 19 | v5-tsugi | 次 | つぎ | next | train | ✓ |
| 20 | v5-kippu | 切符 | きっぷ | ticket | train | ✓ |
| 21 | v5-migi | 右 | みぎ | right | train | ✓ |
| 22 | v5-hidari | 左 | ひだり | left | train | ✓ |
| 23 | v5-gakko | 学校 | がっこう | school | school | ✓ |
| 24 | v5-sensei | 先生 | せんせい | teacher | school | ✓ |
| 25 | v5-gakusei | 学生 | がくせい | student | school | ✓ |
| 26 | v5-hon | 本 | ほん | book | school | ✓ |
| 27 | v5-benkyou | 勉強 | べんきょう | study | school | ✓ |
| 28 | v5-nihongo | 日本語 | にほんご | Japanese | school | ✓ |
| 29 | v5-shigoto | 仕事 | しごと | work/job | work | ✓ |
| 30 | v5-kaisha | 会社 | かいしゃ | company | work | ✓ |
| 31 | v5-pasokon | パソコン | パソコン | PC | work | ✗ |
| 32 | v5-denwa | 電話 | でんわ | telephone | work | ✓ |
| 33 | v5-asa | 朝 | あさ | morning | time | ✓ |
| 34 | v5-yoru | 夜 | よる | night | time | ✓ |
| 35 | v5-kyou | 今日 | きょう | today | time | ✓ |
| 36 | v5-ashita | 明日 | あした | tomorrow | time | ✓ |
| 37 | v5-ima | 今 | いま | now | time | ✓ |
| 38 | v5-jikan | 時間 | じかん | time/hour | time | ✓ |
| 39 | v5-ie | 家 | いえ | house/home | place | ✓ |
| 40 | v5-kouen | 公園 | こうえん | park | place | ✓ |
| 41 | v5-toshokan | 図書館 | としょかん | library | place | ✓ |
| 42 | v5-taberu | 食べる | たべる | to eat | daily | ✓ |
| 43 | v5-nomu | 飲む | のむ | to drink | daily | ✓ |
| 44 | v5-iku | 行く | いく | to go | daily | ✓ |
| 45 | v5-kaeru | 帰る | かえる | return home | daily | ✓ |
| 46 | v5-neru | 寝る | ねる | to sleep | daily | ✓ |
| 47 | v5-oishii | おいしい | おいしい | delicious | daily | ✗ |
| 48 | v5-genki | 元気 | げんき | healthy/energetic | daily | ✓ |

### 1.4 Daftar Lengkap N4 (40 kata)

| # | ID | JP | Kana | EN | Kategori | Ada Kanji? |
|---|-----|----|------|----|----------|-----------|
| 1 | v4-ryouri | 料理 | りょうり | cooking/cuisine | food | ✓ |
| 2 | v4-zairyou | 材料 | ざいりょう | ingredients | food | ✓ |
| 3 | v4-aji | 味 | あじ | taste/flavor | food | ✓ |
| 4 | v4-yakusoku | 約束 | やくそく | promise | daily | ✓ |
| 5 | v4-yotei | 予定 | よてい | plan/schedule | time | ✓ |
| 6 | v4-nedan | 値段 | ねだん | price | shopping | ✓ |
| 7 | v4-uriba | 売り場 | うりば | sales floor | shopping | ✓ |
| 8 | v4-reji | レジ | レジ | cash register | shopping | ✗ |
| 9 | v4-waribiki | 割引 | わりびき | discount | shopping | ✓ |
| 10 | v4-otsuri | お釣り | おつり | change (money) | shopping | ✓ |
| 11 | v4-fukuro | 袋 | ふくろ | bag | shopping | ✓ |
| 12 | v4-kyuukou | 急行 | きゅうこう | express train | train | ✓ |
| 13 | v4-futsuu | 普通 | ふつう | local/ordinary | train | ✓ |
| 14 | v4-norikae | 乗り換え | のりかえ | transfer | train | ✓ |
| 15 | v4-homu | ホーム | ホーム | platform | train | ✗ |
| 16 | v4-okureru | 遅れる | おくれる | to be late | train | ✓ |
| 17 | v4-shuppatsu | 出発 | しゅっぱつ | departure | train | ✓ |
| 18 | v4-touchaku | 到着 | とうちゃく | arrival | train | ✓ |
| 19 | v4-jugyou | 授業 | じゅぎょう | class/lesson | school | ✓ |
| 20 | v4-shiken | 試験 | しけん | exam | school | ✓ |
| 21 | v4-shukudai | 宿題 | しゅくだい | homework | school | ✓ |
| 22 | v4-fukushuu | 復習 | ふくしゅう | review (lessons) | school | ✓ |
| 23 | v4-imi | 意味 | いみ | meaning | school | ✓ |
| 24 | v4-kaigi | 会議 | かいぎ | meeting | work | ✓ |
| 25 | v4-renraku | 連絡 | れんらく | contact/message | work | ✓ |
| 26 | v4-tantou | 担当 | たんとう | person in charge | work | ✓ |
| 27 | v4-shorui | 書類 | しょるい | documents | work | ✓ |
| 28 | v4-gamen | 画面 | がめん | screen | work | ✓ |
| 29 | v4-osu | 押す | おす | to push/press | work | ✓ |
| 30 | v4-naosu | 直す | なおす | to fix/repair | work | ✓ |
| 31 | v4-tsukau | 使う | つかう | to use | daily | ✓ |
| 32 | v4-erabu | 選ぶ | えらぶ | to choose | daily | ✓ |
| 33 | v4-todokeru | 届ける | とどける | to deliver | daily | ✓ |
| 34 | v4-tetsudau | 手伝う | てつだう | to help | daily | ✓ |
| 35 | v4-shoutai | 招待 | しょうたい | invitation | daily | ✓ |
| 36 | v4-riyuu | 理由 | りゆう | reason | daily | ✓ |
| 37 | v4-keiken | 経験 | けいけん | experience | work | ✓ |
| 38 | v4-anzen | 安全 | あんぜん | safety | daily | ✓ |
| 39 | v4-nyuuryoku | 入力 | にゅうりょく | input/typing | work | ✓ |
| 40 | v4-hozon | 保存 | ほぞん | save (file) | work | ✓ |

### 1.5 Daftar Lengkap N3 (40 kata)

| # | ID | JP | Kana | EN | Kategori |
|---|-----|----|------|----|----------|
| 1 | v3-kaihatsu | 開発 | かいはつ | development | work |
| 2 | v3-sekkei | 設計 | せっけい | design (eng.) | work |
| 3 | v3-fuguai | 不具合 | ふぐあい | bug/malfunction | work |
| 4 | v3-shuusei | 修正 | しゅうせい | correction/fix | work |
| 5 | v3-kakunin | 確認 | かくにん | confirmation | work |
| 6 | v3-kankyou | 環境 | かんきょう | environment | work |
| 7 | v3-kinou | 機能 | きのう | feature/function | work |
| 8 | v3-teian | 提案 | ていあん | proposal | work |
| 9 | v3-shime | 締め切り | しめきり | deadline | work |
| 10 | v3-shiyou | 仕様 | しよう | specification | work |
| 11 | v3-zangyou | 残業 | ざんぎょう | overtime | work |
| 12 | v3-keiyaku | 契約 | けいやく | contract | work |
| 13 | v3-mensetsu | 面接 | めんせつ | job interview | work |
| 14 | v3-doryoku | 努力 | どりょく | effort | daily |
| 15 | v3-seichou | 成長 | せいちょう | growth | daily |
| 16 | v3-kankei | 関係 | かんけい | relationship | daily |
| 17 | v3-taido | 態度 | たいど | attitude | daily |
| 18 | v3-joushiki | 常識 | じょうしき | common sense | daily |
| 19 | v3-reigi | 礼儀 | れいぎ | manners/etiquette | daily |
| 20 | v3-shorui2 | 手続き | てつづき | procedure | daily |
| 21 | v3-genin | 原因 | げんいん | cause | daily |
| 22 | v3-kekka | 結果 | けっか | result | daily |
| 23 | v3-joukyou | 状況 | じょうきょう | situation | daily |
| 24 | v3-kaiketsu | 解決 | かいけつ | solution | daily |
| 25 | v3-junbi | 準備 | じゅんび | preparation | daily |
| 26 | v3-yuusen | 優先 | ゆうせん | priority | work |
| 27 | v3-houkoku | 報告 | ほうこく | report | work |
| 28 | v3-soudan | 相談 | そうだん | consultation | work |
| 29 | v3-shain | 社員 | しゃいん | employee | work |
| 30 | v3-senpai | 先輩 | せんぱい | senior colleague | work |
| 31 | v3-teiden | 停電 | ていでん | power outage | daily |
| 32 | v3-unten | 運転見合わせ | うんてんみあわせ | service suspension | train |
| 33 | v3-konzatsu | 混雑 | こんざつ | congestion | train |
| 34 | v3-seisan | 精算 | せいさん | fare adjustment | train |
| 35 | v3-yuudachi | 夕立 | ゆうだち | evening shower | daily |
| 36 | v3-shoumi | 賞味期限 | しょうみきげん | best-before date | shopping |
| 37 | v3-ryoushuu | 領収書 | りょうしゅうしょ | receipt (formal) | shopping |
| 38 | v3-hikkoshi | 引っ越し | ひっこし | moving house | daily |
| 39 | v3-kyuuryou | 給料 | きゅうりょう | salary | work |
| 40 | v3-shinpai | 心配 | しんぱい | worry | daily |

---

## 2. GRAMMAR PER LEVEL (src/data/grammar.ts)

### 2.1 Total per Level

| Level | Points | Exercises | Avg Exercises/Point |
|-------|--------|-----------|---------------------|
| **N5** | 10 | 22 | 2.2 |
| **N4** | 10 | 20 | 2.0 |
| **N3** | 10 | 18 | 1.8 |
| **N2** | **0** | — | — |
| **N1** | **0** | — | — |
| **Total** | **30** | **60** | 2.0 |

### 2.2 N5 Grammar (10)

| ID | JP Title | Meaning | Exercises |
|----|----------|---------|-----------|
| g5-desu | 〜です | to be (polite) | 3 (2 order + 1 fill) |
| g5-masu | 〜ます | polite verb ending | 3 (2 order + 1 fill) |
| g5-wa-ga | は・が | topic/subject particles | 2 (2 fill) |
| g5-o | 〜を | direct object particle | 2 (1 fill + 1 order) |
| g5-ni-de | 〜に・〜で | place/destination particles | 2 (2 fill) |
| g5-tai | 〜たい | want to do | 2 (1 order + 1 fill) |
| g5-tekudasai | 〜てください | please do… | 2 (1 order + 1 fill) |
| g5-arimasu | あります・います | existence (things/living) | 2 (2 fill) |
| g5-mashita | 〜ました | polite past tense | 2 (1 order + 1 fill) |
| g5-adj | い/な形容詞 | i- and na-adjectives | 2 (1 fill + 1 order) |

### 2.3 N4 Grammar (10)

| ID | JP Title | Meaning | Exercises |
|----|----------|---------|-----------|
| g4-potential | 可能形 〜られる/〜える | potential form | 2 |
| g4-volitional | 意向形 〜よう | volitional | 2 |
| g4-teiru | 〜ている | ongoing state | 2 |
| g4-temoii | 〜てもいい・〜てはいけない | permission/prohibition | 2 |
| g4-nakereba | 〜なければならない | must/have to | 2 |
| g4-hikaku | 〜より・〜のほうが | comparisons | 2 |
| g4-sou | 〜そうです | looks like/I heard | 2 |
| g4-tara | 〜たら | if/when | 2 |
| g4-nagara | 〜ながら | while doing | 2 |
| g4-agekure | あげる・くれる・もらう | giving/receiving | 2 |

### 2.4 N3 Grammar (10)

| ID | JP Title | Meaning | Exercises |
|----|----------|---------|-----------|
| g3-passive | 受身形 〜られる | passive voice | 2 |
| g3-causative | 使役形 〜させる | causative | 2 |
| g3-causpass | 使役受身 〜させられる | causative-passive | **1** |
| g3-younaru | 〜ようになる | come to be able | 2 |
| g3-kotonisuru | 〜ことにする・〜ことになる | decide/was decided | 2 |
| g3-keigo | 敬語の基本 | honorific/humble basics | 2 |
| g3-ba | 〜ば | ba-conditional | 2 |
| g3-hazu-beki | 〜はず・〜べき | should (expectation/duty) | 2 |
| g3-bakari | 〜ばかり | just did / nothing but | **1** |
| g3-uchini | 〜うちに | while/before it changes | 2 |

### 2.5 Field Gap

| Field | N5 | N4 | N3 | Total Missing |
|-------|-----|-----|-----|---------------|
| `explanationIdn` | 10 missing | 10 missing | 10 missing | **30/30 (100%)** |

Setiap grammar point punya `explanation` (EN) tapi `explanationIdn` **tidak pernah diisi** untuk semua 30 point. Pemain dengan meaningLang=idn tetap melihat penjelasan grammar dalam bahasa Inggris.

---

## 3. READING & LISTENING DRILLS (src/data/drills.ts)

| Tipe | N5 | N4 | N3 | N2 | N1 | Total |
|------|-----|-----|-----|-----|-----|-------|
| **Reading** | 1 | 1 | **0** | **0** | **0** | **2** |
| **Listening** | 1 | 1 | **0** | **0** | **0** | **2** |
| **Total** | 2 | 2 | **0** | **0** | **0** | **4** |

### Reading Passages

| ID | Level | Title | Baris | Topik |
|----|-------|-------|-------|-------|
| read-n5-1 | N5 | 私の一日 (My Day) | 3 | Rutinitas harian: bangun 7:30, belajar, belanja di konbini sore |
| read-n4-1 | N4 | アルバイトの初日 (Part-Time First Day) | 3 | Hari pertama kerja IT, senpai baik hati, belajar fix bug CSS |

### Listening Drills

| ID | Level | Audio Text (JP) | Topik |
|----|-------|-----------------|-------|
| lis-n5-1 | N5 | つぎは、さくらまち、さくらまちです。 | Pengumuman stasiun: next station |
| lis-n4-1 | N4 | きゅうこうでんしゃは、にばんせんから、しゅっぱつします。 | Pengumuman peron: express train platform |

**Catatan:** Listening menggunakan `speechSynthesis` browser (Web Speech API) dengan voice `ja-JP`. Tidak ada file audio prerecorded.

---

## 4. WORK TASKS (src/data/workTasks.ts)

| ID | Kind | Level | Title (JP) | Pay |
|----|------|-------|------------|-----|
| w-css-color | bug-css | **N5** | ボタンの色が違います | ¥800 |
| w-label-1 | ui-label | **N5** | 画面のラベルを確認してください | ¥700 |
| w-css-size | bug-css | **N4** | 文字が小さすぎます | ¥1,000 |
| w-git-1 | git-order | **N4** | 作業の手順を覚えましょう | ¥900 |
| w-meeting-1 | meeting | **N4** | 会議の連絡 | ¥800 |
| N3 | — | — | — | **0 task** |
| N2/N1 | — | — | — | **0 task** |

---

## 5. RECIPES (src/data/recipes.ts)

| ID | Name | Level | Steps | Ingredients |
|----|------|-------|-------|-------------|
| r-misosoup | 味噌汁 | **N5** | 5 | tofu, miso, dashi, greenonion |
| r-curry | カレーライス | **N5** | 5 | rice, curryroux, carrot, potato, onion, meat |
| r-tamagoyaki | 卵焼き | **N4** | 4 | egg, sugar, soysauce |
| N3 | — | — | — | **0 resep** |

---

## 6. STATIONS & TRAIN LINE (src/data/stations.ts)

**1 jalur:** さくら線 (Sakura Line), 6 stasiun.

| Stasiun | Kanji | Kana | Romaji |
|---------|-------|------|--------|
| sakuramachi | 桜町 | さくらまち | Sakuramachi |
| gakuenmae | 学園前 | がくえんまえ | Gakuen-mae |
| chuo | 中央 | ちゅうおう | Chūō |
| minatominami | 港南 | こうなん | Kōnan |
| midorigaoka | 緑が丘 | みどりがおか | Midorigaoka |
| kuko | 空港 | くうこう | Airport |

---

## 7. KANJI — Tidak Ada File Data Khusus

Kanji **tidak memiliki dataset terpisah**. Kanji muncul secara implisit:

- **121 dari 128 kosakata** memiliki kanji di field `jp` (93%)
- ReadScene "Kanji Corner" mengekstrak kata dengan `jp !== kana` sebagai sumber kanji
- Tidak ada: daftar kanji per level, stroke order, radical, on/kun reading, JLPT kanji list

---

## 8. PERBANDINGAN DENGAN CAKUPAN JLPT RESMI

### 8.1 Kosakata

| Level | Standar JLPT | Game (saat ini) | Coverage |
|-------|-------------|-----------------|----------|
| **N5** | ~800 kata | 48 | **6.0%** |
| **N4** | ~1,500 kata (kumulatif) | 40 (N4) + 48 (N5) = 88 | **5.9%** |
| **N3** | ~3,750 kata (kumulatif) | 40 (N3) + 88 = 128 | **3.4%** |
| N2 | ~6,000 kata | 0 | 0% |
| N1 | ~10,000 kata | 0 | 0% |

### 8.2 Grammar

| Level | Standar JLPT | Game (saat ini) | Coverage |
|-------|-------------|-----------------|----------|
| **N5** | ~80 points | 10 | **12.5%** |
| **N4** | ~120 points (kumulatif) | 10 (N4) + 10 (N5) = 20 | **16.7%** |
| **N3** | ~180 points (kumulatif) | 10 (N3) + 20 = 30 | **16.7%** |
| N2 | ~280 points | 0 | 0% |
| N1 | ~400+ points | 0 | 0% |

### 8.3 Kanji (embedded dalam vocabulary)

| Level | Standar JLPT | Game (estimasi dari vocab) | Coverage |
|-------|-------------|---------------------------|----------|
| **N5** | ~100 kanji | ~85 unique (dari 43 kata berkanji) | **~85%** |
| **N4** | ~300 kumulatif | ~120 unique (dari 81 kata N4+N5) | **~40%** |
| **N3** | ~650 kumulatif | ~120 unique (dari 121 kata) | **~18%** |
| N2/N1 | ~1000/~2000 | 0 | 0% |

> ⚠️ Angka kanji adalah estimasi kasar — tidak ada daftar kanji eksplisit di codebase. Dihitung dari unique kanji yang muncul di field `jp` vocabulary.

### 8.4 Reading & Listening

| Level | Standar JLPT | Game | Coverage |
|-------|-------------|------|----------|
| **N5** | Teks pendek (~100-200 chars) | 1 passage (3 baris, ~50 chars) | Minimal |
| **N4** | Teks menengah (~300-500 chars) | 1 passage (3 baris, ~60 chars) | Minimal |
| **N3** | Artikel pendek (~500-800 chars) | **0** | **0%** |
| N2/N1 | Artikel/essay/berita | 0 | 0% |

---

## 9. TOPIK BESAR YANG BELUM TERCAKUP

### Berdasarkan Cakupan JLPT N5 Resmi

| Topik | Status | Keterangan |
|-------|--------|------------|
| **Angka & hitungan** (一〜十, 百, 千, 万, 円, 〜つ, 〜人, 〜枚, 〜本) | ❌ Belum ada | Tidak ada vocabulary untuk angka/counter/quantifier |
| **Warna** (赤, 青, 白, 黒) | ❌ Belum ada | 0 vocabulary warna |
| **Keluarga** (父, 母, 兄, 姉, 家族) | ❌ Belum ada | 0 vocabulary keluarga/relationship |
| **Tubuh & kesehatan** (頭, 手, 足, 病気, 薬) | ❌ Belum ada | 0 vocabulary body/health |
| **Hobi & olahraga** (映画, 音楽, 旅行, 写真) | ❌ Belum ada | 0 vocabulary leisure |
| **Pakaian** (服, 靴, 着る, 脱ぐ) | ❌ Belum ada | 0 vocabulary clothing |
| **Alam & cuaca** | ⚠️ Parsial | Hanya `夕立` (N3). Tidak ada: 空, 山, 川, 花 (sebagai alam), 天気 |
| **Transportasi umum** (バス, タクシー, 自転車, 歩く) | ⚠️ Parsial | Hanya kereta. Tidak ada bus/taxi/sepeda |
| **Restoran & makanan** | ⚠️ Parsial | Ada 13 kata food/drink tapi tidak ada konteks restoran (注文, メニュー, お勘定) |
| **Hewan** (犬, 猫, 鳥, 魚 — sebagai hewan) | ❌ Belum ada | 0 vocabulary animal |
| **Perabot & rumah** (机, 椅子, 部屋, 台所) | ⚠️ Parsial | Furniture ada di tileset map tapi tidak sebagai vocabulary |
| **Musim & festival** | ⚠️ Parsial | Season system ada (4 musim) tapi 0 vocabulary khusus: 花見, 祭り, お正月 |

### Berdasarkan Cakupan JLPT N4

| Topik | Status |
|-------|--------|
| **Keigo dasar** (尊敬語・謙譲語 level N4) | ❌ Baru ada di N3 grammar (`g3-keigo`) |
| **Conditionals lanjutan** (〜と, 〜なら) | ⚠️ Hanya 〜たら (g4-tara), 〜ば (g3-ba). 〜と dan 〜なら belum ada |
| **Transitive/intransitive** (開ける/開く, 付ける/付く) | ❌ Belum ada |
| **Honorific prefixes** (お〜, ご〜) | ❌ Belum ada |
| **Formal letters/email** | ❌ Belum ada |

### Berdasarkan Cakupan JLPT N3

| Topik | Status |
|-------|--------|
| **News & media** (新聞, 記事, 放送) | ❌ Belum ada |
| **Abstract concepts** (社会, 文化, 経済, 政治) | ❌ Belum ada |
| **Complex conditionals** | ❌ Belum ada |
| **Nominalizers** (〜こと, 〜もの) | ⚠️ Hanya 〜ことにする/〜ことになる |

---

## 10. KESIMPULAN GAP KURIKULUM

| Gap | Severity | Detail |
|-----|----------|--------|
| **N5 vocabulary hanya 6% cakupan JLPT** | 🔴 HIGH | 48/800 kata. Terlalu sedikit untuk membangun kosakata dasar |
| **N3 reading/listening = 0** | 🔴 HIGH | Begitu player capai N3, tidak ada konten reading/listening sama sekali |
| **N2/N1 = 0 di SEMUA kategori** | 🔴 HIGH | Level tertinggi hanya placeholder type |
| **Tidak ada pengajaran angka, warna, keluarga** | 🟡 MEDIUM | Kategori dasar N5 yang kritis benar-benar kosong |
| **Tidak ada dedicated kanji curriculum** | 🟡 MEDIUM | Kanji hanya efek samping dari vocabulary. Tidak ada pengajaran terstruktur |
| **Grammar N5 hanya 12.5% cakupan** | 🟡 MEDIUM | 10/80 N5 grammar points. Banyak particle dan form dasar tidak tercakup |
| **N3 grammar hanya 1 exercise untuk causative-passive** | 🟠 LOW | `g3-causpass` dan `g3-bakari` hanya punya 1 latihan (vs 2 untuk yang lain) |
| **Semua `explanationIdn` kosong** | 🟠 LOW | 30 grammar points — pemain Indonesia harus baca penjelasan bahasa Inggris |
| **Distribusi N3 tidak seimbang** | 🟠 LOW | 40% work, 48% daily — N3 player tidak belajar food/school/time/place |
| **Tidak ada konten listening selain station announcement** | 🟠 LOW | 2 drill, keduanya topik kereta. Tidak ada percakapan sehari-hari, dialog, atau instruksi |
| **Content pack system siap tapi kosong** | 🟢 INFO | Infrastructure untuk custom content via `/api/content` sudah ada, tinggal diisi |