# Backend API - Fuerza Para Seguir

Backend API con Express + MySQL para tracking de analytics y eventos de Meta Pixel.

## 📋 Requisitos Previos

1. **Base de Datos MySQL** configurada en Hostinger
   - Host: `srv440.hstgr.io` (o IP: `151.106.99.1`)
   - Usuario: `u191251575_fuerza`
   - Contraseña: `Cerounocero.com20182417`
   - Base de datos: `u191251575_fuerza`

## 🚀 Instalación

### 1. Crear las tablas en la base de datos

Necesitas ejecutar el archivo `init.sql` en tu base de datos MySQL. Puedes hacerlo de dos formas:

#### Opción A: Usando phpMyAdmin (Hostinger)

1. Inicia sesión en tu panel de Hostinger
2. Ve a **Bases de datos** → **phpMyAdmin**
3. Selecciona la base de datos `u191251575_fuerza`
4. Ve a la pestaña **SQL**
5. Copia y pega todo el contenido del archivo `init.sql`
6. Haz clic en **Ejecutar**

#### Opción B: Usando terminal (si tienes acceso SSH)

```bash
mysql -h srv440.hstgr.io -u u191251575_fuerza -p u191251575_fuerza < init.sql
# Ingresa la contraseña cuando te la pida: Cerounocero.com20182417
```

### 2. Instalar dependencias

```bash
cd server
pnpm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está configurado con:

```env
DB_HOST=srv440.hstgr.io
DB_USER=u191251575_fuerza
DB_PASSWORD=Cerounocero.com20182417
DB_NAME=u191251575_fuerza
PORT=3001
```

### 4. Iniciar el servidor

#### Desarrollo (con auto-reload)
```bash
pnpm run dev
```

#### Producción
```bash
pnpm start
```

El servidor iniciará en `http://localhost:3001`

## 📡 Endpoints Disponibles

### Health Check
```
GET /health
```

### Registrar Visita
```
POST /api/analytics/visit
Body: {
  "sessionId": "uuid",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

### Registrar Evento
```
POST /api/analytics/event
Body: {
  "eventType": "call_click" | "contact" | "lead" | "view_content" | "schedule" | "scroll_depth",
  "eventData": { /* datos específicos del evento */ },
  "sessionId": "uuid"
}
```

### Obtener Resumen de Analytics
```
GET /api/analytics/summary
Response: {
  "success": true,
  "data": {
    "totalVisits": 150,
    "callClicks": 23,
    "contactEvents": 45,
    "leadEvents": 12,
    "viewContentEvents": 89,
    "scheduleEvents": 7,
    "scrollDepthEvents": 234,
    "recentVisits": [...]
  }
}
```

### Resetear Analytics
```
POST /api/analytics/reset
```

## 🗂️ Estructura de Tablas

### Tabla: `visits`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `session_id`: VARCHAR(255) - UUID único por sesión
- `ip_address`: VARCHAR(45) - IP del visitante
- `user_agent`: TEXT - Navegador y SO
- `referrer`: VARCHAR(500) - De dónde llegó
- `created_at`: TIMESTAMP - Fecha/hora de la visita

### Tabla: `events`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `event_type`: VARCHAR(100) - Tipo de evento
- `event_data`: JSON - Datos adicionales del evento
- `session_id`: VARCHAR(255) - Relacionado con la visita
- `created_at`: TIMESTAMP - Fecha/hora del evento

## 🔥 Tipos de Eventos Soportados

- `page_view`: Vista de página (automático)
- `call_click`: Clic en botón de llamada
- `contact`: Evento de contacto (Meta Pixel)
- `lead`: Generación de lead
- `view_content`: Visualización de sección
- `schedule`: Solicitud de cita
- `scroll_depth`: Profundidad de scroll (25%, 50%, 75%)

## 🚀 Deployment en VPS

1. Subir el folder `server/` al VPS
2. Instalar Node.js y pnpm
3. Instalar dependencias: `pnpm install`
4. Configurar Nginx como proxy reverso para `localhost:3001`
5. Usar PM2 para mantener el servidor activo:

```bash
pnpm install -g pm2
pm2 start index.js --name fuerza-api
pm2 save
pm2 startup
```

### Configuración de Nginx

Agregar al archivo de configuración existente:

```nginx
location /api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
}
```

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
pm2 logs fuerza-api
```

Ver status:
```bash
pm2 status
```

Reiniciar:
```bash
pm2 restart fuerza-api
```
