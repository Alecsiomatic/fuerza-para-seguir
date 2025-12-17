const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Registrar una visita
router.post('/visit', async (req, res) => {
  try {
    const { sessionId, referrer, branch } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const [result] = await pool.execute(
      'INSERT INTO visits (session_id, ip_address, user_agent, referrer, branch) VALUES (?, ?, ?, ?, ?)',
      [sessionId || null, ipAddress, userAgent, referrer || null, branch || null]
    );

    // Actualizar contador total
    await pool.execute(
      'UPDATE analytics_summary SET metric_value = metric_value + 1 WHERE metric_name = ?',
      ['total_visits']
    );

    res.json({ success: true, visitId: result.insertId });
  } catch (error) {
    console.error('Error registrando visita:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar clic en botón de llamada
router.post('/call-click', async (req, res) => {
  try {
    const { sessionId, buttonLocation, branch } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

    const [result] = await pool.execute(
      'INSERT INTO call_clicks (session_id, ip_address, button_location, branch) VALUES (?, ?, ?, ?)',
      [sessionId || null, ipAddress, buttonLocation || null, branch || null]
    );

    // Actualizar contador total
    await pool.execute(
      'UPDATE analytics_summary SET metric_value = metric_value + 1 WHERE metric_name = ?',
      ['total_call_clicks']
    );

    res.json({ success: true, clickId: result.insertId });
  } catch (error) {
    console.error('Error registrando clic:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar evento de Meta Pixel
router.post('/pixel-event', async (req, res) => {
  try {
    const { sessionId, eventName, eventValue, currency, contentName, contentCategory } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const [result] = await pool.execute(
      'INSERT INTO pixel_events (session_id, event_name, event_value, currency, content_name, content_category, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [sessionId || null, eventName || null, eventValue || null, currency || 'MXN', contentName || null, contentCategory || null, ipAddress, userAgent]
    );

    // Actualizar contador específico del evento
    const metricMap = {
      'PageView': 'pageview_events',
      'Contact': 'contact_events',
      'Lead': 'lead_events',
      'ViewContent': 'viewcontent_events',
      'Schedule': 'schedule_events'
    };

    const metricName = metricMap[eventName];
    if (metricName) {
      await pool.execute(
        'UPDATE analytics_summary SET metric_value = metric_value + 1 WHERE metric_name = ?',
        [metricName]
      );
    }

    res.json({ success: true, eventId: result.insertId });
  } catch (error) {
    console.error('Error registrando evento pixel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar scroll depth
router.post('/scroll-depth', async (req, res) => {
  try {
    const { sessionId, depthPercentage, pageUrl } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO scroll_tracking (session_id, depth_percentage, page_url) VALUES (?, ?, ?)',
      [sessionId || null, depthPercentage || 0, pageUrl || null]
    );

    // Actualizar contador específico
    const metricName = `scroll_${depthPercentage}`;
    await pool.execute(
      'UPDATE analytics_summary SET metric_value = metric_value + 1 WHERE metric_name = ?',
      [metricName]
    );

    res.json({ success: true, scrollId: result.insertId });
  } catch (error) {
    console.error('Error registrando scroll depth:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar evento genérico (pageview, contact, lead, etc)
router.post('/event', async (req, res) => {
  try {
    const { sessionId, eventType, eventData, branch } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO events (session_id, event_type, event_data, branch) VALUES (?, ?, ?, ?)',
      [sessionId || null, eventType || 'unknown', JSON.stringify(eventData || {}), branch || null]
    );

    res.json({ success: true, eventId: result.insertId });
  } catch (error) {
    console.error('Error registrando evento:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener resumen de analytics (con filtro opcional por sucursal)
router.get('/summary', async (req, res) => {
  try {
    const { branch } = req.query;
    
    // Construir filtro de sucursal
    const branchFilter = branch ? ' WHERE branch = ?' : '';
    const branchFilterAnd = branch ? ' AND branch = ?' : '';
    const branchParams = branch ? [branch] : [];
    
    // Contar directamente de las tablas
    const [visitsCount] = await pool.execute(
      `SELECT COUNT(*) as total FROM visits${branchFilter}`,
      branchParams
    );
    
    // Contar call_clicks desde la tabla call_clicks (con branch)
    const [callClicksCount] = await pool.execute(
      `SELECT COUNT(*) as total FROM call_clicks${branchFilter}`,
      branchParams
    );
    
    // Contar eventos por tipo desde la tabla events
    const [pageViews] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'page_view'${branchFilterAnd}`,
      branchParams
    );
    const [contactEvents] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'contact'${branchFilterAnd}`,
      branchParams
    );
    const [leadEvents] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'lead'${branchFilterAnd}`,
      branchParams
    );
    const [viewContentEvents] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'view_content'${branchFilterAnd}`,
      branchParams
    );
    const [scheduleEvents] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'schedule'${branchFilterAnd}`,
      branchParams
    );
    const [scroll25] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'scroll_depth' AND JSON_EXTRACT(event_data, '$.depth') = 25${branchFilterAnd}`,
      branchParams
    );
    const [scroll50] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'scroll_depth' AND JSON_EXTRACT(event_data, '$.depth') = 50${branchFilterAnd}`,
      branchParams
    );
    const [scroll75] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'scroll_depth' AND JSON_EXTRACT(event_data, '$.depth') = 75${branchFilterAnd}`,
      branchParams
    );

    // Obtener lista de sucursales disponibles
    const [branches] = await pool.execute(
      `SELECT DISTINCT branch FROM visits WHERE branch IS NOT NULL`
    );

    const summary = {
      totalVisits: visitsCount[0].total,
      callClicks: callClicksCount[0].total,
      pageviewEvents: pageViews[0].total,
      contactEvents: contactEvents[0].total,
      leadEvents: leadEvents[0].total,
      viewContentEvents: viewContentEvents[0].total,
      scheduleEvents: scheduleEvents[0].total,
      scroll_25: scroll25[0].total,
      scroll_50: scroll50[0].total,
      scroll_75: scroll75[0].total,
      availableBranches: branches.map(b => b.branch),
      currentBranch: branch || 'todas'
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener estadísticas detalladas por rango de fechas
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    let params = [];
    
    if (startDate && endDate) {
      dateFilter = 'WHERE created_at BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    // Visitas por día
    const [visitsByDay] = await pool.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM visits ${dateFilter}
       GROUP BY DATE(created_at) 
       ORDER BY date DESC 
       LIMIT 30`,
      params
    );

    // Clics por día
    const [clicksByDay] = await pool.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM call_clicks ${dateFilter}
       GROUP BY DATE(created_at) 
       ORDER BY date DESC 
       LIMIT 30`,
      params
    );

    // Eventos más populares
    const [topEvents] = await pool.execute(
      `SELECT event_name, COUNT(*) as count 
       FROM pixel_events ${dateFilter}
       GROUP BY event_name 
       ORDER BY count DESC`,
      params
    );

    res.json({
      success: true,
      data: {
        visitsByDay,
        clicksByDay,
        topEvents
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resetear analytics
router.post('/reset', async (req, res) => {
  try {
    await pool.execute('TRUNCATE TABLE visits');
    await pool.execute('TRUNCATE TABLE call_clicks');
    await pool.execute('TRUNCATE TABLE pixel_events');
    await pool.execute('TRUNCATE TABLE scroll_tracking');
    await pool.execute('UPDATE analytics_summary SET metric_value = 0');

    res.json({ success: true, message: 'Analytics reseteado exitosamente' });
  } catch (error) {
    console.error('Error reseteando analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
