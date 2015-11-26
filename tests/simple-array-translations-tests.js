import should from 'should';
import { toJsTree } from '../src/simple-array-translations';

describe('simple-array-translations', () => {
  describe('#toJsTree()', () => {
    it('should handle a simple variable assignment', () => toJsTree([ 'let', 'a', '5' ]).printString().should.equal("var a = 5;"));
    it('should handle a simple math statement', () => toJsTree([ '+', '2', '3' ]).printString().should.equal("2 + 3"));
    it('should handle a math statement into an assignment', () => toJsTree([ 'let', 'a', [ '+', '2', '3' ] ]).printString().should.equal("var a = (2 + 3);"));
  });
});
