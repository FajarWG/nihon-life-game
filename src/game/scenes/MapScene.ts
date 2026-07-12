import * as Phaser from "phaser";
import { LOCATION_NAMES, type LocationId, type NpcDef, type Season } from "@/core/types";
import { NPCS } from "@/data/npcs";
import { setRainAmbience, startBgm } from "@/game/audio/bgm";
import { Bus } from "@/game/events";
import { CHAR_FRAMES, TILE } from "@/game/gfx/textures";
import { getMap, SOLID_TILES, type CompiledMap } from "@/game/maps/maps";
import { DAY_END, G } from "@/game/state/gameState";
import { L } from "@/game/i18n";
import { style } from "@/game/ui/theme";
import type { UIScene } from "./UIScene";

const SPEED = 90;

const SEASON_TINT: Record<Season, { color: number; alpha: number }> = {
  spring: { color: 0xffd8e8, alpha: 0.05 },
  summer: { color: 0xd8ffd0, alpha: 0.05 },
  autumn: { color: 0xffa050, alpha: 0.09 },
  winter: { color: 0xcce0ff, alpha: 0.12 },
};

/** Rotating notices on the office board — light reading practice. */
const BOARD_NOTICES = [
  { jp: "金曜日の15時からデザインレビューがあります。", kana: "きんようびのじゅうごじからでざいんれびゅーがあります。", en: "There's a design review Friday from 3 PM.", idn: "Ada design review hari Jumat mulai pukul 15.00." },
  { jp: "来週、新しいメンバーが入ります。よろしくお願いします。", kana: "らいしゅう、あたらしいめんばーがはいります。よろしくおねがいします。", en: "A new member joins next week. Please welcome them.", idn: "Minggu depan ada anggota baru. Mohon sambutannya." },
  { jp: "エアコンの温度は26度にしてください。", kana: "えあこんのおんどはにじゅうろくどにしてください。", en: "Please keep the AC at 26 degrees.", idn: "Tolong atur suhu AC di 26 derajat." },
];

/** Interact-prompt labels per kind, honoring the language settings. */
function interactLabel(kind: string, fallback: string): string {
  switch (kind) {
    case "sleep": return L("寝る", "Sleep", "Tidur");
    case "study": return L("文法の勉強", "Study grammar", "Belajar tata bahasa");
    case "cook": return L("料理する", "Cook", "Masak");
    case "fridge": return L("何か食べる", "Eat something", "Makan sesuatu");
    case "story": return L("ものがたり", "Story time", "Waktu cerita");
    case "lesson": return L("授業に出る", "Join the lesson", "Ikut pelajaran");
    case "shop-konbini":
    case "shop-super": return L("買い物", "Shop", "Belanja");
    case "shop-restaurant": return L("注文する", "Order food", "Pesan makanan");
    case "vending": return L("飲み物を買う", "Buy a drink", "Beli minuman");
    case "train": return L("電車に乗る", "Take the train", "Naik kereta");
    case "work": return L("仕事を始める", "Start your shift", "Mulai kerja");
    case "read": return L("読書の練習", "Reading practice", "Latihan membaca");
    case "exam": return L("JLPT試験", "JLPT exam", "Ujian JLPT");
    case "meeting-board": return L("掲示板", "Notice board", "Papan pengumuman");
    default: return fallback;
  }
}

interface SpawnData { mapId: LocationId; spawnX: number; spawnY: number }

interface NpcOnMap {
  def: NpcDef;
  sprite: Phaser.Physics.Arcade.Sprite;
  label: Phaser.GameObjects.Text;
  anchorX: number;
  anchorY: number;
  busy: boolean; // mid-step tween
}

