import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  FileText, 
  Edit3, 
  Trash2, 
  PenTool, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Activity, 
  Check, 
  Camera,
  Calendar,
  Wrench,
  Layers,
  FileCheck2,
  FileDown
} from 'lucide-react';
import { OperatingConditionsReport, UserRole } from '../types';
import { generateQrMatrixSvg } from '../utils/barcode';
import { exportDocumentToPdf, exportMultiPageDocumentToPdf } from '../utils/pdfExport';
import { SignatureModal } from './SignatureModal';
import { CfpLogo } from './CfpLogo';
import { EvidenceUploader } from './EvidenceUploader';

interface OperatingConditionsModuleProps {
  reports: OperatingConditionsReport[];
  activeRole: UserRole;
  onSaveReport: (report: OperatingConditionsReport) => void;
  onDeleteReport: (id: string) => void;
  initialMode?: 'document' | 'form' | 'list';
  autoCreate?: boolean;
}

export const OperatingConditionsModule: React.FC<OperatingConditionsModuleProps> = ({
  reports,
  activeRole,
  onSaveReport,
  onDeleteReport,
  initialMode = 'list',
  autoCreate = false,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports.length > 0 ? reports[0].id : ''
  );
  const [viewMode, setViewMode] = useState<'document' | 'form' | 'list'>(initialMode);
  const [activeDocumentPage, setActiveDocumentPage] = useState<'both' | 'p3' | 'p4'>('both');
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDictamen, setFilterDictamen] = useState<string>('todos');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  // Signature modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<OperatingConditionsReport>>({});
  const [isEditing, setIsEditing] = useState(false);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0] || null;

  useEffect(() => {
    if (autoCreate || initialMode === 'form') {
      handleStartCreate();
    }
  }, [autoCreate, initialMode]);

  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      r.folio.toLowerCase().includes(term) ||
      r.nombreComercial.toLowerCase().includes(term) ||
      r.razonSocial.toLowerCase().includes(term) ||
      r.claveExpediente.toLowerCase().includes(term) ||
      r.municipio.toLowerCase().includes(term);

    const matchesFilter = filterDictamen === 'todos' || r.dictamenCondiciones.includes(filterDictamen);
    return matchesSearch && matchesFilter;
  });

  const handleStartCreate = () => {
    const nextFolioNum = reports.length > 0 
      ? Math.max(...reports.map(r => parseInt(r.folio.replace(/\D/g, '') || '0', 10))) + 1 
      : 88;
    const newFolio = `REV-${String(nextFolioNum).padStart(3, '0')}`;
    
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).replace('.', '');

    const newReport: Partial<OperatingConditionsReport> = {
      id: `rev-${Date.now()}`,
      folio: newFolio,
      claveExpediente: `CFP0125/REV/IOA/${String(nextFolioNum).padStart(4, '0')}/2026`,
      fechaInspeccion: dateFormatted,
      nombreComercial: '',
      razonSocial: '',
      rfc: '',
      giro: '',
      calleNumero: '',
      colonia: '',
      municipio: 'MORELIA',
      ciudadEstado: 'MORELIA, MICHOACÁN',
      codigoPostal: '58000',
      telefono: '',
      contacto: '',
      tipoInstalacion: 'Media y Baja Tensión',
      tensionOperacion: '13,200 V / 220-127 V',
      capacidadTransformadorKva: 75,
      demandaMedidaKw: 25.0,
      resistenciaTierraOhms: 6.8,
      estadoSubestacion: 'Satisfactorio',
      estadoTableros: 'Satisfactorio',
      estadoConductoresCanalizaciones: 'Satisfactorio',
      estadoSistemaTierras: 'Satisfactorio',
      estadoProteccionesSobrecarga: 'Satisfactorio',
      estadoAlumbradoEmergencia: 'Satisfactorio',
      programaMantenimientoVigente: true,
      ultimoMantenimientoFecha: dateFormatted,
      responsableMantenimiento: 'Ing. Mantenimiento Eléctrico',
      pruebasAislamientoMegger: 'Conforme',
      pruebasTermografiaInfrarroja: 'Sin Puntos Calientes',
      limpiezaOrdenCuartoElectrico: 'Excelente',
      equipoProteccionPersonalYRotulacion: 'Completo',
      dictamenCondiciones: 'Condición Operativa Satisfactoria (Aprobada)',
      plazoCorreccionDias: 30,
      accionesRequeridas: 'Mantener el programa periódico de mantenimiento preventivo y limpieza de tableros.',
      notasRecomendaciones: 'Instalación evaluada conforme a la NOM-001-SEDE-2012 y NOM-029-STPS-2011.',
      evidencias: [],
      peritoNombre: 'Ing. Israel Orozco Arias',
      peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: '15240154',
      peritoTelefono: '4431748638',
      peritoEmail: 'israel9b@hotmail.com',
      esMuestra: false,
    };

    setFormData(newReport);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleStartEdit = (rep: OperatingConditionsReport) => {
    setFormData({ ...rep });
    setIsEditing(true);
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreComercial?.trim()) {
      alert('Por favor ingrese el Nombre Comercial o del Inmueble.');
      return;
    }

    const reportToSave: OperatingConditionsReport = {
      id: formData.id || `rev-${Date.now()}`,
      folio: formData.folio || 'REV-088',
      claveExpediente: formData.claveExpediente || `CFP0125/REV/IOA/0088/2026`,
      fechaInspeccion: formData.fechaInspeccion || new Date().toISOString().split('T')[0],
      nombreComercial: (formData.nombreComercial || '').toUpperCase(),
      razonSocial: (formData.razonSocial || '').toUpperCase(),
      rfc: (formData.rfc || '').toUpperCase(),
      giro: (formData.giro || '').toUpperCase(),
      calleNumero: (formData.calleNumero || '').toUpperCase(),
      colonia: (formData.colonia || '').toUpperCase(),
      municipio: (formData.municipio || 'MORELIA').toUpperCase(),
      ciudadEstado: (formData.ciudadEstado || 'MORELIA, MICHOACÁN').toUpperCase(),
      codigoPostal: formData.codigoPostal || '58000',
      telefono: formData.telefono || '',
      contacto: formData.contacto || '',
      tipoInstalacion: formData.tipoInstalacion || 'Media y Baja Tensión',
      tensionOperacion: formData.tensionOperacion || '220/127 V',
      capacidadTransformadorKva: Number(formData.capacidadTransformadorKva) || 0,
      demandaMedidaKw: Number(formData.demandaMedidaKw) || 0,
      resistenciaTierraOhms: Number(formData.resistenciaTierraOhms) || 0,
      estadoSubestacion: formData.estadoSubestacion || 'Satisfactorio',
      estadoTableros: formData.estadoTableros || 'Satisfactorio',
      estadoConductoresCanalizaciones: formData.estadoConductoresCanalizaciones || 'Satisfactorio',
      estadoSistemaTierras: formData.estadoSistemaTierras || 'Satisfactorio',
      estadoProteccionesSobrecarga: formData.estadoProteccionesSobrecarga || 'Satisfactorio',
      estadoAlumbradoEmergencia: formData.estadoAlumbradoEmergencia || 'Satisfactorio',
      programaMantenimientoVigente: formData.programaMantenimientoVigente ?? true,
      ultimoMantenimientoFecha: formData.ultimoMantenimientoFecha || '',
      responsableMantenimiento: formData.responsableMantenimiento || '',
      pruebasAislamientoMegger: formData.pruebasAislamientoMegger || 'Conforme',
      pruebasTermografiaInfrarroja: formData.pruebasTermografiaInfrarroja || 'Sin Puntos Calientes',
      limpiezaOrdenCuartoElectrico: formData.limpiezaOrdenCuartoElectrico || 'Excelente',
      equipoProteccionPersonalYRotulacion: formData.equipoProteccionPersonalYRotulacion || 'Completo',
      dictamenCondiciones: formData.dictamenCondiciones || 'Condición Operativa Satisfactoria (Aprobada)',
      plazoCorreccionDias: Number(formData.plazoCorreccionDias) || 30,
      accionesRequeridas: formData.accionesRequeridas || '',
      notasRecomendaciones: formData.notasRecomendaciones || '',
      evidencias: formData.evidencias || [],
      peritoNombre: formData.peritoNombre || 'Ing. Israel Orozco Arias',
      peritoAfiliacion: formData.peritoAfiliacion || 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: formData.peritoCedula || '15240154',
      peritoTelefono: formData.peritoTelefono || '4431748638',
      peritoEmail: formData.peritoEmail || 'israel9b@hotmail.com',
      firmaDigital: formData.firmaDigital,
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
    setPdfNotification('¡Firma electrónica del Perito estampada exitosamente!');
    setTimeout(() => setPdfNotification(null), 4000);
  };

  const handleExportPdf = async (pageMode: 'both' | 'p3' | 'p4' = 'both', repToExport?: OperatingConditionsReport) => {
    const target = repToExport || selectedReport;
    if (!target) return;

    if (viewMode !== 'document') {
      setSelectedReportId(target.id);
      setViewMode('document');
    }

    setIsExportingPdf(true);
    setPdfNotification('Generando Revisión de Instalaciones Eléctricas en PDF oficial...');

    setTimeout(async () => {
      try {
        if (pageMode === 'both') {
          const filename = `Revision_Instalaciones_Electricas_CFP_${target.folio}_Pags_3_y_4.pdf`;
          await exportMultiPageDocumentToPdf(['doc-revision-pagina-3', 'doc-revision-pagina-4'], filename, false);
        } else if (pageMode === 'p3') {
          const filename = `Revision_Instalaciones_Electricas_CFP_${target.folio}_Pagina_3.pdf`;
          await exportDocumentToPdf('doc-revision-pagina-3', filename, false);
        } else {
          const filename = `Revision_Instalaciones_Electricas_CFP_${target.folio}_Pagina_4.pdf`;
          await exportDocumentToPdf('doc-revision-pagina-4', filename, false);
        }
        setPdfNotification('¡Documento en PDF descargado exitosamente!');
        setTimeout(() => setPdfNotification(null), 4000);
      } catch (err) {
        console.error('Error al exportar Revisión de Instalaciones a PDF:', err);
        setPdfNotification('Error al crear el archivo PDF. Intente de nuevo.');
        setTimeout(() => setPdfNotification(null), 5000);
      } finally {
        setIsExportingPdf(false);
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {pdfNotification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 border border-amber-500/80 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{pdfNotification}</span>
        </div>
      )}

      {/* Main Module Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Revisión de Instalaciones Eléctricas
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                Páginas 3 y 4
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {reports.length} Registros
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluación de subestación, tableros, tierras, pruebas de aislamiento, mantenimiento y evidencias NOM-001/NOM-029
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista ({reports.length})
            </button>
            <button
              onClick={() => {
                if (selectedReport) setViewMode('document');
                else if (reports.length > 0) {
                  setSelectedReportId(reports[0].id);
                  setViewMode('document');
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'document'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Formato Oficial (Pág. 3 y 4)
            </button>
          </div>

          <button
            onClick={handleStartCreate}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Revisión</span>
          </button>

          {viewMode === 'document' && selectedReport && (
            <button
              onClick={() => handleExportPdf('both')}
              disabled={isExportingPdf}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
              title="Descargar Informe en PDF tamaño Carta oficial (Páginas 3 y 4)"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Exportar PDF Completo</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* 1. LIST VIEW */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          
          {/* List Search & Filter Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Folio, Inmueble, Razón Social, Expediente..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterDictamen}
                onChange={(e) => setFilterDictamen(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="todos">Todos los dictámenes</option>
                <option value="Satisfactoria">Satisfactoria</option>
                <option value="Condicionada">Condicionada</option>
                <option value="Alto Riesgo">Alto Riesgo</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No se encontraron informes de revisión</p>
              <p className="text-xs text-slate-500">Comienza levantando una nueva inspección en sitio.</p>
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Primera Revisión</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Folio</th>
                    <th className="px-4 py-3">Inmueble / Razón Social</th>
                    <th className="px-4 py-3">Subestación / Carga</th>
                    <th className="px-4 py-3">Dictamen</th>
                    <th className="px-4 py-3">Evidencias</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredReports.map((rep) => {
                    const isSelected = rep.id === selectedReportId;
                    return (
                      <tr 
                        key={rep.id}
                        className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-cyan-50/40' : ''}`}
                        onClick={() => {
                          setSelectedReportId(rep.id);
                          setViewMode('document');
                        }}
                      >
                        <td className="px-4 py-3 font-mono font-black text-cyan-700 whitespace-nowrap">
                          {rep.folio}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                          <div>{rep.nombreComercial}</div>
                          <div className="text-[10px] text-slate-500 font-normal truncate">{rep.razonSocial || rep.giro}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-800">{rep.capacidadTransformadorKva} kVA</span>
                          <span className="text-[10px] text-slate-500 block">{rep.tensionOperacion}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rep.dictamenCondiciones.includes('Satisfactoria')
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : rep.dictamenCondiciones.includes('Condicionada')
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {rep.dictamenCondiciones.includes('Satisfactoria') && <CheckCircle2 className="w-3 h-3" />}
                            {rep.dictamenCondiciones.includes('Condicionada') && <AlertTriangle className="w-3 h-3" />}
                            {rep.dictamenCondiciones.includes('Alto Riesgo') && <Zap className="w-3 h-3 text-rose-600" />}
                            {rep.dictamenCondiciones.split('(')[0].trim()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {rep.evidencias && rep.evidencias.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                              <Camera className="w-3 h-3" />
                              {rep.evidencias.length} fotos
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin fotos</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                          {rep.fechaInspeccion}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedReportId(rep.id);
                                setViewMode('document');
                              }}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Ver Formato Oficial (Págs. 3 y 4)"
                            >
                              <FileText className="w-4 h-4 text-cyan-600" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(rep)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Editar datos"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleExportPdf('both', rep)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Exportar a PDF oficial"
                            >
                              <Download className="w-4 h-4 text-amber-600" />
                            </button>
                            {activeRole === 'Perito Dictaminador' && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar la revisión ${rep.folio}?`)) {
                                    onDeleteReport(rep.id);
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FORM VIEW: LEVANTAMIENTO DE INSPECCIÓN */}
      {/* ======================================================== */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isEditing ? `Editar Revisión: ${formData.folio}` : 'Nueva Revisión de Instalaciones Eléctricas'}
              </h3>
              <p className="text-xs text-slate-500">
                Levantamiento técnico de campo según NOM-001-SEDE-2012 y NOM-029-STPS-2011 (Páginas 3 y 4)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
          </div>

          {/* Section: Folio y Datos Generales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Folio Oficial</label>
              <input
                type="text"
                value={formData.folio || ''}
                onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-black text-cyan-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clave de Expediente</label>
              <input
                type="text"
                value={formData.claveExpediente || ''}
                onChange={(e) => setFormData({ ...formData, claveExpediente: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Inspección</label>
              <input
                type="text"
                value={formData.fechaInspeccion || ''}
                onChange={(e) => setFormData({ ...formData, fechaInspeccion: e.target.value })}
                placeholder="19-oct-26"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* Section: Datos del Inmueble y Titular */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Datos del Inmueble y Titular
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Comercial del Inmueble *</label>
                <input
                  type="text"
                  required
                  value={formData.nombreComercial || ''}
                  onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                  placeholder="Ej. PLAZA COMERCIAL LAS AMÉRICAS"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Razón Social</label>
                <input
                  type="text"
                  value={formData.razonSocial || ''}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                  placeholder="Ej. INMOBILIARIA MORELIA S.A. DE C.V."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">RFC</label>
                <input
                  type="text"
                  value={formData.rfc || ''}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Giro / Actividad</label>
                <input
                  type="text"
                  value={formData.giro || ''}
                  onChange={(e) => setFormData({ ...formData, giro: e.target.value })}
                  placeholder="Ej. COMERCIAL / SERVICIOS"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Calle y Número</label>
                <input
                  type="text"
                  value={formData.calleNumero || ''}
                  onChange={(e) => setFormData({ ...formData, calleNumero: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Colonia</label>
                <input
                  type="text"
                  value={formData.colonia || ''}
                  onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Municipio y Estado</label>
                <input
                  type="text"
                  value={formData.municipio || 'MORELIA'}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section: Parámetros Eléctricos Operativos */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Parámetros Técnicos Medidos en Sitio
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Instalación</label>
                <select
                  value={formData.tipoInstalacion || 'Media y Baja Tensión'}
                  onChange={(e: any) => setFormData({ ...formData, tipoInstalacion: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Baja Tensión">Baja Tensión</option>
                  <option value="Media y Baja Tensión">Media y Baja Tensión</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tensión Operativa</label>
                <input
                  type="text"
                  value={formData.tensionOperacion || '220/127 V'}
                  onChange={(e) => setFormData({ ...formData, tensionOperacion: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subestación / Trafo (kVA)</label>
                <input
                  type="number"
                  value={formData.capacidadTransformadorKva || 0}
                  onChange={(e) => setFormData({ ...formData, capacidadTransformadorKva: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Resistencia Tierra (Ω)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.resistenciaTierraOhms || 0}
                  onChange={(e) => setFormData({ ...formData, resistenciaTierraOhms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section: EVALUACIÓN DE COMPONENTES EN SITIO (PÁGINA 3) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Evaluación Técnica de Componentes (Página 3)
              </h4>
              <span className="text-[10px] font-mono font-bold text-slate-500">NOM-001-SEDE-2012</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subestación Eléctrica</label>
                <select
                  value={formData.estadoSubestacion || 'Satisfactorio'}
                  onChange={(e: any) => setFormData({ ...formData, estadoSubestacion: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Satisfactorio">Satisfactorio</option>
                  <option value="Observaciones Menores">Observaciones Menores</option>
                  <option value="Crítico">Crítico</option>
                  <option value="No Aplica">No Aplica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tableros de Distribución</label>
                <select
                  value={formData.estadoTableros || 'Satisfactorio'}
                  onChange={(e: any) => setFormData({ ...formData, estadoTableros: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Satisfactorio">Satisfactorio</option>
                  <option value="Observaciones Menores">Observaciones Menores</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Conductores & Canalizaciones</label>
                <select
                  value={formData.estadoConductoresCanalizaciones || 'Satisfactorio'}
                  onChange={(e: any) => setFormData({ ...formData, estadoConductoresCanalizaciones: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Satisfactorio">Satisfactorio</option>
                  <option value="Observaciones Menores">Observaciones Menores</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Sistema de Puesta a Tierra</label>
                <select
                  value={formData.estadoSistemaTierras || 'Satisfactorio'}
                  onChange={(e: any) => setFormData({ ...formData, estadoSistemaTierras: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Satisfactorio">Satisfactorio</option>
                  <option value="Observaciones Menores">Observaciones Menores</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Protecciones contra Sobrecarga</label>
                <select
                  value={formData.estadoProteccionesSobrecarga || 'Satisfactorio'}
                  onChange={(e: any) => setFormData({ ...formData, estadoProteccionesSobrecarga: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Satisfactorio">Satisfactorio</option>
                  <option value="Observaciones Menores">Observaciones Menores</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Alumbrado de Emergencia</label>
                <select
                  value={formData.estadoAlumbradoEmergencia || 'Satisfactorio'}
                  onChange={(e: any) => setFormData({ ...formData, estadoAlumbradoEmergencia: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Satisfactorio">Satisfactorio</option>
                  <option value="Observaciones Menores">Observaciones Menores</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: CONDICIONES DE MANTENIMIENTO Y PRUEBAS (PÁGINA 4) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Mantenimiento y Pruebas (Página 4)
              </h4>
              <span className="text-[10px] font-mono font-bold text-slate-500">NOM-029-STPS-2011</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Pruebas Aislamiento (Megger)</label>
                <select
                  value={formData.pruebasAislamientoMegger || 'Conforme'}
                  onChange={(e: any) => setFormData({ ...formData, pruebasAislamientoMegger: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Conforme">Conforme</option>
                  <option value="No Conforme">No Conforme</option>
                  <option value="No Realizada">No Realizada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Termografía Infrarroja</label>
                <select
                  value={formData.pruebasTermografiaInfrarroja || 'Sin Puntos Calientes'}
                  onChange={(e: any) => setFormData({ ...formData, pruebasTermografiaInfrarroja: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Sin Puntos Calientes">Sin Puntos Calientes</option>
                  <option value="Puntos Calientes Detectados">Puntos Calientes Detectados</option>
                  <option value="No Realizada">No Realizada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Limpieza Cuarto Eléctrico</label>
                <select
                  value={formData.limpiezaOrdenCuartoElectrico || 'Excelente'}
                  onChange={(e: any) => setFormData({ ...formData, limpiezaOrdenCuartoElectrico: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Excelente">Excelente</option>
                  <option value="Aceptable">Aceptable</option>
                  <option value="Deficiente">Deficiente</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">EPP y Señalización de Seguridad</label>
                <select
                  value={formData.equipoProteccionPersonalYRotulacion || 'Completo'}
                  onChange={(e: any) => setFormData({ ...formData, equipoProteccionPersonalYRotulacion: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Completo">Completo</option>
                  <option value="Incompleto">Incompleto</option>
                  <option value="Ausente">Ausente</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fecha Último Mantenimiento</label>
                <input
                  type="text"
                  value={formData.ultimoMantenimientoFecha || ''}
                  onChange={(e) => setFormData({ ...formData, ultimoMantenimientoFecha: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Responsable del Mantenimiento</label>
                <input
                  type="text"
                  value={formData.responsableMantenimiento || ''}
                  onChange={(e) => setFormData({ ...formData, responsableMantenimiento: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section: EVIDENCIA FOTOGRÁFICA (Requested feature: Tomar foto / Subir imagen) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <EvidenceUploader
              evidencias={formData.evidencias || []}
              onChange={(newEvidencias) => setFormData({ ...formData, evidencias: newEvidencias })}
            />
          </div>

          {/* Section: DIAGNÓSTICO FINAL */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              3. Resultado del Dictamen y Acciones Requeridas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Resultado de la Revisión</label>
                <select
                  value={formData.dictamenCondiciones || 'Condición Operativa Satisfactoria (Aprobada)'}
                  onChange={(e: any) => setFormData({ ...formData, dictamenCondiciones: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900"
                >
                  <option value="Condición Operativa Satisfactoria (Aprobada)">Condición Operativa Satisfactoria (Aprobada)</option>
                  <option value="Condición Condicionada a Mantenimiento">Condición Condicionada a Mantenimiento</option>
                  <option value="Condición de Alto Riesgo Eléctrico">Condición de Alto Riesgo Eléctrico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Plazo de Corrección (Días)</label>
                <input
                  type="number"
                  value={formData.plazoCorreccionDias || 30}
                  onChange={(e) => setFormData({ ...formData, plazoCorreccionDias: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Acciones Requeridas y Recomendaciones</label>
                <textarea
                  rows={2}
                  value={formData.accionesRequeridas || ''}
                  onChange={(e) => setFormData({ ...formData, accionesRequeridas: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              Guardar y Ver Formato
            </button>
          </div>

        </form>
      )}

      {/* ======================================================== */}
      {/* 3. DOCUMENT VIEW: PÁGINAS 3 Y 4 (FORMATO OFICIAL BLANCO) */}
      {/* ======================================================== */}
      {viewMode === 'document' && selectedReport && (
        <div className="space-y-6">
          
          {/* Top Controls Bar */}
          <div className="no-print bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lista</span>
              </button>

              <button
                onClick={() => handleStartEdit(selectedReport)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                onClick={() => setIsSignatureModalOpen(true)}
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-700" />
                <span>Firmar Perito</span>
              </button>
            </div>

            {/* Page View Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveDocumentPage('both')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'both' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Páginas 3 y 4
              </button>
              <button
                type="button"
                onClick={() => setActiveDocumentPage('p3')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'p3' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sólo Pág. 3
              </button>
              <button
                type="button"
                onClick={() => setActiveDocumentPage('p4')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'p4' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sólo Pág. 4
              </button>
            </div>

            {/* Export PDF on Official White Paper */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Papel Blanco Oficial</span>
              </div>

              <button
                onClick={() => handleExportPdf(activeDocumentPage)}
                disabled={isExportingPdf}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Descargando PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {activeDocumentPage === 'both' ? 'Exportar PDF (Pág. 3 y 4)' : `Exportar PDF (${activeDocumentPage.toUpperCase()})`}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ==================================================================== */}
          {/* PÁGINA 3: CONDICIONES OPERATIVAS Y EVALUACIÓN TÉCNICA                */}
          {/* ==================================================================== */}
          {(activeDocumentPage === 'both' || activeDocumentPage === 'p3') && (
            <div className="flex flex-col items-center">
              <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-cyan-300 rounded-full text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>REVISIÓN DE INSTALACIONES ELÉCTRICAS — PÁGINA 3 DE 4</span>
              </div>

              <div
                id="doc-revision-pagina-3"
                className="w-full max-w-4xl p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-0 bg-white"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  backgroundColor: '#ffffff',
                  backgroundImage: 'none',
                }}
              >
                <div className="space-y-3">
                  
                  {/* Institutional Header */}
                  <div className="text-center space-y-1 pb-1">
                    <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide text-slate-900 uppercase">
                      COLEGIO FEDERAL DE PERITOS
                    </h1>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
                      REVISIÓN DE INSTALACIONES ELÉCTRICAS
                    </h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                      PÁGINA 3 DE 4 • EVALUACIÓN TÉCNICA Y CONDICIONES OPERATIVAS EN SITIO
                    </p>
                    <p className="text-[9.5px] text-slate-600 font-sans">
                      Conforme a las Especificaciones Técnicas de la Norma Oficial Mexicana <strong>NOM-001-SEDE-2012</strong>
                    </p>
                  </div>

                  {/* Subheader: Tipo de Instalación + CFP Logo */}
                  <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-900">
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-900 block">Clasificación Técnica de la Instalación:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                          {selectedReport.tipoInstalacion === 'Baja Tensión' ? 'X' : ''}
                        </div>
                        <span>Instalación Eléctrica en Baja Tensión (&lt; 1,000 V)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                          {selectedReport.tipoInstalacion === 'Media y Baja Tensión' ? 'X' : ''}
                        </div>
                        <span>Instalación Eléctrica en Media y Baja Tensión (≥ 1,000 V)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                        <CfpLogo size={64} />
                      </div>
                      <div className="flex flex-col text-left leading-tight font-serif">
                        <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-900 uppercase">
                          COLEGIO
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-900 uppercase">
                          FEDERAL
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-900 uppercase">
                          PERITOS
                        </span>
                        <span className="text-[9px] font-bold text-amber-700 tracking-widest">CFP</span>
                      </div>
                    </div>
                  </div>

                  {/* Preamble */}
                  <div className="text-justify text-[10.5px] sm:text-xs leading-relaxed text-slate-900 font-serif border-y border-slate-900 py-1.5 my-1">
                    El perito dictaminador comisionado hace constar que realizó la inspección física y ocular en el inmueble referenciado, verificando el cumplimiento normativo de los alimentadores, tableros, conductores, canalizaciones y protecciones:
                  </div>

                  {/* OFFICIAL TABLE: PÁGINA 3 */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white">
                    
                    {/* Row 1: Folio, Clave, Fecha */}
                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs font-bold">
                      <div className="col-span-4 p-1.5 flex items-center">
                        <span>Revisión Folio: <strong className="font-mono text-cyan-900">{selectedReport.folio}</strong></span>
                      </div>
                      <div className="col-span-5 p-1.5 text-center font-mono text-[10px] sm:text-xs flex items-center justify-center">
                        {selectedReport.claveExpediente}
                      </div>
                      <div className="col-span-3 p-1.5 flex items-center justify-end pr-2">
                        <span>Fecha: <strong className="font-mono">{selectedReport.fechaInspeccion}</strong></span>
                      </div>
                    </div>

                    {/* Row 2: Inmueble y Giro */}
                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs">
                      <div className="col-span-3 p-1.5 font-bold">Inmueble / Razón Social:</div>
                      <div className="col-span-9 p-1.5 font-bold uppercase text-[11px]">
                        {selectedReport.nombreComercial} {selectedReport.razonSocial ? `— ${selectedReport.razonSocial}` : ''}
                      </div>
                    </div>

                    {/* Row 3: Domicilio */}
                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs">
                      <div className="col-span-3 p-1.5 font-bold">Ubicación / Domicilio:</div>
                      <div className="col-span-9 p-1.5 uppercase text-[10.5px]">
                        {selectedReport.calleNumero}, COL. {selectedReport.colonia}, {selectedReport.municipio}, {selectedReport.ciudadEstado} C.P. {selectedReport.codigoPostal}
                      </div>
                    </div>

                    {/* Row 4: Parámetros Eléctricos */}
                    <div className="grid grid-cols-4 divide-x-2 divide-slate-900 text-[11px]">
                      <div className="p-1.5 text-center">
                        <div className="text-[9.5px] text-slate-600">Tensión Operativa:</div>
                        <div className="font-mono font-bold text-slate-900">{selectedReport.tensionOperacion}</div>
                      </div>
                      <div className="p-1.5 text-center">
                        <div className="text-[9.5px] text-slate-600">Subestación / Trafo:</div>
                        <div className="font-mono font-bold text-slate-900">{selectedReport.capacidadTransformadorKva} kVA</div>
                      </div>
                      <div className="p-1.5 text-center">
                        <div className="text-[9.5px] text-slate-600">Demanda Medida:</div>
                        <div className="font-mono font-bold text-slate-900">{selectedReport.demandaMedidaKw} kW</div>
                      </div>
                      <div className="p-1.5 text-center">
                        <div className="text-[9.5px] text-slate-600">Resistencia Tierra:</div>
                        <div className="font-mono font-bold text-slate-900">{selectedReport.resistenciaTierraOhms} Ω</div>
                      </div>
                    </div>

                    {/* Row 5: CONDICIONES OPERATIVAS Y EVALUACIÓN EN SITIO */}
                    <div className="p-2 space-y-1.5">
                      <div className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-300 pb-1">
                        1. Inspección de Componentes Eléctricos en Sitio:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10.5px]">
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Subestación Eléctrica:</span>
                          <span className="font-black text-slate-950">{selectedReport.estadoSubestacion}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Tableros de Distribución:</span>
                          <span className="font-black text-slate-950">{selectedReport.estadoTableros}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Conductores y Canalizaciones:</span>
                          <span className="font-black text-slate-950">{selectedReport.estadoConductoresCanalizaciones}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Puesta a Tierra y Electrodos:</span>
                          <span className="font-black text-slate-950">{selectedReport.estadoSistemaTierras}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Protecciones contra Sobrecarga:</span>
                          <span className="font-black text-slate-950">{selectedReport.estadoProteccionesSobrecarga}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Alumbrado de Emergencia:</span>
                          <span className="font-black text-slate-950">{selectedReport.estadoAlumbradoEmergencia}</span>
                        </div>
                      </div>
                    </div>

                    {/* Row 6: Criterios Técnicos Adicionales */}
                    <div className="p-2 space-y-1 text-[10.5px]">
                      <div className="font-bold text-slate-900 uppercase">Criterios de Seguridad Verificados:</div>
                      <p className="text-justify text-slate-800 leading-snug">
                        Se verificó que los circuitos derivados cuentan con la debida identificación en directorio de tableros, tapas de protección colocadas, ausencia de conductores expuestos y espacios de trabajo libres conforme al Artículo 110-26 de la NOM-001-SEDE-2012.
                      </p>
                    </div>

                  </div>

                  {/* Footer Página 3 */}
                  <div className="pt-2 flex items-center justify-between text-[9.5px] font-mono text-slate-600 border-t border-slate-900">
                    <div>
                      <span>CFP • REVISIÓN DE INSTALACIONES ELÉCTRICAS • FOLIO: {selectedReport.folio}</span>
                    </div>
                    <div className="font-bold text-slate-900">
                      PÁGINA 3 DE 4 — CONTINÚA EN PÁGINA 4 (MANTENIMIENTO Y DICTAMEN)
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* PÁGINA 4: MANTENIMIENTO, PRUEBAS, DICTAMEN Y EVIDENCIAS FOTOGRÁFICAS */}
          {/* ==================================================================== */}
          {(activeDocumentPage === 'both' || activeDocumentPage === 'p4') && (
            <div className="flex flex-col items-center">
              <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-amber-300 rounded-full text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>REVISIÓN DE INSTALACIONES ELÉCTRICAS — PÁGINA 4 DE 4</span>
              </div>

              <div
                id="doc-revision-pagina-4"
                className="w-full max-w-4xl p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-0 bg-white"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  backgroundColor: '#ffffff',
                  backgroundImage: 'none',
                }}
              >
                <div className="space-y-3">
                  
                  {/* Institutional Header */}
                  <div className="text-center space-y-1 pb-1">
                    <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide text-slate-900 uppercase">
                      COLEGIO FEDERAL DE PERITOS
                    </h1>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
                      REVISIÓN DE INSTALACIONES ELÉCTRICAS
                    </h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                      PÁGINA 4 DE 4 • MANTENIMIENTO, PRUEBAS Y DICTAMEN FINAL DE SEGURIDAD
                    </p>
                    <p className="text-[9.5px] text-slate-600 font-sans">
                      Conforme a la Norma Oficial Mexicana <strong>NOM-029-STPS-2011</strong> (Mantenimiento de Instalaciones Eléctricas)
                    </p>
                  </div>

                  {/* Bar: Folio & Reference */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs font-bold border-2 border-slate-900 bg-white">
                    <div className="col-span-4 p-1.5">
                      <span>Revisión Folio: <strong className="font-mono text-cyan-900">{selectedReport.folio}</strong></span>
                    </div>
                    <div className="col-span-5 p-1.5 text-center font-mono text-[10px] sm:text-xs">
                      {selectedReport.claveExpediente}
                    </div>
                    <div className="col-span-3 p-1.5 text-right pr-2">
                      <span>Inmueble: <strong className="truncate uppercase">{selectedReport.nombreComercial}</strong></span>
                    </div>
                  </div>

                  {/* OFFICIAL TABLE: PÁGINA 4 */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white">
                    
                    {/* Row 1: CONDICIONES DE MANTENIMIENTO Y PRUEBAS */}
                    <div className="p-2 space-y-1.5">
                      <div className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-300 pb-1">
                        2. Protocolos de Mantenimiento Preventivo y Pruebas Realizadas:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10.5px]">
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Pruebas Megger (Aislamiento):</span>
                          <span className="font-black text-slate-950">{selectedReport.pruebasAislamientoMegger}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Termografía Infrarroja:</span>
                          <span className="font-black text-slate-950">{selectedReport.pruebasTermografiaInfrarroja}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Cuarto Eléctrico (Orden/Limpieza):</span>
                          <span className="font-black text-slate-950">{selectedReport.limpiezaOrdenCuartoElectrico}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">EPP y Señalización de Seguridad:</span>
                          <span className="font-black text-slate-950">{selectedReport.equipoProteccionPersonalYRotulacion}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Último Mantenimiento Realizado:</span>
                          <span className="font-mono font-bold text-slate-950">{selectedReport.ultimoMantenimientoFecha}</span>
                        </div>
                        <div className="border border-slate-900 p-1.5 rounded">
                          <span className="font-semibold block text-[10px] text-slate-700">Responsable Técnico:</span>
                          <span className="truncate block font-medium uppercase text-slate-950">{selectedReport.responsableMantenimiento}</span>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: EVIDENCIAS FOTOGRÁFICAS EN FORMATO */}
                    <div className="p-2 space-y-1.5">
                      <div className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-300 pb-1 flex items-center justify-between">
                        <span>Evidencias Fotográficas de la Inspección en Sitio:</span>
                        <span className="text-[10px] font-mono text-slate-600">
                          {selectedReport.evidencias && selectedReport.evidencias.length > 0 
                            ? `${selectedReport.evidencias.length} evidencias adjuntas`
                            : 'Evidencia documental en expediente'}
                        </span>
                      </div>

                      {selectedReport.evidencias && selectedReport.evidencias.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {selectedReport.evidencias.slice(0, 4).map((evi, idx) => (
                            <div key={evi.id} className="border border-slate-900 p-1 bg-white rounded text-center">
                              <img
                                src={evi.dataUrl}
                                alt={evi.nombre}
                                className="h-18 w-full object-cover rounded mb-1"
                              />
                              <p className="text-[8.5px] font-bold text-slate-900 truncate">
                                Foto #{idx + 1}: {evi.descripcion || evi.nombre}
                              </p>
                              <span className="text-[8px] font-mono text-slate-500 block">{evi.fecha}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed border-slate-400 rounded text-center text-xs text-slate-500">
                          Registro fotográfico archivado en el expediente técnico pericial digital.
                        </div>
                      )}
                    </div>

                    {/* Row 3: RESULTADO DEL DICTAMEN DE REVISIÓN */}
                    <div className="p-2.5 space-y-1.5 text-xs">
                      <div className="flex justify-between items-baseline border-b border-slate-900 pb-1">
                        <span className="font-black uppercase text-[11px]">Resultado del Dictamen de Condiciones:</span>
                        <span className="font-black text-slate-950 font-mono text-[11.5px] uppercase">
                          {selectedReport.dictamenCondiciones}
                        </span>
                      </div>
                      {selectedReport.accionesRequeridas && (
                        <div className="pt-0.5 text-[11px] text-slate-800">
                          <span className="font-bold">Acciones Correctivas y Medidas Preventivas: </span>
                          {selectedReport.accionesRequeridas} (Plazo sugerido: {selectedReport.plazoCorreccionDias} días naturales).
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Notas Técnicas */}
                  <div className="border-2 border-slate-900 p-2 bg-white text-[10px] sm:text-[10.5px] leading-snug space-y-0.5">
                    <div className="font-black text-slate-900 uppercase">NOTAS TÉCNICAS Y FUNDAMENTO LEGAL:</div>
                    <p className="text-slate-800 text-justify">
                      El presente informe de revisión de instalaciones eléctricas avala que los equipos, circuitos y protecciones fueron inspeccionados con instrumental calibrado de conformidad con la <strong>NOM-001-SEDE-2012</strong> y las directrices de seguridad laboral de la <strong>NOM-029-STPS-2011</strong>.
                    </p>
                  </div>

                  {/* Perito Signature & Validation */}
                  <div className="pt-2 flex flex-col items-center justify-center">
                    <div className="text-center font-black tracking-widest text-slate-900 uppercase text-xs mb-1">
                      PERITO RESPONSABLE DE LA INSPECCIÓN
                    </div>

                    {selectedReport.firmaDigital ? (
                      <img
                        src={selectedReport.firmaDigital}
                        alt="Firma del Perito"
                        className="h-20 object-contain filter drop-shadow-xs mb-1"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsSignatureModalOpen(true)}
                        className="no-print h-16 w-64 border-2 border-dashed border-amber-600/60 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center justify-center gap-2 p-2 text-center transition cursor-pointer mb-1"
                      >
                        <PenTool className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900">Estampar Firma Electrónica</span>
                      </button>
                    )}

                    <div className="w-72 border-b-2 border-slate-900 mb-0.5"></div>
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {selectedReport.peritoNombre}
                    </span>
                  </div>

                  {/* Footer Bar: QR + Perito Credentials */}
                  <div className="grid grid-cols-12 gap-2 items-center pt-2 border-t border-slate-900">
                    <div className="col-span-3 flex flex-col items-center justify-center">
                      <div
                        className="p-1 bg-white border border-slate-300 rounded shadow-xs"
                        dangerouslySetInnerHTML={{
                          __html: generateQrMatrixSvg(
                            `CFP-REV:${selectedReport.folio}:${selectedReport.claveExpediente}`,
                            85
                          ),
                        }}
                      />
                      <span className="text-[8px] font-mono font-bold text-slate-600 mt-0.5">
                        CERTIFICACIÓN QR
                      </span>
                    </div>

                    <div className="col-span-9 space-y-0.5 text-[10.5px] font-serif pl-2">
                      <div>
                        <span className="font-bold text-slate-900">No. Afiliación CFP:</span>{' '}
                        <span className="font-mono">{selectedReport.peritoAfiliacion}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">Cédula Profesional:</span>{' '}
                        <span className="font-mono font-bold">{selectedReport.peritoCedula}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">Contacto:</span>{' '}
                        <span className="font-mono">{selectedReport.peritoTelefono} • {selectedReport.peritoEmail}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-0.5">
                        <div>
                          <span className="font-bold text-slate-900">Vigencia de Inspección:</span> 12 meses
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900 mr-2 text-xs">FOLIO:</span>
                          <span className="font-black text-rose-600 text-sm font-mono">
                            {selectedReport.folio}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* End of Page 4 mark */}
                  <div className="text-center text-[9px] font-mono text-slate-500 pt-1">
                    --- FIN DEL INFORME DE REVISIÓN DE INSTALACIONES ELÉCTRICAS (PÁGINA 4 DE 4) ---
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={handleApplySignature}
        signerName={selectedReport?.peritoNombre || 'Perito'}
        peritoNombre={selectedReport?.peritoNombre || 'Ing. Israel Orozco Arias'}
        cedula={selectedReport?.peritoCedula || '15240154'}
        title="Firma Electrónica del Perito"
      />

    </div>
  );
};
