const mysql = require('mysql2/promise');
require('dotenv').config();

// AWS DB connection
const awsDB = mysql.createPool({
  host: process.env.AWS_DB_HOST,
  user: process.env.AWS_DB_USER,
  password: process.env.AWS_DB_PASSWORD,
  database: process.env.AWS_DB_NAME,
});

// EWS DB connection
const ewsDB = mysql.createPool({
  host: process.env.EWS_DB_HOST,
  user: process.env.EWS_DB_USER,
  password: process.env.EWS_DB_PASSWORD,
  database: process.env.EWS_DB_NAME,
});

module.exports = {
  awsDB,
  ewsDB,
};

