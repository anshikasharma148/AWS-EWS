require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { awsDB, ewsDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Start AWS and EWS data generation
require('./aws-generateData');
require('./ews-generateData');

// AWS Tables
const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];
const ewsTables = ['ghastoli', 'lambagad', 'sensor_data', 'vasudhara'];

// 🔹 Fetch data for all AWS tables
app.get('/api/aws', async (req, res) => {
  try {
    const results = {};

    for (const table of awsTables) {
      const [rows] = await awsDB.query(
        `SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 50`
      );
      results[table] = rows;
    }

    res.json(results);
  } catch (err) {
    console.error('Error fetching AWS data:', err);
    res.status(500).json({ error: 'Failed to fetch AWS data' });
  }
});

// 🔹 Fetch data for all EWS tables
app.get('/api/ews', async (req, res) => {
  try {
    const results = {};

    for (const table of ewsTables) {
      const [rows] = await ewsDB.query(
        `SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 50`
      );
      results[table] = rows;
    }

    res.json(results);
  } catch (err) {
    console.error('Error fetching EWS data:', err);
    res.status(500).json({ error: 'Failed to fetch EWS data' });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('🌐 AWS-EWS Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

