import { isArray, camelCase } from './utils';
import {
  block_statement,
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
        statements: [
          token_statement({ token: `var ${name}`} ),
          toJsTree(val, { embedded: true })
        ],
        separator: ' = ',
        terminate: true
      }));
    }
  }

  if (varPairs.length < 1) {
    return empty_statement();
  }

  return multi_line_statement(merge(options, {
    statements: varPairs
  }));
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
  params = params.join(', ');

  let final = body.pop();
  if (final) {
    final = toJsTree(final, { returnStatement: true, terminate: true });
  } else {
    final = token_statement({ token: 'null', returnStatement: true, terminate: true });
  }

  let statements = body.map(s => toJsTree(s, { terminate: true }));
  statements.push(final);

  return block_statement(merge(options, {
    openBlock: `function ${name}(${params}) {`,
    statements,
    closeBlock: `}`
  }));
}

function define_module([operator, name, ...body], options) {
  const statements = body.map(s => toJsTree(s, { terminate: true }));

  return block_statement(merge(options, {
    openBlock: `module('${name}', function (require, export) {`,
    statements,
    closeBlock: `})`
  }));
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
    return token_statement({ token: arr });
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
