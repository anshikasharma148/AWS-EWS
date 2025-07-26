const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

// Valid station tables
const validStations = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];

// Helper function to build WHERE clause based on range
function getDateRangeCondition(range) {
  switch (range) {
    case 'today':
      return `DATE(timestamp) = CURDATE()`;
    case 'yesterday':
      return `DATE(timestamp) = CURDATE() - INTERVAL 1 DAY`;
    case '3days':
      return `timestamp >= NOW() - INTERVAL 3 DAY`;
    case '7days':
      return `timestamp >= NOW() - INTERVAL 7 DAY`;
    case '30days':
      return `timestamp >= NOW() - INTERVAL 30 DAY`;
    default:
      return null; // for latest single data fetch
  }
}

router.get('/:station_name', async (req, res) => {
  const stationName = req.params.station_name;
  const range = req.query.range; // Optional query param like ?range=7days

  if (!validStations.includes(stationName)) {
    return res.status(400).json({ error: 'Invalid station name' });
  }

  try {
    let query = '';
    let values = [];

    if (range && getDateRangeCondition(range)) {
      const condition = getDateRangeCondition(range);
      query = `SELECT * FROM \`${stationName}\` WHERE ${condition} ORDER BY timestamp DESC`;
    } else {
      query = `SELECT * FROM \`${stationName}\` ORDER BY timestamp DESC LIMIT 1`;
    }

    const [rows] = await awsDB.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for this station and range' });
    }

    res.json(rows);
  } catch (error) {
    console.error(`Error fetching data for station ${stationName}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

