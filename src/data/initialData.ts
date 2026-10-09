import { 
  User, 
  Institution, 
  PracticeAssignment, 
  ActivityLog, 
  ClassPlan, 
  SupervisionVisit, 
  PedagogicalEvaluation,
  AcademicAdvanceGuide
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-dir-1',
    name: 'Dra. Elena Rocío Gómez Ortiz',
    email: 'egomez@udi.edu.co',
    role: 'director',
    documentNumber: '63.458.910',
    facultyOrSchool: 'Facultad de Ingenierías y Ciencias de la Educación - UDI',
    phone: '+57 315 892 1102',
    password: 'director2026'
  },
  {
    id: 'u-coord-1',
    name: 'Ing. Carlos Mauricio Benítez Peña',
    email: 'cbenitez@udi.edu.co',
    role: 'coordinador',
    documentNumber: '91.240.518',
    facultyOrSchool: 'Coordinación de Prácticas Académicas y Convenios - UDI',
    phone: '+57 301 445 7789',
    password: 'coordinador2026'
  },
  {
    id: 'u-doc-1',
    name: 'Prof. Martha Cecilia Rueda Vargas',
    email: 'mrueda@udi.edu.co',
    role: 'docente',
    documentNumber: '37.810.420',
    facultyOrSchool: 'Dpto. de Práctica Pedagógica y Didáctica',
    phone: '+57 312 609 3321',
    password: 'docente2026'
  },
  {
    id: 'u-est-1',
    name: 'Camilo Andrés Rangel Moreno',
    email: 'crangel@udi.edu.co',
    role: 'estudiante',
    documentNumber: '1.098.765.432',
    studentCode: '2022104509',
    facultyOrSchool: 'Licenciatura en Educación / Ingeniería de Sistemas',
    phone: '+57 320 812 3456',
    password: 'estudiante2026'
  },
  {
    id: 'u-inst-1',
    name: 'Lic. Humberto Serrano (Rectoría)',
    email: 'rectoria@colegiosantander.edu.co',
    role: 'institucion',
    documentNumber: '13.840.119',
    institutionNit: '890.201.442-1',
    facultyOrSchool: 'Colegio Santander de Bucaramanga',
    phone: '+57 607 671 2200',
    password: 'colegio2026'
  }
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'Colegio de Santander (Sede Principal)',
    nit: '890.201.442-1',
    rectorOrDirector: 'Lic. Humberto Serrano Flórez',
    address: 'Calle 9 # 25-12, Bucaramanga',
    city: 'Bucaramanga',
    phone: '(607) 671-2200',
    email: 'contacto@colegiosantander.edu.co',
    agreementStatus: 'vigente',
    agreementNumber: 'CONV-UDI-2025-014',
    agreementValidUntil: '2027-11-30',
    availableSlots: 10,
    assignedCount: 4,
    tutorName: 'Esp. Claudia Patricia Mantilla',
    sector: 'Oficial',
    level: 'Básica Secundaria y Media'
  },
  {
    id: 'inst-2',
    name: 'Instituto Técnico Dámaso Zapata (Tecnológico)',
    nit: '890.204.301-8',
    rectorOrDirector: 'Mg. José Joaquín Claro',
    address: 'Carrera 27 # 10-02, Bucaramanga',
    city: 'Bucaramanga',
    phone: '(607) 634-1190',
    email: 'rectoria@itdz.edu.co',
    agreementStatus: 'vigente',
    agreementNumber: 'CONV-UDI-2024-088',
    agreementValidUntil: '2026-12-15',
    availableSlots: 8,
    assignedCount: 5,
    tutorName: 'Lic. Germán Darío Fonseca',
    sector: 'Oficial',
    level: 'Educación Técnica y Secundaria'
  },
  {
    id: 'inst-3',
    name: 'Escuela Normal Superior de Bucaramanga',
    nit: '804.001.992-3',
    rectorOrDirector: 'Dra. María Cristina Solano',
    address: 'Calle 30 # 26-45, Bucaramanga',
    city: 'Bucaramanga',
    phone: '(607) 635-4420',
    email: 'practicas@normalbucaramanga.edu.co',
    agreementStatus: 'vigente',
    agreementNumber: 'CONV-UDI-2025-029',
    agreementValidUntil: '2028-06-30',
    availableSlots: 12,
    assignedCount: 6,
    tutorName: 'Mg. Astrid Carolina Barajas',
    sector: 'Oficial',
    level: 'Formación Docente y Básica Primaria'
  },
  {
    id: 'inst-4',
    name: 'Colegio San Pedro Claver',
    nit: '860.007.411-9',
    rectorOrDirector: 'P. Diego Cristancho S.J.',
    address: 'Cra. 28 # 47-06, Sotomayor, Bucaramanga',
    city: 'Bucaramanga',
    phone: '(607) 643-6000',
    email: 'academica@sanpedro.edu.co',
    agreementStatus: 'en_renovacion',
    agreementNumber: 'CONV-UDI-2023-052',
    agreementValidUntil: '2026-10-31',
    availableSlots: 6,
    assignedCount: 2,
    tutorName: 'Lic. Mónica Julieth Vega',
    sector: 'Privado',
    level: 'Preescolar, Básica y Media'
  },
  {
    id: 'inst-5',
    name: 'Institución Educativa Aurelio Martínez Mutis',
    nit: '890.207.654-4',
    rectorOrDirector: 'Esp. Álvaro Forero Reyes',
    address: 'Calle 55 # 17W-20, Real de Minas',
    city: 'Bucaramanga',
    phone: '(607) 644-8801',
    email: 'secretaria@aureliomartinez.edu.co',
    agreementStatus: 'vigente',
    agreementNumber: 'CONV-UDI-2025-041',
    agreementValidUntil: '2027-05-15',
    availableSlots: 8,
    assignedCount: 3,
    tutorName: 'Prof. William Sánchez',
    sector: 'Oficial',
    level: 'Básica y Media Técnica'
  }
];

