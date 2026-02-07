-- =====================================================
-- SCHEMA EXTENDIDO PARA ANALYTICS COMPLETOS
-- =====================================================

-- Agregar columna branch a visits si no existe
ALTER TABLE visits ADD COLUMN IF NOT EXISTS branch VARCHAR(50) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS device_type VARCHAR(20) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS browser VARCHAR(50) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS browser_version VARCHAR(20) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS os VARCHAR(50) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS os_version VARCHAR(20) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS screen_width INT DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS screen_height INT DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_term VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS utm_content VARCHAR(100) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS landing_page VARCHAR(500) DEFAULT NULL;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT FALSE;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_returning BOOLEAN DEFAULT FALSE;

-- Agregar columna branch a call_clicks si no existe
ALTER TABLE call_clicks ADD COLUMN IF NOT EXISTS branch VARCHAR(50) DEFAULT NULL;
ALTER TABLE call_clicks ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL;
ALTER TABLE call_clicks ADD COLUMN IF NOT EXISTS device_type VARCHAR(20) DEFAULT NULL;

-- Agregar columna branch a events si no existe
ALTER TABLE events ADD COLUMN IF NOT EXISTS branch VARCHAR(50) DEFAULT NULL;

-- Tabla para sesiones detalladas
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    branch VARCHAR(50),
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    page_views INT DEFAULT 1,
    total_time_seconds INT DEFAULT 0,
    max_scroll_depth INT DEFAULT 0,
    converted BOOLEAN DEFAULT FALSE,
    conversion_type VARCHAR(50) DEFAULT NULL,
    ip_address VARCHAR(45),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    referrer_source VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    INDEX idx_session_id (session_id),
    INDEX idx_branch (branch),
    INDEX idx_first_visit (first_visit),
    INDEX idx_converted (converted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para tracking de tiempo en página
CREATE TABLE IF NOT EXISTS page_time_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    branch VARCHAR(50),
    page_url VARCHAR(500),
    time_on_page_seconds INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para heat map data (clics en la página)
CREATE TABLE IF NOT EXISTS click_heatmap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    branch VARCHAR(50),
    page_url VARCHAR(500),
    click_x INT,
    click_y INT,
    element_id VARCHAR(100),
    element_class VARCHAR(255),
    element_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para errores de JavaScript
CREATE TABLE IF NOT EXISTS js_errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255),
    branch VARCHAR(50),
    error_message TEXT,
    error_stack TEXT,
    page_url VARCHAR(500),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_branch (branch),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para métricas por hora
CREATE TABLE IF NOT EXISTS hourly_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch VARCHAR(50),
    metric_date DATE NOT NULL,
    metric_hour TINYINT NOT NULL,
    visits INT DEFAULT 0,
    call_clicks INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    avg_time_on_page DECIMAL(10,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_hourly (branch, metric_date, metric_hour),
    INDEX idx_branch (branch),
    INDEX idx_date (metric_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para métricas diarias agregadas
CREATE TABLE IF NOT EXISTS daily_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch VARCHAR(50),
    metric_date DATE NOT NULL,
    total_visits INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    call_clicks INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration DECIMAL(10,2) DEFAULT 0,
    avg_pages_per_session DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    new_visitors INT DEFAULT 0,
    returning_visitors INT DEFAULT 0,
    mobile_visits INT DEFAULT 0,
    desktop_visits INT DEFAULT 0,
    scroll_25_count INT DEFAULT 0,
    scroll_50_count INT DEFAULT 0,
    scroll_75_count INT DEFAULT 0,
    top_referrer VARCHAR(255),
    top_device VARCHAR(50),
    top_browser VARCHAR(50),
    top_country VARCHAR(100),
    top_city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_daily (branch, metric_date),
    INDEX idx_branch (branch),
    INDEX idx_date (metric_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices adicionales para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_visits_branch ON visits(branch);
CREATE INDEX IF NOT EXISTS idx_call_clicks_branch ON call_clicks(branch);
CREATE INDEX IF NOT EXISTS idx_events_branch ON events(branch);
