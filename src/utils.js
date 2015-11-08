export const isArray = arr =>
  typeof arr === 'object' &&
  typeof arr.length === 'number';

export const isWhitespaceChar = char =>
  /\s/.test(char);

export const isSymbolChar = char =>
  /[A-Za-z0-9_\-\$+\/*\.]/.test(char);


export const camelCase = str => {
  const [ first, ...rest ] = str.split('-');
  return first + rest.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
};