export const INITIAL_ASSIGNMENTS: PracticeAssignment[] = [
  {
    id: 'asig-1',
    studentId: 'u-est-1',
    studentName: 'Camilo Andrés Rangel Moreno',
    studentCode: '2022104509',
    studentProgram: 'Licenciatura en Educación / Informática',
    institutionId: 'inst-1',
    institutionName: 'Colegio de Santander (Sede Principal)',
    advisorId: 'u-doc-1',
    advisorName: 'Prof. Martha Cecilia Rueda Vargas',
    academicPeriod: 'II - 2026',
    startDate: '2026-08-04',
    endDate: '2026-11-20',
    requiredHours: 160,
    completedHours: 116,
    validatedHours: 108,
    status: 'activa',
    gradeAverage: 4.6,
    practiceLevel: 'Práctica Pedagógica II'
  },
  {
    id: 'asig-2',
    studentId: 'est-2',
    studentName: 'Laura Valentina Díaz Castro',
    studentCode: '2022104512',
    studentProgram: 'Licenciatura en Educación Básica',
    institutionId: 'inst-2',
    institutionName: 'Instituto Técnico Dámaso Zapata',
    advisorId: 'u-doc-1',
    advisorName: 'Prof. Martha Cecilia Rueda Vargas',
    academicPeriod: 'II - 2026',
    startDate: '2026-08-04',
    endDate: '2026-11-20',
    requiredHours: 160,
    completedHours: 142,
    validatedHours: 140,
    status: 'activa',
    gradeAverage: 4.8,
    practiceLevel: 'Práctica Pedagógica II'
  },
  {
    id: 'asig-3',
    studentId: 'est-3',
    studentName: 'Santiago Silva Mendoza',
    studentCode: '2022104588',
    studentProgram: 'Licenciatura en Educación / Informática',
    institutionId: 'inst-3',
    institutionName: 'Escuela Normal Superior de Bucaramanga',
    advisorId: 'u-doc-1',
    advisorName: 'Prof. Martha Cecilia Rueda Vargas',
    academicPeriod: 'II - 2026',
    startDate: '2026-08-04',
    endDate: '2026-11-20',
    requiredHours: 160,
    completedHours: 54,
    validatedHours: 48,
    status: 'en_riesgo',
    gradeAverage: 3.4,
    practiceLevel: 'Práctica Pedagógica I'
  },
  {
    id: 'asig-4',
    studentId: 'est-4',
    studentName: 'Daniela Sofía Pinzón Rey',
    studentCode: '2022104595',
    studentProgram: 'Licenciatura en Lenguas y Didáctica',
    institutionId: 'inst-1',
    institutionName: 'Colegio de Santander (Sede Principal)',
    advisorId: 'u-doc-1',
    advisorName: 'Prof. Martha Cecilia Rueda Vargas',
    academicPeriod: 'II - 2026',
    startDate: '2026-08-04',
    endDate: '2026-11-20',
    requiredHours: 160,
    completedHours: 160,
    validatedHours: 160,
    status: 'completada',
    gradeAverage: 4.9,
    practiceLevel: 'Práctica Profesional III'
  },
  {
    id: 'asig-5',
    studentId: 'est-5',
    studentName: 'Kevin Leonardo Duarte Rojas',
    studentCode: '2022104610',
    studentProgram: 'Ingeniería de Sistemas - Práctica Tecnológica',
    institutionId: 'inst-5',
    institutionName: 'Institución Educativa Aurelio Martínez Mutis',
    advisorId: 'u-doc-1',
    advisorName: 'Prof. Martha Cecilia Rueda Vargas',
    academicPeriod: 'II - 2026',
    startDate: '2026-08-11',
    endDate: '2026-11-20',
    requiredHours: 320,
    completedHours: 210,
    validatedHours: 198,
    status: 'activa',
    gradeAverage: 4.4,
    practiceLevel: 'Práctica de Profundización'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    date: '2026-10-02',
    hours: 4,
    activityType: 'Docencia Directa',
    title: 'Clase de Algoritmia Básica y Pensamiento Computacional',
    description: 'Orientación de sesión de clase con estudiantes de 9° grado usando diagramas de flujo y pseudocódigo interactivo.',
    institutionValidated: true,
    validatedBy: 'Esp. Claudia Mantilla (Tutora Institucional)',
    validationDate: '2026-10-03',
    observations: 'Excelente dominio del tema y participación activa de los alumnos.',
    evidenceLink: 'https://evidencias.udi.edu.co/camilo_clase_02oct.pdf'
  },
  {
    id: 'log-2',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    date: '2026-10-04',
    hours: 4,
    activityType: 'Acompañamiento',
    title: 'Taller de Laboratorio y Práctica con Scratch',
    description: 'Apoyo individual a estudiantes en la creación de videojuegos educativos para matemáticas.',
    institutionValidated: true,
    validatedBy: 'Esp. Claudia Mantilla (Tutora Institucional)',
    validationDate: '2026-10-05',
    observations: 'Puntualidad y adecuada mediación pedagógica en el aula de cómputo.',
    evidenceLink: 'https://evidencias.udi.edu.co/scratch_taller_camilo.pdf'
  },
  {
    id: 'log-3',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    date: '2026-10-06',
    hours: 4,
    activityType: 'Planeación',
    title: 'Diseño de Guías Didácticas e Instrumentos Evaluativos',
    description: 'Elaboración de rúbricas formativas para el 3er periodo académico en articulación con el PEI del colegio.',
    institutionValidated: true,
    validatedBy: 'Lic. Humberto Serrano (Rector)',
    validationDate: '2026-10-07',
    observations: 'Alineado con los estándares del MEN y el currículo institucional.'
  },
  {
    id: 'log-4',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    date: '2026-10-07',
    hours: 4,
    activityType: 'Docencia Directa',
    title: 'Evaluación Formativa y Retroalimentación Grupal',
    description: 'Aplicación de prueba diagnóstica y plenaria de retroalimentación en el aula.',
    institutionValidated: false,
    observations: 'Pendiente de firma y revisión en rectoría.'
  }
];

