import should from 'should';
import { parse } from '../src/simple-parser';

describe('simple-parser', () => {
  describe('#parse()', () => {
    it('should return an array that represents the parsed list structure', () =>
      parse().should.be.an.Array());

    it('should parse an empty list', () =>
      parse('()').should.equal([]));

    it('should parse a list of symbols', () =>
      parse('(a b c)').should.equal(['a', 'b', 'c']));

    it('should parse a nested list', () =>
      parse('(a (b c) d)').should.equal(['a', ['b', 'c'], 'd']));

    it('should handle strings', () =>
      parse('("abc")').should.equal(['"abc"']));

    it('should handle whitespace in strings', () =>
      parse('("abc 123")').should.equal(['"abc 123"']));
  });
});
