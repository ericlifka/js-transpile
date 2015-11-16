

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
  return new Statement();
}
