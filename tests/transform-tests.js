import should from 'should';
import transform from '../src/transform';

describe('transform', () => {
  it('should turn a string into a string', () =>
    transform("()").should.be.a.String());
});
