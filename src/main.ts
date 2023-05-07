import { Buffer } from 'buffer';
import { on, once, emit, showUI } from '@create-figma-plugin/utilities';
import { useCallback, useState } from 'preact/hooks';
import { CloseHandler, GetTokensFromGit, SetLoading } from './types';

let tokens: any = {};
export default function () {
  on<GetTokensFromGit>(
    'GET_TOKENS_FROM_GIT',
    async function (owner, repo, path) {
      const data = await getTokensFromGit(owner, repo, path);
      tokens = data;

      //const globalColors = traverseObject(tokens['c-avatar'].avatar.color);
      const globalColors = traverseObject(tokens.global.colors);
      createColors(globalColors);
    }
  );

  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin();
  });

  showUI({
    height: 300,
    width: 360,
  });
}

const traverseObject = (obj: any, keys: any = [], colors: any = []) => {
  // Loop through all the keys in the object
  for (const key in obj) {
    // If the current value is an object, recursively call the function on it
    if (typeof obj[key] === 'object') {
      // Add the current key to the keys array and call the function recursively
      keys.push(key);
      traverseObject(obj[key], keys, colors);
      // Remove the current key from the keys array to backtrack
      keys.pop();
    } else if (key === 'type' && obj[key] === 'color') {
      // If the current key is "type" and the value is "COLOR", add the color to the colors array
      let value: string = obj.value;
      if (value.includes('{')) {
        colors.push({
          name: ['colors', ...keys].join('.'),
          value: getNestedProperty(
            tokens.global,
            value.replace('{', '').replace('}', '')
          ).value,
          rawValue: obj.value,
        });
      } else {
        colors.push({
          name: ['colors', ...keys].join('.'),
          value: obj.value,
          rawValue: obj.value,
        });
      }
    }
  }
  return colors;
};

const createColors = (colors: any) => {
  const nodes: SceneNode[] = [];
  const outer = figma.createFrame();
  outer.layoutMode = 'VERTICAL';
  outer.resize(600, 200);
  outer.counterAxisSizingMode = 'AUTO';
  outer.counterAxisAlignItems = 'MIN';
  outer.primaryAxisSizingMode = 'AUTO';
  outer.layoutAlign = 'STRETCH';
  outer.layoutGrow = 1;
  outer.fills = [];

  const frame = figma.createFrame();
  // frame.resize(outer.width, frame.height);
  frame.resizeWithoutConstraints(outer.width, frame.height);
  frame.layoutMode = 'HORIZONTAL';
  frame.counterAxisSizingMode = 'AUTO';
  frame.counterAxisAlignItems = 'CENTER';
  frame.primaryAxisSizingMode = 'FIXED';
  frame.layoutAlign = 'STRETCH';
  frame.itemSpacing = 16;
  frame.fills = [];

  const layoutGrid: LayoutGrid = {
    visible: false,
    pattern: 'COLUMNS',
    gutterSize: 16,
    alignment: 'STRETCH',
    offset: 0,
    count: 5,
  };

  frame.layoutGrids = [layoutGrid];

  const color = createText('Color', frame);
  const name = createText('Name', frame);
  const description = createText('Description', frame);
  const value = createText('Value', frame);
  const rawValue = createText('Raw Value', frame);

  outer.appendChild(frame);

  for (let i = 0; i < colors.length; i++) {
    const frame = figma.createFrame();
    // frame.resize(outer.width, frame.height);
    frame.resizeWithoutConstraints(outer.width, frame.height);
    frame.layoutMode = 'HORIZONTAL';
    frame.counterAxisSizingMode = 'AUTO';
    frame.counterAxisAlignItems = 'CENTER';
    frame.primaryAxisSizingMode = 'FIXED';
    frame.layoutAlign = 'STRETCH';
    frame.itemSpacing = 16;
    frame.fills = [];

    const layoutGrid: LayoutGrid = {
      visible: false,
      pattern: 'COLUMNS',
      gutterSize: 16,
      alignment: 'STRETCH',
      offset: 0,
      count: 5,
    };

    frame.layoutGrids = [layoutGrid];

    const klecks = figma.createRectangle();
    klecks.constraints = { horizontal: 'MIN', vertical: 'MIN' };

    const name = createText(colors[i].name, frame);
    const description = createText('blabla', frame);
    const value = createText(colors[i].value, frame);
    const rawValue = createText(colors[i].rawValue, frame);

    klecks.resize(16, 16);
    klecks.layoutGrow = 1;
    klecks.cornerRadius = 8;
    const fill = convertHexToRGB(colors[i].value, tokens);
    klecks.fills = [{ type: 'SOLID', color: fill }];

    frame.name = colors[i].name;
    frame.appendChild(klecks);
    outer.appendChild(frame);
  }

  figma.currentPage.appendChild(outer);
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
};

const getTokensFromGit = async (owner: string, repo: string, path: string) => {
  let fileSHA;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );
    const data = await response.json();

    fileSHA = data.sha;
  } catch (error) {
    console.log(error);
    emit('SET_LOADING', false);
  }

  return getFileBlob(owner, repo, fileSHA);
};

const getFileBlob = async (owner: string, repo: string, fileSHA: any) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/blobs/${fileSHA}`
    );
    const data = await response.json();

    emit('SET_LOADING', false);

    let fileBlob = data.content;
    return convertBlob(fileBlob);
  } catch (error) {
    console.log(error);
    emit('SET_LOADING', false);
  }
};

const convertBlob = async (blob: any) => {
  // console.log(blob)
  try {
    const fileContents = Buffer.from(blob, 'base64').toString();
    const jsonData = JSON.parse(fileContents);
    return jsonData;
    // return traverseObject(jsonData.global.colors);
    // createColors(colors);
  } catch (error) {
    console.log(error);
  }
};

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
