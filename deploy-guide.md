# 🏥 Deploy Guide - Clínica Fuerza Para Seguir

## 📋 Información del Servidor
- **OS**: Ubuntu 24.04 LTS
- **VPS**: srv1041644.hstgr.cloud
- **Proyecto**: Landing Page de Clínica de Rehabilitación

## 🔧 Pasos de Deploy

### 1. Preparar proyecto localmente
```bash
# Build del proyecto con pnpm (más rápido)
pnpm run deploy

# Verificar que se creó la carpeta dist/
ls dist/
```

### 2. Conectar al servidor VPS
```bash
ssh root@srv1041644.hstgr.cloud
```

### 3. Actualizar el sistema
```bash
apt update && apt upgrade -y
```

### 4. Instalar Node.js y pnpm
```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Instalar pnpm (más rápido que npm)
npm install -g pnpm

# Verificar instalación
node --version
pnpm --version
```

### 5. Instalar Nginx
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 6. Configurar Firewall
```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

### 7. Crear directorio del proyecto
```bash
mkdir -p /var/www/fuerza-para-seguir
cd /var/www/fuerza-para-seguir
```

### 8. Subir archivos del proyecto
**Opción A: Con SCP (desde tu PC)**
```bash
scp -r dist/* root@srv1041644.hstgr.cloud:/var/www/fuerza-para-seguir/
```

**Opción B: Con Git (recomendado)**
```bash
# En el servidor
git clone https://github.com/alecsiomatiko/fuerza-para-seguir-call.git .
pnpm install
pnpm run build
```

### 9. Configurar Nginx
```bash
# Crear configuración del sitio
nano /etc/nginx/sites-available/fuerza-para-seguir
```

**Contenido del archivo de configuración:**
```nginx
server {
    listen 80;
    server_name srv1041644.hstgr.cloud;
    
    root /var/www/fuerza-para-seguir/dist;
    index index.html;
    
    # Configuración para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Configuración para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### 10. Activar el sitio
```bash
# Enlazar la configuración
ln -s /etc/nginx/sites-available/fuerza-para-seguir /etc/nginx/sites-enabled/

# Remover sitio por defecto
rm /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl reload nginx
```

### 11. Configurar SSL con Let's Encrypt
```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d srv1041644.hstgr.cloud

# Configurar renovación automática
crontab -e
# Agregar esta línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 12. Verificar el sitio
- Visita: `https://srv1041644.hstgr.cloud`
- Verifica que todas las funciones trabajen correctamente
- Prueba el botón de llamada

## 🔄 Para futuras actualizaciones

### Script de actualización rápida:
```bash
#!/bin/bash
cd /var/www/fuerza-para-seguir
git pull origin main
pnpm install
pnpm run build
systemctl reload nginx
```

## 📱 Configurar dominio personalizado (opcional)
Si tienes un dominio:
1. Apunta el dominio A record a la IP del servidor
2. Actualiza la configuración de Nginx con tu dominio
3. Obtén nuevo certificado SSL para tu dominio

## 🔍 Monitoreo y logs
```bash
# Ver logs de Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Estado del servidor
systemctl status nginx
```