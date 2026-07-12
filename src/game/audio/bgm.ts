import { Howl } from "howler";

/**
 * Ambient background audio, fully synthesized (no files):
 * - a quiet pentatonic music-box arpeggio loop
 * - a filtered-noise rain loop layered on rainy days
 * Swap for real tracks later by replacing the Howl sources.
 */

const RATE = 22050;

function encodeWav(samples: Float32Array): string {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    pcm[i] = Math.max(-1, Math.min(1, samples[i])) * 32767;
  }
  const buf = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); str(8, "WAVE");
  str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, pcm.length * 2, true);
  new Int16Array(buf, 44).set(pcm);
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return "data:audio/wav;base64," + btoa(bin);
}

/** Gentle music-box arpeggio over a pentatonic scale, 16 notes → seamless loop. */
function synthMelody(): string {
  const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C pentatonic-ish
  const pattern = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 5, 7, 5, 4, 2, 1];
  const noteLen = 0.42;
  const total = Math.floor(pattern.length * noteLen * RATE);
  const out = new Float32Array(total);
  pattern.forEach((deg, n) => {
    const f = scale[deg];
    const start = Math.floor(n * noteLen * RATE);
    const dur = Math.floor(noteLen * 1.9 * RATE); // notes overlap, music-box style
    for (let i = 0; i < dur && start + i < total; i++) {
      const t = i / RATE;
      const env = Math.exp(-3.2 * t);
      const s = Math.sin(2 * Math.PI * f * t) * 0.5 + Math.sin(2 * Math.PI * f * 2 * t) * 0.12;
      out[start + i] += s * env * 0.16;
    }
  });
  return encodeWav(out);
}

/** Soft rain: smoothed white noise, 2s loop. */
function synthRain(): string {
  const total = RATE * 2;
  const out = new Float32Array(total);
  let last = 0;
  for (let i = 0; i < total; i++) {
    const white = Math.random() * 2 - 1;
    last = last * 0.92 + white * 0.08; // crude low-pass
    out[i] = last * 0.5;
  }
  // crossfade the loop point
  const fade = Math.floor(RATE * 0.05);
  for (let i = 0; i < fade; i++) {
    const k = i / fade;
    out[i] = out[i] * k + out[total - fade + i] * (1 - k);
  }
  return encodeWav(out);
}

let melody: Howl | undefined;
let rain: Howl | undefined;

export function startBgm() {
  if (!melody) {
    melody = new Howl({ src: [synthMelody()], format: ["wav"], loop: true, volume: 0.14 });
  }
  if (!melody.playing()) melody.play();
}

export function setRainAmbience(on: boolean) {
  if (on) {
    if (!rain) rain = new Howl({ src: [synthRain()], format: ["wav"], loop: true, volume: 0.12 });
    if (!rain.playing()) rain.play();
  } else {
    rain?.stop();
  }
}

export function stopBgm() {
  melody?.stop();
  rain?.stop();
}
