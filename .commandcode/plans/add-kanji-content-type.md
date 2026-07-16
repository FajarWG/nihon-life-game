# Add "kanji" Content Type to Content Workshop

## Files to modify

### 1. `src/features/content/schema.ts`
- Add `"kanji"` to the `CONTENT_TYPES` array (after `"listenings"`).
- Add to `REQUIRED_KEYS`:
  ```
  kanji: ["id", "character", "onyomi", "kunyomi", "meaning", "strokeCount", "level", "exampleVocabIds"],
  ```

### 2. `src/features/content/prompts.ts`
- Add import: `import { ALL_KANJI } from "@/data/kanji";`
- Add `SHAPES.kanji` after `listenings`:
  ```ts
  kanji: `{
    "id": "k5-xxx",
    "character": "字",
    "onyomi": ["ジ"],
    "kunyomi": ["あざ"],
    "meaning": { "en": "character / letter", "idn": "karakter / huruf" },
    "strokeCount": 6,
    "level": "N5" | "N4" | "N3",
    "exampleVocabIds": ["v5-xxx"]
  }`,
  ```
- Add `EXISTING.kanji` after `listenings`:
  ```ts
  kanji: () => ALL_KANJI.map(k => k.id),
  ```
- Add `EXTRA_NOTES.kanji` after `quests` with quality rules + existing characters string.

### 3. `src/features/content/registry.ts`
- Add import: `import { ALL_KANJI } from "@/data/kanji";`
- Add `KanjiEntry` to the type import from `@/core/types`
- Add case in `mergePack`: `case "kanji": mergeInto<KanjiEntry>(ALL_KANJI, null, items); break;`

### 4. `src/app/admin/page.tsx`
- Add to `TYPE_LABELS`: `kanji: "漢字 Kanji",`

## Verification: `npx tsc --noEmit`
