import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Sparkles,
  Play
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PostgresModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { dbStatus, checkDbStatus } = useApp();
  const [isTesting, setIsTesting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initResult, setInitResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setInitResult(null);
    await checkDbStatus();
    setIsTesting(false);
  };

  const handleInitDatabase = async () => {
    setIsInitializing(true);
    setInitResult(null);
    const result = await apiService.setupDatabase();
    setInitResult(result);
    setIsInitializing(false);
    await checkDbStatus();
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`DATABASE_URL="postgresql://usuario:contraseña@ep-xyz.us-east-2.aws.neon.tech/sigpa_udi?sslmode=require"
PORT=3000`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Conexión del Sistema a PostgreSQL & Node.js Express
              </h3>
              <p className="text-xs text-slate-500">
                Arquitectura cliente-servidor para almacenar estudiantes, bitácoras y convenios en la nube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Tarjeta de Estado Actual */}
          <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
            dbStatus?.postgres?.ok 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-start gap-3">
              {dbStatus?.postgres?.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {dbStatus?.postgres?.ok ? '¡Conectado a PostgreSQL en la Nube!' : 'Modo Almacenamiento Local Activo'}
                </h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">
                  {dbStatus?.postgres?.message || 'Servidor Express corriendo en Node.js con fallback reactivo en localStorage.'}
                </p>
                {dbStatus?.postgres?.details && (
                  <div className="mt-2 text-[11px] font-mono bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                    <p>Base de datos: <strong>{dbStatus.postgres.details.database}</strong></p>
                    <p>Hora del servidor: {dbStatus.postgres.details.serverTime}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 rounded-xl font-bold text-slate-800 flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Probando...' : 'Revisar Conexión'}</span>
            </button>
          </div>

          {/* Guía en 3 Pasos para Conectar a PostgreSQL en la Nube */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>¿Cómo conectar el código a tu base de datos en 3 pasos?</span>
            </h4>

            {/* Paso 1 */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
                <span>Crear la Base de Datos Gratis (Recomendado: Neon.tech o Supabase)</span>
              </div>
              <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                Entra a <strong>neon.tech</strong> o <strong>supabase.com</strong>, crea un proyecto gratis llamado <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">sigpa_udi</code> y copia la cadena de conexión <code className="font-mono">DATABASE_URL</code> que te entregan.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">2</span>
                  <span>Pegar tu variable DATABASE_URL en el archivo .env</span>
                </div>
                <button
                  onClick={handleCopyEnv}
                  className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copiado' : 'Copiar formato'}</span>
                </button>
              </div>
              <pre className="p-2 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
{`DATABASE_URL="postgresql://usuario:contraseña@ep-xyz.us-east-2.aws.neon.tech/sigpa_udi?sslmode=require"`}
              </pre>
            </div>

            {/* Paso 3 */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">3</span>
                  <span>Crear las Tablas en PostgreSQL automáticamente</span>
                </div>
                {dbStatus?.postgres?.ok && (
                  <button
                    onClick={handleInitDatabase}
                    disabled={isInitializing}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>{isInitializing ? 'Creando tablas...' : 'Inicializar Tablas'}</span>
                  </button>
                )}
              </div>
              <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                El archivo <strong className="text-blue-700 font-mono">database.sql</strong> en la raíz del proyecto contiene todas las tablas: roles, usuarios, instituciones, asignaciones, bitácoras y rúbricas. Puedes pegarlo en el editor SQL de Neon/Supabase o pulsar el botón superior si ya conectaste la URL.
              </p>

              {initResult && (
                <div className={`mt-2 p-2.5 rounded-xl text-[11px] ${
                  initResult.ok ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                }`}>
                  {initResult.message || initResult.error}
                </div>
              )}
            </div>

          </div>

          {/* Cómo usarlo en Visual Studio Code con Nodemon */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Terminal className="w-4 h-4" />
              <span>Ejecución en Visual Studio Code con Nodemon & Node + Express:</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              En la terminal integrada de VS Code (<code className="font-mono text-emerald-400">Ctrl + ~</code>):
            </p>
            <div className="p-2.5 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1">
              <p><span className="text-slate-500"># Instalar librerías:</span> npm install</p>
              <p><span className="text-slate-500"># Iniciar servidor completo (React + Express):</span> npm run dev</p>
              <p><span className="text-slate-500"># O iniciar con nodemon y recarga automática de servidor:</span> npm run server</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
