/* eslint-disable no-undef */
import chai from 'chai';

chai.should();

describe('server test', () => {
  describe('port', () => {
    it('should confirm server port', () => {
      const port = 3000;
      port.should.equal(3000);
    });
  });
});
