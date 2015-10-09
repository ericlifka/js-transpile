export const isArray = arr =>
  typeof arr === 'object' &&
  typeof arr.length === 'number';

export const isWhitespaceChar = char =>
  /\s/.test(char);

export const isSymbolChar = char =>
  /[A-Za-z0-9_\-\$+\/*\.]/.test(char);
