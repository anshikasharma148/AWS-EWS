import mysql from 'mysql2/promise';

export async function GET(request) {
  try {
    const connection = await mysql.createConnection({
      host: '192.168.0.106',
      user: 'ews_user',
      password: 'ubuntu@123',
      database: 'EWS',
    });

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'Today';
    const stations = ['ghastoli', 'vasudhara', 'lambagad'];
    const results = {};

    // Compute fromDate and toDate
    const now = new Date();
    let fromDate = new Date(now);
    let toDate = new Date(now);

    switch (period) {
      case 'Yesterday':
        fromDate.setDate(now.getDate() - 1);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(now.getDate() - 1);
        toDate.setHours(23, 59, 59, 999);
        break;
      case '3 days':
        fromDate.setDate(now.getDate() - 2);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case '7 days':
        fromDate.setDate(now.getDate() - 6);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case '30 days':
        fromDate.setDate(now.getDate() - 29);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case 'Today':
      default:
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
    }

    for (const station of stations) {
      const [rows] = await connection.execute(
        `SELECT water_level, water_velocity, water_discharge, timestamp 
         FROM ${station}
         WHERE timestamp BETWEEN ? AND ?
         ORDER BY timestamp ASC`,
        [fromDate, toDate]
      );

      results[station] = rows.map(row => ({
        ...row,
        timestamp: new Date(row.timestamp).toISOString(),
      }));
    }

    await connection.end();

    return Response.json({ success: true, data: results });
  } catch (error) {
    console.error('Graph Data API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
