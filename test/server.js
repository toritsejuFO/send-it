/* eslint-disable no-undef */
import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../dist/server';

chai.use(chaiHTTP);
chai.should();

describe('Listening server', () => {
  it('should query base route sucessfully', (done) => {
    chai.request(app)
      .get('/')
      .end((_, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Welcome to SendIT API');
        done();
      });
  });
});
