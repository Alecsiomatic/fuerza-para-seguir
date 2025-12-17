# 📦 Instrucciones de Deploy Manual

## ✅ Archivo creado: backend-deploy.zip

Ubicación: `c:\Users\Alecs\Desktop\ddu\fuerza-para-seguir-call\backend-deploy.zip`
Tamaño: ~2 MB

---

## 🚀 PASOS PARA SUBIR AL VPS

### Opción 1: Usando FileZilla (Recomendado)

1. **Abre FileZilla** y conéctate al VPS:
   - Host: `srv440.hstgr.io` o `ftp.fuerzaparaseguir.com`
   - Usuario: `u191251575`
   - Contraseña: Tu contraseña de cPanel
   - Puerto: 21 (FTP) o 22 (SFTP)

2. **Navega a la carpeta:**
   ```
   /home/u191251575/domains/fuerzaparaseguir.com/
   ```

3. **Sube el archivo** `backend-deploy.zip`

4. **Conéctate por SSH** (usando PuTTY o el terminal de cPanel)

5. **Descomprime y configura:**
   ```bash
   cd /home/u191251575/domains/fuerzaparaseguir.com/
   unzip backend-deploy.zip -d backend/
   cd backend/
   chmod +x deploy.sh
   ./deploy.sh
   ```

---

### Opción 2: Usando cPanel File Manager

1. **Accede a cPanel:** https://srv440.hstgr.io:2083 o tu dominio/cpanel

2. **Ve a "Administrador de archivos" (File Manager)**

3. **Navega a:**
   ```
   /home/u191251575/domains/fuerzaparaseguir.com/
   ```

4. **Haz clic en "Upload"** y sube `backend-deploy.zip`

5. **Selecciona el archivo** backend-deploy.zip → Botón derecho → **"Extract"**

6. **Abre "Terminal"** en cPanel

7. **Ejecuta:**
   ```bash
   cd /home/u191251575/domains/fuerzaparaseguir.com/backend/
   chmod +x deploy.sh
   ./deploy.sh
   ```

---

### Opción 3: Usando WinSCP

1. **Descarga WinSCP:** https://winscp.net

2. **Nueva conexión:**
   - Protocolo: SFTP o FTP
   - Host: srv440.hstgr.io
   - Puerto: 22 (SFTP) o 21 (FTP)
   - Usuario: u191251575
   - Contraseña: Tu contraseña

3. **Arrastra** `backend-deploy.zip` a:
   ```
   /home/u191251575/domains/fuerzaparaseguir.com/
   ```

4. **Usa el terminal integrado de WinSCP** (Ctrl+T):
   ```bash
   cd /home/u191251575/domains/fuerzaparaseguir.com/
   unzip backend-deploy.zip -d backend/
   cd backend/
   chmod +x deploy.sh
   ./deploy.sh
   ```

---

## 🔧 DESPUÉS DE SUBIR Y DESCOMPRIMIR

### 1. Ejecuta el script de deploy:

```bash
cd /home/u191251575/domains/fuerzaparaseguir.com/backend/
chmod +x deploy.sh
./deploy.sh
```

Esto automáticamente:
- ✅ Instala las dependencias
- ✅ Inicializa la base de datos
- ✅ Configura PM2
- ✅ Inicia el servidor en puerto 3006

### 2. Configura el proxy de Apache:

```bash
# Crear carpeta /api en public_html
mkdir -p /home/u191251575/domains/fuerzaparaseguir.com/public_html/api

# Copiar .htaccess
cp /home/u191251575/domains/fuerzaparaseguir.com/backend/.htaccess-api /home/u191251575/domains/fuerzaparaseguir.com/public_html/api/.htaccess
```

**O edita manualmente** `/public_html/.htaccess` y agrega AL INICIO:

```apache
# API Proxy - DEBE ESTAR AL INICIO
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
```

### 3. Verifica que funciona:

Abre en tu navegador:
- ✅ https://fuerzaparaseguir.com/api/health
- ✅ https://fuerzaparaseguir.com/api/analytics/summary
- ✅ https://fuerzaparaseguir.com/admin

---

## 📊 COMANDOS ÚTILES EN EL VPS

```bash
# Ver estado del servidor
pm2 status

# Ver logs en tiempo real
pm2 logs fuerza-backend

# Reiniciar el servidor
pm2 restart fuerza-backend

# Detener el servidor
pm2 stop fuerza-backend

# Ver errores
pm2 logs fuerza-backend --err
```

---

## ⚠️ TROUBLESHOOTING

### El servidor no arranca:
```bash
cd /home/u191251575/domains/fuerzaparaseguir.com/backend/
pm2 logs fuerza-backend --err
```

### Error 404 en /api:
1. Verifica que el servidor esté corriendo: `pm2 status`
2. Prueba directamente: `curl http://localhost:3006/health`
3. Verifica el .htaccess en /public_html/api/.htaccess

### No conecta a la base de datos:
```bash
cd /home/u191251575/domains/fuerzaparaseguir.com/backend/
cat .env
node init-db.js
```

---

## 📧 CREDENCIALES DEL ADMIN

Una vez todo esté funcionando, accede a:
- URL: https://fuerzaparaseguir.com/admin
- Email: `Admin@fuerzaparaseguir.com`
- Password: `Admin123`

---

## 🔄 ACTUALIZAR EN EL FUTURO

Cuando hagas cambios:
1. Genera nuevo ZIP con: `Compress-Archive -Path "backend\*" -DestinationPath "backend-deploy.zip" -Force`
2. Sube al VPS
3. Descomprime sobre la carpeta existente
4. Ejecuta: `pm2 restart fuerza-backend`

---

¿Necesitas ayuda? Revisa los archivos:
- `DEPLOY-VPS.md` - Guía completa
- `deploy-instructions.md` - Instrucciones detalladas
