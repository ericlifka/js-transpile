import { isArray } from './utils';

function letToVar(cmd, ...vars) {
  const varPairs = [];
  for (let i = 0; i < vars.length; i += 2) {
    let name = vars[i];
    let val = vars[i+1];
    if (name && val) {
      if (isArray(val)) {
        val = toJsString(val);
      }

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

function math_operator(operator, ...params) {
  const separator = ` ${operator} `;
  const statements = [];
  for (let i = 0; i < params.length; i++) {
    let statement = params[i];
    if (isArray(statement)) {
      statement = toJsString(statement);
    }
    statements.push(statement);
  }
  return `(${statements.join(separator)})`;
}

function define_function(operator, name, params, ...body) {
  if (isArray(name)) {
    body.unshift(params);
    params = name;
    name = "";
  }

  let statements = body.map(statement => toJsString(statement));
  let final = statements.pop();
  statements.push('');

  return `(function ${name}(${params.join(' ')}) {${statements.join('; ')} return ${final};})`;
}

export const toJsString = function (arr) {
  if (!isArray(arr)) {
    return arr;
  }

  switch(arr[0]) {
    case 'function': return define_function(...arr);
    case 'let': return letToVar(...arr);
    case '+': return math_operator(...arr);
    case '-': return math_operator(...arr);
    case '*': return math_operator(...arr);
    case '/': return math_operator(...arr);
  }

  return "";
};
