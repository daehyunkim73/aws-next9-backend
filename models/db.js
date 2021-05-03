const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const { logger, error_logger } = require("../loger");

const db_info = {
  host: "address",
  port: "3306",
  user: "administrator",
  password: "password",
  database: process.env.DB_NAME,
  multipleStatements: true,
};

const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
  host: "address",
  user: 'administrator',
  password: "password",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


module.exports = {
  init: () => {
    return mysql.createConnection(db_info);
  },
  connect: (conn) => {
    conn.connect((err) => {
      if (err) {
        error_logger.error("db connection error:err", err);
        console.error("mysql connection error:", err);
      } else {
        logger.info("mysql is connected successfully");
        console.log("mysql is connected successfully");
      }
    });
  },
  pool: () => {
    return pool;
  }

};
