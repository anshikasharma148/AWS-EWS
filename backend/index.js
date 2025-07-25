require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { awsConnection, ewsConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// AWS API route
app.get('/api/aws', (req, res) => {
  awsConnection.query('SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 50', (err, results) => {
    if (err) {
      console.error('Error fetching AWS data:', err);
      return res.status(500).json({ error: 'Failed to fetch AWS data' });
    }
    res.json(results);
  });
});

// EWS API route
app.get('/api/ews', (req, res) => {
  ewsConnection.query('SELECT * FROM river_data ORDER BY timestamp DESC LIMIT 50', (err, results) => {
    if (err) {
      console.error(' Error fetching EWS data:', err);
      return res.status(500).json({ error: 'Failed to fetch EWS data' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
