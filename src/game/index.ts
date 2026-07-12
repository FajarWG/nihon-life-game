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
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 540,
    pixelArt: true,
    backgroundColor: "#181420",
    physics: { default: "arcade", arcade: { debug: false } },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      BootScene, MapScene, UIScene, MenuScene,
      StudyScene, SchoolScene, ShopScene, TrainScene, WorkScene,
      CookScene, ReadScene, ExamScene, SleepScene, StoryScene,
    ],
  });
  // debug handles (also used by the Tiled export helpers)
  (window as unknown as Record<string, unknown>).__nihonGame = game;
  (window as unknown as Record<string, unknown>).__nihonStore = gameStore;
  return game;
}
