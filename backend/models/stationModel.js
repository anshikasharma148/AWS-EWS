const db = require('../config/db');

exports.getAllStations = async () => {
  const [rows] = await db.query('SELECT * FROM stations');
  return rows;
};

exports.getStationByName = async (name) => {
  const [rows] = await db.query('SELECT * FROM stations WHERE name = ?', [name]);
  return rows[0];
};
