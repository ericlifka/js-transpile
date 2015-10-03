function letToVar(arr) {
  return `var ${arr[1]} = ${arr[2]};`;
}

function addition(arr) {
  return `${arr[1]} + ${arr[2]};`;
}

export const toJsString = function (arr) {
  if (typeof arr !== 'object' || typeof arr.length !== 'number') {
    return "";
  }

  switch(arr[0]) {
    case 'let': return letToVar(arr);
    case '+': return addition(arr);
  }

  return "";
};
