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
  Camera,
  QrCode,
  Gauge,
  Sparkles
} from 'lucide-react';
import { ElectricalMeasurementsReport, UserRole, EvidenceItem } from '../types';
import { CfpLogo } from './CfpLogo';
import { EvidenceUploader } from './EvidenceUploader';
import { SignatureModal } from './SignatureModal';
import { exportDocumentToPdf } from '../utils/pdfExport';

interface ElectricalMeasurementsModuleProps {
  reports: ElectricalMeasurementsReport[];
  activeRole: UserRole | null;
  onSaveReport: (report: ElectricalMeasurementsReport) => void;
  onDeleteReport: (id: string) => void;
}

export const ElectricalMeasurementsModule: React.FC<ElectricalMeasurementsModuleProps> = ({
  reports,
  activeRole,
  onSaveReport,
  onDeleteReport,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(() => {
    return reports.length > 0 ? reports[0].id : null;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ElectricalMeasurementsReport>>({});
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto select report if current selection is invalid
  useEffect(() => {
    if (reports.length > 0) {
      if (!selectedReportId || !reports.some(r => r.id === selectedReportId)) {
        setSelectedReportId(reports[0].id);
      }
    } else {
      setSelectedReportId(null);
    }
  }, [reports, selectedReportId]);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0] || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered reports list
  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      r.folio.toLowerCase().includes(term) ||
      r.claveExpediente.toLowerCase().includes(term) ||
      r.nombreComercial.toLowerCase().includes(term) ||
      r.nombreRazonSocial.toLowerCase().includes(term) ||
      r.rfc.toLowerCase().includes(term)
    );
  });

  // Start creating new report with default values
  const handleCreateNew = () => {
    const nextFolioNum = reports.length + 360;
    const newReport: Partial<ElectricalMeasurementsReport> = {
      id: `med-${Date.now()}`,
      folio: String(nextFolioNum),
      claveExpediente: `CFP0125/PCIEMBT/IOA/0071/14XII20 - ${nextFolioNum}/2026`,
      fechaMedicion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' }).replace('.', ''),

      // 1. Datos Generales
      nombreRazonSocial: 'COMERCIALIZADORA DEL CENTRO S.A. DE C.V.',
      nombreComercial: 'SUPERMERCADO Y CENTRO LOGÍSTICO',
      rfc: 'CCE210415RT8',
      domicilioCompleto: 'AV. ACUEDUCTO #1450 COL. CHAPULTEPEC ORIENTE',
      municipioEstado: 'MORELIA, MICHOACÁN',
      codigoPostal: '58260',
      telefono: '4433148900',
      solicitante: 'LIC. ALEJANDRO RAMÍREZ SALGADO',
      solicitanteTelefono: '4435678901',
      giro: 'COMERCIO Y DISTRIBUCIÓN DE MERCANCÍAS GENERALES',

      // 2. Equipo Utilizado
      instrumentoNombre: 'Analizador de Calidad de Energía y Multímetro / Pinza Digital',
      instrumentoMarca: 'FLUKE',
      instrumentoModelo: '435-II / 376 FC True RMS',
      instrumentoSerie: 'FLK-4352-8921',
      instrumentoCalibracion: 'Vigente al 15-Nov-2027 (Cert. EMA-EL-2024)',

      // 3. Tensión Eléctrica (Volts)
      tensionF1F2: 220.0,
      tensionF2F3: 221.0,
      tensionF3F1: 219.0,
      tensionPromedioFF: 220.0,
      tensionF1N: 127.5,
      tensionF2N: 126.8,
      tensionF3N: 127.2,
      tensionPromedioFN: 127.2,
      tensionNT: 1.2,
      evaluacionTension: 'Conforme NOM-001-SEDE',

      // 4. Corriente Eléctrica (Amperes)
      corrienteF1: 68.5,
      corrienteF2: 71.2,
      corrienteF3: 65.8,
      corrienteNeutro: 14.2,
      desbalanceCorrientePorcentaje: 4.2,
      evaluacionCorriente: 'Carga Balanceada (<10%)',

      // 5. Potencia y Factor de Potencia
      potenciaActivaKw: 27.26,
      potenciaReactivaKvar: 13.62,
      potenciaAparenteKva: 30.48,
      factorPotenciaF1: 0.89,
      factorPotenciaF2: 0.91,
      factorPotenciaF3: 0.90,
      factorPotenciaTotal: 0.90,
      capacidadSubestacionKva: 75.0,
      porcentajeUtilizacionCapacidad: 49.99,
      evaluacionFactorPotencia: 'Aceptable CFE (>0.90)',

      // 6. Polaridad y Contactos
      polaridadContactos: 'Correcta (Fase en ranura corta, Neutro en ranura larga, Tierra conectada)',
      pruebaGfciDisparo: 'Disparo Correcto (<25ms)',

      // 7. Medición de Resistencia de Puesta a Tierra (SPAT)
      spatMetodo: 'Caída de Potencial (Método Wenner 3 Puntas)',
      spatPuntoMedicion: 'Pozo de Puesta a Tierra No. 1 - Subestación',
      spatResistenciaMedidaOhms: 4.8,
      spatValorMaximoPermitidoOhms: 25.0,
      spatDictamen: 'CUMPLE NORMATIVA (≤ 25 Ω)',

      // 8. Descripción Técnica
      descripcionTecnica: 'Se registraron los parámetros de tensión, corriente, potencia y resistencia de puesta a tierra en el tablero general de distribución en condiciones normales de operación. Las tensiones de fase se mantienen dentro del rango de tolerancia del ±5% normativo. El desbalance de corriente es de 4.2%, clasificándose como carga adecuadamente balanceada. La resistencia de tierra registrada de 4.8 Ω cumple ampliamente con el valor máximo permitido de 25 Ω establecido por la NOM-001-SEDE-2012 y NOM-022-STPS-2015.',

      // 9. Evidencias
      evidencias: [],

      // 10. Acreditación Pericial del CFP
      peritoNombre: 'Ing. Israel Orozco Arias',
      peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: '15240154',
      peritoTelefono: '4431748638',
      peritoEmail: 'israel9b@hotmail.com',
      esMuestra: false,
    };

    setFormData(newReport);
    setIsEditing(true);
  };

  // Start editing existing report
  const handleEdit = (report: ElectricalMeasurementsReport) => {
    setFormData({ ...report });
    setIsEditing(true);
  };

  // Auto calculations when voltages, currents, or power changes
  const handleVoltageChange = (field: 'tensionF1F2' | 'tensionF2F3' | 'tensionF3F1' | 'tensionF1N' | 'tensionF2N' | 'tensionF3N', val: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      // Calc promedio FF
      const v12 = Number(updated.tensionF1F2 || 0);
      const v23 = Number(updated.tensionF2F3 || 0);
      const v31 = Number(updated.tensionF3F1 || 0);
      const avgFF = Number(((v12 + v23 + v31) / 3).toFixed(1));

      // Calc promedio FN
      const v1n = Number(updated.tensionF1N || 0);
      const v2n = Number(updated.tensionF2N || 0);
      const v3n = Number(updated.tensionF3N || 0);
      const avgFN = Number(((v1n + v2n + v3n) / 3).toFixed(1));

      return {
        ...updated,
        tensionPromedioFF: avgFF,
        tensionPromedioFN: avgFN,
      };
    });
  };

  const handleCurrentChange = (field: 'corrienteF1' | 'corrienteF2' | 'corrienteF3', val: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      const i1 = Number(updated.corrienteF1 || 0);
      const i2 = Number(updated.corrienteF2 || 0);
      const i3 = Number(updated.corrienteF3 || 0);
      const avg = (i1 + i2 + i3) / 3;

      let unbalance = 0;
      if (avg > 0) {
        const maxDev = Math.max(Math.abs(i1 - avg), Math.abs(i2 - avg), Math.abs(i3 - avg));
        unbalance = Number(((maxDev / avg) * 100).toFixed(1));
      }

      let evalCurr: 'Carga Balanceada (<10%)' | 'Desbalance Moderado' | 'Desbalance Crítico (>15%)' = 'Carga Balanceada (<10%)';
      if (unbalance > 15) {
        evalCurr = 'Desbalance Crítico (>15%)';
      } else if (unbalance > 10) {
        evalCurr = 'Desbalance Moderado';
      }

      return {
        ...updated,
        desbalanceCorrientePorcentaje: unbalance,
        evaluacionCorriente: evalCurr,
      };
    });
  };

  const handlePowerChange = (field: 'potenciaActivaKw' | 'potenciaReactivaKvar' | 'capacidadSubestacionKva', val: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      const p = Number(updated.potenciaActivaKw || 0);
      const q = Number(updated.potenciaReactivaKvar || 0);
      const cap = Number(updated.capacidadSubestacionKva || 75);

      const s = Number(Math.sqrt(p * p + q * q).toFixed(2));
      const fpTotal = s > 0 ? Number((p / s).toFixed(2)) : 0.90;
      const util = cap > 0 ? Number(((s / cap) * 100).toFixed(2)) : 0;

      return {
        ...updated,
        potenciaAparenteKva: s,
        factorPotenciaTotal: fpTotal,
        porcentajeUtilizacionCapacidad: util,
      };
    });
  };

  const handleSpatResistanceChange = (val: number) => {
    setFormData(prev => {
      const isCompliant = val <= (prev.spatValorMaximoPermitidoOhms || 25);
      return {
        ...prev,
        spatResistenciaMedidaOhms: val,
        spatDictamen: isCompliant ? 'CUMPLE NORMATIVA (≤ 25 Ω)' : 'NO CUMPLE (Resistencia Excesiva > 25 Ω)',
      };
    });
  };

  // Save form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.folio || !formData.nombreRazonSocial) {
      alert('Por favor complete los campos obligatorios (Folio y Razón Social).');
      return;
    }

    const reportToSave = formData as ElectricalMeasurementsReport;
    onSaveReport(reportToSave);
    setSelectedReportId(reportToSave.id);
    setIsEditing(false);
    showToast(`Formato de Mediciones Eléctricas Folio ${reportToSave.folio} guardado correctamente.`);
  };

  // Digital Signature
  const handleSaveSignature = (sigDataUrl: string) => {
    if (selectedReport) {
      const updated = { ...selectedReport, firmaDigital: sigDataUrl };
      onSaveReport(updated);
      showToast('Firma digital del perito registrada con éxito.');
    }
  };

  // Export to PDF (Letter, official clean white background)
  const handleExportPdf = async () => {
    if (!selectedReport) return;
    setIsExportingPdf(true);
    try {
      const cleanFolio = selectedReport.folio.replace(/\//g, '-');
      const filename = `Mediciones_Electricas_Pagina_9_Folio_${cleanFolio}`;
      const success = await exportDocumentToPdf('doc-mediciones-pagina-9', filename, false);
      if (success) {
        showToast('PDF exportado exitosamente con fondo blanco oficial.');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <Activity className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Página 9 Oficial • NOM-001-SEDE-2012 / NOM-022-STPS-2015</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              FORMATO TÉCNICO DE MEDICIONES DE VARIABLES ELÉCTRICAS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Registro instrumental de parámetros de tensión eléctrica, corriente por fases, desbalance, potencia (kW, kVAR, kVA), factor de potencia, polaridad de contactos y medición de resistencia a tierra del SPAT con registro fotográfico de evidencias.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nueva Medición</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: List & Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Reports List & Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por folio, cliente, RFC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No se encontraron mediciones registradas.
                </div>
              ) : (
                filteredReports.map((rep) => {
                  const isSelected = rep.id === selectedReportId;
                  return (
                    <div
                      key={rep.id}
                      onClick={() => {
                        setSelectedReportId(rep.id);
                        setIsEditing(false);
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-xs font-black text-slate-900">
                          Folio: {rep.folio}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {rep.fechaMedicion}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800 line-clamp-1">
                        {rep.nombreComercial || rep.nombreRazonSocial}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {rep.rfc}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-600 font-medium">
                          R. Tierra: <strong className="text-slate-900 font-mono">{rep.spatResistenciaMedidaOhms} Ω</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          rep.spatDictamen.includes('CUMPLE NORMATIVA')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {rep.spatDictamen.includes('CUMPLE NORMATIVA') ? 'CUMPLE' : 'NO CUMPLE'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Editor OR Printable Document Viewer */}
        <div className="lg:col-span-8 space-y-4">
          
          {isEditing ? (
            /* ==================================================================== */
            /* FORM EDITOR                                                          */
            /* ==================================================================== */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      {formData.id && reports.some(r => r.id === formData.id) ? 'Editar Formato Técnico de Mediciones' : 'Nueva Medición de Variables Eléctricas'}
                    </h2>
                    <p className="text-xs text-slate-500">Página 9 • Ingrese los datos de parámetros e instrumentación</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveForm}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar Medición</span>
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-6">
                
                {/* 1. Datos Generales */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>1. Datos Generales del Centro de Trabajo y Solicitud</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Folio *</label>
                      <input
                        type="text"
                        required
                        value={formData.folio || ''}
                        onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de Medición *</label>
                      <input
                        type="text"
                        required
                        value={formData.fechaMedicion || ''}
                        onChange={(e) => setFormData({ ...formData, fechaMedicion: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">RFC del Titular *</label>
                      <input
                        type="text"
                        required
                        value={formData.rfc || ''}
                        onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Razón Social *</label>
                      <input
                        type="text"
                        required
                        value={formData.nombreRazonSocial || ''}
                        onChange={(e) => setFormData({ ...formData, nombreRazonSocial: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Comercial</label>
                      <input
                        type="text"
                        value={formData.nombreComercial || ''}
                        onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Domicilio Completo</label>
                      <input
                        type="text"
                        value={formData.domicilioCompleto || ''}
                        onChange={(e) => setFormData({ ...formData, domicilioCompleto: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Municipio y Estado</label>
                      <input
                        type="text"
                        value={formData.municipioEstado || ''}
                        onChange={(e) => setFormData({ ...formData, municipioEstado: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Giro / Actividad</label>
                      <input
                        type="text"
                        value={formData.giro || ''}
                        onChange={(e) => setFormData({ ...formData, giro: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Solicitante del Servicio</label>
                      <input
                        type="text"
                        value={formData.solicitante || ''}
                        onChange={(e) => setFormData({ ...formData, solicitante: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Clave de Expediente</label>
                      <input
                        type="text"
                        value={formData.claveExpediente || ''}
                        onChange={(e) => setFormData({ ...formData, claveExpediente: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Equipo Utilizado */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <Gauge className="w-4 h-4 text-cyan-600" />
                    <span>2. Equipo Utilizado para Mediciones (Instrumentación de Prueba)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Instrumento / Equipo</label>
                      <input
                        type="text"
                        value={formData.instrumentoNombre || ''}
                        onChange={(e) => setFormData({ ...formData, instrumentoNombre: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Marca</label>
                      <input
                        type="text"
                        value={formData.instrumentoMarca || ''}
                        onChange={(e) => setFormData({ ...formData, instrumentoMarca: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Modelo</label>
                      <input
                        type="text"
                        value={formData.instrumentoModelo || ''}
                        onChange={(e) => setFormData({ ...formData, instrumentoModelo: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Número de Serie</label>
                      <input
                        type="text"
                        value={formData.instrumentoSerie || ''}
                        onChange={(e) => setFormData({ ...formData, instrumentoSerie: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Calibración / Certificado Vigente</label>
                      <input
                        type="text"
                        value={formData.instrumentoCalibracion || ''}
                        onChange={(e) => setFormData({ ...formData, instrumentoCalibracion: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Parámetros de Tensión (Volts) */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>3. Parámetros de Tensión Eléctrica (Volts)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">F1 - F2 (V)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionF1F2 ?? 220}
                        onChange={(e) => handleVoltageChange('tensionF1F2', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">F2 - F3 (V)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionF2F3 ?? 221}
                        onChange={(e) => handleVoltageChange('tensionF2F3', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">F3 - F1 (V)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionF3F1 ?? 219}
                        onChange={(e) => handleVoltageChange('tensionF3F1', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Promedio F-F (V)</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.tensionPromedioFF ?? 220}
                        className="w-full px-3 py-1.5 text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-mono font-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">F1 - Neutro (V)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionF1N ?? 127.5}
                        onChange={(e) => handleVoltageChange('tensionF1N', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">F2 - Neutro (V)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionF2N ?? 126.8}
                        onChange={(e) => handleVoltageChange('tensionF2N', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">F3 - Neutro (V)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionF3N ?? 127.2}
                        onChange={(e) => handleVoltageChange('tensionF3N', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Promedio F-N (V)</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.tensionPromedioFN ?? 127.2}
                        className="w-full px-3 py-1.5 text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-mono font-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Tensión Neutro - Tierra (V) [Límite &lt; 2.0 V]</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tensionNT ?? 1.2}
                        onChange={(e) => setFormData({ ...formData, tensionNT: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Evaluación de Tensión</label>
                      <select
                        value={formData.evaluacionTension || 'Conforme NOM-001-SEDE'}
                        onChange={(e) => setFormData({ ...formData, evaluacionTension: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      >
                        <option value="Conforme NOM-001-SEDE">Conforme NOM-001-SEDE (±5% nominal)</option>
                        <option value="Desbalance Leve">Desbalance Leve (&lt; 2%)</option>
                        <option value="Fuera de Rango">Fuera de Rango (&gt; 5% tolerancia)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Corriente Eléctrica (Amperes) */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>4. Parámetros de Corriente Eléctrica (Amperes)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fase 1 (A)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.corrienteF1 ?? 68.5}
                        onChange={(e) => handleCurrentChange('corrienteF1', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fase 2 (A)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.corrienteF2 ?? 71.2}
                        onChange={(e) => handleCurrentChange('corrienteF2', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fase 3 (A)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.corrienteF3 ?? 65.8}
                        onChange={(e) => handleCurrentChange('corrienteF3', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Neutro In (A)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.corrienteNeutro ?? 14.2}
                        onChange={(e) => setFormData({ ...formData, corrienteNeutro: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">% Desbalance</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.desbalanceCorrientePorcentaje ?? 4.2}
                        className="w-full px-3 py-1.5 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-mono font-black"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Potencia y Factor de Potencia */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>5. Potencia Eléctrica y Factor de Potencia (kW, kVAR, kVA, FP)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Potencia Activa (kW)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.potenciaActivaKw ?? 27.26}
                        onChange={(e) => handlePowerChange('potenciaActivaKw', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Potencia Reactiva (kVAR)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.potenciaReactivaKvar ?? 13.62}
                        onChange={(e) => handlePowerChange('potenciaReactivaKvar', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Potencia Aparente (kVA)</label>
                      <input
                        type="number"
                        step="0.01"
                        readOnly
                        value={formData.potenciaAparenteKva ?? 30.48}
                        className="w-full px-3 py-2 text-xs bg-purple-50 text-purple-900 border border-purple-200 rounded-xl font-mono font-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Capacidad Subestación (kVA)</label>
                      <input
                        type="number"
                        value={formData.capacidadSubestacionKva ?? 75}
                        onChange={(e) => handlePowerChange('capacidadSubestacionKva', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">FP Fase 1</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.factorPotenciaF1 ?? 0.89}
                        onChange={(e) => setFormData({ ...formData, factorPotenciaF1: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">FP Fase 2</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.factorPotenciaF2 ?? 0.91}
                        onChange={(e) => setFormData({ ...formData, factorPotenciaF2: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">FP Fase 3</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.factorPotenciaF3 ?? 0.90}
                        onChange={(e) => setFormData({ ...formData, factorPotenciaF3: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">% Utilización Carga</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.porcentajeUtilizacionCapacidad ?? 49.99}
                        className="w-full px-3 py-1.5 text-xs bg-purple-50 text-purple-900 border border-purple-200 rounded-lg font-mono font-black"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Polaridad y Contactos */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>6. Verificación de Polaridad y Contactos</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Polaridad en Contactos</label>
                      <select
                        value={formData.polaridadContactos || 'Correcta (Fase en ranura corta, Neutro en ranura larga, Tierra conectada)'}
                        onChange={(e) => setFormData({ ...formData, polaridadContactos: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Correcta (Fase en ranura corta, Neutro en ranura larga, Tierra conectada)">Correcta (Fase, Neutro y Tierra conectada)</option>
                        <option value="Invertida (Fase y Neutro)">Invertida (Fase y Neutro cruzados)</option>
                        <option value="Tierra Abierta / No Conectada">Tierra Abierta / No Conectada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Prueba GFCI / Falla a Tierra</label>
                      <select
                        value={formData.pruebaGfciDisparo || 'Disparo Correcto (<25ms)'}
                        onChange={(e) => setFormData({ ...formData, pruebaGfciDisparo: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Disparo Correcto (<25ms)">Disparo Correcto (&lt;25ms)</option>
                        <option value="No Aplica / No Instalado">No Aplica / No Instalado</option>
                        <option value="Falla de Disparo">Falla de Disparo (Riesgo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 7. Resistencia de Puesta a Tierra (SPAT) */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <Gauge className="w-4 h-4 text-emerald-600" />
                    <span>7. Medición de Resistencia de Puesta a Tierra (SPAT)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Método de Medición</label>
                      <select
                        value={formData.spatMetodo || 'Caída de Potencial (Método Wenner 3 Puntas)'}
                        onChange={(e) => setFormData({ ...formData, spatMetodo: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Caída de Potencial (Método Wenner 3 Puntas)">Caída de Potencial (Método Wenner 3 Puntas)</option>
                        <option value="Pinza de Resistencia de Bucle (Stakeless)">Pinza de Resistencia de Bucle (Stakeless)</option>
                        <option value="Telurómetro Digital 4 Puntas">Telurómetro Digital 4 Puntas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Ubicación del Electrodo / Pozo Medido</label>
                      <input
                        type="text"
                        value={formData.spatPuntoMedicion || ''}
                        onChange={(e) => setFormData({ ...formData, spatPuntoMedicion: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Resistencia Medida (Ohms Ω)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.spatResistenciaMedidaOhms ?? 4.8}
                        onChange={(e) => handleSpatResistanceChange(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Máximo Permitido NOM (Ohms Ω)</label>
                      <input
                        type="number"
                        value={formData.spatValorMaximoPermitidoOhms ?? 25}
                        onChange={(e) => setFormData({ ...formData, spatValorMaximoPermitidoOhms: parseFloat(e.target.value) || 25 })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dictamen SPAT</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.spatDictamen || 'CUMPLE NORMATIVA (≤ 25 Ω)'}
                        className={`w-full px-3 py-2 text-xs border rounded-lg font-bold font-mono ${
                          (formData.spatDictamen || '').includes('CUMPLE NORMATIVA')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 8. Descripción Técnica */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>8. Descripción Técnica y Análisis de Resultados</span>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={formData.descripcionTecnica || ''}
                      onChange={(e) => setFormData({ ...formData, descripcionTecnica: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                      placeholder="Describa el comportamiento de la carga, tensiones registradas, desbalance y estado normativo del sistema de puesta a tierra..."
                    />
                  </div>
                </div>

                {/* 9. Evidencias Fotográficas */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>9. Registro Fotográfico de Evidencias (Instrumentos y Mediciones en Sitio)</span>
                  </div>

                  <EvidenceUploader
                    evidencias={formData.evidencias || []}
                    onChange={(evs) => setFormData({ ...formData, evidencias: evs })}
                    maxItems={10}
                  />
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Guardar Formato de Medición</span>
                  </button>
                </div>

              </form>

            </div>
          ) : selectedReport ? (
            /* ==================================================================== */
            /* DOCUMENT VIEWER & ACTIONS (PÁGINA 9)                                  */
            /* ==================================================================== */
            <div className="space-y-4">
              
              {/* Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(selectedReport)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-slate-600" />
                    <span>Editar Medición</span>
                  </button>

                  <button
                    onClick={() => setIsSignatureModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 text-amber-700" />
                    <span>Firmar Perito</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Confirma eliminar la medición de Folio ${selectedReport.folio}?`)) {
                        onDeleteReport(selectedReport.id);
                        showToast(`Medición de Folio ${selectedReport.folio} eliminada.`);
                      }
                    }}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition cursor-pointer"
                    title="Eliminar formato"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* PDF Export Button (White paper) */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Papel Blanco Oficial</span>
                  </div>

                  <button
                    onClick={handleExportPdf}
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
                        <span>Exportar PDF (Página 9)</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* ==================================================================== */}
              {/* PRINTABLE PAGE 9: FORMATO TÉCNICO DE MEDICIONES DE VARIABLES        */}
              {/* ==================================================================== */}
              <div className="flex flex-col items-center">
                
                <div className="no-print mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-amber-400 rounded-full text-xs font-mono font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>FORMATO TÉCNICO DE MEDICIONES — PÁGINA 9</span>
                </div>

                <div
                  id="doc-mediciones-pagina-9"
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
                        FORMATO TÉCNICO DE MEDICIONES DE VARIABLES ELÉCTRICAS
                      </h2>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                        PÁGINA 9 • REGISTRO DE PARÁMETROS ELÉCTRICOS, CARGAS Y SISTEMA DE PUESTA A TIERRA
                      </p>
                      <p className="text-[9.5px] text-slate-600 font-sans">
                        Conforme a las Especificaciones Técnicas de la Norma Oficial Mexicana <strong>NOM-001-SEDE-2012</strong> y <strong>NOM-022-STPS-2015</strong>
                      </p>
                    </div>

                    {/* Subheader: Logo and Info */}
                    <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-900">
                      <div className="space-y-0.5 text-xs">
                        <span className="font-bold text-slate-900 block">Tipo de Medición / Inspección:</span>
                        <div className="text-[11px] text-slate-800 font-sans">
                          • Comprobación de tensión, balanceo de fases y factor de potencia
                        </div>
                        <div className="text-[11px] text-slate-800 font-sans">
                          • Medición de resistencia del Sistema de Puesta a Tierra (SPAT)
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

                    {/* OFFICIAL TABLE: PÁGINA 9 */}
                    <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-white">
                      
                      {/* Row 1: Folio, Clave, Fecha */}
                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs font-bold">
                        <div className="col-span-4 p-1.5 flex items-center">
                          <span>Medición Folio: <strong className="font-mono text-cyan-900">{selectedReport.folio}</strong></span>
                        </div>
                        <div className="col-span-5 p-1.5 text-center font-mono text-[10px] sm:text-xs flex items-center justify-center">
                          {selectedReport.claveExpediente}
                        </div>
                        <div className="col-span-3 p-1.5 flex items-center justify-end pr-2">
                          <span>Fecha: <strong className="font-mono">{selectedReport.fechaMedicion}</strong></span>
                        </div>
                      </div>

                      {/* Row 2: Inmueble y Giro */}
                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs">
                        <div className="col-span-3 p-1.5 font-bold">Centro de Trabajo / Razón Social:</div>
                        <div className="col-span-9 p-1.5 font-bold uppercase text-[11px]">
                          {selectedReport.nombreComercial} {selectedReport.nombreRazonSocial ? `— ${selectedReport.nombreRazonSocial}` : ''}
                        </div>
                      </div>

                      {/* Row 3: Domicilio y RFC */}
                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs">
                        <div className="col-span-3 p-1.5 font-bold">Ubicación / RFC:</div>
                        <div className="col-span-6 p-1.5 uppercase text-[10.5px]">
                          {selectedReport.domicilioCompleto}, {selectedReport.municipioEstado} C.P. {selectedReport.codigoPostal}
                        </div>
                        <div className="col-span-3 p-1.5 font-mono font-bold text-center text-xs">
                          RFC: {selectedReport.rfc}
                        </div>
                      </div>

                      {/* Row 4: Solicitante y Giro */}
                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-xs">
                        <div className="col-span-3 p-1.5 font-bold">Solicitante / Giro:</div>
                        <div className="col-span-5 p-1.5 uppercase text-[10.5px]">
                          {selectedReport.solicitante} {selectedReport.solicitanteTelefono ? `(Tel. ${selectedReport.solicitanteTelefono})` : ''}
                        </div>
                        <div className="col-span-4 p-1.5 uppercase text-[10px] leading-tight">
                          {selectedReport.giro}
                        </div>
                      </div>

                      {/* Row 5: Instrumentación de Prueba */}
                      <div className="bg-slate-100 p-1 font-bold text-[11px] text-center uppercase tracking-wider text-slate-900">
                        INSTRUMENTACIÓN DE PRUEBA Y EQUIPO UTILIZADO
                      </div>

                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-[10.5px]">
                        <div className="col-span-4 p-1.5">
                          <span className="font-bold block">Equipo:</span>
                          <span>{selectedReport.instrumentoNombre}</span>
                        </div>
                        <div className="col-span-3 p-1.5">
                          <span className="font-bold block">Marca / Modelo:</span>
                          <span className="font-mono">{selectedReport.instrumentoMarca} {selectedReport.instrumentoModelo}</span>
                        </div>
                        <div className="col-span-2 p-1.5">
                          <span className="font-bold block">Serie:</span>
                          <span className="font-mono">{selectedReport.instrumentoSerie}</span>
                        </div>
                        <div className="col-span-3 p-1.5">
                          <span className="font-bold block">Calibración:</span>
                          <span className="text-[10px]">{selectedReport.instrumentoCalibracion}</span>
                        </div>
                      </div>

                      {/* Row 6: Tensión Eléctrica */}
                      <div className="bg-slate-100 p-1 font-bold text-[11px] text-center uppercase tracking-wider text-slate-900">
                        PARÁMETROS DE TENSIÓN ELÉCTRICA (VOLTS)
                      </div>

                      <div className="grid grid-cols-4 divide-x-2 divide-slate-900 text-center text-[10.5px]">
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">F1 - F2:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.tensionF1F2} V</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">F2 - F3:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.tensionF2F3} V</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">F3 - F1:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.tensionF3F1} V</span>
                        </div>
                        <div className="p-1 bg-amber-50/50">
                          <span className="text-[9.5px] font-bold text-amber-900 block">Promedio F - F:</span>
                          <span className="font-mono font-black text-xs text-amber-900">{selectedReport.tensionPromedioFF} V</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 divide-x-2 divide-slate-900 text-center text-[10.5px]">
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">F1 - Neutro:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.tensionF1N} V</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">F2 - Neutro:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.tensionF2N} V</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">F3 - Neutro:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.tensionF3N} V</span>
                        </div>
                        <div className="p-1 bg-amber-50/50">
                          <span className="text-[9.5px] font-bold text-amber-900 block">Promedio F - N:</span>
                          <span className="font-mono font-black text-xs text-amber-900">{selectedReport.tensionPromedioFN} V</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-[10.5px]">
                        <div className="col-span-4 p-1.5">
                          <span className="font-bold">Tensión Neutro - Tierra (V):</span>
                          <div className="font-mono font-black text-xs text-slate-900">{selectedReport.tensionNT} V (Límite &lt; 2.0 V)</div>
                        </div>
                        <div className="col-span-8 p-1.5 flex items-center justify-between">
                          <span className="font-bold">Evaluación Normativa de Tensión:</span>
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            {selectedReport.evaluacionTension}
                          </span>
                        </div>
                      </div>

                      {/* Row 7: Corriente Eléctrica */}
                      <div className="bg-slate-100 p-1 font-bold text-[11px] text-center uppercase tracking-wider text-slate-900">
                        PARÁMETROS DE CORRIENTE ELÉCTRICA (AMPERES)
                      </div>

                      <div className="grid grid-cols-5 divide-x-2 divide-slate-900 text-center text-[10.5px]">
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">Fase 1 (A):</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.corrienteF1} A</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">Fase 2 (A):</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.corrienteF2} A</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">Fase 3 (A):</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.corrienteF3} A</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">Neutro In (A):</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.corrienteNeutro} A</span>
                        </div>
                        <div className="p-1 bg-emerald-50/50">
                          <span className="text-[9.5px] font-bold text-emerald-900 block">% Desbalance:</span>
                          <span className="font-mono font-black text-xs text-emerald-900">{selectedReport.desbalanceCorrientePorcentaje}%</span>
                        </div>
                      </div>

                      {/* Row 8: Potencia Eléctrica y Factor de Potencia */}
                      <div className="bg-slate-100 p-1 font-bold text-[11px] text-center uppercase tracking-wider text-slate-900">
                        POTENCIA ELÉCTRICA Y FACTOR DE POTENCIA (FP)
                      </div>

                      <div className="grid grid-cols-4 divide-x-2 divide-slate-900 text-center text-[10.5px]">
                        <div className="p-1.5">
                          <span className="text-[9.5px] text-slate-600 block">Potencia Activa:</span>
                          <span className="font-mono font-black text-xs text-slate-900">{selectedReport.potenciaActivaKw} kW</span>
                        </div>
                        <div className="p-1.5">
                          <span className="text-[9.5px] text-slate-600 block">Potencia Reactiva:</span>
                          <span className="font-mono font-black text-xs text-slate-900">{selectedReport.potenciaReactivaKvar} kVAR</span>
                        </div>
                        <div className="p-1.5">
                          <span className="text-[9.5px] text-slate-600 block">Potencia Aparente:</span>
                          <span className="font-mono font-black text-xs text-slate-900">{selectedReport.potenciaAparenteKva} kVA</span>
                        </div>
                        <div className="p-1.5 bg-purple-50/50">
                          <span className="text-[9.5px] font-bold text-purple-900 block">% Utilización:</span>
                          <span className="font-mono font-black text-xs text-purple-900">{selectedReport.porcentajeUtilizacionCapacidad}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 divide-x-2 divide-slate-900 text-center text-[10.5px]">
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">FP Fase 1:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.factorPotenciaF1}</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">FP Fase 2:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.factorPotenciaF2}</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[9.5px] text-slate-600 block">FP Fase 3:</span>
                          <span className="font-mono font-bold text-xs">{selectedReport.factorPotenciaF3}</span>
                        </div>
                        <div className="p-1 bg-amber-50/50">
                          <span className="text-[9.5px] font-bold text-amber-900 block">FP Promedio:</span>
                          <span className="font-mono font-black text-xs text-amber-900">{selectedReport.factorPotenciaTotal}</span>
                        </div>
                      </div>

                      {/* Row 9: Polaridad en Contactos y GFCI */}
                      <div className="bg-slate-100 p-1 font-bold text-[11px] text-center uppercase tracking-wider text-slate-900">
                        VERIFICACIÓN DE POLARIDAD Y CONTACTOS
                      </div>

                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-[10.5px]">
                        <div className="col-span-6 p-1.5">
                          <span className="font-bold block">Polaridad en Contactos:</span>
                          <span>{selectedReport.polaridadContactos}</span>
                        </div>
                        <div className="col-span-6 p-1.5">
                          <span className="font-bold block">Prueba Disparo GFCI:</span>
                          <span className="font-semibold text-emerald-800">{selectedReport.pruebaGfciDisparo}</span>
                        </div>
                      </div>

                      {/* Row 10: Resistencia a Tierra SPAT */}
                      <div className="bg-slate-100 p-1 font-bold text-[11px] text-center uppercase tracking-wider text-slate-900">
                        MEDICIÓN DE RESISTENCIA DE PUESTA A TIERRA (SPAT) — NOM-022-STPS-2015
                      </div>

                      <div className="grid grid-cols-12 divide-x-2 divide-slate-900 text-[10.5px]">
                        <div className="col-span-4 p-1.5">
                          <span className="font-bold block">Método:</span>
                          <span>{selectedReport.spatMetodo}</span>
                        </div>
                        <div className="col-span-3 p-1.5">
                          <span className="font-bold block">Punto de Medición:</span>
                          <span className="text-[10px]">{selectedReport.spatPuntoMedicion}</span>
                        </div>
                        <div className="col-span-2 p-1.5 text-center bg-emerald-50/60">
                          <span className="font-bold text-[9.5px] text-emerald-900 block">Valor Medido:</span>
                          <span className="font-mono font-black text-sm text-emerald-900">{selectedReport.spatResistenciaMedidaOhms} Ω</span>
                        </div>
                        <div className="col-span-3 p-1.5 text-center">
                          <span className="font-bold text-[9.5px] text-slate-600 block">Dictamen SPAT (≤ 25 Ω):</span>
                          <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-400 inline-block">
                            {selectedReport.spatDictamen}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Technical Description & Remarks */}
                    <div className="border border-slate-900 p-2.5 text-[10.5px] leading-relaxed bg-white">
                      <strong className="block text-slate-900 mb-1">Descripción Técnica y Análisis de Resultados:</strong>
                      <p className="text-justify font-serif text-slate-900">
                        {selectedReport.descripcionTecnica}
                      </p>
                    </div>

                    {/* Photographic Evidence Gallery */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-900 pb-0.5 flex items-center justify-between">
                        <span>EVIDENCIAS FOTOGRÁFICAS (MEDICIONES E INSTRUMENTACIÓN EN SITIO)</span>
                        <span className="text-[10px] text-slate-600 font-sans">
                          {selectedReport.evidencias?.length || 0} registro(s) fotográfico(s)
                        </span>
                      </div>

                      {selectedReport.evidencias && selectedReport.evidencias.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          {selectedReport.evidencias.slice(0, 4).map((evi, idx) => (
                            <div key={evi.id || idx} className="border border-slate-400 p-1.5 bg-slate-50 flex flex-col items-center">
                              <div className="w-full h-36 bg-slate-200 overflow-hidden rounded flex items-center justify-center">
                                <img
                                  src={evi.dataUrl}
                                  alt={evi.nombre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="mt-1 w-full text-center">
                                <span className="font-bold text-[10px] text-slate-900 block truncate">{evi.nombre}</span>
                                {evi.descripcion && (
                                  <span className="text-[9px] text-slate-600 block line-clamp-1">{evi.descripcion}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed border-slate-300 text-center text-xs text-slate-500 rounded font-sans">
                          No se han adjuntado evidencias fotográficas aún. Pulse en "Editar Medición" para capturar con la cámara o subir fotos de multímetro/telurómetro.
                        </div>
                      )}
                    </div>

                    {/* Official Signatures & QR Accreditation Block */}
                    <div className="border-t-2 border-slate-900 pt-3 mt-2 grid grid-cols-12 gap-4 items-center">
                      
                      {/* Left: Perito Certification */}
                      <div className="col-span-8 space-y-1 text-left text-[11px] leading-tight">
                        <p className="font-bold text-slate-900 text-xs">
                          {selectedReport.peritoNombre}
                        </p>
                        <p className="text-[10.5px] text-slate-800">
                          Perito Responsable Dictaminador de Instalaciones Eléctricas
                        </p>
                        <p className="font-mono text-[10px] text-slate-700">
                          Registro CFP: <strong>{selectedReport.peritoAfiliacion}</strong>
                        </p>
                        <p className="font-mono text-[10px] text-slate-700">
                          Cédula Profesional: <strong>{selectedReport.peritoCedula}</strong>
                        </p>
                        <p className="text-[9.5px] text-slate-600 font-sans">
                          Contacto: {selectedReport.peritoTelefono} • {selectedReport.peritoEmail}
                        </p>
                      </div>

                      {/* Right: Signature & QR */}
                      <div className="col-span-4 flex items-center justify-end gap-3">
                        {/* Digital Signature */}
                        <div className="flex flex-col items-center">
                          {selectedReport.firmaDigital ? (
                            <img
                              src={selectedReport.firmaDigital}
                              alt="Firma del Perito"
                              className="h-14 max-w-[120px] object-contain border-b border-slate-900 pb-0.5"
                            />
                          ) : (
                            <div className="h-14 w-28 border-b border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400">
                              (Pendiente firma)
                            </div>
                          )}
                          <span className="text-[9px] font-bold text-slate-800 mt-0.5 uppercase tracking-wider">
                            FIRMA DEL PERITO
                          </span>
                        </div>

                        {/* Official QR Code */}
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 bg-white border border-slate-300 p-0.5 flex items-center justify-center">
                            <QrCode className="w-12 h-12 text-slate-900" />
                          </div>
                          <span className="text-[8px] font-mono text-slate-500 mt-0.5">CFP VALID</span>
                        </div>
                      </div>

                    </div>

                    {/* Official Footer: Page 9 */}
                    <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-sans">
                      <span>COLEGIO FEDERAL DE PERITOS • DELEGACIÓN MICHOACÁN</span>
                      <span className="font-mono font-bold text-slate-800">PÁGINA 9</span>
                      <span>NOM-001-SEDE-2012 / NOM-022-STPS-2015</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              Seleccione una medición del listado o cree una nueva.
            </div>
          )}

        </div>

      </div>

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
