import { isArray, camelCase } from './utils';
import { infix_statement } from './statement';

function letToVar([cmd, ...vars], options) {
  const varPairs = [];
  for (let i = 0; i < vars.length; i += 2) {
    let name = vars[ i ];
    let val = vars[ i + 1 ];
    if (name && val) {
      if (isArray(val)) {
        val = toJsTree(val, { embedded: true });
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

function math_operator([operator, ...params], options) {
  const statements = params.map(param =>
    isArray(param) ?
      toJsTree(param, { embedded: true }) :
      param
  );

  return infix_statement({
    statements,
    separator: ` ${operator} `
  });
}

function define_function([operator, name, params, ...body], options) {
  if (isArray(name)) {
    body.unshift(params);
    params = name;
    name = "";
  }

  let statements = body.map(toJsTree);
  let final = statements.pop();
  statements = statements
    .map(s => s + ";")
    .join(' ');
  params = params.join(', ');

  return `(function ${name}(${params}) {${statements} return ${final};})`;
}

function define_module([operator, name, ...body], options) {
  const statements = body
    .map(toJsTree)
    .map(s => s + ";")
    .join(' ');

  return `module('${name}', function (require, export) {${statements}})`;
}

function module_require([operator, moduleName, reqTokens], options) {
  const statements = reqTokens.map(token =>
    `var ${token} = ${moduleName}['${token}']`);
  statements.unshift(`var ${moduleName} = require('${moduleName}')`);

  return statements
    .map(s => s + ';')
    .join(' ');
}

function module_export([operator, moduleName, statement], options) {
  return `export('${moduleName}', ${toJsTree(statement, { embedded: true })})`;
}

function function_call([fn, ...params], options) {
  const evaluated_params = params.map(p => toJsTree(p, { embedded: true }));

  return `${fn}( ${evaluated_params.join(', ')} )`;
}

export const toJsTree = function (arr, options = { }) {
  if (!isArray(arr)) {
    return arr;
  }

  switch(arr[0]) {
    case 'function': return define_function(arr, options);
    case 'module': return define_module(arr, options);
    case 'require': return module_require(arr, options);
    case 'export': return module_export(arr, options);
    case 'let': return letToVar(arr, options);
    case '+': return math_operator(arr, options);
    case '-': return math_operator(arr, options);
    case '*': return math_operator(arr, options);
    case '/': return math_operator(arr, options);
  }

  return function_call(arr, options);
};
