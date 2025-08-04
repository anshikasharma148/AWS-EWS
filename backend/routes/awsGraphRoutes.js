const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];

// Get all data from all AWS tables (no date filter)
router.get('/', async (req, res) => {
  try {
    const allData = {};

    for (const table of awsTables) {
      const [rows] = await awsDB.query(`SELECT * FROM ${table} ORDER BY timestamp ASC`);
      allData[table] = rows;
    }

    res.json(allData);
  } catch (err) {
    console.error('Error fetching AWS graph data:', err.message);
    res.status(500).json({ error: 'Failed to fetch AWS graph data' });
  }
});

module.exports = router;

