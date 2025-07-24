const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'anshika-sharma',
  password: 'ubuntu@123',
  database: 'AWS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