export const INITIAL_CLASS_PLANS: ClassPlan[] = [
  {
    id: 'plan-1',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    title: 'Plan de Clase: Introducción a la Estructura de Decisión Lógica',
    subject: 'Tecnología e Informática',
    gradeOrGroup: 'Grado 9-02',
    deliveryDate: '2026-09-28',
    objective: 'Desarrollar habilidades de pensamiento lógico aplicando condicionales Sí/Entonces en resolución de problemas cotidianos.',
    status: 'aprobado',
    advisorFeedback: 'Plan de clase muy bien estructurado. Se sugiere incluir un momento breve de activación de saberes previos.',
    rating: 4.8,
    evidenceUrl: 'https://udi.edu.co/planes/camilo_plan1_aprobado.pdf'
  },
  {
    id: 'plan-2',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    title: 'Plan de Clase: Bucles y Ciclos Repetitivos en Programación por Bloques',
    subject: 'Tecnología e Informática',
    gradeOrGroup: 'Grado 9-01',
    deliveryDate: '2026-10-05',
    objective: 'Modelar algoritmos eficientes empleando bucles "Para" y "Mientras" mediante dinámicas desconectadas y plataforma Scratch.',
    status: 'aprobado',
    advisorFeedback: 'Excelente integración de actividades desenchufadas (unplugged) para estudiantes con dificultades.',
    rating: 4.9,
    evidenceUrl: 'https://udi.edu.co/planes/camilo_plan2_aprobado.pdf'
  },
  {
    id: 'plan-3',
    assignmentId: 'asig-1',
    studentId: 'u-est-1',
    title: 'Plan de Clase: Proyecto Integrador de Cierre - Robot Simulado',
    subject: 'Tecnología e Informática',
    gradeOrGroup: 'Grados 9-01 y 9-02',
    deliveryDate: '2026-10-12',
    objective: 'Integrar conceptos de variables, condicionales y ciclos en un proyecto de navegación de laberinto.',
    status: 'pendiente_revision',
    advisorFeedback: 'En proceso de revisión por la docente asesora Martha Rueda.',
    evidenceUrl: 'https://udi.edu.co/planes/camilo_plan3_revision.pdf'
  }
];

