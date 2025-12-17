# Instrucciones de Deploy en VPS

## 1. Subir archivos al VPS

Sube toda la carpeta `backend/` a tu VPS, por ejemplo en:
```
/home/u191251575/domains/fuerzaparaseguir.com/backend/
```

## 2. Instalar dependencias

```bash
cd /home/u191251575/domains/fuerzaparaseguir.com/backend/
npm install
```

## 3. Crear archivo .env

Crea el archivo `.env` en la carpeta backend con:

```env
DB_HOST=srv440.hstgr.io
DB_USER=u191251575_fuerza
DB_PASSWORD=Cerounocero.com20182417
DB_NAME=u191251575_fuerza
PORT=3006
NODE_ENV=production
```

## 4. Inicializar la base de datos

```bash
node init-db.js
```

Deberías ver:
```
✅ Conectado exitosamente
✅ Tablas creadas exitosamente
📊 Tablas en la base de datos:
  - analytics_summary
  - call_clicks
  - pixel_events
  - scroll_tracking
  - visits
```

## 5. Instalar PM2 (si no lo tienes)

```bash
npm install -g pm2
```

## 6. Iniciar el servidor con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 7. Verificar que está corriendo

```bash
pm2 status
pm2 logs fuerza-backend
```

## 8. Configurar el proxy en Apache

### Opción A: Usando .htaccess en /api/

Crea la carpeta `/api/` en tu public_html:
```bash
mkdir -p /home/u191251575/domains/fuerzaparaseguir.com/public_html/api
```

Copia el archivo `.htaccess-api` como `/api/.htaccess`

### Opción B: En el archivo .htaccess principal

Agrega estas reglas en tu `.htaccess` principal (ANTES de otras reglas):

```apache
# API Proxy
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
```

### Opción C: Configuración en httpd.conf o virtualhost (requiere acceso root)

```apache
<Location /api>
    ProxyPass http://localhost:3006/api
    ProxyPassReverse http://localhost:3006/api
</Location>
```

## 9. Verificar que funciona

Prueba desde tu navegador:
```
https://fuerzaparaseguir.com/api/analytics/summary
```

Deberías ver:
```json
{
  "success": true,
  "data": {
    "total_visits": 0,
    "total_call_clicks": 0,
    ...
  }
}
```

## 10. Ver logs

```bash
# Ver logs en tiempo real
pm2 logs fuerza-backend

# Ver solo errores
pm2 logs fuerza-backend --err

# Ver logs guardados
cat logs/combined.log
```

## Troubleshooting

### El backend no arranca
```bash
# Ver detalles del error
pm2 logs fuerza-backend --err

# Verificar que el puerto 3006 está libre
netstat -tlnp | grep 3006

# Reiniciar
pm2 restart fuerza-backend
```

### No conecta a la base de datos
```bash
# Verifica las credenciales en .env
cat .env

# Prueba la conexión manualmente
node init-db.js
```

### El proxy no funciona
```bash
# Verifica que mod_proxy está habilitado (requiere root)
apache2ctl -M | grep proxy

# Ver logs de Apache
tail -f /var/log/apache2/error.log
```

### Permisos
```bash
# Dar permisos correctos
chmod 755 backend/
chmod 644 backend/.env
chmod 755 backend/server.js
```

## Comandos útiles de PM2

```bash
# Ver procesos
pm2 list

# Ver detalles
pm2 show fuerza-backend

# Reiniciar
pm2 restart fuerza-backend

# Detener
pm2 stop fuerza-backend

# Ver consumo de recursos
pm2 monit

# Eliminar de PM2
pm2 delete fuerza-backend
```
