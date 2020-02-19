/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import chai from 'chai';
import chaiHTTP from 'chai-http';
import server from '../src/server';
import DB from '../src/db';

chai.use(chaiHTTP);
const { expect } = chai;

let db = null;

describe('Auth API', () => {
  before(async () => {
    db = new DB();
    await db.query('delete from users');
  });

  after(async () => {
    db.close();
  });

  describe('Signup', () => {
    it('should signup a new user successfully', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'Jane',
          lastname: 'Doe',
          othernames: 'Alice',
          email: 'janedoe@gmail.com',
          username: 'alice',
          password: 'smallCAPSNumb3rs&$ymb0ls',
          isAdmin: false,
          phone: '09012345678',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(201);
          expect(res.body.data[0].user.email).to.equal('janedoe@gmail.com');
          expect(res.body.data[0]).to.haveOwnProperty('token');
          done();
        });
    });

    it('should signup another new user successfully', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'John',
          lastname: 'Doe',
          othernames: 'Bob',
          email: 'johndoe@gmail.com',
          username: 'bob',
          password: 'smallCAPSNumb3rs&$ymb0ls',
          isAdmin: true,
          phone: '09012345678',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.body.status).to.equal(201);
          expect(res.body.data[0].user.email).to.equal('johndoe@gmail.com');
          expect(res.body.data[0]).to.haveOwnProperty('token');
          done();
        });
    });

    it('should not signup a new user with email that already exists', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'New',
          lastname: 'User',
          othernames: 'Other',
          email: 'janedoe@gmail.com',
          username: 'other',
          password: 'smallCAPSNumb3rs&$ymb0ls',
          isAdmin: false,
          phone: '09012345678',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.status).to.equal(409);
          done();
        });
    });

    it('should not signup a new user with username that already exists', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'New',
          lastname: 'User',
          othernames: 'Other',
          email: 'newuser@gmail.com',
          username: 'bob',
          password: 'smallCAPSNumb3rs&$ymb0ls',
          isAdmin: false,
          phone: '09012345678',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.status).to.equal(409);
          done();
        });
    });
  });

  describe('Login', () => {
    it('should login user successfully', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          userId: 'janedoe@gmail.com',
          password: 'smallCAPSNumb3rs&$ymb0ls',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.status).to.equal(200);
          expect(res.body.data[0].user.email).to.equal('janedoe@gmail.com');
          expect(res.body.data[0]).to.haveOwnProperty('token');
          done();
        });
    });

    it('should not login non-existing user with incorrect email/username', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          userId: 'newuser@gmail.com',
          password: 'smallCAPSNumb3rs&$ymb0ls',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should not login existing user with incorrect password', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send({
          userId: 'janedoe@gmail.com',
          password: 'f@k3P@ssW0rd',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object');
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});
