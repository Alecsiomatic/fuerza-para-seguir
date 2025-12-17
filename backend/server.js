const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3006;

// Trust proxy (necesario para Nginx reverse proxy)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
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
app.use('/api', limiter);

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
