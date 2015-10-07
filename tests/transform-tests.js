import should from 'should';
import { transformString } from '../src/transform';

function test(input, output) {
  it(input, () => should(transformString(input)).equal(output));
}

describe('transform', () => {
  it('should turn a string into a string',
    () => transformString("()").should.be.a.String());

  describe('variables', () => {
    test('(let a 2)', 'var a = 2;');
  });

  describe('math', () => {
    test('(+ 1 2)', '(1 + 2)');
  });

});
