# 📐 ALUR_KURIKULUM.md — JLPT Curriculum Coverage Audit

> **Reverse-engineered dari `src/data/` — status per 2026-07-17 (revisi ke-2)**
>
> Semua angka diambil langsung dari file data. Tidak ada estimasi kecuali disebut eksplisit.
>
> Revisi sebelumnya (2026-07-14) mencatat vocabulary 128 kata, **tidak ada file kanji sama sekali**,
> dan N3 reading/listening = 0. Ketiganya sudah ditambal besar-besaran di Fase 3.

---

## 1. KOSAKATA PER LEVEL (src/data/vocabulary.ts)

### 1.1 Total Item per Level — Naik dari 128 → **180 kata**

| Level | Jumlah (dulu) | Jumlah (sekarang) | Selisih | Ada Kanji (jp≠kana) |
|-------|---------------|--------------------|---------|-----------------------|
| **N5** | 48 | **90** | +42 | 84/90 (93%) |
| **N4** | 40 | **50** | +10 | 48/50 (96%) |
| **N3** | 40 | **40** | +0 | 40/40 (100%) |
| **N2** | 0 | **0** | — | — |
| **N1** | 0 | **0** | — | — |
| **Total** | **128** | **180** | **+52** | 172/180 (96%) |

Semua kata (lama + baru) punya `idn` dan `kana` lengkap (100% coverage), sesuai standar sebelumnya.

### 1.2 Kata Baru yang Ditambahkan (Fase 3)

Ditambahkan untuk menutup dua kebutuhan: (a) kategori dasar N5 yang tadinya kosong total (angka, warna, keluarga, tubuh), dan (b) kata yang dipakai di reading/listening N3 baru tapi belum ada di vocabulary pool.

| Kategori Baru | Jumlah | Contoh |
|----------------|--------|--------|
| `number` (angka 1–10, 100, 1000, 10000, orang) | 13 | 一(いち), 十(じゅう), 百(ひゃく), 万(まん), 一人(ひとり) |
| `color` (warna) | 4 | 赤い, 青い, 白い, 黒い |
| `family` (keluarga) | 5 | 父, 母, 家族, 兄, 姉 |
| `body` (tubuh) | 6 | 口, 目, 耳, 手, 足, 頭 |
| Waktu/harian tambahan (N5) | 12 | 先週, 今週, 先月, 毎日, 昨日, 金曜日, 日曜日, 新しい, 少し, 言う, 遠い, スーパー |
| Kata kerja N4 tambahan | 8 | 思う, 住む, 変わる, 終わる, 受ける, 失敗, 忘れる, 必ず, 親友, 疲れる |

> ✅ Ini menutup gap lama "Tidak ada pengajaran angka, warna, keluarga" yang ditandai 🟡 MEDIUM di revisi sebelumnya.

### 1.3 Distribusi per Kategori per Level (Angka Terkini)

| Kategori | N5 | N4 | N3 | Total |
|----------|-----|-----|-----|-------|
| `body` **(baru)** | 6 | 0 | 0 | 6 |
| `color` **(baru)** | 4 | 0 | 0 | 4 |
| `daily` | 13 | 18 | 16 | 47 |
| `family` **(baru)** | 5 | 0 | 0 | 5 |
| `food` | 10 | 3 | 0 | 13 |
| `number` **(baru)** | 13 | 0 | 0 | 13 |
| `place` | 3 | 0 | 0 | 3 |
| `school` | 6 | 5 | 0 | 11 |
| `shopping` | 7 | 6 | 2 | 15 |
| `time` | 13 | 1 | 0 | 14 |
| `train` | 6 | 7 | 3 | 16 |
| `work` | 4 | 10 | 19 | 33 |
| **Total** | **90** | **50** | **40** | **180** |

**Pola (masih berlaku):** N3 tetap sangat condong ke `work` (48% dari 40 kata N3) dan `daily` (40%), tanpa food/school/time/place — pola ini belum berubah karena penambahan kata difokuskan ke N5 (dasar kehidupan) dan N3 (reading/listening baru), bukan menyeimbangkan ulang distribusi N3.

---

## 2. [BARU] KANJI CURRICULUM (src/data/kanji.ts)

