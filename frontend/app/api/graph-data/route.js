import mysql from 'mysql2/promise';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Get the 'days' parameter from the query string, or default to 3 days
  const days = parseInt(searchParams.get('days')) || 3;

  const now = new Date();
  const since = new Date(now);
  since.setDate(now.getDate() - days); // Subtract 'days' from current date

  const connection = await mysql.createConnection({
    host: '192.168.5.60',
    user: 'aws_user',
    password: 'ubuntu@123',
    database: 'AWS',
  });

  try {
    const tables = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];
    const result = {};

    for (const table of tables) {
      const [rows] = await connection.execute(
        `SELECT 
          DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS time,
          temperature, humidity, pressure, wind_speed, rain, snow
        FROM \`${table}\`
        WHERE timestamp >= ?
        ORDER BY timestamp ASC`,
        [since]
      );

      result[table] = rows;
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching graph data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  } finally {
    await connection.end();
  }
}
