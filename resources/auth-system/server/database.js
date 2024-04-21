// server/database.js

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gRB7^@m)7gZ5',
  database: 'altv_auth',
  connectionLimit: 5
});

module.exports = {
  pool
};