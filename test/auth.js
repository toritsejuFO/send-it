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
    await db.query('delete from users');
    db.close();
  });

  it('should create a new user successfully', (done) => {
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
        expect(res.body.data[0].email).to.equal('janedoe@gmail.com');
        done();
      });
  });

  it('should not create a new user with email that already exists', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        othernames: 'Bob',
        email: 'janedoe@gmail.com',
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

  it('should not create a new user with username that already exists', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        othernames: 'Bob',
        email: 'johndoe@gmail.com',
        username: 'alice',
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
