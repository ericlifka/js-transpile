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
    test('(let a 2 b 4 c 5)', 'var a = 2, b = 4, c = 5;');
    test('(let a (+ 1 2))', 'var a = (1 + 2);');
  });

  describe('math', () => {
    test('(+ 1 2)', '(1 + 2)');
    test('(- 9 6)', '(9 - 6)');
    test('(* 2 3)', '(2 * 3)');
    test('(/ 4 2)', '(4 / 2)');
    test('(* (+ 2 4) (- 5 3))', '((2 + 4) * (5 - 3))');
    test('(+ 2 3 4 5)', '(2 + 3 + 4 + 5)');

    test('(Math.pow 2 4)', 'Math.pow(2, 4)');
    test('(Math.abs -4)', 'Math.abs(-4)');
    test('(math.pow (* 2 3) (- 2 4))', 'Math.pow((2 * 3), (2 - 4))');
  });

  describe('control flow', () => {
    describe('if else', () => {});
    describe('for loops', () => {});
    describe('while loops', () => {});
  });

  describe('functions', () => {
    test('(function ())', '(function () { return undefined;})');
    test('(function () 4)', '(function () { return 4;})');
    test('(function (x y) (+ x y))', '(function (x y) { return (x + y);})');
    test('(function adder (x y) (+ x y))', '(function adder(x y) { return (x + y);})');
    test('(function (x) (function (y) (+ x y)))', '(function (x) { return (function (y) { return (x + y);});})');
  });

  describe('data structures', () => {
    describe('arrays', () => {});
    describe('objects', () => {});
  });

  describe('modules', () => {});

  describe('calling methods on dynamic entities', () => {});
});
