import should from 'should';
import { parse } from '../src/simple-parser';

describe('simple-parser', () => {
  describe('#parse()', () => {
    it('should return an array that represents the parsed list structure', () =>
      parse('()').should.be.an.Array());

    it('should parse an empty list', () =>
      parse('()').should.deepEqual([]));

    it('should parse a list of symbols', () =>
      parse('(a b c)').should.deepEqual([ 'a', 'b', 'c' ]));

    it('should parse a nested list', () =>
      parse('(a (b c) d)').should.deepEqual([ 'a', [ 'b', 'c' ], 'd' ]));

    it('should handle strings', () =>
      parse('("abc")').should.deepEqual([ '"abc"' ]));

    it('should handle whitespace in strings', () =>
      parse('("abc 123")').should.deepEqual([ '"abc 123"' ]));
  });
});
