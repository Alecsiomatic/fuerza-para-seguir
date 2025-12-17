const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

(async () => {
  try {
    console.log('🔄 Verificando y agregando columna branch donde falte...\n');

    // Agregar columna branch a call_clicks si no existe
    try {
      await pool.query('ALTER TABLE call_clicks ADD COLUMN branch VARCHAR(100) DEFAULT NULL');
      console.log('✅ Columna branch agregada a call_clicks');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Columna branch ya existe en call_clicks');
      } else {
        console.log('⚠️  Error en call_clicks:', e.message);
      }
    }

    // Agregar columna branch a visits si no existe
    try {
      await pool.query('ALTER TABLE visits ADD COLUMN branch VARCHAR(100) DEFAULT NULL');
      console.log('✅ Columna branch agregada a visits');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Columna branch ya existe en visits');
      } else {
        console.log('⚠️  Error en visits:', e.message);
      }
    }

    console.log('\n🔄 Migrando datos antiguos a sucursal "corregidora"...\n');

    // Ver cuántos registros sin branch hay en cada tabla
    const [visitsNull] = await pool.query('SELECT COUNT(*) as count FROM visits WHERE branch IS NULL');
    const [eventsNull] = await pool.query('SELECT COUNT(*) as count FROM events WHERE branch IS NULL');
    const [callsNull] = await pool.query('SELECT COUNT(*) as count FROM call_clicks WHERE branch IS NULL');

    console.log('📊 Registros sin branch (datos antiguos):');
    console.log(`   - Visitas: ${visitsNull[0].count}`);
    console.log(`   - Eventos: ${eventsNull[0].count}`);
    console.log(`   - Llamadas: ${callsNull[0].count}`);
    console.log('');

    // Actualizar visitas sin branch a "corregidora"
    const [visitResult] = await pool.execute(
      'UPDATE visits SET branch = ? WHERE branch IS NULL',
      ['corregidora']
    );
    console.log(`✅ Visitas actualizadas: ${visitResult.affectedRows}`);

    // Actualizar eventos sin branch a "corregidora"
    const [eventResult] = await pool.execute(
      'UPDATE events SET branch = ? WHERE branch IS NULL',
      ['corregidora']
    );
    console.log(`✅ Eventos actualizados: ${eventResult.affectedRows}`);

    // Actualizar call_clicks sin branch a "corregidora"
    const [callResult] = await pool.execute(
      'UPDATE call_clicks SET branch = ? WHERE branch IS NULL',
      ['corregidora']
    );
    console.log(`✅ Llamadas actualizadas: ${callResult.affectedRows}`);

    console.log('\n📈 Verificando datos después de migración...\n');

    // Verificar totales por branch
    const [visitsByBranch] = await pool.query(
      'SELECT branch, COUNT(*) as count FROM visits GROUP BY branch'
    );
    console.log('Visitas por sucursal:');
    visitsByBranch.forEach(r => console.log(`   - ${r.branch || 'NULL'}: ${r.count}`));

    const [callsByBranch] = await pool.query(
      'SELECT branch, COUNT(*) as count FROM call_clicks GROUP BY branch'
    );
    console.log('\nLlamadas por sucursal:');
    callsByBranch.forEach(r => console.log(`   - ${r.branch || 'NULL'}: ${r.count}`));

    const [eventsByBranch] = await pool.query(
      'SELECT branch, COUNT(*) as count FROM events GROUP BY branch'
    );
    console.log('\nEventos por sucursal:');
    eventsByBranch.forEach(r => console.log(`   - ${r.branch || 'NULL'}: ${r.count}`));

    await pool.end();
    console.log('\n✅ Migración completada!');
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
