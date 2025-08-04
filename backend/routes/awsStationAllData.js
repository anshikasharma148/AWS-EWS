const express = require('express');
const router = express.Router();
const { awsDB } = require('../db');

// List of valid AWS tables
const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];

// GET all data from a specific AWS station
router.get('/:station', async (req, res) => {
  const station = req.params.station.toLowerCase();

  if (!awsTables.includes(station)) {
    return res.status(400).json({ error: 'Invalid AWS station name' });
  }

  try {
    const [rows] = await awsDB.query(
      `SELECT * FROM \`${station}\` ORDER BY timestamp ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(`Error fetching data for ${station}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch station data' });
  }
});

module.exports = router;

