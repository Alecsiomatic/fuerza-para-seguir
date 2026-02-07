const pool = require('./config/database');

async function run() {
  try {
    const [columns] = await pool.query('DESCRIBE visits');
    console.log('Columnas de visits:');
    console.log(columns.map(c => c.Field).join(', '));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();
