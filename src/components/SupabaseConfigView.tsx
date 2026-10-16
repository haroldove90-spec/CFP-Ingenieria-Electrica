import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Save, 
  Database,
  Cloud,
  FileCheck,
  ShieldCheck,
  Copy
} from 'lucide-react';
import { SupabaseSettings, RevisionReport } from '../types';
import { 
  getSupabaseSettings, 
  saveSupabaseSettings, 
  wipeSupabaseRecords, 
  syncReportsToSupabase,
  clearSampleData,
  restoreSampleData,
  isDemoDataHidden,
  setDemoDataHidden,
  wipeAllReports
} from '../utils/storage';

interface SupabaseConfigViewProps {
  reports: RevisionReport[];
  onDataChanged: () => void;
}

export const SupabaseConfigView: React.FC<SupabaseConfigViewProps> = ({
  reports,
  onDataChanged,
}) => {
  const [config, setConfig] = useState<SupabaseSettings>({
    url: '',
    anonKey: '',
    tableName: 'revisiones_electricas',
    connected: false,
  });
  const [hideDemo, setHideDemo] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmWipeSupabase, setConfirmWipeSupabase] = useState(false);
  const [confirmWipeLocal, setConfirmWipeLocal] = useState(false);

  useEffect(() => {
    setConfig(getSupabaseSettings());
    setHideDemo(isDemoDataHidden());
  }, []);

  const handleToggleHideDemo = (checked: boolean) => {
    setHideDemo(checked);
    setDemoDataHidden(checked);
    if (checked) {
      clearSampleData();
      setStatusMessage({
        type: 'success',
        text: 'Preferencia activada: El navegador ya no volverá a mostrar los datos de muestra en ninguna sesión.',
      });
    } else {
      setStatusMessage({
        type: 'info',
        text: 'Preferencia desactivada. Ahora puedes restaurar los datos de muestra si lo requieres.',
      });
    }
    onDataChanged();
  };

  const handleClearSample = () => {
    const res = clearSampleData();
    setHideDemo(true);
    setStatusMessage({
      type: 'success',
      text: `Se purgaron ${res.removedCount} registros de muestra. Se conservan ${res.remainingCount} registros reales del usuario.`,
    });
    onDataChanged();
  };

  const handleRestoreSample = () => {
    restoreSampleData();
    setHideDemo(false);
    setStatusMessage({
      type: 'success',
      text: 'Datos de muestra restaurados para auditoría y pruebas.',
    });
    onDataChanged();
  };

  const handleWipeLocalAll = () => {
    wipeAllReports();
    setStatusMessage({
      type: 'success',
      text: 'Todos los registros locales han sido eliminados por completo.',
    });
    setConfirmWipeLocal(false);
    onDataChanged();
  };

  const handleSaveConfig = () => {
    saveSupabaseSettings(config);
    setStatusMessage({
      type: 'success',
      text: 'Configuración de conexión a Supabase guardada exitosamente.',
    });
  };

  const handleSyncToSupabase = async () => {
    if (!config.url || !config.anonKey) {
      setStatusMessage({
        type: 'error',
        text: 'Ingrese la URL y Anon Key de Supabase para poder sincronizar.',
      });
      return;
    }
    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Conectando y sincronizando con Supabase...' });
    const res = await syncReportsToSupabase(reports, config);
    setIsProcessing(false);
    if (res.success) {
      setConfig(prev => ({ ...prev, connected: true }));
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleWipeSupabaseTable = async () => {
    if (!config.url || !config.anonKey) {
      setStatusMessage({
        type: 'error',
        text: 'Ingrese la URL y Anon Key de Supabase antes de ejecutar el borrado.',
      });
      return;
    }
    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Ejecutando DELETE remoto en Supabase...' });
    const res = await wipeSupabaseRecords(config);
    setIsProcessing(false);
    setConfirmWipeSupabase(false);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              Administración de Base de Datos & Supabase
            </h2>
            <p className="text-xs text-slate-400">
              Control de datos de muestra, persistencia en el navegador y sincronización remota
            </p>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : statusMessage.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" />
          )}
          <div className="flex-1">{statusMessage.text}</div>
        </div>
      )}

      {/* SECTION 1: Control de Datos de Muestra y Regla de Navegador */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Database className="w-4 h-4 text-amber-500" />
          <span>Control de Datos de Muestra (Demostración)</span>
        </div>

        <p className="text-xs text-slate-600">
          Usa estas opciones para limpiar los dictámenes de prueba iniciales (Folio 359, etc.) y configurar el navegador para que opere exclusivamente con datos reales de inspección.
        </p>

        {/* Persistent Toggle */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="pr-4">
            <span className="font-bold text-xs sm:text-sm text-slate-900 block">
              Bloquear datos de muestra en este navegador permanentemente
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              Al activar esta opción, el sistema no volverá a inyectar datos de demostración nunca más en este dispositivo.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={hideDemo}
              onChange={(e) => handleToggleHideDemo(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            onClick={handleClearSample}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Borrar Datos de Muestra Ahora
          </button>

          <button
            onClick={handleRestoreSample}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Muestra de Prueba
          </button>

          {!confirmWipeLocal ? (
            <button
              onClick={() => setConfirmWipeLocal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Borrar Todo el Almacenamiento Local
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-auto bg-rose-50 p-1.5 rounded-xl border border-rose-200">
              <span className="text-xs text-rose-700 font-bold">¿Eliminar todos los reportes?</span>
              <button
                onClick={handleWipeLocalAll}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs"
              >
                Sí, Borrar
              </button>
              <button
                onClick={() => setConfirmWipeLocal(false)}
                className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Conexión y Borrado en Supabase */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Cloud className="w-4 h-4 text-cyan-600" />
            <span>Configuración de Base de Datos Supabase</span>
          </div>
          {config.connected && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Conectado & Sincronizado
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600">
          Conecta con tu base de datos PostgreSQL en Supabase para almacenar en la nube los dictámenes periciales y ejecutar operaciones de borrado remoto cuando se requiera.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              URL del Proyecto Supabase
            </label>
            <input
              type="text"
              placeholder="https://xyzabcdefg.supabase.co"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Nombre de la Tabla
            </label>
            <input
              type="text"
              placeholder="revisiones_electricas"
              value={config.tableName}
              onChange={(e) => setConfig({ ...config, tableName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-bold mb-1">
              Clave Anon / API Key de Supabase
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* SQL Schema helper guide */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 block">Estructura SQL de tabla sugerida en Supabase:</span>
          <pre className="p-2 bg-slate-900 text-cyan-300 rounded overflow-x-auto text-[10px] font-mono select-all">
{`CREATE TABLE revisiones_electricas (
  id TEXT PRIMARY KEY,
  folio TEXT NOT NULL,
  claveExpediente TEXT,
  fecha TEXT,
  tipoInstalacionPrincipal TEXT,
  giroInstalacion TEXT,
  tensionSuministro TEXT,
  clasificacionInstalacion TEXT,
  tipoServicio TEXT,
  capacidadSubestacionKva NUMERIC,
  cargaInstaladaKw NUMERIC,
  titularNombreComercial TEXT,
  titularRazonSocial TEXT,
  titularRfc TEXT,
  titularCalleNumero TEXT,
  titularColonia TEXT,
  titularMunicipio TEXT,
  titularCiudadEstado TEXT,
  titularCodigoPostal TEXT,
  titularTelefono TEXT,
  solicitanteNombre TEXT,
  solicitanteTelefono TEXT,
  peritoNombre TEXT,
  peritoAfiliacion TEXT,
  peritoCedula TEXT,
  peritoEmail TEXT,
  peritoTelefono TEXT,
  resultadoDictamen TEXT,
  observaciones TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
          </pre>
        </div>

        {/* Supabase Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-600" />
            Guardar Configuración
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToSupabase}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              Sincronizar a Supabase ({reports.length})
            </button>

            {!confirmWipeSupabase ? (
              <button
                onClick={() => setConfirmWipeSupabase(true)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Borrar Registros en Supabase
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-100 p-1.5 rounded-xl border border-rose-300">
                <span className="text-xs text-rose-800 font-bold">¿Borrar en Supabase?</span>
                <button
                  onClick={handleWipeSupabaseTable}
                  className="px-3 py-1 bg-rose-700 text-white font-bold rounded-lg text-xs"
                >
                  Confirmar Borrado
                </button>
                <button
                  onClick={() => setConfirmWipeSupabase(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
