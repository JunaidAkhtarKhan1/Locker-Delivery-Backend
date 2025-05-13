const mysql = require("mysql");
const fs = require("fs");

const ca = fs.readFileSync("DigiCertGlobalRootCA.crt.pem");

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  // ssl: {
  //   ca: ca,
  // },
});

exports.connection = connection;
