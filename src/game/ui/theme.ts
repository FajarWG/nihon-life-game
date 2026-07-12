import { PAL } from "@/game/gfx/palette";

/** Pixel-friendly font stack; DotGothic16 is loaded in the page layout. */
export const FONT = '"DotGothic16", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic UI", system-ui, sans-serif';

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
