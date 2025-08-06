const express = require('express');
const router = express.Router();
const { ewsDB } = require('../db'); // Make sure ewsDB is defined in db.js

// List of valid EWS tables
const ewsTables = ['ghastoli', 'lambagad', 'sensor_data', 'vasudhara', 'binakuli', 'mana', 'khiro'];

// GET all data from a specific EWS station
router.get('/:station', async (req, res) => {
  const station = req.params.station.toLowerCase();

  if (!ewsTables.includes(station)) {
    return res.status(400).json({ error: 'Invalid EWS station name' });
  }

  try {
    const [rows] = await ewsDB.query(
      `SELECT * FROM \`${station}\` ORDER BY timestamp ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(`Error fetching data for EWS station ${station}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch EWS station data' });
  }
});

module.exports = router;

