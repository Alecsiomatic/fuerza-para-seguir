const pool = require('./config/database');

async function run() {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tablas existentes:');
    console.log(tables);
    
    // Ver estructura de visits
    const [columns] = await pool.query('DESCRIBE visits');
    console.log('\nEstructura de visits:');
    console.log(columns);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();
