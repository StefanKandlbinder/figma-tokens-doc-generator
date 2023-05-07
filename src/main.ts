import { Buffer } from "buffer";
import { on, once, emit, showUI } from "@create-figma-plugin/utilities";
import { useCallback, useState } from "preact/hooks";
import {
  CloseHandler,
  GetTokensFromGit,
  SetLoading,
  CreateColorComponent,
} from "./types";
import { ColorComponent } from "./figma-components/colorComponent";
import { ColorClassComponent } from "./figma-components/ColorClassComponent";

let tokens: any = {};
export default function () {
  on<GetTokensFromGit>(
    "GET_TOKENS_FROM_GIT",
    async function (owner, repo, path) {
      const data = await getTokensFromGit(owner, repo, path);
      tokens = data;

      const globalColors = traverseObject(tokens["c-avatar"].avatar.color);
      // const globalColors = traverseObject(tokens.global.colors);
      // createColors(globalColors);
      // const component = ColorComponent(globalColors, tokens);
      const colorComponent = new ColorClassComponent(globalColors, tokens);
      colorComponent.initComponent();
      colorComponent.initColorRow();
      colorComponent.createHeader();
      colorComponent.addColors();
    }
  );

  on<CreateColorComponent>("CREATE_COLOR_COMPONENT", function () {
    // Define some sample text data
    // Create a component using the sample data and color
    // const component = ColorComponent(sampleTexts, sampleCircleColor);
  });

  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  showUI({
    height: 480,
    width: 360,
  });
}

const traverseObject = (obj: any, keys: any = [], colors: any = []) => {
  // Loop through all the keys in the object
  for (const key in obj) {
    // If the current value is an object, recursively call the function on it
    if (typeof obj[key] === "object") {
      // Add the current key to the keys array and call the function recursively
      keys.push(key);
      traverseObject(obj[key], keys, colors);
      // Remove the current key from the keys array to backtrack
      keys.pop();
    } else if (key === "type" && obj[key] === "color") {
      // If the current key is "type" and the value is "COLOR", add the color to the colors array
      let value: string = obj.value;
      if (value.includes("{")) {
        colors.push({
          name: ["colors", ...keys].join("."),
          value: getNestedProperty(
            tokens.global,
            value.replace("{", "").replace("}", "")
          ).value,
          rawValue: obj.value,
        });
      } else {
        colors.push({
          name: ["colors", ...keys].join("."),
          value: obj.value,
          rawValue: obj.value,
        });
      }
    }
  }
  return colors;
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
    emit("SET_LOADING", false);
  }

  return getFileBlob(owner, repo, fileSHA);
};

const getFileBlob = async (owner: string, repo: string, fileSHA: any) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/blobs/${fileSHA}`
    );
    const data = await response.json();

    emit("SET_LOADING", false);

    let fileBlob = data.content;
    return convertBlob(fileBlob);
  } catch (error) {
    console.log(error);
    emit("SET_LOADING", false);
  }
};

const convertBlob = async (blob: any) => {
  // console.log(blob)
  try {
    const fileContents = Buffer.from(blob, "base64").toString();
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
  text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

  frame.appendChild(text);
};

const getNestedProperty = (obj: any, keys: any) => {
  return keys.split(".").reduce((acc: any, key: any) => acc && acc[key], obj);
};

const convertHexToRGB = (hexCode: string, tokens: any) => {
  let hex = hexCode.replace("#", "");

  if (hexCode.includes("{")) {
    let token = hexCode.substring(1, hexCode.length - 1);
    hex = getNestedProperty(tokens.global, token).value;
    hex = hex.replace("#", "");

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
