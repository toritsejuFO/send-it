import { Pool } from 'pg';

export default class DB {
  static instance = null;

  error = false;

  res = null;

  count = null;


  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'sendit',
      user: 'postgres',
      password: 'postgres2k20',
    });
  }


  // Return only one db connection instance
  static getInstance = () => {
    if (!DB.instance) {
      DB.instance = new DB();
      return DB.instance;
    }
    return DB.instance();
  }


  query = async (sql, values) => {
    this.error = false;
    this.count = 0;

    try {
      const client = await this.pool.connect();
      const res = await client.query(sql, values);
      this.res = res.rows;
      this.count = res.rowCount;
      client.release();
    } catch (err) {
      console.log(err);
      this.error = true;
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
    console.log(sql, toUpdateString, Object.values(finalValues));
    return this.query(sql, Object.values(finalValues));
  }


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

// const db = DB.getInstance();

// (async function run() {
//   await db.update('users', {
//     othernames: 'Miracle',
//     username: 'toriboi',
//   }, {
//     email: 'toriboi.fo@gmail.com',
//   });

//   console.log(db);
//   if (!db.error) {
//     console.log(db.res);
//   }
// }());

// // (async function run() {
// //   await db.insert('users', {
// //     firstname: 'Ifeanyi',
// //     lastname: 'Anazia',
// //     email: 'anazia@gmail.com',
// //     username: 'anazia',
// //     isAdmin: false,
// //     phone: '09063519643',
// //   });
// //   console.log(db);
// //   if (!db.error) {
// //     console.log(db.res);
// //   }
// // }());

// // (async function run() {
// //   await db.select('users', {
// //     id: 1,
// //     // firstname: 'Faith',
// //   });
// //   // await db.query('select * from users');
// //   // console.log(db);
// //   if (!db.error) {
// //     console.log(db.res);
// //   }
// // }());
