const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3006;

// Trust proxy (necesario para Nginx reverse proxy)
app.set('trust proxy', 1);

// Rate limiting general - más permisivo
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 200, // Máximo 200 requests por minuto por IP
  message: { success: false, error: 'Demasiadas solicitudes, por favor intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter específico para tracking (más estricto para evitar spam)
const trackingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60, // 60 eventos de tracking por minuto
  message: { success: false, error: 'Rate limit de tracking excedido.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para analytics/reportes (más permisivo para el admin)
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 300, // 300 requests por minuto para consultas de analytics
  message: { success: false, error: 'Demasiadas consultas de analytics.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: [
    'https://fuerzaparaseguir.com',
    'https://www.fuerzaparaseguir.com',
    'http://localhost:5173',
    'http://localhost:4173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aplicar rate limiters específicos
app.use('/api/analytics/track', trackingLimiter);
app.use('/api/analytics', analyticsLimiter);
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Algo salió mal en el servidor' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Ruta no encontrada' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📊 API Analytics: http://localhost:${PORT}/api/analytics`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
