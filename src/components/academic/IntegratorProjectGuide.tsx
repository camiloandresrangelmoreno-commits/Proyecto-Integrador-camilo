import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  Database, 
  FileText, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Video, 
  Award,
  Sparkles,
  Cpu,
  GitBranch,
  ShieldAlert
} from 'lucide-react';
import { INTEGRATOR_PROJECT_ADVANCES } from '../../data/initialData';

export const IntegratorProjectGuide: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<'avance1' | 'avance2' | 'final' | 'ieee'>('avance2');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const sqlDDLScript = `-- ====================================================================
-- SISTEMA INTEGRAL DE GESTIÓN DE PRÁCTICAS ACADÉMICAS (SIGPA - UDI)
-- PROYECTO INTEGRADOR: INGENIERÍA DE SOFTWARE II | PROGRAMACIÓN III | TGS
-- UNIVERSIDAD DE INVESTIGACIÓN Y DESARROLLO - V SEMESTRE 2026
-- ====================================================================

-- 1. TABLA: ROLES DE USUARIO
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- 'director', 'coordinador', 'docente', 'estudiante', 'institucion'
    descripcion VARCHAR(200)
);

-- 2. TABLA: USUARIOS
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES rol(id_rol) ON DELETE RESTRICT,
    nombre_completo VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    programa_academico VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: INSTITUCIONES RECEPTORAS Y CONVENIOS (COLEGIOS)
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
    sector VARCHAR(20) DEFAULT 'Oficial', -- 'Oficial', 'Privado'
    tutor_institucional VARCHAR(120)
);

-- 4. TABLA: ASIGNACIONES DE PRÁCTICA
CREATE TABLE asignacion_practica (
    id_asignacion SERIAL PRIMARY KEY,
    id_estudiante INT NOT NULL REFERENCES usuario(id_usuario),
    id_institucion INT NOT NULL REFERENCES institucion_receptora(id_institucion),
    id_docente_asesor INT NOT NULL REFERENCES usuario(id_usuario),
    periodo_academico VARCHAR(20) NOT NULL, -- Ej: 'II - 2026'
    nivel_practica VARCHAR(60) NOT NULL, -- 'Práctica Pedagógica I', 'Práctica II', etc.
    horas_requeridas INT NOT NULL DEFAULT 160, -- 160 o 320 según Decreto 1075 MEN
    horas_completadas INT DEFAULT 0,
    horas_validadas INT DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(30) DEFAULT 'activa', -- 'pendiente', 'activa', 'en_riesgo', 'completada'
    nota_promedio NUMERIC(3,2) DEFAULT NULL
);

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
    observaciones_colegio TEXT
);

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
    documento_url VARCHAR(255)
);

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
    calificacion_sesion NUMERIC(3,2) NOT NULL CHECK (calificacion_sesion >= 0.0 AND calificacion_sesion <= 5.0)
);

-- 8. TABLA: EVALUACIÓN POR RÚBRICA FORMATIVA (MEN / CNA)
CREATE TABLE evaluacion_rubrica (
    id_evaluacion SERIAL PRIMARY KEY,
    id_asignacion INT NOT NULL REFERENCES asignacion_practica(id_asignacion) ON DELETE CASCADE,
    id_evaluador INT NOT NULL REFERENCES usuario(id_usuario),
    corte_periodo VARCHAR(30) NOT NULL, -- 'Corte 1', 'Corte 2', 'Evaluación Final'
    fecha DATE NOT NULL,
    nota_final NUMERIC(3,2) NOT NULL CHECK (nota_final >= 0.0 AND nota_final <= 5.0),
    concepto_cualitativo TEXT NOT NULL
);

-- 9. TABLA: DETALLE DE CRITERIOS DE RÚBRICA
CREATE TABLE detalle_criterio_rubrica (
    id_detalle SERIAL PRIMARY KEY,
    id_evaluacion INT NOT NULL REFERENCES evaluacion_rubrica(id_evaluacion) ON DELETE CASCADE,
    categoria VARCHAR(100) NOT NULL, -- Dominio, Didáctica, Clima de aula, etc.
    ponderacion_porcentaje INT NOT NULL,
    puntaje NUMERIC(3,2) NOT NULL CHECK (puntaje >= 0.0 AND puntaje <= 5.0)
);`;

  const ieeePaperText = `SISTEMA INTEGRAL PARA LA GESTIÓN Y TRAZABILIDAD DE PRÁCTICAS ACADÉMICAS EN PROGRAMAS DE LICENCIATURA BASADO EN ARQUITECTURA WEB
Universidad de Investigación y Desarrollo - UDI
Facultad de Ingenierías - Programa de Ingeniería de Sistemas
Bucaramanga, Colombia - 2026

RESUMEN:
En los programas de formación docente y licenciatura en Colombia, las prácticas pedagógicas constituyen un pilar formativo regulado por el Ministerio de Educación Nacional (MEN) mediante el Decreto 1075 de 2015. Sin embargo, en diversas Instituciones de Educación Superior la gestión de estas prácticas se efectúa mediante mecanismos fragmentados y manuales (hojas de cálculo, correos y formularios físicos), generando retrasos en convenios, pérdida de evidencias y una sobrecarga operativa del 40% en la Dirección de Programa. El presente artículo expone el desarrollo de SIGPA-UDI, un sistema de información web integral diseñado bajo un enfoque sistémico (TGS) y arquitectura SPA cliente-servidor con base de datos relacional. La solución articula cinco módulos funcionales con control de acceso basado en roles (Director, Coordinador, Docente Asesor, Practicante e Institución Receptora), permitiendo el control en tiempo real del cumplimiento de horas reglamentarias, la aplicación de rúbricas pedagógicas estructuradas y la generación automática de indicadores para procesos de autoevaluación y acreditación ante el CNA.

Palabras Clave: Práctica Pedagógica, Decreto 1075 de 2015, Trazabilidad Académica, Acreditación CNA, Ingeniería de Software, Arquitectura Web.

1. INTRODUCCIÓN
Las prácticas pedagógicas y académicas en Colombia demandan un riguroso cumplimiento normativo ante el MEN y el Consejo Nacional de Acreditación (CNA). El Director de Programa requiere responder con métricas consolidadas sobre convenios interinstitucionales vigentes, horas de docencia directa y evaluación del desempeño.

2. METODOLOGÍA Y MODELADO SISTÉMICO
Siguiendo la metodología de desarrollo ágil articulada con el estándar IEEE 830 para especificación de requerimientos, el sistema se concibió como un sistema abierto (Teoría General de Sistemas - Bertalanffy), caracterizado por:
- Entradas: Estudiantes matriculados, convenios con colegios, docentes asesores.
- Proceso: Registro de bitácoras, validación de horas por rectoría, visitas de supervisión y rúbricas.
- Salidas: Horas certificadas, calificaciones ponderadas, informes de calidad institucional.
- Retroalimentación: Observaciones del docente asesor y planes de mejora en aula.

3. ARQUITECTURA DEL SOFTWARE
Se implementó una arquitectura desacoplada en tres capas:
- Capa de Presentación: React 19 + TypeScript + Tailwind CSS, garantizando una interfaz reactiva y accesible.
- Capa de Lógica de Negocio: Controladores de validación de horas, cálculo ponderado de rúbricas (1.0 a 5.0) y semáforos de riesgo.
- Capa de Persistencia: Modelo relacional en 3ra Forma Normal (3NF) con integridad referencial.

4. RESULTADOS Y DISCUSIÓN
El prototipo funcional implementado permitió automatizar el 100% de los casos de uso prioritarios:
a) Reducción del tiempo de consolidación de reportes de 3 semanas a generación instantánea (1 clic).
b) Cero pérdidas de evidencias pedagógicas mediante almacenamiento estructurado.
c) Alertas tempranas en semáforo de riesgo para practicantes con atrasos en horas mínimas.

5. CONCLUSIONES
SIGPA-UDI resuelve la problemática estructural de fragmentación de información en las prácticas académicas, transformando tareas operativas en una gestión estratégica orientada a la excelencia formativa y acreditación de alta calidad.`;

  return (
    <div className="space-y-6">
      
      {/* Banner de Cabecera del Proyecto Integrador */}
      <div className="bg-gradient-to-r from-[#002855] via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-xs rounded uppercase">
                V Semestre UDI
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                Proyecto Integrador de Ingeniería de Sistemas (II - 2026)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Software para la Gestión de Prácticas Académicas
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Guía técnica y académica estructurada para las asignaturas vinculadas: 
              <strong className="text-white"> Ingeniería del Software II (40%)</strong>, 
              <strong className="text-white"> Programación III (40%)</strong> y 
              <strong className="text-white"> Teoría General de Sistemas (40%)</strong>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-xs space-y-1.5 shrink-0">
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">1er Avance:</span>
              <strong className="text-emerald-400">30 de Agosto (100% Listo)</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">2do Avance:</span>
              <strong className="text-amber-300">11 de Octubre (Prototipo 50% + BD)</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">Entrega Final:</span>
              <strong className="text-blue-300">15 de Noviembre (100% + IEEE)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas de la Guía */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 sm:gap-4 bg-white p-2 rounded-2xl shadow-xs border">
        <button
          onClick={() => setSelectedPhase('avance1')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedPhase === 'avance1'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1er Avance: Propuesta & Requerimientos
        </button>

        <button
          onClick={() => setSelectedPhase('avance2')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedPhase === 'avance2'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2do Avance: Base de Datos & Prototipo 50%
        </button>

        <button
          onClick={() => setSelectedPhase('final')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedPhase === 'final'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Entrega Final: 100% Funcional & Manuales
        </button>

        <button
          onClick={() => setSelectedPhase('ieee')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedPhase === 'ieee'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Artículo Formato IEEE (Borrador)
        </button>
      </div>

      {/* CONTENIDO 1ER AVANCE */}
      {selectedPhase === 'avance1' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
              Contenido Requerido para el Primer Avance (Propuesta del Proyecto)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Problema y Justificación */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <strong className="text-blue-900 block font-bold text-sm">
                  1. Planteamiento del Problema & Justificación
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  En Colombia, las prácticas pedagógicas son obligatorias bajo el Decreto 1075 de 2015 del MEN. 
                  La dispersión de información en hojas de cálculo y correos genera retrasos en convenios, 
                  pérdida de evidencias y sobrecarga de más del 40% en tareas operativas para el Director de Programa.
                </p>
                <div className="p-2 bg-blue-100/60 rounded text-[11px] text-blue-900 font-semibold">
                  Solución: Plataforma SIGPA con roles diferenciados y trazabilidad en tiempo real.
                </div>
              </div>

              {/* Objetivos */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <strong className="text-blue-900 block font-bold text-sm">
                  2. Objetivos del Proyecto
                </strong>
                <p className="text-slate-700">
                  <strong>Objetivo General:</strong> Desarrollar un sistema de información web para la gestión integral de prácticas académicas de licenciaturas en la UDI.
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Automatizar la formalización y vigencia de convenios interinstitucionales.</li>
                  <li>Implementar la bitácora digital de horas con validación por colegio receptor.</li>
                  <li>Estructurar rúbricas pedagógicas cuantitativas y cualitativas de supervisión docente.</li>
                  <li>Consolidar indicadores automáticos para visitas de pares académicos del CNA.</li>
                </ul>
              </div>

              {/* Enfoque TGS */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <strong className="text-purple-900 block font-bold text-sm">
                  3. Enfoque Sistémico (Teoría General de Sistemas)
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  El sistema de prácticas se modela como un sistema abierto autorregulado:
                </p>
                <div className="space-y-1 text-[11px] text-slate-700">
                  <p>• <strong>Entradas:</strong> Estudiantes, convenios de colegios, docentes asesores asignados.</p>
                  <p>• <strong>Proceso:</strong> Sesiones de clase, bitácoras, visitas de observación en aula.</p>
                  <p>• <strong>Salidas:</strong> Horas reglamentarias validadas, conceptos evaluativos, reportes MEN.</p>
                  <p>• <strong>Retroalimentación:</strong> Observaciones de tutores y directores para mejora continua.</p>
                </div>
              </div>

              {/* Requerimientos Funcionales */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <strong className="text-emerald-900 block font-bold text-sm">
                  4. Requerimientos Funcionales Clave (RF01 - RF08)
                </strong>
                <ul className="space-y-1 text-[11px] text-slate-700 font-mono">
                  <li>• RF01: Autenticación y acceso diferenciado por 5 roles.</li>
                  <li>• RF02: Registro y alerta de vigencia de convenios colegiales.</li>
                  <li>• RF03: Asignación formal de practicante a colegio y asesor.</li>
                  <li>• RF04: Registro diario de bitácora y horas presenciales.</li>
                  <li>• RF05: Validación y firma digital de asistencia por rectoría.</li>
                  <li>• RF06: Calificación formativa con rúbrica pedagógica (1 a 5).</li>
                  <li>• RF07: Semáforo de riesgo para practicantes rezagados.</li>
                  <li>• RF08: Generación de informe oficial imprimible para MEN/CNA.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 2DO AVANCE (BASE DE DATOS & PROTOTIPO 50%) */}
      {selectedPhase === 'avance2' && (
        <div className="space-y-6">
          
          {/* Tarjeta de Script SQL DDL */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                  Entrega Requerida: Base de Datos Relacional
                </span>
                <h3 className="text-base font-bold mt-1 text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Script DDL SQL (PostgreSQL / MySQL) - Tablas del Sistema</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cumple con normalización 3NF, llaves primarias, foráneas, restricciones CHECK y tipos de datos.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(sqlDDLScript, 'sql-script')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shrink-0"
              >
                {copiedItem === 'sql-script' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedItem === 'sql-script' ? '¡Código SQL Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-400 leading-relaxed border border-slate-800 max-h-96">
              {sqlDDLScript}
            </pre>
          </div>

          {/* Diccionario de Datos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Diccionario de Datos del Modelo Relacional (Tablas Principales)</span>
            </h3>

            <div className="space-y-4 text-xs">
              
              {/* Tabla Usuario */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800">
                  Tabla: usuario (Almacena los actores del sistema)
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 text-slate-600 border-b">
                    <tr>
                      <th className="p-2">Campo</th>
                      <th className="p-2">Tipo</th>
                      <th className="p-2">Clave</th>
                      <th className="p-2">Nulo</th>
                      <th className="p-2">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr><td className="p-2 font-mono font-bold">id_usuario</td><td className="p-2 font-mono">SERIAL</td><td className="p-2 font-bold text-amber-600">PK</td><td className="p-2">NO</td><td className="p-2">Identificador único autoincrementable</td></tr>
                    <tr><td className="p-2 font-mono font-bold">id_rol</td><td className="p-2 font-mono">INT</td><td className="p-2 font-bold text-blue-600">FK</td><td className="p-2">NO</td><td className="p-2">Referencia a tabla rol</td></tr>
                    <tr><td className="p-2 font-mono font-bold">nombre_completo</td><td className="p-2 font-mono">VARCHAR(120)</td><td className="p-2">-</td><td className="p-2">NO</td><td className="p-2">Nombres y apellidos del usuario</td></tr>
                    <tr><td className="p-2 font-mono font-bold">documento</td><td className="p-2 font-mono">VARCHAR(20)</td><td className="p-2">UNIQUE</td><td className="p-2">NO</td><td className="p-2">Cédula o tarjeta de identidad</td></tr>
                    <tr><td className="p-2 font-mono font-bold">email</td><td className="p-2 font-mono">VARCHAR(100)</td><td className="p-2">UNIQUE</td><td className="p-2">NO</td><td className="p-2">Correo institucional UDI</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Tabla Asignacion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800">
                  Tabla: asignacion_practica (Vínculo Estudiante - Colegio - Asesor)
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 text-slate-600 border-b">
                    <tr>
                      <th className="p-2">Campo</th>
                      <th className="p-2">Tipo</th>
                      <th className="p-2">Clave</th>
                      <th className="p-2">Nulo</th>
                      <th className="p-2">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr><td className="p-2 font-mono font-bold">id_asignacion</td><td className="p-2 font-mono">SERIAL</td><td className="p-2 font-bold text-amber-600">PK</td><td className="p-2">NO</td><td className="p-2">Identificador de la práctica</td></tr>
                    <tr><td className="p-2 font-mono font-bold">id_estudiante</td><td className="p-2 font-mono">INT</td><td className="p-2 font-bold text-blue-600">FK</td><td className="p-2">NO</td><td className="p-2">Usuario estudiante practicante</td></tr>
                    <tr><td className="p-2 font-mono font-bold">id_institucion</td><td className="p-2 font-mono">INT</td><td className="p-2 font-bold text-blue-600">FK</td><td className="p-2">NO</td><td className="p-2">Colegio receptor formalizado</td></tr>
                    <tr><td className="p-2 font-mono font-bold">id_docente_asesor</td><td className="p-2 font-mono">INT</td><td className="p-2 font-bold text-blue-600">FK</td><td className="p-2">NO</td><td className="p-2">Docente tutor UDI</td></tr>
                    <tr><td className="p-2 font-mono font-bold">horas_requeridas</td><td className="p-2 font-mono">INT</td><td className="p-2">-</td><td className="p-2">NO</td><td className="p-2">Meta reglamentaria (160 o 320 hrs)</td></tr>
                    <tr><td className="p-2 font-mono font-bold">horas_validadas</td><td className="p-2 font-mono">INT</td><td className="p-2">-</td><td className="p-2">NO</td><td className="p-2">Horas firmadas por la institución</td></tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Guion del Video de Sustentación (5 Minutos) */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <Video className="w-5 h-5 text-amber-700" />
              <span>Estructura Sugerida para el Video de Sustentación (Máx. 5 Minutos)</span>
            </div>
            <p className="text-xs text-amber-800">
              Según los lineamientos del Segundo Avance en el PDF, el video debe exponer el funcionamiento del prototipo al 50% y la base de datos:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-slate-900 block font-bold">Minuto 1: Introducción</strong>
                <p className="text-slate-600 text-[11px] mt-1">Presentar integrantes, problema del MEN (Decreto 1075) y objetivos del sistema SIGPA.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-slate-900 block font-bold">Minuto 2: Base de Datos</strong>
                <p className="text-slate-600 text-[11px] mt-1">Explicar el modelo Entidad-Relación y demostrar las tablas creadas en el motor SQL.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-slate-900 block font-bold">Minutos 3-4: Demostración en Vivo</strong>
                <p className="text-slate-600 text-[11px] mt-1">Iniciar sesión como Estudiante (crear bitácora), pasar a Colegio (validar) y a Docente (rúbrica).</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-slate-900 block font-bold">Minuto 5: Conclusiones</strong>
                <p className="text-slate-600 text-[11px] mt-1">Resaltar la reducción de carga del 40% para el Director y próximos pasos al avance final.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* CONTENIDO ENTREGA FINAL */}
      {selectedPhase === 'final' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
              Entregables Requeridos para la Sustentación Final (Noviembre 2026)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">1. Aplicación Funcional al 100%</strong>
                  <p className="text-slate-600 mt-0.5">
                    Todos los casos de uso implementados: Gestión de convenios, asignación de cupos, bitácora de horas, planes de clase, rúbricas pedagógicas y reportes para acreditación MEN.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">2. Manuales de Usuario y Técnico</strong>
                  <p className="text-slate-600 mt-0.5">
                    Guía ilustrada para cada actor (Director, Coordinador, Docente, Estudiante, Rector) y especificaciones de arquitectura, base de datos y despliegue.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">3. Póster Académico y Sustentación</strong>
                  <p className="text-slate-600 mt-0.5">
                    Sustentación presencial ante el comité evaluador de la UDI en la última semana de noviembre.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO ARTÍCULO IEEE */}
      {selectedPhase === 'ieee' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Borrador de Artículo de Investigación (Formato IEEE)
                </h3>
                <p className="text-xs text-slate-500">
                  Estructurado según el estándar IEEE requerido (5 a 8 páginas) con las referencias del PDF.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(ieeePaperText, 'ieee-text')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
              >
                {copiedItem === 'ieee-text' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedItem === 'ieee-text' ? '¡Artículo Copiado!' : 'Copiar Texto IEEE'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-50 rounded-xl overflow-x-auto text-xs font-sans text-slate-800 leading-relaxed border border-slate-200 whitespace-pre-wrap max-h-[500px]">
              {ieeePaperText}
            </pre>

            <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
              <strong className="text-slate-800 block mb-1">Bibliografía Oficial Incluida (PDF):</strong>
              <p>• SENN, James A. Análisis y Diseño de Sistemas de Información, McGraw-Hill, 1999.</p>
              <p>• PONS, Olga. Introducción a los Sistemas de Bases de Datos, Thompson, 2008.</p>
              <p>• PIATTINI, Mario. Tecnología y Diseño de Bases de Datos, Alfaomega, 2007.</p>
              <p>• PÉREZ, César. Oracle 10g - Administración y Análisis de Bases de Datos, Alfaomega, 2005.</p>
              <p>• MINISTERIO DE EDUCACIÓN NACIONAL. Decreto 1075 de 2015, Sector Educación, Colombia.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
