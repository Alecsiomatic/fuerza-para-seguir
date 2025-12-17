const mysql = require('mysql2/promise');

async function checkDB() {
  try {
    console.log('🔄 Conectando a la base de datos remota...\n');
    
    const connection = await mysql.createConnection({
      host: 'srv440.hstgr.io',
      user: 'u191251575_fuerza',
      password: 'Cerounocero.com20182417',
      database: 'u191251575_fuerza'
    });

    console.log('✅ Conectado exitosamente\n');

    // Ver todas las tablas
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 TABLAS EN LA BASE DE DATOS:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });
    console.log('');

    // Contar registros en cada tabla
    console.log('📈 CONTEO DE REGISTROS:\n');
    
    const [visits] = await connection.query('SELECT COUNT(*) as total FROM visits');
    console.log(`Visits: ${visits[0].total}`);
    
    const [clicks] = await connection.query('SELECT COUNT(*) as total FROM call_clicks');
    console.log(`Call Clicks: ${clicks[0].total}`);
    
    const [pixelEvents] = await connection.query('SELECT COUNT(*) as total FROM pixel_events');
    console.log(`Pixel Events: ${pixelEvents[0].total}`);
    
    const [scrollTracking] = await connection.query('SELECT COUNT(*) as total FROM scroll_tracking');
    console.log(`Scroll Tracking: ${scrollTracking[0].total}`);
    
    const [events] = await connection.query('SELECT COUNT(*) as total FROM events');
    console.log(`Events (tabla genérica): ${events[0].total}`);
    
    console.log('\n📊 ANALYTICS SUMMARY:');
    const [summary] = await connection.query('SELECT * FROM analytics_summary ORDER BY metric_name');
    summary.forEach(row => {
      console.log(`  ${row.metric_name}: ${row.metric_value}`);
    });

    // Ver últimas visitas
    console.log('\n🔍 ÚLTIMAS 5 VISITAS:');
    const [lastVisits] = await connection.query('SELECT * FROM visits ORDER BY created_at DESC LIMIT 5');
    if (lastVisits.length > 0) {
      lastVisits.forEach((visit, i) => {
        console.log(`\n  ${i + 1}. Session: ${visit.session_id}`);
        console.log(`     IP: ${visit.ip_address}`);
        console.log(`     Fecha: ${visit.created_at}`);
        console.log(`     Referrer: ${visit.referrer || 'N/A'}`);
      });
    } else {
      console.log('  No hay visitas registradas');
    }

    // Ver últimos clicks
    console.log('\n📞 ÚLTIMOS 5 CLICKS EN LLAMADAS:');
    const [lastClicks] = await connection.query('SELECT * FROM call_clicks ORDER BY created_at DESC LIMIT 5');
    if (lastClicks.length > 0) {
      lastClicks.forEach((click, i) => {
        console.log(`\n  ${i + 1}. Session: ${click.session_id}`);
        console.log(`     IP: ${click.ip_address}`);
        console.log(`     Ubicación: ${click.button_location}`);
        console.log(`     Fecha: ${click.created_at}`);
      });
    } else {
      console.log('  No hay clicks registrados');
    }

    // Ver últimos eventos
    console.log('\n🎯 ÚLTIMOS 5 EVENTOS:');
    const [lastEvents] = await connection.query('SELECT * FROM events ORDER BY created_at DESC LIMIT 5');
    if (lastEvents.length > 0) {
      lastEvents.forEach((event, i) => {
        console.log(`\n  ${i + 1}. Tipo: ${event.event_type}`);
        console.log(`     Session: ${event.session_id}`);
        console.log(`     Data: ${event.event_data}`);
        console.log(`     Fecha: ${event.created_at}`);
      });
    } else {
      console.log('  No hay eventos registrados');
    }

    await connection.end();
    console.log('\n✅ Consulta completada');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDB();
