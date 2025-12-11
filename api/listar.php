<?php
/**
 * ================================================================
 * API/LISTAR.PHP - OBTENER TODOS LOS REGISTROS (GET)
 * ================================================================
 * Endpoint: GET /api/listar.php
 * Propósito: Retornar todos los registros de la tabla personas en JSON
 * 
 * Flujo:
 * 1. El navegador hace una petición GET a este archivo
 * 2. Este archivo consulta la base de datos
 * 3. Retorna los datos en formato JSON
 * 4. JavaScript en el navegador recibe y procesa el JSON
 * ================================================================
 */

// ================================================================
// 1. INCLUIR CONFIGURACIÓN
// ================================================================
/**
 * require 'config.php'
 * Incluye el archivo de configuración que contiene:
 * - Constantes de conexión (DB_HOST, DB_USER, etc)
 * - La variable $conexion para conectarse a MySQL
 * - Función validar()
 * - Headers HTTP
 */
require 'config.php';

// ================================================================
// 2. TRY-CATCH PARA MANEJO DE ERRORES
// ================================================================
/**
 * try { ... } catch (Exception $e) { ... }
 * Estructura para capturar errores sin romper el programa
 * 
 * try: código normal
 * catch: si hay error, ejecuta código de recuperación
 * 
 * Esto asegura que siempre retornemos JSON válido
 */
try {
    
    // ================================================================
    // 3. CONSTRUIR QUERY SQL
    // ================================================================
    /**
     * SELECT: obtener datos
     * *: todas las columnas
     * FROM personas: de la tabla personas
     * ORDER BY id DESC: ordenar por ID descendente (más nuevos primero)
     * LIMIT 500: máximo 500 registros (evitar cargar demasiado)
     */
    $sql = "SELECT 
                id,
                nombre,
                apellido,
                edad,
                genero,
                ocupacion,
                distrito,
                DATE_FORMAT(fecha_creado, '%d/%m/%Y') as fecha_creado
            FROM personas
            ORDER BY id DESC
            LIMIT 500";
    
    /**
     * Explicación de DATE_FORMAT()
     * DATE_FORMAT(fecha_creado, '%d/%m/%Y')
     * Convierte TIMESTAMP a formato legible
     * '%d/%m/%Y' significa: día/mes/año
     * Ejemplo: 2024-01-15 → 15/01/2024
     * 
     * 'as fecha_creado' renombra la columna al mostrarla
     */

    // ================================================================
    // 4. EJECUTAR QUERY
    // ================================================================
    /**
     * $conexion->query($sql)
     * Envía la query a MySQL y retorna un objeto resultado
     * 
     * Si hay error, retorna false
     * Si es exitoso, retorna mysqli_result
     */
    $resultado = $conexion->query($sql);

    // ================================================================
    // 5. VERIFICAR SI HAY ERROR
    // ================================================================
    /**
     * if (!$resultado)
     * Verificar si la query falló
     * ! significa "NO", entonces: "si NO hay resultado"
     */
    if (!$resultado) {
        /**
         * throw new Exception()
         * Lanzar un error controlado
         * Esto saltará al catch() al final
         * 
         * $conexion->error contiene el mensaje de error de MySQL
         */
        throw new Exception("Error en la consulta: " . $conexion->error);
    }

    // ================================================================
    // 6. PROCESAR RESULTADOS
    // ================================================================
    /**
     * Crear array vacío para guardar los resultados
     * Lo llenaremos con un loop
     */
    $personas = array();

    /**
     * while ($fila = $resultado->fetch_assoc())
     * Recorrer cada fila del resultado
     * 
     * fetch_assoc() retorna:
     * - Una array asociativa (nombre columna => valor)
     * - false cuando no hay más filas
     * 
     * Ejemplo de $fila:
     * Array (
     *     [id] => 1,
     *     [nombre] => "Juan",
     *     [apellido] => "García",
     *     ...
     * )
     */
    while ($fila = $resultado->fetch_assoc()) {
        /**
         * Agregar cada fila al array $personas
         * [] significa: agregar al final del array
         */
        $personas[] = $fila;
    }

    // ================================================================
    // 7. RETORNAR RESPUESTA EXITOSA
    // ================================================================
    /**
     * http_response_code(200)
     * Establecer código HTTP 200 (OK/Éxito)
     * Otros códigos comunes:
     * 201: Created (recurso creado)
     * 400: Bad Request (datos inválidos)
     * 404: Not Found (no existe)
     * 500: Internal Server Error (error del servidor)
     */
    http_response_code(200);

    /**
     * echo json_encode($personas)
     * Convertir el array PHP a JSON
     * JSON es el formato que entiende JavaScript
     * 
     * Ejemplo de output:
     * [
     *     {"id":1,"nombre":"Juan","apellido":"García",...},
     *     {"id":2,"nombre":"María","apellido":"Rodríguez",...},
     *     ...
     * ]
     */
    echo json_encode($personas);

// ================================================================
// 8. CAPTURAR ERRORES
// ================================================================
/**
 * catch (Exception $e)
 * Si ocurre cualquier error en el try, se ejecuta esto
 * 
 * $e es el objeto Exception con información del error
 * $e->getMessage() retorna el mensaje de error
 */
} catch (Exception $e) {
    /**
     * Retornar error con código HTTP 500
     * El cliente sabrá que hubo un problema en el servidor
     */
    http_response_code(500);
    
    /**
     * Retornar JSON con error
     * El JavaScript recibirá este JSON y mostrará el error al usuario
     */
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

// ================================================================
// 9. CERRAR CONEXIÓN
// ================================================================
/**
 * $conexion->close()
 * Libera la conexión a la base de datos
 * Importante para no agotar recursos del servidor
 */
$conexion->close();

/**
 * FIN DE LISTAR.PHP
 * 
 * Resumen del flujo:
 * 1. JavaScript en el navegador: fetch('api/listar.php')
 * 2. Este archivo se ejecuta en el servidor
 * 3. Se conecta a MySQL y obtiene datos
 * 4. Convierte datos a JSON
 * 5. Envía JSON de vuelta al navegador
 * 6. JavaScript recibe JSON y actualiza la tabla
 */
?>