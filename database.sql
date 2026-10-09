-- ====================================================================
-- SISTEMA INTEGRAL DE GESTIÓN DE PRÁCTICAS ACADÉMICAS (SIGPA - UDI)
-- BASE DE DATOS OFICIAL: POSTGRESQL
-- Asignaturas: Ingeniería de Software II | Programación III | TGS
-- Universidad de Investigación y Desarrollo - V Semestre
-- ====================================================================

-- Eliminar tablas si existen (para reinicio limpio)
DROP TABLE IF EXISTS detalle_criterio_rubrica CASCADE;
DROP TABLE IF EXISTS evaluacion_rubrica CASCADE;
DROP TABLE IF EXISTS visita_supervision CASCADE;
DROP TABLE IF EXISTS plan_clase CASCADE;
DROP TABLE IF EXISTS bitacora_actividad CASCADE;
DROP TABLE IF EXISTS asignacion_practica CASCADE;
DROP TABLE IF EXISTS institucion_receptora CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS rol CASCADE;

-- 1. TABLA: ROLES DE USUARIO
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- 'director', 'coordinador', 'docente', 'estudiante', 'institucion'
    descripcion VARCHAR(200)
);

INSERT INTO rol (nombre, descripcion) VALUES
('director', 'Director del Programa de Licenciatura / Acreditación'),
('coordinador', 'Coordinador de Prácticas Académicas y Convenios'),
('docente', 'Docente Asesor y Supervisor de Práctica en Aula'),
('estudiante', 'Estudiante Practicante en Formación Docente'),
('institucion', 'Institución Educativa Receptora / Colegio');

-- 2. TABLA: USUARIOS
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES rol(id_rol) ON DELETE RESTRICT,
    nombre_completo VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    programa_academico VARCHAR(100),
    codigo_estudiantil VARCHAR(20) UNIQUE,
    nit_institucion VARCHAR(25),
    clave VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios demo
INSERT INTO usuario (id_rol, nombre_completo, email, documento, telefono, programa_academico, codigo_estudiantil, clave) VALUES
(1, 'Dra. Elena Rocío Gómez Ortiz', 'egomez@udi.edu.co', '63.458.910', '+57 315 892 1102', 'Facultad de Ingenierías y Ciencias de la Educación - UDI', NULL, 'director2026'),
(2, 'Ing. Carlos Mauricio Benítez Peña', 'cbenitez@udi.edu.co', '91.240.518', '+57 301 445 7789', 'Coordinación de Prácticas Académicas y Convenios - UDI', NULL, 'coordinador2026'),
(3, 'Prof. Martha Cecilia Rueda Vargas', 'mrueda@udi.edu.co', '37.810.420', '+57 312 609 3321', 'Dpto. de Práctica Pedagógica y Didáctica - UDI', NULL, 'docente2026'),
(4, 'Camilo Andrés Rangel Moreno', 'crangel@udi.edu.co', '1.098.765.432', '+57 320 812 3456', 'Licenciatura en Educación / Informática', '2022104509', 'estudiante2026');

INSERT INTO usuario (id_rol, nombre_completo, email, documento, telefono, programa_academico, nit_institucion, clave) VALUES
(5, 'Lic. Humberto Serrano (Rectoría)', 'rectoria@colegiosantander.edu.co', '13.840.119', '+57 607 671 2200', 'Colegio Santander de Bucaramanga', '890.201.442-1', 'colegio2026');

