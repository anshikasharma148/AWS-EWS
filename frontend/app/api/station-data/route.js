import mysql from 'mysql2/promise';

export async function GET(req) {
  const url = new URL(req.url);
  const stationName = url.searchParams.get('station_name');

  if (!stationName) {
    return new Response(JSON.stringify({ error: 'station_name is required' }), {
      status: 400,
    });
  }

  const validStations = ['vishnu_prayag', 'mana', 'vasudhara', 'binakuli'];
  if (!validStations.includes(stationName)) {
    return new Response(JSON.stringify({ error: 'Invalid station name' }), {
      status: 400,
    });
  }

  try {
    const connection = await mysql.createConnection({
      host: '192.168.5.60',
      user: 'aws_user',
      password: 'ubuntu@123',
      database: 'AWS',
    });

    const [rows] = await connection.execute(
      `SELECT * FROM \`${stationName}\` ORDER BY id ASC`
    );

    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DB Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
