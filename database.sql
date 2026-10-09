-- ====================================================================
-- SISTEMA INTEGRAL DE GESTIÓN DE PRÁCTICAS ACADÉMICAS (SIGPA - UDI)
-- ESTRUCTURA OFICIAL BASADA EN EL DIAGRAMA E-R Y MODELO RELACIONAL
-- ASIGNATURAS: Ingeniería de Software II | Programación III | TGS
-- ====================================================================
-- ARQUITECTURA DE 2 BASES DE DATOS / SUBSISTEMAS EN POSTGRESQL:
-- 1. ESQUEMA / BD GESTION: Estudiante, Tutor, Institución, Tipo y Práctica
-- 2. ESQUEMA / BD SEGUIMIENTO: Bitácora, Evidencias y Evaluaciones
-- ====================================================================

-- CREACIÓN DE LOS 2 ESQUEMAS (2 BASES DE DATOS LÓGICAS EN POSTGRESQL)
CREATE SCHEMA IF NOT EXISTS gestion;
CREATE SCHEMA IF NOT EXISTS seguimiento;

-- ====================================================================
-- BASE DE DATOS 1: SUBSISTEMA DE GESTIÓN ACADÉMICA Y CONVENIOS (gestion)
-- ====================================================================

-- 1. TABLA: ESTUDIANTE (Según hoja cuadriculada)
DROP TABLE IF EXISTS gestion.estudiante CASCADE;
CREATE TABLE gestion.estudiante (
    documento VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(60) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    semestre INT NOT NULL DEFAULT 5,
    telefono VARCHAR(20)
);

-- 2. TABLA: TUTOR ACADÉMICO / DOCENTE ASESOR (Según hoja cuadriculada)
DROP TABLE IF EXISTS gestion.tutor_academico CASCADE;
CREATE TABLE gestion.tutor_academico (
    documento_tu VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(60) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)
);

-- 3. TABLA: INSTITUCIÓN RECEPTORA (Según hoja cuadriculada)
DROP TABLE IF EXISTS gestion.institucion CASCADE;
CREATE TABLE gestion.institucion (
    id_institucion SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    ciudad VARCHAR(60) NOT NULL DEFAULT 'Bucaramanga',
    telefono VARCHAR(30)
);

-- 4. TABLA: TIPO DE PRÁCTICA (Según hoja cuadriculada)
DROP TABLE IF EXISTS gestion.tipo_practica CASCADE;
CREATE TABLE gestion.tipo_practica (
    id_tipo SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL, -- Ej: 'Práctica Pedagógica I', 'Práctica II', 'Profundización'
    descripcion TEXT
);

-- 5. TABLA: PRÁCTICA (Vínculo central según hoja cuadriculada)
DROP TABLE IF EXISTS gestion.practica CASCADE;
CREATE TABLE gestion.practica (
    id_practica SERIAL PRIMARY KEY,
    fecha_ini DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    horas_cumplidas INT NOT NULL DEFAULT 0,
    estado VARCHAR(30) NOT NULL DEFAULT 'activa', -- 'pendiente', 'activa', 'en_riesgo', 'completada'
    nombre_prac VARCHAR(150) NOT NULL,
    documento VARCHAR(20) NOT NULL REFERENCES gestion.estudiante(documento) ON DELETE CASCADE,
    documento_tu VARCHAR(20) NOT NULL REFERENCES gestion.tutor_academico(documento_tu) ON DELETE RESTRICT,
    id_institucion INT NOT NULL REFERENCES gestion.institucion(id_institucion) ON DELETE RESTRICT,
    id_tipo INT NOT NULL REFERENCES gestion.tipo_practica(id_tipo) ON DELETE RESTRICT
);

-- ====================================================================
-- BASE DE DATOS 2: SUBSISTEMA DE SEGUIMIENTO, BITÁCORAS Y EVALUACIÓN (seguimiento)
-- ====================================================================

-- 6. TABLA: BITÁCORA (Según hoja cuadriculada)
DROP TABLE IF EXISTS seguimiento.bitacora CASCADE;
CREATE TABLE seguimiento.bitacora (
    id_bitacora SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion TEXT NOT NULL,
    observaciones TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Validado por Colegio', 'Aprobado'
    id_practica INT NOT NULL REFERENCES gestion.practica(id_practica) ON DELETE CASCADE
);

-- 7. TABLA: EVIDENCIA (Según hoja cuadriculada)
DROP TABLE IF EXISTS seguimiento.evidencia CASCADE;
CREATE TABLE seguimiento.evidencia (
    id_evidencia SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'Plan de Clase', 'Fotografía', 'Diario de Campo', 'Guía Didáctica'
    archivo VARCHAR(255) NOT NULL, -- Enlace o ruta al archivo
    descripcion TEXT,
    id_practica INT NOT NULL REFERENCES gestion.practica(id_practica) ON DELETE CASCADE
);

