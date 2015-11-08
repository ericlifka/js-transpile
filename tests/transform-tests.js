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

    test('(Math.pow 2 4)', 'Math.pow( 2, 4 )');
    test('(Math.abs -4)', 'Math.abs( -4 )');
    test('(Math.pow (* 2 3) (- 2 4))', 'Math.pow( (2 * 3), (2 - 4) )');
  });

  describe('control flow', () => {
    describe('if else', () => {});
    describe('for loops', () => {});
    describe('while loops', () => {});
  });

  describe('function literals', () => {
    test('(function ())', '(function () { return undefined;})');
    test('(function () 4)', '(function () { return 4;})');
    test('(function (x y) (+ x y))', '(function (x y) { return (x + y);})');
    test('(function adder (x y) (+ x y))', '(function adder(x y) { return (x + y);})');
    test('(function (x) (function (y) (+ x y)))', '(function (x) { return (function (y) { return (x + y);});})');
  });

  describe('function calls', () => {
    test('(some_func 1 2 3)', 'some_func( 1, 2, 3 )');
    test('(func 1 (nested 2 3))', 'func( 1, nested( 2, 3 ) )');
    test('(empty_func)', 'empty_func(  )');
  });

  describe('data structures', () => {
    describe('arrays', () => {});
    describe('objects', () => {});
  });

  describe('modules', () => {
    test(`
      (module test-em
        (+ 1 2))
      `,
      `module('test-em', function (require, export) {(1 + 2);})`);
    test(`
      (module test-em
        (export var-a (+ 1 2)))
      `,
      `module('test-em', function (require, export) {export('var-a', (1 + 2));})`);
    test(`
      (module test-em-a
        (require test-em-b (var-a)))
      `,
      `module('test-em-a', function (require, export) {
         var testEmB = require('test-em-b');
         var varA = testEmB['var-a'];
       })`);
  });

  describe('calling methods on dynamic entities', () => {});
});
