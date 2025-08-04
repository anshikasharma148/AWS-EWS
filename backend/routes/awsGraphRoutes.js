const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];

// Get start date (n days ago, at 00:00)
function getStartDateNDaysAgo(n) {
  const date = new Date();
  date.setHours(0, 0, 0, 0); // today at 00:00
  date.setDate(date.getDate() - (n - 1)); // n=1 => today, n=2 => yesterday, etc.
  return date;
}

// Get end date (start of the next day after range)
function getEndDateNDaysAgo(n) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (n - 2)); // exclusive upper bound
  return date;
}

router.get('/', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 1;
    const startDate = getStartDateNDaysAgo(days);
    const endDate = getEndDateNDaysAgo(1); // always up to today at 00:00

    const allData = {};

    for (const table of awsTables) {
      const [rows] = await awsDB.query(
        `SELECT * FROM \`${table}\` WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp ASC`,
        [startDate, endDate]
      );
      allData[table] = rows;
    }

    res.json(allData);
  } catch (err) {
    console.error('Error fetching AWS graph data:', err.message);
    res.status(500).json({ error: 'Failed to fetch AWS graph data' });
  }
});

module.exports = router;

