import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Award, Users, UserCheck, GraduationCap, Building2, HelpCircle } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, setActiveRole, activeTab } = useApp();

  if (activeTab === 'guide') {
    return null; // Ocultar en la pestaña de documentación académica
  }

  const rolesConfig: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'director',
      title: 'Director de Programa',
      subtitle: 'KPIs, acreditación CNA/MEN y aprobación',
      icon: <Award className="w-5 h-5" />,
      color: 'hover:border-amber-400 data-[active=true]:border-amber-500 data-[active=true]:bg-amber-500/10 data-[active=true]:text-amber-700'
    },
    {
      role: 'coordinador',
      title: 'Coordinador de Prácticas',
      subtitle: 'Convenios, cupos y asignaciones',
      icon: <Users className="w-5 h-5" />,
      color: 'hover:border-blue-400 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700'
    },
    {
      role: 'docente',
      title: 'Docente Asesor',
      subtitle: 'Visitas, rúbricas pedagógicas y notas',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'hover:border-emerald-400 data-[active=true]:border-emerald-600 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700'
    },
    {
      role: 'estudiante',
      title: 'Estudiante Practicante',
      subtitle: 'Bitácora de horas, planes de clase y evidencias',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'hover:border-purple-400 data-[active=true]:border-purple-600 data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700'
    },
    {
      role: 'institucion',
      title: 'Institución Receptora',
      subtitle: 'Certificación de asistencia en colegio',
      icon: <Building2 className="w-5 h-5" />,
      color: 'hover:border-cyan-400 data-[active=true]:border-cyan-600 data-[active=true]:bg-cyan-50 data-[active=true]:text-cyan-700'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Acceso por Rol Diferenciado:</span>
            <div className="group relative cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-64 p-2 bg-slate-900 text-white text-[11px] rounded shadow-lg z-50 normal-case font-normal">
                Según el PDF del proyecto, el sistema cuenta con accesos específicos para cada actor del proceso de prácticas. Haz clic para cambiar la vista interactiva.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {rolesConfig.map((item) => {
              const isActive = activeRole === item.role;
              return (
                <button
                  key={item.role}
                  data-active={isActive}
                  onClick={() => setActiveRole(item.role)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-2 shadow-xs font-semibold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  } ${item.color}`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                    <p className="text-[10px] text-slate-500 truncate leading-tight">{item.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
