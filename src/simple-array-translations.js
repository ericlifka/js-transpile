import {
  camelCase,
  isArray,
  merge
} from './utils';
import {
  block_statement,
  empty_statement,
  function_statement,
  infix_statement,
  multi_line_statement,
  token_statement
} from './statement';
import builtinMacros from './builtin-macros';

function letToVar([cmd, ...vars], options) {
  const varPairs = [];
  for (let i = 0; i < vars.length; i += 2) {
    let name = vars[ i ];
    let val = vars[ i + 1 ];

    if (name && val) {
      varPairs.push(infix_statement({
        statements: [
          token_statement({ token: `var ${name}`}),
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

function logical_operator([operator, ...params], options) {
  if (params.length <= 1) {
    throw "logical operators require at least two parameters";
  }
  else if (params.length === 2) {
    return infix_statement(merge(options, {
      statements: params.map(param => toJsTree(param, { embedded: true })),
      separator: ` ${operator} `
    }));
  }
  else {
    let pairs = [];
    for (let i = 0; i < params.length - 1; i++) {
      let first = params[ i ];
      let second = params [ i + 1 ];

      pairs.push(infix_statement({
        statements: [
          toJsTree(first, { embedded: true }),
          toJsTree(second, { embedded: true })
        ],
        separator: ` ${operator} `,
        embedded: true
      }));
    }

    return infix_statement(merge(options, {
      statements: pairs,
      separator: ` && `
    }));
  }
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
  const statements = reqTokens.map(token => token_statement({
    token: `var ${token} = ${moduleName}['${token}']`,
    terminate: true
  }));

  statements.unshift(token_statement({
    token: `var ${moduleName} = require('${moduleName}')`,
    terminate: true
  }));

  return multi_line_statement(merge(options, { statements }));
}

function module_export([operator, moduleName, statement], options) {
  return function_statement(merge(options, {
    openStatement: `export(`,
    parameters: [
      token_statement({ token: `'${moduleName}'` }),
      toJsTree(statement, { embedded: true })
    ],
    closeStatement: `)`
  }));
}

function function_call([fn, ...params], options) {
  return function_statement({
    openStatement: `${fn}(`,
    parameters: params.map(p => toJsTree(p, { embedded: true })),
    closeStatement: `)`
  });
}

export const toJsTree = function (arr, options = { }) {
  arr = builtinMacros(arr, options);

  if (!isArray(arr)) {
    return token_statement(merge(options, { token: arr }));
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
    case '=': return logical_operator(arr, options);
    case '>': return logical_operator(arr, options);
    case '<': return logical_operator(arr, options);
    case '>=': return logical_operator(arr, options);
    case '<=': return logical_operator(arr, options);
  }

  return function_call(arr, options);
};
