export function token_macros(token, options) {
  switch (token) {
    case 'nil': return 'null';
    case 't': return 'true';
    case 'f': return 'false';
    default: return token;
  }
}

export function list_macros(arr, options) {

  return arr;
}
