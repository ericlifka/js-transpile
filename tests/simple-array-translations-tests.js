import should from 'should';
import {toJsString} from '../simple-array-translations';

describe('simple-array-translations', () => {
  describe('#toJsString()', () => {
    it('should return a string that represents javascript code', function () {
      toJsString().should.be.a.String();
    });
  });
});
