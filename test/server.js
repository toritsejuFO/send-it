/* eslint-disable no-undef */
import chai from 'chai';
import chaiHTTP from 'chai-http';
import server from '../dist/server';

chai.use(chaiHTTP);
const { expect } = chai;

describe('Server', () => {
  it('should query base route sucessfully', (done) => {
    chai.request(server)
      .get('/api/v1')
      .end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to SendIT API');
        done();
      });
  });
});
