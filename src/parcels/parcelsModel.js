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

  findByIdAndUserId = async (id, userId) => {
    await this.db.select(this.table, { id, placedby: userId });
    this.setInternal();
  }

  findAllByUserId = async (userId) => {
    await this.db.select(this.table, { placedby: userId });
    this.setInternal();
  }

  deleteByIdAndUserId = async (id, userId) => {
    await this.db.delete(this.table, { id, placedby: userId });
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
