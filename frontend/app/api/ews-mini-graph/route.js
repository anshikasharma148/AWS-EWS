import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: '192.168.5.60',
      user: 'ews_user',
      password: 'ubuntu@123',
      database: 'EWS',
    });

    const stations = ['ghastoli', 'vasudhara', 'lambagad'];
    const results = {};

    for (const station of stations) {
      const [rows] = await connection.execute(
        `
        SELECT 
          time_group,
          MAX(water_level) AS water_level,
          MAX(water_velocity) AS water_velocity,
          MAX(water_discharge) AS water_discharge
        FROM (
          SELECT 
            FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(timestamp) / 600) * 600) AS time_group,
            water_level,
            water_velocity,
            water_discharge
          FROM ${station}
          WHERE timestamp >= NOW() - INTERVAL 2 HOUR
        ) AS sub
        GROUP BY time_group
        ORDER BY time_group DESC
        LIMIT 6
        `
      );

      // Sort in ASCENDING order for chart display
      const sortedRows = rows.sort((a, b) => new Date(a.time_group) - new Date(b.time_group));

      results[station] = sortedRows.map(row => ({
        time: new Date(row.time_group).toISOString(), // send full ISO string
        level: row.water_level,
        velocity: row.water_velocity,
        discharge: row.water_discharge,
      }));
    }

    await connection.end();

    return Response.json({ success: true, data: results });
  } catch (error) {
    console.error('Mini Graph API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
