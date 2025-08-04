require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { awsDB, ewsDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const awsRoutes = require('./routes/awsRoutes');
const ewsRoutes = require('./routes/ewsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const awsStationRoute = require('./routes/aws-station');
const awsGraphRoute = require('./routes/awsGraphRoutes'); // ✅ New
const awsStationAllDataRoute = require('./routes/awsStationAllData');

// Middleware
app.use(cors());
app.use(express.json());

// Start mock data generation
require('./aws-generateData');
require('./ews-generateData');

// AWS and EWS Table Names
const awsTables = ['binakuli', 'mana', 'vasudhara', 'vishnu_prayag'];
const ewsTables = ['ghastoli', 'lambagad', 'sensor_data', 'vasudhara', 'binakuli', 'mana', 'khiro'];

// Routes
app.use('/api/aws', awsRoutes);
app.use('/api/ews', ewsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/aws-station', awsStationRoute);
app.use('/api/aws-graph', awsGraphRoute); // ✅ Added
app.use('/api/aws-all', awsStationAllDataRoute);

// Fetch recent data for all AWS tables
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

// Fetch recent data for all EWS tables
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

// Root route
app.get('/', (req, res) => {
  res.send('🌐 AWS-EWS Backend is Running!');
});

// 🔁 PING SERVICE — keeps the server and DB awake
setInterval(async () => {
  try {
    const fetch = (await import('node-fetch')).default;
    await fetch('https://aws-ews.onrender.com/');
    console.log(`[PING] Server pinged at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('[PING] Failed to ping:', err.message);
  }
}, 5 * 60 * 1000); // every 5 minutes

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

