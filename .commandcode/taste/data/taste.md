# data
- Always fill the `idn` (Indonesian) field for all data entries — never leave it empty, as this was a recurring issue (e.g., explanationIdn in grammar entries). Confidence: 0.65
- Mark uncertain data entries with `// VERIFY` comment for manual review instead of guessing. Confidence: 0.75
- For kunyomi readings: prefer leaving the array empty over including archaic, rare, or uncertain readings. Confidence: 0.75
- Kanji entry IDs must reflect the character's own reading/meaning, not a concept borrowed from another kanji (e.g., don't use "chikara" for 度 when 力 already owns it). Confidence: 0.80
- When adding a new JLPT-level kanji array, check all prior levels first: if the character already exists, add exampleVocabIds to the existing entry instead of creating a duplicate. Confidence: 0.80
- In exampleVocabIds, list the vocabulary entry where the kanji appears most directly first, before indirect compound words. Confidence: 0.75