-- 3. TABLA: INSTITUCIONES RECEPTORAS Y CONVENIOS
CREATE TABLE institucion_receptora (
    id_institucion SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(25) NOT NULL UNIQUE,
    rector_director VARCHAR(120) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    ciudad VARCHAR(60) DEFAULT 'Bucaramanga',
    telefono VARCHAR(30),
    email VARCHAR(100),
    numero_convenio VARCHAR(50) NOT NULL UNIQUE,
    vigencia_convenio DATE NOT NULL,
    estado_convenio VARCHAR(30) DEFAULT 'vigente', -- 'vigente', 'en_renovacion', 'vencido'
    cupos_totales INT DEFAULT 6,
    cupos_ocupados INT DEFAULT 0,
    sector VARCHAR(20) DEFAULT 'Oficial', -- 'Oficial', 'Privado'
    tutor_institucional VARCHAR(120),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO institucion_receptora (nombre, nit, rector_director, direccion, ciudad, telefono, email, numero_convenio, vigencia_convenio, estado_convenio, cupos_totales, cupos_ocupados, sector, tutor_institucional) VALUES
('Colegio de Santander (Sede Principal)', '890.201.442-1', 'Lic. Humberto Serrano Flórez', 'Calle 9 # 25-12', 'Bucaramanga', '(607) 671-2200', 'contacto@colegiosantander.edu.co', 'CONV-UDI-2025-014', '2027-11-30', 'vigente', 10, 4, 'Oficial', 'Esp. Claudia Patricia Mantilla'),
('Instituto Técnico Dámaso Zapata (Tecnológico)', '890.204.301-8', 'Mg. José Joaquín Claro', 'Carrera 27 # 10-02', 'Bucaramanga', '(607) 634-1190', 'rectoria@itdz.edu.co', 'CONV-UDI-2024-088', '2026-12-15', 'vigente', 8, 5, 'Oficial', 'Lic. Germán Darío Fonseca'),
('Escuela Normal Superior de Bucaramanga', '804.001.992-3', 'Dra. María Cristina Solano', 'Calle 30 # 26-45', 'Bucaramanga', '(607) 635-4420', 'practicas@normalbucaramanga.edu.co', 'CONV-UDI-2025-029', '2028-06-30', 'vigente', 12, 6, 'Oficial', 'Mg. Astrid Carolina Barajas'),
('Colegio San Pedro Claver', '860.007.411-9', 'P. Diego Cristancho S.J.', 'Cra. 28 # 47-06, Sotomayor', 'Bucaramanga', '(607) 643-6000', 'academica@sanpedro.edu.co', 'CONV-UDI-2023-052', '2026-10-31', 'en_renovacion', 6, 2, 'Privado', 'Lic. Mónica Julieth Vega'),
('Institución Educativa Aurelio Martínez Mutis', '890.207.654-4', 'Esp. Álvaro Forero Reyes', 'Calle 55 # 17W-20', 'Bucaramanga', '(607) 644-8801', 'secretaria@aureliomartinez.edu.co', 'CONV-UDI-2025-041', '2027-05-15', 'vigente', 8, 3, 'Oficial', 'Prof. William Sánchez');

-- 4. TABLA: ASIGNACIONES DE PRÁCTICA
CREATE TABLE asignacion_practica (
    id_asignacion SERIAL PRIMARY KEY,
    id_estudiante INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_institucion INT NOT NULL REFERENCES institucion_receptora(id_institucion) ON DELETE RESTRICT,
    id_docente_asesor INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    periodo_academico VARCHAR(20) NOT NULL, -- Ej: 'II - 2026'
    nivel_practica VARCHAR(60) NOT NULL, -- 'Práctica Pedagógica I', 'Práctica II', etc.
    horas_requeridas INT NOT NULL DEFAULT 160, -- 160 o 320 según Decreto 1075 MEN
    horas_completadas INT DEFAULT 0,
    horas_validadas INT DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(30) DEFAULT 'activa', -- 'pendiente', 'activa', 'en_riesgo', 'completada'
    nota_promedio NUMERIC(3,2) DEFAULT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO asignacion_practica (id_estudiante, id_institucion, id_docente_asesor, periodo_academico, nivel_practica, horas_requeridas, horas_completadas, horas_validadas, fecha_inicio, fecha_fin, estado, nota_promedio) VALUES
(4, 1, 3, 'II - 2026', 'Práctica Pedagógica II', 160, 116, 108, '2026-08-04', '2026-11-20', 'activa', 4.65);

-- 5. TABLA: BITÁCORA DIARIA DE ACTIVIDADES (ESTUDIANTE)
CREATE TABLE bitacora_actividad (
    id_bitacora SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL REFERENCES asignacion_practica(id_asignacion) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    horas INT NOT NULL CHECK (horas > 0 AND horas <= 12),
    tipo_actividad VARCHAR(50) NOT NULL, -- 'Docencia Directa', 'Observación', 'Planeación', 'Acompañamiento'
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia_url VARCHAR(255),
    validado_institucion BOOLEAN DEFAULT FALSE,
    validado_por VARCHAR(120),
    fecha_validacion DATE,
    observaciones_colegio TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO bitacora_actividad (id_asignacion, fecha, horas, tipo_actividad, titulo, descripcion, validado_institucion, validado_por, fecha_validacion, observaciones_colegio) VALUES
(1, '2026-10-02', 4, 'Docencia Directa', 'Clase de Algoritmia Básica y Pensamiento Computacional', 'Orientación de sesión de clase con estudiantes de 9° grado usando diagramas de flujo y pseudocódigo interactivo.', TRUE, 'Esp. Claudia Mantilla (Tutora Institucional)', '2026-10-03', 'Excelente dominio del tema y participación activa.'),
(1, '2026-10-04', 4, 'Acompañamiento', 'Taller de Laboratorio y Práctica con Scratch', 'Apoyo individual a estudiantes en la creación de videojuegos educativos para matemáticas.', TRUE, 'Esp. Claudia Mantilla (Tutora Institucional)', '2026-10-05', 'Puntualidad y adecuada mediación pedagógica en el aula de cómputo.'),
(1, '2026-10-06', 4, 'Planeación', 'Diseño de Guías Didácticas e Instrumentos Evaluativos', 'Elaboración de rúbricas formativas para el 3er periodo académico en articulación con el PEI del colegio.', TRUE, 'Lic. Humberto Serrano (Rector)', '2026-10-07', 'Alineado con los estándares del MEN y el currículo institucional.'),
(1, '2026-10-07', 4, 'Docencia Directa', 'Evaluación Formativa y Retroalimentación Grupal', 'Aplicación de prueba diagnóstica y plenaria de retroalimentación en el aula.', FALSE, NULL, NULL, NULL);

-- 6. TABLA: PLANES DE CLASE (ENTREGA Y REVISIÓN PEDAGÓGICA)
CREATE TABLE plan_clase (
    id_plan SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL REFERENCES asignacion_practica(id_asignacion) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    asignatura VARCHAR(80) NOT NULL,
    grado_grupo VARCHAR(40) NOT NULL,
    fecha_entrega DATE NOT NULL,
    objetivo TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente_revision', -- 'pendiente_revision', 'aprobado', 'con_observaciones'
    retroalimentacion_asesor TEXT,
    calificacion NUMERIC(3,2),
    documento_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO plan_clase (id_asignacion, titulo, asignatura, grado_grupo, fecha_entrega, objetivo, estado, retroalimentacion_asesor, calificacion) VALUES
(1, 'Plan de Clase: Introducción a la Estructura de Decisión Lógica', 'Tecnología e Informática', 'Grado 9-02', '2026-09-28', 'Desarrollar habilidades de pensamiento lógico aplicando condicionales Sí/Entonces en resolución de problemas cotidianos.', 'aprobado', 'Plan de clase muy bien estructurado. Se sugiere incluir un momento breve de activación de saberes previos.', 4.80),
(1, 'Plan de Clase: Bucles y Ciclos Repetitivos en Programación por Bloques', 'Tecnología e Informática', 'Grado 9-01', '2026-10-05', 'Modelar algoritmos eficientes empleando bucles "Para" y "Mientras" mediante dinámicas desconectadas y plataforma Scratch.', 'aprobado', 'Excelente integración de actividades desenchufadas (unplugged) para estudiantes con dificultades.', 4.90);

-- 7. TABLA: VISITAS DE SUPERVISIÓN EN AULA (DOCENTE ASESOR)
CREATE TABLE visita_supervision (
    id_visita SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL REFERENCES asignacion_practica(id_asignacion) ON DELETE CASCADE,
    id_docente INT NOT NULL REFERENCES usuario(id_usuario),
    numero_visita INT NOT NULL,
    fecha DATE NOT NULL,
    modalidad VARCHAR(40) DEFAULT 'Presencial en Aula',
    fortalezas_observadas TEXT NOT NULL,
    aspectos_mejorar TEXT NOT NULL,
    compromisos TEXT NOT NULL,
    calificacion_sesion NUMERIC(3,2) NOT NULL CHECK (calificacion_sesion >= 0.0 AND calificacion_sesion <= 5.0),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO visita_supervision (id_asignacion, id_docente, numero_visita, fecha, modalidad, fortalezas_observadas, aspectos_mejorar, compromisos, calificacion_sesion) VALUES
(1, 3, 1, '2026-09-15', 'Presencial en Aula', 'Seguridad en la dicción, manejo de recursos multimedia y empatía con el grupo de 9° grado.', 'Optimizar la gestión del tiempo durante el cierre de la clase.', 'Implementar temporizador visible en proyector y rúbrica impresa al inicio.', 4.50),
(1, 3, 2, '2026-10-02', 'Presencial en Aula', 'Notorio avance en el control de tiempos, excelente uso de la estrategia de aprendizaje cooperativo.', 'Profundizar en la atención a dos estudiantes con necesidades educativas específicas (PIAR).', 'Reunirse con la psicorientadora del Colegio Santander para adecuar material didáctico diferenciado.', 4.80);

-- 8. TABLA: EVALUACIÓN POR RÚBRICA FORMATIVA (MEN / CNA)
CREATE TABLE evaluacion_rubrica (
    id_evaluacion SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL REFERENCES asignacion_practica(id_asignacion) ON DELETE CASCADE,
    id_evaluador INT NOT NULL REFERENCES usuario(id_usuario),
    corte_periodo VARCHAR(30) NOT NULL, -- 'Corte 1', 'Corte 2', 'Evaluación Final'
    fecha DATE NOT NULL,
    nota_final NUMERIC(3,2) NOT NULL CHECK (nota_final >= 0.0 AND nota_final <= 5.0),
    concepto_cualitativo TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO evaluacion_rubrica (id_asignacion, id_evaluador, corte_periodo, fecha, nota_final, concepto_cualitativo) VALUES
(1, 3, 'Corte 1', '2026-09-25', 4.75, 'El practicante demuestra alta solvencia técnica y vocación docente. Cumple a cabalidad los lineamientos curriculares.');

-- 9. TABLA: DETALLE DE CRITERIOS DE RÚBRICA
CREATE TABLE detalle_criterio_rubrica (
    id_detalle SERIAL PRIMARY KEY,
    id_evaluacion INT NOT NULL REFERENCES evaluacion_rubrica(id_evaluacion) ON DELETE CASCADE,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ponderacion_porcentaje INT NOT NULL,
    puntaje NUMERIC(3,2) NOT NULL CHECK (puntaje >= 0.0 AND puntaje <= 5.0)
);

INSERT INTO detalle_criterio_rubrica (id_evaluacion, categoria, descripcion, ponderacion_porcentaje, puntaje) VALUES
(1, 'Dominio Disciplinar y Curricular', 'Conocimiento sólido de los contenidos y estándares del MEN.', 20, 5.00),
(1, 'Planificación y Didáctica', 'Coherencia entre objetivos, metodologías y recursos propuestos.', 25, 4.80),
(1, 'Clima de Aula y Manejo de Grupo', 'Establecimiento de normas de convivencia y motivación a los alumnos.', 20, 4.50),
(1, 'Evaluación y Retroalimentación', 'Uso de instrumentos formativos y comunicación asertiva de logros.', 20, 4.60),
(1, 'Ética y Compromiso Institucional', 'Puntualidad, presentación personal y sentido de pertenencia UDI.', 15, 5.00);

-- ====================================================================
-- CONSULTAS DE EJEMPLO PARA EL DIRECTOR (KPIs DE ACREDITACIÓN)
-- ====================================================================

-- Total de horas validadas y porcentaje de avance por estudiante:
SELECT 
    u.nombre_completo AS estudiante,
    u.codigo_estudiantil,
    i.nombre AS colegio_receptor,
    a.horas_requeridas,
    a.horas_validadas,
    ROUND((a.horas_validadas::DECIMAL / a.horas_requeridas::DECIMAL) * 100, 1) AS porcentaje_cumplimiento,
    a.estado
FROM asignacion_practica a
JOIN usuario u ON a.id_estudiante = u.id_usuario
JOIN institucion_receptora i ON a.id_institucion = i.id_institucion;
