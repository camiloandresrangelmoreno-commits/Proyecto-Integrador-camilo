import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck2,
  Calendar,
  Sparkles,
  School
} from 'lucide-react';

export const InstitutionModule: React.FC = () => {
  const { institutions, assignments, activityLogs, validateActivityLog } = useApp();

  // Institución simulada por defecto (Colegio de Santander)
  const currentInstitution = institutions[0];
  const institutionAssignments = assignments.filter(a => a.institutionId === currentInstitution?.id);
  const assignmentIds = institutionAssignments.map(a => a.id);
  
  // Bitácoras de practicantes asignados a este colegio
  const relevantLogs = activityLogs.filter(l => assignmentIds.includes(l.assignmentId));

  const [validationNote, setValidationNote] = useState('');
  const [selectedLogForValidation, setSelectedLogForValidation] = useState<string | null>(null);

  const handleConfirmValidation = (logId: string) => {
    validateActivityLog(
      logId,
      `${currentInstitution.tutorName} (${currentInstitution.name})`,
      validationNote || 'Asistencia presencial verificada en aula.'
    );
    setSelectedLogForValidation(null);
    setValidationNote('');
  };

  const pendingCount = relevantLogs.filter(l => !l.institutionValidated).length;
  const validatedCount = relevantLogs.filter(l => l.institutionValidated).length;

  return (
    <div className="space-y-6">
      
      {/* Encabezado de la Institución Receptora */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-800/60 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <School className="w-3.5 h-3.5" />
            <span>Portal de Institución Educativa Receptora</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2">
            {currentInstitution?.name}
          </h2>
          <p className="text-xs text-cyan-200 mt-0.5">
            Convenio Formalizado: <strong className="text-white">{currentInstitution?.agreementNumber}</strong> | Rectoría: {currentInstitution?.rectorOrDirector}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-xs">
            <span className="text-[11px] text-cyan-200 block">Horas por Validar</span>
            <span className="text-xl font-extrabold text-amber-300">{pendingCount} registros</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-xs">
            <span className="text-[11px] text-cyan-200 block">Horas Certificadas</span>
            <span className="text-xl font-extrabold text-emerald-300">{validatedCount} registros</span>
          </div>
        </div>
      </div>

      {/* Practicantes en este Colegio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-700" />
          <span>Practicantes UDI Asignados a esta Sede ({institutionAssignments.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {institutionAssignments.map(a => (
            <div key={a.id} className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900">{a.studentName}</p>
                <p className="text-slate-500 font-mono text-[11px]">{a.studentProgram} | Cód: {a.studentCode}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">Nivel: {a.practiceLevel}</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-extrabold text-blue-900 text-sm block">
                  {a.validatedHours} / {a.requiredHours} h
                </span>
                <span className="text-[10px] text-slate-400">Certificadas</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de Validación de Asistencia y Bitácoras */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Certificación y Validación de Sesiones de Aula
            </h3>
            <p className="text-xs text-slate-500">
              Revisa y firma la asistencia presencial y horas cumplidas por los practicantes
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold">
              {pendingCount} Pendientes de firma
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {relevantLogs.map(log => {
            const student = assignments.find(a => a.id === log.assignmentId);
            return (
              <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{log.title}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                      {student?.studentName}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">
                      {log.activityType}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    {log.description}
                  </p>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {log.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.hours} Horas presenciales
                    </span>
                  </div>

                  {log.observations && (
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      Nota de certificación: "{log.observations}"
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {log.institutionValidated ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Firmado y Validado</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConfirmValidation(log.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validar y Certificar Horas</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
