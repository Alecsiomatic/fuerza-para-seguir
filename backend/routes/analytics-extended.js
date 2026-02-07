const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../config/database');

// ============================================
// ENDPOINTS DE REGISTRO DE EVENTOS
// ============================================

// Registrar una visita con datos completos
router.post('/visit', async (req, res) => {
  try {
    const {
      sessionId,
      branch,
      deviceType,
      isMobile,
      screenWidth,
      screenHeight,
      browser,
      browserVersion,
      os,
      osVersion,
      language,
      timezone,
      referrer,
      referrerSource,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      landingPage,
      pageUrl,
      isReturning,
      userAgent,
      connectionType,
    } = req.body;

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
    const finalSessionId = sessionId || crypto.randomUUID();

    // Insertar visita
    const [result] = await pool.execute(
      `INSERT INTO visits (
        session_id, ip_address, user_agent, referrer, branch,
        device_type, browser, browser_version, os, os_version,
        screen_width, screen_height, language, timezone,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        landing_page, is_mobile, is_returning
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalSessionId, ipAddress, userAgent, referrer, branch,
        deviceType, browser, browserVersion, os, osVersion,
        screenWidth, screenHeight, language, timezone,
        utm_source || null, utm_medium || null, utm_campaign || null, utm_term || null, utm_content || null,
        landingPage, isMobile ? 1 : 0, isReturning ? 1 : 0
      ]
    );

    // Actualizar o crear sesión
    await pool.execute(
      `INSERT INTO sessions (
        session_id, branch, ip_address, device_type, browser, os,
        referrer_source, utm_source, utm_medium, utm_campaign
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        last_activity = CURRENT_TIMESTAMP,
        page_views = page_views + 1`,
      [
        finalSessionId, branch, ipAddress, deviceType, browser, os,
        referrerSource, utm_source || null, utm_medium || null, utm_campaign || null
      ]
    );

    res.json({ success: true, visitId: result.insertId, sessionId: finalSessionId });
  } catch (error) {
    console.error('Error registrando visita:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar clic en botón de llamada
router.post('/call-click', async (req, res) => {
  try {
    const { sessionId, buttonLocation, branch, phoneNumber, deviceType } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

    const [result] = await pool.execute(
      `INSERT INTO call_clicks (session_id, ip_address, button_location, branch, phone_number, device_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId || null, ipAddress, buttonLocation || null, branch || null, phoneNumber || null, deviceType || null]
    );

    // Marcar sesión como convertida
    if (sessionId) {
      await pool.execute(
        `UPDATE sessions SET converted = 1, conversion_type = 'call_click' WHERE session_id = ?`,
        [sessionId]
      );
    }

    res.json({ success: true, clickId: result.insertId });
  } catch (error) {
    console.error('Error registrando clic:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar scroll depth
router.post('/scroll-depth', async (req, res) => {
  try {
    const { sessionId, depthPercentage, branch, pageUrl } = req.body;

    await pool.execute(
      'INSERT INTO scroll_tracking (session_id, depth_percentage, page_url) VALUES (?, ?, ?)',
      [sessionId || null, depthPercentage || 0, pageUrl || null]
    );

    // Actualizar max scroll en sesión
    if (sessionId) {
      await pool.execute(
        `UPDATE sessions SET max_scroll_depth = GREATEST(max_scroll_depth, ?) WHERE session_id = ?`,
        [depthPercentage || 0, sessionId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error registrando scroll:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar tiempo en página
router.post('/time-on-page', async (req, res) => {
  try {
    const { sessionId, branch, timeOnPageSeconds, maxScrollDepth, pageUrl } = req.body;

    await pool.execute(
      `INSERT INTO page_time_tracking (session_id, branch, page_url, time_on_page_seconds) VALUES (?, ?, ?, ?)`,
      [sessionId || null, branch || null, pageUrl || null, timeOnPageSeconds || 0]
    );

    // Actualizar sesión
    if (sessionId) {
      await pool.execute(
        `UPDATE sessions SET 
          total_time_seconds = ?,
          max_scroll_depth = GREATEST(max_scroll_depth, ?)
        WHERE session_id = ?`,
        [timeOnPageSeconds || 0, maxScrollDepth || 0, sessionId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error registrando tiempo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar salida de página (usando sendBeacon)
router.post('/page-exit', async (req, res) => {
  try {
    const { sessionId, branch, timeOnPageSeconds, maxScrollDepth } = req.body;

    if (sessionId) {
      await pool.execute(
        `UPDATE sessions SET 
          total_time_seconds = ?,
          max_scroll_depth = GREATEST(max_scroll_depth, ?),
          last_activity = CURRENT_TIMESTAMP
        WHERE session_id = ?`,
        [timeOnPageSeconds || 0, maxScrollDepth || 0, sessionId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error registrando salida:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar clic para heatmap
router.post('/click', async (req, res) => {
  try {
    const { sessionId, branch, pageUrl, clickX, clickY, elementTag, elementId, elementClass, elementText } = req.body;

    await pool.execute(
      `INSERT INTO click_heatmap (session_id, branch, page_url, click_x, click_y, element_id, element_class, element_text) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sessionId || null, branch || null, pageUrl || null, clickX, clickY, elementId, elementClass, elementText?.substring(0, 255)]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error registrando clic:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar error de JavaScript
router.post('/js-error', async (req, res) => {
  try {
    const { sessionId, branch, errorMessage, errorStack, pageUrl, userAgent } = req.body;

    await pool.execute(
      `INSERT INTO js_errors (session_id, branch, error_message, error_stack, page_url, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId || null, branch || null, errorMessage, errorStack, pageUrl, userAgent]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error registrando error JS:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar evento genérico
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

// ============================================
// ENDPOINTS DE CONSULTA DE DATOS
// ============================================

// Obtener resumen completo para el dashboard
router.get('/dashboard/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    const { period = '7d' } = req.query; // 7d, 30d, 90d, all

    // Calcular fecha de inicio según período
    let dateFilter = '';
    let dateParams = [];
    
    if (period !== 'all') {
      const days = parseInt(period) || 7;
      dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)';
      dateParams = [days];
    }

    const branchFilter = branch !== 'todas' ? 'AND branch = ?' : '';
    const branchParams = branch !== 'todas' ? [branch] : [];

    // Métricas principales
    const [visits] = await pool.execute(
      `SELECT COUNT(*) as total FROM visits WHERE 1=1 ${branchFilter} ${dateFilter}`,
      [...branchParams, ...dateParams]
    );

    const [uniqueVisitors] = await pool.execute(
      `SELECT COUNT(DISTINCT session_id) as total FROM visits WHERE 1=1 ${branchFilter} ${dateFilter}`,
      [...branchParams, ...dateParams]
    );

    const [callClicks] = await pool.execute(
      `SELECT COUNT(*) as total FROM call_clicks WHERE 1=1 ${branchFilter} ${dateFilter}`,
      [...branchParams, ...dateParams]
    );

    // Desglose por dispositivo
    const [deviceBreakdown] = await pool.execute(
      `SELECT 
        device_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM visits WHERE 1=1 ${branchFilter} ${dateFilter}), 1) as percentage
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY device_type
      ORDER BY count DESC`,
      [...branchParams, ...dateParams, ...branchParams, ...dateParams]
    );

    // Desglose por navegador
    const [browserBreakdown] = await pool.execute(
      `SELECT 
        browser,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM visits WHERE 1=1 ${branchFilter} ${dateFilter}), 1) as percentage
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter} AND browser IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 10`,
      [...branchParams, ...dateParams, ...branchParams, ...dateParams]
    );

    // Desglose por sistema operativo
    const [osBreakdown] = await pool.execute(
      `SELECT 
        os,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM visits WHERE 1=1 ${branchFilter} ${dateFilter}), 1) as percentage
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter} AND os IS NOT NULL
      GROUP BY os
      ORDER BY count DESC
      LIMIT 10`,
      [...branchParams, ...dateParams, ...branchParams, ...dateParams]
    );

    // Fuentes de tráfico
    const [trafficSources] = await pool.execute(
      `SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' OR referrer = 'direct' THEN 'Directo'
          WHEN referrer LIKE '%google%' THEN 'Google'
          WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.com%' THEN 'Facebook'
          WHEN referrer LIKE '%instagram%' THEN 'Instagram'
          WHEN referrer LIKE '%tiktok%' THEN 'TikTok'
          ELSE 'Otros'
        END as source,
        COUNT(*) as count
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY source
      ORDER BY count DESC`,
      [...branchParams, ...dateParams]
    );

    // Visitas por hora del día
    const [hourlyVisits] = await pool.execute(
      `SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as count
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY HOUR(created_at)
      ORDER BY hour`,
      [...branchParams, ...dateParams]
    );

    // Visitas por día de la semana
    const [dailyVisits] = await pool.execute(
      `SELECT 
        DAYOFWEEK(created_at) as day_of_week,
        COUNT(*) as count
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY DAYOFWEEK(created_at)
      ORDER BY day_of_week`,
      [...branchParams, ...dateParams]
    );

    // Visitas por fecha (para gráfico de línea)
    const [visitsByDate] = await pool.execute(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as visits,
        COUNT(DISTINCT session_id) as unique_visitors
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30`,
      [...branchParams, ...dateParams]
    );

    // Clics por fecha
    const [clicksByDate] = await pool.execute(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as clicks
      FROM call_clicks 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30`,
      [...branchParams, ...dateParams]
    );

    // Scroll depth distribution
    const [scrollDepth] = await pool.execute(
      `SELECT 
        depth_percentage,
        COUNT(*) as count
      FROM scroll_tracking st
      JOIN visits v ON st.session_id = v.session_id
      WHERE 1=1 ${branchFilter.replace('branch', 'v.branch')} ${dateFilter.replace('created_at', 'st.created_at')}
      GROUP BY depth_percentage
      ORDER BY depth_percentage`,
      [...branchParams, ...dateParams]
    );

    // Tiempo promedio en página
    const [avgTime] = await pool.execute(
      `SELECT 
        AVG(total_time_seconds) as avg_time,
        MAX(total_time_seconds) as max_time
      FROM sessions 
      WHERE 1=1 ${branchFilter} ${dateFilter.replace('created_at', 'first_visit')}`,
      [...branchParams, ...dateParams]
    );

    // Tasa de conversión
    const [conversions] = await pool.execute(
      `SELECT 
        COUNT(CASE WHEN converted = 1 THEN 1 END) as converted,
        COUNT(*) as total
      FROM sessions 
      WHERE 1=1 ${branchFilter} ${dateFilter.replace('created_at', 'first_visit')}`,
      [...branchParams, ...dateParams]
    );

    // Nuevos vs recurrentes
    const [visitorTypes] = await pool.execute(
      `SELECT 
        is_returning,
        COUNT(*) as count
      FROM visits 
      WHERE 1=1 ${branchFilter} ${dateFilter}
      GROUP BY is_returning`,
      [...branchParams, ...dateParams]
    );

    // UTM breakdown
    const [utmSources] = await pool.execute(
      `SELECT 
        utm_source,
        utm_medium,
        utm_campaign,
        COUNT(*) as count
      FROM visits 
      WHERE utm_source IS NOT NULL AND utm_source != '' ${branchFilter} ${dateFilter}
      GROUP BY utm_source, utm_medium, utm_campaign
      ORDER BY count DESC
      LIMIT 10`,
      [...branchParams, ...dateParams]
    );

    // Idiomas
    const [languages] = await pool.execute(
      `SELECT 
        language,
        COUNT(*) as count
      FROM visits 
      WHERE language IS NOT NULL ${branchFilter} ${dateFilter}
      GROUP BY language
      ORDER BY count DESC
      LIMIT 10`,
      [...branchParams, ...dateParams]
    );

    // Resoluciones de pantalla más comunes
    const [screenResolutions] = await pool.execute(
      `SELECT 
        CONCAT(screen_width, 'x', screen_height) as resolution,
        COUNT(*) as count
      FROM visits 
      WHERE screen_width IS NOT NULL ${branchFilter} ${dateFilter}
      GROUP BY screen_width, screen_height
      ORDER BY count DESC
      LIMIT 10`,
      [...branchParams, ...dateParams]
    );

    // Calcular métricas derivadas
    const totalVisits = visits[0]?.total || 0;
    const totalUniqueVisitors = uniqueVisitors[0]?.total || 0;
    const totalCallClicks = callClicks[0]?.total || 0;
    const conversionRate = totalVisits > 0 ? ((totalCallClicks / totalVisits) * 100).toFixed(2) : 0;
    const avgTimeOnPage = Math.round(avgTime[0]?.avg_time || 0);
    const sessionConversionRate = conversions[0]?.total > 0 
      ? ((conversions[0].converted / conversions[0].total) * 100).toFixed(2) 
      : 0;

    // Nuevos vs recurrentes
    const newVisitors = visitorTypes.find(v => v.is_returning === 0)?.count || 0;
    const returningVisitors = visitorTypes.find(v => v.is_returning === 1)?.count || 0;

    res.json({
      success: true,
      data: {
        // Métricas principales
        summary: {
          totalVisits,
          uniqueVisitors: totalUniqueVisitors,
          callClicks: totalCallClicks,
          conversionRate: parseFloat(conversionRate),
          avgTimeOnPage,
          sessionConversionRate: parseFloat(sessionConversionRate),
          newVisitors,
          returningVisitors,
        },
        
        // Desgloses
        deviceBreakdown,
        browserBreakdown,
        osBreakdown,
        trafficSources,
        
        // Datos temporales
        hourlyVisits,
        dailyVisits,
        visitsByDate: visitsByDate.reverse(),
        clicksByDate: clicksByDate.reverse(),
        
        // Engagement
        scrollDepth,
        
        // UTM
        utmSources,
        
        // Otros
        languages,
        screenResolutions,
        
        // Metadata
        period,
        branch,
        generatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener sesiones recientes
router.get('/sessions/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    const { limit = 50 } = req.query;

    const branchFilter = branch !== 'todas' ? 'WHERE branch = ?' : '';
    const branchParams = branch !== 'todas' ? [branch] : [];

    const [sessions] = await pool.execute(
      `SELECT 
        session_id,
        branch,
        first_visit,
        last_activity,
        page_views,
        total_time_seconds,
        max_scroll_depth,
        converted,
        conversion_type,
        device_type,
        browser,
        os,
        referrer_source,
        utm_source,
        utm_campaign
      FROM sessions 
      ${branchFilter}
      ORDER BY first_visit DESC
      LIMIT ?`,
      [...branchParams, parseInt(limit)]
    );

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener visitas en tiempo real (últimos 5 minutos)
router.get('/realtime/:branch', async (req, res) => {
  try {
    const { branch } = req.params;

    const branchFilter = branch !== 'todas' ? 'AND branch = ?' : '';
    const branchParams = branch !== 'todas' ? [branch] : [];

    const [activeVisitors] = await pool.execute(
      `SELECT COUNT(DISTINCT session_id) as count
       FROM visits 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE) ${branchFilter}`,
      branchParams
    );

    const [recentVisits] = await pool.execute(
      `SELECT 
        session_id,
        device_type,
        browser,
        os,
        referrer,
        landing_page,
        created_at
       FROM visits 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE) ${branchFilter}
       ORDER BY created_at DESC
       LIMIT 20`,
      branchParams
    );

    res.json({
      success: true,
      data: {
        activeVisitors: activeVisitors[0]?.count || 0,
        recentVisits,
      }
    });
  } catch (error) {
    console.error('Error obteniendo datos en tiempo real:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mantener endpoint legacy para compatibilidad
router.get('/summary', async (req, res) => {
  try {
    const { branch } = req.query;
    
    const branchFilter = branch ? ' WHERE branch = ?' : '';
    const branchFilterAnd = branch ? ' AND branch = ?' : '';
    const branchParams = branch ? [branch] : [];
    
    const [visitsCount] = await pool.execute(
      `SELECT COUNT(*) as total FROM visits${branchFilter}`,
      branchParams
    );
    
    const [callClicksCount] = await pool.execute(
      `SELECT COUNT(*) as total FROM call_clicks${branchFilter}`,
      branchParams
    );
    
    const [pageViews] = await pool.execute(
      `SELECT COUNT(*) as total FROM events WHERE event_type = 'page_view'${branchFilterAnd}`,
      branchParams
    );

    const [scroll25] = await pool.execute(
      `SELECT COUNT(*) as total FROM scroll_tracking WHERE depth_percentage = 25`
    );
    const [scroll50] = await pool.execute(
      `SELECT COUNT(*) as total FROM scroll_tracking WHERE depth_percentage = 50`
    );
    const [scroll75] = await pool.execute(
      `SELECT COUNT(*) as total FROM scroll_tracking WHERE depth_percentage = 75`
    );

    const [branches] = await pool.execute(
      `SELECT DISTINCT branch FROM visits WHERE branch IS NOT NULL`
    );

    res.json({
      success: true,
      data: {
        totalVisits: visitsCount[0].total,
        callClicks: callClicksCount[0].total,
        pageviewEvents: pageViews[0].total,
        scroll_25: scroll25[0].total,
        scroll_50: scroll50[0].total,
        scroll_75: scroll75[0].total,
        availableBranches: branches.map(b => b.branch),
        currentBranch: branch || 'todas'
      }
    });
  } catch (error) {
    console.error('Error obteniendo resumen:', error);
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
    await pool.execute('TRUNCATE TABLE sessions');
    await pool.execute('TRUNCATE TABLE page_time_tracking');
    await pool.execute('TRUNCATE TABLE click_heatmap');
    await pool.execute('TRUNCATE TABLE js_errors');

    res.json({ success: true, message: 'Analytics reseteado exitosamente' });
  } catch (error) {
    console.error('Error reseteando analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
