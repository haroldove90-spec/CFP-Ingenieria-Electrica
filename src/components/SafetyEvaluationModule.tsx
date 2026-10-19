import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  ShieldAlert,
  Camera,
  Layers,
  FileCheck2,
  Calendar,
  Building,
  HardHat
} from 'lucide-react';
import { SafetyEvaluationReport, UserRole } from '../types';
import { generateQrMatrixSvg } from '../utils/barcode';
import { exportDocumentToPdf, exportMultiPageDocumentToPdf } from '../utils/pdfExport';
import { SignatureModal } from './SignatureModal';
import { CfpLogo } from './CfpLogo';
import { EvidenceUploader } from './EvidenceUploader';

interface SafetyEvaluationModuleProps {
  reports: SafetyEvaluationReport[];
  activeRole: UserRole;
  onSaveReport: (report: SafetyEvaluationReport) => void;
  onDeleteReport: (id: string) => void;
  initialMode?: 'document' | 'form' | 'list';
  autoCreate?: boolean;
}

export const SafetyEvaluationModule: React.FC<SafetyEvaluationModuleProps> = ({
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
  const [activeDocumentPage, setActiveDocumentPage] = useState<'all' | 'p5' | 'p6' | 'p7' | 'p8'>('all');
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCalificacion, setFilterCalificacion] = useState<string>('todos');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  // Signature modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<SafetyEvaluationReport>>({});
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

    const matchesFilter = filterCalificacion === 'todos' || r.calificacionSeguridad.includes(filterCalificacion);
    return matchesSearch && matchesFilter;
  });

  const handleStartCreate = () => {
    const nextFolioNum = reports.length > 0 
      ? Math.max(...reports.map(r => parseInt(r.folio.replace(/\D/g, '') || '0', 10))) + 1 
      : 56;
    const newFolio = String(nextFolioNum).padStart(3, '0');
    
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).replace('.', '');

    const newReport: Partial<SafetyEvaluationReport> = {
      id: `eval-${Date.now()}`,
      folio: newFolio,
      claveExpediente: `CFP0125/FEEMS/IOA/${newFolio}/2026`,
      fechaEvaluacion: dateFormatted,

      // P5
      razonSocial: '',
      nombreComercial: '',
      rfc: '',
      giro: 'COMERCIAL / INDUSTRIAL',
      calleNumero: '',
      colonia: '',
      municipio: 'MORELIA',
      ciudadEstado: 'MORELIA, MICHOACÁN',
      codigoPostal: '58000',
      telefono: '',
      representanteLegal: '',

      companiaSuministradora: 'Comisión Federal de Electricidad (CFE Suministrador de Servicios Básicos)',
      noServicioRpu: '',
      tarifaSuministro: 'GDMTO (Gran Demanda Media Tensión Ordinaria)',
      tensionSuministro: '13,200 V / 220-127 V',
      frecuenciaHz: 60,
      fasesHilos: '3 Fases - 4 Hilos',

      tipoSubestacion: 'Pedestal',
      capacidadTransformadorKva: 150,
      marcaNumeroSerie: '',
      tipoEnfriamiento: 'OA (Enfriamiento Natural)',
      nivelEstadoAceite: 'Normal / Aceptable',
      proteccionFisicaCercaCandado: 'Conforme',

      electrodoTierraConexion: 'Conforme',
      resistenciaTierraMedidaOhms: 7.5,
      sistemaPararrayosBajantes: 'Instalado y Conforme',

      // P6
      gabineteTipoNema: 'NEMA 1 Interior',
      directorioCircuitosIdentificado: '100% Identificado y Legible',
      cubiertaFrontalProteccionContacto: 'Completa y Ajustada',
      espacioReservaEspaciosVacios: 'Con tapas ciegas',

      interruptorPrincipalCapacidadA: 250,
      coordinacionProtecciones: 'Adecuada y Selectiva',
      proteccionFallaTierraGfci: 'Instalada en Zonas Húmedas',
      estadoInterruptoresTermomagneticos: 'Buen estado operativo',

      tipoConductorAislamiento: 'THW-LS 600V 75°C / 90°C Antiflama',
      codigoColoresNormativo: 'Conforme NOM-001',
      canalizacionesTuberiasCharolas: 'Tubería Conduit PG/PD Hermética',
      factorLlenadoCanalizaciones: 'Conforme (<40%)',

      // P7
      espacioTrabajoTableros: 'Conforme (>90cm despejado)',
      puertasAccesoEscape: 'Libres y con apertura hacia afuera',
      senalesAdvertenciaRiesgoElectrico: 'Completas y Visibles',
      diagramaUnifilarActualizado: 'Disponible y Visible en Tablero',
      tapetesDielectricosAislantes: 'Colocados en tableros principales',
      iluminacionNormalYEmergencia: 'Luminarias normales y de emergencia operativas',
      extintorTipoCo2PqsCercano: 'Extintor CO2 / PQS vigente y despejado',
      disponibilidadEppDielectrico: 'Completo (Guantes, careta arc-flash, calzado)',

      // P8
      medicionTensionFasesV: 'F1-F2: 220V, F2-F3: 220V, F3-F1: 220V | F-N: 127V',
      pruebaAislamientoMegger: 'Conforme (>100 MΩ)',
      termografiaInfrarroja: 'Sin puntos calientes',
      evidencias: [],
      noConformidadesDetectadas: 'Ninguna desviación crítica detectada.',
      medidasCorrectivasInmediatas: 'Mantener las rutinas periódicas de mantenimiento preventivo y limpieza.',
      plazoSubsanacionDias: 30,
      calificacionSeguridad: 'Instalación Eléctrica Segura (Aprobada)',

      peritoNombre: 'Ing. Israel Orozco Arias',
      peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: '15240154',
      peritoTelefono: '4431748638',
      peritoEmail: 'israel9b@hotmail.com',
      esMuestra: false
    };

    setFormData(newReport);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleStartEdit = (report: SafetyEvaluationReport) => {
    setFormData({ ...report });
    setIsEditing(true);
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.folio || !formData.razonSocial) {
      alert('Por favor complete los campos obligatorios (Folio y Razón Social).');
      return;
    }

    const fullReport: SafetyEvaluationReport = {
      ...(formData as SafetyEvaluationReport),
      id: formData.id || `eval-${Date.now()}`,
    };

    onSaveReport(fullReport);
    setSelectedReportId(fullReport.id);
    setViewMode('document');
  };

  const handleExportPdf = async (pageMode: 'all' | 'p5' | 'p6' | 'p7' | 'p8') => {
    if (!selectedReport) return;
    setIsExportingPdf(true);
    setPdfNotification(null);

    try {
      const folioClean = selectedReport.folio.replace(/[^a-zA-Z0-9_-]/g, '_');
      const baseFilename = `EVALUACION_SEGURIDAD_${folioClean}_${selectedReport.claveExpediente.replace(/\//g, '_')}`;

      let success = false;
      if (pageMode === 'all') {
        success = await exportMultiPageDocumentToPdf(
          ['doc-eval-pagina-5', 'doc-eval-pagina-6', 'doc-eval-pagina-7', 'doc-eval-pagina-8'],
          `${baseFilename}_PAGINAS_5_A_8`,
          false
        );
      } else {
        const pageNum = pageMode.replace('p', '');
        const elementId = `doc-eval-pagina-${pageNum}`;
        success = await exportDocumentToPdf(elementId, `${baseFilename}_PAGINA_${pageNum}`, false);
      }

      if (success) {
        setPdfNotification('PDF exportado exitosamente con fondo blanco oficial de alta fidelidad.');
        setTimeout(() => setPdfNotification(null), 5000);
      }
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Hubo un error al generar el PDF. Por favor verifique e intente nuevamente.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveSignature = (signatureDataUrl: string) => {
    if (!selectedReport) return;
    const updated = {
      ...selectedReport,
      firmaDigital: signatureDataUrl,
    };
    onSaveReport(updated);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Módulo Oficial CFP • Páginas 5 a 8
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              NOM-001-SEDE-2012 / NOM-029-STPS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Evaluación de Instalaciones Eléctricas en Materia de Seguridad
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Formato oficial pericial de 4 páginas: Subestaciones, Tableros, Seguridad Laboral, Pruebas y Evidencias.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode !== 'list' && (
            <button
              onClick={() => setViewMode('list')}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ver Listado</span>
            </button>
          )}

          {viewMode !== 'document' && selectedReport && (
            <button
              onClick={() => setViewMode('document')}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Ver Formato Impreso</span>
            </button>
          )}

          <button
            onClick={handleStartCreate}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Evaluación</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {pdfNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{pdfNotification}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LIST VIEW                                             */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por folio, cliente, expediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterCalificacion}
                onChange={(e) => setFilterCalificacion(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="todos">Todas las Calificaciones</option>
                <option value="Segura (Aprobada)">Instalación Segura</option>
                <option value="Condicionada">Condicionada a Correcciones</option>
                <option value="Alto Riesgo">Alto Riesgo Inminente</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => {
              const isSelected = report.id === selectedReportId;
              const isAprobado = report.calificacionSeguridad.includes('Aprobada');
              const isRiesgo = report.calificacionSeguridad.includes('Alto Riesgo');

              return (
                <div
                  key={report.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between cursor-pointer ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setSelectedReportId(report.id);
                    setViewMode('document');
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-400 font-mono text-xs font-black">
                          FOLIO {report.folio}
                        </span>
                        {report.esMuestra && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-bold">
                            MUESTRA
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                        isAprobado 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : isRiesgo 
                          ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {isAprobado ? <ShieldCheck className="w-3 h-3 text-emerald-600" /> : <ShieldAlert className="w-3 h-3 text-amber-600" />}
                        {isAprobado ? 'SEGURA' : isRiesgo ? 'ALTO RIESGO' : 'CONDICIONADA'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">
                        {report.nombreComercial || report.razonSocial}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium line-clamp-1">
                        {report.razonSocial}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">
                        Expediente: {report.claveExpediente}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Subestación:</span>
                        <span className="font-semibold text-slate-800">{report.tipoSubestacion} ({report.capacidadTransformadorKva} kVA)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tierra Medida:</span>
                        <span className="font-semibold text-slate-800">{report.resistenciaTierraMedidaOhms} Ω</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[10px]">Ubicación:</span>
                        <span className="font-semibold text-slate-800">{report.municipio}, {report.ciudadEstado}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {report.fechaEvaluacion}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStartEdit(report)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="Editar evaluación"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la evaluación folio ${report.folio}?`)) {
                            onDeleteReport(report.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Eliminar evaluación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No se encontraron evaluaciones</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No hay registros que coincidan con los criterios de búsqueda. Cree una nueva evaluación con el botón superior.
              </p>
              <button
                onClick={handleStartCreate}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-black rounded-xl inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Evaluación de Seguridad</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FORM VIEW (EDICIÓN / CAPTURA DE DATOS)                */}
      {/* ======================================================== */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {isEditing ? 'Modificando Formato' : 'Nuevo Formato'}
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Formato para Evaluación de Instalaciones Eléctricas en Materia de Seguridad
              </h3>
              <p className="text-xs text-slate-500">
                Capture la información técnica requerida para la emisión oficial (Páginas 5, 6, 7 y 8).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode(selectedReport ? 'document' : 'list')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* SECTION 1: PÁGINA 5 - DATOS GENERALES Y SUBESTACIÓN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">5</span>
              <h4 className="text-sm font-bold text-slate-900 uppercase">
                Página 5: Datos del Centro de Trabajo, Suministro y Subestación
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Folio Oficial *</label>
                <input
                  type="text"
                  required
                  value={formData.folio || ''}
                  onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Clave de Expediente CFP</label>
                <input
                  type="text"
                  value={formData.claveExpediente || ''}
                  onChange={(e) => setFormData({ ...formData, claveExpediente: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de Evaluación</label>
                <input
                  type="text"
                  value={formData.fechaEvaluacion || ''}
                  onChange={(e) => setFormData({ ...formData, fechaEvaluacion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Razón Social *</label>
                <input
                  type="text"
                  required
                  value={formData.razonSocial || ''}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={formData.nombreComercial || ''}
                  onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">RFC</label>
                <input
                  type="text"
                  value={formData.rfc || ''}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Giro de la Empresa</label>
                <input
                  type="text"
                  value={formData.giro || ''}
                  onChange={(e) => setFormData({ ...formData, giro: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Representante Legal</label>
                <input
                  type="text"
                  value={formData.representanteLegal || ''}
                  onChange={(e) => setFormData({ ...formData, representanteLegal: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Calle y Número</label>
                <input
                  type="text"
                  value={formData.calleNumero || ''}
                  onChange={(e) => setFormData({ ...formData, calleNumero: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Colonia</label>
                <input
                  type="text"
                  value={formData.colonia || ''}
                  onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Municipio</label>
                <input
                  type="text"
                  value={formData.municipio || ''}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ciudad y Estado</label>
                <input
                  type="text"
                  value={formData.ciudadEstado || ''}
                  onChange={(e) => setFormData({ ...formData, ciudadEstado: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Suministro y Subestación */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-slate-800 uppercase mb-2">Datos de Suministro y Transformador</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Compañía Suministradora</label>
                  <input
                    type="text"
                    value={formData.companiaSuministradora || ''}
                    onChange={(e) => setFormData({ ...formData, companiaSuministradora: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">No. Servicio / RPU</label>
                  <input
                    type="text"
                    value={formData.noServicioRpu || ''}
                    onChange={(e) => setFormData({ ...formData, noServicioRpu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tarifa CFE</label>
                  <input
                    type="text"
                    value={formData.tarifaSuministro || ''}
                    onChange={(e) => setFormData({ ...formData, tarifaSuministro: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Subestación</label>
                  <select
                    value={formData.tipoSubestacion || 'Pedestal'}
                    onChange={(e: any) => setFormData({ ...formData, tipoSubestacion: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Pedestal">Pedestal</option>
                    <option value="Poste / Aérea">Poste / Aérea</option>
                    <option value="Subterránea">Subterránea</option>
                    <option value="Compacta / Encapsulada">Compacta / Encapsulada</option>
                    <option value="No Aplica (Solo BT)">No Aplica (Solo BT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Capacidad Transformador (kVA)</label>
                  <input
                    type="number"
                    value={formData.capacidadTransformadorKva || 150}
                    onChange={(e) => setFormData({ ...formData, capacidadTransformadorKva: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Resistencia de Tierra Medida (Ω)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.resistenciaTierraMedidaOhms || 7.5}
                    onChange={(e) => setFormData({ ...formData, resistenciaTierraMedidaOhms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PÁGINA 6 - TABLEROS Y CANALIZACIONES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">6</span>
              <h4 className="text-sm font-bold text-slate-900 uppercase">
                Página 6: Tableros, Circuitos Derivados y Protecciones
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Gabinete Tipo NEMA</label>
                <input
                  type="text"
                  value={formData.gabineteTipoNema || ''}
                  onChange={(e) => setFormData({ ...formData, gabineteTipoNema: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Directorio de Circuitos</label>
                <select
                  value={formData.directorioCircuitosIdentificado || '100% Identificado y Legible'}
                  onChange={(e: any) => setFormData({ ...formData, directorioCircuitosIdentificado: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="100% Identificado y Legible">100% Identificado y Legible</option>
                  <option value="Parcialmente Identificado">Parcialmente Identificado</option>
                  <option value="Sin Identificación">Sin Identificación</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Interruptor Principal (A)</label>
                <input
                  type="number"
                  value={formData.interruptorPrincipalCapacidadA || 250}
                  onChange={(e) => setFormData({ ...formData, interruptorPrincipalCapacidadA: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Protección Falla a Tierra (GFCI)</label>
                <select
                  value={formData.proteccionFallaTierraGfci || 'Instalada en Zonas Húmedas'}
                  onChange={(e: any) => setFormData({ ...formData, proteccionFallaTierraGfci: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Instalada en Zonas Húmedas">Instalada en Zonas Húmedas</option>
                  <option value="Parcial">Parcial</option>
                  <option value="No Instalada / Requerida">No Instalada / Requerida</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Código de Colores Conductores</label>
                <select
                  value={formData.codigoColoresNormativo || 'Conforme NOM-001'}
                  onChange={(e: any) => setFormData({ ...formData, codigoColoresNormativo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Conforme NOM-001">Conforme NOM-001</option>
                  <option value="Parcialmente Identificado">Parcialmente Identificado</option>
                  <option value="No Cumple Código">No Cumple Código</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Canalizaciones y Tuberías</label>
                <select
                  value={formData.canalizacionesTuberiasCharolas || 'Tubería Conduit PG/PD Hermética'}
                  onChange={(e: any) => setFormData({ ...formData, canalizacionesTuberiasCharolas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Tubería Conduit PG/PD Hermética">Tubería Conduit PG/PD Hermética</option>
                  <option value="Charola Tipo Escalera">Charola Tipo Escalera</option>
                  <option value="Conductores Expuestos">Conductores Expuestos</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: PÁGINA 7 - SEGURIDAD LABORAL */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">7</span>
              <h4 className="text-sm font-bold text-slate-900 uppercase">
                Página 7: Condiciones de Seguridad Laboral (NOM-029-STPS / NOM-026-STPS)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Espacio de Trabajo Tableros</label>
                <select
                  value={formData.espacioTrabajoTableros || 'Conforme (>90cm despejado)'}
                  onChange={(e: any) => setFormData({ ...formData, espacioTrabajoTableros: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Conforme (>90cm despejado)">Conforme (&gt;90cm despejado)</option>
                  <option value="Parcialmente Obstruido">Parcialmente Obstruido</option>
                  <option value="Obstrucción Crítica">Obstrucción Crítica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Señales de Advertencia (Riesgo)</label>
                <select
                  value={formData.senalesAdvertenciaRiesgoElectrico || 'Completas y Visibles'}
                  onChange={(e: any) => setFormData({ ...formData, senalesAdvertenciaRiesgoElectrico: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Completas y Visibles">Completas y Visibles</option>
                  <option value="Deterioradas / Faltantes">Deterioradas / Faltantes</option>
                  <option value="Inexistentes">Inexistentes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tapetes Dieléctricos</label>
                <select
                  value={formData.tapetesDielectricosAislantes || 'Colocados en tableros principales'}
                  onChange={(e: any) => setFormData({ ...formData, tapetesDielectricosAislantes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Colocados en tableros principales">Colocados en tableros</option>
                  <option value="Deteriorados">Deteriorados</option>
                  <option value="No Colocados">No Colocados</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Extintor CO2 / PQS</label>
                <select
                  value={formData.extintorTipoCo2PqsCercano || 'Extintor CO2 / PQS vigente y despejado'}
                  onChange={(e: any) => setFormData({ ...formData, extintorTipoCo2PqsCercano: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Extintor CO2 / PQS vigente y despejado">Vigente y despejado</option>
                  <option value="Vencido o sin presión">Vencido o sin presión</option>
                  <option value="No Disponible en el área">No Disponible</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: PÁGINA 8 - PRUEBAS, EVIDENCIAS Y DICTAMEN FINAL */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">8</span>
              <h4 className="text-sm font-bold text-slate-900 uppercase">
                Página 8: Mediciones, Evidencias Fotográficas y Dictamen Pericial
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Medición de Tensión por Fases</label>
                <input
                  type="text"
                  value={formData.medicionTensionFasesV || ''}
                  onChange={(e) => setFormData({ ...formData, medicionTensionFasesV: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Prueba Aislamiento (Megger)</label>
                <select
                  value={formData.pruebaAislamientoMegger || 'Conforme (>100 MΩ)'}
                  onChange={(e: any) => setFormData({ ...formData, pruebaAislamientoMegger: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Conforme (>100 MΩ)">Conforme (&gt;100 MΩ)</option>
                  <option value="Aceptable (>50 MΩ)">Aceptable (&gt;50 MΩ)</option>
                  <option value="Falla de Aislamiento">Falla de Aislamiento</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Termografía Infrarroja</label>
                <select
                  value={formData.termografiaInfrarroja || 'Sin puntos calientes'}
                  onChange={(e: any) => setFormData({ ...formData, termografiaInfrarroja: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Sin puntos calientes">Sin puntos calientes</option>
                  <option value="Puntos calientes leves detectados">Puntos calientes leves</option>
                  <option value="Punto caliente crítico">Punto caliente crítico</option>
                </select>
              </div>
            </div>

            {/* Evidence Uploader - Tomar foto móvil / Subir imagen */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold text-slate-800 uppercase mb-3 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-600" />
                Evidencias Fotográficas en Sitio (Cámara de Teléfono / Archivo)
              </h5>
              <EvidenceUploader
                evidencias={formData.evidencias || []}
                onChange={(evs) => setFormData({ ...formData, evidencias: evs })}
              />
            </div>

            {/* Resultado Final */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Calificación Global de Seguridad *
                </label>
                <select
                  value={formData.calificacionSeguridad || 'Instalación Eléctrica Segura (Aprobada)'}
                  onChange={(e: any) => setFormData({ ...formData, calificacionSeguridad: e.target.value })}
                  className="w-full px-3 py-2 bg-amber-50/60 border-2 border-amber-500 rounded-xl text-xs font-black text-slate-900"
                >
                  <option value="Instalación Eléctrica Segura (Aprobada)">Instalación Eléctrica Segura (Aprobada)</option>
                  <option value="Instalación Condicionada a Correcciones">Instalación Condicionada a Correcciones</option>
                  <option value="Instalación de Alto Riesgo Inminente">Instalación de Alto Riesgo Inminente</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Plazo de Corrección (Días)</label>
                <input
                  type="number"
                  value={formData.plazoSubsanacionDias || 30}
                  onChange={(e) => setFormData({ ...formData, plazoSubsanacionDias: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">No Conformidades Detectadas</label>
                <textarea
                  rows={2}
                  value={formData.noConformidadesDetectadas || ''}
                  onChange={(e) => setFormData({ ...formData, noConformidadesDetectadas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Medidas Correctivas Inmediatas</label>
                <textarea
                  rows={2}
                  value={formData.medidasCorrectivasInmediatas || ''}
                  onChange={(e) => setFormData({ ...formData, medidasCorrectivasInmediatas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
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
              Guardar y Ver Formato Impreso
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 3. DOCUMENT VIEW: PÁGINAS 5, 6, 7 Y 8 (DISEÑO IDÉNTICO)  */}
      {/* ======================================================== */}
      {viewMode === 'document' && selectedReport && (
        <div className="space-y-6">
          {/* Controls Bar */}
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

            {/* Page Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveDocumentPage('all')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Páginas 5 a 8
              </button>
              <button
                type="button"
                onClick={() => setActiveDocumentPage('p5')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'p5' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pág. 5
              </button>
              <button
                type="button"
                onClick={() => setActiveDocumentPage('p6')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'p6' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pág. 6
              </button>
              <button
                type="button"
                onClick={() => setActiveDocumentPage('p7')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'p7' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pág. 7
              </button>
              <button
                type="button"
                onClick={() => setActiveDocumentPage('p8')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeDocumentPage === 'p8' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pág. 8
              </button>
            </div>

            {/* Export PDF Button */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Fondo Blanco Oficial</span>
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
                      {activeDocumentPage === 'all' 
                        ? 'Exportar PDF Completo (4 Págs)' 
                        : `Exportar PDF (Pág. ${activeDocumentPage.replace('p', '')})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* PÁGINA 5 DE 8: DATOS GENERALES, SUMINISTRO Y SUBESTACIÓN            */}
          {/* ==================================================================== */}
          {(activeDocumentPage === 'all' || activeDocumentPage === 'p5') && (
            <div className="flex flex-col items-center">
              <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-amber-300 rounded-full text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS — PÁGINA 5 DE 8</span>
              </div>

              <div
                id="doc-eval-pagina-5"
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
                      FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS EN MATERIA DE SEGURIDAD
                    </h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                      PÁGINA 5 DE 8 • DATOS GENERALES, SUMINISTRO DE ENERGÍA Y SUBESTACIÓN ELÉCTRICA
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
                          {selectedReport.tipoSubestacion.includes('No Aplica') ? 'X' : ''}
                        </div>
                        <span>Instalación Eléctrica en Baja Tensión (&lt; 1,000 V)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-900 flex items-center justify-center font-bold text-xs bg-white">
                          {!selectedReport.tipoSubestacion.includes('No Aplica') ? 'X' : ''}
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

                  {/* Table Página 5 */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white text-xs">
                    {/* Folio y Clave */}
                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900 font-bold">
                      <div className="col-span-4 p-1.5">
                        Folio: <strong className="font-mono text-rose-700">{selectedReport.folio}</strong>
                      </div>
                      <div className="col-span-5 p-1.5">
                        Expediente: <strong className="font-mono">{selectedReport.claveExpediente}</strong>
                      </div>
                      <div className="col-span-3 p-1.5 text-right font-mono">
                        Fecha: {selectedReport.fechaEvaluacion}
                      </div>
                    </div>

                    {/* Header Datos del Centro de Trabajo */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      1. DATOS DEL CENTRO DE TRABAJO / INSTALACIÓN
                    </div>

                    <div className="p-1.5">
                      <span className="font-bold">Razón Social: </span>
                      <span className="font-semibold">{selectedReport.razonSocial}</span>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-7 p-1.5">
                        <span className="font-bold">Nombre Comercial: </span>
                        <span>{selectedReport.nombreComercial || selectedReport.razonSocial}</span>
                      </div>
                      <div className="col-span-5 p-1.5">
                        <span className="font-bold">RFC: </span>
                        <span className="font-mono font-bold">{selectedReport.rfc}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Giro: </span>
                        <span>{selectedReport.giro}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Representante Legal: </span>
                        <span>{selectedReport.representanteLegal}</span>
                      </div>
                    </div>

                    <div className="p-1.5">
                      <span className="font-bold">Domicilio: </span>
                      <span>{selectedReport.calleNumero}, Col. {selectedReport.colonia}, C.P. {selectedReport.codigoPostal}, {selectedReport.municipio}, {selectedReport.ciudadEstado}</span>
                    </div>

                    {/* Suministro */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      2. SUMINISTRO DE ENERGÍA ELÉCTRICA
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-7 p-1.5">
                        <span className="font-bold">Suministrador: </span>
                        <span>{selectedReport.companiaSuministradora}</span>
                      </div>
                      <div className="col-span-5 p-1.5">
                        <span className="font-bold">No. RPU / Servicio: </span>
                        <span className="font-mono font-bold">{selectedReport.noServicioRpu}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Tarifa: </span>
                        <span>{selectedReport.tarifaSuministro}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Tensión: </span>
                        <span className="font-mono">{selectedReport.tensionSuministro}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Configuración: </span>
                        <span>{selectedReport.fasesHilos} ({selectedReport.frecuenciaHz} Hz)</span>
                      </div>
                    </div>

                    {/* Subestación */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      3. SUBESTACIÓN ELÉCTRICA Y TRANSFORMADOR DE POTENCIA
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Tipo Subestación: </span>
                        <span>{selectedReport.tipoSubestacion}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Capacidad: </span>
                        <span className="font-bold">{selectedReport.capacidadTransformadorKva} kVA</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Marca y Serie: </span>
                        <span className="font-mono text-[11px]">{selectedReport.marcaNumeroSerie}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Enfriamiento: </span>
                        <span>{selectedReport.tipoEnfriamiento}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Nivel Aceite: </span>
                        <span>{selectedReport.nivelEstadoAceite}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Cerca y Candado: </span>
                        <span className="font-bold">{selectedReport.proteccionFisicaCercaCandado}</span>
                      </div>
                    </div>

                    {/* Puesta a Tierra */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      4. SISTEMA DE PUESTA A TIERRA Y PARARRAYOS
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Electrodo Puesta a Tierra: </span>
                        <span>{selectedReport.electrodoTierraConexion}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Resistencia Medida: </span>
                        <span className="font-bold font-mono text-emerald-800">{selectedReport.resistenciaTierraMedidaOhms} Ω</span>
                        <span className="text-[10px] text-slate-600 block">(Límite NOM &lt; 25 Ω)</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Pararrayos y Bajantes: </span>
                        <span>{selectedReport.sistemaPararrayosBajantes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Página 5 */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-300 font-mono">
                    <span>COLEGIO FEDERAL DE PERITOS • EVALUACIÓN DE SEGURIDAD</span>
                    <span>PÁGINA 5 DE 8</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* PÁGINA 6 DE 8: TABLEROS, CIRCUITOS DERIVADOS Y PROTECCIONES          */}
          {/* ==================================================================== */}
          {(activeDocumentPage === 'all' || activeDocumentPage === 'p6') && (
            <div className="flex flex-col items-center">
              <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-amber-300 rounded-full text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS — PÁGINA 6 DE 8</span>
              </div>

              <div
                id="doc-eval-pagina-6"
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
                      FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS EN MATERIA DE SEGURIDAD
                    </h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                      PÁGINA 6 DE 8 • TABLEROS, CIRCUITOS DERIVADOS, PROTECCIONES Y CANALIZACIONES
                    </p>
                  </div>

                  {/* Ref Bar */}
                  <div className="flex items-center justify-between border-y border-slate-900 py-1 text-xs font-bold">
                    <span>Folio: <strong className="font-mono text-rose-700">{selectedReport.folio}</strong></span>
                    <span>Instalación: <strong>{selectedReport.nombreComercial || selectedReport.razonSocial}</strong></span>
                    <span className="font-mono">Expediente: {selectedReport.claveExpediente}</span>
                  </div>

                  {/* Table Página 6 */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white text-xs">
                    {/* Tableros Principales */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      5. TABLEROS PRINCIPALES Y DE DISTRIBUCIÓN
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Gabinete Tipo NEMA: </span>
                        <span>{selectedReport.gabineteTipoNema}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Directorio de Circuitos: </span>
                        <span className="font-bold">{selectedReport.directorioCircuitosIdentificado}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Cubierta Frontal (Protección de Contacto): </span>
                        <span>{selectedReport.cubiertaFrontalProteccionContacto}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Espacios de Reserva / Aperturas: </span>
                        <span>{selectedReport.espacioReservaEspaciosVacios}</span>
                      </div>
                    </div>

                    {/* Dispositivos de Sobrecorriente */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      6. DISPOSITIVOS DE SOBRECORRIENTE E INTERRUPTORES
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Interruptor Principal: </span>
                        <span className="font-mono font-bold">{selectedReport.interruptorPrincipalCapacidadA} A</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Coordinación de Protecciones: </span>
                        <span>{selectedReport.coordinacionProtecciones}</span>
                      </div>
                      <div className="col-span-4 p-1.5">
                        <span className="font-bold">Protección Falla Tierra (GFCI): </span>
                        <span>{selectedReport.proteccionFallaTierraGfci}</span>
                      </div>
                    </div>

                    <div className="p-1.5">
                      <span className="font-bold">Estado de Interruptores Termomagnéticos: </span>
                      <span>{selectedReport.estadoInterruptoresTermomagneticos}</span>
                    </div>

                    {/* Conductores y Canalizaciones */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      7. CONDUCTORES, AISLAMIENTO Y CANALIZACIONES
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Tipo de Conductor y Aislamiento: </span>
                        <span>{selectedReport.tipoConductorAislamiento}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Código de Colores Normativo: </span>
                        <span className="font-bold">{selectedReport.codigoColoresNormativo}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-7 p-1.5">
                        <span className="font-bold">Canalizaciones (Tuberías / Charolas): </span>
                        <span>{selectedReport.canalizacionesTuberiasCharolas}</span>
                      </div>
                      <div className="col-span-5 p-1.5">
                        <span className="font-bold">Factor de Llenado: </span>
                        <span className="font-bold">{selectedReport.factorLlenadoCanalizaciones}</span>
                      </div>
                    </div>

                    {/* Verificación de Artículos NOM */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      8. MATRIZ DE CUMPLIMIENTO TÉCNICO NOM-001-SEDE-2012
                    </div>

                    <div className="p-2 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span>• Art. 110-12: Ejecución mecánica de los trabajos (libre de cables sueltos)</span>
                        <span className="font-bold text-emerald-800">CUMPLE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Art. 250: Puesta a tierra y unión equipotencial en tableros y carcasas</span>
                        <span className="font-bold text-emerald-800">CUMPLE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Art. 210-8: Protección de las personas mediante interruptores por falla a tierra</span>
                        <span className="font-bold text-emerald-800">CUMPLE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Art. 300: Métodos de alambrado y protección contra daños mecánicos</span>
                        <span className="font-bold text-emerald-800">CUMPLE</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Página 6 */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-300 font-mono">
                    <span>COLEGIO FEDERAL DE PERITOS • EVALUACIÓN DE SEGURIDAD</span>
                    <span>PÁGINA 6 DE 8</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* PÁGINA 7 DE 8: CONDICIONES DE SEGURIDAD LABORAL (NOM-029 / NOM-026)  */}
          {/* ==================================================================== */}
          {(activeDocumentPage === 'all' || activeDocumentPage === 'p7') && (
            <div className="flex flex-col items-center">
              <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-amber-300 rounded-full text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS — PÁGINA 7 DE 8</span>
              </div>

              <div
                id="doc-eval-pagina-7"
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
                      FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS EN MATERIA DE SEGURIDAD
                    </h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                      PÁGINA 7 DE 8 • CONDICIONES DE SEGURIDAD LABORAL (NOM-029-STPS-2011 / NOM-026-STPS-2008)
                    </p>
                  </div>

                  {/* Ref Bar */}
                  <div className="flex items-center justify-between border-y border-slate-900 py-1 text-xs font-bold">
                    <span>Folio: <strong className="font-mono text-rose-700">{selectedReport.folio}</strong></span>
                    <span>Instalación: <strong>{selectedReport.nombreComercial || selectedReport.razonSocial}</strong></span>
                    <span className="font-mono">Expediente: {selectedReport.claveExpediente}</span>
                  </div>

                  {/* Table Página 7 */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white text-xs">
                    {/* Espacios de Trabajo */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      9. ESPACIOS DE TRABAJO Y ACCESIBILIDAD (ART. 110-26 NOM-001)
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Espacio Libre Frente a Tableros: </span>
                        <span className="font-bold">{selectedReport.espacioTrabajoTableros}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Puertas de Acceso y Rutas de Escape: </span>
                        <span>{selectedReport.puertasAccesoEscape}</span>
                      </div>
                    </div>

                    {/* Señalización de Seguridad */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      10. SEÑALIZACIÓN DE SEGURIDAD E INFORMACIÓN TÉCNICA (NOM-026-STPS)
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Señales de Advertencia de Riesgo Eléctrico: </span>
                        <span className="font-bold">{selectedReport.senalesAdvertenciaRiesgoElectrico}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Diagrama Unifilar Actualizado: </span>
                        <span className="font-bold">{selectedReport.diagramaUnifilarActualizado}</span>
                      </div>
                    </div>

                    {/* Tapetes e Iluminación */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      11. MEDIDAS PREVENTIVAS Y TAPETES DIELÉCTRICOS
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Tapetes Dieléctricos Aislantes: </span>
                        <span>{selectedReport.tapetesDielectricosAislantes}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Iluminación Normal y de Emergencia: </span>
                        <span>{selectedReport.iluminacionNormalYEmergencia}</span>
                      </div>
                    </div>

                    {/* Prevención de Incendios y EPP */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      12. PREVENCIÓN DE INCENDIOS Y EQUIPO DE PROTECCIÓN PERSONAL
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Extintor CO2 / PQS en Área Eléctrica: </span>
                        <span className="font-bold">{selectedReport.extintorTipoCo2PqsCercano}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">EPP Dieléctrico / Arco Eléctrico: </span>
                        <span>{selectedReport.disponibilidadEppDielectrico}</span>
                      </div>
                    </div>

                    {/* Declaratoria Normativa */}
                    <div className="p-2 space-y-1 text-slate-800 text-[11px] leading-relaxed">
                      <p className="font-bold text-slate-900">
                        Disposiciones de la NOM-029-STPS-2011 (Mantenimiento de las instalaciones eléctricas en los centros de trabajo):
                      </p>
                      <p className="text-justify">
                        Se verificó que los procedimientos de seguridad para actividades de mantenimiento en instalaciones eléctricas incluyan el bloqueo de energía y etiquetado (LOTO), delimitación de zonas de riesgo y uso de equipo de medición con categoría de sobretensión adecuada (CAT III / CAT IV).
                      </p>
                    </div>
                  </div>

                  {/* Footer Página 7 */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-300 font-mono">
                    <span>COLEGIO FEDERAL DE PERITOS • EVALUACIÓN DE SEGURIDAD</span>
                    <span>PÁGINA 7 DE 8</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* PÁGINA 8 DE 8: PRUEBAS, EVIDENCIAS, DICTAMEN FINAL Y FIRMA PERICIAL  */}
          {/* ==================================================================== */}
          {(activeDocumentPage === 'all' || activeDocumentPage === 'p8') && (
            <div className="flex flex-col items-center">
              <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-amber-300 rounded-full text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS — PÁGINA 8 DE 8</span>
              </div>

              <div
                id="doc-eval-pagina-8"
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
                      FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS EN MATERIA DE SEGURIDAD
                    </h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                      PÁGINA 8 DE 8 • PRUEBAS, EVIDENCIAS FOTOGRÁFICAS, DICTAMEN FINAL Y FIRMA PERICIAL
                    </p>
                  </div>

                  {/* Ref Bar */}
                  <div className="flex items-center justify-between border-y border-slate-900 py-1 text-xs font-bold">
                    <span>Folio: <strong className="font-mono text-rose-700">{selectedReport.folio}</strong></span>
                    <span>Instalación: <strong>{selectedReport.nombreComercial || selectedReport.razonSocial}</strong></span>
                    <span className="font-mono">Expediente: {selectedReport.claveExpediente}</span>
                  </div>

                  {/* Table Página 8 */}
                  <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white text-xs">
                    {/* Pruebas Eléctricas */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      13. PRUEBAS INSTRUMENTADAS Y MEDICIONES EN SITIO
                    </div>

                    <div className="p-1.5">
                      <span className="font-bold">Medición de Tensión por Fases: </span>
                      <span className="font-mono">{selectedReport.medicionTensionFasesV}</span>
                    </div>

                    <div className="grid grid-cols-12 divide-x-2 divide-slate-900">
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Prueba de Aislamiento (Megger): </span>
                        <span className="font-bold">{selectedReport.pruebaAislamientoMegger}</span>
                      </div>
                      <div className="col-span-6 p-1.5">
                        <span className="font-bold">Inspección Termográfica: </span>
                        <span className="font-bold">{selectedReport.termografiaInfrarroja}</span>
                      </div>
                    </div>

                    {/* Evidencias Fotográficas */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      14. EVIDENCIAS FOTOGRÁFICAS INSPECCIÓN VISUAL EN SITIO
                    </div>

                    <div className="p-2">
                      {selectedReport.evidencias && selectedReport.evidencias.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {selectedReport.evidencias.slice(0, 4).map((evi, idx) => (
                            <div key={evi.id || idx} className="border border-slate-300 p-1 rounded bg-slate-50 flex flex-col items-center">
                              <img
                                src={evi.dataUrl}
                                alt={evi.nombre}
                                className="h-28 w-full object-cover rounded filter contrast-105"
                              />
                              <div className="w-full text-center mt-1 text-[10px] leading-tight">
                                <span className="font-bold block text-slate-900">{evi.nombre}</span>
                                <span className="text-slate-600 block line-clamp-1">{evi.descripcion}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-slate-400 font-sans italic text-xs">
                          Sin fotografías adjuntas. (Presione Editar para tomar foto móvil o subir imágenes).
                        </div>
                      )}
                    </div>

                    {/* Veredicto y Calificación Global */}
                    <div className="bg-slate-100 p-1 text-center font-black tracking-widest text-[11px] uppercase">
                      15. NO CONFORMIDADES Y DICTAMEN PERICIAL FINAL
                    </div>

                    <div className="p-1.5 space-y-1">
                      <div>
                        <span className="font-bold">No Conformidades Detectadas: </span>
                        <span>{selectedReport.noConformidadesDetectadas}</span>
                      </div>
                      <div>
                        <span className="font-bold">Medidas Correctivas Inmediatas: </span>
                        <span>{selectedReport.medidasCorrectivasInmediatas}</span>
                      </div>
                      <div>
                        <span className="font-bold">Plazo Otorgado para Correcciones: </span>
                        <span className="font-bold font-mono">{selectedReport.plazoSubsanacionDias} días naturales</span>
                      </div>
                    </div>

                    {/* Recuadro Destacado Calificación */}
                    <div className="p-2 bg-amber-50/50 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block">
                        CALIFICACIÓN GLOBAL EN MATERIA DE SEGURIDAD ELÉCTRICA:
                      </span>
                      <div className="text-sm font-black text-slate-950 uppercase tracking-wide">
                        {selectedReport.calificacionSeguridad}
                      </div>
                    </div>
                  </div>

                  {/* Perito Responsable & Touch Signature */}
                  <div className="pt-2 space-y-2">
                    <div className="text-center font-black tracking-widest text-slate-900 uppercase text-xs">
                      PERITO RESPONSABLE DEL COLEGIO FEDERAL DE PERITOS
                    </div>

                    <div className="flex flex-col items-center justify-center relative">
                      {selectedReport.firmaDigital ? (
                        <div className="relative group cursor-pointer" onClick={() => setIsSignatureModalOpen(true)}>
                          <img
                            src={selectedReport.firmaDigital}
                            alt="Firma Electrónica del Perito"
                            className="h-16 sm:h-20 object-contain filter drop-shadow-sm select-none"
                          />
                          <div className="no-print absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition">
                            <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                              Tocar para cambiar firma
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsSignatureModalOpen(true)}
                          className="no-print h-16 w-64 border-2 border-dashed border-amber-600/60 bg-amber-50/50 hover:bg-amber-100/60 rounded-xl flex flex-col items-center justify-center p-2 text-center transition cursor-pointer mb-1 shadow-xs"
                        >
                          <PenTool className="w-4 h-4 text-amber-600 mb-0.5" />
                          <span className="text-xs font-bold text-amber-900">
                            Presione aquí para Firmar Digitalmente
                          </span>
                        </button>
                      )}

                      <div className="w-72 border-b-2 border-slate-900 mb-1"></div>
                      <span className="font-black text-slate-900 text-xs tracking-wide">
                        {selectedReport.peritoNombre}
                      </span>
                    </div>

                    {/* QR Code and Perito Credentials */}
                    <div className="grid grid-cols-12 gap-3 items-center pt-1">
                      <div className="col-span-3 flex flex-col items-center justify-center">
                        <div
                          className="p-1 bg-white border border-slate-300 rounded shadow-xs"
                          dangerouslySetInnerHTML={{
                            __html: generateQrMatrixSvg(
                              `CFP-SEGURIDAD:${selectedReport.folio}:${selectedReport.claveExpediente}:${selectedReport.rfc}`,
                              90
                            ),
                          }}
                        />
                        <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-0.5">
                          VALIDACIÓN DIGITAL
                        </span>
                      </div>

                      <div className="col-span-9 space-y-0.5 text-xs font-serif pl-2">
                        <div>
                          <span className="font-bold text-slate-900">Afiliación CFP:</span>{' '}
                          <span className="font-mono font-semibold text-slate-800">{selectedReport.peritoAfiliacion}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">Cédula Profesional:</span>{' '}
                          <span className="font-mono font-bold text-slate-900">{selectedReport.peritoCedula}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">Correo Electrónico:</span>{' '}
                          <span className="text-slate-800 font-mono">{selectedReport.peritoEmail}</span>
                        </div>
                        <div className="flex items-baseline justify-between pt-0.5">
                          <div>
                            <span className="font-bold text-slate-900">Teléfono:</span>{' '}
                            <span className="font-mono font-bold text-slate-800">{selectedReport.peritoTelefono}</span>
                          </div>
                          <div>
                            <span className="font-black text-slate-900 mr-2 text-xs">FOLIO:</span>
                            <span className="font-black text-rose-600 text-base font-mono">
                              {selectedReport.folio}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Página 8 */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-300 font-mono">
                    <span>COLEGIO FEDERAL DE PERITOS • EVALUACIÓN DE SEGURIDAD</span>
                    <span>PÁGINA 8 DE 8</span>
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
        onSaveSignature={handleSaveSignature}
        peritoNombre={selectedReport?.peritoNombre || 'Ing. Israel Orozco Arias'}
        cedula={selectedReport?.peritoCedula || '15240154'}
      />
    </div>
  );
};
