require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { awsDB, ewsDB } = require('./db');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Start AWS and EWS data generation
require('./aws-generateData');      // runs aws insert and interval
require('./ews-generateData');      // runs ews insert and interval

// AWS API route
// AWS
app.get('/api/aws', (req, res) => {
  awsDB.query('SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 50')
    .then(([results]) => res.json(results))
    .catch(err => {
      console.error('Error fetching AWS data:', err);
      res.status(500).json({ error: 'Failed to fetch AWS data' });
    });
});

// EWS
app.get('/api/ews', (req, res) => {
  ewsDB.query('SELECT * FROM river_data ORDER BY timestamp DESC LIMIT 50')
    .then(([results]) => res.json(results))
    .catch(err => {
      console.error('Error fetching EWS data:', err);
      res.status(500).json({ error: 'Failed to fetch EWS data' });
    });
});

app.get('/', (req, res) => {
  res.send('🌐 AWS-EWS Backend is Running!');
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

