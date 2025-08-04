const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];

// Helper to get date N days ago
function getDateNDaysAgo(n) {
  const date = new Date();
  date.setHours(0, 0, 0, 0); // start of today
  date.setDate(date.getDate() - (n - 1)); // n=1 => today, n=2 => yesterday, etc.
  return date;
}

// Get filtered data from all AWS tables based on `days`
router.get('/', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 1; // default to 1 (today)
    const sinceDate = getDateNDaysAgo(days);

    const allData = {};

    for (const table of awsTables) {
      const [rows] = await awsDB.query(
        `SELECT * FROM \`${table}\` WHERE timestamp >= ? ORDER BY timestamp ASC`,
        [sinceDate]
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

