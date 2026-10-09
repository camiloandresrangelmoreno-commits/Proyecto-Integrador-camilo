import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Institution, 
  PracticeAssignment, 
  ActivityLog, 
  ClassPlan, 
  SupervisionVisit, 
  PedagogicalEvaluation,
  EvaluationCriterion
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_INSTITUTIONS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_CLASS_PLANS, 
  INITIAL_SUPERVISION_VISITS, 
  INITIAL_EVALUATIONS 
} from '../data/initialData';
import { apiService, DbStatusResponse } from '../services/api';

interface AppContextType {
  currentUser: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: 'app' | 'guide';
  setActiveTab: (tab: 'app' | 'guide') => void;
  isAuthenticated: boolean;
  login: (role: UserRole, identifier?: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  advisors: User[];
  addAdvisor: (newAdvisor: Omit<User, 'id' | 'role'>) => void;
  institutions: Institution[];
  assignments: PracticeAssignment[];
  activityLogs: ActivityLog[];
  classPlans: ClassPlan[];
  visits: SupervisionVisit[];
  evaluations: PedagogicalEvaluation[];
  dbStatus: DbStatusResponse | null;
  checkDbStatus: () => Promise<void>;
  
  // Actions
  addActivityLog: (newLog: Omit<ActivityLog, 'id' | 'institutionValidated'>) => void;
  validateActivityLog: (logId: string, validatedBy: string, observations?: string) => void;
  addClassPlan: (newPlan: Omit<ClassPlan, 'id' | 'status'>) => void;
  reviewClassPlan: (planId: string, status: 'aprobado' | 'con_observaciones', feedback: string, rating?: number) => void;
  addSupervisionVisit: (newVisit: Omit<SupervisionVisit, 'id'>) => void;
  submitEvaluation: (evaluation: Omit<PedagogicalEvaluation, 'id' | 'date'>) => void;
  addInstitution: (newInst: Omit<Institution, 'id' | 'assignedCount'>) => void;
  updateInstitutionStatus: (instId: string, status: Institution['agreementStatus']) => void;
  assignStudentToInstitution: (
    studentName: string, 
    studentCode: string, 
    studentProgram: string,
    institutionId: string, 
    advisorId: string,
    requiredHours: number,
    practiceLevel: PracticeAssignment['practiceLevel']
  ) => void;
  resetToDemoData: () => void;
  
  // Stats
  metrics: {
    totalStudents: number;
    activePractices: number;
    atRiskPractices: number;
    completedPractices: number;
    totalHoursLogged: number;
    totalHoursValidated: number;
    averageCompliancePercent: number;
    activeAgreements: number;
    averageEvaluationGrade: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('sigpa_is_authenticated');
    return savedAuth ? savedAuth === 'true' : false;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('sigpa_active_role');
    return (savedRole as UserRole) || 'estudiante';
  });

