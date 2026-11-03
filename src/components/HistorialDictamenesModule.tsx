import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Filter,
  ArrowRight,
  Layers,
  Award,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { FullDictamenExpediente, UserRole } from '../types';
import { FullDictamenViewerModal } from './FullDictamenViewerModal';
import { exportFull10PageDictamenToPdf } from '../utils/pdfExport';
import { CfpLogo } from './CfpLogo';

interface HistorialDictamenesModuleProps {
  dictamenes: FullDictamenExpediente[];
  activeRole: UserRole;
  onStartNewDictamen: () => void;
  onEditDictamen: (dictamen: FullDictamenExpediente) => void;
  onDeleteDictamen: (id: string) => void;
}

export const HistorialDictamenesModule: React.FC<HistorialDictamenesModuleProps> = ({
  dictamenes,
  activeRole,
  onStartNewDictamen,
  onEditDictamen,
  onDeleteDictamen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress'>('all');
  
  // Viewer Modal State
  const [selectedDictamenForView, setSelectedDictamenForView] = useState<FullDictamenExpediente | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Quick Direct Export state
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Filter list
  const filteredDictamenes = dictamenes.filter((d) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      (d.folio && d.folio.toLowerCase().includes(term)) ||
      (d.titularNombreComercial && d.titularNombreComercial.toLowerCase().includes(term)) ||
      (d.titularRazonSocial && d.titularRazonSocial.toLowerCase().includes(term)) ||
      (d.titularRfc && d.titularRfc.toLowerCase().includes(term)) ||
      (d.solicitanteNombre && d.solicitanteNombre.toLowerCase().includes(term)) ||
      (d.peritoNombre && d.peritoNombre.toLowerCase().includes(term)) ||
      (d.claveExpediente && d.claveExpediente.toLowerCase().includes(term));

    if (!matchSearch) return false;

    if (filterStatus === 'completed') return d.isCompleted;
    if (filterStatus === 'in_progress') return !d.isCompleted;
    return true;
  });

  const handleOpenViewer = (dictamen: FullDictamenExpediente) => {
    setSelectedDictamenForView(dictamen);
    setIsViewerOpen(true);
  };

  const handleDirectDownload = async (d: FullDictamenExpediente) => {
    setSelectedDictamenForView(d);
    setIsViewerOpen(true);
  };

  const handleDeleteConfirm = (id: string, folio: string, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar el Dictamen Folio #${folio} (${nombre})? Esta acción también lo eliminará de la base de datos Supabase.`)) {
      onDeleteDictamen(id);
    }
  };

  const completedCount = dictamenes.filter(d => d.isCompleted).length;
  const inProgressCount = dictamenes.filter(d => !d.isCompleted).length;

  return (
    <div className="space-y-6">
      
      {/* Top Institutional Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/80 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Módulo Maestro de Expedientes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Historial de Dictámenes Periciales
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Repositorio oficial de expedientes conformados por los 7 módulos normativos (10 páginas oficiales). Edite, visualice, guarde, actualice y descargue el PDF completo en cualquier momento.
          </p>
        </div>

        <button
          onClick={onStartNewDictamen}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer flex-shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+ Crear Nuevo Dictamen (Paso a Paso)</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Expedientes</span>
            <span className="text-2xl font-black text-slate-900">{dictamenes.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase block">Dictámenes Completos (10 Págs)</span>
            <span className="text-2xl font-black text-emerald-700">{completedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase block">En Proceso (Paso a Paso)</span>
            <span className="text-2xl font-black text-amber-600">{inProgressCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Folio, Cliente, RFC, Representante, Perito o Expediente..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Estado:</span>
          </span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({dictamenes.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Completos ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'in_progress'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            En Proceso ({inProgressCount})
          </button>
        </div>
      </div>

      {/* Dictámenes List */}
      {filteredDictamenes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-800">No se encontraron expedientes</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchTerm 
                ? 'No hay dictámenes que coincidan con los criterios de búsqueda ingresados.' 
                : 'Aún no se han generado dictámenes periciales en el sistema.'}
            </p>
          </div>
          <button
            onClick={onStartNewDictamen}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Comenzar Nuevo Dictamen</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDictamenes.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-sm sm:text-base border border-slate-800 flex items-center gap-1.5">
                    <span className="text-rose-500 font-black">FOLIO</span>
                    <span>#{d.folio}</span>
                  </div>

                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 uppercase tracking-tight">
                      {d.titularNombreComercial || 'Inmueble sin Asignar'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{d.claveExpediente}</span>
                      <span>•</span>
                      <span>{d.fecha}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {d.isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dictamen Completo (10/10 Páginas)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>En Proceso • Paso {d.stepProgress || 1} de 7</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Details in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Razón Social y RFC</span>
                  <span className="font-bold text-slate-900 block truncate">{d.titularRazonSocial || 'N/A'}</span>
                  <span className="font-mono text-slate-600 block">{d.titularRfc || 'Sin RFC'}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Ubicación</span>
                  <span className="text-slate-800 block truncate">{d.titularCalleNumero}, {d.titularColonia}</span>
                  <span className="text-slate-600 font-bold block">{d.titularCiudadEstado}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Solicitante</span>
                  <span className="font-bold text-slate-900 block truncate">{d.solicitanteNombre || 'N/A'}</span>
                  <span className="font-mono text-slate-600 block">Tel: {d.solicitanteTelefono || 'N/A'}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Perito Dictaminador</span>
                  <span className="font-bold text-slate-900 block truncate">{d.peritoNombre}</span>
                  <span className="font-mono text-slate-600 block">Cédula: {d.peritoCedula}</span>
                </div>
              </div>

              {/* 7 Modules Progress Overview Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
                  <span>Conformación de los 7 Módulos Oficiales:</span>
                  <span className="font-mono">
                    {d.isCompleted ? '7 de 7 módulos completados' : `Módulos 1 a ${d.stepProgress || 1} guardados`}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[
                    { num: 1, label: '1. Revisión P.1' },
                    { num: 2, label: '2. Solicitud P.2' },
                    { num: 3, label: '3. Eval. Seg. P.3-6' },
                    { num: 4, label: '4. Mediciones P.7' },
                    { num: 5, label: '5. Diagrama P.8' },
                    { num: 6, label: '6. Cédula P.9' },
                    { num: 7, label: '7. Certificado P.10' },
                  ].map((step) => {
                    const isDone = d.isCompleted || step.num <= (d.stepProgress || 1);
                    return (
                      <div
                        key={step.num}
                        className={`text-center py-1 px-1 rounded text-[9.5px] font-bold border transition ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                        title={step.label}
                      >
                        <span className="block truncate">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenViewer(d)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Ver Dictamen Completo (10 Págs)</span>
                  </button>

                  <button
                    onClick={() => handleDirectDownload(d)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar PDF Completo</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditDictamen(d)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{d.isCompleted ? 'Editar / Actualizar' : 'Continuar Llenado ➔'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteConfirm(d.id, d.folio, d.titularNombreComercial)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
                    title="Eliminar este expediente de la memoria y de Supabase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 10-Page Viewer & Exporter Modal */}
      <FullDictamenViewerModal
        dictamen={selectedDictamenForView}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDictamenForView(null);
        }}
        onEdit={(d) => {
          onEditDictamen(d);
        }}
      />

    </div>
  );
};
