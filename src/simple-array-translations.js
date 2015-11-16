import { isArray, camelCase } from './utils';
import {
  empty_statement,
  infix_statement,
  multi_line_statement,
  token_statement
} from './statement';

function letToVar([cmd, ...vars], options) {
  const varPairs = [];
  for (let i = 0; i < vars.length; i += 2) {
    let name = vars[ i ];
    let val = vars[ i + 1 ];

    if (name && val) {
      varPairs.push(infix_statement({
        statements: [ token_statement(`var ${name}`), toJsTree(val, { embedded: true }) ],
        separator: ' = ',
        terminate: true
      }));
    }
  }

  if (varPairs.length < 1) {
    return empty_statement();
  }
  else {
    return multi_line_statement(merge(options, {
      statements: varPairs
    }));
  }
}

function math_operator([operator, ...params], options) {
  return infix_statement(merge(options, {
    statements: params.map(param => toJsTree(param, { embedded: true })),
    separator: ` ${operator} `
  }));
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
    return token_statement(arr);
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
