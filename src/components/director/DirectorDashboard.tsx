import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Clock, 
  Building2, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Search, 
  Filter, 
  ShieldCheck, 
  ChevronRight,
  Printer,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { PrintableReportModal } from '../reports/PrintableReportModal';

export const DirectorDashboard: React.FC = () => {
  const { assignments, institutions, metrics, activityLogs, evaluations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.studentCode.includes(searchTerm) ||
                          a.institutionName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner de Bienvenida y Propósito según el PDF */}
      <div className="bg-gradient-to-r from-[#002855] via-[#003875] to-[#004b9e] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Panel Ejecutivo de Dirección de Programa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestión y Trazabilidad de Prácticas Académicas
          </h1>
          <p className="text-blue-100 text-sm mt-2 leading-relaxed">
            Supervisa en tiempo real el cumplimiento de horas reglamentarias bajo el Decreto 1075 de 2015 del MEN, 
            la vigencia de convenios interinstitucionales y los indicadores para procesos de acreditación de alta calidad CNA.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Printer className="w-4 h-4" />
              <span>Generar Informe de Acreditación (MEN / CNA)</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-blue-200 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Reducción de sobrecarga operativa: <strong>~45% automatizado</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Estudiantes y Horas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estudiantes en Práctica
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {metrics.activePractices} Activas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.completedPractices} completaron el 100% de horas
          </p>
        </div>

        {/* Cumplimiento de Horas Validadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Horas Reglamentarias
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.totalHoursValidated}</span>
            <span className="text-xs font-bold text-slate-500">/ {metrics.totalHoursLogged} reg.</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.averageCompliancePercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex justify-between">
            <span>Avance general:</span>
            <strong className="text-emerald-700">{metrics.averageCompliancePercent}%</strong>
          </p>
        </div>

        {/* Convenios con Instituciones */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Convenios Formalizados
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.activeAgreements}</span>
            <span className="text-xs font-semibold text-slate-500">de {institutions.length} colegios</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Todos formalizados ante Decanatura</span>
          </p>
        </div>

        {/* Alerta de Prácticas en Riesgo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Semáforo de Riesgo
            </span>
            <div className={`p-2.5 rounded-xl ${metrics.atRiskPractices > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${metrics.atRiskPractices > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {metrics.atRiskPractices}
            </span>
            <span className="text-xs font-semibold text-slate-500">casos en alerta</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.atRiskPractices > 0 ? 'Requieren reunión con docente asesor' : 'Cumplimiento óptimo del cronograma'}
          </p>
        </div>

      </div>

      {/* Tabla de Supervisión Centralizada del Director */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Cabecera de la tabla con búsqueda y filtros */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Supervisión de Practicantes y Cumplimiento Normativo
            </h3>
            <p className="text-xs text-slate-500">
              Seguimiento uno a uno de horas, docente asesor y concepto pedagógico
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por estudiante, código o colegio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-hidden text-xs"
              >
                <option value="all">Todos los estados</option>
                <option value="activa">Activa</option>
                <option value="en_riesgo">En Riesgo</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Estudiante / Código</th>
                <th className="py-3.5 px-4">Nivel & Programa</th>
                <th className="py-3.5 px-4">Institución Receptora</th>
                <th className="py-3.5 px-4">Docente Asesor</th>
                <th className="py-3.5 px-4 text-center">Horas Validadas</th>
                <th className="py-3.5 px-4 text-center">Progreso</th>
                <th className="py-3.5 px-4 text-center">Nota Prom.</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((assignment) => {
                const percent = Math.min(100, Math.round((assignment.validatedHours / assignment.requiredHours) * 100));
                return (
                  <tr key={assignment.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{assignment.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Cód: {assignment.studentCode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 block">{assignment.practiceLevel}</span>
                      <span className="text-[11px] text-slate-500">{assignment.studentProgram}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{assignment.institutionName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{assignment.advisorName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-mono font-bold text-slate-800">
                        {assignment.validatedHours} / {assignment.requiredHours} hrs
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ({assignment.completedHours} reportadas)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              percent >= 100 ? 'bg-emerald-500' :
                              assignment.status === 'en_riesgo' ? 'bg-red-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {assignment.gradeAverage ? (
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono ${
                          assignment.gradeAverage >= 4.5 ? 'bg-emerald-100 text-emerald-800' :
                          assignment.gradeAverage >= 3.5 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {assignment.gradeAverage.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pendiente</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        assignment.status === 'completada' ? 'bg-emerald-100 text-emerald-800' :
                        assignment.status === 'en_riesgo' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {assignment.status === 'completada' && <CheckCircle2 className="w-3 h-3" />}
                        {assignment.status === 'en_riesgo' && <AlertTriangle className="w-3 h-3" />}
                        {assignment.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla con resumen normativo */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Normativa aplicable:</span>
            <span>Decreto 1075 de 2015 del MEN - Horas mínimas requeridas por crédito de práctica docente</span>
          </div>
          <span className="font-bold text-slate-800">
            Total registros: {filteredAssignments.length} practicantes
          </span>
        </div>

      </div>

      {/* Modal para imprimir o exportar */}
      <PrintableReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
};
