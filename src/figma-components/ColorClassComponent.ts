import { convertHexToRGB } from "../utilities/convertHEXToRGB";

// Define a class that creates a figma component with a circle and four text fields
export class ColorClassComponent {
  // Define the properties of the class
  colors: any;
  tokens: any;
  textColor: RGB;
  nodes: SceneNode[];
  component: FrameNode;
  // componentInstance: InstanceNode;
  colorRow: ComponentNode;
  rows: FrameNode[];

  // Define the constructor of the class
  constructor(colors: any, tokens: any) {
    this.colors = colors;
    this.tokens = tokens;
    this.textColor = { r: 0, g: 0, b: 0 };
    this.nodes = [];
    this.component = figma.createFrame();
    // this.componentInstance = this.component.createInstance();
    this.colorRow = figma.createComponent();
    this.rows = [];
  }

  initComponent() {
    this.component.name = "Color Component";
    this.component.layoutMode = "VERTICAL";
    this.component.resize(600, 200);
    this.component.counterAxisSizingMode = "AUTO";
    this.component.counterAxisAlignItems = "MIN";
    this.component.primaryAxisSizingMode = "AUTO";
    this.component.layoutAlign = "STRETCH";
    this.component.layoutGrow = 1;
    this.component.fills = [];
  }

  initColorRow() {
    this.colorRow.name = "Color Row";
    this.colorRow.resizeWithoutConstraints(
      this.component.width,
      this.colorRow.height
    );
    this.colorRow.layoutMode = "HORIZONTAL";
    this.colorRow.counterAxisSizingMode = "AUTO";
    this.colorRow.counterAxisAlignItems = "CENTER";
    this.colorRow.primaryAxisSizingMode = "FIXED";
    this.colorRow.layoutAlign = "STRETCH";
    this.colorRow.itemSpacing = 16;
    this.colorRow.fills = [];

    const layoutGrid: LayoutGrid = {
      visible: false,
      pattern: "COLUMNS",
      gutterSize: 16,
      alignment: "STRETCH",
      offset: 0,
      count: 5,
    };

    this.colorRow.layoutGrids = [layoutGrid];
  }

  addRow(): FrameNode {
    const row = figma.createFrame();
    // frame.resize(component.width, frame.height);
    row.resizeWithoutConstraints(this.component.width, row.height);
    row.layoutMode = "HORIZONTAL";
    row.counterAxisSizingMode = "AUTO";
    row.counterAxisAlignItems = "CENTER";
    row.primaryAxisSizingMode = "FIXED";
    row.layoutAlign = "STRETCH";
    row.itemSpacing = 16;
    row.fills = [];

    const layoutGrid: LayoutGrid = {
      visible: false,
      pattern: "COLUMNS",
      gutterSize: 16,
      alignment: "STRETCH",
      offset: 0,
      count: 5,
    };

    row.layoutGrids = [layoutGrid];

    return row;
  }

  createHeader() {
    const row = this.addRow();
    row.name = "Header";

    this.createText("Color", row);
    this.createText("Name", row);
    this.createText("Description", row);
    this.createText("Value", row);
    this.createText("Raw Value", row);

    this.component.appendChild(row);
  }

  // Define a method that creates the component
  addColors() {
    for (let i = 0; i < this.colors.length; i++) {
      const row = this.addRow();

      const klecks = figma.createRectangle();
      klecks.constraints = { horizontal: "MIN", vertical: "MIN" };

      this.createText(this.colors[i].name, row);
      this.createText("blabla", row);
      this.createText(this.colors[i].value, row);
      this.createText(this.colors[i].rawValue, row);

      klecks.resize(16, 16);
      klecks.layoutGrow = 1;
      klecks.cornerRadius = 8;
      const fill = convertHexToRGB(this.colors[i].value, this.tokens);
      klecks.fills = [{ type: "SOLID", color: fill }];

      row.name = this.colors[i].name;
      row.appendChild(klecks);

      this.component.appendChild(row);

      //this.component.appendChild(row);
    }
  }

  // Define a method that creates a text node
  async createText(content: string, frame: FrameNode | InstanceNode) {
    const text = figma.createText();
    text.layoutGrow = 1;

    // Load the font in the text node before setting the characters
    await figma.loadFontAsync(text.fontName as FontName);
    text.characters = content;

    text.fontSize = 16;
    text.fills = [{ type: "SOLID", color: this.textColor }];

    frame.appendChild(text);
  }
}
