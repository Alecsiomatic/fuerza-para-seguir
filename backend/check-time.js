const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  console.log('=== SESIONES RECIENTES ===');
  const [sessions] = await pool.execute(
    'SELECT session_id, branch, total_time_seconds, page_views, max_scroll_depth FROM sessions ORDER BY last_activity DESC LIMIT 10'
  );
  sessions.forEach(r => console.log(
    r.session_id?.slice(0,8) + '...', 
    '| Branch:', r.branch, 
    '| Tiempo:', r.total_time_seconds, 's',
    '| Pages:', r.page_views,
    '| Scroll:', r.max_scroll_depth + '%'
  ));
  
  console.log('\n=== PAGE TIME TRACKING ===');
  const [tracking] = await pool.execute(
    'SELECT * FROM page_time_tracking ORDER BY created_at DESC LIMIT 10'
  );
  if (tracking.length === 0) {
    console.log('No hay registros de page_time_tracking');
  } else {
    tracking.forEach(r => console.log(r));
  }
  
  console.log('\n=== PROMEDIO DE TIEMPO ===');
  const [avg] = await pool.execute(
    'SELECT AVG(total_time_seconds) as avg_time, MAX(total_time_seconds) as max_time, COUNT(*) as total FROM sessions WHERE total_time_seconds > 0'
  );
  console.log('Promedio:', avg[0].avg_time, 's | Max:', avg[0].max_time, 's | Sesiones con tiempo:', avg[0].total);
  
  await pool.end();
}

check().catch(console.error);
