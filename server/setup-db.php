<?php
// Script para ejecutar init.sql en la base de datos
$host = 'srv440.hstgr.io';
$user = 'u191251575_fuerza';
$pass = 'Cerounocero.com20182417';
$db = 'u191251575_fuerza';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = file_get_contents('init.sql');
    
    // Ejecutar el script SQL
    $pdo->exec($sql);
    
    echo "✅ Tablas creadas exitosamente!\n\n";
    
    // Verificar las tablas
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Tablas en la base de datos:\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
