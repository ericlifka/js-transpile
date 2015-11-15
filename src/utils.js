export const isArray = arr =>
  typeof arr === 'object' &&
  typeof arr.length === 'number';

export const isWhitespaceChar = char =>
  /\s/.test(char);

export const isSymbolChar = char =>
  /[A-Za-z0-9_\-\$+\/*\.]/.test(char);


const capitalize = str =>
  str.charAt(0).toUpperCase() +
  str.slice(1);

export const camelCase = str => {
  const [ first, ...rest ] = str.split('-');
  return first + rest.map(capitalize).join('');
};

export function merge(...objs) {
  let newObj = { };
  objs.forEach(ob => Object.keys(ob).forEach(key => {
    newObj[key] = ob[key];
  }));
  return newObj;
}
