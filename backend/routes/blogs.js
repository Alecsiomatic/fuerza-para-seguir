const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/blogs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `blog-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes y videos'));
  }
});

// Configurar upload para múltiples archivos
const uploadFields = upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Generar slug a partir del título
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ============================================
// ENDPOINTS PÚBLICOS
// ============================================

// Obtener blogs publicados de una sucursal
router.get('/public/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const [blogs] = await pool.execute(
      `SELECT id, branch, title, slug, excerpt, media_url, thumbnail_url, media_type, youtube_id, 
              author, publish_date, views, created_at
       FROM blogs 
       WHERE branch = ? AND status = 'published' AND publish_date <= NOW()
       ORDER BY publish_date DESC
       LIMIT ? OFFSET ?`,
      [branch, parseInt(limit), parseInt(offset)]
    );

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) as total FROM blogs 
       WHERE branch = ? AND status = 'published' AND publish_date <= NOW()`,
      [branch]
    );

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo blogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener un blog específico por slug
router.get('/public/:branch/:slug', async (req, res) => {
  try {
    const { branch, slug } = req.params;

    const [[blog]] = await pool.execute(
      `SELECT * FROM blogs 
       WHERE branch = ? AND slug = ? AND status = 'published' AND publish_date <= NOW()`,
      [branch, slug]
    );

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog no encontrado' });
    }

    // Incrementar vistas
    await pool.execute('UPDATE blogs SET views = views + 1 WHERE id = ?', [blog.id]);

    res.json({ success: true, data: { ...blog, views: blog.views + 1 } });
  } catch (error) {
    console.error('Error obteniendo blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ENDPOINTS DE ADMIN
// ============================================

// Obtener todos los blogs (admin)
router.get('/admin', async (req, res) => {
  try {
    const { branch, status, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM blogs WHERE 1=1';
    const params = [];

    if (branch && branch !== 'todas') {
      query += ' AND branch = ?';
      params.push(branch);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [blogs] = await pool.execute(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM blogs WHERE 1=1';
    const countParams = [];
    if (branch && branch !== 'todas') {
      countQuery += ' AND branch = ?';
      countParams.push(branch);
    }
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [[{ total }]] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo blogs admin:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener un blog por ID (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[blog]] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog no encontrado' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Error obteniendo blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crear nuevo blog
router.post('/admin', uploadFields, async (req, res) => {
  try {
    const { branch, title, excerpt, content, youtube_url, publish_date, status = 'draft' } = req.body;

    if (!branch || !title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Branch, título y contenido son requeridos' 
      });
    }

    const slug = generateSlug(title);
    let media_url = null;
    let thumbnail_url = null;
    let media_type = 'image';
    let youtube_id = null;

    // Si hay archivo de media subido
    if (req.files && req.files.media && req.files.media[0]) {
      const mediaFile = req.files.media[0];
      media_url = `/uploads/blogs/${mediaFile.filename}`;
      const ext = path.extname(mediaFile.filename).toLowerCase();
      if (['.mp4', '.webm', '.mov'].includes(ext)) {
        media_type = 'video';
      }
    }

    // Si hay thumbnail subido
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbFile = req.files.thumbnail[0];
      thumbnail_url = `/uploads/blogs/${thumbFile.filename}`;
    }

    // Si hay URL de YouTube
    if (youtube_url) {
      const match = youtube_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match) {
        youtube_id = match[1];
        media_type = 'youtube';
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO blogs (branch, title, slug, excerpt, content, media_url, thumbnail_url, media_type, youtube_id, publish_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [branch, title, slug, excerpt || null, content, media_url, thumbnail_url, media_type, youtube_id, publish_date || new Date(), status]
    );

    res.json({ 
      success: true, 
      data: { id: result.insertId, slug },
      message: 'Blog creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar blog
router.put('/admin/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    const { branch, title, excerpt, content, youtube_url, publish_date, status } = req.body;

    // Obtener blog actual
    const [[currentBlog]] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!currentBlog) {
      return res.status(404).json({ success: false, error: 'Blog no encontrado' });
    }

    let media_url = currentBlog.media_url;
    let thumbnail_url = currentBlog.thumbnail_url;
    let media_type = currentBlog.media_type;
    let youtube_id = currentBlog.youtube_id;

    // Si hay nuevo archivo de media
    if (req.files && req.files.media && req.files.media[0]) {
      // Eliminar archivo anterior si existe
      if (currentBlog.media_url && !currentBlog.media_url.includes('youtube')) {
        const oldPath = path.join(__dirname, '../..', currentBlog.media_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      const mediaFile = req.files.media[0];
      media_url = `/uploads/blogs/${mediaFile.filename}`;
      const ext = path.extname(mediaFile.filename).toLowerCase();
      media_type = ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'image';
      youtube_id = null;
    }

    // Si hay nuevo thumbnail
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      // Eliminar thumbnail anterior si existe
      if (currentBlog.thumbnail_url) {
        const oldThumbPath = path.join(__dirname, '../..', currentBlog.thumbnail_url);
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath);
        }
      }
      const thumbFile = req.files.thumbnail[0];
      thumbnail_url = `/uploads/blogs/${thumbFile.filename}`;
    }

    // Si hay nueva URL de YouTube
    if (youtube_url) {
      const match = youtube_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match) {
        youtube_id = match[1];
        media_type = 'youtube';
        media_url = null;
        thumbnail_url = null;
      }
    }

    const slug = title ? generateSlug(title) : currentBlog.slug;

    await pool.execute(
      `UPDATE blogs SET 
        branch = COALESCE(?, branch),
        title = COALESCE(?, title),
        slug = ?,
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        media_url = ?,
        thumbnail_url = ?,
        media_type = ?,
        youtube_id = ?,
        publish_date = COALESCE(?, publish_date),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [branch, title, slug, excerpt, content, media_url, thumbnail_url, media_type, youtube_id, publish_date, status, id]
    );

    res.json({ success: true, message: 'Blog actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Eliminar blog
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener blog para eliminar archivos
    const [[blog]] = await pool.execute('SELECT media_url, thumbnail_url FROM blogs WHERE id = ?', [id]);
    
    // Eliminar media
    if (blog && blog.media_url && !blog.media_url.includes('youtube')) {
      const filePath = path.join(__dirname, '../..', blog.media_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Eliminar thumbnail
    if (blog && blog.thumbnail_url) {
      const thumbPath = path.join(__dirname, '../..', blog.thumbnail_url);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);

    res.json({ success: true, message: 'Blog eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cambiar estado de blog
router.patch('/admin/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Estado inválido' });
    }

    await pool.execute('UPDATE blogs SET status = ? WHERE id = ?', [status, id]);

    res.json({ success: true, message: `Blog ${status === 'published' ? 'publicado' : status === 'archived' ? 'archivado' : 'guardado como borrador'}` });
  } catch (error) {
    console.error('Error cambiando estado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Estadísticas de blogs
router.get('/stats', async (req, res) => {
  try {
    const [[totals]] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
        SUM(views) as total_views
      FROM blogs
    `);

    const [byBranch] = await pool.execute(`
      SELECT branch, COUNT(*) as count, SUM(views) as views
      FROM blogs 
      WHERE status = 'published'
      GROUP BY branch
    `);

    res.json({
      success: true,
      data: {
        ...totals,
        byBranch
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
