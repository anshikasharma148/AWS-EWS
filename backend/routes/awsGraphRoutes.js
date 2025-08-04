const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];

// Returns date at midnight, N days ago
function getMidnightNDaysAgo(n) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - n);
  return date;
}

router.get('/', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 1;

    const startDate = getMidnightNDaysAgo(days - 1);
    const endDate = getMidnightNDaysAgo(days - 2);

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

