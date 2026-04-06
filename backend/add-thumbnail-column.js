// Script para agregar columna thumbnail_url a la tabla blogs
const pool = require('./config/database');

async function addThumbnailColumn() {
  try {
    console.log('Agregando columna thumbnail_url a blogs...');
    
    // Verificar si la columna ya existe
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'u191251575_fuerza' 
      AND TABLE_NAME = 'blogs' 
      AND COLUMN_NAME = 'thumbnail_url'
    `);
    
    if (columns.length > 0) {
      console.log('✅ La columna thumbnail_url ya existe');
    } else {
      await pool.execute(`
        ALTER TABLE blogs 
        ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER media_url
      `);
      console.log('✅ Columna thumbnail_url agregada exitosamente');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addThumbnailColumn();
