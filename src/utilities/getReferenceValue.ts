import { getNestedProperty } from './getNestedProperty';

export const getReferenceValue = (hexCode: string, tokens: any) => {
  let referenceToken = hexCode.substring(1, hexCode.length - 1);
  return getNestedProperty(tokens, referenceToken).value.replace('#', '');
};
