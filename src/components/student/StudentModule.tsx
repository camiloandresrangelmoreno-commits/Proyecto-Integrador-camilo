import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Clock, 
  Plus, 
  FileCheck2, 
  UploadCloud, 
  Calendar, 
  Building2, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Award,
  Link as LinkIcon
} from 'lucide-react';
import { ActivityLog, ClassPlan } from '../../types';

export const StudentModule: React.FC = () => {
  const { 
    currentUser, 
    assignments, 
    activityLogs, 
    classPlans, 
    visits, 
    evaluations, 
    addActivityLog, 
    addClassPlan 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'bitacora' | 'planes' | 'retroalimentacion'>('bitacora');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Practica del estudiante actual (Camilo)
  const myAssignment = assignments.find(a => a.studentId === currentUser.id) || assignments[0];
  const myLogs = activityLogs.filter(l => l.assignmentId === myAssignment?.id);
  const myPlans = classPlans.filter(p => p.assignmentId === myAssignment?.id);
  const myVisits = visits.filter(v => v.assignmentId === myAssignment?.id);
  const myEvals = evaluations.filter(e => e.assignmentId === myAssignment?.id);

  // Form states - Activity Log
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 4,
    activityType: 'Docencia Directa' as ActivityLog['activityType'],
    title: '',
    description: '',
    evidenceLink: ''
  });

  // Form states - Class Plan
  const [planForm, setPlanForm] = useState({
    title: '',
    subject: 'Tecnología e Informática',
    gradeOrGroup: 'Grado 9-02',
    deliveryDate: new Date().toISOString().split('T')[0],
    objective: '',
    evidenceUrl: ''
  });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myAssignment || !logForm.title) return;

    addActivityLog({
      assignmentId: myAssignment.id,
      studentId: myAssignment.studentId,
      ...logForm
    });

    setShowLogModal(false);
    setLogForm({
      date: new Date().toISOString().split('T')[0],
      hours: 4,
      activityType: 'Docencia Directa',
      title: '',
      description: '',
      evidenceLink: ''
    });
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myAssignment || !planForm.title) return;

    addClassPlan({
      assignmentId: myAssignment.id,
      studentId: myAssignment.studentId,
      ...planForm
    });

    setShowPlanModal(false);
    setPlanForm({
      title: '',
      subject: 'Tecnología e Informática',
      gradeOrGroup: 'Grado 9-02',
      deliveryDate: new Date().toISOString().split('T')[0],
      objective: '',
      evidenceUrl: ''
    });
  };

  const percentHours = myAssignment 
    ? Math.min(100, Math.round((myAssignment.validatedHours / myAssignment.requiredHours) * 100))
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Banner Principal del Estudiante */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#002855] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs bg-purple-500/30 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portal del Practicante | UDI</span>
            </span>
            <h2 className="text-2xl font-black tracking-tight">{myAssignment?.studentName}</h2>
            <p className="text-xs text-purple-200">
              {myAssignment?.studentProgram} | Código: <strong className="font-mono text-white">{myAssignment?.studentCode}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <span className="flex items-center gap-1.5 text-blue-200">
                <Building2 className="w-4 h-4 text-cyan-300" />
                {myAssignment?.institutionName}
              </span>
              <span className="flex items-center gap-1.5 text-blue-200">
                <UserCheck className="w-4 h-4 text-emerald-300" />
                Asesor: {myAssignment?.advisorName}
              </span>
            </div>
          </div>

          {/* Medidor Circular / Barra de Horas */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 min-w-[260px]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-semibold text-purple-200">Progreso Reglamentario</span>
              <span className="text-xl font-extrabold text-amber-300 font-mono">{percentHours}%</span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentHours}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-purple-100">
              <span>Validadas: <strong>{myAssignment?.validatedHours}h</strong></span>
              <span>Meta MEN: <strong>{myAssignment?.requiredHours}h</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción Rápida */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Navegación por Pestañas */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('bitacora')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'bitacora'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bitácora de Horas ({myLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('planes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'planes'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Planes de Clase ({myPlans.length})
          </button>
          <button
            onClick={() => setActiveSubTab('retroalimentacion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'retroalimentacion'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Visitas y Notas ({myVisits.length + myEvals.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Actividad / Horas</span>
          </button>
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Subir Plan de Clase</span>
          </button>
        </div>
      </div>

      {/* Pestaña: Bitácora de Horas */}
      {activeSubTab === 'bitacora' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">
              Historial de Horas y Actividades Desarrolladas en el Colegio
            </h3>
            <span className="text-xs text-slate-500">
              Total reportadas: {myAssignment?.completedHours} hrs
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {myLogs.map((log) => (
              <div key={log.id} className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{log.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {log.activityType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {log.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.hours} Horas
                    </span>
                    {log.evidenceLink && (
                      <span className="flex items-center gap-1 text-blue-600 underline cursor-pointer">
                        <LinkIcon className="w-3 h-3" />
                        Ver Evidencia
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {log.institutionValidated ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Validado por Colegio</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Pendiente por Sello / Rector</span>
                    </div>
                  )}
                  {log.validatedBy && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Certificado por: {log.validatedBy}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña: Planes de Clase */}
      {activeSubTab === 'planes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myPlans.map((plan) => (
            <div key={plan.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{plan.title}</h4>
                  <p className="text-xs text-slate-500">{plan.subject} | {plan.gradeOrGroup}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  plan.status === 'aprobado' ? 'bg-emerald-100 text-emerald-800' :
                  plan.status === 'con_observaciones' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {plan.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-600 italic">
                "{plan.objective}"
              </p>

              {plan.advisorFeedback && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-800 text-[11px]">Retroalimentación del Asesor:</strong>
                    {plan.rating && (
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Nota: {plan.rating} / 5.0
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{plan.advisorFeedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pestaña: Visitas y Retroalimentaciones */}
      {activeSubTab === 'retroalimentacion' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myVisits.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Visita de Observación #{v.visitNumber}
                  </span>
                  <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Calificación: {v.score.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <strong className="text-emerald-700 block">Fortalezas:</strong>
                    <p className="text-slate-600">{v.strengths}</p>
                  </div>
                  <div>
                    <strong className="text-amber-700 block">Aspectos a Mejorar:</strong>
                    <p className="text-slate-600">{v.aspectsToImprove}</p>
                  </div>
                  <div>
                    <strong className="text-blue-700 block">Compromisos:</strong>
                    <p className="text-slate-600">{v.commitments}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {myEvals.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Rúbrica Pedagógica de Periodo Calificada</span>
              </h4>
              {myEvals.map(ev => (
                <div key={ev.id} className="p-3 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-xs">{ev.period} ({ev.date})</span>
                    <span className="font-mono font-extrabold text-emerald-700 text-sm">
                      Nota Final: {ev.finalScore.toFixed(2)} / 5.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{ev.qualitativeFeedback}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Registrar Bitácora */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Registrar Actividad en Bitácora de Práctica
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cada sesión debe ser verificada posteriormente por el tutor de la institución.
            </p>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={logForm.date}
                    onChange={e => setLogForm({...logForm, date: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Horas Cumplidas</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={logForm.hours}
                    onChange={e => setLogForm({...logForm, hours: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tipo de Actividad</label>
                <select
                  value={logForm.activityType}
                  onChange={e => setLogForm({...logForm, activityType: e.target.value as any})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Docencia Directa">Docencia Directa (Frente a grupo)</option>
                  <option value="Observación">Observación de Clase</option>
                  <option value="Planeación">Planeación y Material Didáctico</option>
                  <option value="Acompañamiento">Acompañamiento y Tutoría</option>
                  <option value="Taller Extracurricular">Taller Extracurricular / Proyecto</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Clase de Algoritmia y Pseudocódigo"
                  value={logForm.title}
                  onChange={e => setLogForm({...logForm, title: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descripción Detallada</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Metodología aplicada, temas tratados, respuesta de los estudiantes..."
                  value={logForm.description}
                  onChange={e => setLogForm({...logForm, description: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Enlace a Evidencia (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/evidencia..."
                  value={logForm.evidenceLink}
                  onChange={e => setLogForm({...logForm, evidenceLink: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700"
                >
                  Registrar Horas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Subir Plan de Clase */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Cargar Nuevo Plan de Clase
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Envía tu planeación curricular para la revisión y aprobación de tu docente asesor.
            </p>

            <form onSubmit={handleAddPlan} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título del Plan de Clase</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Plan de Clase: Condicionales y Lógica"
                  value={planForm.title}
                  onChange={e => setPlanForm({...planForm, title: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Asignatura</label>
                  <input
                    type="text"
                    required
                    value={planForm.subject}
                    onChange={e => setPlanForm({...planForm, subject: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grado / Grupo</label>
                  <input
                    type="text"
                    required
                    value={planForm.gradeOrGroup}
                    onChange={e => setPlanForm({...planForm, gradeOrGroup: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Objetivo de Aprendizaje</label>
                <textarea
                  required
                  rows={2}
                  placeholder="¿Qué competencia desarrollará el estudiante?..."
                  value={planForm.objective}
                  onChange={e => setPlanForm({...planForm, objective: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Enlace a Documento / Guía</label>
                <input
                  type="url"
                  placeholder="https://documento-plan-clase.pdf"
                  value={planForm.evidenceUrl}
                  onChange={e => setPlanForm({...planForm, evidenceUrl: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                >
                  Enviar Plan a Revisión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
