require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  const [result] = await pool.execute(
    'UPDATE call_clicks SET branch = ? WHERE branch IS NULL',
    ['corregidora']
  );
  console.log('Call clicks migrados a corregidora:', result.affectedRows);
  
  // Verificar totales
  const [totals] = await pool.query('SELECT branch, COUNT(*) as count FROM call_clicks GROUP BY branch');
  console.log('Llamadas por sucursal:', totals);
  
  await pool.end();
})();
