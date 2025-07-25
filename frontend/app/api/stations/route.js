import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: '192.168.0.106',
    user: 'aws_user',
    password: 'ubuntu@123',
    database: 'AWS',
  });

  try {
    const tables = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];
    const stationData = [];

    for (const table of tables) {
      const [rows] = await connection.execute(`SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT 1`);
      if (rows.length > 0) {
        stationData.push({
          ...rows[0],
          name: table
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase()), // Format name nicely
        });
      }
    }

    return new Response(JSON.stringify(stationData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching station data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  } finally {
    await connection.end();
  }
}
