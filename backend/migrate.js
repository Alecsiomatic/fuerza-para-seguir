const pool = require('./config/database');

async function migrate() {
  const migrations = [
    // Agregar columnas a visits
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS device_type VARCHAR(20) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS browser VARCHAR(50) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS browser_version VARCHAR(20) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS os VARCHAR(50) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS os_version VARCHAR(20) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS screen_width INT DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS screen_height INT DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS connection_type VARCHAR(20) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_term VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_content VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS page_path VARCHAR(255) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS referrer_source VARCHAR(50) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS landing_page VARCHAR(255) DEFAULT NULL`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_returning BOOLEAN DEFAULT FALSE`,
    
    // Agregar columnas a sessions
    `ALTER TABLE sessions ADD COLUMN IF NOT EXISTS max_scroll_depth INT DEFAULT 0`,
    
    // Agregar columnas a page_time_tracking si falta page_url
    `ALTER TABLE page_time_tracking ADD COLUMN IF NOT EXISTS page_url VARCHAR(255) DEFAULT NULL`,
    
    // Crear tabla sessions si no existe
    `CREATE TABLE IF NOT EXISTS sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL UNIQUE,
      branch VARCHAR(50),
      first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      page_views INT DEFAULT 1,
      total_time_seconds INT DEFAULT 0,
      converted BOOLEAN DEFAULT FALSE,
      conversion_type VARCHAR(50),
      device_type VARCHAR(20),
      browser VARCHAR(50),
      os VARCHAR(50),
      country VARCHAR(50),
      city VARCHAR(100),
      landing_page VARCHAR(255),
      exit_page VARCHAR(255),
      utm_source VARCHAR(100),
      utm_campaign VARCHAR(100)
    )`,
    
    // Crear tabla page_time_tracking
    `CREATE TABLE IF NOT EXISTS page_time_tracking (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      branch VARCHAR(50),
      page_path VARCHAR(255),
      time_on_page_seconds INT DEFAULT 0,
      scroll_depth INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_session (session_id),
      INDEX idx_branch (branch)
    )`,
    
    // Crear tabla click_heatmap
    `CREATE TABLE IF NOT EXISTS click_heatmap (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      branch VARCHAR(50),
      page_path VARCHAR(255),
      element_id VARCHAR(100),
      element_class VARCHAR(255),
      element_tag VARCHAR(50),
      x_position INT,
      y_position INT,
      viewport_width INT,
      viewport_height INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_branch (branch)
    )`,
    
    // Crear tabla js_errors
    `CREATE TABLE IF NOT EXISTS js_errors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      branch VARCHAR(50),
      error_message TEXT,
      error_stack TEXT,
      page_path VARCHAR(255),
      browser VARCHAR(50),
      os VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_branch (branch)
    )`,
    
    // Crear tabla hourly_metrics
    `CREATE TABLE IF NOT EXISTS hourly_metrics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch VARCHAR(50),
      hour_timestamp DATETIME,
      visits INT DEFAULT 0,
      unique_visitors INT DEFAULT 0,
      call_clicks INT DEFAULT 0,
      avg_time_on_page INT DEFAULT 0,
      bounce_rate DECIMAL(5,2) DEFAULT 0,
      UNIQUE KEY unique_hour (branch, hour_timestamp),
      INDEX idx_branch (branch)
    )`,
    
    // Crear tabla daily_metrics
    `CREATE TABLE IF NOT EXISTS daily_metrics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch VARCHAR(50),
      date DATE,
      visits INT DEFAULT 0,
      unique_visitors INT DEFAULT 0,
      call_clicks INT DEFAULT 0,
      form_submissions INT DEFAULT 0,
      avg_time_on_page INT DEFAULT 0,
      avg_scroll_depth INT DEFAULT 0,
      bounce_rate DECIMAL(5,2) DEFAULT 0,
      top_referrer VARCHAR(255),
      top_device VARCHAR(20),
      UNIQUE KEY unique_day (branch, date),
      INDEX idx_branch (branch)
    )`
  ];

  console.log('Iniciando migraciones...\n');

  for (const sql of migrations) {
    try {
      // MariaDB no soporta "IF NOT EXISTS" para columnas, usamos try/catch
      await pool.query(sql);
      console.log('✅ ' + sql.substring(0, 60) + '...');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME' || error.message.includes('Duplicate column')) {
        console.log('⏭️  Columna ya existe: ' + sql.substring(0, 60) + '...');
      } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('⏭️  Tabla ya existe');
      } else {
        console.log('❌ Error: ' + error.message);
      }
    }
  }

  console.log('\n✅ Migraciones completadas!');
  process.exit(0);
}

migrate();
