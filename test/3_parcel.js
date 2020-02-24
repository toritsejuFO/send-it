/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHTTP from 'chai-http';
import server from '../src/server';
import DB from '../src/db';

chai.use(chaiHTTP);
const { expect } = chai;

let db = null;

let janeParcelId;
let johnParcelId;
let janeValidToken;
let johnValidToken;

describe('Parcels API', () => {
  before(async () => {
    db = new DB();
  });

  after(async () => {
    await db.query('delete from users');
    await db.query('delete from parcels');
    db.close();
  });

  describe('Create parcel order', () => {
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
          janeValidToken = res.body.data[0].token;

          // Create new parcel delivery order
          chai.request(server)
            .post('/api/v1/parcels')
            .set('x-api-token', janeValidToken)
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
              janeParcelId = resp.body.data[0].id;
              done();
            });
        });
    });

    it('should create a new parcel successfully for another authenticated/verified user with a valid token', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          userId: 'johndoe@gmail.com',
          password: 'smallCAPSNumb3rs&$ymb0ls',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data[0].user.email).to.equal('johndoe@gmail.com');
          expect(res.body.data[0]).to.haveOwnProperty('token');
          johnValidToken = res.body.data[0].token;

          // Create new parcel delivery order
          chai.request(server)
            .post('/api/v1/parcels')
            .set('x-api-token', johnValidToken)
            .send({
              weight: 100,
              weightmetric: 'kg',
              from: 'Surulere',
              to: 'Yaba',
            })
            .end((error, resp) => {
              expect(error).to.be.null;
              expect(resp).to.be.an('object');
              expect(resp.body.status).to.equal(201);
              expect(resp.body.data[0]).to.haveOwnProperty('id');
              expect(resp.body.data[0].message).to.equal('Order placed');
              johnParcelId = resp.body.data[0].id;
              done();
            });
        });
    });

    it('should not create parcel delivery order for unverified user with expired token', (done) => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0b3JpYm9pLmZvQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidG9yaXRzZWp1Zm8iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTgxNjk1OTgzLCJleHAiOjE1ODE3ODIzODN9.PGvy5PEAG1O7cnilHjeJ7Ae471lHnZDyqd5gEwsbdj8';
      chai.request(server)
        .post('/api/v1/parcels')
        .set('x-api-token', invalidToken)
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
          expect(res.body.error).to.be.oneOf(['jwt expired', 'invalid signature']);
          done();
        });
    });

    it('should not create parcel delivery order for unverified user with invalid token', (done) => {
      const invalidToken = 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0b3JpYm9pLmZvQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidG9yaXRzZWp1Zm8iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTgxNjk1OTgzLCJleHAiOjE1ODE3ODIzODN9.PGvy5PEAG1O7cnilHjeJ7Ae471lHnZDyqd5gEwsbdj8';
      chai.request(server)
        .post('/api/v1/parcels')
        .set('x-api-token', invalidToken)
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
      const invalidToken = 'invalid token string';
      chai.request(server)
        .post('/api/v1/parcels')
        .set('x-api-token', invalidToken)
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

  describe('Get a specific parcel order', () => {
    it('should get a specific parcel order for an authenticated user', (done) => {
      chai.request(server)
        .get(`/api/v1/parcels/${janeParcelId}`)
        .set('x-api-token', janeValidToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data[0]).to.have.own.property('id');
          expect(res.body.data[0].id).to.equal(janeParcelId);
          done();
        });
    });

    it('should get a specific parcel order for another authenticated user', (done) => {
      chai.request(server)
        .get(`/api/v1/parcels/${johnParcelId}`)
        .set('x-api-token', johnValidToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data[0]).to.have.own.property('id');
          expect(res.body.data[0].id).to.equal(johnParcelId);
          done();
        });
    });

    it('should not get a specific parcel order belonging to another user', (done) => {
      chai.request(server)
        .get(`/api/v1/parcels/${johnParcelId}`)
        .set('x-api-token', janeValidToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data.length).to.equal(0);
          done();
        });
    });
  });

  describe('Get all parcel orders', () => {
    it('should get all parcel orders of an authenticated user', (done) => {
      chai.request(server)
        .get('/api/v1/parcels')
        .set('x-api-token', janeValidToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  describe('Delete a parcel order', () => {
    it('should cancel a parcel delivery order', async () => {
      chai.request(server)
        .patch(`/api/v1/parcels/${johnParcelId}/cancel`)
        .set('x-api-token', johnValidToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res.body.data[0].id).to.equal(johnParcelId);
        });
    });
  });
});
