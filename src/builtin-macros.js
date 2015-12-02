export function token_macros(token, options) {
  switch (token) {
    case 'nil': return 'null';
    case 't': return 'true';
    case 'f': return 'false';
    default: return token;
  }
}

export function list_macros(arr, options) {
  switch(arr[0]) {
    case 'print': return print_macro(arr, options);
    default: return arr;
  }
}

function print_macro([fn, ...args], options) {
  return ['console.log', ...args];
}
