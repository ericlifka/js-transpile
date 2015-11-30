export default function (arr, options) {
  switch (arr) {
    case 'nil': return 'null';
    case 't': return 'true';
    case 'f': return 'false';
    default: break;
  }

  return arr;
}
