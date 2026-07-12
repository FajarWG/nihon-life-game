import { Howl } from "howler";

/**
 * All SFX are tiny synthesized WAVs encoded as data URIs at startup —
 * zero binary assets, works fully offline. Swap for real files later by
 * replacing the table in `defs`.
 */

type SfxName = "click" | "confirm" | "cancel" | "success" | "fail" | "coin" | "levelup" | "sleep";

interface ToneStep { freq: number; ms: number; type?: "square" | "sine" }

const defs: Record<SfxName, ToneStep[]> = {
  click: [{ freq: 660, ms: 40 }],
  confirm: [{ freq: 523, ms: 60 }, { freq: 784, ms: 90 }],
  cancel: [{ freq: 392, ms: 60 }, { freq: 262, ms: 90 }],
  success: [{ freq: 523, ms: 80 }, { freq: 659, ms: 80 }, { freq: 784, ms: 140 }],
  fail: [{ freq: 330, ms: 90 }, { freq: 277, ms: 90 }, { freq: 220, ms: 160 }],
  coin: [{ freq: 988, ms: 50 }, { freq: 1319, ms: 110 }],
  levelup: [{ freq: 523, ms: 90 }, { freq: 659, ms: 90 }, { freq: 784, ms: 90 }, { freq: 1047, ms: 200 }],
  sleep: [{ freq: 440, ms: 120 }, { freq: 349, ms: 120 }, { freq: 262, ms: 220 }],
};

const RATE = 22050;

function synthWav(steps: ToneStep[]): string {
  const total = Math.ceil(steps.reduce((a, s) => a + s.ms, 0) / 1000 * RATE);
  const samples = new Int16Array(total);
  let offset = 0;
  for (const s of steps) {
    const n = Math.ceil(s.ms / 1000 * RATE);
    for (let i = 0; i < n && offset + i < total; i++) {
      const t = i / RATE;
      const env = Math.min(1, i / 100) * Math.min(1, (n - i) / (n * 0.4)); // attack + decay
      const raw = s.type === "sine"
        ? Math.sin(2 * Math.PI * s.freq * t)
        : Math.sign(Math.sin(2 * Math.PI * s.freq * t)) * 0.6;
      samples[offset + i] = Math.round(raw * env * 0.22 * 32767);
    }
    offset += n;
  }
  // WAV header
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE");
  str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, samples.length * 2, true);
  new Int16Array(buf, 44).set(samples);
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 8192) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return "data:audio/wav;base64," + btoa(bin);
}

const cache = new Map<SfxName, Howl>();
let muted = false;

export function sfx(name: SfxName) {
  if (muted) return;
  let h = cache.get(name);
  if (!h) {
    h = new Howl({ src: [synthWav(defs[name])], format: ["wav"], volume: 0.5 });
    cache.set(name, h);
  }
  h.play();
}

export function setMuted(m: boolean) { muted = m; }
export function isMuted() { return muted; }
