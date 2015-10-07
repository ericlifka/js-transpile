import should from 'should';
import { transformString } from '../src/transform';

describe('transform', () => {
  it('should turn a string into a string', () =>
    transformString("()").should.be.a.String());
});
