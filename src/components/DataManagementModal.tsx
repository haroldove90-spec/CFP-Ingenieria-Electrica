import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Database, 
  Cloud, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Save, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { SupabaseSettings } from '../types';
import { 
  clearSampleData, 
  wipeAllReports, 
  restoreSampleData, 
  isDemoDataHidden, 
  setDemoDataHidden,
  getSupabaseSettings,
  saveSupabaseSettings,
  wipeSupabaseRecords,
  syncReportsToSupabase,
  getRevisionReports
} from '../utils/storage';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [hideDemoPreference, setHideDemoPreference] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseSettings>({
    url: '',
    anonKey: '',
    tableName: 'revisiones_electricas',
    connected: false,
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmWipeAll, setConfirmWipeAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHideDemoPreference(isDemoDataHidden());
      setSupabaseConfig(getSupabaseSettings());
      setStatusMessage(null);
      setConfirmWipeAll(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleHideDemo = (checked: boolean) => {
    setHideDemoPreference(checked);
    setDemoDataHidden(checked);
    if (checked) {
      clearSampleData();
      setStatusMessage({
        type: 'success',
        text: 'Preferencia guardada: El navegador ya NO volverá a mostrar los datos de muestra.',
      });
    } else {
      setStatusMessage({
        type: 'info',
        text: 'Preferencia desactivada. Puedes pulsar "Restaurar datos de muestra" si deseas cargarlos de nuevo.',
      });
    }
    onDataChanged();
  };

  const handleClearSampleData = () => {
    const result = clearSampleData();
    setStatusMessage({
      type: 'success',
      text: `Se eliminaron ${result.removedCount} registros de muestra. Quedan ${result.remainingCount} registros reales. Se ha activado la regla para no volver a mostrarlos.`,
    });
    setHideDemoPreference(true);
    onDataChanged();
  };

  const handleWipeAll = () => {
    wipeAllReports();
    setStatusMessage({
      type: 'success',
      text: 'Se han borrado absolutamente todos los informes locales del sistema.',
    });
    setConfirmWipeAll(false);
    onDataChanged();
  };

  const handleRestoreSample = () => {
    restoreSampleData();
    setHideDemoPreference(false);
    setStatusMessage({
      type: 'success',
      text: 'Datos de muestra restaurados con éxito para demostración y pruebas.',
    });
    onDataChanged();
  };

  const handleSaveSupabaseConfig = () => {
    saveSupabaseSettings(supabaseConfig);
    setStatusMessage({
      type: 'success',
      text: 'Configuración de conexión a Supabase guardada.',
    });
  };

  const handleWipeSupabase = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor ingresa la URL del proyecto y la anon key de Supabase.',
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Enviando solicitud de borrado a Supabase...' });
    
    const result = await wipeSupabaseRecords(supabaseConfig);
    setIsProcessing(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleSyncToSupabase = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor ingresa la URL del proyecto y la anon key de Supabase.',
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Sincronizando informes con Supabase...' });
    
    const reports = getRevisionReports();
    const result = await syncReportsToSupabase(reports, supabaseConfig);
    setIsProcessing(false);

    if (result.success) {
      setSupabaseConfig(prev => ({ ...prev, connected: true }));
      setStatusMessage({ type: 'success', text: result.message });
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Administración de Datos & Supabase</h3>
              <p className="text-xs text-slate-400">Control de datos de muestra y borrado en base de datos remota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          
          {/* Notification banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
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

          {/* SECTION 1: Control de Datos de Muestra y LocalStorage */}
          <div className="bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-700/60 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>Datos de Muestra y Memoria Local</span>
            </div>

            <p className="text-xs text-slate-400">
              Elimina los expedientes de demostración cargados por defecto en el sistema y bloquea su reaparición en este navegador.
            </p>

            {/* Toggle: Bloquear reaparición de datos de muestra */}
            <div className="flex items-center justify-between p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="pr-4">
                <span className="font-medium text-xs sm:text-sm text-white block">
                  No mostrar datos de muestra nuevamente
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Evita que el navegador vuelva a inicializar los reportes demo (Folio 359, etc.) tras recargar.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={hideDemoPreference}
                  onChange={(e) => handleToggleHideDemo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={handleClearSampleData}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                Borrar Datos de Muestra Ahora
              </button>

              <button
                onClick={handleRestoreSample}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar Muestra Demo
              </button>

              {!confirmWipeAll ? (
                <button
                  onClick={() => setConfirmWipeAll(true)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-medium transition cursor-pointer ml-auto"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Borrar Todo (Puro Limpio)
                </button>
              ) : (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-rose-400 font-bold">¿Seguro?</span>
                  <button
                    onClick={handleWipeAll}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmWipeAll(false)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Conexión y Borrado en Supabase */}
          <div className="bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>Integración con Supabase Cloud</span>
              </div>
              {supabaseConfig.connected && (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Conectado
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Al conectar tu proyecto de Supabase, puedes sincronizar informes periciales y ejecutar el borrado remoto de la tabla cuando sea necesario.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  URL del Proyecto Supabase
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseConfig.url}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nombre de Tabla
                </label>
                <input
                  type="text"
                  placeholder="revisiones_electricas"
                  value={supabaseConfig.tableName}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, tableName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">
                  Anon Key / Service Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseConfig.anonKey}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Supabase Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
              <button
                onClick={handleSaveSupabaseConfig}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Conexión
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncToSupabase}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  Sincronizar a Supabase
                </button>

                <button
                  onClick={handleWipeSupabase}
                  disabled={isProcessing}
                  title="Borra todos los registros en la tabla configurada de Supabase"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Borrar Registros en Supabase
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
