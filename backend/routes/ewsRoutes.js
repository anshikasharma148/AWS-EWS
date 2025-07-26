// backend/routes/ewsRoutes.js
const express = require('express');
const router = express.Router();
const { ewsDB } = require('../db');

const ewsTables = ['ghastoli', 'lambagad', 'sensor_data', 'vasudhara'];

// Get data from specific EWS table
router.get('/:station', (req, res) => {
  const { station } = req.params;
  if (!ewsTables.includes(station)) {
    return res.status(400).json({ error: 'Invalid EWS station' });
  }
  ewsDB.query(`SELECT * FROM ${station} ORDER BY timestamp DESC LIMIT 50`)
    .then(([results]) => res.json(results))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get data from all EWS tables
router.get('/all/data', async (req, res) => {
  try {
    const allData = {};
    for (const table of ewsTables) {
      const [rows] = await ewsDB.query(`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 50`);
      allData[table] = rows;
    }
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
