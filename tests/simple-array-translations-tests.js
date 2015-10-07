import should from 'should';
import { toJsString } from '../src/simple-array-translations';

describe('simple-array-translations', () => {
  describe('#toJsString()', () => {
    it('should return a string that represents javascript code', () => toJsString().should.be.a.String());
    it('should handle a simple variable assignment', () => toJsString([ 'let', 'a', '5' ]).should.equal("var a = 5;"));
    it('should handle a simple math statement', () => toJsString([ '+', '2', '3' ]).should.equal("(2 + 3)"));
    it('should handle a math statement into an assignment', () => toJsString([ 'let', 'a', [ '+', '2', '3' ] ]).should.equal("var a = 2 + 3;"));
  });
});
