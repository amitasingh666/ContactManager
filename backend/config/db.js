const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const promisePool = pool.promise();

promisePool
  .getConnection()
  .then(() => console.log("MySQL Connected"))
  .catch((err) => console.log("MySQL Error:", err.message));

module.exports = promisePool;
