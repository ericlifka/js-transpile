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
  self_calling_wrapper_statement,
  token_statement
} from './statement';
import {
  token_macros,
  list_macros
} from './builtin-macros';

function let_to_var([cmd, ...vars], options) {
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

function if_block([operator, conditional, truePath, falsePath], options) {
  const pathOptions = {
    terminate: true,
    returnStatement: options.returnStatement || options.embedded
  };

  const truePathBlock = block_statement({
    openBlock: infix_statement({
      statements: [
        token_statement({ token: 'if' }),
        toJsTree(conditional, { embedded: true }),
        token_statement({ token: '{' })
      ],
      separator: ' '
    }),
    statements: [
      toJsTree(truePath, pathOptions)
    ],
    closeBlock: token_statement({ token: '}' })
  });

  let ifStatement;
  if (falsePath) {
    const falsePathBlock = block_statement({
      openBlock: token_statement({ token: 'else {' }),
      statements: [
        toJsTree(falsePath, pathOptions)
      ],
      closeBlock: token_statement({ token: '}' })
    });

    ifStatement = multi_line_statement({
      statements: [ truePathBlock, falsePathBlock ]
    });
  }
  else {
    ifStatement = truePathBlock;
  }

  if (options.embedded) {
    return self_calling_wrapper_statement(merge(options, { content: ifStatement }));
  } else {
    return ifStatement;
  }
}

function cond_block([operator, ...branches], options) {
  return empty_statement();
}

function while_block([operator, ...statements], options) {
  return empty_statement();
}

function for_block([operator, ...statements], options) {
  return empty_statement();
}

function math_operator([operator, ...params], options) {
  return infix_statement(merge(options, {
    statements: params.map(param => toJsTree(param, { embedded: true })),
    separator: ` ${operator} `
  }));
}

function logical_operator([operator, ...params], options) {
  if (operator === '=') {
    operator = '===';
  }

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
    openBlock: token_statement({ token: `function ${name}(${params}) {` }),
    statements,
    closeBlock: token_statement({ token: `}` })
  }));
}

function define_module([operator, name, ...body], options) {
  const statements = body.map(s => toJsTree(s, { terminate: true }));

  return block_statement(merge(options, {
    openBlock: token_statement({ token: `module('${name}', function (require, export) {` }),
    statements,
    closeBlock: token_statement({ token: `})` })
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
  return function_statement(merge(options, {
    openStatement: `${fn}(`,
    parameters: params.map(p => toJsTree(p, { embedded: true })),
    closeStatement: `)`
  }));
}

export const toJsTree = function (arr, options = { }) {
  if (!isArray(arr)) {
    arr = token_macros(arr, options);

    return token_statement(merge(options, { token: arr }));
  }

  arr = list_macros(arr, options);

  switch(arr[0]) {
    case 'function': return define_function(arr, options);
    case 'module': return define_module(arr, options);
    case 'require': return module_require(arr, options);
    case 'export': return module_export(arr, options);

    case 'let': return let_to_var(arr, options);
    case 'if': return if_block(arr, options);
    case 'cond': return cond_block(arr, options);
    case 'for': return for_block(arr, options);
    case 'while': return while_block(arr, options);

    case '+': return math_operator(arr, options);
    case '-': return math_operator(arr, options);
    case '*': return math_operator(arr, options);
    case '/': return math_operator(arr, options);
    case '=': return logical_operator(arr, options);
    case '>': return logical_operator(arr, options);
    case '<': return logical_operator(arr, options);
    case '>=': return logical_operator(arr, options);
    case '<=': return logical_operator(arr, options);

    default: return function_call(arr, options);
  }
};
