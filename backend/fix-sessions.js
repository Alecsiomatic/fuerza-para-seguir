const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixSessions() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv440.hstgr.io',
    user: process.env.DB_USER || 'u191251575_fuerza',
    password: process.env.DB_PASSWORD || 'Cerounocero.com20182417',
    database: process.env.DB_NAME || 'u191251575_fuerza',
    waitForConnections: true,
    connectionLimit: 5,
  });

  console.log('Conectando a la base de datos...');

  const columnsToAdd = [
    { name: 'referrer_source', type: 'VARCHAR(255) DEFAULT NULL' },
    { name: 'ip_address', type: 'VARCHAR(45) DEFAULT NULL' },
    { name: 'user_agent', type: 'TEXT DEFAULT NULL' },
  ];

  for (const col of columnsToAdd) {
    try {
      await pool.execute(`ALTER TABLE sessions ADD COLUMN ${col.name} ${col.type}`);
      console.log(`✅ Columna ${col.name} agregada`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`⚠️ Columna ${col.name} ya existe`);
      } else {
        console.error(`❌ Error agregando ${col.name}:`, e.message);
      }
    }
  }

  // Verificar estructura actual
  const [columns] = await pool.execute('DESCRIBE sessions');
  console.log('\nEstructura actual de la tabla sessions:');
  columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));

  await pool.end();
  console.log('\n✅ Migración completada');
  process.exit(0);
}

fixSessions().catch(console.error);
