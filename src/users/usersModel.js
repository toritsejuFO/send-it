import DB from '../db';

export default class UsersModel {
  db = null;

  table = 'users';

  error = false;

  user = null;

  count = null;

  errorStack = null;

  constructor() {
    this.db = DB.getInstance();
  }

  create = async (newUser) => {
    await this.db.insert(this.table, newUser);
    this.setInternal();
  }

  exists = async (details) => {
    await this.db.select(this.table, details);
    await this.setInternal();
  }

  getError = () => this.error

  getCount = () => this.count

  getDetails = () => this.user

  getErrorStack = () => this.errorStack

  setInternal = async () => {
    this.error = this.db.error;
    this.user = this.db.res;
    this.count = this.db.count;
    this.errorStack = this.db.errorStack;
  }
}
