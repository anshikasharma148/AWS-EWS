// routes/aws-station.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Valid station tables (update as needed)
const validStations = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];

router.get('/:station_name', async (req, res) => {
  const stationName = req.params.station_name;

  if (!validStations.includes(stationName)) {
    return res.status(400).json({ error: 'Invalid station name' });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM \`${stationName}\` ORDER BY timestamp DESC LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for this station' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching data for station ${stationName}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
