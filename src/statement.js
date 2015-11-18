

export default class Statement {
  constructor() {

  }

  toString() {
    return "statement-obj()";
  }
}

export function infix_statement(options) {
  return new Statement();
}

export function token_statement(token) {
  return { printString: () => token };
}

export function empty_statement() {
  return { printString: () => '' };
}

export function multi_line_statement({statements}) {
  return {
    statements,
    printString(...args) {
      return statements
        .map(s => s.printString(...args))
        .join('');
    }
  };
}

/*
options I need to support:
{
  terminate: bool - end the statement with a semicolon
  embedded: bool - statement should wrap itself in a self contained manner to be used inline in a larger statement
}
 */