export class MapScene extends Phaser.Scene {
  private map!: CompiledMap;
  private player!: Phaser.Physics.Arcade.Sprite;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private npcs: NpcOnMap[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private facing: "down" | "left" | "right" | "up" = "down";
  private prompt!: Phaser.GameObjects.Text;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private lastHour = -1;
  private tickAcc = 0;
  private doorCooldown = 0;
  private transitioning = false;
  private unsubs: (() => void)[] = [];

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
    this.npcs = [];
    this.transitioning = false;
    this.tickAcc = 0;
    this.doorCooldown = 500;
    this.lastHour = Math.floor(G().minutes / 60);

    // tilemap — prefer a Tiled JSON map from /public/maps if one was loaded at boot
    const tiledKey = `tiled-${mapId}`;
    let tilemap: Phaser.Tilemaps.Tilemap;
    if (this.cache.tilemap.exists(tiledKey)) {
      tilemap = this.make.tilemap({ key: tiledKey });
    } else {
      tilemap = this.make.tilemap({ data: this.map.grid, tileWidth: TILE, tileHeight: TILE });
    }
    const tileset = tilemap.addTilesetImage("tiles", "tiles")!;
    this.layer = tilemap.createLayer(0, tileset, 0, 0)!;
    this.layer.setCollision([...SOLID_TILES]);

    // building name signs above every door — Japanese only (outdoor maps)
    if (this.map.def.outdoor) {
      for (const door of this.map.doors) {
        const name = LOCATION_NAMES[door.to];
        if (!name) continue;
        this.add.text(door.x * TILE + 8, door.y * TILE - 3, name.jp, style(7, "#fff7e0", {
          backgroundColor: "#201a2ecc",
          padding: { x: 5, y: 2 },
        })).setOrigin(0.5, 1).setDepth(25);
      }
    }

    // player
    this.player = this.physics.add.sprite(spawnX * TILE + 8, spawnY * TILE + 10, "player", 0);
    this.player.body!.setSize(10, 8);
    this.player.body!.setOffset(3, 12);
    this.player.setDepth(10);
    this.physics.add.collider(this.player, this.layer);

    this.buildNpcs();

    // camera
    const w = this.map.width * TILE, h = this.map.height * TILE;
    const zoom = this.map.def.outdoor ? 2 : 3;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBackgroundColor("#181420");
    const viewW = this.scale.width / zoom, viewH = this.scale.height / zoom;
    if (w <= viewW && h <= viewH) {
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

    // facing prompt
    this.prompt = this.add.text(0, 0, "", style(7, "#ffe9a8", { backgroundColor: "#201a2ee0", padding: { x: 4, y: 2 } }))
      .setOrigin(0.5, 1).setDepth(30).setVisible(false);

    // night + weather + season atmosphere
    this.nightOverlay = this.add.rectangle(0, 0, this.scale.width / zoom + w, h + this.scale.height, 0x141030, 0)
      .setOrigin(0).setDepth(40).setScrollFactor(0);
    if (this.map.def.outdoor) {
      const tint = SEASON_TINT[G().season];
      this.add.rectangle(0, 0, this.scale.width / zoom + w, h + this.scale.height, tint.color, tint.alpha)
        .setOrigin(0).setDepth(39).setScrollFactor(0);
    }
    this.setupWeather(zoom);

    // ambience (audio unlocks on first user gesture; Howler resumes automatically)
    startBgm();
    setRainAmbience(this.map.def.outdoor && G().weather === "rain");

    // NPC wander heartbeat
    this.time.addEvent({ delay: 1600, loop: true, callback: () => this.wanderNpcs() });

    this.unsubs = [
      Bus.on("time", (() => this.onTimeChanged()) as never),
    ];
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubs.forEach(u => u());
      this.unsubs = [];
    });

