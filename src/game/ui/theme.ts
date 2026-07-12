import { PAL } from "@/game/gfx/palette";

/**
 * Rounded, easy-on-the-eyes JP font for ALL gameplay text.
 * No pixel font in the fallback chain — if the webfont is unavailable the
 * stack degrades to clean system JP sans fonts, never to DotGothic.
 */
export const FONT = '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Meiryo", system-ui, sans-serif';

export const COLOR = {
  text: PAL.uiText,
  dim: PAL.uiTextDim,
  accent: PAL.uiAccent,
  good: PAL.uiGood,
  bad: PAL.uiBad,
  kana: "#9ad0f0",
};

export function style(size: number, color: string = COLOR.text, extra: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {}) {
  return {
    fontFamily: FONT,
    fontSize: `${size}px`,
    color,
    resolution: 3,
    // subtle drop shadow so text stays readable over any background
    shadow: { offsetX: 1, offsetY: 1, color: "#100c18", blur: 0, stroke: false, fill: true },
    ...extra,
  } as Phaser.Types.GameObjects.Text.TextStyle;
}
