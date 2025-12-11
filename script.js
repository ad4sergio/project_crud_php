/**
 * ================================================================
 * SCRIPT.JS - LÓGICA PRINCIPAL DEL SISTEMA RNI
 * ================================================================
 * Sistema: Registro Nacional de Infieles del Perú
 * Versión: 1.0
 * Propósito: Controlar toda la funcionalidad de la aplicación
 * Lenguaje: JavaScript ES6+
 * 
 * ÍNDICE:
 * 1. Constantes y Variables Globales
 * 2. Inicialización
 * 3. Carga de Datos
 * 4. Funciones de Utilidad
 * 5. Gestión de Modal
 * 6. Guardar y Eliminar
 * 7. Filtros y Búsqueda
 * 8. Renderizado de Tabla
 * ================================================================
 */

/* ================================================================
   1. CONSTANTES Y VARIABLES GLOBALES
   ================================================================
   Variables que se usan en toda la aplicación */

/**
 * Array con los 44 distritos de Lima
 * Se usa para llenar los select de filtros y formulario
 */
const DISTRITOS_LIMA = [
    'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos',
    'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina',
    'La Victoria', 'Lima', 'Lince', 'Los Olivos', 'Lurgancho-Chosica', 'Lurín',
    'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pucusana', 'Pueblo Libre',
    'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja',
    'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis',
    'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar',
    'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
];

/**
 * Variable global que almacena TODOS los registros de la BD
 * Se llena cuando se carga la página con cargarDatos()
 */
let personas = [];

/**
 * Variable que almacena los registros filtrados/mostrados
 * Cambia al aplicar filtros, pero 'personas' siempre mantiene los datos originales
 */
let personasActuales = [];

/**
 * Indica si estamos en modo edición (true) o creación (false)
 * Se usa en guardarPersona() para saber si hacer UPDATE o INSERT
 */
let edicion = false;

/**
 * Almacena los datos de la persona que se está editando
 * Contiene: id, nombre, apellido, edad, genero, ocupacion, distrito
 */
let personaActual = null;

/* ================================================================
   2. INICIALIZACIÓN
   ================================================================
   Código que se ejecuta cuando el HTML está completamente cargado */

/**
 * Evento que se dispara cuando el DOM está completamente cargado
 * Ejecuta las funciones necesarias para iniciar la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 Aplicación RNI iniciada correctamente');
    
    cargarDatos();              // Obtener datos de la BD
    llenarSelectDistritos();    // Llenar dropdowns de distritos
    configurarModal();          /* Configurar eventos del modal
                                  (cerrar con ESC, click fuera, etc) */
});

/* ================================================================
   3. CARGA DE DATOS
   ================================================================
   Obtener datos del servidor PHP */

/**
 * Carga todos los registros de la BD desde el servidor
 * Usa Fetch API para hacer una petición HTTP GET a listar.php
 * Incluye timeout de 30 segundos para evitar cuelgues
 */
