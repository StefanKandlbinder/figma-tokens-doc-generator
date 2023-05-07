import { EventHandler } from '@create-figma-plugin/utilities';

export interface GetTokensFromGit extends EventHandler {
  name: 'GET_TOKENS_FROM_GIT';
  handler: (owner: string, repo: string, path: string) => void;
}

export interface SetLoading extends EventHandler {
  name: 'SET_LOADING';
  handler: (loading: boolean) => void;
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE';
  handler: () => void;
}
