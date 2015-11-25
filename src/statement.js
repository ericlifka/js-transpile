export default class Statement {
  constructor() {

  }

  toString() {
    return "statement-obj()";
  }
}

export function infix_statement({ statements, separator, terminate, embedded }) {
  return {
    statements,
    separator,
    terminate,
    embedded,
    printString(...args) {
      let statement = this.statements
        .map(s => s.printString(...args))
        .join(this.separator);

      if (this.embedded) {
        statement = `(${statement})`;
      }

      if (this.terminate) {
        statement += ";";
      }

      return statement;
    }
  };
}

export function token_statement({ token, returnStatement, terminate }) {
  return {
    token,
    returnStatement,
    terminate,
    printString() {
      return (this.returnStatement ? 'return ' : '') +
        this.token +
        (this.terminate ? ';' : '');
    }
  };
}

export function empty_statement() {
  return { printString: () => '' };
}

export function multi_line_statement({statements}) {
  return {
    statements,
    printString(...args) {
      return this.statements
        .map(s => s.printString(...args))
        .join('');
    }
  };
}

export function block_statement({ openBlock, statements, closeBlock }) {
  return {
    openBlock,
    statements,
    closeBlock,
    printString(...args) {
      return this.openBlock +
          this.statements
            .map(s => s.printString(...args))
            .join('') +
          this.closeBlock;
    }
  };
}

export function function_statement({ openStatement, parameters, closeStatement }) {
  return {
    openStatement,
    parameters,
    closeStatement,
    printString(...args) {
      return this.openStatement +
          this.parameters
            .map(s => s.printString(...args))
            .join(', ') +
        this.closeStatement;
    }
  };
}

/*
options I need to support:
{
  terminate: bool - end the statement with a semicolon
  embedded: bool - statement should wrap itself in a self contained manner to be used inline in a larger statement
 returnStatement: bool - statement should either return it's value or recursively pass down so that value is appropriately returned - will probably be very complex
}
 */