function cargarDatos() {
    // Mostrar spinner de carga
    mostrarLoading();

    // Crear controlador de abort para cancelar la petición si tarda mucho
    const controller = new AbortController();
    // Timeout de 30 segundos (30000 milisegundos)
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Hacer petición al servidor
    fetch('api/listar.php', {
        signal: controller.signal  // Pasar el signal para permitir cancelación
    })
        .then(response => {
            // Limpiar el timeout si llegó la respuesta
            clearTimeout(timeoutId);
            
            // Verificar si el status HTTP es OK (200)
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            // Convertir la respuesta a JSON
            // response.json() retorna una Promise
            return response.json();
        })
        .then(data => {
            // Aquí 'data' es el array de personas del servidor
            console.log('✅ Datos cargados:', data.length + ' registros');
            
            // Verificar si viene un error en la respuesta
            if (data.error) {
                mostrarAlerta('Error: ' + data.error, 'error');
                ocultarLoading();
                return;  // Salir de la función
            }

            // Verificar que la respuesta es un array
            if (Array.isArray(data)) {
                personas = data;            // Guardar en variable global
                personasActuales = data;    // Mostrar todos inicialmente
                renderizarTabla();          // Dibujar tabla en HTML
                actualizarContador();       // Mostrar cantidad de registros
                ocultarLoading();           // Esconder spinner
            } else {
                // Si no es array, mostrar error
                mostrarAlerta('Formato de datos inválido', 'error');
                ocultarLoading();
            }
        })
        .catch(error => {
            // Si hay error (timeout, error de red, etc)
            clearTimeout(timeoutId);
            console.error('❌ Error:', error);
            
            // Mostrar mensaje diferente según el tipo de error
            if (error.name === 'AbortError') {
                mostrarAlerta('La solicitud tardó demasiado. Intenta nuevamente.', 'error');
            } else {
                mostrarAlerta('Error al cargar: ' + error.message, 'error');
            }
            
            ocultarLoading();
        });
}

/**
 * Muestra el indicador de carga (spinner) en la tabla
 * Reemplaza el contenido de la tabla con un mensaje de carga
 */
function mostrarLoading() {
    const tbody = document.getElementById('tablaBody');
    // HTML con spinner animado
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 2rem;">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Cargando datos...</p>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Oculta el indicador de carga cuando ya tenemos los datos
 * Busca el elemento .loading y lo elimina del DOM
 */
function ocultarLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();  // Eliminar del documento
    }
}

/* ================================================================
   4. FUNCIONES DE UTILIDAD
   ================================================================
   Funciones auxiliares usadas en varios lugares */

/**
 * Muestra una alerta al usuario
 * @param {string} mensaje - Texto que se mostrará en la alerta
 * @param {string} tipo - 'success' o 'error' (por defecto 'success')
 * 
 * La alerta desaparece automáticamente después de 4 segundos
 */
