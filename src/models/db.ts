/**
 * Author: Tyler Grinn
 * https://github.com/tylergrinn
 *
 * Asynchronous mysql singleton
 * Usage:
 *   import * as db from './db';
 *
 *   // For a single query
 *
 *   const results = await db.query('SELECT * FROM users');
 *
 *   // For sequential queries using a single connection
 *
 *   const id = await db.useConnection(async (query) => {
 *     await query('INSERT INTO cities (name, state) VALUES (`Ann Arbor`, `MI`);
 *
 *     const [{ id }] = await query('SELECT LAST_INSERT_ID() AS id');
 *
 *     return id;
 *     // The connection will be released once this inner async function completes
 *   })
 *
 *   // Specify named parameters in the query string using the ':' symbol.
 *   // Pass their values in to an object as the second parameter
 *
 *   const [userExists] = await db.query(
 *     'SELECT COUNT(*) AS userExists FROM users WHERE username = :username',
 *     { username: 'tyler' }
 *   )
 *
 *   // All named parameters are escaped using mysql's EscapeFunctions.escape function
 *
 * Required environment variables:
 *   MYSQL_HOST
 *   MYSQL_PORT
 *   MYSQL_USER
 *   MYSQL_PASSWORD
 *   MYSQL_DB
 *   MYSQL_TEST_DB // used when NODE_ENV === 'test'
 */
import * as mysql from 'mysql';

const pool = mysql.createPool({
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.MYSQL_TEST_DB
      : process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  connectionLimit: 10,
});

pool.on('connection', (conn) => {
  conn.config.queryFormat = (sql: string, values) => {
    if (!values) {
      return sql;
    }
    return sql.replace(/\:(\w+)/g, (txt, key) => {
      if (values.hasOwnProperty(key)) {
        return conn.escape(values[key]);
      }
      return txt;
    });
  };
});

const getQueryFnc: <R, A>(
  conn: mysql.Pool | mysql.Connection
) => (sql: string, args: A) => Promise<R[]> = (conn) => (sql, args) =>
  new Promise((resolve, reject) => {
    conn.query(sql, args, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

export const query: <R, A = { [key: string]: string | number }>(
  sql: string,
  args?: A
) => Promise<R[]> = getQueryFnc(pool);

export const useConnection: <T>(
  cb: (q: typeof query) => Promise<T>
) => Promise<T> = (cb) =>
  new Promise((resolve, reject) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        reject(err);
      } else {
        let result;

        try {
          result = await cb(getQueryFnc(conn));
        } catch (err) {
          reject(err);
        } finally {
          conn.release();
          resolve(result);
        }
      }
    });
  });