  const [activeTab, setActiveTab] = useState<'app' | 'guide'>('app');
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);

  const checkDbStatus = async () => {
    const status = await apiService.checkHealth();
    setDbStatus(status);
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  // Login handler
  const login = (role: UserRole, identifier?: string, password?: string) => {
    // Buscar usuario correspondiente al rol
    const targetUser = INITIAL_USERS.find(u => u.role === role);
    if (!targetUser) {
      return { success: false, message: 'Rol no encontrado en el sistema.' };
    }

    // Si se envían credenciales manuales, verificar
    if (identifier && password) {
      const matchPass = targetUser.password ? targetUser.password === password.trim() : true;
      if (!matchPass && password.trim() !== '123456') {
        return { success: false, message: 'Contraseña incorrecta. Puedes usar la clave demo o el acceso rápido.' };
      }
    }

    setActiveRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('sigpa_is_authenticated', 'true');
    localStorage.setItem('sigpa_active_role', role);
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('sigpa_is_authenticated', 'false');
  };

  // Local storage backed state
  const [advisors, setAdvisors] = useState<User[]>(() => {
    const saved = localStorage.getItem('sigpa_advisors');
    return saved ? JSON.parse(saved) : INITIAL_USERS.filter(u => u.role === 'docente');
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('sigpa_institutions');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [assignments, setAssignments] = useState<PracticeAssignment[]>(() => {
    const saved = localStorage.getItem('sigpa_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sigpa_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [classPlans, setClassPlans] = useState<ClassPlan[]>(() => {
    const saved = localStorage.getItem('sigpa_class_plans');
    return saved ? JSON.parse(saved) : INITIAL_CLASS_PLANS;
  });

  const [visits, setVisits] = useState<SupervisionVisit[]>(() => {
    const saved = localStorage.getItem('sigpa_visits');
    return saved ? JSON.parse(saved) : INITIAL_SUPERVISION_VISITS;
  });

  const [evaluations, setEvaluations] = useState<PedagogicalEvaluation[]>(() => {
    const saved = localStorage.getItem('sigpa_evaluations');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sigpa_advisors', JSON.stringify(advisors));
  }, [advisors]);

  useEffect(() => {
    localStorage.setItem('sigpa_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('sigpa_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sigpa_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('sigpa_class_plans', JSON.stringify(classPlans));
  }, [classPlans]);

  useEffect(() => {
    localStorage.setItem('sigpa_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem('sigpa_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  // Current user based on activeRole
  const currentUser = INITIAL_USERS.find(u => u.role === activeRole) || INITIAL_USERS[0];

  // Actions
  const addActivityLog = (newLog: Omit<ActivityLog, 'id' | 'institutionValidated'>) => {
    const id = `log-${Date.now()}`;
    const log: ActivityLog = {
      ...newLog,
      id,
      institutionValidated: false
    };

    setActivityLogs(prev => [log, ...prev]);

    // Sincronizar en segundo plano con el servidor Express/PostgreSQL
    apiService.createActivityLog(log);

    // Update assignment completed hours
    setAssignments(prev => prev.map(a => {
      if (a.id === newLog.assignmentId) {
        const newCompleted = a.completedHours + newLog.hours;
        const newStatus = newCompleted >= a.requiredHours ? 'completada' : a.status;
        return {
          ...a,
          completedHours: newCompleted,
          status: newStatus
        };
      }
      return a;
    }));
  };

  const validateActivityLog = (logId: string, validatedBy: string, observations?: string) => {
    setActivityLogs(prev => prev.map(l => {
      if (l.id === logId) {
        return {
          ...l,
          institutionValidated: true,
          validatedBy,
          validationDate: new Date().toISOString().split('T')[0],
          observations: observations || l.observations
        };
      }
      return l;
    }));

    // Sincronizar validación con el servidor Express/PostgreSQL
    apiService.validateLog(logId, validatedBy, observations);

    // Update validated hours on assignment
    const log = activityLogs.find(l => l.id === logId);
    if (log && !log.institutionValidated) {
      setAssignments(prev => prev.map(a => {
        if (a.id === log.assignmentId) {
          return {
            ...a,
            validatedHours: a.validatedHours + log.hours
          };
        }
        return a;
      }));
    }
  };

  const addClassPlan = (newPlan: Omit<ClassPlan, 'id' | 'status'>) => {
    const id = `plan-${Date.now()}`;
    const plan: ClassPlan = {
      ...newPlan,
      id,
      status: 'pendiente_revision'
    };
    setClassPlans(prev => [plan, ...prev]);
  };

  const reviewClassPlan = (planId: string, status: 'aprobado' | 'con_observaciones', feedback: string, rating?: number) => {
    setClassPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          status,
          advisorFeedback: feedback,
          rating: rating ?? p.rating
        };
      }
      return p;
    }));
  };

  const addSupervisionVisit = (newVisit: Omit<SupervisionVisit, 'id'>) => {
    const id = `vis-${Date.now()}`;
    const visit: SupervisionVisit = { ...newVisit, id };
    setVisits(prev => [visit, ...prev]);
  };

  const submitEvaluation = (evaluation: Omit<PedagogicalEvaluation, 'id' | 'date'>) => {
    const id = `eval-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const totalScore = evaluation.criteria.reduce((acc, c) => acc + (c.score * (c.weight / 100)), 0);
    const newEval: PedagogicalEvaluation = {
      ...evaluation,
      id,
      date,
      finalScore: Number(totalScore.toFixed(2))
    };

    setEvaluations(prev => [newEval, ...prev]);

    // Update assignment grade average
    setAssignments(prev => prev.map(a => {
      if (a.id === evaluation.assignmentId) {
        const matchingEvals = [...evaluations.filter(e => e.assignmentId === a.id), newEval];
        const avg = matchingEvals.reduce((sum, e) => sum + e.finalScore, 0) / matchingEvals.length;
        return {
          ...a,
          gradeAverage: Number(avg.toFixed(2))
        };
      }
      return a;
    }));
  };

  const addInstitution = (newInst: Omit<Institution, 'id' | 'assignedCount'>) => {
    const id = `inst-${Date.now()}`;
    const inst: Institution = {
      ...newInst,
      id,
      assignedCount: 0
    };
    setInstitutions(prev => [inst, ...prev]);
    apiService.createInstitution(newInst);
  };

  const updateInstitutionStatus = (instId: string, status: Institution['agreementStatus']) => {
    setInstitutions(prev => prev.map(i => i.id === instId ? { ...i, agreementStatus: status } : i));
  };

  const addAdvisor = (newAdvisor: Omit<User, 'id' | 'role'>) => {
    const id = `u-doc-${Date.now()}`;
    const advisor: User = {
      ...newAdvisor,
      id,
      role: 'docente',
      password: newAdvisor.password || 'docente2026'
    };
    setAdvisors(prev => [...prev, advisor]);
    apiService.createAdvisor(newAdvisor);
  };

  const assignStudentToInstitution = (
    studentName: string, 
    studentCode: string, 
    studentProgram: string,
    institutionId: string, 
    advisorId: string,
    requiredHours: number,
    practiceLevel: PracticeAssignment['practiceLevel']
  ) => {
    const inst = institutions.find(i => i.id === institutionId);
    const advisor = advisors.find(u => u.id === advisorId) || INITIAL_USERS.find(u => u.id === advisorId) || INITIAL_USERS[2];
    const newAssignmentId = `asig-${Date.now()}`;
    const studentId = `est-${Date.now()}`;

    const newAssignment: PracticeAssignment = {
      id: newAssignmentId,
      studentId,
      studentName,
      studentCode,
      studentProgram,
      institutionId,
      institutionName: inst ? inst.name : 'Institución Receptora',
      advisorId,
      advisorName: advisor.name,
      academicPeriod: 'II - 2026',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-11-20',
      requiredHours,
      completedHours: 0,
      validatedHours: 0,
      status: 'activa',
      practiceLevel
    };

    setAssignments(prev => [newAssignment, ...prev]);

    // Increment institution count
    setInstitutions(prev => prev.map(i => {
      if (i.id === institutionId) {
        return { ...i, assignedCount: i.assignedCount + 1 };
      }
      return i;
    }));
  };

  const resetToDemoData = () => {
    localStorage.removeItem('sigpa_advisors');
    localStorage.removeItem('sigpa_institutions');
    localStorage.removeItem('sigpa_assignments');
    localStorage.removeItem('sigpa_activity_logs');
    localStorage.removeItem('sigpa_class_plans');
    localStorage.removeItem('sigpa_visits');
    localStorage.removeItem('sigpa_evaluations');
    setAdvisors(INITIAL_USERS.filter(u => u.role === 'docente'));
    setInstitutions(INITIAL_INSTITUTIONS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setClassPlans(INITIAL_CLASS_PLANS);
    setVisits(INITIAL_SUPERVISION_VISITS);
    setEvaluations(INITIAL_EVALUATIONS);
  };

  // Metrics calculation
  const totalStudents = assignments.length;
  const activePractices = assignments.filter(a => a.status === 'activa').length;
  const atRiskPractices = assignments.filter(a => a.status === 'en_riesgo').length;
  const completedPractices = assignments.filter(a => a.status === 'completada').length;
  const totalHoursLogged = assignments.reduce((acc, a) => acc + a.completedHours, 0);
  const totalHoursValidated = assignments.reduce((acc, a) => acc + a.validatedHours, 0);
  const averageCompliancePercent = assignments.length > 0 
    ? Math.round((totalHoursValidated / assignments.reduce((acc, a) => acc + a.requiredHours, 0)) * 100)
    : 0;
  const activeAgreements = institutions.filter(i => i.agreementStatus === 'vigente').length;
  const evalGrades = assignments.filter(a => a.gradeAverage !== undefined).map(a => a.gradeAverage!);
  const averageEvaluationGrade = evalGrades.length > 0
    ? Number((evalGrades.reduce((a, b) => a + b, 0) / evalGrades.length).toFixed(2))
    : 4.5;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        isAuthenticated,
        login,
        logout,
        advisors,
        addAdvisor,
        dbStatus,
        checkDbStatus,
        institutions,
        assignments,
        activityLogs,
        classPlans,
        visits,
        evaluations,
        addActivityLog,
        validateActivityLog,
        addClassPlan,
        reviewClassPlan,
        addSupervisionVisit,
        submitEvaluation,
        addInstitution,
        updateInstitutionStatus,
        assignStudentToInstitution,
        resetToDemoData,
        metrics: {
          totalStudents,
          activePractices,
          atRiskPractices,
          completedPractices,
          totalHoursLogged,
          totalHoursValidated,
          averageCompliancePercent,
          activeAgreements,
          averageEvaluationGrade
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