export const INITIAL_SUPERVISION_VISITS: SupervisionVisit[] = [
  {
    id: 'vis-1',
    assignmentId: 'asig-1',
    advisorId: 'u-doc-1',
    date: '2026-09-15',
    visitNumber: 1,
    modality: 'Presencial en Aula',
    strengths: 'Seguridad en la dicción, manejo de recursos multimedia y empatía con el grupo de 9° grado.',
    aspectsToImprove: 'Optimizar la gestión del tiempo durante el cierre de la clase y la recolección de evidencias.',
    commitments: 'Implementar temporizador visible en proyector y rúbrica impresa al inicio.',
    score: 4.5
  },
  {
    id: 'vis-2',
    assignmentId: 'asig-1',
    advisorId: 'u-doc-1',
    date: '2026-10-02',
    visitNumber: 2,
    modality: 'Presencial en Aula',
    strengths: 'Notorio avance en el control de tiempos, excelente uso de la estrategia de aprendizaje cooperativo.',
    aspectsToImprove: 'Profundizar en la atención a dos estudiantes con necesidades educativas específicas (PIAR).',
    commitments: 'Reunirse con la psicorientadora del Colegio Santander para adecuar material didáctico diferenciado.',
    score: 4.8
  }
];

export const INITIAL_EVALUATIONS: PedagogicalEvaluation[] = [
  {
    id: 'eval-1',
    assignmentId: 'asig-1',
    evaluatorId: 'u-doc-1',
    evaluatorRole: 'docente_asesor',
    period: 'Corte 1',
    date: '2026-09-25',
    criteria: [
      { id: 'c1', category: 'Dominio Disciplinar y Curricular', description: 'Conocimiento sólido de los contenidos y estándares del MEN.', weight: 20, score: 5 },
      { id: 'c2', category: 'Planificación y Didáctica', description: 'Coherencia entre objetivos, metodologías y recursos propuestos.', weight: 25, score: 4.8 },
      { id: 'c3', category: 'Clima de Aula y Manejo de Grupo', description: 'Establecimiento de normas de convivencia y motivación a los alumnos.', weight: 20, score: 4.5 },
      { id: 'c4', category: 'Evaluación y Retroalimentación', description: 'Uso de instrumentos formativos y comunicación asertiva de logros.', weight: 20, score: 4.6 },
      { id: 'c5', category: 'Ética y Compromiso Institucional', description: 'Puntualidad, presentación personal y sentido de pertenencia UDI.', weight: 15, score: 5 }
    ],
    qualitativeFeedback: 'El practicante Camilo Rangel demuestra alta solvencia técnica y vocación docente. Cumple a cabalidad los lineamientos curriculares.',
    finalScore: 4.75
  }
];

