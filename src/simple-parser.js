import { isWhitespaceChar, isSymbolChar } from './utils';


function _parse_list(state) {
  state.position++; // (
  const list = [];
  while (state.input[state.position] !== ')') {
    list.push(_parse(state));
  }
  state.position++; // )
  return list;
}

function _parse_string(state) {
  const token = state.input[state.position];
  state.position++; // move past opening token
  let str = "";

  while (state.input[state.position] !== token) {
    str += state.input[state.position];
    state.position++;
  }

  state.position++; // move past closing token
  return token + str + token;
}

function _parse_symbol(state) {
  let symbol = "";
  while (isSymbolChar(state.input[state.position])) {
    symbol += state.input[state.position];
    state.position++;
  }
  return symbol;
}

function _parse(state) {
  while (isWhitespaceChar(state.input[state.position])) {
    state.position++;
  }
  const ch = state.input[state.position];

  if (ch === '(') {
    return _parse_list(state);
  }

  if (ch === '"' || ch === "'") {
    return _parse_string(state);
  }

  return _parse_symbol(state);
}

export function parse(input = "()") {
  return _parse({
    input,
    position: 0
  });
}
