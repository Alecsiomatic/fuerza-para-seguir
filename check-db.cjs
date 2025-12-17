const mysql = require('mysql2/promise');

async function checkDB() {
  const pool = mysql.createPool({
    host: 'srv440.hstgr.io',
    user: 'u191251575_fuerza',
    password: 'FuerzaParaSeguir2024!',
    database: 'u191251575_fuerza',
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    console.log('=== EVENTOS POR TIPO Y SUCURSAL ===');
    const [events] = await pool.execute('SELECT event_type, branch, COUNT(*) as total FROM events GROUP BY event_type, branch');
    console.table(events);

    console.log('\n=== VISITAS POR SUCURSAL ===');
    const [visits] = await pool.execute('SELECT branch, COUNT(*) as total FROM visits GROUP BY branch');
    console.table(visits);

    console.log('\n=== ESTRUCTURA DE TABLA EVENTS ===');
    const [cols] = await pool.execute('DESCRIBE events');
    console.table(cols);

    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDB();
