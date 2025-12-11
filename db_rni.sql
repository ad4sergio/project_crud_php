-- ================================================================
-- BASE DE DATOS RNI - REGISTRO NACIONAL DE INFIELES
-- ================================================================
-- Este script crea la base de datos y la tabla de personas
-- con 100 registros de ejemplo

-- ================================================================
-- 1. CREAR BASE DE DATOS
-- ================================================================
CREATE DATABASE IF NOT EXISTS db_rni;
USE db_rni;

-- ================================================================
-- 2. CREAR TABLA DE PERSONAS
-- ================================================================
CREATE TABLE IF NOT EXISTS personas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT,
    genero CHAR(1) NOT NULL CHECK (genero IN ('M', 'F')),
    ocupacion VARCHAR(30),
    distrito VARCHAR(50) NOT NULL,
    fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_genero (genero),
    INDEX idx_distrito (distrito),
    INDEX idx_fecha (fecha_creado)
);

-- ================================================================
-- 3. INSERTAR 100 REGISTROS DE PRUEBA
-- ================================================================
INSERT INTO personas (nombre, apellido, edad, genero, ocupacion, distrito) VALUES
('Juan', 'García López', 28, 'M', 'Trabaja', 'Los Olivos'),
('María', 'Rodríguez Pérez', 25, 'F', 'Estudia', 'Miraflores'),
('Carlos', 'Martínez López', 32, 'M', 'Trabaja y estudia', 'Surco'),
('Ana', 'González García', 29, 'F', 'Independiente', 'San Isidro'),
('Pedro', 'López Sánchez', 26, 'M', 'Trabaja', 'La Molina'),
('Rosa', 'Fernández Torres', 31, 'F', 'Desempleado', 'Barranco'),
('Sergio', 'Gómez Díaz', 27, 'M', 'Independiente', 'Comas'),
('Laura', 'Díaz Flores', 24, 'F', 'Estudia', 'Los Olivos'),
('Miguel', 'Flores Morales', 35, 'M', 'Trabaja', 'Puente Piedra'),
('Carmen', 'Morales Castillo', 30, 'F', 'Trabaja y estudia', 'Ate'),
('Diego', 'Castillo Ramos', 28, 'M', 'Trabaja', 'Chorrillos'),
('Patricia', 'Ramos Vargas', 26, 'F', 'Independiente', 'Chorrillos'),
('Javier', 'Vargas Silva', 33, 'M', 'Trabaja', 'Lima'),
('Claudia', 'Silva Mendoza', 29, 'F', 'Estudia', 'Rímac'),
('Roberto', 'Mendoza Ruiz', 31, 'M', 'Desempleado', 'El Agustino'),
('Verónica', 'Ruiz Vega', 27, 'F', 'Trabaja', 'La Victoria'),
('Fernando', 'Vega Ponce', 25, 'M', 'Estudia', 'Independencia'),
('Silvia', 'Ponce Navarro', 32, 'F', 'Trabaja y estudia', 'San Miguel'),
('Gustavo', 'Navarro Coronado', 28, 'M', 'Independiente', 'Magdalena del Mar'),
('Gloria', 'Coronado Quispe', 26, 'F', 'Trabaja', 'Pueblo Libre'),
('Alfonso', 'Quispe Mamani', 34, 'M', 'Trabaja', 'San Borja'),
('Susana', 'Mamani Salazar', 30, 'F', 'Independiente', 'Jesús María'),
('Raúl', 'Salazar Huanca', 29, 'M', 'Trabaja y estudia', 'Lince'),
('Beatriz', 'Huanca Condori', 27, 'F', 'Estudia', 'Santa Anita'),
('Andrés', 'Condori Torres', 31, 'M', 'Trabaja', 'San Juan de Lurigancho'),
('Ema', 'Torres García', 28, 'F', 'Desempleado', 'Carabayllo'),
('Pablo', 'García López', 26, 'M', 'Independiente', 'Puente Piedra'),
('Josefina', 'López Rodríguez', 33, 'F', 'Trabaja', 'Ancón'),
('Manuel', 'Rodríguez Martínez', 30, 'M', 'Trabaja y estudia', 'Lurín'),
('Irene', 'Martínez González', 25, 'F', 'Estudia', 'Pachacamac'),
('Julio', 'González Sánchez', 32, 'M', 'Trabaja', 'Pucusana'),
('Adriana', 'Sánchez Fernández', 29, 'F', 'Independiente', 'Santa María del Mar'),
('Enrique', 'Fernández Gómez', 27, 'M', 'Trabaja', 'Santa Rosa'),
('Catalina', 'Gómez Díaz', 31, 'F', 'Desempleado', 'Lurgancho-Chosica'),
('Ricardo', 'Díaz Flores', 28, 'M', 'Independiente', 'Chaclacayo'),
('Roxana', 'Flores Morales', 26, 'F', 'Trabaja', 'Cieneguilla'),
('Vicente', 'Morales Castillo', 34, 'M', 'Trabaja y estudia', 'San Juan de Miraflores'),
('Norma', 'Castillo Ramos', 30, 'F', 'Estudia', 'Villa El Salvador'),
('Alejandro', 'Ramos Vargas', 29, 'M', 'Trabaja', 'Villa María del Triunfo'),
('Margarita', 'Vargas Silva', 27, 'F', 'Independiente', 'Surquillo'),
('Héctor', 'Silva Mendoza', 32, 'M', 'Trabaja', 'La Molina'),
('Dolores', 'Mendoza Ruiz', 28, 'F', 'Desempleado', 'Breña'),
('Óscar', 'Ruiz Vega', 31, 'M', 'Trabaja y estudia', 'San Luis'),
('Luz', 'Vega Ponce', 25, 'F', 'Estudia', 'San Martín de Porres'),
('Leopoldo', 'Ponce Navarro', 33, 'M', 'Independiente', 'Punta Hermosa'),
('Estela', 'Navarro Coronado', 29, 'F', 'Trabaja', 'Punta Negra'),
('Efraín', 'Coronado Quispe', 27, 'M', 'Trabaja', 'Rímac'),
('Delia', 'Quispe Mamani', 30, 'F', 'Independiente', 'San Bartolo'),
('Ismael', 'Mamani Salazar', 26, 'M', 'Desempleado', 'Barranco'),
('Elsa', 'Salazar Huanca', 32, 'F', 'Trabaja y estudia', 'Chorrillos'),
('Constantino', 'Huanca Condori', 28, 'M', 'Independiente', 'Los Olivos'),
('Fabiola', 'Condori Torres', 31, 'F', 'Estudia', 'Ate'),
('Darío', 'Torres García', 29, 'M', 'Trabaja', 'Comas'),
('Graciela', 'García López', 27, 'F', 'Independiente', 'Surco'),
('Braulio', 'López Rodríguez', 33, 'M', 'Trabaja y estudia', 'La Molina'),
('Hermelinda', 'Rodríguez Martínez', 25, 'F', 'Trabaja', 'San Isidro'),
('Aurelio', 'Martínez González', 30, 'M', 'Independiente', 'Miraflores'),
('Aurelia', 'González Sánchez', 28, 'F', 'Desempleado', 'San Miguel'),
('Artemio', 'Sánchez Fernández', 26, 'M', 'Estudia', 'Jesús María'),
('Amalia', 'Fernández Gómez', 34, 'F', 'Trabaja', 'Lince'),
('Aquiles', 'Gómez Díaz', 31, 'M', 'Trabaja y estudia', 'Pueblo Libre'),
('Agripina', 'Díaz Flores', 29, 'F', 'Independiente', 'San Borja'),
('Anselmo', 'Flores Morales', 27, 'M', 'Trabaja', 'La Victoria'),
('Alicia', 'Morales Castillo', 32, 'F', 'Estudia', 'Independencia'),
('Aniceto', 'Castillo Ramos', 28, 'M', 'Independiente', 'Magdalena del Mar'),
('Antonia', 'Ramos Vargas', 30, 'F', 'Desempleado', 'Lima'),
('Abundio', 'Vargas Silva', 26, 'M', 'Trabaja', 'Rímac'),
('Araceli', 'Silva Mendoza', 33, 'F', 'Trabaja y estudia', 'El Agustino'),
('Anastasio', 'Mendoza Ruiz', 29, 'M', 'Independiente', 'La Victoria'),
('Antígona', 'Ruiz Vega', 27, 'F', 'Trabaja', 'San Juan de Lurigancho'),
('Abigaíl', 'Vega Ponce', 31, 'F', 'Estudia', 'Carabayllo'),
('Adalberto', 'Ponce Navarro', 28, 'M', 'Trabajar', 'Puente Piedra'),
('Adoración', 'Navarro Coronado', 26, 'F', 'Independiente', 'Ancón'),
('Adria', 'Coronado Quispe', 34, 'F', 'Trabaja y estudia', 'Lurín'),
('Adriano', 'Quispe Mamani', 30, 'M', 'Trabaja', 'Pachacamac'),
('Agustín', 'Mamani Salazar', 25, 'M', 'Desempleado', 'Pucusana'),
('Albino', 'Salazar Huanca', 32, 'M', 'Estudia', 'Santa María del Mar'),
('Alejo', 'Huanca Condori', 29, 'M', 'Trabaja', 'Santa Rosa'),
('Alicio', 'Condori Torres', 27, 'M', 'Independiente', 'Lurgancho-Chosica'),
('Alipio', 'Torres García', 31, 'M', 'Trabaja y estudia', 'Chaclacayo'),
('Aloiso', 'García López', 28, 'M', 'Independiente', 'Cieneguilla'),
('Alonso', 'López Rodríguez', 33, 'M', 'Trabaja', 'San Juan de Miraflores'),
('Alonso', 'Rodríguez Martínez', 30, 'M', 'Desempleado', 'Villa El Salvador'),
('Alonso', 'Martínez González', 26, 'M', 'Estudia', 'Villa María del Triunfo'),
('Alonso', 'González Sánchez', 34, 'M', 'Trabaja', 'Surquillo'),
('Alonso', 'Sánchez Fernández', 29, 'M', 'Independiente', 'San Luis'),
('Alonso', 'Fernández Gómez', 27, 'M', 'Trabaja y estudia', 'San Martín de Porres'),
('Alonso', 'Gómez Díaz', 32, 'M', 'Trabaja', 'Punta Hermosa');

-- ================================================================
-- 4. MOSTRAR REGISTROS CREADOS
-- ================================================================
SELECT COUNT(*) as total_registros FROM personas;
SELECT * FROM personas LIMIT 10;

-- ================================================================
-- 5. ESTADÍSTICAS INICIALES
-- ================================================================
SELECT 
    genero,
    COUNT(*) as cantidad,
    AVG(edad) as edad_promedio
FROM personas
GROUP BY genero;

SELECT 
    distrito,
    COUNT(*) as cantidad
FROM personas
GROUP BY distrito
ORDER BY cantidad DESC;
