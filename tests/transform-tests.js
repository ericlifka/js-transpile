import should from 'should';
import { transformString } from '../src/transform';

describe('transform', () => {
  it('should turn a string into a string', () =>
    transformString("()").should.be.a.String());

  describe('variables', () => {
    it('(let a 2)', () =>
      transformString("(let a 2)").should.equal("var a = 2;"));
  });

  describe('math', () => {
    it('(+ 1 2)', () =>
      transformString('(+ 1 2)').should.equal("(1 + 2)"));
  });

});
