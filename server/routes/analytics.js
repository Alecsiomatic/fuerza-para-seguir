import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Track visit
router.post('/visit', async (req, res) => {
  try {
    const { sessionId, userAgent, referrer } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

    const [result] = await pool.execute(
      'INSERT INTO visits (session_id, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)',
      [sessionId, ip, userAgent, referrer]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track event
router.post('/event', async (req, res) => {
  try {
    const { eventType, eventData, sessionId } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO events (event_type, event_data, session_id) VALUES (?, ?, ?)',
      [eventType, JSON.stringify(eventData), sessionId]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get analytics summary
router.get('/summary', async (req, res) => {
  try {
    // Total visits
    const [visitsResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM visits'
    );

    // Events by type
    const [eventsResult] = await pool.execute(
      'SELECT event_type, COUNT(*) as count FROM events GROUP BY event_type'
    );

    // Recent visits
    const [recentVisits] = await pool.execute(
      'SELECT DATE(created_at) as date, COUNT(*) as count FROM visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date DESC'
    );

    const eventCounts = {};
    eventsResult.forEach(row => {
      eventCounts[row.event_type] = row.count;
    });

    res.json({
      success: true,
      data: {
        totalVisits: visitsResult[0].total,
        callClicks: eventCounts.call_click || 0,
        contactEvents: eventCounts.contact || 0,
        leadEvents: eventCounts.lead || 0,
        viewContentEvents: eventCounts.view_content || 0,
        scheduleEvents: eventCounts.schedule || 0,
        scrollDepthEvents: eventCounts.scroll_depth || 0,
        recentVisits: recentVisits
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset analytics
router.post('/reset', async (req, res) => {
  try {
    await pool.execute('TRUNCATE TABLE visits');
    await pool.execute('TRUNCATE TABLE events');
    
    res.json({ success: true, message: 'Analytics reset successfully' });
  } catch (error) {
    console.error('Error resetting analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
