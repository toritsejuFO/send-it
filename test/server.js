/* eslint-disable no-undef */
import chai from 'chai';
import chaiHTTP from 'chai-http';
import server from '../src/server';

chai.use(chaiHTTP);
chai.should();

describe('Server', () => {
  it('should query base route sucessfully', (done) => {
    chai.request(server)
      .get('/api/v1')
      .end((_, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Welcome to SendIT API');
        done();
      });
  });
});
