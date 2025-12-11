<?php
/**
 * ================================================================
 * API/ELIMINAR.PHP - ELIMINAR PERSONA (DELETE)
 * ================================================================
 * Endpoint: GET /api/eliminar.php?id=123
 * Propósito: Eliminar un registro de la base de datos
 * 
 * Parámetro esperado en la URL:
 * ?id=123 donde 123 es el ID de la persona a eliminar
 * 
 * NOTA: Usamos GET en lugar de DELETE porque es más simple
 * En API REST profesionales se usaría DELETE HTTP method
 * ================================================================
 */

// ================================================================
// 1. INCLUIR CONFIGURACIÓN
// ================================================================
require 'config.php';

// ================================================================
// 2. OBTENER EL ID DEL PARÁMETRO URL
// ================================================================
/**
 * $_GET es un array con los parámetros de la URL
 * $_GET['id'] obtiene el valor del parámetro 'id'
 * 
 * Ejemplo:
 * URL: /api/eliminar.php?id=5
 * $_GET['id'] = "5"
 */
if (!isset($_GET['id']) || empty($_GET['id'])) {
    /**
     * Si no viene el parámetro 'id' o está vacío:
     * http_response_code(400): Bad Request
     * El cliente envió datos inválidos
     */
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'ID no proporcionado'
    ]);
    exit();
}

/**
 * intval() convierte el ID a número entero
 * Esto evita inyección SQL (aunque es mejor usar Prepared Statements)
 * 
 * Ejemplo: intval("5abc") = 5
 */
$id = intval($_GET['id']);

/**
 * Validar que el ID sea válido (mayor a 0)
 */
if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'ID no válido'
    ]);
    exit();
}

// ================================================================
// 3. VERIFICAR QUE LA PERSONA EXISTE
// ================================================================
/**
 * Antes de eliminar, verificar que el registro existe
 * Esto evita intentar eliminar algo que no existe
 * 
 * SELECT id FROM personas WHERE id = $id
 * Búsqueda simple solo por ID (es rápida con índice)
 */
$verificar = $conexion->query("SELECT id FROM personas WHERE id = $id");

/**
 * Verificar si la query fue exitosa Y si retornó resultados
 * num_rows: cantidad de filas retornadas
 * Si num_rows = 0, la persona no existe
 */
if ($verificar->num_rows === 0) {
    http_response_code(404);  // Not Found (no existe)
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Infiel no encontrado'
    ]);
    exit();
}

// ================================================================
// 4. ELIMINAR EL REGISTRO
// ================================================================
/**
 * DELETE FROM: eliminar filas
 * WHERE id = $id: solo la fila con este ID
 * 
 * IMPORTANTE: El WHERE es OBLIGATORIO
 * Si no lo pones, ¡elimina TODA la tabla!
 * 
 * Error común:
 * DELETE FROM personas;  // ❌ ¡BORRA TODO!
 * DELETE FROM personas WHERE id = 5;  // ✓ Correcto
 */
$sql = "DELETE FROM personas WHERE id = $id";

/**
 * Ejecutar el DELETE
 */
if (!$conexion->query($sql)) {
    /**
     * Si hay error, retornar código 500
     * Incluir el mensaje de error de MySQL
     */
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error al eliminar: ' . $conexion->error
    ]);
    exit();
}

// ================================================================
// 5. RESPUESTA EXITOSA
// ================================================================
/**
 * Código 200: OK
 * Confirmación de que se eliminó correctamente
 * Incluir el ID que se eliminó
 */
http_response_code(200);
echo json_encode([
    'exito' => true,
    'mensaje' => '✓ Infiel eliminado del registro',
    'datos' => ['id' => $id]
]);

// ================================================================
// 6. CERRAR CONEXIÓN
// ================================================================
$conexion->close();

/**
 * FIN DE ELIMINAR.PHP
 * 
 * Resumen del flujo:
 * 1. JavaScript: fetch('api/eliminar.php?id=5')
 * 2. Este archivo obtiene el ID de la URL
 * 3. Verifica que el ID sea válido
 * 4. Verifica que la persona existe
 * 5. Ejecuta DELETE FROM personas WHERE id = $id
 * 6. Retorna JSON con resultado
 * 7. JavaScript recarga la tabla para mostrar cambios
 * 
 * Buenas prácticas:
 * ✓ Validar entrada (el ID)
 * ✓ Verificar existencia (antes de eliminar)
 * ✓ Código HTTP apropiado (200, 400, 404, 500)
 * ✓ Mensaje descriptivo en respuesta JSON
 * ✓ Cerrar conexión
 * 
 * Mejoras para producción:
 * ✗ Usar Prepared Statements (no concatenación de SQL)
 * ✗ Agregar autenticación (verificar que el usuario tiene permisos)
 * ✗ Usar soft delete (marcar como eliminado, no borrar físico)
 * ✗ Registrar auditoría (quién eliminó, cuándo, etc)
 */
?>