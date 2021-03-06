import should from 'should';
import { isSymbolChar, isWhitespaceChar, isArray, camelCase, merge } from '../src/utils';

describe("utils", () => {
  describe("#isSymbolChar", () => {
    it('should accept symbol characters', () => {
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_$.=><".split('').forEach(char =>
        isSymbolChar(char).should.equal(true));
    });
    it('should reject non-symbol characters', () => {
      "!@#%^&()[]{}\\|?,".split('').forEach(char =>
        isSymbolChar(char).should.equal(false));
    });
  });

  describe("#isWhitespaceChar", () => {
    it('should accept common whitespace characters', () => {
      isWhitespaceChar(' ').should.equal(true);
      isWhitespaceChar('\t').should.equal(true);
      isWhitespaceChar('\n').should.equal(true);
    });
    it('should reject non-whitespace characters', () => {
      isWhitespaceChar('a').should.equal(false);
      isWhitespaceChar('2').should.equal(false);
      isWhitespaceChar('-').should.equal(false);
    });
  });

  describe("#isArray", () => {
    it('should accept arrays', () => {
      isArray([]).should.equal(true);
      isArray([ 1, 2, 3 ]).should.equal(true);
    });
    it('should reject other types', () => {
      isArray(5).should.equal(false);
      isArray('a').should.equal(false);
      isArray({ a: 1 }).should.equal(false);
    });
  });

  describe("#camelCase", () => {
    it('should convert dasherized strings to camel case strings', () => {
      camelCase('').should.equal('');
      camelCase('a').should.equal('a');
      camelCase('abc').should.equal('abc');
      camelCase('a-b').should.equal('aB');
      camelCase('a-b-c').should.equal('aBC');
      camelCase('thing-one').should.equal('thingOne');
      camelCase('one-two-three').should.equal('oneTwoThree');
    });
  });

  describe("#merge", () => {
    it('should put any number of objects together', () => {
      var res = merge({ a: 1 }, { b: 2 }, { c: 3 });
      res.a.should.equal(1);
      res.b.should.equal(2);
      res.c.should.equal(3);
    });

    it('should return an object from the empty case', () => {
      merge().should.be.type('object');
    });

    it('should give precedence to the objects later in the list', () => {
      var res = merge({ a: 1 }, { a: 2 });
      res.a.should.equal(2);
    });
  });
});