**Perubahan paling signifikan sejak revisi sebelumnya:** dulu "Kanji — Tidak Ada File Data Khusus" (kanji hanya efek samping dari vocabulary). Sekarang ada **file kanji terstruktur penuh** dengan 306 entri.

### 2.1 Total per Level

| Level | Jumlah Kanji | Exports |
|-------|--------------|---------|
| **N5** | 112 | `KANJI_N5` |
| **N4** | 105 | `KANJI_N4` |
| **N3** | 89 | `KANJI_N3` |
| **Total** | **306** | `ALL_KANJI`, `kanjiByLevel(level)` |

### 2.2 Struktur `KanjiEntry`

```ts
interface KanjiEntry {
  id: string;
  character: string;
  onyomi: string[];       // bacaan on'yomi
  kunyomi: string[];      // bacaan kun'yomi
  meaning: { en: string; idn: string };
  strokeCount: number;
  level: JlptLevel;
  exampleVocabIds: string[];  // link ke VOCABULARY yang memakai kanji ini
}
```

Setiap entri mengaitkan diri ke kata di `vocabulary.ts` lewat `exampleVocabIds`, jadi kanji tidak berdiri sendiri tapi terhubung ke konteks kata yang sudah diajarkan.

### 2.3 Kategori/Kelompok Kanji (per komentar section di file)

| Kelompok N5 | Kelompok N4 | Kelompok N3 |
|-------------|-------------|-------------|
| Numbers | Food & Cooking (N4) | Work/Business (N3 vocab) |
| Time & Days | Daily Life | Standard N3 Kanji (belum ada di vocab) |
| Directions & Places | Shopping (N4) | |
| People & Body | Train/Transport (N4) | |
| Verbs | School/Study (N4) | |
| School & Study | Work/Business (N4) | |
| Places & Buildings | Standard N4 Kanji (belum ada di vocab) | |
| Nature & Weather | | |
| Animals | | |
| Food & Cooking | | |
| Transportation | | |
| Work & Business | | |
| Shopping & Money | | |
| Misc | | |

Catatan: kelompok "Standard N4/N3 Kanji (not yet in vocab)" menunjukkan sebagian kanji sengaja ditambahkan untuk melengkapi daftar JLPT resmi meski kata contohnya belum ada di `vocabulary.ts` — `exampleVocabIds` untuk entri ini kosong atau merujuk kata umum lain.

### 2.4 Riwayat Perbaikan Data (QA pass, dicatat untuk transparansi audit)

Selama pembuatan kanji.ts, ditemukan dan diperbaiki beberapa masalah data:
- Duplikasi ID (`k5-sen` dipakai 2 karakter berbeda, `k3-hai` dipakai 2 karakter berbeda) → di-rename.
- Karakter 書 terdefinisi 2× dengan ID beda → digabung jadi 1 entri.
- Beberapa mismatch ID↔karakter di N4 (mis. ID `k4-osoi` tapi karakternya 早, bukan 遅) → ID disesuaikan ulang.
- Referensi vocab tidak valid (`v3-setsumei` tidak ada di vocabulary) → dihapus dari `exampleVocabIds`.
- Kun'yomi arkais/jarang dipakai (mis. もも untuk 百, よろず untuk 万) → dibuang dari daftar supaya tidak membingungkan pemain.

Tidak ada isu data yang diketahui masih terbuka di kanji.ts per audit terakhir.

---

## 3. GRAMMAR PER LEVEL (src/data/grammar.ts)

**Tidak berubah** dari revisi sebelumnya — masih 30 poin, 10 per level (N5/N4/N3), 60 exercise total.

### 3.1 Total per Level

| Level | Points | Exercises | Avg Exercises/Point |
|-------|--------|-----------|---------------------|
| **N5** | 10 | 22 | 2.2 |
| **N4** | 10 | 20 | 2.0 |
| **N3** | 10 | 18 | 1.8 |
| **N2/N1** | 0 | — | — |
| **Total** | **30** | **60** | 2.0 |

### 3.2 Field Gap — Masih Terbuka

| Field | N5 | N4 | N3 | Status |
|-------|-----|-----|-----|--------|
| `explanationIdn` | 10/10 terisi | 10/10 terisi | 10/10 terisi | ✅ **FIXED** — semua 30 grammar point kini punya `explanationIdn` (dulu 100% kosong, pemain idn terpaksa baca penjelasan Inggris) |

