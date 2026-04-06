const pool = require('./config/database');

async function fixBlogDate() {
  try {
    await pool.execute('UPDATE blogs SET publish_date = NOW() WHERE id = 4');
    console.log('✅ Fecha de blog actualizada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixBlogDate();
