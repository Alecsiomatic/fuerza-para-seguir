# 🚀 Guía Rápida de Deploy en VPS

## Paso 1: Subir archivos

Sube toda la carpeta `backend/` a tu VPS. Por ejemplo usando FileZilla, cPanel File Manager, o rsync:

```bash
# Con rsync (desde tu máquina local)
rsync -avz backend/ usuario@srv440.hstgr.io:/home/u191251575/domains/fuerzaparaseguir.com/backend/
```

## Paso 2: Conectarse por SSH

```bash
ssh usuario@srv440.hstgr.io
cd /home/u191251575/domains/fuerzaparaseguir.com/backend/
```

## Paso 3: Ejecutar el script de deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

El script automáticamente:
- ✅ Instala las dependencias
- ✅ Verifica el archivo .env
- ✅ Inicializa la base de datos
- ✅ Instala PM2 si no está
- ✅ Inicia el servidor
- ✅ Guarda la configuración

## Paso 4: Configurar el proxy de Apache

### Opción A: Archivo .htaccess en /api/

1. Crea la carpeta `/api/` en tu public_html:
```bash
mkdir -p /home/u191251575/domains/fuerzaparaseguir.com/public_html/api
```

2. Copia el archivo `.htaccess`:
```bash
cp .htaccess-api /home/u191251575/domains/fuerzaparaseguir.com/public_html/api/.htaccess
```

### Opción B: En el .htaccess principal

Edita `/home/u191251575/domains/fuerzaparaseguir.com/public_html/.htaccess` y agrega al inicio:

```apache
# API Proxy - DEBE ESTAR AL INICIO, ANTES DE OTRAS REGLAS
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
```

## Paso 5: Verificar que funciona

Prueba estas URLs en tu navegador:

1. **Health check:**
   ```
   https://fuerzaparaseguir.com/api/health
   ```
   Deberías ver: `{"status":"ok","timestamp":"..."}`

2. **Analytics summary:**
   ```
   https://fuerzaparaseguir.com/api/analytics/summary
   ```
   Deberías ver: `{"success":true,"data":{...}}`

3. **Panel de Admin:**
   ```
   https://fuerzaparaseguir.com/admin
   ```
   Usuario: `Admin@fuerzaparaseguir.com`
   Password: `Admin123`

## Comandos útiles

```bash
# Ver estado del servidor
pm2 status

# Ver logs en tiempo real
pm2 logs fuerza-backend

# Ver solo errores
pm2 logs fuerza-backend --err

# Reiniciar el servidor
pm2 restart fuerza-backend

# Monitor de recursos
pm2 monit

# Detener el servidor
pm2 stop fuerza-backend

# Eliminar de PM2
pm2 delete fuerza-backend
```

## Troubleshooting

### ❌ El servidor no arranca

```bash
# Ver logs detallados
pm2 logs fuerza-backend --err

# Verificar el puerto
netstat -tlnp | grep 3006

# Verificar el .env
cat .env
```

### ❌ Error 404 en /api/

1. Verifica que el servidor backend esté corriendo:
   ```bash
   pm2 status
   curl http://localhost:3006/health
   ```

2. Verifica la configuración del proxy en Apache:
   ```bash
   cat /home/u191251575/domains/fuerzaparaseguir.com/public_html/api/.htaccess
   ```

3. Revisa los logs de Apache:
   ```bash
   tail -f /var/log/apache2/error.log
   ```

### ❌ No conecta a la base de datos

```bash
# Verificar credenciales
cat .env

# Probar conexión manualmente
node init-db.js
```

### ❌ Error de permisos

```bash
# Dar permisos correctos
chmod 755 /home/u191251575/domains/fuerzaparaseguir.com/backend/
chmod 644 .env
chmod 755 server.js
chmod 755 init-db.js
```

## Actualizar el backend

Para actualizar después de hacer cambios:

```bash
# Opción 1: Subir solo los archivos modificados y ejecutar
pm2 restart fuerza-backend

# Opción 2: Deploy completo
./deploy.sh
```

## Logs

Los logs se guardan en:
- `./logs/out.log` - Salida estándar
- `./logs/err.log` - Errores
- `./logs/combined.log` - Todo junto

```bash
# Ver logs guardados
tail -f logs/combined.log
```

## Monitoreo

Para ver el estado en tiempo real:

```bash
pm2 monit
```

Muestra:
- CPU usage
- Memory usage
- Logs en vivo
- Estado del proceso

## Backup de la base de datos

```bash
# Hacer backup
mysqldump -h srv440.hstgr.io -u u191251575_fuerza -p u191251575_fuerza > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -h srv440.hstgr.io -u u191251575_fuerza -p u191251575_fuerza < backup_20250116.sql
```

## Seguridad

✅ El puerto 3006 solo es accesible desde localhost
✅ El proxy de Apache maneja las peticiones externas
✅ CORS configurado solo para dominios permitidos
✅ Rate limiting activo (100 requests/15min por IP)
✅ Variables sensibles en .env (no subidas al repo)

---

¿Necesitas ayuda? Revisa `deploy-instructions.md` para más detalles.
