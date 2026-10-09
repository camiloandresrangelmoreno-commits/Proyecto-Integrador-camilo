import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Download, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { assignments, institutions, metrics, currentUser } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs">MEN / CNA</span>
            <h3 className="text-base font-bold text-slate-800">
              Informe Oficial de Trazabilidad y Acreditación de Prácticas
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto print:p-0 print:m-0 text-slate-800 space-y-6">
          
          {/* Encabezado Institucional UDI */}
          <div className="flex items-center justify-between border-b-2 border-[#002855] pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#002855] text-white flex items-center justify-center font-black text-2xl tracking-tighter">
                UDI
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-[#002855] uppercase tracking-tight">
                  Universidad de Investigación y Desarrollo - UDI
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Facultad de Ingenierías y Ciencias de la Educación | Coordinación de Prácticas
                </p>
                <p className="text-xs text-slate-500">
                  Resolución MEN No. 1075 de 2015 - Sistema de Aseguramiento de la Calidad CNA
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-700">Período: II - 2026</p>
              <p className="text-slate-500">Fecha de emisión:</p>
              <p className="font-semibold text-slate-700">{currentDate}</p>
            </div>
          </div>

          {/* Título del reporte */}
          <div className="text-center py-2 bg-blue-50/60 rounded-xl border border-blue-100">
            <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wide">
              Reporte Consolidado de Cumplimiento de Prácticas Pedagógicas y Académicas
            </h2>
            <p className="text-xs text-slate-600">
              Destinatario: Dirección de Programa, Decanatura de Facultad y Comité de Autoevaluación
            </p>
          </div>

          {/* Indicadores Clave para Acreditación */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              1. Indicadores Estadísticos Clave (Decreto 1075 / MEN)
            </h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                <span className="text-xl font-extrabold text-blue-900">{metrics.totalStudents}</span>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">Estudiantes Asignados</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                <span className="text-xl font-extrabold text-emerald-700">{metrics.totalHoursValidated} hrs</span>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">Horas Certificadas</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                <span className="text-xl font-extrabold text-indigo-700">{metrics.averageCompliancePercent}%</span>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">Índice de Cumplimiento</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                <span className="text-xl font-extrabold text-amber-700">{metrics.averageEvaluationGrade} / 5.0</span>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">Promedio Rúbricas</p>
              </div>
            </div>
          </div>

          {/* Tabla de Estudiantes y Trazabilidad */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              2. Matriz de Seguimiento por Practicante e Institución Receptora
            </h4>
            <table className="w-full text-left text-xs border border-slate-200 divide-y divide-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2">Estudiante</th>
                  <th className="p-2">Código</th>
                  <th className="p-2">Institución Receptora</th>
                  <th className="p-2 text-center">Horas Req.</th>
                  <th className="p-2 text-center">Validadas</th>
                  <th className="p-2 text-center">% Avance</th>
                  <th className="p-2 text-center">Nota Prom.</th>
                  <th className="p-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map(a => {
                  const percent = Math.min(100, Math.round((a.validatedHours / a.requiredHours) * 100));
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-2 font-medium text-slate-900">{a.studentName}</td>
                      <td className="p-2 text-slate-600">{a.studentCode}</td>
                      <td className="p-2 text-slate-700">{a.institutionName}</td>
                      <td className="p-2 text-center font-mono">{a.requiredHours}h</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">{a.validatedHours}h</td>
                      <td className="p-2 text-center font-bold">{percent}%</td>
                      <td className="p-2 text-center font-semibold text-blue-800">{a.gradeAverage ? a.gradeAverage.toFixed(1) : 'N/A'}</td>
                      <td className="p-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          a.status === 'completada' ? 'bg-emerald-100 text-emerald-800' :
                          a.status === 'en_riesgo' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Convenios Interinstitucionales */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              3. Estado de Convenios Interinstitucionales Formalizados
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {institutions.map(inst => (
                <div key={inst.id} className="p-2 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{inst.name}</p>
                    <p className="text-[11px] text-slate-500">Conv: {inst.agreementNumber} | Vence: {inst.agreementValidUntil}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inst.agreementStatus === 'vigente' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inst.agreementStatus.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Firmas de Autoridad Académica */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Dra. Elena Rocío Gómez Ortiz</p>
              <p className="text-slate-500">Directora de Programa de Licenciatura</p>
              <p className="text-[11px] text-slate-400">Universidad de Investigación y Desarrollo - UDI</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-800">Ing. Carlos Mauricio Benítez</p>
              <p className="text-slate-500">Coordinador de Prácticas Académicas</p>
              <p className="text-[11px] text-slate-400">Universidad de Investigación y Desarrollo - UDI</p>
            </div>
          </div>

          {/* Nota al pie */}
          <p className="text-[10px] text-slate-400 text-center italic pt-4">
            Documento generado automáticamente por el Sistema Integral de Gestión de Prácticas Académicas (SIGPA - UDI).
            Verificable mediante código de auditoría institucional interna.
          </p>

        </div>

      </div>
    </div>
  );
};
