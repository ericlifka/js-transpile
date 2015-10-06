import should from 'should';
import { parse } from '../src/simple-parser';

describe('simple-parser', () => {
  describe('#parse()', () => {
    it('should return an array that represents the parsed list structure', () =>
      parse().should.be.an.Array());
  });
});
