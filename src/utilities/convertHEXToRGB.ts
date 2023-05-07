import { getReferenceValue } from "./getReferenceValue";

export const convertHexToRGB = (hexCode: string, tokens: any) => {
  let hex = hexCode.replace("#", "");

  if (hexCode.includes("{")) {
    hex = getReferenceValue(hexCode, tokens.global);
  }

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  let rgb = { r, g, b };

  return rgb;
};
