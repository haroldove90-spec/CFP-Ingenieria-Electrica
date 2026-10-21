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
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Zap,
  Info
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
  wipeAllReports,
  testSupabaseConnection,
  deleteReportsFromSupabase,
  deleteRevisionReports,
  deleteRevisionReport
} from '../utils/storage';
import { SUPABASE_SQL_SCHEMA } from '../utils/supabaseSql';

interface SupabaseConfigViewProps {
  reports: RevisionReport[];
  onDataChanged: () => void;
}

export const SupabaseConfigView: React.FC<SupabaseConfigViewProps> = ({
  reports,
  onDataChanged,
}) => {
  const [config, setConfig] = useState<SupabaseSettings>(() => getSupabaseSettings());
  const [hideDemo, setHideDemo] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [confirmWipeSupabase, setConfirmWipeSupabase] = useState(false);
  const [confirmWipeLocal, setConfirmWipeLocal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Direct records selection in this view
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  useEffect(() => {
    setConfig(getSupabaseSettings());
    setHideDemo(isDemoDataHidden());
  }, []);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
      setStatusMessage({
        type: 'success',
        text: 'Script SQL completo copiado al portapapeles. Pégalo directamente en el SQL Editor de Supabase y haz clic en RUN.',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'No se pudo copiar automáticamente. Puedes seleccionar el texto del cuadro inferior y copiarlo con Ctrl+C.',
      });
    }
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'supabase_schema_datos_muestra_cfp.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({
      type: 'success',
      text: 'Archivo supabase_schema_datos_muestra_cfp.sql descargado exitosamente.',
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage({ type: 'info', text: 'Probando conectividad con el proyecto de Supabase...' });
    const result = await testSupabaseConnection(config);
    setIsTesting(false);

    if (result.success) {
      if (result.tableExists) {
        setConfig(prev => ({ ...prev, connected: true }));
        setStatusMessage({
          type: 'success',
          text: '¡Conexión verificada con Supabase! La tabla `revisiones_electricas` existe y está lista para operaciones.',
        });
      } else {
        setStatusMessage({
          type: 'info',
          text: result.message,
        });
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }
  };

  const handleToggleHideDemo = (checked: boolean) => {
    setHideDemo(checked);
    setDemoDataHidden(checked);
    if (checked) {
      clearSampleData();
      setStatusMessage({
        type: 'success',
        text: 'Preferencia activada: Se purgaron los datos de muestra y el navegador operará solo con datos reales.',
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
      text: 'Datos de muestra oficiales (Folio 359, 360, 361) restaurados correctamente.',
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
    setSelectedRecordIds([]);
    onDataChanged();
  };

  const handleSaveConfig = () => {
    saveSupabaseSettings(config);
    setStatusMessage({
      type: 'success',
      text: 'Parámetros del proyecto Supabase guardados exitosamente.',
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
    setStatusMessage({ type: 'info', text: 'Sincronizando registros con Supabase...' });
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
        text: 'Configure la URL y Anon Key de Supabase antes de ejecutar el borrado.',
      });
      return;
    }
    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Ejecutando DELETE en la tabla de Supabase...' });
    const res = await wipeSupabaseRecords(config);
    setIsProcessing(false);
    setConfirmWipeSupabase(false);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  // Direct table row toggle
  const handleToggleSelectRow = (id: string) => {
    setSelectedRecordIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllRows = () => {
    if (selectedRecordIds.length === reports.length) {
      setSelectedRecordIds([]);
    } else {
      setSelectedRecordIds(reports.map(r => r.id));
    }
  };

  const handleDeleteSelectedRecords = async () => {
    if (selectedRecordIds.length === 0) return;
    if (!confirm(`¿Eliminar los ${selectedRecordIds.length} registros seleccionados (localmente y en Supabase)?`)) {
      return;
    }
    setIsDeletingSelected(true);
    const count = selectedRecordIds.length;
    
    // Delete local
    deleteRevisionReports(selectedRecordIds);
    // Delete in Supabase
    await deleteReportsFromSupabase(selectedRecordIds, config);
    
    setSelectedRecordIds([]);
    setIsDeletingSelected(false);
    onDataChanged();
    setStatusMessage({
      type: 'success',
      text: `Se eliminaron ${count} registro(s) exitosamente de la base de datos local y remota.`,
    });
  };

  const handleDeleteSingle = async (report: RevisionReport) => {
    if (!confirm(`¿Eliminar reporte Folio #${report.folio} (${report.titularNombreComercial})?`)) return;
    deleteRevisionReport(report.id);
    await deleteReportsFromSupabase([report.id], config);
    setSelectedRecordIds(prev => prev.filter(id => id !== report.id));
    onDataChanged();
    setStatusMessage({
      type: 'success',
      text: `Folio #${report.folio} eliminado localmente y en Supabase.`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                Supabase & Gestión de Base de Datos
              </h2>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
                PostgreSQL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Proyecto: <span className="text-cyan-300 font-bold">{config.projectName || "are.com's Project"}</span> (ID: <span className="font-mono text-slate-300">{config.projectId || 'ggxliydxwcylilanitzk'}</span>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl text-xs transition cursor-pointer border border-cyan-500/30"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Probar Conexión</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm animate-in fade-in duration-150 ${
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
          <div className="flex-1 font-medium">{statusMessage.text}</div>
          <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100">
            &times;
          </button>
        </div>
      )}

      {/* SECTION 1: Configuración de Conexión a Supabase */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Cloud className="w-4 h-4 text-cyan-600" />
            <span>Credenciales y Conexión de Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Auto-Sincronización Activa
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Los parámetros de tu proyecto de Supabase (<strong className="text-slate-800">are.com's Project</strong>) ya han sido configurados. Cada vez que crees o edites un dictamen en el sistema, se guarda automáticamente en el almacenamiento local y se envía a Supabase en tiempo real.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              value={config.projectName || "are.com's Project"}
              onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              ID del Proyecto
            </label>
            <input
              type="text"
              value={config.projectId || 'ggxliydxwcylilanitzk'}
              onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Tabla Principal
            </label>
            <input
              type="text"
              value={config.tableName || 'revisiones_electricas'}
              onChange={(e) => setConfig({ ...config, tableName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-slate-700 font-bold mb-1">
              URL Base de Supabase
            </label>
            <input
              type="text"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              placeholder="https://ggxliydxwcylilanitzk.supabase.co"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-slate-700 font-bold mb-1">
              Clave Anon / API Key Pública de Supabase
            </label>
            <input
              type="password"
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-600" />
            Guardar Parámetros
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncToSupabase}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              Sincronizar Todo a Supabase ({reports.length})
            </button>

            {!confirmWipeSupabase ? (
              <button
                onClick={() => setConfirmWipeSupabase(true)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar Tabla en Supabase
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-100 p-1.5 rounded-xl border border-rose-300">
                <span className="text-xs text-rose-800 font-bold">¿Borrar todos en Supabase?</span>
                <button
                  onClick={handleWipeSupabaseTable}
                  className="px-3 py-1 bg-rose-700 text-white font-bold rounded-lg text-xs"
                >
                  Confirmar
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

      {/* SECTION 2: SQL Script Listo para Correr con Datos de Muestra */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>Script SQL para Supabase (Tabla + RLS + Datos de Muestra Oficiales)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? '¡Copiado!' : 'Copiar Script SQL'}</span>
            </button>

            <button
              onClick={handleDownloadSql}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .sql</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Copia y ejecuta este script en el <strong>SQL Editor</strong> de Supabase para crear la tabla <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-700 font-bold">revisiones_electricas</code>, configurar los permisos públicos (RLS) e insertar de una vez los datos de muestra iniciales (Folio 359, 360 y 361):
        </p>

        <div className="relative">
          <pre className="p-4 bg-slate-950 text-cyan-300 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800 max-h-72 select-all shadow-inner">
{SUPABASE_SQL_SCHEMA}
          </pre>
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              PostgreSQL
            </span>
          </div>
        </div>

        <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs text-cyan-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Instrucciones rápidas en Supabase:</span>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-cyan-800">
              <li>Haz clic en el botón naranja <strong>"Copiar Script SQL"</strong> de arriba.</li>
              <li>Abre tu consola de Supabase en el proyecto <strong>are.com's Project</strong> (ID: <code>ggxliydxwcylilanitzk</code>).</li>
              <li>Ve a la pestaña <strong>SQL Editor</strong> en la barra lateral izquierda de Supabase.</li>
              <li>Pega el script y haz clic en <strong>"RUN"</strong> (Ejecutar).</li>
            </ol>
          </div>
        </div>
      </div>

      {/* SECTION 3: Control y Borrado Selectivo / Masivo de Registros */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Database className="w-4 h-4 text-rose-500" />
            <span>Eliminación Selectiva y Masiva de Registros (Local y Supabase)</span>
          </div>

          {selectedRecordIds.length > 0 && (
            <button
              onClick={handleDeleteSelectedRecords}
              disabled={isDeletingSelected}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar Seleccionados ({selectedRecordIds.length})</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600">
          Puedes seleccionar uno, varios o todos los registros para borrarlos en el momento deseado. Al borrarlos aquí, se eliminarán tanto del almacenamiento local como de Supabase si está conectado:
        </p>

        {/* Table of records */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos los registros para eliminación"
                    checked={reports.length > 0 && selectedRecordIds.length === reports.length}
                    onChange={handleToggleSelectAllRows}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-500"
                  />
                </th>
                <th className="py-2.5 px-3">Folio</th>
                <th className="py-2.5 px-3">Titular / Empresa</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reports.map((report) => {
                const isSelected = selectedRecordIds.includes(report.id);
                return (
                  <tr
                    key={report.id}
                    className={`hover:bg-slate-50 transition ${
                      isSelected ? 'bg-rose-50/60' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Seleccionar reporte folio ${report.folio} para eliminación`}
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(report.id)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-500"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-600">
                      #{report.folio}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {report.titularNombreComercial}
                    </td>
                    <td className="py-2.5 px-3">
                      {report.esMuestra ? (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Dato de Muestra
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Registro de Usuario
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {report.fecha}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteSingle(report)}
                        className="p-1 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Borrar este registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No hay registros en la base de datos actualmente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={handleClearSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Borrar Todos los Datos de Muestra</span>
          </button>

          <button
            onClick={handleRestoreSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Muestras Oficiales (Folios 359, 360, 361)</span>
          </button>

          {!confirmWipeLocal ? (
            <button
              onClick={() => setConfirmWipeLocal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar Todo el Almacenamiento Local</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-auto bg-rose-50 p-1 rounded-xl border border-rose-200">
              <span className="text-xs text-rose-700 font-bold">¿Borrar absolutamente todo?</span>
              <button
                onClick={handleWipeLocalAll}
                className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs"
              >
                Sí, Borrar Todo
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

    </div>
  );
};
