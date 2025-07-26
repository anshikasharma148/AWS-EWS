// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { awsDB, ewsDB } = require('../db');

const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];
const ewsTables = ['ghastoli', 'lambagad', 'sensor_data', 'vasudhara'];

// Return one latest record from each table in AWS and EWS
router.get('/', async (req, res) => {
  try {
    const summary = {
      AWS: {},
      EWS: {}
    };

    for (const table of awsTables) {
      const [rows] = await awsDB.query(`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 1`);
      summary.AWS[table] = rows[0] || null;
    }

    for (const table of ewsTables) {
      const [rows] = await ewsDB.query(`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 1`);
      summary.EWS[table] = rows[0] || null;
    }

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
