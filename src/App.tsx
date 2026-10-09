import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginPortal } from './components/auth/LoginPortal';
import { RoleSwitcher } from './components/RoleSwitcher';
import { DirectorDashboard } from './components/director/DirectorDashboard';
import { CoordinatorModule } from './components/coordinator/CoordinatorModule';
import { TeacherModule } from './components/teacher/TeacherModule';
import { StudentModule } from './components/student/StudentModule';
import { InstitutionModule } from './components/institution/InstitutionModule';

const MainContent: React.FC = () => {
  const { activeRole, isAuthenticated } = useApp();

  // Si no ha iniciado sesión, mostrar la interfaz de inicio de sesión separada por roles
  if (!isAuthenticated) {
    return <LoginPortal />;
  }

  // Si está autenticado, mostrar el módulo exclusivo de su rol
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeRole === 'director' && <DirectorDashboard />}
      {activeRole === 'coordinador' && <CoordinatorModule />}
      {activeRole === 'docente' && <TeacherModule />}
      {activeRole === 'estudiante' && <StudentModule />}
      {activeRole === 'institucion' && <InstitutionModule />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        
        {/* Barra de alternancia de roles sólo cuando está autenticado para facilitar pruebas de jurados */}
        <RoleSwitcherWrapper />
        
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Footer Institucional UDI */}
        <footer className="bg-[#001f42] text-slate-400 text-xs py-6 border-t border-[#002d5f] mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                UDI
              </span>
              <div>
                <p className="font-bold text-white">
                  Universidad de Investigación y Desarrollo - UDI
                </p>
                <p className="text-[11px] text-slate-400">
                  Programa de Ingeniería de Sistemas | Proyecto Integrador II - 2026
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px]">
              <p className="text-slate-300">
                Cursos: <strong>Ingeniería del Software II</strong> | <strong>Programación III</strong> | <strong>Teoría General de Sistemas</strong>
              </p>
              <p className="text-slate-500 mt-0.5">
                Alineado con el Decreto 1075 de 2015 del MEN y lineamientos CNA
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

const RoleSwitcherWrapper: React.FC = () => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return null;
  return <RoleSwitcher />;
};
