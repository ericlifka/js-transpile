import { isArray, camelCase } from './utils';

function letToVar(cmd, ...vars) {
  const varPairs = [];
  for (let i = 0; i < vars.length; i += 2) {
    let name = vars[ i ];
    let val = vars[ i + 1 ];
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
    let statement = params[ i ];
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

  let statements = body.map(toJsString);
  let final = statements.pop();
  statements = statements
    .map(s => s + ";")
    .join(' ');
  params = params.join(', ');

  return `(function ${name}(${params}) {${statements} return ${final};})`;
}

function define_module(operator, name, ...body) {
  const statements = body
    .map(toJsString)
    .map(s => s + ";")
    .join(' ');

  return `module('${name}', function (require, export) {${statements}})`;
}

function module_require(operator, moduleName, reqTokens) {
  const statements = reqTokens.map(token =>
    `var ${token} = ${moduleName}['${token}']`);
  statements.unshift(`var ${moduleName} = require('${moduleName}')`);

  return statements
    .map(s => s + ';')
    .join(' ');
}

function module_export(operator, moduleName, statement) {
  return `export('${moduleName}', ${toJsString(statement)})`;
}

function function_call(fn, ...params) {
  const evaluated_params = params.map(p => toJsString(p));

  return `${fn}( ${evaluated_params.join(', ')} )`;
}

export const toJsString = function (arr) {
  if (!isArray(arr)) {
    return arr;
  }

  switch(arr[0]) {
    case 'function': return define_function(...arr);
    case 'module': return define_module(...arr);
    case 'require': return module_require(...arr);
    case 'export': return module_export(...arr);
    case 'let': return letToVar(...arr);
    case '+': return math_operator(...arr);
    case '-': return math_operator(...arr);
    case '*': return math_operator(...arr);
    case '/': return math_operator(...arr);
  }

  return function_call(...arr);
};