    Bus.emit("map-changed", mapId);
  }

  /* ── NPCs ────────────────────────────────────────────────────────────── */

  private buildNpcs() {
    this.npcs.forEach(n => { n.sprite.destroy(); n.label.destroy(); });
    this.npcs = [];
    const hour = Math.floor(G().minutes / 60);
    const mapId = this.map.def.id;
    for (const npc of NPCS) {
      const slot = npc.schedule.find(s => s.location === mapId && hour >= s.from && hour < s.to);
      if (!slot) continue;
      const sprite = this.physics.add.sprite(slot.x * TILE + 8, slot.y * TILE + 10, npc.sprite, 0);
      sprite.setImmovable(true);
      sprite.setDepth(9);
      this.physics.add.collider(this.player, sprite);
      const label = this.add.text(sprite.x, sprite.y - 16, npc.name, style(6, "#ffffff", {
        backgroundColor: "#201a2ea0", padding: { x: 2, y: 1 },
      })).setOrigin(0.5).setDepth(20);
      this.npcs.push({ def: npc, sprite, label, anchorX: slot.x, anchorY: slot.y, busy: false });
    }
  }

  private onTimeChanged() {
    const hour = Math.floor(G().minutes / 60);
    if (hour !== this.lastHour) {
      this.lastHour = hour;
      this.buildNpcs(); // schedules may have moved people in/out of this map
    }
  }

  private tileWalkable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || y >= this.map.height || x >= this.map.width) return false;
    if (SOLID_TILES.has(this.map.grid[y][x])) return false;
    if (this.map.doors.some(d => d.x === x && d.y === y)) return false;
    const px = Math.floor(this.player.x / TILE), py = Math.floor(this.player.y / TILE);
    if (px === x && py === y) return false;
    return !this.npcs.some(n => Math.floor(n.sprite.x / TILE) === x && Math.floor(n.sprite.y / TILE) === y);
  }

  private wanderNpcs() {
    if (G().paused || this.transitioning) return;
    for (const n of this.npcs) {
      if (n.busy || Math.random() > 0.4) continue;
      const cx = Math.floor(n.sprite.x / TILE), cy = Math.floor(n.sprite.y / TILE);
      const dirs = Phaser.Utils.Array.Shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      for (const [dx, dy] of dirs) {
        const tx = cx + dx, ty = cy + dy;
        // stay near the schedule anchor
        if (Math.abs(tx - n.anchorX) + Math.abs(ty - n.anchorY) > 2) continue;
        if (!this.tileWalkable(tx, ty)) continue;
        n.busy = true;
        const dir = dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up";
        n.sprite.anims.play(`${n.def.sprite}-walk-${dir}`, true);
        this.tweens.add({
          targets: n.sprite,
          x: tx * TILE + 8, y: ty * TILE + 10,
          duration: 420,
          onUpdate: () => n.label.setPosition(n.sprite.x, n.sprite.y - 16),
          onComplete: () => {
            n.busy = false;
            n.sprite.anims.stop();
            const dirIdx = { down: 0, left: 1, right: 2, up: 3 }[dir];
            n.sprite.setFrame(dirIdx * CHAR_FRAMES);
            n.label.setPosition(n.sprite.x, n.sprite.y - 16);
          },
        });
        break;
      }
    }
  }

  /* ── weather ─────────────────────────────────────────────────────────── */

  private setupWeather(zoom: number) {
    if (!this.map.def.outdoor) return;
    const wx = G().weather;
    if (wx !== "rain" && wx !== "snow") return;
    const key = wx === "rain" ? "rain" : "snow";
    this.add.particles(0, 0, key, {
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
    const npc = this.npcs.find(n => {
      const nx = Math.floor(n.sprite.x / TILE), ny = Math.floor(n.sprite.y / TILE);
      return (nx === fx && ny === fy) || (Math.abs(n.sprite.x - this.player.x) < 20 && Math.abs(n.sprite.y - this.player.y) < 20);
    });
    if (npc) return { npc: npc.def, label: L(`${npc.def.nameJp}と話す`, `Talk to ${npc.def.name}`, `Bicara dengan ${npc.def.name}`) };
    const it = this.map.interacts.find(i =>
      (i.x === fx && i.y === fy) || (Math.abs(i.x - px) + Math.abs(i.y - py) <= 1));
    if (it) return { interact: it, label: interactLabel(it.kind, it.label) };
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

  private launchActivity(key: string, data?: object) {
    this.scene.pause();
    this.scene.launch(key, data);
  }

  private routeInteract(kind: string) {
    const s = G();
    const ui = this.scene.get("UI") as UIScene;
    const hour = s.minutes / 60;
    switch (kind) {
      case "sleep":
        ui.startDialogue(
          [{ speaker: "narrator", jp: "もう寝ますか。", kana: "もうねますか。", en: "Sleep and end the day?", idn: "Tidur dan akhiri hari ini?" }],
          {
            name: "ベッド",
            choices: [
              { text: L("寝る", "Sleep", "Tidur"), cb: () => this.launchActivity("Sleep", { forced: false }) },
              { text: L("まだ起きてる", "Not yet", "Nanti dulu"), cb: () => {} },
            ],
          },
        );
        break;
      case "study":
        if (s.activitiesDone.includes("study")) return ui.toast("You already studied today.", "info");
        if (s.energy < 10) return ui.toast("Too tired to focus…", "warn");
        this.launchActivity("Study"); break;
      case "cook": this.launchActivity("Cook"); break;
      case "fridge": this.launchActivity("Menu", { tab: "inventory" }); break;
      case "story": this.launchActivity("Story"); break;
      case "lesson":
        if (s.activitiesDone.includes("school")) return ui.toast("Class is over for today.", "info");
        if (hour < 8 || hour >= 16) return ui.toast("School is open 8:00–16:00.", "info");
        if (s.energy < 15) return ui.toast("Too tired for class…", "warn");
        this.launchActivity("School"); break;
      case "shop-konbini": this.launchActivity("Shop", { shop: "konbini" }); break;
      case "shop-super": this.launchActivity("Shop", { shop: "supermarket" }); break;
      case "shop-restaurant": this.launchActivity("Shop", { shop: "restaurant" }); break;
      case "vending": this.launchActivity("Shop", { shop: "vending" }); break;
      case "train": this.launchActivity("Train"); break;
      case "work":
        if (s.activitiesDone.includes("work")) return ui.toast("Your shift is done for today.", "info");
        if (hour < 10 || hour >= 19) return ui.toast("The office is open 10:00–19:00.", "info");
        if (s.energy < 20) return ui.toast("Too tired to work…", "warn");
        this.launchActivity("Work"); break;
      case "read":
        if (s.energy < 8) return ui.toast("Too tired to read…", "warn");
        this.launchActivity("Read"); break;
      case "exam":
        if (!s.examReady()) {
          return ui.toast(`Keep studying! JLPT progress: ${s.totalXp()} XP`, "info");
        }
        if (s.flags["examFailedDay"] === s.day) {
          return ui.toast("今日はもう受けました。Try again tomorrow.", "info");
        }
        this.launchActivity("Exam"); break;
      case "meeting-board": {
        const notice = BOARD_NOTICES[(s.day - 1) % BOARD_NOTICES.length];
        ui.startDialogue([{ speaker: "narrator", ...notice }], { name: "掲示板" });
        break;
      }
      default: break;
    }
  }

  /* ── update loop ─────────────────────────────────────────────────────── */

  update(_t: number, dt: number) {
    if (this.transitioning) return;
    const paused = G().paused;

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

    const hour = G().minutes / 60;
    const night = hour >= 18 ? Math.min(0.45, (hour - 18) / 4 * 0.45) : hour < 7 ? 0.3 : 0;
    this.nightOverlay.setAlpha(this.map.def.outdoor ? night : night * 0.5);

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
      this.player.setFrame(dirIdx * CHAR_FRAMES);
    }

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
