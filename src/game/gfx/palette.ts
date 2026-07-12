/** Shared pixel-art palette — warm GBA-inspired tones. */
export const PAL = {
  // nature
  grass: "#6ab04c", grassDark: "#5a9a3e", grassLight: "#7cc35c",
  water: "#4a90d9", waterDark: "#3a7bc0", waterLight: "#6aa8e8",
  trunk: "#7a5230", leaf: "#3d7a2e", leafLight: "#4f9440",
  sakura: "#f2a7c3", sakuraLight: "#f7c5d8",
  flowerRed: "#e05555", flowerYellow: "#f0c040",
  path: "#c9b088", pathDark: "#b89c74",

  // urban
  road: "#5a5a66", roadLine: "#d8d8cc", sidewalk: "#a8a49a", sidewalkDark: "#948f84",
  wall: "#e8ddc8", wallDark: "#cfc2a8", wallShadow: "#a89a80",
  roofRed: "#c05a4a", roofRedDark: "#a04638", roofBlue: "#5a7aa8", roofBlueDark: "#48628a",
  roofGray: "#8a8a92", roofGrayDark: "#70707a",
  window: "#9ac8e8", windowDark: "#6aa0c8", doorWood: "#8a5a34", doorDark: "#6e4626",

  // interiors
  floorWood: "#c8965a", floorWoodDark: "#b0824a", tatami: "#b8c078", tatamiDark: "#a0a866",
  floorTile: "#d8d4cc", floorTileDark: "#c4c0b6", carpet: "#7a9ac8",
  wallIn: "#e8e0d0", wallInDark: "#d0c6b0",
  counter: "#b87848", counterDark: "#9c6238", shelf: "#a06a3c",
  metal: "#b8bcc4", metalDark: "#989ca6",

  // characters
  skin: "#f0c8a0", skinDark: "#d8a878",
  outline: "#3a3040",

  // ui
  uiBg: "#2a2138", uiBgLight: "#3a2f4c", uiBorder: "#8a7a5c", uiBorderLight: "#c8b888",
  uiText: "#f0e8d8", uiTextDim: "#a89e8c", uiAccent: "#f0c040", uiGood: "#7cc35c", uiBad: "#e05555",
} as const;
