import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Plus, 
  FileCheck2, 
  UserPlus, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  School,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  GraduationCap,
  Award,
  IdCard
} from 'lucide-react';
import { Institution, PracticeAssignment, User } from '../../types';

export const CoordinatorModule: React.FC = () => {
  const { 
    institutions, 
    assignments, 
    advisors, 
    addAdvisor, 
    addInstitution, 
    updateInstitutionStatus, 
    assignStudentToInstitution 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'convenios' | 'docentes' | 'asignaciones'>('convenios');
  
  // Modal states
  const [showNewInstModal, setShowNewInstModal] = useState(false);
  const [showNewAdvisorModal, setShowNewAdvisorModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Form states - New Institution
  const [instForm, setInstForm] = useState({
    name: '',
    nit: '',
    rectorOrDirector: '',
    address: '',
    city: 'Bucaramanga',
    phone: '',
    email: '',
    agreementNumber: '',
    agreementValidUntil: '',
    availableSlots: 6,
    tutorName: '',
    sector: 'Oficial' as 'Oficial' | 'Privado',
    level: 'Básica Secundaria y Media'
  });

  // Form states - New Advisor (Docente Asesor)
  const [advisorForm, setAdvisorForm] = useState({
    name: '',
    email: '',
    documentNumber: '',
    phone: '',
    facultyOrSchool: 'Dpto. de Práctica Pedagógica y Didáctica - UDI',
    password: 'docente2026'
  });

  // Form states - New Assignment
  const [assignForm, setAssignForm] = useState({
    studentName: '',
    studentCode: '',
    studentProgram: 'Licenciatura en Educación / Informática',
    institutionId: institutions[0]?.id || '',
    advisorId: advisors[0]?.id || 'u-doc-1',
    requiredHours: 160,
    practiceLevel: 'Práctica Pedagógica II' as PracticeAssignment['practiceLevel']
  });

  const handleCreateInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instForm.name || !instForm.agreementNumber) return;

    addInstitution({
      ...instForm,
      agreementStatus: 'vigente'
    });

    setShowNewInstModal(false);
    setInstForm({
      name: '',
      nit: '',
      rectorOrDirector: '',
      address: '',
      city: 'Bucaramanga',
      phone: '',
      email: '',
      agreementNumber: '',
      agreementValidUntil: '',
      availableSlots: 6,
      tutorName: '',
      sector: 'Oficial',
      level: 'Básica Secundaria y Media'
    });
  };

  const handleCreateAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorForm.name || !advisorForm.email || !advisorForm.documentNumber) return;

    addAdvisor(advisorForm);

    setShowNewAdvisorModal(false);
    setAdvisorForm({
      name: '',
      email: '',
      documentNumber: '',
      phone: '',
      facultyOrSchool: 'Dpto. de Práctica Pedagógica y Didáctica - UDI',
      password: 'docente2026'
    });
  };

  const handleAssignStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.studentName || !assignForm.studentCode || !assignForm.institutionId) return;

    assignStudentToInstitution(
      assignForm.studentName,
      assignForm.studentCode,
      assignForm.studentProgram,
      assignForm.institutionId,
      assignForm.advisorId,
      assignForm.requiredHours,
      assignForm.practiceLevel
    );

    setShowAssignModal(false);
    setAssignForm({
      studentName: '',
      studentCode: '',
      studentProgram: 'Licenciatura en Educación / Informática',
      institutionId: institutions[0]?.id || '',
      advisorId: advisors[0]?.id || 'u-doc-1',
      requiredHours: 160,
      practiceLevel: 'Práctica Pedagógica II'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wide">
            Coordinación de Prácticas Académicas
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Gestión de Instituciones, Convenios y Docentes Asesores
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra la vinculación de colegios receptores, docentes tutores UDI y la asignación formal de practicantes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowNewAdvisorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Registrar Docente Asesor</span>
          </button>
          <button
            onClick={() => setShowNewInstModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#002855] hover:bg-[#003875] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Registrar Convenio</span>
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Asignar Practicante</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('convenios')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'convenios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Instituciones y Convenios ({institutions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('docentes')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'docentes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Docentes Asesores UDI ({advisors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('asignaciones')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'asignaciones'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Asignaciones de Práctica ({assignments.length})</span>
        </button>
      </div>

      {/* VISTA 1: CONVENIOS E INSTITUCIONES */}
      {activeTab === 'convenios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions.map((inst) => {
            const availableSlots = inst.availableSlots - inst.assignedCount;
            return (
              <div 
                key={inst.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl">
                      <School className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      inst.agreementStatus === 'vigente' ? 'bg-emerald-100 text-emerald-800' :
                      inst.agreementStatus === 'en_renovacion' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {inst.agreementStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">
                    {inst.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    NIT: {inst.nit} | Sector: {inst.sector}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{inst.address}, {inst.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{inst.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{inst.email}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                    <p className="text-slate-700">
                      <strong>Convenio:</strong> <span className="font-mono text-blue-900 font-bold">{inst.agreementNumber}</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Vigencia hasta: <strong>{inst.agreementValidUntil}</strong>
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Rector: {inst.rectorOrDirector}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500">Cupos: </span>
                    <strong className="text-slate-800 font-bold">{inst.assignedCount}</strong>
                    <span className="text-slate-400"> / {inst.availableSlots}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      value={inst.agreementStatus}
                      onChange={(e) => updateInstitutionStatus(inst.id, e.target.value as any)}
                      className="text-[11px] bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-hidden"
                    >
                      <option value="vigente">Vigente</option>
                      <option value="en_renovacion">En Renovación</option>
                      <option value="vencido">Vencido</option>
                    </select>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VISTA 2: DOCENTES ASESORES UDI */}
      {activeTab === 'docentes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Planta Docente de Asesoría y Supervisión de Prácticas
              </h3>
              <p className="text-xs text-slate-500">
                Docentes encargados del seguimiento en aula, aplicación de rúbricas y visitas formativas.
              </p>
            </div>
            <button
              onClick={() => setShowNewAdvisorModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Docente Asesor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisors.map(doc => {
              const studentsAssigned = assignments.filter(a => a.advisorId === doc.id || a.advisorName.includes(doc.name));
              return (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                        Asesor Activo
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{doc.name}</h4>
                      <p className="text-slate-500 text-xs mt-0.5">{doc.facultyOrSchool}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate font-mono">{doc.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IdCard className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">C.C. {doc.documentNumber}</span>
                      </div>
                      {doc.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Practicantes a cargo:</span>
                    <span className="font-mono font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                      {studentsAssigned.length} estudiantes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 3: ASIGNACIONES ACTIVAS */}
      {activeTab === 'asignaciones' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">
              Listado de Practicantes Asignados, Institución y Docente Tutor UDI
            </h3>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Nueva Asignación</span>
            </button>
          </div>

          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3">Estudiante</th>
                <th className="p-3">Código</th>
                <th className="p-3">Nivel de Práctica</th>
                <th className="p-3">Institución Asignada</th>
                <th className="p-3">Docente Asesor UDI</th>
                <th className="p-3 text-center">Horas Req.</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{a.studentName}</td>
                  <td className="p-3 font-mono text-slate-600">{a.studentCode}</td>
                  <td className="p-3 text-slate-700">{a.practiceLevel}</td>
                  <td className="p-3 font-medium text-blue-900">{a.institutionName}</td>
                  <td className="p-3 text-slate-700 font-semibold">{a.advisorName}</td>
                  <td className="p-3 text-center font-mono font-bold">{a.requiredHours}h</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {a.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal 1: Registrar Docente Asesor */}
      {showNewAdvisorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Registrar Nuevo Docente Asesor UDI
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa los datos del docente que supervisará y calificará las prácticas en aula.
            </p>

            <form onSubmit={handleCreateAdvisor} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Completo del Docente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Prof. Jorge Enrique Ramírez"
                  value={advisorForm.name}
                  onChange={e => setAdvisorForm({...advisorForm, name: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cédula / Documento</label>
                  <input
                    type="text"
                    required
                    placeholder="91.450.880"
                    value={advisorForm.documentNumber}
                    onChange={e => setAdvisorForm({...advisorForm, documentNumber: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Teléfono Móvil</label>
                  <input
                    type="text"
                    placeholder="+57 310 555 4321"
                    value={advisorForm.phone}
                    onChange={e => setAdvisorForm({...advisorForm, phone: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Correo Institucional UDI</label>
                <input
                  type="email"
                  required
                  placeholder="jramirez@udi.edu.co"
                  value={advisorForm.email}
                  onChange={e => setAdvisorForm({...advisorForm, email: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Departamento / Área de Vinculación</label>
                <input
                  type="text"
                  required
                  value={advisorForm.facultyOrSchool}
                  onChange={e => setAdvisorForm({...advisorForm, facultyOrSchool: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contraseña Inicial de Acceso</label>
                <input
                  type="text"
                  required
                  value={advisorForm.password}
                  onChange={e => setAdvisorForm({...advisorForm, password: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewAdvisorModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Guardar Docente Asesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Registrar Institución */}
      {showNewInstModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Registrar Nueva Institución Educativa Receptora
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa los datos del colegio y el número de convenio formalizado ante la UDI.
            </p>

            <form onSubmit={handleCreateInstitution} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre de la Institución</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colegio Santander (Sede Norte)"
                  value={instForm.name}
                  onChange={e => setInstForm({...instForm, name: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIT</label>
                  <input
                    type="text"
                    required
                    placeholder="890.201.442-1"
                    value={instForm.nit}
                    onChange={e => setInstForm({...instForm, nit: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sector</label>
                  <select
                    value={instForm.sector}
                    onChange={e => setInstForm({...instForm, sector: e.target.value as any})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Oficial">Oficial / Público</option>
                    <option value="Privado">Privado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rector(a) o Director(a)</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre completo"
                  value={instForm.rectorOrDirector}
                  onChange={e => setInstForm({...instForm, rectorOrDirector: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dirección</label>
                  <input
                    type="text"
                    placeholder="Calle 9 # 25-12"
                    value={instForm.address}
                    onChange={e => setInstForm({...instForm, address: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="(607) 671-2200"
                    value={instForm.phone}
                    onChange={e => setInstForm({...instForm, phone: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Número de Convenio</label>
                  <input
                    type="text"
                    required
                    placeholder="CONV-UDI-2026-001"
                    value={instForm.agreementNumber}
                    onChange={e => setInstForm({...instForm, agreementNumber: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vigencia hasta</label>
                  <input
                    type="date"
                    required
                    value={instForm.agreementValidUntil}
                    onChange={e => setInstForm({...instForm, agreementValidUntil: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cupos Disponibles</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={instForm.availableSlots}
                    onChange={e => setInstForm({...instForm, availableSlots: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tutor Institucional</label>
                  <input
                    type="text"
                    placeholder="Docente supervisor en colegio"
                    value={instForm.tutorName}
                    onChange={e => setInstForm({...instForm, tutorName: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewInstModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Guardar Convenio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Asignar Practicante */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Asignar Practicante a Institución Educativa
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formaliza la asignación del estudiante, colegio receptor y docente asesor UDI.
            </p>

            <form onSubmit={handleAssignStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Completo del Estudiante</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Andrés Felipe Prada"
                  value={assignForm.studentName}
                  onChange={e => setAssignForm({...assignForm, studentName: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Código Estudiantil</label>
                  <input
                    type="text"
                    required
                    placeholder="2022104599"
                    value={assignForm.studentCode}
                    onChange={e => setAssignForm({...assignForm, studentCode: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Horas Reglamentarias</label>
                  <select
                    value={assignForm.requiredHours}
                    onChange={e => setAssignForm({...assignForm, requiredHours: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value={160}>160 Horas (Práctica Pedagógica I/II)</option>
                    <option value={320}>320 Horas (Práctica Profundización)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nivel de Práctica</label>
                <select
                  value={assignForm.practiceLevel}
                  onChange={e => setAssignForm({...assignForm, practiceLevel: e.target.value as any})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Práctica Pedagógica I">Práctica Pedagógica I</option>
                  <option value="Práctica Pedagógica II">Práctica Pedagógica II</option>
                  <option value="Práctica Profesional III">Práctica Profesional III</option>
                  <option value="Práctica de Profundización">Práctica de Profundización</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Institución Receptora</label>
                <select
                  value={assignForm.institutionId}
                  onChange={e => setAssignForm({...assignForm, institutionId: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.availableSlots - inst.assignedCount} cupos disp.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Docente Asesor UDI Asignado</label>
                <select
                  value={assignForm.advisorId}
                  onChange={e => setAssignForm({...assignForm, advisorId: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {advisors.map(adv => (
                    <option key={adv.id} value={adv.id}>
                      {adv.name} ({adv.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
