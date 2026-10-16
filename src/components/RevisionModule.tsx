import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Printer, 
  Download,
  Search, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  PenTool,
  ShieldCheck, 
  AlertCircle,
  FileCheck,
  Save,
  X,
  Layers,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { RevisionReport, UserRole } from '../types';
import { generateQrMatrixSvg } from '../utils/barcode';
import { exportDocumentToPdf } from '../utils/pdfExport';
import { SignatureModal } from './SignatureModal';
import { CfpLogo } from './CfpLogo';

interface RevisionModuleProps {
  reports: RevisionReport[];
  activeRole: UserRole;
  onSaveReport: (report: RevisionReport) => void;
  onDeleteReport: (id: string) => void;
  initialMode?: 'document' | 'form' | 'list';
  autoCreate?: boolean;
}

export const RevisionModule: React.FC<RevisionModuleProps> = ({
  reports,
  activeRole,
  onSaveReport,
  onDeleteReport,
  initialMode = 'list', // User requested list view by default
  autoCreate = false,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports.length > 0 ? reports[0].id : ''
  );
  const [viewMode, setViewMode] = useState<'document' | 'form' | 'list'>(initialMode);
  
  // Intelligent Search in Document View
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // List View Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  
  // Paper style: 'guilloche' (Verde Seguridad) or 'clean' (Papel Blanco)
  const [securityBgStyle, setSecurityBgStyle] = useState<'guilloche' | 'clean'>('guilloche');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  // Signature modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<RevisionReport>>({});
  const [isEditing, setIsEditing] = useState(false);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0] || null;

  // Handle auto-create trigger from "Nuevo Dictamen" module
  useEffect(() => {
    if (autoCreate || initialMode === 'form') {
      handleStartCreate();
    }
  }, [autoCreate, initialMode]);

  // Click outside listener for the intelligent search popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered reports for list view
  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      r.folio.toLowerCase().includes(term) ||
      r.titularNombreComercial.toLowerCase().includes(term) ||
      r.titularRazonSocial.toLowerCase().includes(term) ||
      r.claveExpediente.toLowerCase().includes(term) ||
      r.giroInstalacion.toLowerCase().includes(term) ||
      r.titularRfc.toLowerCase().includes(term);

    if (filterTipo === 'todos') return matchesSearch;
    if (filterTipo === 'media') return matchesSearch && r.tipoInstalacionPrincipal === 'Media y Baja Tensión';
    if (filterTipo === 'baja') return matchesSearch && r.tipoInstalacionPrincipal === 'Baja Tensión';
    return matchesSearch;
  });

  // Filtered reports for intelligent search in document view
  const docSearchMatches = docSearchQuery.trim() === '' 
    ? reports.slice(0, 5) 
    : reports.filter(r => {
        const q = docSearchQuery.toLowerCase();
        return (
          r.folio.toLowerCase().includes(q) ||
          r.titularNombreComercial.toLowerCase().includes(q) ||
          r.titularRazonSocial.toLowerCase().includes(q) ||
          r.titularRfc.toLowerCase().includes(q) ||
          r.claveExpediente.toLowerCase().includes(q)
        );
      });

  const handleStartCreate = () => {
    const maxFolio = reports.reduce((max, r) => {
      const num = parseInt(r.folio.replace(/\D/g, ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 359);
    const nextFolioNum = maxFolio + 1;
    const year = new Date().getFullYear();

    const todayStr = new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }).format(new Date()).replace('.', '');

    const newReport: Partial<RevisionReport> = {
      id: `rep-${Date.now()}`,
      folio: nextFolioNum.toString(),
      claveExpediente: `CFP0125/PCIEMBT/IOA/0071/14XII20 - ${nextFolioNum}/${year}`,
      fecha: todayStr,
      tipoInstalacionPrincipal: 'Media y Baja Tensión',
      giroInstalacion: '',
      tensionSuministro: '1000 V o más',
      clasificacionInstalacion: 'Lugar de concentración pública',
      tipoServicio: 'Revisión periódica',
      capacidadSubestacionKva: 75,
      cargaInstaladaKw: 25.0,
      titularNombreComercial: '',
      titularRazonSocial: '',
      titularRfc: '',
      titularCalleNumero: '',
      titularColonia: '',
      titularMunicipio: 'MORELIA',
      titularCiudadEstado: 'MORELIA, MICHOACÁN',
      titularCodigoPostal: '58000',
      titularTelefono: '',
      solicitanteNombre: '',
      solicitanteTelefono: '',
      peritoNombre: 'Ing. Israel Orozco Arias',
      peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: '15240154',
      peritoEmail: 'israel9b@hotmail.com',
      peritoTelefono: '4431748638',
      resultadoDictamen: 'Favorable (Aprobado)',
      observaciones: 'Evaluación técnica de cumplimiento de la NOM-001-SEDE-2012.',
      esMuestra: false,
    };

    setFormData(newReport);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleStartEdit = (report: RevisionReport) => {
    setFormData({ ...report });
    setIsEditing(true);
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.folio || !formData.titularNombreComercial) {
      alert('Por favor complete al menos el Folio y el Nombre Comercial del titular.');
      return;
    }

    const reportToSave: RevisionReport = {
      id: formData.id || `rep-${Date.now()}`,
      folio: formData.folio || '000',
      claveExpediente: formData.claveExpediente || `CFP0125 - ${formData.folio}/2026`,
      fecha: formData.fecha || '02-oct-26',
      tipoInstalacionPrincipal: formData.tipoInstalacionPrincipal || 'Media y Baja Tensión',
      giroInstalacion: (formData.giroInstalacion || '').toUpperCase(),
      tensionSuministro: formData.tensionSuministro || '1000 V o más',
      clasificacionInstalacion: formData.clasificacionInstalacion || 'Lugar de concentración pública',
      tipoServicio: formData.tipoServicio || 'Revisión periódica',
      capacidadSubestacionKva: Number(formData.capacidadSubestacionKva) || 0,
      cargaInstaladaKw: Number(formData.cargaInstaladaKw) || 0,
      titularNombreComercial: (formData.titularNombreComercial || '').toUpperCase(),
      titularRazonSocial: (formData.titularRazonSocial || '').toUpperCase(),
      titularRfc: (formData.titularRfc || '').toUpperCase(),
      titularCalleNumero: (formData.titularCalleNumero || '').toUpperCase(),
      titularColonia: (formData.titularColonia || '').toUpperCase(),
      titularMunicipio: (formData.titularMunicipio || 'MORELIA').toUpperCase(),
      titularCiudadEstado: (formData.titularCiudadEstado || 'MORELIA, MICHOACÁN').toUpperCase(),
      titularCodigoPostal: formData.titularCodigoPostal || '',
      titularTelefono: formData.titularTelefono || '',
      solicitanteNombre: (formData.solicitanteNombre || '').toUpperCase(),
      solicitanteTelefono: formData.solicitanteTelefono || '',
      peritoNombre: formData.peritoNombre || 'Ing. Israel Orozco Arias',
      peritoAfiliacion: formData.peritoAfiliacion || 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: formData.peritoCedula || '15240154',
      peritoEmail: formData.peritoEmail || 'israel9b@hotmail.com',
      peritoTelefono: formData.peritoTelefono || '4431748638',
      resultadoDictamen: formData.resultadoDictamen || 'Favorable (Aprobado)',
      observaciones: formData.observaciones || '',
      firmaDigital: formData.firmaDigital || selectedReport?.firmaDigital,
      esMuestra: false,
    };

    onSaveReport(reportToSave);
    setSelectedReportId(reportToSave.id);
    setViewMode('document');
  };

  const handleApplySignature = (signatureDataUrl: string) => {
    if (!selectedReport) return;
    const updated = {
      ...selectedReport,
      firmaDigital: signatureDataUrl,
    };
    onSaveReport(updated);
    setPdfNotification('¡Firma electrónica estampada con éxito en el dictamen!');
    setTimeout(() => setPdfNotification(null), 4000);
  };

  const handleExportPdf = async (reportToExport?: RevisionReport) => {
    const report = reportToExport || selectedReport;
    if (!report) return;

    // If currently in list view, select this report and switch to document
    if (viewMode !== 'document') {
      setSelectedReportId(report.id);
      setViewMode('document');
    }

    setIsExportingPdf(true);
    setPdfNotification(null);

    const safeTitle = (report.titularNombreComercial || 'TITULAR')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    const filename = `Dictamen_CFP_Folio_${report.folio}_${safeTitle}`;

    // Allow DOM to settle
    setTimeout(async () => {
      const isGreen = securityBgStyle === 'guilloche';
      const success = await exportDocumentToPdf('official-peritaje-document', filename, isGreen);
      setIsExportingPdf(false);

      if (success) {
        setPdfNotification(`¡PDF descargado con éxito! Archivo: ${filename}.pdf`);
        setTimeout(() => {
          setPdfNotification(null);
        }, 5000);
      }
    }, 200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      
      {/* Toast Notification */}
      {pdfNotification && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{pdfNotification}</span>
          </div>
          <button onClick={() => setPdfNotification(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Module Title: User requested "Historial de dictamenes" */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight uppercase">
              Historial de Dictámenes • CFP
            </h2>
            <p className="text-xs text-slate-400">
              Revisión de Instalaciones Eléctricas en Materia de Seguridad (NOM-001-SEDE-2012)
            </p>
          </div>
        </div>

        {/* View Switchers & Create button */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'list' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lista de Dictámenes ({reports.length})</span>
            </button>

            {selectedReport && (
              <button
                onClick={() => setViewMode('document')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'document' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Formato #{selectedReport.folio}</span>
              </button>
            )}
          </div>

          {/* New Report Button */}
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo Dictamen</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. LIST VIEW: Form of list as explicitly requested by the user */}
      {/* ============================================================== */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Search and filters bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por folio, titular, RFC, ciudad..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none font-medium"
              >
                <option value="todos">Todos los Tipos de Tensión</option>
                <option value="media">Media y Baja Tensión</option>
                <option value="baja">Baja Tensión</option>
              </select>
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Folio</th>
                  <th className="py-3 px-4">Titular / Giro Comercial</th>
                  <th className="py-3 px-4">Tensión & Subestación</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Firma Digital</th>
                  <th className="py-3 px-4">Dictamen</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => {
                      setSelectedReportId(report.id);
                      setViewMode('document');
                    }}
                    className="hover:bg-amber-50/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-black text-rose-600">
                      <span className="text-sm font-mono font-black">#{report.folio}</span>
                      {report.esMuestra && (
                        <span className="ml-2 text-[9px] font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                          Muestra
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{report.titularNombreComercial}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-sm">{report.giroInstalacion}</div>
                      <div className="text-[10px] text-slate-400 font-mono">RFC: {report.titularRfc} • {report.titularCiudadEstado}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{report.tipoInstalacionPrincipal}</span>
                      <span className="text-[11px] text-slate-500">Sub: {report.capacidadSubestacionKva} kVA • Carga: {report.cargaInstaladaKw} kW</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono font-medium">
                      {report.fecha}
                    </td>
                    <td className="py-3.5 px-4">
                      {report.firmaDigital ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          Firmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <PenTool className="w-2.5 h-2.5 text-amber-600" />
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          report.resultadoDictamen.includes('Favorable')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {report.resultadoDictamen}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Direct Button: Ver Formato Oficial */}
                        <button
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setViewMode('document');
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-sm"
                          title="Ver dictamen en papel oficial"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Formato</span>
                        </button>

                        {/* Direct Button: Exportar PDF */}
                        <button
                          onClick={() => handleExportPdf(report)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-lg transition"
                          title="Exportar directamente a PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleStartEdit(report)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg transition"
                          title="Editar información"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar reporte Folio #${report.folio}?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 border border-slate-200 rounded-lg transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No se encontraron dictámenes con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DOCUMENT VIEW: Exact Replica with Security & White Paper  */}
      {/* ============================================================== */}
      {viewMode === 'document' && selectedReport && (
        <div className="space-y-4">
          
          {/* Top Document Bar: INTELLIGENT SEARCH (Replaces select dropdown) + Controls */}
          <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-xs space-y-3 shadow-md">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              
              {/* Back to list button & Intelligent Search Bar */}
              <div className="flex items-center flex-1 gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 flex-shrink-0 cursor-pointer"
                  title="Volver a la lista de dictámenes"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>Volver a Lista</span>
                </button>

                {/* Intelligent Search Input Container with Suggestions Popover */}
                <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={docSearchQuery}
                      onChange={(e) => {
                        setDocSearchQuery(e.target.value);
                        setIsSearchFocused(true);
                      }}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder={`Buscar expediente por Folio (#${selectedReport.folio}), Nombre, RFC...`}
                      className="w-full pl-9 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {docSearchQuery && (
                      <button
                        onClick={() => setDocSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete / Instant Results Popover */}
                  {isSearchFocused && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 max-h-72 overflow-y-auto">
                      <div className="p-2 bg-slate-800/80 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex justify-between">
                        <span>Resultados Inteligentes ({docSearchMatches.length})</span>
                        <span className="text-slate-400">Clic para cambiar de dictamen</span>
                      </div>
                      {docSearchMatches.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setSelectedReportId(r.id);
                            setIsSearchFocused(false);
                            setDocSearchQuery('');
                          }}
                          className={`p-2.5 hover:bg-slate-800 cursor-pointer transition flex items-center justify-between gap-3 ${
                            r.id === selectedReport.id ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-rose-400 text-xs">#{r.folio}</span>
                              <span className="font-bold text-white text-xs truncate">{r.titularNombreComercial}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{r.giroInstalacion}</div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{r.fecha}</span>
                        </div>
                      ))}
                      {docSearchMatches.length === 0 && (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          No se encontró ningún expediente con "{docSearchQuery}".
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Paper Switcher, Sign Button, Export PDF, Print */}
              <div className="flex items-center flex-wrap gap-2 justify-end">
                
                {/* Paper Style Switcher */}
                <button
                  onClick={() => setSecurityBgStyle(securityBgStyle === 'guilloche' ? 'clean' : 'guilloche')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                    securityBgStyle === 'clean'
                      ? 'bg-slate-100 text-slate-900 border-white'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                  }`}
                  title="Alternar entre Papel de Seguridad Verde o Papel Blanco"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{securityBgStyle === 'guilloche' ? 'Papel Seguridad (Verde)' : 'Papel Blanco'}</span>
                </button>

                {/* Electronic Signature Button (Active for both formats) */}
                <button
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                  title="Firmar electrónicamente desde móvil o PC"
                >
                  <PenTool className="w-3.5 h-3.5 text-indigo-200" />
                  <span>{selectedReport.firmaDigital ? 'Re-firmar Dictamen' : 'Firmar Electrónicamente'}</span>
                </button>

                {/* PDF Export Button */}
                <button
                  onClick={() => handleExportPdf()}
                  disabled={isExportingPdf}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                  title="Descargar archivo PDF oficial del dictamen"
                >
                  {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isExportingPdf ? 'Exportando...' : 'Exportar PDF'}</span>
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                  title="Imprimir formato físico"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>

                {/* Edit Data */}
                <button
                  onClick={() => handleStartEdit(selectedReport)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition cursor-pointer"
                  title="Editar datos del informe"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Folios Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-500">Expedientes:</span>
              {reports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReportId(r.id)}
                  className={`px-2.5 py-0.5 rounded-lg font-mono font-bold transition flex-shrink-0 cursor-pointer ${
                    r.id === selectedReport.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  #{r.folio} {r.firmaDigital ? '✓' : ''}
                </button>
              ))}
            </div>

          </div>

          {/* DOCUMENT HORIZONTAL OVERFLOW WRAPPER: Guarantees responsive layout without overlaps */}
          <div className="overflow-x-auto pb-6">
            <div className="min-w-[700px] flex justify-center">
              
              {/* THE OFFICIAL FORMAT DOCUMENT CONTAINER */}
              <div
                id="official-peritaje-document"
                className={`w-full max-w-4xl p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 transition-colors duration-200 relative print:shadow-none print:border-none print:m-0 print:p-2 text-slate-900`}
                style={{
                  backgroundColor: securityBgStyle === 'guilloche' ? '#cbf3d2' : '#ffffff',
                  backgroundImage: securityBgStyle === 'guilloche'
                    ? `repeating-linear-gradient(
                        45deg,
                        rgba(5, 150, 105, 0.08) 0px,
                        rgba(5, 150, 105, 0.08) 3px,
                        transparent 3px,
                        transparent 8px
                      ), repeating-linear-gradient(
                        -45deg,
                        rgba(16, 185, 129, 0.06) 0px,
                        rgba(16, 185, 129, 0.06) 3px,
                        transparent 3px,
                        transparent 8px
                      )`
                    : 'none',
                }}
              >
                {/* Subtle Watermark repeating SEGURIDAD (Only in security paper) */}
                {securityBgStyle === 'guilloche' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15 flex flex-wrap gap-12 p-8 select-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span key={i} className="text-xs font-black tracking-widest text-emerald-900 rotate-[-20deg]">
                        SEGURIDAD
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative z-10 space-y-4 text-xs sm:text-sm font-sans">
                  
                  {/* DOCUMENT TITLE */}
                  <div className="text-center pb-2">
                    <h1 className="text-sm sm:text-lg font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                      REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
                    </h1>
                  </div>

                  {/* TOP ROW: Tipo de instalación (Left) & Official Logo (Right) */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    
                    {/* Left: Checkboxes Tipo de instalación */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-900 block text-xs">Tipo de instalación:</span>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-slate-900 flex items-center justify-center font-bold text-sm bg-white">
                          {selectedReport.tipoInstalacionPrincipal === 'Baja Tensión' ? 'X' : ''}
                        </div>
                        <span className="font-medium text-xs sm:text-sm">Instalación Electrica de Baja Tensión</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-slate-900 flex items-center justify-center font-bold text-sm bg-white">
                          {selectedReport.tipoInstalacionPrincipal === 'Media y Baja Tensión' ? 'X' : ''}
                        </div>
                        <span className="font-medium text-xs sm:text-sm">Instalación Electrica de Media y Baja Tensión</span>
                      </div>
                    </div>

                    {/* Right: Official Crest Logo of COLEGIO FEDERAL PERITOS CFP (Inline SVG to prevent canvas taint) */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <CfpLogo size={72} />
                      </div>
                      <div className="flex flex-col text-left leading-tight font-serif">
                        <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                          COLEGIO
                        </span>
                        <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                          FEDERAL
                        </span>
                        <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 uppercase">
                          PERITOS
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 tracking-widest">
                          CFP
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* LEGAL PREAMBLE TEXT */}
                  <div className="text-justify text-[11px] sm:text-xs leading-relaxed text-slate-900 font-serif border-y border-slate-800/80 py-2.5 my-2">
                    De conformidad a lo dispuesto en el Artículo 5° Constitucional, cumpliendo con los requerimientos del Artículo 12, referente al ejercicio profesional, en pleno ejercicio de los derechos establecidos en el Artículo 21 y cumpliendo con las obligaciones establecidas en el Artículo 22, de la Ley de Profesiones del Estado de Michoacán de Ocampo, en mi carácter de <strong className="font-black">Perito Dictaminador de Instalaciones Eléctricas en Media y Baja Tensión</strong>, afiliado al <strong className="font-black">Colegio Federal de Peritos, A.C.</strong>, presento el informe en materia de seguridad, de la instalación que se describe a continuación:
                  </div>

                  {/* OFFICIAL DATA TABLE: RESPONSIVE FIXED - NO COLLISION */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white/95">
                    
                    {/* Row 1: Folio, Clave, Fecha */}
                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs font-bold">
                      <div className="col-span-4 sm:col-span-3 p-1.5 bg-slate-100 flex items-center min-w-0">
                        <span className="truncate">Informe de revisión No.{selectedReport.folio}</span>
                      </div>
                      <div className="col-span-5 sm:col-span-6 p-1.5 text-center font-mono text-[10px] sm:text-xs flex items-center justify-center break-all">
                        {selectedReport.claveExpediente}
                      </div>
                      <div className="col-span-3 sm:col-span-3 p-1.5 flex items-center justify-end font-bold pr-2 min-w-0">
                        <span className="truncate">Fecha: <strong className="font-mono">{selectedReport.fecha}</strong></span>
                      </div>
                    </div>

                    {/* Row 2: Giro de la instalación */}
                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs">
                      <div className="col-span-4 sm:col-span-3 p-1.5 font-bold bg-slate-50 flex items-center">
                        Giro de la instalación:
                      </div>
                      <div className="col-span-8 sm:col-span-9 p-1.5 font-bold uppercase tracking-tight text-[11px] sm:text-xs flex items-center">
                        {selectedReport.giroInstalacion}
                      </div>
                    </div>

                    {/* Row 3: 3 Technical Columns */}
                    <div className="grid grid-cols-3 divide-x-2 divide-slate-900 text-[11px] sm:text-xs">
                      
                      {/* Col 1: Tensión eléctrica de suministro & Subestación */}
                      <div className="p-2 space-y-1.5">
                        <div className="font-bold border-b border-slate-900 pb-1">Tension eléctrica de suministro:</div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.tensionSuministro === 'Menos de 1000 V' ? 'X' : ''}
                          </div>
                          <span>Menos de 1000 V</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.tensionSuministro === '1000 V o más' ? 'X' : ''}
                          </div>
                          <span>1000 V o más</span>
                        </div>

                        <div className="pt-2 space-y-1">
                          <div className="flex justify-between border-b border-dotted border-slate-400 pb-0.5">
                            <span>Capacidad de Subestación:</span>
                            <span className="font-bold font-mono">{selectedReport.capacidadSubestacionKva} kVA</span>
                          </div>
                          <div className="flex justify-between border-b border-dotted border-slate-400 pb-0.5">
                            <span>Carga instalada:</span>
                            <span className="font-bold font-mono">{selectedReport.cargaInstaladaKw} kW</span>
                          </div>
                        </div>
                      </div>

                      {/* Col 2: Tipo de instalación */}
                      <div className="p-2 space-y-1.5">
                        <div className="font-bold border-b border-slate-900 pb-1">Tipo de instalación:</div>
                        <div className="flex items-center justify-between">
                          <span>Lugar de concentración pública</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.clasificacionInstalacion === 'Lugar de concentración pública' ? 'X' : ''}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Area peligrosa</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.clasificacionInstalacion === 'Area peligrosa' ? 'X' : ''}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Industria</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.clasificacionInstalacion === 'Industria' ? 'X' : ''}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Otro</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.clasificacionInstalacion === 'Otro' ? 'X' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Col 3: Tipo de servicio */}
                      <div className="p-2 space-y-1.5">
                        <div className="font-bold border-b border-slate-900 pb-1">Tipo de servicio:</div>
                        <div className="flex items-center justify-between">
                          <span>Servicio Nuevo</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.tipoServicio === 'Servicio Nuevo' ? 'X' : ''}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Modificación de instalación</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.tipoServicio === 'Modificación de instalación' ? 'X' : ''}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Revisión periódica</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.tipoServicio === 'Revisión periódica' ? 'X' : ''}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cambio de Razón social</span>
                          <div className="w-4 h-4 border border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                            {selectedReport.tipoServicio === 'Cambio de Razón social' ? 'X' : ''}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Section: Datos del Titular */}
                    <div className="p-2 space-y-1 text-xs">
                      <div className="font-bold bg-slate-100 p-1 uppercase tracking-wider text-[11px]">
                        Datos del Titular:
                      </div>
                      
                      <div className="space-y-1 px-1">
                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Nombre Comercial:</span>
                          <span className="font-bold text-slate-900 uppercase flex-1">{selectedReport.titularNombreComercial}</span>
                        </div>

                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Nombre o Razon Social:</span>
                          <span className="font-semibold text-slate-900 uppercase flex-1">{selectedReport.titularRazonSocial}</span>
                        </div>

                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">RFC:</span>
                          <span className="font-mono font-bold text-slate-900 uppercase">{selectedReport.titularRfc}</span>
                        </div>

                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Calle y No:</span>
                          <span className="font-medium text-slate-900 uppercase">{selectedReport.titularCalleNumero}</span>
                        </div>

                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Colonia o Población:</span>
                          <span className="font-medium text-slate-900 uppercase">{selectedReport.titularColonia}</span>
                        </div>

                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Municipio o Delegación:</span>
                          <span className="font-medium text-slate-900 uppercase">{selectedReport.titularMunicipio}</span>
                        </div>

                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Ciudad y Estado:</span>
                          <span className="font-medium text-slate-900 uppercase">{selectedReport.titularCiudadEstado}</span>
                        </div>

                        <div className="flex items-baseline gap-6 border-b border-slate-300 pb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">Código postal:</span>
                            <span className="font-mono font-bold text-slate-900">{selectedReport.titularCodigoPostal}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">Teléfono:</span>
                            <span className="font-mono font-bold text-slate-900">{selectedReport.titularTelefono}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Solicitante del servicio */}
                    <div className="p-2 space-y-1 text-xs">
                      <div className="font-bold bg-slate-100 p-1 uppercase tracking-wider text-[11px]">
                        Solicitante del servicio:
                      </div>

                      <div className="space-y-1 px-1">
                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Nombre:</span>
                          <span className="font-bold text-slate-900 uppercase flex-1">{selectedReport.solicitanteNombre}</span>
                        </div>
                        <div className="flex items-baseline gap-1 border-b border-slate-300 pb-0.5">
                          <span className="w-44 font-bold text-slate-800">Teléfono:</span>
                          <span className="font-mono font-medium text-slate-900">{selectedReport.solicitanteTelefono}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* NOTAS OFICIALES (Exact text as in Image 2) */}
                  <div className="border-2 border-slate-900 p-3 bg-white/95 text-[10.5px] sm:text-[11.5px] leading-snug space-y-1.5">
                    <div className="font-black text-slate-900 uppercase">NOTAS:</div>
                    <p className="text-slate-800 text-justify">
                      * El presente informe tiene vigencia a partir de la fecha de expedición, siempre que las condiciones de la instalación eléctrica no sean modificadas.
                    </p>
                    <p className="text-slate-800 text-justify">
                      * El titular o usuario declara que conoce sus derechos, obligaciones y responsabilidades, derivados de la utilización y conservación de la instalación eléctrica, para garantizar su funcionamiento satisfactorio acorde al uso previsto.
                    </p>
                    <p className="text-slate-800 text-justify">
                      * El contenido del presente informe, resume la evaluación de las disposiciones aplicables de la <strong className="font-black">NORMA OFICIAL MEXICANA, NOM-001-SEDE-2012</strong>, en adelante NOM.
                    </p>
                  </div>

                  {/* PERITO RESPONSABLE SECTION */}
                  <div className="pt-2 space-y-3">
                    
                    {/* Header Perito Responsable */}
                    <div className="text-center font-black tracking-widest text-slate-900 uppercase text-xs sm:text-sm">
                      PERITO RESPONSABLE
                    </div>

                    {/* Touch-Friendly Electronic Signature Area */}
                    <div className="flex flex-col items-center justify-center relative">
                      
                      {selectedReport.firmaDigital ? (
                        <div className="relative group cursor-pointer" onClick={() => setIsSignatureModalOpen(true)}>
                          <img
                            src={selectedReport.firmaDigital}
                            alt="Firma Electrónica del Perito"
                            className="h-20 sm:h-24 object-contain filter drop-shadow-sm select-none"
                          />
                          <div className="no-print absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition">
                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              Tocar para cambiar firma
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsSignatureModalOpen(true)}
                          className="no-print h-20 w-72 border-2 border-dashed border-amber-600/60 bg-amber-50/50 hover:bg-amber-100/60 rounded-xl flex flex-col items-center justify-center p-2 text-center transition cursor-pointer mb-1 shadow-sm"
                        >
                          <PenTool className="w-5 h-5 text-amber-600 mb-1" />
                          <span className="text-xs font-bold text-amber-900">
                            Presione aquí para Firmar Electrónicamente
                          </span>
                          <span className="text-[10px] text-amber-700">
                            Compatible con pantalla táctil móvil y lápiz
                          </span>
                        </button>
                      )}

                      {/* Signature underline */}
                      <div className="w-80 border-b-2 border-slate-900 mb-1"></div>
                      <span className="font-black text-slate-900 text-xs sm:text-sm tracking-wide">
                        {selectedReport.peritoNombre}
                      </span>
                    </div>

                    {/* QR Code + Official Credentials (BARCODE REMOVED AS REQUESTED) */}
                    <div className="grid grid-cols-12 gap-4 items-center pt-2">
                      
                      {/* Left: QR Code Matrix with Seal */}
                      <div className="col-span-3 flex flex-col items-center justify-center">
                        <div
                          className="p-1 bg-white border border-slate-300 rounded shadow-sm"
                          dangerouslySetInnerHTML={{
                            __html: generateQrMatrixSvg(
                              `CFP-VERIFY:${selectedReport.folio}:${selectedReport.claveExpediente}:${selectedReport.titularRfc}`,
                              105
                            ),
                          }}
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">
                          VALIDACIÓN DIGITAL
                        </span>
                      </div>

                      {/* Right: Perito Official Credentials & Folio in Red */}
                      <div className="col-span-9 space-y-1 text-xs font-serif pl-2">
                        <div>
                          <span className="font-bold text-slate-900">NO. de Afiliación CFP:</span>{' '}
                          <span className="font-mono font-semibold text-slate-800">{selectedReport.peritoAfiliacion}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">Cédula Profesional:</span>{' '}
                          <span className="font-mono font-bold text-slate-900">{selectedReport.peritoCedula}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">Correo electronico:</span>{' '}
                          <span className="text-slate-800 font-mono">{selectedReport.peritoEmail}</span>
                        </div>
                        
                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            <span className="font-bold text-slate-900">Teléfono:</span>{' '}
                            <span className="font-mono font-bold text-slate-800">{selectedReport.peritoTelefono}</span>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-black text-slate-900 mr-2 text-sm">FOLIO:</span>
                            <span className="font-black text-rose-600 text-base sm:text-lg font-mono">
                              {selectedReport.folio}
                            </span>
                          </div>
                        </div>

                        {selectedReport.firmaDigital && (
                          <div className="pt-1 text-[10px] text-emerald-800 font-mono flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Dictamen firmado electrónicamente conforme a la NOM-001-SEDE-2012</span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FORM VIEW: Create / Edit Report Form                         */}
      {/* ============================================================== */}
      {viewMode === 'form' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEditing ? `Editar Dictamen Folio #${formData.folio}` : 'Nuevo Dictamen de Revisión Eléctrica'}
                </h3>
                <p className="text-xs text-slate-500">
                  Ingrese los datos reglamentarios conforme a la NOM-001-SEDE-2012
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('list')}
              className="text-slate-400 hover:text-slate-600 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-6">
            
            {/* Encabezado y Datos Clave */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Informe de Revisión No. (Folio) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.folio || ''}
                  onChange={(e) => {
                    const f = e.target.value;
                    setFormData({
                      ...formData,
                      folio: f,
                      claveExpediente: `CFP0125/PCIEMBT/IOA/0071/14XII20 - ${f}/2026`,
                    });
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="359"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clave de Expediente Oficial
                </label>
                <input
                  type="text"
                  value={formData.claveExpediente || ''}
                  onChange={(e) => setFormData({ ...formData, claveExpediente: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Fecha de Emisión
                </label>
                <input
                  type="text"
                  value={formData.fecha || ''}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="02-oct-26"
                />
              </div>
            </div>

            {/* Tipo de Instalación Principal */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Tipo de instalación principal:
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="tipoInstalacionPrincipal"
                    value="Baja Tensión"
                    checked={formData.tipoInstalacionPrincipal === 'Baja Tensión'}
                    onChange={() => setFormData({ ...formData, tipoInstalacionPrincipal: 'Baja Tensión', tensionSuministro: 'Menos de 1000 V' })}
                    className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Instalación Eléctrica de Baja Tensión</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="tipoInstalacionPrincipal"
                    value="Media y Baja Tensión"
                    checked={formData.tipoInstalacionPrincipal === 'Media y Baja Tensión'}
                    onChange={() => setFormData({ ...formData, tipoInstalacionPrincipal: 'Media y Baja Tensión', tensionSuministro: '1000 V o más' })}
                    className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Instalación Eléctrica de Media y Baja Tensión</span>
                </label>
              </div>
            </div>

            {/* Giro de la instalación */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Giro de la instalación *
              </label>
              <input
                type="text"
                required
                value={formData.giroInstalacion || ''}
                onChange={(e) => setFormData({ ...formData, giroInstalacion: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                placeholder="COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO"
              />
            </div>

            {/* 3 Columnas Técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Tensión & Capacidad */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="block text-xs font-bold text-slate-700 uppercase border-b pb-1">
                  Tensión de suministro & Cargas
                </span>
                
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tensionSuministro"
                      checked={formData.tensionSuministro === 'Menos de 1000 V'}
                      onChange={() => setFormData({ ...formData, tensionSuministro: 'Menos de 1000 V' })}
                      className="text-amber-500"
                    />
                    <span>Menos de 1000 V</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tensionSuministro"
                      checked={formData.tensionSuministro === '1000 V o más'}
                      onChange={() => setFormData({ ...formData, tensionSuministro: '1000 V o más' })}
                      className="text-amber-500"
                    />
                    <span>1000 V o más</span>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">Capacidad de Subestación (kVA):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.capacidadSubestacionKva ?? 0}
                      onChange={(e) => setFormData({ ...formData, capacidadSubestacionKva: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">Carga instalada (kW):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cargaInstaladaKw ?? 0}
                      onChange={(e) => setFormData({ ...formData, cargaInstaladaKw: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      placeholder="27.25"
                    />
                  </div>
                </div>
              </div>

              {/* Clasificación de instalación */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="block text-xs font-bold text-slate-700 uppercase border-b pb-1">
                  Tipo de instalación
                </span>
                
                <div className="space-y-1.5 text-xs">
                  {['Lugar de concentración pública', 'Area peligrosa', 'Industria', 'Otro'].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="clasificacionInstalacion"
                        checked={formData.clasificacionInstalacion === tipo}
                        onChange={() => setFormData({ ...formData, clasificacionInstalacion: tipo as any })}
                        className="text-amber-500"
                      />
                      <span>{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de servicio */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="block text-xs font-bold text-slate-700 uppercase border-b pb-1">
                  Tipo de servicio
                </span>
                
                <div className="space-y-1.5 text-xs">
                  {[
                    'Servicio Nuevo',
                    'Modificación de instalación',
                    'Revisión periódica',
                    'Cambio de Razón social',
                  ].map((servicio) => (
                    <label key={servicio} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoServicio"
                        checked={formData.tipoServicio === servicio}
                        onChange={() => setFormData({ ...formData, tipoServicio: servicio as any })}
                        className="text-amber-500"
                      />
                      <span>{servicio}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Datos del Titular */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="block text-xs font-bold text-slate-800 uppercase border-b pb-1">
                Datos del Titular
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={formData.titularNombreComercial || ''}
                    onChange={(e) => setFormData({ ...formData, titularNombreComercial: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="ABARROTES AZTECA SUC. TIJERAS"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre o Razón Social</label>
                  <input
                    type="text"
                    value={formData.titularRazonSocial || ''}
                    onChange={(e) => setFormData({ ...formData, titularRazonSocial: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="ABARROTES AZTECA TIJERAS S.A DE C.V"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RFC</label>
                  <input
                    type="text"
                    value={formData.titularRfc || ''}
                    onChange={(e) => setFormData({ ...formData, titularRfc: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="AAT170629U46"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Calle y No.</label>
                  <input
                    type="text"
                    value={formData.titularCalleNumero || ''}
                    onChange={(e) => setFormData({ ...formData, titularCalleNumero: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="JUAN DE BAEZA #600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Colonia o Población</label>
                  <input
                    type="text"
                    value={formData.titularColonia || ''}
                    onChange={(e) => setFormData({ ...formData, titularColonia: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="DIECIOCHO DE MAYO"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Municipio o Delegación</label>
                  <input
                    type="text"
                    value={formData.titularMunicipio || ''}
                    onChange={(e) => setFormData({ ...formData, titularMunicipio: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="MORELIA"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ciudad y Estado</label>
                  <input
                    type="text"
                    value={formData.titularCiudadEstado || ''}
                    onChange={(e) => setFormData({ ...formData, titularCiudadEstado: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="MORELIA, MICHOACÁN"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={formData.titularCodigoPostal || ''}
                    onChange={(e) => setFormData({ ...formData, titularCodigoPostal: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    placeholder="58258"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.titularTelefono || ''}
                    onChange={(e) => setFormData({ ...formData, titularTelefono: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    placeholder="4433234075"
                  />
                </div>
              </div>
            </div>

            {/* Solicitante del Servicio */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="block text-xs font-bold text-slate-800 uppercase border-b pb-1">
                Solicitante del servicio
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.solicitanteNombre || ''}
                    onChange={(e) => setFormData({ ...formData, solicitanteNombre: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs uppercase"
                    placeholder="VICTOR DANIEL RIOS RAMIREZ"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.solicitanteTelefono || ''}
                    onChange={(e) => setFormData({ ...formData, solicitanteTelefono: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    placeholder="4438573253"
                  />
                </div>
              </div>
            </div>

            {/* Perito Responsable */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="block text-xs font-bold text-slate-800 uppercase border-b pb-1">
                Perito Responsable Dictaminador
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre del Perito</label>
                  <input
                    type="text"
                    value={formData.peritoNombre || ''}
                    onChange={(e) => setFormData({ ...formData, peritoNombre: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    placeholder="Ing. Israel Orozco Arias"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. de Afiliación CFP</label>
                  <input
                    type="text"
                    value={formData.peritoAfiliacion || ''}
                    onChange={(e) => setFormData({ ...formData, peritoAfiliacion: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                    placeholder="CFP0125/PCIEMBT/IOA/0071/14XII20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cédula Profesional</label>
                  <input
                    type="text"
                    value={formData.peritoCedula || ''}
                    onChange={(e) => setFormData({ ...formData, peritoCedula: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                    placeholder="15240154"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.peritoEmail || ''}
                    onChange={(e) => setFormData({ ...formData, peritoEmail: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    placeholder="israel9b@hotmail.com"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono Perito</label>
                  <input
                    type="text"
                    value={formData.peritoTelefono || ''}
                    onChange={(e) => setFormData({ ...formData, peritoTelefono: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    placeholder="4431748638"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dictamen Final</label>
                  <select
                    value={formData.resultadoDictamen || 'Favorable (Aprobado)'}
                    onChange={(e) => setFormData({ ...formData, resultadoDictamen: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Favorable (Aprobado)">Favorable (Aprobado)</option>
                    <option value="Condicionado">Condicionado</option>
                    <option value="No Favorable (Riesgo Crítico)">No Favorable (Riesgo Crítico)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Guardar Dictamen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Signature Pad Modal */}
      {selectedReport && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onSaveSignature={handleApplySignature}
          peritoNombre={selectedReport.peritoNombre}
          cedula={selectedReport.peritoCedula}
        />
      )}

    </div>
  );
};