-- 8. TABLA: EVALUACIÓN (Según hoja cuadriculada)
DROP TABLE IF EXISTS seguimiento.evaluacion CASCADE;
CREATE TABLE seguimiento.evaluacion (
    id_evaluacion SERIAL PRIMARY KEY,
    calificacion NUMERIC(3,2) NOT NULL CHECK (calificacion >= 0.0 AND calificacion <= 5.0),
    observaciones TEXT,
    fecha DATE NOT NULL,
    id_bitacora INT REFERENCES seguimiento.bitacora(id_bitacora) ON DELETE SET NULL,
    documento_tu VARCHAR(20) NOT NULL REFERENCES gestion.tutor_academico(documento_tu) ON DELETE RESTRICT
);

-- ====================================================================
-- DATOS SEMILLA INICIALES (DEMO EXACTA PARA SUSTENTACIÓN)
-- ====================================================================

-- Datos Base de Datos 1 (gestion)
INSERT INTO gestion.estudiante (documento, nombre, apellido, correo, semestre, telefono) VALUES
('1098765432', 'Camilo Andrés', 'Rangel Moreno', 'crangel@udi.edu.co', 5, '3208123456'),
('1098765412', 'Laura Valentina', 'Díaz Castro', 'ldiaz@udi.edu.co', 5, '3104567890'),
('1098765488', 'Santiago', 'Silva Mendoza', 'ssilva@udi.edu.co', 5, '3157891234');

INSERT INTO gestion.tutor_academico (documento_tu, nombre, apellido, correo, especialidad, telefono) VALUES
('37810420', 'Martha Cecilia', 'Rueda Vargas', 'mrueda@udi.edu.co', 'Didáctica y Práctica Pedagógica', '3126093321'),
('91450880', 'Jorge Enrique', 'Ramírez Peña', 'jramirez@udi.edu.co', 'Informática Educativa', '3187654321');

INSERT INTO gestion.institucion (nombre, direccion, ciudad, telefono) VALUES
('Colegio de Santander (Sede Principal)', 'Calle 9 # 25-12', 'Bucaramanga', '(607) 671-2200'),
('Instituto Técnico Dámaso Zapata', 'Carrera 27 # 10-02', 'Bucaramanga', '(607) 634-1190'),
('Escuela Normal Superior de Bucaramanga', 'Calle 30 # 26-45', 'Bucaramanga', '(607) 635-4420');

INSERT INTO gestion.tipo_practica (nombre, descripcion) VALUES
('Práctica Pedagógica I', 'Práctica de observación y diagnóstico en instituciones de educación básica'),
('Práctica Pedagógica II', 'Práctica de intervención curricular y docencia directa asistida (160 horas)'),
('Práctica de Profundización', 'Práctica en proyectos tecnológicos y pedagógicos avanzados (320 horas)');

INSERT INTO gestion.practica (fecha_ini, fecha_fin, horas_cumplidas, estado, nombre_prac, documento, documento_tu, id_institucion, id_tipo) VALUES
('2026-08-04', '2026-11-20', 116, 'activa', 'Práctica de Informática y Pensamiento Lógico', '1098765432', '37810420', 1, 2),
('2026-08-04', '2026-11-20', 142, 'activa', 'Práctica de Tecnología en Aula', '1098765412', '37810420', 2, 2),
('2026-08-04', '2026-11-20', 54, 'en_riesgo', 'Práctica Inicial de Observación', '1098765488', '91450880', 3, 1);

-- Datos Base de Datos 2 (seguimiento)
INSERT INTO seguimiento.bitacora (fecha, descripcion, observaciones, estado, id_practica) VALUES
('2026-10-02', 'Clase de Algoritmia Básica y Diagramas de Flujo en Grado 9°', 'Excelente participación de estudiantes', 'Validado por Colegio', 1),
('2026-10-04', 'Taller de Laboratorio y Práctica con Scratch', 'Asistencia completa y buen manejo de aula', 'Validado por Colegio', 1),
('2026-10-06', 'Diseño de Guías Didácticas e Instrumentos de Evaluación', 'Alineado con el PEI institucional', 'Validado por Colegio', 1),
('2026-10-07', 'Evaluación Formativa y Retroalimentación Grupal', 'Pendiente de firma en rectoría', 'Pendiente', 1);

INSERT INTO seguimiento.evidencia (fecha, nombre, tipo, archivo, descripcion, id_practica) VALUES
('2026-10-02', 'Plan de Clase 01 - Condicionales', 'Plan de Clase', 'https://evidencias.udi.edu.co/plan01_camilo.pdf', 'Guía pedagógica para sesión de 4 horas', 1),
('2026-10-04', 'Foto Evidencia Aula de Cómputo', 'Fotografía', 'https://evidencias.udi.edu.co/foto_lab_camilo.jpg', 'Estudiantes trabajando en Scratch', 1);

INSERT INTO seguimiento.evaluacion (calificacion, observaciones, fecha, id_bitacora, documento_tu) VALUES
(4.75, 'El practicante demuestra alta solvencia técnica y vocación docente.', '2026-10-03', 1, '37810420'),
(4.80, 'Puntualidad y adecuada mediación pedagógica.', '2026-10-05', 2, '37810420');
