import { Pool } from 'pg';

export default class DB {
  static instance = null;

  error = false;

  res = null;

  count = null;

  errorStack = null;


  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    DB.instance = this;
  }


  // Return only one db connection instance
  static getInstance = () => {
    if (!DB.instance) {
      return new DB();
    }
    return DB.instance;
  }


  query = async (sql, values = []) => {
    this.error = false;
    this.count = null;
    this.res = null;
    this.errorStack = null;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query(sql, values);
      await client.query('COMMIT');
      this.res = res.rows;
      this.count = res.rowCount;
    } catch (err) {
      await client.query('ROLLBACK');
      this.error = true;
      this.errorStack = err;
    } finally {
      client.release();
    }
    return this;
  }


  select = async (table = null, conditionParams = {}) => {
    const searchParams = Object.entries(conditionParams);
    let query = '';

    // Construct query parameters string based on entries. E.g id = $1
    searchParams.forEach((searchParam, index) => {
      const [key, _] = searchParam;
      query += ` ${key} = $${index + 1} and`;
    });
    // Remove last 'and' from constructed string
    query = DB.removeXNumberOfCharFromEndOfString(query, 3);

    const sql = `
      SELECT *
      FROM ${table}
      WHERE ${query}
    `;
    return this.query(sql, Object.values(conditionParams));
  }


  insert = async (table = null, params = {}) => {
    const insertParams = Object.entries(params);
    const fields = DB.getKeysAsCommaSeperatedString(params);
    let values = '';

    // Construct insert values string based on entries
    insertParams.forEach((_, index) => {
      values += ` $${index + 1},`;
    });
    // Remove last comma from constructed string
    values = DB.removeXNumberOfCharFromEndOfString(values, 1);

    const sql = `
      INSERT
      INTO ${table}( ${fields} )
      VALUES( ${values} )
      RETURNING *
    `;
    return this.query(sql, Object.values(params));
  }


  update = async (table = null, params = {}, conditionParams = {}) => {
    const updateParams = Object.entries(params);
    const searchParams = Object.entries(conditionParams);
    let toUpdateString = '';
    let query = '';
    let globalIndex = null;

    // Construct update values string based on entries. E.g id = $1
    updateParams.forEach((entry, index) => {
      const [key, _] = entry;
      toUpdateString += ` ${key} = $${index + 1},`;
      globalIndex = index + 1; // Store last index value to continue building string
    });
    // Remove last comma from constructed string
    toUpdateString = DB.removeXNumberOfCharFromEndOfString(toUpdateString, 1);

    // Construct query parameters string based on entries. E.g id = $1
    searchParams.forEach((searchParam) => {
      const [key, _] = searchParam;
      query += ` ${key} = $${globalIndex + 1} and`;
    });
    // Remove last 'and' from constructed string
    query = DB.removeXNumberOfCharFromEndOfString(query, 3);

    const sql = `
      UPDATE ${table}
      SET ${toUpdateString}
      WHERE( ${query} )
      RETURNING *
    `;
    const finalValues = Object.values(params).concat(Object.values(conditionParams));
    return this.query(sql, Object.values(finalValues));
  }


  delete = async (table = null, conditionParams = {}) => {
    const deleteParams = Object.entries(conditionParams);
    let query = '';

    // Construct query parameters string based on entries. E.g id = $1
    deleteParams.forEach((deleteParam, index) => {
      const [key, _] = deleteParam;
      query += ` ${key} = $${index + 1} and`;
    });
    // Remove last 'and' from constructed string
    query = DB.removeXNumberOfCharFromEndOfString(query, 3);

    if (table === 'parcels') {
      query += ' and status != \'delivered\' and status != \'transiting\'';
    }

    const sql = `
      DELETE
      FROM ${table}
      WHERE ${query}
      RETURNING *
    `;

    return this.query(sql, Object.values(conditionParams));
  }


  close = async () => this.pool.end()


  /**
   * Static helper methods
   */

  static getKeysAsCommaSeperatedString = (params) => (
    Object.keys(params).join(', ')
  )

  static removeXNumberOfCharFromEndOfString = (value, x) => (
    value.slice(0, -x)
  )
}
