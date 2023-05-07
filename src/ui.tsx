import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  TextboxNumeric,
  Textbox,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

import {
  CloseHandler,
  GetTokensFromGit,
  SetLoading,
  CreateColorComponent,
} from "./types";

function Plugin() {
  const [isLoading, setLoading] = useState(false);
  const [ownerString, setOwnerString] = useState("StefanKandlbinder");
  const [repoString, setRepoString] = useState("figma-tokens-doc-generator");
  const [pathString, setPathString] = useState("tokens.json");

  on<SetLoading>("SET_LOADING", function (loading: boolean) {
    setLoading(loading);
  });

  const handleGetTokensFromGit = useCallback(
    function () {
      if (ownerString !== null && repoString !== null && pathString !== null) {
        setLoading(true);
        emit<GetTokensFromGit>(
          "GET_TOKENS_FROM_GIT",
          ownerString,
          repoString,
          pathString
        );
      }
    },
    [ownerString, repoString, pathString]
  );

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  const handleCreateColorComponent = useCallback(function () {
    emit<CreateColorComponent>("CREATE_COLOR_COMPONENT");
  }, []);

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>
        <Muted>Owner</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        onValueInput={setOwnerString}
        value={ownerString}
        variant="border"
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>Repo</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        onValueInput={setRepoString}
        value={repoString}
        variant="border"
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>Path</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        onValueInput={setPathString}
        value={pathString}
        variant="border"
      />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button
          fullWidth
          loading={isLoading ? true : undefined}
          onClick={handleGetTokensFromGit}
        >
          Get Tokens from Git
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleCreateColorComponent}>
          Create Color Component
        </Button>
      </Columns>
    </Container>
  );
}

export default render(Plugin);
