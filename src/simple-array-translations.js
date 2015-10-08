import { isArray } from './utils';

function letToVar(cmd, ...vars) {
  const varPairs = [];
  for (let i = 0; i < vars.length; i += 2) {
    let name = vars[i];
    let val = vars[i+1];
    if (name && val) {
      let statement = `${name} = ${val}`;
      varPairs.push(statement);
    }
  }

  if (varPairs.length < 1) {
    return '';
  }
  else {
    return `var ${varPairs.join(', ')};`;
  }
}

function addition(arr) {
  return `(${arr[1]} + ${arr[2]})`;
}

export const toJsString = function (arr) {
  if (!isArray(arr)) {
    return "";
  }

  switch(arr[0]) {
    case 'let': return letToVar(...arr);
    case '+': return addition(arr);
  }

  return "";
};