function mostrarAlerta(mensaje, tipo = 'success') {
    // Obtener contenedor donde se muestran las alertas
    const container = document.getElementById('alertas');
    
    // Crear un nuevo elemento div para la alerta
    const alert = document.createElement('div');
    // Asignar clases: 'alert' + tipo específico
    alert.className = `alert alert-${tipo}`;
    
    // Insertar HTML con ícono y mensaje
    alert.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${mensaje}</span>
    `;

    // Agregar la alerta al contenedor
    container.appendChild(alert);

    // Automáticamente eliminar después de 4 segundos
    setTimeout(() => {
        // Aplicar animación de salida
        alert.style.animation = 'slideIn 0.3s ease reverse';
        // Después que termine la animación, eliminar del DOM
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

/**
 * Llena los select (dropdowns) con los distritos de Lima
 * Se ejecuta una sola vez al cargar la página
 * Hay dos select: uno en filtros y otro en el formulario modal
 */
function llenarSelectDistritos() {
    // Obtener referencias a los selectores
    const selectFiltro = document.getElementById('filtroDistrito');
    const selectModal = document.getElementById('distritoModal');

    // Opción inicial para filtro (permite seleccionar todos)
    selectFiltro.innerHTML = '<option value="">Todos los distritos</option>';

    // Recorrer el array de distritos
    DISTRITOS_LIMA.forEach(distrito => {
        // Crear opción para select de filtros
        const optionFiltro = document.createElement('option');
        optionFiltro.value = distrito;      // Valor que se envía
        optionFiltro.textContent = distrito; // Texto visible
        selectFiltro.appendChild(optionFiltro); // Agregar al select

        // Crear opción para select del modal
        const optionModal = document.createElement('option');
        optionModal.value = distrito;
        optionModal.textContent = distrito;
        selectModal.appendChild(optionModal);
    });
}

/**
 * Actualiza el contador de registros visible en la página
 * Se ejecuta cada vez que se filtran o cargan datos
 */
function actualizarContador() {
    // Actualizar el span con id "total-registros"
    document.getElementById('total-registros').textContent = personasActuales.length;
}

/* ================================================================
   5. GESTIÓN DE MODAL (VENTANA EMERGENTE)
   ================================================================
   Funciones para abrir, cerrar y controlar el modal */

/**
 * Configura los eventos del modal para poder cerrarlo
 * Se ejecuta una sola vez al iniciar la aplicación
 * 
 * Permite cerrar con:
 * 1. Botón X del modal
 * 2. Tecla ESC
 * 3. Click fuera del modal
 */
function configurarModal() {
    const modal = document.getElementById('modalPersona');

    // Cerrar al hacer click fuera del modal
    window.onclick = (e) => {
        if (e.target === modal) {  // Si el click fue en el fondo
            cerrarModal();
        }
    };

    // Cerrar al presionar tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
}

/**
 * Abre el modal para CREAR una nueva persona
 * Inicializa el formulario vacío
 */
function abrirModalAgregar() {
    // Indicar que estamos en modo de creación, no edición
    edicion = false;
    personaActual = null;
    
    // Cambiar título del modal
    document.getElementById('modalTitulo').textContent = '➕ Registrar Nuevo Infiel';
    
    // Limpiar todos los campos del formulario
    document.getElementById('formPersona').reset();
    
    // Limpiar campo oculto de ID
    document.getElementById('personaId').value = '';
    
    // Mostrar modal agregando clase 'active'
    document.getElementById('modalPersona').classList.add('active');
}

/**
 * Abre el modal para EDITAR una persona existente
 * Llena el formulario con los datos actuales
 * @param {number} id - ID de la persona a editar
 */
function abrirModalEditar(id) {
    // Buscar la persona en el array global
    const persona = personas.find(p => p.id == id);

    // Si no la encontró, mostrar error
    if (!persona) {
        mostrarAlerta('Persona no encontrada', 'error');
        return;
    }

    // Indicar que estamos en modo edición
    edicion = true;
    personaActual = persona;

    // Llenar el formulario con los datos de la persona
    document.getElementById('personaId').value = persona.id;
    document.getElementById('nombre').value = persona.nombre;
    document.getElementById('apellido').value = persona.apellido;
    document.getElementById('edad').value = persona.edad;
    document.getElementById('genero').value = persona.genero;
    document.getElementById('ocupacion').value = persona.ocupacion;
    document.getElementById('distritoModal').value = persona.distrito;

    // Cambiar título del modal
    document.getElementById('modalTitulo').textContent = '✏️ Editar Infiel';
    
    // Mostrar modal
    document.getElementById('modalPersona').classList.add('active');
}

/**
 * Cierra el modal
 * Limpia el formulario y oculta el modal
 */
function cerrarModal() {
    // Remover clase 'active' para ocultar con CSS
    document.getElementById('modalPersona').classList.remove('active');
    
    // Limpiar el formulario
    document.getElementById('formPersona').reset();
}

/* ================================================================
   6. GUARDAR Y ELIMINAR
   ================================================================
   Funciones para manipular datos en la BD */

/**
 * Guarda una persona (crear nueva o actualizar existente)
 * Se ejecuta cuando se envía el formulario del modal
 * @param {Event} event - Evento del formulario (para prevenir recarga)
 */
function guardarPersona(event) {
    // Prevenir el comportamiento por defecto del formulario (recarga)
    event.preventDefault();

    // Obtener el ID del campo oculto
    const id = document.getElementById('personaId').value;
    
    // Crear objeto con los datos del formulario
    const datos = {
        id: id ? parseInt(id) : 0,              // 0 = crear, >0 = actualizar
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        edad: parseInt(document.getElementById('edad').value),
        genero: document.getElementById('genero').value,
        ocupacion: document.getElementById('ocupacion').value,
        distrito: document.getElementById('distritoModal').value
    };

    console.log('📤 Enviando datos:', datos);

    /* ========== VALIDACIONES EN CLIENTE ==========
       Verificar que los datos sean válidos ANTES de enviar al servidor
       Esto mejora la experiencia del usuario */

    if (!datos.nombre || !datos.apellido) {
        mostrarAlerta('Nombre y apellido son requeridos', 'error');
        return;
    }

    if (datos.edad < 18 || datos.edad > 99) {
        mostrarAlerta('La edad debe estar entre 18 y 99 años', 'error');
        return;
    }

    if (!datos.ocupacion || !datos.distrito) {
        mostrarAlerta('Ocupación y distrito son requeridos', 'error');
        return;
    }

    /* ========== ENVIAR AL SERVIDOR ==========
       Usar Fetch API para enviar los datos a guardar.php */
    
    fetch('api/guardar.php', {
        method: 'POST',              // Usar POST para enviar datos
        headers: {
            'Content-Type': 'application/json'  // Especificar que es JSON
        },
        body: JSON.stringify(datos)  // Convertir objeto a string JSON
    })
        .then(response => response.json())  // Convertir respuesta a JSON
        .then(data => {
            console.log('📥 Respuesta:', data);
            
            // Verificar si fue exitoso
            if (data.exito) {
                // Mostrar mensaje de éxito
                mostrarAlerta(data.mensaje, 'success');
                
                // Cerrar modal
                cerrarModal();
                
                // Recargar los datos para ver cambios
                cargarDatos();
            } else {
                // Mostrar error del servidor
                mostrarAlerta(data.mensaje || 'Error desconocido', 'error');
            }
        })
        .catch(error => {
            console.error('❌ Error:', error);
            mostrarAlerta('Error: ' + error.message, 'error');
        });
}

/**
 * Elimina una persona con confirmación
 * @param {number} id - ID de la persona a eliminar
 */
function eliminarPersona(id) {
    // Pedir confirmación al usuario
    if (!confirm('¿Seguro que deseas eliminar este infiel de la base de datos?')) {
        return;  // Si dice "No", no hacer nada
    }

    // Enviar solicitud al servidor
    fetch(`api/eliminar.php?id=${id}`, {
        method: 'GET'  // Usar GET con parámetro en URL
    })
        .then(response => response.json())
        .then(data => {
            console.log('📥 Respuesta eliminación:', data);
            
            if (data.exito) {
                mostrarAlerta(data.mensaje, 'success');
                // Recargar datos
                cargarDatos();
            } else {
                mostrarAlerta(data.mensaje || 'Error al eliminar', 'error');
            }
        })
        .catch(error => {
            console.error('❌ Error:', error);
            mostrarAlerta('Error: ' + error.message, 'error');
        });
}

/* ================================================================
   7. FILTROS Y BÚSQUEDA
   ================================================================
   Funciones para filtrar y buscar registros */

/**
 * Aplica todos los filtros activos y actualiza la tabla
 * Se ejecuta cada vez que el usuario cambia un filtro
 * 
 * Filtros disponibles:
 * 1. Nombre/Apellido - búsqueda por texto
 * 2. Género - M o F
 * 3. Distrito - seleccionar de lista
 * 4. Orden - reciente, antiguo o por edad
 */
function aplicarFiltros() {
    // Obtener valores de los filtros
    const nombre = document.getElementById('filtroNombre').value.toLowerCase();
    const genero = document.getElementById('filtroGenero').value;
    const distrito = document.getElementById('filtroDistrito').value;
    const orden = document.getElementById('filtroOrden').value;

    /* ========== FILTRAR ARRAY ==========
       Usar filter() para crear un nuevo array solo con registros que cumplen
       las condiciones. Dejar vacío = no aplicar ese filtro */
    
    personasActuales = personas.filter(persona => {
        // Filtro 1: Nombre/Apellido (búsqueda parcial)
        const coincideNombre = !nombre ||  // Si está vacío, coincide
            persona.nombre.toLowerCase().includes(nombre) ||
            persona.apellido.toLowerCase().includes(nombre);

        // Filtro 2: Género
        const coincideGenero = !genero || persona.genero === genero;
        
        // Filtro 3: Distrito
        const coincideDistrito = !distrito || persona.distrito === distrito;

        // Retornar true solo si cumple TODOS los filtros
        return coincideNombre && coincideGenero && coincideDistrito;
    });

    /* ========== ORDENAR ARRAY ==========
       Usar sort() para ordenar los resultados filtrados */
    
    if (orden === 'reciente') {
        // Ordenar por ID descendente (más nuevos primero)
        personasActuales.sort((a, b) => b.id - a.id);
    } else if (orden === 'antiguo') {
        // Ordenar por ID ascendente (más viejos primero)
        personasActuales.sort((a, b) => a.id - b.id);
    } else if (orden === 'edad') {
        // Ordenar por edad descendente (mayores primero)
        personasActuales.sort((a, b) => b.edad - a.edad);
    }

    // Dibujar tabla con datos filtrados
    renderizarTabla();
    
    // Actualizar el contador visible
    actualizarContador();
}

/* ================================================================
   8. RENDERIZADO DE TABLA
   ================================================================
   Dibujar los datos en HTML */

/**
 * Renderiza (dibuja) la tabla HTML con los registros actuales
 * Se ejecuta cada vez que hay cambios en los datos
 * 
 * Convierte el array de objetos 'personasActuales' en filas HTML
 */
function renderizarTabla() {
    const tbody = document.getElementById('tablaBody');
    const sinDatos = document.getElementById('sinDatos');

    // Si no hay registros para mostrar
    if (personasActuales.length === 0) {
        tbody.innerHTML = '';              // Limpiar tabla
        sinDatos.style.display = 'block';  // Mostrar mensaje
        return;
    }

    // Ocultar mensaje de "sin datos"
    sinDatos.style.display = 'none';

    /* ========== CREAR FILAS HTML ==========
       map() convierte cada objeto en una fila HTML
       join('') convierte el array de strings en un solo string */
    
    tbody.innerHTML = personasActuales.map(persona => `
        <tr>
            <!-- ID con símbolo # -->
            <td style="color: var(--pink); font-weight: bold;">#${persona.id}</td>
            
            <!-- Nombre completo -->
            <td>${persona.nombre} ${persona.apellido}</td>
            
            <!-- Género con emoji -->
            <td>${persona.genero === 'M' ? '👨 Masculino' : '👩 Femenino'}</td>
            
            <!-- Edad -->
            <td>${persona.edad} años</td>
            
            <!-- Ocupación dentro de una badge (etiqueta) -->
            <td>
                <span style="
                    background: rgba(157, 78, 221, 0.3);
                    color: #9d4edd;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: bold;
                    display: inline-block;
                    white-space: nowrap;
                ">
                    ${persona.ocupacion}
                </span>
            </td>
            
            <!-- Distrito con emoji -->
            <td>📍 ${persona.distrito}</td>
            
            <!-- Fecha de registro -->
            <td>${persona.fecha_creado}</td>
            
            <!-- Botones de acción -->
            <td>
                <div class="actions">
                    <!-- Botón editar -->
                    <button class="btn btn-primary btn-small" onclick="abrirModalEditar(${persona.id})">
                        ✏️ Editar
                    </button>
                    <!-- Botón eliminar -->
                    <button class="btn btn-danger btn-small" onclick="eliminarPersona(${persona.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');  // join('') convierte el array en string

    // Log para debugging
    console.log('✅ Tabla renderizada con ' + personasActuales.length + ' registros');
}

/* ================================================================
   FIN DEL ARCHIVO
   ================================================================
   La aplicación está lista para usar
   Todos los eventos se disparan automáticamente según las acciones del usuario
   ================================================================
 */