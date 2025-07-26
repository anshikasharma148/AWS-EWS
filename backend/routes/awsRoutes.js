// backend/routes/awsRoutes.js
const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];

// Get all data from specific AWS table
router.get('/:station', (req, res) => {
  const { station } = req.params;
  if (!awsTables.includes(station)) {
    return res.status(400).json({ error: 'Invalid AWS station' });
  }
  awsDB.query(`SELECT * FROM ${station} ORDER BY timestamp DESC LIMIT 50`)
    .then(([results]) => res.json(results))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get combined data from all AWS tables
router.get('/all/data', async (req, res) => {
  try {
    const allData = {};
    for (const table of awsTables) {
      const [rows] = await awsDB.query(`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 50`);
      allData[table] = rows;
    }
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
