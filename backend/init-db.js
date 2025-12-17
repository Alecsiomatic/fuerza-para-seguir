const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Conectado exitosamente');

    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Ejecutando schema.sql...');
    await connection.query(schema);
    console.log('✅ Tablas creadas exitosamente');

    // Verificar que las tablas existen
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📊 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log('  -', Object.values(table)[0]);
    });

    // Verificar datos en analytics_summary
    const [rows] = await connection.query('SELECT * FROM analytics_summary');
    console.log('\n📈 Métricas en analytics_summary:');
    if (rows.length === 0) {
      console.log('  ⚠️  No hay métricas. Ejecutando inicialización...');
      // Las métricas deberían haberse insertado con el schema
    } else {
      rows.forEach(row => {
        console.log(`  - ${row.metric_name}: ${row.metric_value}`);
      });
    }

    console.log('\n✅ Base de datos inicializada correctamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('No se pudo conectar a la base de datos. Verifica:');
      console.error('  - Host:', process.env.DB_HOST);
      console.error('  - Puerto:', process.env.DB_PORT || 3306);
      console.error('  - Usuario:', process.env.DB_USER);
      console.error('  - Base de datos:', process.env.DB_NAME);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