> ✅ Gap lama "Setiap grammar point punya explanation (EN) tapi explanationIdn tidak pernah diisi" **sudah diperbaiki** — dikonfirmasi lewat pembacaan langsung `grammar.ts`: setiap 10 poin per level memiliki field `explanationIdn` terisi penuh.

---

## 4. READING & LISTENING DRILLS (src/data/drills.ts)

**Perubahan besar:** N3 reading/listening yang dulu **0** kini masing-masing punya **5 drill**.

| Tipe | N5 | N4 | N3 (dulu → sekarang) | Total |
|------|-----|-----|------------------------|-------|
| **Reading** | 1 | 1 | **0 → 5** | **7** |
| **Listening** | 1 | 1 | **0 → 5** | **7** |
| **Total** | 2 | 2 | **0 → 10** | **14** |

### 4.1 Reading Passages (7)

| ID | Level | Title | Topik |
|----|-------|-------|-------|
| read-n5-1 | N5 | 私の一日 (My Day) | Rutinitas harian |
| read-n4-1 | N4 | アルバイトの初日 (Part-Time First Day) | Hari pertama kerja IT |
| read-n3-1 **(baru)** | N3 | 友達の引っ越し (A Friend's Move) | Sahabat pindah ke Osaka, bantu persiapan pindahan |
| read-n3-2 **(baru)** | N3 | 夕立と停電 (Evening Shower and Blackout) | Hujan mendadak diikuti mati listrik |
| read-n3-3 **(baru)** | N3 | 締め切りの朝 (Deadline Morning) | Deadline pengembangan fitur, konfirmasi spesifikasi |
| read-n3-4 **(baru)** | N3 | 面接の結果 (Interview Result) | Hasil wawancara kerja tiba |
| read-n3-5 **(baru)** | N3 | 買い物の失敗 (A Shopping Mistake) | Lupa cek tanggal kedaluwarsa susu |

### 4.2 Listening Drills (7)

| ID | Level | Topik |
|----|-------|-------|
| lis-n5-1 | N5 | Pengumuman stasiun: next station |
| lis-n4-1 | N4 | Pengumuman peron: express train platform |
| lis-n3-1 **(baru)** | N3 | Layanan kereta dihentikan akibat hujan deras |
| lis-n3-2 **(baru)** | N3 | Stasiun pagi sangat padat, kereta mungkin terlambat |
| lis-n3-3 **(baru)** | N3 | Laporan rapat, konsultasi perbaikan ke senior |
| lis-n3-4 **(baru)** | N3 | Simpan kuitansi untuk konfirmasi kontrak |
| lis-n3-5 **(baru)** | N3 | Urusan pindah rumah selesai |

**Catatan:** Listening tetap menggunakan `speechSynthesis` browser (Web Speech API) dengan voice `ja-JP`. Tidak ada file audio prerecorded — tidak berubah dari sebelumnya.

---

## 5. WORK TASKS (src/data/workTasks.ts)

**Tidak berubah** — masih 5 task, N3/N2/N1 tetap 0.

| ID | Kind | Level | Title (JP) | Pay |
|----|------|-------|------------|-----|
| w-css-color | bug-css | N5 | ボタンの色が違います | ¥800 |
| w-label-1 | ui-label | N5 | 画面のラベルを確認してください | ¥700 |
| w-css-size | bug-css | N4 | 文字が小さすぎます | ¥1,000 |
| w-git-1 | git-order | N4 | 作業の手順を覚えましょう | ¥900 |
| w-meeting-1 | meeting | N4 | 会議の連絡 | ¥800 |
| N3/N2/N1 | — | — | — | **0 task** |

---

## 6. RECIPES (src/data/recipes.ts)

**Tidak berubah** — masih 3 resep, N3 masih 0.

| ID | Name | Level | Steps | Ingredients |
|----|------|-------|-------|-------------|
| r-misosoup | 味噌汁 | N5 | 5 | tofu, miso, dashi, greenonion |
| r-curry | カレーライス | N5 | 5 | rice, curryroux, carrot, potato, onion, meat |
| r-tamagoyaki | 卵焼き | N4 | 4 | egg, sugar, soysauce |
| N3 | — | — | — | **0 resep** |

---

## 7. STATIONS & TRAIN LINE (src/data/stations.ts)

**Tidak berubah** — 1 jalur (さくら線), 6 stasiun. Train scene masih hanya mengarah ke company (lihat GDD §5.2), meski data 6 stasiun sudah tersedia untuk multi-rute di masa depan.

| Stasiun | Kanji | Romaji |
|---------|-------|--------|
| sakuramachi | 桜町 | Sakuramachi |
| gakuenmae | 学園前 | Gakuen-mae |
| chuo | 中央 | Chūō |
| minatominami | 港南 | Kōnan |
| midorigaoka | 緑が丘 | Midorigaoka |
| kuko | 空港 | Airport |

---

## 8. PERBANDINGAN DENGAN CAKUPAN JLPT RESMI (Angka Diperbarui)

### 8.1 Kosakata

| Level | Standar JLPT | Game (dulu) | Game (sekarang) | Coverage (dulu → sekarang) |
|-------|-------------|-------------|-------------------|------------------------------|
| **N5** | ~800 kata | 48 | **90** | 6.0% → **11.3%** |
| **N4** | ~1,500 kata (kumulatif) | 88 | **140** (90+50) | 5.9% → **9.3%** |
| **N3** | ~3,750 kata (kumulatif) | 128 | **180** | 3.4% → **4.8%** |
| N2 | ~6,000 kata | 0 | 0 | 0% |
| N1 | ~10,000 kata | 0 | 0 | 0% |

Coverage N5 hampir dua kali lipat (6.0%→11.3%) berkat penambahan angka/warna/keluarga/tubuh — kategori fondasi yang sangat sering muncul di materi JLPT resmi.

### 8.2 Grammar

**Tidak berubah** — masih 30 poin, coverage sama seperti sebelumnya (N5 12.5%, N4 16.7%, N3 16.7%).

### 8.3 Kanji (kini eksplisit, bukan estimasi)

| Level | Standar JLPT | Game (dulu, estimasi dari vocab) | Game (sekarang, eksplisit) | Coverage |
|-------|-------------|-------------------------------------|-------------------------------|----------|
| **N5** | ~100 kanji | ~85 (estimasi) | **112** | **~100%+** (melebihi standar minimal, sebagian kanji "extra" untuk kelengkapan) |
| **N4** | ~300 kumulatif | ~120 (estimasi) | **217** (112+105) | **~72%** |
| **N3** | ~650 kumulatif | ~120 (estimasi) | **306** (112+105+89) | **~47%** |
| N2/N1 | ~1000/~2000 | 0 | 0 | 0% |

> ✅ Ini lompatan terbesar di seluruh kurikulum — dari "tidak ada data eksplisit sama sekali" menjadi kanji curriculum paling lengkap di antara semua kategori konten (306 entri dengan onyomi/kunyomi/stroke count).

### 8.4 Reading & Listening

| Level | Standar JLPT | Game (dulu) | Game (sekarang) | Coverage |
|-------|-------------|-------------|--------------------|----------|
| **N5** | Teks pendek (~100-200 chars) | 1 passage | 1 passage | Minimal (tidak berubah) |
| **N4** | Teks menengah (~300-500 chars) | 1 passage | 1 passage | Minimal (tidak berubah) |
| **N3** | Artikel pendek (~500-800 chars) | **0** | **5 passage** | ✅ Dari 0% ke cakupan dasar |
| N2/N1 | Artikel/essay/berita | 0 | 0 | 0% |

---

## 9. TOPIK BESAR — STATUS TERKINI

### Berdasarkan Cakupan JLPT N5 Resmi

| Topik | Status (dulu) | Status (sekarang) |
|-------|----------------|----------------------|
| **Angka & hitungan** (一〜十, 百, 千, 万, 〜人) | ❌ Belum ada | ✅ **13 kata ditambahkan** (`number` category) |
| **Warna** (赤, 青, 白, 黒) | ❌ Belum ada | ✅ **4 kata ditambahkan** (`color` category) |
| **Keluarga** (父, 母, 兄, 姉, 家族) | ❌ Belum ada | ✅ **5 kata ditambahkan** (`family` category) |
| **Tubuh & kesehatan** (頭, 手, 足) | ❌ Belum ada | ✅ **6 kata ditambahkan** (`body` category — kesehatan/penyakit/obat masih belum ada) |
| **Hobi & olahraga** | ❌ Belum ada | ❌ Masih belum ada |
| **Pakaian** | ❌ Belum ada | ❌ Masih belum ada |
| **Alam & cuaca** | ⚠️ Parsial (hanya 夕立) | ⚠️ Masih sama — belum ada 空, 山, 川, 花, 天気 sebagai vocabulary umum |
| **Transportasi umum** (bus/taxi/sepeda) | ⚠️ Hanya kereta | ⚠️ Masih sama |
| **Restoran & konteks makan** (注文, メニュー) | ⚠️ Parsial | ⚠️ Masih sama |
| **Hewan** | ❌ Belum ada | ❌ Masih belum ada |
| **Perabot & rumah** | ⚠️ Parsial (tileset saja) | ⚠️ Masih sama |
| **Musim & festival** (花見, 祭り) | ⚠️ Parsial | ⚠️ **Sedikit membaik** — `story-builtin-matsuri` menambahkan konteks festival musim panas (lihat ALUR_CERITA.md §5), tapi belum ada vocabulary khusus musim/festival |

### Berdasarkan Cakupan JLPT N4/N3

Tidak banyak berubah dari revisi sebelumnya — keigo dasar tetap hanya di N3 grammar, transitive/intransitive pair, honorific prefix (お〜/ご〜), dan topik berita/abstrak N3 masih belum ada.

---

## 10. KESIMPULAN GAP KURIKULUM — STATUS TERKINI

| Gap (revisi 2026-07-14) | Status Sekarang |
|-----|-----------------|
| 🔴 N5 vocabulary hanya 6% cakupan JLPT | ⚠️ **MEMBAIK** — naik ke 11.3%, tapi masih jauh dari standar 800 kata |
| 🔴 N3 reading/listening = 0 | ✅ **FIXED** — masing-masing 5 drill baru |
| 🔴 N2/N1 = 0 di semua kategori | ⚠️ **BELUM** — masih placeholder type saja |
| 🟡 Tidak ada pengajaran angka/warna/keluarga | ✅ **FIXED** — semua 3 kategori + tubuh ditambahkan |
| 🟡 Tidak ada dedicated kanji curriculum | ✅ **FIXED SEPENUHNYA** — 306 entri terstruktur dengan onyomi/kunyomi/stroke count |
| 🟡 Grammar N5 hanya 12.5% cakupan | ⚠️ **BELUM** — masih 10/80 poin |
| 🟠 N3 grammar `g3-causpass`/`g3-bakari` hanya 1 exercise | ⚠️ **BELUM** — belum diperiksa ulang, kemungkinan masih sama |
| 🟢 Semua `explanationIdn` kosong | ✅ **FIXED** — 30/30 grammar point kini punya `explanationIdn` |
| 🟠 Distribusi N3 tidak seimbang (40% work, 48% daily) | ⚠️ **BELUM** — pola sama persis (kata baru difokuskan ke N5, bukan menyeimbangkan N3) |
| 🟠 Konten listening hanya topik kereta | ✅ **MEMBAIK** — 5 listening N3 baru menambah topik kantor (rapat, kontrak, laporan) selain kereta |
| 🟢 Content pack system siap tapi kosong | ✅ **AKTIF** — 13 content type termasuk `kanji` dan `stories` kini ada di skema (`src/features/content/schema.ts`), admin-gated |

### Prioritas Berikutnya (belum dikerjakan)

| # | Rekomendasi | Dampak |
|---|-------------|--------|
| 1 | **Perluas N5 vocabulary lebih jauh** | Masih di 11.3% dari standar 800 kata — kategori hobi/pakaian/hewan/alam masih kosong total |
| 2 | **Seimbangkan ulang distribusi N3** | 40% work + 48% daily membuat N3 terasa seperti "simulator kantor" — perlu variasi food/school/time/place |
| 3 | **Mulai isi konten N2** | Kanji/grammar/vocab N2 belum ada sama sekali — begitu N3 terasa cukup solid, N2 jadi prioritas berikutnya |
| 4 | **Tambah exercise untuk `g3-causpass`/`g3-bakari`** | Masih di bawah rata-rata (1 exercise vs 2 untuk poin N3 lain) |
