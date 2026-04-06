const pool = require('./config/database');

async function fixSessions() {
  try {
    console.log('Adding missing columns to sessions table...');
    
    // Try to add each column, ignore if exists
    const columns = [
      'ALTER TABLE sessions ADD COLUMN utm_source VARCHAR(255)',
      'ALTER TABLE sessions ADD COLUMN utm_medium VARCHAR(255)', 
      'ALTER TABLE sessions ADD COLUMN utm_campaign VARCHAR(255)'
    ];

    for (const sql of columns) {
      try {
        await pool.execute(sql);
        console.log('✅ Added column');
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log('Column already exists, skipping');
        } else {
          console.log('Note:', e.message);
        }
      }
    }

    console.log('✅ Sessions table fixed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixSessions();
