import * as Phaser from "phaser";
import { gameStore } from "./state/gameState";
import { BootScene } from "./scenes/BootScene";
import { MapScene } from "./scenes/MapScene";
import { UIScene } from "./scenes/UIScene";
import { MenuScene } from "./scenes/MenuScene";
import { StudyScene } from "./scenes/activities/StudyScene";
import { SchoolScene } from "./scenes/activities/SchoolScene";
import { ShopScene } from "./scenes/activities/ShopScene";
import { TrainScene } from "./scenes/activities/TrainScene";
import { WorkScene } from "./scenes/activities/WorkScene";
import { CookScene } from "./scenes/activities/CookScene";
import { ReadScene } from "./scenes/activities/ReadScene";
import { ExamScene } from "./scenes/activities/ExamScene";
import { SleepScene } from "./scenes/activities/SleepScene";
import { StoryScene } from "./scenes/activities/StoryScene";

export function createGame(parent: HTMLElement): Phaser.Game {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  // Scale.FIT stretches the canvas's CSS size up to fill `parent` (the host
  // div is w-screen/h-screen — almost always much bigger than the 960×540
  // logical game size). `resolution` only controls the backing-buffer size
  // relative to the LOGICAL 960×540 size, not relative to how big FIT then
  // displays it — so on a normal (non-retina, dpr=1) monitor the buffer
  // stayed at 960×540 while FIT stretched it to, say, 1728×972 on screen,
  // and the browser had to upscale ~1.8x, blurring every bit of text.
  // Bake that stretch factor into `resolution` so the buffer renders at
  // (roughly) the size it's actually shown at.
  const rect = parent.getBoundingClientRect();
  const fitScale = rect.width > 0 && rect.height > 0
    ? Math.max(rect.width / 960, rect.height / 540, 1)
    : 1;
  const resolution = Math.min(dpr * fitScale, 3); // cap — avoid GPU overkill on huge/ultra-wide monitors

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 540,
    // NOT pixelArt:true — that forces nearest-neighbor on text too, making it
    // unreadable when the canvas upscales. Sprites/tiles opt into NEAREST
    // individually in gfx/textures.ts; text stays smooth.
    roundPixels: true,
    backgroundColor: "#181420",
    physics: { default: "arcade", arcade: { debug: false } },
    render: {
      resolution,
      antialias: true,
      pixelArt: false,
    } as any,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      BootScene,
      MapScene,
      UIScene,
      MenuScene,
      StudyScene,
      SchoolScene,
      ShopScene,
      TrainScene,
      WorkScene,
      CookScene,
      ReadScene,
      ExamScene,
      SleepScene,
      StoryScene,
    ],
  });
  // debug handles (also used by the Tiled export helpers)
  (window as unknown as Record<string, unknown>).__nihonGame = game;
  (window as unknown as Record<string, unknown>).__nihonStore = gameStore;
  return game;
}
