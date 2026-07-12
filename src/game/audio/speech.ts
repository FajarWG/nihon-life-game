/** Japanese text-to-speech for listening practice. Works offline on most OS voices. */
export function speakJapanese(text: string, rate = 0.9) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const ja = voices.find(v => v.lang.startsWith("ja"));
  if (ja) u.voice = ja;
  window.speechSynthesis.speak(u);
}
