import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  Eye, 
  FileText, 
  Calendar, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Star,
  Clock,
  Building2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { PracticeAssignment, SupervisionVisit, ClassPlan, EvaluationCriterion } from '../../types';

export const TeacherModule: React.FC = () => {
  const { 
    assignments, 
    visits, 
    classPlans, 
    evaluations, 
    addSupervisionVisit, 
    reviewClassPlan, 
    submitEvaluation 
  } = useApp();

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'visitas' | 'planes' | 'rubrica'>('visitas');

  // Modal registrar visita
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    date: new Date().toISOString().split('T')[0],
    modality: 'Presencial en Aula' as SupervisionVisit['modality'],
    strengths: '',
    aspectsToImprove: '',
    commitments: '',
    score: 4.5
  });

  // Modal evaluar rúbrica
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [rubricPeriod, setRubricPeriod] = useState<'Corte 1' | 'Corte 2' | 'Evaluación Final'>('Corte 2');
  const [rubricCriteria, setRubricCriteria] = useState<EvaluationCriterion[]>([
    { id: 'rc1', category: 'Dominio Disciplinar y Curricular', description: 'Conocimiento sólido de los contenidos y estándares del MEN.', weight: 20, score: 4.8 },
    { id: 'rc2', category: 'Planificación y Didáctica', description: 'Coherencia entre objetivos, metodologías y recursos propuestos.', weight: 25, score: 4.5 },
    { id: 'rc3', category: 'Clima de Aula y Manejo de Grupo', description: 'Establecimiento de normas de convivencia y motivación a los alumnos.', weight: 20, score: 4.6 },
    { id: 'rc4', category: 'Evaluación y Retroalimentación', description: 'Uso de instrumentos formativos y comunicación asertiva de logros.', weight: 20, score: 4.7 },
    { id: 'rc5', category: 'Ética y Compromiso Institucional', description: 'Puntualidad, presentación personal y sentido de pertenencia UDI.', weight: 15, score: 5.0 }
  ]);
  const [rubricFeedback, setRubricFeedback] = useState('Desempeño sobresaliente en el aula. Demuestra liderazgo y preparación rigurosa.');

  // Modal feedback plan de clase
  const [selectedPlanForReview, setSelectedPlanForReview] = useState<ClassPlan | null>(null);
  const [planFeedbackText, setPlanFeedbackText] = useState('');
  const [planRating, setPlanRating] = useState(4.8);

  const currentAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];
  const assignmentVisits = visits.filter(v => v.assignmentId === currentAssignment?.id);
  const assignmentPlans = classPlans.filter(p => p.assignmentId === currentAssignment?.id);
  const assignmentEvals = evaluations.filter(e => e.assignmentId === currentAssignment?.id);

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssignment) return;

    addSupervisionVisit({
      assignmentId: currentAssignment.id,
      advisorId: currentAssignment.advisorId,
      visitNumber: assignmentVisits.length + 1,
      ...visitForm
    });

    setShowVisitModal(false);
    setVisitForm({
      date: new Date().toISOString().split('T')[0],
      modality: 'Presencial en Aula',
      strengths: '',
      aspectsToImprove: '',
      commitments: '',
      score: 4.5
    });
  };

  const handleCriteriaScoreChange = (index: number, score: number) => {
    setRubricCriteria(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], score };
      return updated;
    });
  };

  const currentRubricAverage = rubricCriteria.reduce((sum, c) => sum + (c.score * (c.weight / 100)), 0);

  const handleSubmitRubric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssignment) return;

    submitEvaluation({
      assignmentId: currentAssignment.id,
      evaluatorId: currentAssignment.advisorId,
      evaluatorRole: 'docente_asesor',
      period: rubricPeriod,
      criteria: rubricCriteria,
      qualitativeFeedback: rubricFeedback,
      finalScore: Number(currentRubricAverage.toFixed(2))
    });

    setShowRubricModal(false);
  };

  const handleReviewPlan = (status: 'aprobado' | 'con_observaciones') => {
    if (!selectedPlanForReview) return;
    reviewClassPlan(selectedPlanForReview.id, status, planFeedbackText, planRating);
    setSelectedPlanForReview(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wide">
            Acompañamiento y Evaluación Pedagógica
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Módulo del Docente Asesor UDI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Realiza el seguimiento pedagógico en aula, aplica rúbricas de evaluación y revisa planes de clase.
          </p>
        </div>

        {/* Selector de practicante a supervisar */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-600">Practicante:</span>
          <select
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden"
          >
            {assignments.map(a => (
              <option key={a.id} value={a.id}>
                {a.studentName} ({a.institutionName.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ficha Resumen del Practicante Seleccionado */}
      {currentAssignment && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-2xl p-5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
                {currentAssignment.practiceLevel}
              </span>
              <h3 className="text-lg font-extrabold mt-1">{currentAssignment.studentName}</h3>
              <p className="text-xs text-emerald-200">
                Colegio: <strong>{currentAssignment.institutionName}</strong> | Cód: {currentAssignment.studentCode}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 px-3.5 py-2 rounded-xl text-center backdrop-blur-xs">
                <span className="text-xs text-emerald-200 block">Horas Validadas</span>
                <span className="text-base font-extrabold">{currentAssignment.validatedHours} / {currentAssignment.requiredHours} hrs</span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl text-center backdrop-blur-xs">
                <span className="text-xs text-emerald-200 block">Nota Promedio</span>
                <span className="text-base font-extrabold text-amber-300">
                  {currentAssignment.gradeAverage ? currentAssignment.gradeAverage.toFixed(1) : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación de Pestañas del Docente */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveSubTab('visitas')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'visitas'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Visitas de Supervisión ({assignmentVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('planes')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'planes'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Revisión de Planes de Clase ({assignmentPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rubrica')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'rubrica'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rúbrica de Evaluación Pedagógica ({assignmentEvals.length})</span>
        </button>
      </div>

      {/* Pestaña: Visitas de Supervisión */}
      {activeSubTab === 'visitas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-800">
              Registro Histórico de Visitas al Colegio
            </h4>
            <button
              onClick={() => setShowVisitModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Visita de Acompañamiento</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentVisits.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Visita #{v.visitNumber} ({v.modality})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">{v.date}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-100 text-emerald-800">
                      Nota: {v.score.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <strong className="text-emerald-700 block">Fortalezas Observadas:</strong>
                    <p className="text-slate-600">{v.strengths}</p>
                  </div>
                  <div>
                    <strong className="text-amber-700 block">Aspectos a Mejorar:</strong>
                    <p className="text-slate-600">{v.aspectsToImprove}</p>
                  </div>
                  <div>
                    <strong className="text-blue-700 block">Compromisos Formativos:</strong>
                    <p className="text-slate-600">{v.commitments}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña: Planes de Clase */}
      {activeSubTab === 'planes' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-800">
              Planes de Clase Presentados para Aprobación
            </h4>
            <span className="text-xs text-slate-500">
              Total: {assignmentPlans.length} entregas
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {assignmentPlans.map(plan => (
              <div key={plan.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{plan.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      plan.status === 'aprobado' ? 'bg-emerald-100 text-emerald-800' :
                      plan.status === 'con_observaciones' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {plan.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Asignatura:</strong> {plan.subject} | <strong>Grupo:</strong> {plan.gradeOrGroup} | <strong>Fecha:</strong> {plan.deliveryDate}
                  </p>
                  <p className="text-slate-500 text-[11px] italic">
                    Objetivo: {plan.objective}
                  </p>
                  {plan.advisorFeedback && (
                    <div className="mt-1 p-2 bg-emerald-50 text-emerald-900 rounded-lg text-[11px]">
                      <strong>Retroalimentación:</strong> {plan.advisorFeedback}
                      {plan.rating && <span className="ml-2 font-mono font-bold">({plan.rating} / 5.0)</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedPlanForReview(plan);
                      setPlanFeedbackText(plan.advisorFeedback || '');
                      setPlanRating(plan.rating || 4.8);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Evaluar / Retroalimentar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña: Rúbrica Pedagógica */}
      {activeSubTab === 'rubrica' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Evaluaciones de Desempeño Pedagógico Formativo
              </h4>
              <p className="text-xs text-slate-500">
                Basadas en los lineamientos del Ministerio de Educación Nacional (MEN) y el CNA
              </p>
            </div>
            <button
              onClick={() => setShowRubricModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Diligenciar Rúbrica Formativa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {assignmentEvals.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {ev.period}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">Fecha: {ev.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Calificación Ponderada:</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-700">
                      {ev.finalScore.toFixed(2)} / 5.0
                    </span>
                  </div>
                </div>

                {/* Criterios evaluados */}
                <div className="space-y-2">
                  {ev.criteria.map(c => (
                    <div key={c.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                      <div className="max-w-md">
                        <strong className="text-slate-800 block">{c.category}</strong>
                        <span className="text-[11px] text-slate-500">{c.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-[11px]">{c.weight}%</span>
                        <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {c.score.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                  <strong className="text-blue-900 block mb-1">Concepto Cualitativo Docente:</strong>
                  <p className="text-slate-700">{ev.qualitativeFeedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Registrar Visita */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Registrar Visita de Supervisión en Aula
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Practicante: <strong>{currentAssignment?.studentName}</strong> ({currentAssignment?.institutionName})
            </p>

            <form onSubmit={handleAddVisit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha de la Visita</label>
                  <input
                    type="date"
                    required
                    value={visitForm.date}
                    onChange={e => setVisitForm({...visitForm, date: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Modalidad</label>
                  <select
                    value={visitForm.modality}
                    onChange={e => setVisitForm({...visitForm, modality: e.target.value as any})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Presencial en Aula">Presencial en Aula</option>
                    <option value="Virtual sincrónica">Virtual sincrónica</option>
                    <option value="Reunión con Rectoría">Reunión con Rectoría</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fortalezas Pedagógicas Observadas</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Aspectos positivos en metodología, motivación y dominio del tema..."
                  value={visitForm.strengths}
                  onChange={e => setVisitForm({...visitForm, strengths: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Aspectos a Mejorar</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Manejo del tiempo, recursos didácticos o disciplina..."
                  value={visitForm.aspectsToImprove}
                  onChange={e => setVisitForm({...visitForm, aspectsToImprove: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Compromisos Formativos del Practicante</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Acciones concretas para la próxima visita..."
                  value={visitForm.commitments}
                  onChange={e => setVisitForm({...visitForm, commitments: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Calificación de la Sesión: <span className="font-bold font-mono text-emerald-700">{visitForm.score} / 5.0</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={visitForm.score}
                  onChange={e => setVisitForm({...visitForm, score: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowVisitModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  Guardar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Diligenciar Rúbrica */}
      {showRubricModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                Rúbrica de Evaluación Pedagógica (MEN)
              </h3>
              <span className="font-mono font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Promedio: {currentRubricAverage.toFixed(2)} / 5.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Califica cada dimensión formativa de 1.0 a 5.0 según el desempeño observado en el aula.
            </p>

            <form onSubmit={handleSubmitRubric} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Corte / Periodo</label>
                <select
                  value={rubricPeriod}
                  onChange={e => setRubricPeriod(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Corte 1">Corte 1 (30%)</option>
                  <option value="Corte 2">Corte 2 (35%)</option>
                  <option value="Evaluación Final">Evaluación Final (35%)</option>
                </select>
              </div>

              {/* Lista de Criterios con Sliders */}
              <div className="space-y-3 border-y border-slate-100 py-3">
                {rubricCriteria.map((crit, idx) => (
                  <div key={crit.id} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200/60">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-800">{crit.category} ({crit.weight}%)</strong>
                      <span className="font-mono font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {crit.score.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{crit.description}</p>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={crit.score}
                      onChange={e => handleCriteriaScoreChange(idx, Number(e.target.value))}
                      className="w-full mt-1 accent-emerald-600"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Concepto Cualitativo Integral</label>
                <textarea
                  required
                  rows={3}
                  value={rubricFeedback}
                  onChange={e => setRubricFeedback(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRubricModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  Guardar Evaluación ({currentRubricAverage.toFixed(2)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Retroalimentar Plan de Clase */}
      {selectedPlanForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Revisar Plan de Clase
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-3">
              {selectedPlanForReview.title} ({selectedPlanForReview.subject})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observaciones / Sugerencias Pedagógicas</label>
                <textarea
                  rows={3}
                  placeholder="Detalla recomendaciones para el practicante..."
                  value={planFeedbackText}
                  onChange={e => setPlanFeedbackText(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Calificación del Plan: <span className="font-bold font-mono text-emerald-700">{planRating} / 5.0</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={planRating}
                  onChange={e => setPlanRating(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForReview(null)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewPlan('con_observaciones')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold"
                >
                  Devolver con Observaciones
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewPlan('aprobado')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Aprobar Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
