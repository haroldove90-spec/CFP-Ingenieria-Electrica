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
  Info,
  TableProperties,
  AlertCircle
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
  deleteRevisionReport,
  checkAllSupabaseTables,
  syncAllModulesToSupabase,
  SupabaseTableStatus,
  clearSampleDataFromSupabase,
  loadAllFromSupabase
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

  // Status of all 8 tables in Supabase
  const [tablesStatus, setTablesStatus] = useState<SupabaseTableStatus[]>([]);
  const [isCheckingTables, setIsCheckingTables] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Direct records selection in this view
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  const fetchTablesStatus = async () => {
    setIsCheckingTables(true);
    const results = await checkAllSupabaseTables(config);
    setTablesStatus(results);
    setIsCheckingTables(false);
  };

  useEffect(() => {
    setConfig(getSupabaseSettings());
    setHideDemo(isDemoDataHidden());
    fetchTablesStatus();
  }, []);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
      setStatusMessage({
        type: 'success',
        text: '¡Script SQL de las 8 tablas copiado! Pégalo en el SQL Editor de Supabase y presiona RUN.',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Selecciona el texto del recuadro inferior y presiona Ctrl+C para copiar.',
      });
    }
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'supabase_schema_8_tablas_cfp.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({
      type: 'success',
      text: 'Archivo supabase_schema_8_tablas_cfp.sql descargado exitosamente.',
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage({ type: 'info', text: 'Probando conectividad y verificando tablas en Supabase...' });
    const result = await testSupabaseConnection(config);
    await fetchTablesStatus();
    setIsTesting(false);

    if (result.success) {
      setConfig(prev => ({ ...prev, connected: true }));
      setStatusMessage({
        type: 'success',
        text: result.message,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }
  };

  const handleSyncAllModules = async () => {
    setIsSyncingAll(true);
    setStatusMessage({ type: 'info', text: 'Sincronizando todos los 8 módulos locales con Supabase...' });
    const res = await syncAllModulesToSupabase(config);
    setIsSyncingAll(false);
    await fetchTablesStatus();

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `${res.message} (${res.details.join(', ')})`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleToggleHideDemo = async (checked: boolean) => {
    setHideDemo(checked);
    setDemoDataHidden(checked);
    if (checked) {
      setIsProcessing(true);
      await clearSampleDataFromSupabase(config);
      clearSampleData();
      setIsProcessing(false);
      await fetchTablesStatus();
      setStatusMessage({
        type: 'success',
        text: 'Preferencia activada: Se purgaron los datos de muestra en Supabase y localmente. El sistema operará solo con datos reales.',
      });
    } else {
      setStatusMessage({
        type: 'info',
        text: 'Preferencia desactivada. Ahora puedes restaurar los datos de muestra si lo requieres.',
      });
    }
    onDataChanged();
  };

  const handleClearSample = async () => {
    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Purgando registros de muestra en las 9 tablas de Supabase y localmente...' });
    await clearSampleDataFromSupabase(config);
    const res = clearSampleData();
    setIsProcessing(false);
    setHideDemo(true);
    await fetchTablesStatus();
    setStatusMessage({
      type: 'success',
      text: `Se purgaron los registros de muestra en las 9 tablas de Supabase y localmente (${res.removedCount} registros). No volverán a reaparecer.`,
    });
    onDataChanged();
  };

  const handlePullFromSupabase = async () => {
    if (!config.url || !config.anonKey) {
      setStatusMessage({ type: 'error', text: 'Supabase no configurado.' });
      return;
    }
    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Descargando registros actualizados desde Supabase...' });
    const res = await loadAllFromSupabase(config);
    setIsProcessing(false);
    await fetchTablesStatus();
    if (res.success) {
      setStatusMessage({ type: 'success', text: '¡Datos sincronizados desde Supabase exitosamente!' });
      onDataChanged();
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
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
    await fetchTablesStatus();
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
    await fetchTablesStatus();
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

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
    
    deleteRevisionReports(selectedRecordIds);
    await deleteReportsFromSupabase(selectedRecordIds, config);
    
    setSelectedRecordIds([]);
    setIsDeletingSelected(false);
    onDataChanged();
    await fetchTablesStatus();
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
    await fetchTablesStatus();
    setStatusMessage({
      type: 'success',
      text: `Folio #${report.folio} eliminado localmente y en Supabase.`,
    });
  };

  const missingTablesCount = tablesStatus.filter(t => !t.exists).length;

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
                PostgreSQL Cloud
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Proyecto: <span className="text-cyan-300 font-bold">{config.projectName || "are.com's Project"}</span> • ID: <span className="font-mono text-slate-300">{config.projectId || 'ggxliydxwcylilanitzk'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          <button
            onClick={fetchTablesStatus}
            disabled={isCheckingTables}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingTables ? 'animate-spin' : ''}`} />
            <span>Verificar Tablas</span>
          </button>

          <button
            onClick={handlePullFromSupabase}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
            title="Cargar y descargar los registros más recientes desde Supabase"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar de Supabase</span>
          </button>

          <button
            onClick={handleSyncAllModules}
            disabled={isSyncingAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>Sincronizar a Supabase</span>
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

      {/* SECTION 1: ESTADO EN VIVO DE LAS 8 TABLAS EN SUPABASE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <TableProperties className="w-4 h-4 text-cyan-600" />
            <span>Estado en Tiempo Real de las 8 Tablas en Supabase</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {tablesStatus.filter(t => t.exists).length} de 8 tablas creadas en la nube
          </span>
        </div>

        {missingTablesCount > 0 && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                ¡Faltan {missingTablesCount} tablas por crear en Supabase!
              </span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Actualmente tu base de datos tiene tablas pendientes por crear. Para que los módulos de <strong>Solicitudes, Condiciones Operativas, Evaluaciones (Pág 5-8), Mediciones (Pág 9), Diagramas Unifilares, Cédula, Certificado y Agenda de Citas</strong> también guarden sus registros en Supabase, copia el script SQL de abajo y ejecútalo en el SQL Editor de tu consola de Supabase.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tablesStatus.map((t) => (
            <div 
              key={t.tableName}
              className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                t.exists 
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                  : 'bg-rose-50/50 border-rose-200 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs truncate" title={t.name}>{t.name}</span>
                  {t.exists ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full flex-shrink-0">
                      Falta crear
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11px] text-slate-500 truncate" title={t.tableName}>
                  {t.tableName}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1" title={t.description}>
                  {t.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Registros:</span>
                <span className="font-bold font-mono">
                  {t.exists ? t.count : 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SCRIPT SQL COMPLETO LISTO PARA EJECUTAR EN SUPABASE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>Script SQL Completo (Las 8 Tablas + Políticas RLS + Datos de Muestra)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
            >
              {copiedSql ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? '¡Copiado!' : 'Copiar Script SQL Completo'}</span>
            </button>

            <button
              onClick={handleDownloadSql}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .sql</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">✓ Script oficial multi-tabla con migraciones automáticas y Agenda de Citas</span>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Este script actualizado contiene migraciones automáticas <code>ALTER TABLE ADD COLUMN IF NOT EXISTS</code> para las 9 tablas oficiales (incluyendo la nueva tabla <code>agenda_citas</code>). Agrega de forma segura los campos necesarios y actualiza los registros sin conflictos. Simplemente haz clic en <strong>&quot;Copiar Script SQL Completo&quot;</strong> y ejecútalo con <strong>RUN</strong> en tu SQL Editor de Supabase.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Este script crea todas las tablas faltantes, habilita los permisos de lectura y escritura para la clave anónima (RLS), y precarga los datos de muestra oficiales de cada módulo. Puedes ejecutarlo con total seguridad ya que utiliza cláusulas <code>IF NOT EXISTS</code> y no borrará tus datos existentes de <code>revisiones_electricas</code>:
        </p>

        <div className="relative">
          <pre className="p-4 bg-slate-950 text-cyan-300 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800 max-h-72 select-all shadow-inner">
{SUPABASE_SQL_SCHEMA}
          </pre>
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              PostgreSQL 9 Tablas
            </span>
          </div>
        </div>

        <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs text-cyan-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Pasos para ejecutarlo en Supabase:</span>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-cyan-800">
              <li>Haz clic en el botón naranja <strong>"Copiar Script SQL Completo"</strong>.</li>
              <li>Abre tu consola de Supabase en <strong>are.com's Project</strong> (ID: <code>ggxliydxwcylilanitzk</code>).</li>
              <li>Entra a la sección <strong>SQL Editor</strong> en la barra lateral izquierda.</li>
              <li>Pega el código copiado y haz clic en <strong>"RUN"</strong> (Ejecutar).</li>
              <li>Al terminar, regresa aquí y presiona <strong>"Verificar Tablas"</strong> para comprobar que las 8 tablas quedaron activas.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* SECTION 3: PARÁMETROS DE CONEXIÓN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Cloud className="w-4 h-4 text-cyan-600" />
            <span>Configuración y Parámetros del Proyecto</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Auto-Sincronización en Tiempo Real Activa
          </span>
        </div>

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
              Tabla de Dictámenes
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
              Clave Anon / API Key de Supabase
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

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-600" />
            Guardar Parámetros
          </button>

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Probar Conexión con Supabase</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: GESTIÓN Y BORRADO DE REGISTROS */}
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
            <span>Restaurar Muestras Oficiales</span>
          </button>

          {!confirmWipeLocal ? (
            <button
              onClick={() => setConfirmWipeLocal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar Almacenamiento Local</span>
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
