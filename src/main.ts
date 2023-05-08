import { emit, showUI } from '@create-figma-plugin/utilities';

let tokens: any = {};
export default function () {
  showUI({
    height: 360,
    width: 360,
  });

  tokens = figma.root.getSharedPluginData('tokens', 'values');
  emit('GET_SHARED_PLUGIN_DATA', tokens);
}

const createText = async (content: string, frame: FrameNode) => {
  const text = figma.createText();
  // text.constraints = { horizontal: 'MIN', vertical: 'MIN' };
  text.layoutGrow = 1;

  // Move to (50, 50)
  // text.x = 24;
  // text.y = 50;

  // Load the font in the text node before setting the characters
  await figma.loadFontAsync(text.fontName as FontName);
  text.characters = content;

  text.fontSize = 16;
  text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];

  frame.appendChild(text);
};

const getNestedProperty = (obj: any, keys: any) => {
  return keys.split('.').reduce((acc: any, key: any) => acc && acc[key], obj);
};

const convertHexToRGB = (hexCode: string, tokens: any) => {
  let hex = hexCode.replace('#', '');

  if (hexCode.includes('{')) {
    let token = hexCode.substring(1, hexCode.length - 1);
    hex = getNestedProperty(tokens.global, token).value;
    hex = hex.replace('#', '');

    console.log(token, getNestedProperty(tokens.global, token));
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
