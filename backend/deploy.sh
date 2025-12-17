#!/bin/bash

# Script de deploy para VPS
# Ejecuta este script en tu VPS después de subir los archivos

echo "🚀 Iniciando deploy del backend..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en la carpeta correcta
if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ Error: No se encuentra server.js${NC}"
    echo "Asegúrate de estar en la carpeta backend/"
    exit 1
fi

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias instaladas${NC}"

# Verificar archivo .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: No se encuentra el archivo .env${NC}"
    echo "Crea el archivo .env con:"
    echo "DB_HOST=srv440.hstgr.io"
    echo "DB_USER=u191251575_fuerza"
    echo "DB_PASSWORD=Cerounocero.com20182417"
    echo "DB_NAME=u191251575_fuerza"
    echo "PORT=3006"
    echo "NODE_ENV=production"
    exit 1
fi

echo -e "${YELLOW}🗄️  Inicializando base de datos...${NC}"
node init-db.js

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al inicializar la base de datos${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Base de datos inicializada${NC}"

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando PM2...${NC}"
    npm install -g pm2
fi

# Detener el proceso anterior si existe
echo -e "${YELLOW}🔄 Deteniendo proceso anterior...${NC}"
pm2 stop fuerza-backend 2>/dev/null || true
pm2 delete fuerza-backend 2>/dev/null || true

# Iniciar con PM2
echo -e "${YELLOW}🚀 Iniciando servidor con PM2...${NC}"
pm2 start ecosystem.config.js

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al iniciar el servidor${NC}"
    exit 1
fi

# Guardar configuración de PM2
pm2 save

echo ""
echo -e "${GREEN}✅ Deploy completado exitosamente!${NC}"
echo ""
echo -e "${YELLOW}Comandos útiles:${NC}"
echo "  pm2 status              - Ver estado del servidor"
echo "  pm2 logs fuerza-backend - Ver logs en tiempo real"
echo "  pm2 restart fuerza-backend - Reiniciar el servidor"
echo "  pm2 monit               - Monitor de recursos"
echo ""
echo -e "${YELLOW}🔗 URLs:${NC}"
echo "  Health: https://fuerzaparaseguir.com/api/health"
echo "  Summary: https://fuerzaparaseguir.com/api/analytics/summary"
echo ""
echo -e "${YELLOW}⚠️  No olvides configurar el proxy en Apache:${NC}"
echo "  Ver archivo .htaccess-api o deploy-instructions.md"