export const INTEGRATOR_PROJECT_ADVANCES: AcademicAdvanceGuide[] = [
  {
    id: 'adv-1',
    title: 'Primer Avance: Propuesta del Proyecto y Arquitectura',
    course: 'General',
    phase: 'Primer Avance',
    deadline: 'Domingo, 30 de agosto de 2026 (11:30 pm)',
    weightPercentage: 'ISW II: 10% | TGS: 10% | Prog III: 5%',
    items: [
      {
        number: '1',
        title: 'Introducción & Contexto Nacional (MEN / CNA)',
        description: 'Fundamentación del papel de las prácticas pedagógicas en Colombia bajo el Decreto 1075 de 2015 y estándares de alta calidad del CNA.',
        status: 'completado',
        deliverableContent: 'Las prácticas pedagógicas en Colombia constituyen el eje vertebrador de la formación docente...'
      },
      {
        number: '2',
        title: 'Descripción y Planteamiento del Problema',
        description: 'Identificación de la dispersión de datos (hojas de cálculo, correos, papel) y sobrecarga del 40% en tareas operativas del Director.',
        status: 'completado',
        deliverableContent: 'Actualmente, el 78% de programas gestionan información de manera fragmentada, arriesgando trazabilidad en auditorías del MEN...'
      },
      {
        number: '3',
        title: 'Objetivos del Proyecto (General y Específicos)',
        description: 'Objetivo general: Desarrollar un sistema de información web para la gestión integral de prácticas académicas...',
        status: 'completado',
        deliverableContent: 'OG: Desarrollar una plataforma centralizada...\nOE1: Diseñar los módulos de control para los 5 actores clave...\nOE2: Modelar la base de datos relacional...'
      },
      {
        number: '4',
        title: 'Justificación Técnica y Sistémica (TGS)',
        description: 'Análisis sistémico: Entradas (estudiantes, convenios), Proceso (seguimiento, visitas, bitácoras), Salidas (horas validadas, informes CNA) y Retroalimentación.',
        status: 'completado',
        deliverableContent: 'Desde el enfoque de la Teoría General de Sistemas (Bertalanffy), la gestión de prácticas es un sistema abierto y dinámico...'
      },
      {
        number: '5',
        title: 'Propuesta de Arquitectura de Software',
        description: 'Arquitectura cliente-servidor desacoplada (Frontend React SPA + Backend API RESTful + Base de datos relacional).',
        status: 'completado'
      },
      {
        number: '6',
        title: 'Análisis de Requerimientos (RF01 - RF15 y RNF)',
        description: 'Especificación IEEE 830 de requerimientos funcionales por actor y no funcionales (Seguridad, Usabilidad, Rendimiento).',
        status: 'completado'
      },
      {
        number: '7',
        title: 'Diseño UML: Casos de Uso y Modelo de Dominio',
        description: 'Diagramas con actores: Director, Coordinador, Docente Asesor, Estudiante Practicante, Institución Receptora.',
        status: 'completado'
      },
      {
        number: '8',
        title: 'Modelado de Base de Datos: Diagrama Entidad-Relación',
        description: 'Entidades: USUARIO, ROL, INSTITUCION, CONVENIO, ASIGNACION_PRACTICA, BITACORA_ACTIVIDAD, PLAN_CLASE, VISITA_SUPERVISION, EVALUACION.',
        status: 'completado'
      },
      {
        number: '9',
        title: 'Prototipo de Mediana Fidelidad (Wireframes)',
        description: 'Maquetas de interfaz de navegación, panel de control y formularios de registro.',
        status: 'completado'
      }
    ]
  },
  {
    id: 'adv-2',
    title: 'Segundo Avance: Prototipo Funcional 50% y Base de Datos',
    course: 'General',
    phase: 'Segundo Avance',
    deadline: 'Domingo, 11 de octubre de 2026 (11:59 pm)',
    weightPercentage: 'ISW II: 20% | TGS: 20% | Prog III: 10%',
    items: [
      {
        number: '1',
        title: 'Diagramas UML: Secuencia y Clases de Diseño',
        description: 'Interacciones de registro de bitácora, validación por institución y calificación con rúbrica pedagógica.',
        status: 'completado'
      },
      {
        number: '2',
        title: 'Modelo Relacional y Diccionario de Datos Completo',
        description: 'Especificación detallada de campos, tipos (VARCHAR, INT, TIMESTAMP), llaves primarias/foráneas, nulos y descripción.',
        status: 'completado'
      },
      {
        number: '3',
        title: 'Script DDL de Base de Datos (SQL listo para ejecutar)',
        description: 'Sentencias CREATE TABLE, ALTER TABLE con llaves foráneas y constraints para PostgreSQL/MySQL.',
        status: 'completado'
      },
      {
        number: '4',
        title: 'Prototipo Funcional de Alta Fidelidad (50% Casos de Uso)',
        description: 'CRUDs funcionales de instituciones, asignaciones, bitácora diaria y validación en vivo.',
        status: 'completado'
      },
      {
        number: '5',
        title: 'Guía y Guion de Video de Sustentación (Máx. 5 minutos)',
        description: 'Estructura paso a paso para la grabación de video requerida por los docentes de la UDI.',
        status: 'completado'
      }
    ]
  },
  {
    id: 'adv-3',
    title: 'Tercer Avance / Entrega Final: Aplicación 100% y Artículo IEEE',
    course: 'General',
    phase: 'Tercer Avance / Final',
    deadline: 'Domingo, 15 de noviembre de 2026 (11:30 pm)',
    weightPercentage: 'ISW II: 10% | TGS: 10% | Prog III: 25% (Total 100%)',
    items: [
      {
        number: '1',
        title: 'Sistema Funcional 100% (Todos los Casos de Uso)',
        description: 'Roles diferenciados, trazabilidad de horas, rúbricas pedagógicas, filtros de acreditación y generación de reportes.',
        status: 'completado'
      },
      {
        number: '2',
        title: 'Manual de Usuario (Por Roles)',
        description: 'Guía paso a paso ilustrada para Director, Coordinador, Docentes, Estudiantes y Rectores de colegios.',
        status: 'completado'
      },
      {
        number: '3',
        title: 'Manual Técnico y de Despliegue',
        description: 'Requerimientos de servidor, configuración de entorno, dependencias y arquitectura física.',
        status: 'completado'
      },
      {
        number: '4',
        title: 'Borrador de Artículo de Investigación en Formato IEEE',
        description: 'Artículo estructurado de 5 a 8 páginas con Abstract, Metodología, Resultados y Bibliografía oficial.',
        status: 'completado'
      },
      {
        number: '5',
        title: 'Preparación de Póster y Sustentación Final UDI',
        description: 'Diapositivas y pautas de sustentación ante jurados en la última semana de noviembre.',
        status: 'completado'
      }
    ]
  }
];
