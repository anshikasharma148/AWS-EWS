import mysql from 'mysql2/promise';

export async function GET() {
  let awsConnection, ewsConnection;

  try {
    // Connect to AWS DB for weather data
    awsConnection = await mysql.createConnection({
      host: '192.168.5.60',
      user: 'aws_user',
      password: 'ubuntu@123',
      database: 'AWS',
    });

    const awsTables = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];
    const weatherData = [];

    for (const table of awsTables) {
      const [rows] = await awsConnection.execute(
        `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT 1`
      );
      if (rows.length > 0) {
        weatherData.push({
          station: table,
          timestamp: rows[0].timestamp,
          temperature: parseFloat(rows[0].temperature),
          windSpeed: parseFloat(rows[0].wind_speed),
          windDirection: parseFloat(rows[0].wind_direction),
          pressure: parseFloat(rows[0].pressure),
          humidity: parseFloat(rows[0].humidity),
          rain: parseFloat(rows[0].rain),
          snow: parseFloat(rows[0].snow),
        });
      }
    }

    // Connect to EWS DB for water data (3 stations)
    ewsConnection = await mysql.createConnection({
      host: '192.168.5.60',
      user: 'ews_user',
      password: 'ubuntu@123',
      database: 'EWS',
    });

    const ewsStations = ['ghastoli', 'vasudhara', 'lambagad'];
    const waterLevels = [];
    const waterVelocities = [];

    for (const station of ewsStations) {
      const [rows] = await ewsConnection.execute(
        `SELECT water_level, water_velocity FROM \`${station}\` ORDER BY timestamp DESC LIMIT 1`
      );

      if (rows.length > 0) {
        waterLevels.push(parseFloat(rows[0].water_level));
        waterVelocities.push(parseFloat(rows[0].water_velocity));
      } else {
        waterLevels.push(0);
        waterVelocities.push(0);
      }
    }

    return Response.json({
      success: true,
      data: {
        waterLevels,
        waterVelocities,
        weatherData,
      },
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (awsConnection) await awsConnection.end();
    if (ewsConnection) await ewsConnection.end();
  }
}
