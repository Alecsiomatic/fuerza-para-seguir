const pool = require('./config/database');

async function createTable() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content LONGTEXT NOT NULL,
        media_url VARCHAR(500),
        media_type ENUM('image', 'video', 'youtube') DEFAULT 'image',
        youtube_id VARCHAR(50),
        author VARCHAR(100) DEFAULT 'Fuerza Para Seguir',
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        publish_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        views INT DEFAULT 0,
        INDEX idx_branch (branch),
        INDEX idx_status (status),
        INDEX idx_publish_date (publish_date),
        INDEX idx_slug (slug),
        UNIQUE KEY unique_slug_branch (slug, branch)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla blogs creada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTable();
