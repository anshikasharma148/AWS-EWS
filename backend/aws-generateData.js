const { awsDB } = require('./db');

const awsStations = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];

function generateAWSData() {
  return {
    temperature: (Math.random() * 35).toFixed(2),
    pressure: (950 + Math.random() * 50).toFixed(2),
    humidity: (30 + Math.random() * 70).toFixed(2),
    wind_speed: (Math.random() * 15).toFixed(2),
    wind_direction: Math.floor(Math.random() * 360),
    rain: (Math.random() * 10).toFixed(2),
    snow: (Math.random() * 5).toFixed(2),
    timestamp: new Date()
  };
}

async function insertAWSData() {
  for (const station of awsStations) {
    const data = generateAWSData();
    try {
      await awsDB.execute(
        `INSERT INTO ${station} (temperature, pressure, humidity, wind_speed, wind_direction, rain, snow, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.temperature,
          data.pressure,
          data.humidity,
          data.wind_speed,
          data.wind_direction,
          data.rain,
          data.snow,
          data.timestamp
        ]
      );
      console.log(`✅ Inserted into AWS table: ${station}`);
    } catch (err) {
      console.error(`❌ AWS (${station}) error:`, err.message);
    }
  }
}

// Run once immediately, then every 5 minutes
insertAWSData();
setInterval(insertAWSData, 5 * 60 * 1000);

