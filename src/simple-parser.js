import { isWhitespaceChar } from './utils';

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
  state.position++;
  let str = "";

  while (state.input[state.position] !== token) {
    str += state.input[state.position];
    state.position++;
  }

  return token + str + token;
}

function _parse_symbol(state) {

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

export function parse(input) {
  return _parse({
    input,
    position: 0
  });
}
