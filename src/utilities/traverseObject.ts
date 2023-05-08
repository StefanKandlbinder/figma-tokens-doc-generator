import { getNestedProperty } from './getNestedProperty';

export const traverseObject = (
  obj: any,
  keys: any = [],
  colors: any = [],
  tokens: any
) => {
  // Loop through all the keys in the object
  for (const key in obj) {
    // If the current value is an object, recursively call the function on it
    if (typeof obj[key] === 'object') {
      // Add the current key to the keys array and call the function recursively
      keys.push(key);
      traverseObject(obj[key], keys, colors, tokens);
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
