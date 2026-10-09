export type UserRole = 'director' | 'coordinador' | 'docente' | 'estudiante' | 'institucion';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  documentNumber: string;
  phone?: string;
  facultyOrSchool?: string;
  studentCode?: string;
  institutionNit?: string;
  password?: string;
}

export type PracticeStatus = 'pendiente' | 'activa' | 'en_riesgo' | 'completada' | 'cancelada';

export interface Institution {
  id: string;
  name: string;
  nit: string;
  rectorOrDirector: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  agreementStatus: 'vigente' | 'en_renovacion' | 'pendiente_firma' | 'vencido';
  agreementNumber: string;
  agreementValidUntil: string;
  availableSlots: number;
  assignedCount: number;
  tutorName: string;
  sector: 'Oficial' | 'Privado';
  level: string; // ej. Básica Primaria, Secundaria, Media
}

export interface PracticeAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentProgram: string;
  institutionId: string;
  institutionName: string;
  advisorId: string; // Docente asesor
  advisorName: string;
  academicPeriod: string;
  startDate: string;
  endDate: string;
  requiredHours: number; // Ej. 160 o 320
  completedHours: number;
  validatedHours: number; // Validadas por la institución
  status: PracticeStatus;
  gradeAverage?: number;
  practiceLevel: 'Práctica Pedagógica I' | 'Práctica Pedagógica II' | 'Práctica Profesional III' | 'Práctica de Profundización';
}

export interface ActivityLog {
  id: string;
  assignmentId: string;
  studentId: string;
  date: string;
  hours: number;
  activityType: 'Docencia Directa' | 'Observación' | 'Planeación' | 'Acompañamiento' | 'Taller Extracurricular';
  title: string;
  description: string;
  institutionValidated: boolean;
  validatedBy?: string;
  validationDate?: string;
  observations?: string;
  evidenceLink?: string;
}

export interface ClassPlan {
  id: string;
  assignmentId: string;
  studentId: string;
  title: string;
  subject: string;
  gradeOrGroup: string;
  deliveryDate: string;
  objective: string;
  status: 'pendiente_revision' | 'aprobado' | 'con_observaciones';
  advisorFeedback?: string;
  evidenceUrl?: string;
  rating?: number; // 0 - 5.0
}

export interface SupervisionVisit {
  id: string;
  assignmentId: string;
  advisorId: string;
  date: string;
  visitNumber: number;
  modality: 'Presencial en Aula' | 'Virtual sincrónica' | 'Reunión con Rectoría';
  strengths: string;
  aspectsToImprove: string;
  commitments: string;
  score: number; // 0.0 - 5.0
}

export interface EvaluationCriterion {
  id: string;
  category: string;
  description: string;
  weight: number; // Porcentaje ej 20
  score: number; // 1 a 5
}

export interface PedagogicalEvaluation {
  id: string;
  assignmentId: string;
  evaluatorId: string;
  evaluatorRole: 'docente_asesor' | 'institucion_receptora';
  period: 'Corte 1' | 'Corte 2' | 'Evaluación Final';
  date: string;
  criteria: EvaluationCriterion[];
  qualitativeFeedback: string;
  finalScore: number; // Calculado de 0.0 a 5.0
}

export interface AcademicAdvanceGuide {
  id: string;
  title: string;
  course: 'Ingeniería del Software II' | 'Programación III' | 'Teoría General de Sistemas' | 'General';
  phase: 'Primer Avance' | 'Segundo Avance' | 'Tercer Avance / Final';
  deadline: string;
  weightPercentage: string;
  items: {
    number: string;
    title: string;
    description: string;
    status: 'completado' | 'en_progreso' | 'pendiente';
    deliverableContent?: string;
  }[];
}
