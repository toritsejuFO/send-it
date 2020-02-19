import DB from '../db';

export default class Parcel {
  db = null;

  table = 'parcels';

  error = false;

  parcel = null;

  count = null;

  errorStack = null;

  constructor() {
    this.db = DB.getInstance();
  }

  create = async (newParcelOrder) => {
    await this.db.insert(this.table, newParcelOrder);
    this.setInternal();
  }

  findById = async (id) => {
    await this.db.select(this.table, { id });
    this.setInternal();
  }

  hasError = () => this.error

  getCount = () => this.count

  getDetails = () => this.parcel

  getErrorStack = () => this.errorStack

  setInternal = () => {
    this.error = this.db.error;
    this.parcel = this.db.res;
    this.count = this.db.count;
    this.errorStack = this.db.errorStack;
  }
}
