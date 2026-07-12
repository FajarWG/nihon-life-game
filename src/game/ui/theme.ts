import { PAL } from "@/game/gfx/palette";

/**
 * Rounded, easy-on-the-eyes JP font for gameplay text (loaded in the layout).
 * DotGothic16 stays as a decorative fallback for the pixel identity.
 */
export const FONT = '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "DotGothic16", "Hiragino Sans", "Yu Gothic UI", system-ui, sans-serif';

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
