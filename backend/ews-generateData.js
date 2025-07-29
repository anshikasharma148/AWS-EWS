// ews-generateData.js

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Add new EWS tables here
const locations = ['ghastoli', 'lambagad', 'vasudhara', 'binakuli', 'mana', 'khiro'];


function generateRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function insertRandomData() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.EWS_DB_HOST,
      user: process.env.EWS_DB_USER,
      password: process.env.EWS_DB_PASSWORD,
      database: process.env.EWS_DB_NAME,
    });

    for (const location of locations) {
      try {
        const query = `
          INSERT INTO ${location} 
          (water_level, water_velocity, water_discharge, PV_voltage, battery_charge_curr, Inv_AC_load)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
          generateRandomFloat(0.5, 5.0),
          generateRandomFloat(0.1, 3.0),
          generateRandomFloat(10, 100),
          generateRandomFloat(10, 18),
          generateRandomFloat(0, 10),
          generateRandomFloat(50, 500),
        ];

        await connection.execute(query, values);
        console.log(`✅ EWS (${location}) - data inserted`);
      } catch (error) {
        console.error(`❌ EWS (${location}) error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run immediately once
insertRandomData()
  .then(() => {
    console.log('⏳ Starting periodic insertions every 5 mins...\n');
    setInterval(insertRandomData, 5 * 60 * 1000); // 5 mins
  })
  .catch((err) => {
    console.error('❌ Initial run failed:', err.message);
  });
	
