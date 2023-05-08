export const getNestedProperty = (obj: any, keys: any) => {
  return keys.split('.').reduce((acc: any, key: any) => acc && acc[key], obj);
};
