const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

(async () => {
  try {
    const [cols] = await pool.query('DESCRIBE events');
    console.log('Columnas actuales:', cols.map(c => c.Field).join(', '));
    
    // Verificar si branch existe
    const hasBranch = cols.some(c => c.Field === 'branch');
    if (!hasBranch) {
      await pool.query('ALTER TABLE events ADD COLUMN branch VARCHAR(100) DEFAULT NULL');
      console.log('✅ Columna branch agregada exitosamente');
    } else {
      console.log('✅ Columna branch ya existe');
    }

    // Verificar estado final
    const [newCols] = await pool.query('DESCRIBE events');
    console.log('Columnas finales:', newCols.map(c => c.Field).join(', '));
    
    // Probar inserción
    const [result] = await pool.execute(
      'INSERT INTO events (session_id, event_type, event_data, branch) VALUES (?, ?, ?, ?)',
      ['test-session-fix', 'contact', JSON.stringify({source: 'test-fix'}), 'corregidora']
    );
    console.log('✅ Inserción de prueba exitosa, ID:', result.insertId);
    
    // Verificar que se insertó
    const [events] = await pool.query('SELECT * FROM events ORDER BY id DESC LIMIT 3');
    console.log('Últimos eventos:', events.map(e => `${e.event_type}(${e.branch})`).join(', '));

    await pool.end();
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
