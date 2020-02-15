/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHTTP from 'chai-http';
import server from '../src/server';
import DB from '../src/db';

chai.use(chaiHTTP);
const { expect } = chai;

let db = null;

describe('Parcels API', () => {
  before(async () => {
    db = new DB();
  });

  after(async () => {
    await db.query('delete from users');
    await db.query('delete from parcels');
    db.close();
  });

  describe('Parcel order creation', () => {
    // Log user in
    it('should create a new parcel successfully for an authenticated/verified user with a valid token', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          userId: 'janedoe@gmail.com',
          password: 'smallCAPSNumb3rs&$ymb0ls',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data[0].user.email).to.equal('janedoe@gmail.com');
          expect(res.body.data[0]).to.haveOwnProperty('token');
          const { token } = res.body.data[0];

          // Create new parcel delivery order
          chai.request(server)
            .post('/api/v1/parcels')
            .set('x-api-token', token)
            .send({
              weight: 100,
              weightmetric: 'lb',
              from: 'ikeja',
              to: 'VI',
            })
            .end((error, resp) => {
              expect(error).to.be.null;
              expect(resp).to.be.an('object');
              expect(resp.body.status).to.equal(201);
              expect(resp.body.data[0]).to.haveOwnProperty('id');
              expect(resp.body.data[0].message).to.equal('Order placed');
              done();
            });
        });
    });

    it('should not create parcel delivery order for unverified user with expired token', (done) => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0b3JpYm9pLmZvQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidG9yaXRzZWp1Zm8iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTgxNjk1OTgzLCJleHAiOjE1ODE3ODIzODN9.PGvy5PEAG1O7cnilHjeJ7Ae471lHnZDyqd5gEwsbdj8';
      chai.request(server)
        .post('/api/v1/parcels')
        .set('x-api-token', token)
        .send({
          weight: 100,
          weightmetric: 'lb',
          from: 'ikeja',
          to: 'VI',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(500);
          expect(res.body.error).to.equal('jwt expired');
          done();
        });
    });

    it('should not create parcel delivery order for unverified user with invalid token', (done) => {
      const token = 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0b3JpYm9pLmZvQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidG9yaXRzZWp1Zm8iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTgxNjk1OTgzLCJleHAiOjE1ODE3ODIzODN9.PGvy5PEAG1O7cnilHjeJ7Ae471lHnZDyqd5gEwsbdj8';
      chai.request(server)
        .post('/api/v1/parcels')
        .set('x-api-token', token)
        .send({
          weight: 100,
          weightmetric: 'kg',
          from: 'ikeja',
          to: 'VI',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(500);
          expect(res.body.error).to.equal('invalid token');
          done();
        });
    });

    it('should not create parcel delivery order for unverified user with malformed jwt', (done) => {
      const token = 'invalid token string';
      chai.request(server)
        .post('/api/v1/parcels')
        .set('x-api-token', token)
        .send({
          weight: 100,
          weightmetric: 'kg',
          from: 'ikeja',
          to: 'VI',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(500);
          expect(res.body.error).to.equal('jwt malformed');
          done();
        });
    });

    it('should not create parcel delivery order for unverified user with no token provided', (done) => {
      chai.request(server)
        .post('/api/v1/parcels')
        .send({
          weight: 1,
          weightmetric: 't',
          from: 'ikeja',
          to: 'VI',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(401);
          expect(res.body.error).to.equal('API token is not provided');
          done();
        });
    });
  });
});
