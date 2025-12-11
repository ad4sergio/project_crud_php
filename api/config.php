<?php
/**
 * ========================================================
 * CONFIGURACIÓN - CONEXIÓN A BASE DE DATOS
 * ========================================================
 */

// ========== CONFIGURACIÓN DE BD ==========
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'db_rni');

// ========== HEADERS PARA AJAX ==========
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ========== CREAR CONEXIÓN ==========
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error de conexión: ' . $conexion->connect_error
    ]);
    exit();
}

$conexion->set_charset("utf8mb4");

/**
 * Función helper para validar entrada
 */
function validar($valor) {
    global $conexion;
    return $conexion->real_escape_string(trim($valor));
}

?>