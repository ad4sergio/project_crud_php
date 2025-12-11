<?php
/**
 * ================================================================
 * API/GUARDAR.PHP - CREAR O ACTUALIZAR PERSONA (POST)
 * ================================================================
 * Endpoint: POST /api/guardar.php
 * Propósito: Guardar una persona nueva o actualizar una existente
 * 
 * Recibe: JSON con los datos de la persona
 * Retorna: JSON con resultado (éxito o error)
 * 
 * Parámetros esperados en el JSON:
 * {
 *     "id": 0,                    // 0 = crear, >0 = actualizar
 *     "nombre": "Juan",
 *     "apellido": "Pérez",
 *     "edad": 28,
 *     "genero": "M",
 *     "ocupacion": "Trabaja",
 *     "distrito": "Los Olivos"
 * }
 * ================================================================
 */

// ================================================================
// 1. INCLUIR CONFIGURACIÓN
// ================================================================
require 'config.php';

// ================================================================
// 2. OBTENER DATOS JSON DEL REQUEST
// ================================================================
/**
 * file_get_contents("php://input")
 * Lee el cuerpo (body) de la petición HTTP
 * Necesario para obtener datos POST en formato JSON
 * 
 * "php://input" es un stream especial que contiene el body
 */
$json = file_get_contents("php://input");

/**
 * json_decode($json, true)
 * Convierte string JSON a array PHP
 * 
 * El segundo parámetro 'true' hace que devuelva un array
 * Si fuera 'false', devolvería un objeto stdClass
 * 
 * Ejemplo:
 * JSON: {"nombre":"Juan","edad":28}
 * Array: Array ( [nombre] => Juan [edad] => 28 )
 */
$datos = json_decode($json, true);

/**
 * Verificar si el JSON es válido
 * Si $datos es null, significa que el JSON estaba mal formado
 */
if (!$datos) {
    http_response_code(400);  // Bad Request (datos inválidos)
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Datos JSON no válidos'
    ]);
    exit();  // Terminar ejecución
}

// ================================================================
// 3. VALIDACIONES DE DATOS
// ================================================================
// Verificar que los datos requeridos estén presentes y sean válidos

/**
 * Validación 1: Nombre obligatorio y no vacío
 * !isset() = no existe
 * empty() = vacío o equivalente a falso
 */
if (!isset($datos['nombre']) || empty(trim($datos['nombre']))) {
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'El nombre es requerido'
    ]);
    exit();
}

/**
 * Validación 2: Apellido obligatorio y no vacío
 */
if (!isset($datos['apellido']) || empty(trim($datos['apellido']))) {
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'El apellido es requerido'
    ]);
    exit();
}

/**
 * Validación 3: Edad entre 18 y 99
 * intval() convierte a número entero
 */
$edad = intval($datos['edad']);
if ($edad < 18 || $edad > 99) {
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'La edad debe estar entre 18 y 99 años'
    ]);
    exit();
}

// ================================================================
// 4. SANITIZAR DATOS
// ================================================================
/**
 * Usar función validar() de config.php
 * Escapa caracteres especiales para prevenir inyección SQL
 * 
 * NOTA IMPORTANTE:
 * Esta es una protección básica.
 * En producción es MEJOR usar Prepared Statements:
 * 
 * $stmt = $conexion->prepare("UPDATE personas SET nombre = ? WHERE id = ?");
 * $stmt->bind_param("si", $nombre, $id);
 * $stmt->execute();
 */
$id = isset($datos['id']) && $datos['id'] ? intval($datos['id']) : 0;
$nombre = validar($datos['nombre']);
$apellido = validar($datos['apellido']);
$genero = validar($datos['genero'] ?? 'M');  // ?? = operador null coalescing
$ocupacion = validar($datos['ocupacion']);
$distrito = validar($datos['distrito']);

// ================================================================
// 5. DECIDIR: UPDATE o INSERT
// ================================================================
/**
 * Si id > 0: estamos editando (UPDATE)
 * Si id = 0: estamos creando nuevo (INSERT)
 */

if ($id > 0) {
    // ================================================================
    // 6A. ACTUALIZAR PERSONA EXISTENTE
    // ================================================================
    /**
     * UPDATE: modificar registro existente
     * SET: asignar nuevos valores
     * WHERE id = $id: solo el registro con este ID
     */
    $sql = "UPDATE personas SET 
                nombre = '$nombre',
                apellido = '$apellido',
                edad = $edad,
                genero = '$genero',
                ocupacion = '$ocupacion',
                distrito = '$distrito',
                fecha_actualizado = NOW()
            WHERE id = $id";
    
    /**
     * NOW()
     * Función SQL que retorna la fecha/hora actual
     * Actualiza automáticamente cuándo se modificó el registro
     */

    /**
     * Ejecutar query y verificar si tuvo error
     */
    if (!$conexion->query($sql)) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error: ' . $conexion->error
        ]);
        exit();
    }

    /**
     * Respuesta exitosa
     * Código 200: OK
     * Mensaje confirmando la actualización
     */
    echo json_encode([
        'exito' => true,
        'mensaje' => '✓ Infiel actualizado correctamente'
    ]);

} else {
    // ================================================================
    // 6B. CREAR NUEVO REGISTRO
    // ================================================================
    /**
     * INSERT INTO: agregar nuevo registro
     * VALUES: especificar los valores
     * 
     * Nota: No especificamos id, fecha_creado ni fecha_actualizado
     * El id se genera automáticamente (AUTO_INCREMENT)
     * Las fechas se ponen automáticamente (DEFAULT CURRENT_TIMESTAMP)
     */
    $sql = "INSERT INTO personas 
            (nombre, apellido, edad, genero, ocupacion, distrito, fecha_creado)
            VALUES 
            ('$nombre', '$apellido', $edad, '$genero', '$ocupacion', '$distrito', NOW())";

    /**
     * Ejecutar insert y verificar error
     */
    if (!$conexion->query($sql)) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error: ' . $conexion->error
        ]);
        exit();
    }

    /**
     * $conexion->insert_id
     * Retorna el ID del registro que se acaba de insertar
     * Útil para devolver el ID al cliente
     */
    $nuevoId = $conexion->insert_id;

    /**
     * Respuesta exitosa con código 201 (Created)
     * Incluir el ID del nuevo registro
     */
    echo json_encode([
        'exito' => true,
        'mensaje' => '✓ Nuevo infiel registrado correctamente',
        'datos' => ['id' => $nuevoId]
    ]);
}

// ================================================================
// 7. CERRAR CONEXIÓN
// ================================================================
$conexion->close();

/**
 * FIN DE GUARDAR.PHP
 * 
 * Resumen del flujo:
 * 1. JavaScript: fetch('api/guardar.php', {method: 'POST', body: JSON})
 * 2. Este archivo recibe el JSON
 * 3. Valida todos los datos
 * 4. Sanitiza para prevenir inyección SQL
 * 5. Decide si hacer UPDATE o INSERT
 * 6. Ejecuta la query
 * 7. Retorna JSON con resultado
 * 8. JavaScript muestra mensaje de éxito/error
 */
?>