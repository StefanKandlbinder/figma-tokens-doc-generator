import { convertHexToRGB } from "../utilities/convertHEXToRGB";

// Define a function that creates a figma component with a circle and four text fields
export const ColorComponent = async (colors: any, tokens: any) => {
  const textColor: RGB = { r: 0, g: 0, b: 0 };
  const nodes: SceneNode[] = [];

  const component = figma.createComponent();
  component.name = "Color Component";
  component.layoutMode = "VERTICAL";
  component.resize(600, 200);
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "MIN";
  component.primaryAxisSizingMode = "AUTO";
  component.layoutAlign = "STRETCH";
  component.layoutGrow = 1;
  component.fills = [];

  const frame = figma.createFrame();
  // frame.resize(component.width, frame.height);
  frame.resizeWithoutConstraints(component.width, frame.height);
  frame.layoutMode = "HORIZONTAL";
  frame.counterAxisSizingMode = "AUTO";
  frame.counterAxisAlignItems = "CENTER";
  frame.primaryAxisSizingMode = "FIXED";
  frame.layoutAlign = "STRETCH";
  frame.itemSpacing = 16;
  frame.fills = [];

  const layoutGrid: LayoutGrid = {
    visible: false,
    pattern: "COLUMNS",
    gutterSize: 16,
    alignment: "STRETCH",
    offset: 0,
    count: 5,
  };

  frame.layoutGrids = [layoutGrid];

  /* HEADER */
  const color = createText("Color", textColor, frame);
  const name = createText("Name", textColor, frame);
  const description = createText("Description", textColor, frame);
  const value = createText("Value", textColor, frame);
  const rawValue = createText("Raw Value", textColor, frame);

  component.appendChild(frame);

  for (let i = 0; i < colors.length; i++) {
    const frame = figma.createFrame();
    // frame.resize(component.width, frame.height);
    frame.resizeWithoutConstraints(component.width, frame.height);
    frame.layoutMode = "HORIZONTAL";
    frame.counterAxisSizingMode = "AUTO";
    frame.counterAxisAlignItems = "CENTER";
    frame.primaryAxisSizingMode = "FIXED";
    frame.layoutAlign = "STRETCH";
    frame.itemSpacing = 16;
    frame.fills = [];

    const layoutGrid: LayoutGrid = {
      visible: false,
      pattern: "COLUMNS",
      gutterSize: 16,
      alignment: "STRETCH",
      offset: 0,
      count: 5,
    };

    frame.layoutGrids = [layoutGrid];

    const klecks = figma.createRectangle();
    klecks.constraints = { horizontal: "MIN", vertical: "MIN" };

    const name = createText(colors[i].name, textColor, frame);
    const description = createText("blabla", textColor, frame);
    const value = createText(colors[i].value, textColor, frame);
    const rawValue = createText(colors[i].rawValue, textColor, frame);

    klecks.resize(16, 16);
    klecks.layoutGrow = 1;
    klecks.cornerRadius = 8;
    const fill = convertHexToRGB(colors[i].value, tokens);
    klecks.fills = [{ type: "SOLID", color: fill }];

    frame.name = colors[i].name;
    frame.appendChild(klecks);
    component.appendChild(frame);
  }

  figma.currentPage.appendChild(component);
  // figma.currentPage.selection = nodes;
  // figma.viewport.scrollAndZoomIntoView(nodes);
};

const createText = async (content: string, color: RGB, frame: FrameNode) => {
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
  text.fills = [{ type: "SOLID", color: color }];

  frame.appendChild(text);
};
