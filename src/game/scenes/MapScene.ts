import * as Phaser from "phaser";
import type { LocationId, NpcDef } from "@/core/types";
import { NPCS } from "@/data/npcs";
import { Bus } from "@/game/events";
import { TILE } from "@/game/gfx/textures";
import { getMap, SOLID_TILES, type CompiledMap } from "@/game/maps/maps";
import { DAY_END, G, gameStore } from "@/game/state/gameState";
import { style } from "@/game/ui/theme";
import type { UIScene } from "./UIScene";

const SPEED = 90;

interface SpawnData { mapId: LocationId; spawnX: number; spawnY: number }

export class MapScene extends Phaser.Scene {
  private map!: CompiledMap;
  private player!: Phaser.Physics.Arcade.Sprite;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private npcSprites: { def: NpcDef; sprite: Phaser.Physics.Arcade.Sprite }[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private facing: "down" | "left" | "right" | "up" = "down";
  private prompt!: Phaser.GameObjects.Text;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private weatherEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private tickAcc = 0;
  private doorCooldown = 0;
  private transitioning = false;

  constructor() { super("Map"); }

  init(data: Partial<SpawnData>) {
    const s = G();
    this.registry.set("spawn", {
      mapId: data.mapId ?? s.location,
      spawnX: data.spawnX ?? s.posX,
      spawnY: data.spawnY ?? s.posY,
    });
  }

  create() {
    const { mapId, spawnX, spawnY } = this.registry.get("spawn") as SpawnData;
    this.map = getMap(mapId);
    G().setLocation(mapId, spawnX, spawnY);
    this.npcSprites = [];
    this.transitioning = false;
    this.tickAcc = 0;
    this.doorCooldown = 500;

    // tilemap
    const tilemap = this.make.tilemap({ data: this.map.grid, tileWidth: TILE, tileHeight: TILE });
    const tileset = tilemap.addTilesetImage("tiles")!;
    this.layer = tilemap.createLayer(0, tileset, 0, 0)!;
    this.layer.setCollision([...SOLID_TILES]);

    // player
    this.player = this.physics.add.sprite(spawnX * TILE + 8, spawnY * TILE + 10, "player", 0);
    this.player.body!.setSize(10, 8);
    this.player.body!.setOffset(3, 12);
    this.player.setDepth(10);
    this.physics.add.collider(this.player, this.layer);

    // NPCs on schedule
    const hour = Math.floor(G().minutes / 60);
    for (const npc of NPCS) {
      const slot = npc.schedule.find(s => s.location === mapId && hour >= s.from && hour < s.to);
      if (!slot) continue;
      const sprite = this.physics.add.sprite(slot.x * TILE + 8, slot.y * TILE + 10, npc.sprite, 0);
      sprite.setImmovable(true);
      sprite.setDepth(9);
      this.physics.add.collider(this.player, sprite);
      this.npcSprites.push({ def: npc, sprite });
      this.add.text(sprite.x, sprite.y - 16, npc.name, style(7, "#ffffffcc")).setOrigin(0.5).setDepth(20);
    }

    // camera
    const w = this.map.width * TILE, h = this.map.height * TILE;
    const zoom = this.map.def.outdoor ? 2 : 3;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBackgroundColor("#181420");
    const viewW = this.scale.width / zoom, viewH = this.scale.height / zoom;
    if (w <= viewW && h <= viewH) {
      // small interior: fixed camera, room centered on screen
      this.cameras.main.centerOn(w / 2, h / 2);
    } else {
      this.cameras.main.setBounds(0, 0, w, h);
      this.cameras.main.startFollow(this.player, true);
    }
    this.cameras.main.fadeIn(300);

    // input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,A,S,D,E,Z") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.keyboard!.on("keydown-E", () => this.tryInteract());
    this.input.keyboard!.on("keydown-Z", () => this.tryInteract());
    this.input.keyboard!.on("keydown-SPACE", () => this.tryInteract());

    // facing prompt (world-space, follows player)
    this.prompt = this.add.text(0, 0, "", style(8, "#ffe9a8", { backgroundColor: "#201a2ecc", padding: { x: 4, y: 2 } }))
      .setOrigin(0.5, 1).setDepth(30).setVisible(false);

    // night + weather
    this.nightOverlay = this.add.rectangle(0, 0, this.scale.width / zoom + w, h + this.scale.height, 0x141030, 0)
      .setOrigin(0).setDepth(40).setScrollFactor(0);
    this.setupWeather(zoom);

    Bus.emit("map-changed", mapId);
  }

  private setupWeather(zoom: number) {
    if (!this.map.def.outdoor) return;
    const wx = G().weather;
    if (wx !== "rain" && wx !== "snow") return;
    const key = wx === "rain" ? "rain" : "snow";
    this.weatherEmitter = this.add.particles(0, 0, key, {
      x: { min: 0, max: this.scale.width / zoom },
      y: -10,
      lifespan: 2200,
      speedY: wx === "rain" ? { min: 120, max: 160 } : { min: 20, max: 40 },
      speedX: wx === "rain" ? { min: -10, max: 0 } : { min: -15, max: 15 },
      quantity: wx === "rain" ? 4 : 1,
      alpha: { start: 0.9, end: 0.4 },
    }).setDepth(35).setScrollFactor(0);
  }

  /* ── interaction ─────────────────────────────────────────────────────── */

  private facingTile(): [number, number] {
    const px = Math.floor(this.player.x / TILE);
    const py = Math.floor(this.player.y / TILE);
    const d = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[this.facing];
    return [px + d[0], py + d[1]];
  }

  private findInteract() {
    const px = Math.floor(this.player.x / TILE);
    const py = Math.floor(this.player.y / TILE);
    const [fx, fy] = this.facingTile();
    // NPC in front?
    const npc = this.npcSprites.find(n => {
      const nx = Math.floor(n.sprite.x / TILE), ny = Math.floor(n.sprite.y / TILE);
      return (nx === fx && ny === fy) || (Math.abs(n.sprite.x - this.player.x) < 20 && Math.abs(n.sprite.y - this.player.y) < 20);
    });
    if (npc) return { npc: npc.def, label: `Talk to ${npc.def.name}` };
    const it = this.map.interacts.find(i =>
      (i.x === fx && i.y === fy) || (Math.abs(i.x - px) + Math.abs(i.y - py) <= 1));
    if (it) return { interact: it, label: it.label };
    return null;
  }

  private tryInteract() {
    if (G().paused || this.transitioning) return;
    const found = this.findInteract();
    if (!found) return;
    const ui = this.scene.get("UI") as UIScene;
    if (found.npc) { ui.talkToNpc(found.npc); return; }
    if (found.interact) this.routeInteract(found.interact.kind);
  }

  private routeInteract(kind: string) {
    const s = G();
    const ui = this.scene.get("UI") as UIScene;
    const hour = s.minutes / 60;
    const launch = (key: string, data?: object) => {
      this.scene.pause();
      this.scene.launch(key, data);
    };
    switch (kind) {
      case "sleep": launch("Sleep", { forced: false }); break;
      case "study":
        if (s.activitiesDone.includes("study")) return ui.toast("You already studied today.", "info");
        if (s.energy < 10) return ui.toast("Too tired to focus…", "warn");
        launch("Study"); break;
      case "cook": launch("Cook"); break;
      case "fridge": launch("Menu", { tab: "inventory" }); break;
      case "story": launch("Story"); break;
      case "lesson":
        if (s.activitiesDone.includes("school")) return ui.toast("Class is over for today.", "info");
        if (hour < 8 || hour >= 16) return ui.toast("School is open 8:00–16:00.", "info");
        if (s.energy < 15) return ui.toast("Too tired for class…", "warn");
        launch("School"); break;
      case "shop-konbini": launch("Shop", { shop: "konbini" }); break;
      case "shop-super": launch("Shop", { shop: "supermarket" }); break;
      case "shop-restaurant": launch("Shop", { shop: "restaurant" }); break;
      case "vending": launch("Shop", { shop: "vending" }); break;
      case "train": launch("Train"); break;
      case "work":
        if (s.activitiesDone.includes("work")) return ui.toast("Your shift is done for today.", "info");
        if (hour < 10 || hour >= 19) return ui.toast("The office is open 10:00–19:00.", "info");
        if (s.energy < 20) return ui.toast("Too tired to work…", "warn");
        launch("Work"); break;
      case "read":
        if (s.energy < 8) return ui.toast("Too tired to read…", "warn");
        launch("Read"); break;
      case "exam":
        if (!s.examReady()) {
          return ui.toast(`Keep studying! JLPT progress: ${s.totalXp()} XP`, "info");
        }
        launch("Exam"); break;
      case "meeting-board":
        ui.startDialogue([
          { speaker: "narrator", jp: "今週の予定：金曜日にデザインレビューがあります。", kana: "こんしゅうのよてい：きんようびにでざいんれびゅーがあります。", en: "This week: design review on Friday." },
        ], { name: "掲示板" });
        break;
      default: break;
    }
  }

  /** Called by activity scenes when they finish. */
  resumeFromActivity() {
    this.scene.resume();
  }

  /* ── update loop ─────────────────────────────────────────────────────── */

  update(_t: number, dt: number) {
    if (this.transitioning) return;
    const paused = G().paused;

    // time ticks while free-roaming
    if (!paused) {
      this.tickAcc += dt;
      while (this.tickAcc >= 1000) {
        this.tickAcc -= 1000;
        G().advanceMinutes(2);
      }
      if (G().minutes >= DAY_END) {
        this.transitioning = true;
        this.scene.pause();
        this.scene.launch("Sleep", { forced: true });
        return;
      }
    }

    // night tint
    const hour = G().minutes / 60;
    const night = hour >= 18 ? Math.min(0.45, (hour - 18) / 4 * 0.45) : hour < 7 ? 0.3 : 0;
    this.nightOverlay.setAlpha(this.map.def.outdoor ? night : night * 0.5);

    // movement
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let vx = 0, vy = 0;
    if (!paused) {
      if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -SPEED;
      else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = SPEED;
      if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -SPEED;
      else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = SPEED;
    }
    body.setVelocity(vx, vy);
    if (vx !== 0 && vy !== 0) body.velocity.normalize().scale(SPEED);

    const key = this.player.texture.key;
    if (vx < 0) this.facing = "left";
    else if (vx > 0) this.facing = "right";
    else if (vy < 0) this.facing = "up";
    else if (vy > 0) this.facing = "down";

    if (vx || vy) {
      this.player.anims.play(`${key}-walk-${this.facing}`, true);
    } else {
      this.player.anims.stop();
      const dirIdx = { down: 0, left: 1, right: 2, up: 3 }[this.facing];
      this.player.setFrame(dirIdx * 3);
    }

    // doors
    if (this.doorCooldown > 0) this.doorCooldown -= dt;
    const px = Math.floor(this.player.x / TILE);
    const py = Math.floor(this.player.y / TILE);
    if (this.doorCooldown <= 0 && !paused) {
      const door = this.map.doors.find(d => d.x === px && d.y === py);
      if (door) {
        this.transitioning = true;
        this.cameras.main.fadeOut(250);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          G().setLocation(door.to, door.tx, door.ty);
          this.scene.restart({ mapId: door.to, spawnX: door.tx, spawnY: door.ty });
        });
        return;
      }
    }

    // interaction prompt
    const found = !paused && this.findInteract();
    if (found) {
      this.prompt.setText(`[E] ${found.label}`);
      this.prompt.setPosition(this.player.x, this.player.y - 14);
      this.prompt.setVisible(true);
    } else {
      this.prompt.setVisible(false);
    }
  }
}
