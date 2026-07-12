# Nihon Life: Live, Learn, Work

A cozy pixel-art life-sim RPG (Stardew Valley × Persona × language school) where you
play an international student in Japan and learn Japanese (JLPT N5 → N3) by *living* —
studying, shopping, riding trains, cooking, and working as a junior frontend dev at an
IT company. Built game-first: **Phaser 3 is the game; Next.js is only the shell.**

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Optional environment (`.env`, see `.env.example`) — the game is fully playable offline without any of it:

```bash
DATABASE_URL=postgresql://...   # cloud saves + custom content packs (password must be URL-encoded)
GROQ_API_KEY=...                # AI stories, tried first
GEMINI_API_KEY=...              # automatic fallback on rate-limit / quota / timeout
```

## Content Workshop (/admin)

Open **/admin** to grow the game's content without touching code:

1. Pick a content type (vocabulary, grammar, items, recipes, NPCs, quests, …) and **Copy prompt** —
   the prompt embeds the exact JSON shape plus all existing ids.
2. Paste it into any AI chat, then paste the returned JSON array back and **Save pack**.
3. Packs are stored in Postgres, merged into the game at launch, and cached in
   IndexedDB so custom content keeps working offline. Built-in ids always win.

## Controls

WASD / arrows — move · **E** / Z / Space — interact · **I** — bag · **Q** — quests · **ESC** — menu

## Architecture

```
src/
  app/                 Next.js shell: title page, /play mount, /api/story route
  core/                types.ts (all content schemas), db.ts (Dexie/IndexedDB)
  data/                ALL game content — plain typed objects (see below)
  features/story/      StoryProvider abstraction: Groq → Gemini chain + JSON validation
  game/
    index.ts           createGame() — Phaser config & scene list
    state/gameState.ts Zustand (vanilla) store: time, money, energy, skills, inventory…
    systems/           quests.ts (objective engine), save.ts (auto/manual save)
    events.ts          typed event bus (toasts, quest events, xp, …)
    gfx/               procedural pixel-art: tileset, characters, icons, UI panels
    maps/maps.ts       ASCII-authored maps compiled to tile grids + doors + interactables
    audio/             synthesized SFX (Howler) + ja-JP speech synthesis for listening
    ui/                pixel UI toolkit: 9-slice panels, buttons, bars, typewriter
    scenes/            Boot, Map (world), UI (HUD/dialogue), Menu
    scenes/activities/ Study, School, Shop, Train, Work, Cook, Read, Exam, Sleep, Story
```

Key design points:

- **All gameplay UI is custom pixel-art inside Phaser** — no component libraries.
- **Pixel art is generated at boot** from code (`gfx/textures.ts`) — zero binary assets.
  Swap any texture key for a real PNG later without touching game logic.
- **Activities are sequential scripts** built on awaitable widgets
  (`ask`, `order`, `pairs`, `card` in `ActivityBase`) — adding a mini-game is ~50 lines.
- **JLPT levels replace EXP.** Skill XP (grammar/vocab/reading/listening/kanji) unlocks
  the level-up exam at the library desk (N5→N4→N3; N2/N1 slots ready in the types).
- **Quests are data + one engine.** Objectives listen to gameplay events
  (`talk`, `buy`, `cook`, `activity`, …). Daily quests roll each morning.
- **Saves** live in IndexedDB (Dexie): autosave on sleep, manual save in the menu.

## Extending content (AI-friendly)

Every content type is a plain typed array in `src/data/` — the current entries are
small samples. To add more, generate objects matching the types in `src/core/types.ts`:

| File            | Type            | Notes                                        |
|-----------------|-----------------|----------------------------------------------|
| `vocabulary.ts` | `VocabEntry`    | keyed by JLPT level + category                |
| `grammar.ts`    | `GrammarPoint`  | includes `order`/`fill` exercises             |
| `items.ts`      | `ItemDef`       | add an icon key or reuse an existing one      |
| `recipes.ts`    | `Recipe`        | steps in JP become the cooking mini-game      |
| `stations.ts`   | `Station`/`TrainLine` | powers the train mini-game              |
| `npcs.ts`       | `NpcDef`        | schedules place NPCs on maps by hour          |
| `quests.ts`     | `QuestDef`      | main chain links via `next`                   |
| `workTasks.ts`  | `WorkTask`      | `kind` picks the mini-game widget             |
| `drills.ts`     | `ReadingPassage`/`ListeningDrill` | school & library content    |

Maps are ASCII art in `src/game/maps/maps.ts` (row widths validated at compile).

## AI usage policy

AI is **only** used to generate new story events (`POST /api/story` → JSON only,
hard-validated in `features/story/validate.ts`, stored in IndexedDB, played at the
apartment table). Normal gameplay never requires a network call.
