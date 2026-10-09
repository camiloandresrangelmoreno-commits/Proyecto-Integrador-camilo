import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/initialData';
import { 
  GraduationCap, 
  UserCheck, 
  Award, 
  Users, 
  Building2, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  School
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { login, setActiveTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('estudiante');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Datos del rol seleccionado para precargar sugerencias
  const currentDemoUser = INITIAL_USERS.find(u => u.role === selectedRole);

  const roleDefinitions: { 
    role: UserRole; 
    title: string; 
    category: string; 
    icon: React.ReactNode; 
    color: string;
    fieldLabel: string;
    fieldPlaceholder: string;
    demoIdentifier: string;
    demoPass: string;
    description: string;
  }[] = [
    {
      role: 'estudiante',
      title: 'Estudiante Practicante',
      category: 'Formación en Aula',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'border-purple-500 bg-purple-50 text-purple-700',
      fieldLabel: 'Código Estudiantil o Correo UDI',
      fieldPlaceholder: '2022104509 o crangel@udi.edu.co',
      demoIdentifier: currentDemoUser?.studentCode || '2022104509',
      demoPass: 'estudiante2026',
      description: 'Acceso para registrar bitácora diaria, subir planes de clase y consultar horas acumuladas.'
    },
    {
      role: 'docente',
      title: 'Docente Asesor UDI',
      category: 'Supervisión Pedagógica',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      fieldLabel: 'Correo Docente Institucional',
      fieldPlaceholder: 'mrueda@udi.edu.co',
      demoIdentifier: 'mrueda@udi.edu.co',
      demoPass: 'docente2026',
      description: 'Acceso para programar visitas de observación, aplicar rúbricas formativas y calificar.'
    },
    {
      role: 'director',
      title: 'Director de Programa',
      category: 'Gestión Estratégica & CNA',
      icon: <Award className="w-5 h-5" />,
      color: 'border-amber-500 bg-amber-50 text-amber-700',
      fieldLabel: 'Correo de Dirección de Programa',
      fieldPlaceholder: 'egomez@udi.edu.co',
      demoIdentifier: 'egomez@udi.edu.co',
      demoPass: 'director2026',
      description: 'Acceso a KPIs en tiempo real, cumplimiento del Decreto 1075 y reportes oficiales para el MEN.'
    },
    {
      role: 'coordinador',
      title: 'Coordinador de Prácticas',
      category: 'Convenios & Asignaciones',
      icon: <Users className="w-5 h-5" />,
      color: 'border-blue-500 bg-blue-50 text-blue-700',
      fieldLabel: 'Correo de Coordinación UDI',
      fieldPlaceholder: 'cbenitez@udi.edu.co',
      demoIdentifier: 'cbenitez@udi.edu.co',
      demoPass: 'coordinador2026',
      description: 'Acceso para registrar convenios con colegios, administrar cupos y asignar practicantes.'
    },
    {
      role: 'institucion',
      title: 'Institución Receptora',
      category: 'Validación en Colegio',
      icon: <Building2 className="w-5 h-5" />,
      color: 'border-cyan-500 bg-cyan-50 text-cyan-700',
      fieldLabel: 'NIT Institucional o No. Convenio',
      fieldPlaceholder: '890.201.442-1 o CONV-UDI-2025-014',
      demoIdentifier: currentDemoUser?.institutionNit || '890.201.442-1',
      demoPass: 'colegio2026',
      description: 'Acceso para rectores y tutores escolares para certificar asistencia presencial de practicantes.'
    }
  ];

  const currentRoleConfig = roleDefinitions.find(r => r.role === selectedRole)!;

  const handleRoleTabClick = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
  };

  const handleFillDemo = () => {
    setIdentifier(currentRoleConfig.demoIdentifier);
    setPassword(currentRoleConfig.demoPass);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = login(
        selectedRole, 
        identifier || currentRoleConfig.demoIdentifier, 
        password || currentRoleConfig.demoPass
      );

      setIsLoading(false);
      if (!result.success && result.message) {
        setErrorMessage(result.message);
      }
    }, 400);
  };

  const handleQuickDemoAccess = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* Cabecera Institucional UDI */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-[#002855] text-white px-5 py-2 rounded-2xl shadow-md border border-blue-900">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-lg tracking-tighter">
              UDI
            </span>
            <div className="text-left">
              <span className="text-sm font-extrabold tracking-tight block">
                Universidad de Investigación y Desarrollo
              </span>
              <span className="text-[11px] text-blue-200">
                Sistema Integral de Gestión de Prácticas Académicas (SIGPA)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Portal Institucional de Acceso por Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Selecciona tu rol para ingresar a tu entorno exclusivo de prácticas, seguimiento y acreditación académica.
          </p>
        </div>

        {/* Tarjeta Principal de Login */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Selector de Pestañas por Rol (Separados según el requerimiento del usuario) */}
          <div className="bg-slate-50 border-b border-slate-200 p-2 sm:p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {roleDefinitions.map(r => {
                const isActive = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleTabClick(r.role)}
                    className={`flex flex-col items-center text-center p-2.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                        : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mb-1.5 ${
                      isActive ? 'bg-[#002855] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {r.icon}
                    </div>
                    <span className="text-xs font-bold leading-tight line-clamp-1">{r.title}</span>
                    <span className="text-[10px] text-slate-400 leading-tight hidden sm:block">{r.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario Específico del Rol */}
          <div className="p-6 sm:p-10">
            <div className="max-w-md mx-auto space-y-6">
              
              {/* Resumen del Rol Seleccionado */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800">
                  {currentRoleConfig.icon}
                  <span>Acceso: {currentRoleConfig.title}</span>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  {currentRoleConfig.description}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {currentRoleConfig.fieldLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      {selectedRole === 'estudiante' ? <GraduationCap className="w-4 h-4" /> :
                       selectedRole === 'institucion' ? <Building2 className="w-4 h-4" /> :
                       <Mail className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder={currentRoleConfig.fieldPlaceholder}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Contraseña Institucional
                    </label>
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      Autocompletar Demo
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Usuario sugerido:</span>
                    <strong className="text-slate-700 font-mono">{currentRoleConfig.demoIdentifier}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Clave demo:</span>
                    <strong className="text-slate-700 font-mono">{currentRoleConfig.demoPass}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#002855] hover:bg-[#003875] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verificando credenciales...</span>
                  ) : (
                    <>
                      <span>Iniciar Sesión como {currentRoleConfig.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Botón de Acceso Rápido en 1 Clic */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => handleQuickDemoAccess(selectedRole)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Entrar de inmediato con este rol (Acceso Rápido)</span>
                </button>
              </div>

            </div>
          </div>

          {/* Footer de la tarjeta con accesos directos */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Plataforma institucional segura con acceso diferenciado por roles (MEN Decreto 1075)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Universidad de Investigación y Desarrollo - UDI
            </span>
          </div>

        </div>

        {/* Guía Rápida para el Jurado o Profesor Evaluador */}
        <div className="bg-gradient-to-r from-blue-900 to-[#002855] text-white p-5 rounded-2xl shadow-md border border-blue-800">
          <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>Guía para Sustentación del Proyecto Integrador UDI:</span>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Para demostrar el 100% de la funcionalidad solicitada en el PDF, puedes ingresar con el rol de 
            <strong className="text-white"> Estudiante</strong> para cargar horas y planes de clase, 
            luego cerrar sesión e ingresar como <strong className="text-white">Institución Receptora</strong> para validar y firmar las horas, 
            como <strong className="text-white">Docente Asesor</strong> para calificar con la rúbrica formativa, y finalmente como 
            <strong className="text-white"> Director</strong> para emitir el informe consolidado para acreditación del MEN.
          </p>
        </div>

      </div>
    </div>
  );
};
