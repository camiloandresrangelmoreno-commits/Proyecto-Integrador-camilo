import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  FileText, 
  RotateCcw, 
  ShieldCheck, 
  BookOpen, 
  UserCheck, 
  Building2, 
  Users, 
  Compass, 
  Award,
  LogOut,
  LogIn,
  Database
} from 'lucide-react';
import { UserRole } from '../types';
import { PostgresModal } from './database/PostgresModal';

export const Navbar: React.FC = () => {
  const { currentUser, activeRole, setActiveTab, resetToDemoData, isAuthenticated, logout, dbStatus } = useApp();
  const [showDbModal, setShowDbModal] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    director: { 
      label: 'Director de Programa', 
      icon: <Award className="w-4 h-4" />, 
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
    },
    coordinador: { 
      label: 'Coordinador de Prácticas', 
      icon: <Users className="w-4 h-4" />, 
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
    },
    docente: { 
      label: 'Docente Asesor', 
      icon: <UserCheck className="w-4 h-4" />, 
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
    },
    estudiante: { 
      label: 'Estudiante Practicante', 
      icon: <GraduationCap className="w-4 h-4" />, 
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
    },
    institucion: { 
      label: 'Institución Receptora', 
      icon: <Building2 className="w-4 h-4" />, 
      color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
    }
  };

  return (
    <header className="bg-[#002855] text-white border-b border-[#003f7d] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Nombre UDI */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-extrabold shadow-md border border-white/20">
              <span className="text-xl tracking-tighter">UDI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  SIGPA
                  <span className="text-xs bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded uppercase">
                    UDI 2026
                  </span>
                </span>
              </div>
              <p className="text-xs text-blue-200 hidden sm:block">
                Sistema Integral de Gestión de Prácticas Académicas
              </p>
            </div>
          </div>

          {/* Indicador de Portal / Software */}
          <div className="hidden md:flex items-center gap-2 bg-[#001f42] px-3.5 py-1.5 rounded-xl border border-blue-900/60 text-xs font-semibold text-blue-200">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{isAuthenticated ? 'Plataforma de Prácticas Académicas' : 'Portal de Autenticación por Roles'}</span>
          </div>

          {/* Estado de Autenticación y Controles */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-blue-200/80">
                    {currentUser.facultyOrSchool}
                  </span>
                </div>

                {/* Badge de Rol con Icono */}
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleLabels[activeRole].color}`}>
                  {roleLabels[activeRole].icon}
                  <span className="truncate max-w-[130px]">{roleLabels[activeRole].label}</span>
                </div>

                {/* Botón Cerrar Sesión */}
                <button
                  onClick={logout}
                  title="Cerrar sesión y volver al portal de roles"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('app')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar por Roles</span>
              </button>
            )}

            {/* Badge de Base de Datos PostgreSQL */}
            <button
              onClick={() => setShowDbModal(true)}
              title="Configuración de Base de Datos PostgreSQL"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                dbStatus?.postgres?.ok
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {dbStatus?.postgres?.ok ? 'Postgres: Conectado' : 'PostgreSQL Cloud'}
              </span>
            </button>

            {/* Botón reiniciar Demo */}
            <button
              onClick={resetToDemoData}
              title="Restaurar datos de prueba iniciales"
              className="p-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Modal de Conexión a PostgreSQL */}
      {showDbModal && <PostgresModal isOpen={showDbModal} onClose={() => setShowDbModal(false)} />}
    </header>
  );
};

