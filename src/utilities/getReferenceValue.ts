export const getReferenceValue = (hexCode: string, tokens: any) => {
  let referenceToken = hexCode.substring(1, hexCode.length - 1);
  return getNestedProperty(tokens, referenceToken).value.replace("#", "");
};

const getNestedProperty = (obj: any, keys: any) => {
  return keys.split(".").reduce((acc: any, key: any) => acc && acc[key], obj);
};
