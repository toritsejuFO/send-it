/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import chai from 'chai';
import DB from '../dist/db';

const { expect } = chai;

let db = null;

describe('Database API', () => {
  before((done) => {
    db = new DB(); // Use a new pool for running tests
    db.query('delete from users');
    done();
  });

  after((done) => {
    db.close().then(done());
  });

  describe('database instance', () => {
    it('should use current database instance', async () => {
      const newDb = new DB();
      const sameNewDb = DB.getInstance();
      expect(newDb).to.not.eql(db);
      expect(newDb).to.eql(sameNewDb);
      await newDb.close();
    });
  });

  describe('insert', () => {
    describe('insert functions properly', () => {
      it('should create a new user successfully', async () => {
        await db.insert('users', {
          firstname: 'John',
          lastname: 'Doe',
          othernames: 'Bob',
          email: 'johndoe@gmail.com',
          username: 'bob',
          isAdmin: true,
          phone: '09012345678',
        });
        expect(db.error).to.false;
        expect(db.count).to.equal(1);
        expect(db.res).to.be.an('array').that.is.not.empty;
        expect(db.res[0].email).to.equal('johndoe@gmail.com');
      });
    });

    describe('insert functions improperly', () => {
      it('should not create a user with colliding email', async () => {
        await db.insert('users', {
          firstname: 'Jane',
          lastname: 'Doe',
          othernames: 'Alice',
          email: 'johndoe@gmail.com',
          username: 'alice',
          isAdmin: false,
          phone: '09012345678',
        });
        expect(db.error).to.true;
        expect(db.count).to.equal(null);
        expect(db.res).to.equal(null);
      });
    });
  });

  describe('select', () => {
    describe('select functions properly', () => {
      it('should fetch an exsiting user successfully', async () => {
        await db.select('users', {
          email: 'johndoe@gmail.com',
        });
        expect(db.error).to.false;
        expect(db.count).to.equal(1);
        expect(db.res).to.be.an('array').that.is.not.empty;
        expect(db.res[0].email).to.equal('johndoe@gmail.com');
      });
    });

    describe('select functions improperly', () => {
      it('should not fetch a non exsiting user', async () => {
        await db.select('users', {
          email: 'janedoe@gmail.com',
        });
        expect(db.error).to.false;
        expect(db.count).to.equal(0);
        expect(db.res).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('update', () => {
    describe('updates functions properly', () => {
      it('should update and exisitng user successfully', async () => {
        await db.update('users', {
          username: 'newbob',
        }, {
          email: 'johndoe@gmail.com',
        });
        expect(db.error).to.false;
        expect(db.count).to.equal(1);
        expect(db.res).to.be.an('array').that.is.not.empty;
        expect(db.res[0].username).to.equal('newbob');
      });
    });

    describe('updates functions improperly', () => {
      it('should not update and exisitng user successfully', async () => {
        await db.update('users', {
          username: 'newalice',
        }, {
          email: 'janedoe@gmail.com',
        });
        expect(db.error).to.false;
        expect(db.count).to.equal(0);
        expect(db.res).to.be.an('array').that.is.empty;
      });
    });
  });
});
