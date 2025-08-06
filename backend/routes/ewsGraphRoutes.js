const express = require('express');
const router = express.Router();
const { ewsDB } = require('../db'); // make sure ewsDB is defined in your db.js

const ewsTables = ['ghastoli', 'lambagad', 'sensor_data', 'vasudhara', 'binakuli', 'mana', 'khiro'];

// Return midnight date N days ago
function getMidnightNDaysAgo(n) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - n);
  return date;
}

router.get('/', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 1;
    let startDate, endDate;

    if (days === 1) {
      // Today
      startDate = getMidnightNDaysAgo(0);
      endDate = getMidnightNDaysAgo(-1); // tomorrow
    } else if (days === 2) {
      // Yesterday
      startDate = getMidnightNDaysAgo(1);
      endDate = getMidnightNDaysAgo(0);
    } else {
      // Last N days (including today)
      startDate = getMidnightNDaysAgo(days - 1);
      endDate = getMidnightNDaysAgo(-1);
    }

    const allData = {};

    for (const table of ewsTables) {
      const [rows] = await ewsDB.query(
        `SELECT * FROM \`${table}\` WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp ASC`,
        [startDate, endDate]
      );
      allData[table] = rows;
    }

    res.json(allData);
  } catch (err) {
    console.error('Error fetching EWS graph data:', err.message);
    res.status(500).json({ error: 'Failed to fetch EWS graph data' });
  }
});

module.exports = router;

