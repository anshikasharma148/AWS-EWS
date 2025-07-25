import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: '192.168.0.106',
      user: 'ews_user',
      password: 'ubuntu@123',
      database: 'EWS',
    });

    const stations = ['ghastoli', 'vasudhara', 'lambagad'];
    const results = {};

    for (const station of stations) {
      const [rows] = await connection.execute(
        `SELECT * FROM ${station} ORDER BY timestamp DESC LIMIT 1`
      );
      results[station] = rows[0] || null;
    }

    await connection.end();

    return Response.json({ success: true, data: results });
  } catch (error) {
    console.error('EWS API Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
