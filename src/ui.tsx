import {
  Container,
  render,
  VerticalSpace,
  LoadingIndicator,
  Dropdown,
  DropdownOption,
  Checkbox,
  Text
} from "@create-figma-plugin/ui";
import { on } from "@create-figma-plugin/utilities";
import { Fragment, JSX, h } from "preact";
import { useState } from "preact/hooks";

import { keys, crush, get, pick } from 'radash'

import { GetSharedPluginDataHandler } from "./types";
import { traverseObject } from "./utilities/traverseObject";
import { ColorClassComponent } from "./figma-components/ColorClassComponent";

function Plugin() {
  const [isLoading, setLoading] = useState(true);
  const [value, setValue] = useState<null | string>(null)
  const [options, setOptions] = useState<Array<DropdownOption>>([
    { value: 'foo' }
  ])
  const [tokens, setTokens] = useState<any>({})

  on<GetSharedPluginDataHandler>("GET_SHARED_PLUGIN_DATA", function (tokens:string) {
    const tokensCollection = Object.keys(JSON.parse(tokens));
    const tokensOptions = tokensCollection.map((token) => {
      return {value: token}
    })

    setTokens(JSON.parse(tokens))
    setOptions(tokensOptions)
    setLoading(false)
  });

  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    setValue(newValue)

    console.log(console.log(tokens[newValue]))

      // const globalColors = traverseObject(tokens['c-avatar'].avatar.color);
      // const globalColors = traverseObject(tokens.global.colors);
      // createColors(globalColors);
      // const component = ColorComponent(globalColors, tokens);
      // const colorComponent = new ColorClassComponent(globalColors, tokens);
      // colorComponent.initComponent();
      // colorComponent.initColorRow();
      // colorComponent.createHeader();
      // colorComponent.addColors();
  }

  return (
    <Container space="medium">
      {isLoading ? <LoadingIndicator/> : null}
      <Fragment>
      <VerticalSpace space="small" />
      <Dropdown
        onChange={handleChange}
        options={options}
        placeholder="choose a tokens set"
        value={value}
      />
      </Fragment>
    </Container>
  );
}

export default render(Plugin);
