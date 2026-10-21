import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Barcode as BarcodeIcon, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  ShieldCheck, 
  Zap, 
  Building, 
  UserCheck, 
  Camera, 
  Printer,
  QrCode,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Sliders,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  Trash2
} from 'lucide-react';
import { RevisionReport, GeneratedQrCode } from '../types';
import { 
  getGeneratedQrCodes, 
  saveGeneratedQrCode, 
  deleteGeneratedQrCode 
} from '../utils/storage';

interface BarcodeVerifierProps {
  reports: RevisionReport[];
  onSelectReport: (reportId: string) => void;
}

export const BarcodeVerifier: React.FC<BarcodeVerifierProps> = ({
  reports,
  onSelectReport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'verificar' | 'generador'>('generador');

  // ==========================================
  // ESTADO DE VERIFICADOR Y ESCÁNER
  // ==========================================
  const [scannedCode, setScannedCode] = useState('');
  const [matchedReport, setMatchedReport] = useState<RevisionReport | null>(
    reports.length > 0 ? reports[0] : null
  );
  const [searched, setSearched] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const handleVerify = (codeToVerify?: string) => {
    const code = (codeToVerify ?? scannedCode).trim().toUpperCase();
    if (!code) return;

    setSearched(true);
    const found = reports.find(
      r => 
        r.folio.toUpperCase() === code ||
        code.includes(r.folio) ||
        r.claveExpediente.toUpperCase().includes(code) ||
        r.titularRfc.toUpperCase() === code
    );

    setMatchedReport(found || null);
  };

  const handleQuickLookup = (folio: string) => {
    setScannedCode(folio);
    handleVerify(folio);
  };

  const handleSimulateLaserScan = () => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      setIsSimulatingScan(false);
      const sampleFolio = '359';
      setScannedCode(sampleFolio);
      handleVerify(sampleFolio);
    }, 1200);
  };

  // ==========================================
  // ESTADO DEL GENERADOR DE CÓDIGOS QR
  // ==========================================
  const [qrSourceMode, setQrSourceMode] = useState<'desde_dictamen' | 'independiente'>('desde_dictamen');
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  
  // Custom QR Form Fields
  const [qrClientName, setQrClientName] = useState(reports[0]?.titularNombreComercial || 'ABARROTES AZTECA TIJERAS S.A DE C.V');
  const [qrFolio, setQrFolio] = useState(reports[0]?.folio || '359');
  const [qrClave, setQrClave] = useState(reports[0]?.claveExpediente || 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026');
  const [qrPerito, setQrPerito] = useState(reports[0]?.peritoNombre || 'Ing. Israel Orozco Arias');
  const [qrCedula, setQrCedula] = useState(reports[0]?.peritoCedula || '15240154');
  const [qrFecha, setQrFecha] = useState(reports[0]?.fecha || '02-oct-26');
  const [qrDireccion, setQrDireccion] = useState('Juan de Baeza #600, Col. Dieciocho de Mayo, Morelia, Mich.');
  const [qrNorma, setQrNorma] = useState('NOM-001-SEDE-2012');
  const [qrUrlVerificacion, setQrUrlVerificacion] = useState('https://peritos.org/verificar/CFP-359');
  const [qrFormatoTexto, setQrFormatoTexto] = useState<'estructurado' | 'libre'>('estructurado');
  const [qrTextoLibre, setQrTextoLibre] = useState('');

  // QR Customization
  const [qrColor, setQrColor] = useState('#0b192c'); // Navy blue CFP
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(300);
  const [qrCorrectionLevel, setQrCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Generated QR output
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedQrs, setSavedQrs] = useState<GeneratedQrCode[]>(() => getGeneratedQrCodes());
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update fields when selecting another existing report
  useEffect(() => {
    if (qrSourceMode === 'desde_dictamen' && selectedReportId) {
      const rep = reports.find(r => r.id === selectedReportId);
      if (rep) {
        setQrClientName(rep.titularNombreComercial || rep.titularRazonSocial || '');
        setQrFolio(rep.folio || '');
        setQrClave(rep.claveExpediente || '');
        setQrPerito(rep.peritoNombre || '');
        setQrCedula(rep.peritoCedula || '');
        setQrFecha(rep.fecha || '');
        setQrDireccion(`${rep.titularCalleNumero}, ${rep.titularCiudadEstado}`);
        setQrUrlVerificacion(`https://peritos.org/verificar/CFP-${rep.folio}`);
      }
    }
  }, [selectedReportId, qrSourceMode, reports]);

  // Construct text content for the QR Code
  const qrRawContent = React.useMemo(() => {
    if (qrFormatoTexto === 'libre' && qrTextoLibre.trim()) {
      return qrTextoLibre.trim();
    }

    // Official structured CFP verification text
    return [
      `COLEGIO FEDERAL DE PERITOS (CFP)`,
      `DICTAMEN TÉCNICO EN MATERIA DE SEGURIDAD ELÉCTRICA`,
      `NORMATIVA: ${qrNorma}`,
      `CLIENTE: ${qrClientName}`,
      `FOLIO OFICIAL: #${qrFolio}`,
      `EXPEDIENTE: ${qrClave}`,
      `PERITO: ${qrPerito}`,
      `CÉDULA PROFESIONAL: ${qrCedula}`,
      `FECHA: ${qrFecha}`,
      qrDireccion ? `UBICACIÓN: ${qrDireccion}` : '',
      `VERIFICACIÓN: ${qrUrlVerificacion}`,
      `SELLO DIGITAL: CFP-VERIFIED-${qrFolio}-${Date.now().toString(36).toUpperCase()}`
    ].filter(Boolean).join('\n');
  }, [
    qrFormatoTexto,
    qrTextoLibre,
    qrNorma,
    qrClientName,
    qrFolio,
    qrClave,
    qrPerito,
    qrCedula,
    qrFecha,
    qrDireccion,
    qrUrlVerificacion
  ]);

  // Generate QR code whenever content or styling changes
  useEffect(() => {
    let isCancelled = false;

    async function generate() {
      try {
        const opts = {
          width: qrSize,
          margin: 2,
          color: {
            dark: qrColor,
            light: qrBgColor
          },
          errorCorrectionLevel: qrCorrectionLevel
        };

        const [dataUrl, svg] = await Promise.all([
          QRCode.toDataURL(qrRawContent, opts),
          QRCode.toString(qrRawContent, { ...opts, type: 'svg' })
        ]);

        if (!isCancelled) {
          setQrDataUrl(dataUrl);
          setQrSvgString(svg);
        }
      } catch (err) {
        console.error('Error generating QR Code:', err);
      }
    }

    generate();

    return () => {
      isCancelled = true;
    };
  }, [qrRawContent, qrColor, qrBgColor, qrSize, qrCorrectionLevel]);

  // Trigger feedback banner
  const notify = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 3500);
  };

  // Download QR as high-resolution PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Dictamen_${qrFolio || 'Pericial'}_${qrClientName.replace(/\s+/g, '_').substring(0, 20)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify('Código QR PNG de alta resolución descargado.');
  };

  // Download QR as SVG
  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_Dictamen_${qrFolio || 'Vector'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('Archivo vectorial SVG descargado.');
  };

  // Copy PNG image directly to clipboard
  const handleCopyImageToClipboard = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      notify('¡Imagen del código QR copiada al portapapeles! Puedes pegarla con Ctrl+V en Word o cualquier documento.');
    } catch {
      // Fallback: copy text content
      navigator.clipboard.writeText(qrRawContent);
      notify('Texto de verificación del QR copiado al portapapeles.');
    }
  };

  // Save QR to persistent storage
  const handleSaveQrRecord = () => {
    const newQr: GeneratedQrCode = {
      id: `qr-${Date.now()}`,
      titulo: `QR Folio #${qrFolio} - ${qrClientName}`,
      clienteNombre: qrClientName,
      folio: qrFolio,
      claveExpediente: qrClave,
      peritoNombre: qrPerito,
      peritoCedula: qrCedula,
      direccion: qrDireccion,
      fechaEmision: qrFecha,
      contenidoTexto: qrRawContent,
      color: qrColor,
      tamano: qrSize,
      dataUrl: qrDataUrl,
      svgString: qrSvgString,
      createdAt: new Date().toISOString()
    };

    const updated = saveGeneratedQrCode(newQr);
    setSavedQrs(updated);
    notify('Código QR guardado en el historial pericial para incrustar en dictámenes.');
  };

  // Delete saved QR
  const handleDeleteSavedQr = (id: string) => {
    const updated = deleteGeneratedQrCode(id);
    setSavedQrs(updated);
    notify('Código QR eliminado del historial.');
  };

  // Load saved QR into generator
  const handleLoadSavedQr = (saved: GeneratedQrCode) => {
    setQrSourceMode('independiente');
    setQrClientName(saved.clienteNombre);
    setQrFolio(saved.folio);
    setQrClave(saved.claveExpediente || '');
    setQrPerito(saved.peritoNombre || '');
    setQrCedula(saved.peritoCedula || '');
    setQrDireccion(saved.direccion || '');
    setQrFecha(saved.fechaEmision || '');
    if (saved.color) setQrColor(saved.color);
    if (saved.tamano) setQrSize(saved.tamano);
    notify(`Cargado código QR de "${saved.clienteNombre}".`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                Verificador & Generador de Códigos QR Periciales
              </h2>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                NOM-001-SEDE-2012
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Genera códigos QR independientes o enlazados a dictámenes con nombre del cliente, folio y sello pericial oficial.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('generador')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'generador'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Generador de QR</span>
          </button>

          <button
            onClick={() => setActiveSubTab('verificar')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'verificar'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Verificador & Escáner</span>
          </button>
        </div>
      </div>

      {/* Floating Notice */}
      {bannerNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 1: GENERADOR DE CÓDIGOS QR                             */}
      {/* ============================================================== */}
      {activeSubTab === 'generador' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Configuration & Form (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Datos del Código QR para Incrustar en Dictamen
                  </h3>
                  <p className="text-xs text-slate-500">
                    Personaliza el contenido que se codificará dentro del código QR
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setQrSourceMode('desde_dictamen')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      qrSourceMode === 'desde_dictamen'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Desde Dictamen
                  </button>
                  <button
                    onClick={() => setQrSourceMode('independiente')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      qrSourceMode === 'independiente'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Independiente
                  </button>
                </div>
              </div>

              {/* Source Mode: Select Report */}
              {qrSourceMode === 'desde_dictamen' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
                  <label className="block font-bold text-amber-950 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Seleccionar Dictamen Emitido para Generar su QR:</span>
                  </label>
                  <select
                    value={selectedReportId}
                    onChange={(e) => setSelectedReportId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    {reports.map(r => (
                      <option key={r.id} value={r.id}>
                        Folio #{r.folio} • {r.titularNombreComercial || r.titularRazonSocial} ({r.fecha})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Format selection */}
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-slate-700">Formato de contenido:</span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="qr_fmt"
                    checked={qrFormatoTexto === 'estructurado'}
                    onChange={() => setQrFormatoTexto('estructurado')}
                    className="text-amber-500"
                  />
                  <span>Estructurado Oficial (Cliente, Folio, Perito, Sello)</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="qr_fmt"
                    checked={qrFormatoTexto === 'libre'}
                    onChange={() => setQrFormatoTexto('libre')}
                    className="text-amber-500"
                  />
                  <span>Texto Libre / URL Directa</span>
                </label>
              </div>

              {/* Structured Fields */}
              {qrFormatoTexto === 'estructurado' ? (
                <div className="space-y-3.5 text-xs">
                  
                  {/* Row: Cliente & Folio */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Nombre del Cliente / Empresa <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={qrClientName}
                        onChange={(e) => setQrClientName(e.target.value)}
                        placeholder="Ej: ABARROTES AZTECA TIJERAS S.A DE C.V"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Folio Oficial <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={qrFolio}
                        onChange={(e) => setQrFolio(e.target.value)}
                        placeholder="359"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Row: Clave del Expediente & Fecha */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Clave de Expediente Pericial
                      </label>
                      <input
                        type="text"
                        value={qrClave}
                        onChange={(e) => setQrClave(e.target.value)}
                        placeholder="CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Fecha Emisión
                      </label>
                      <input
                        type="text"
                        value={qrFecha}
                        onChange={(e) => setQrFecha(e.target.value)}
                        placeholder="02-oct-26"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Row: Perito & Cédula */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Perito Dictaminador
                      </label>
                      <input
                        type="text"
                        value={qrPerito}
                        onChange={(e) => setQrPerito(e.target.value)}
                        placeholder="Ing. Israel Orozco Arias"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Cédula Profesional
                      </label>
                      <input
                        type="text"
                        value={qrCedula}
                        onChange={(e) => setQrCedula(e.target.value)}
                        placeholder="15240154"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Row: Dirección */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Dirección de la Instalación
                    </label>
                    <input
                      type="text"
                      value={qrDireccion}
                      onChange={(e) => setQrDireccion(e.target.value)}
                      placeholder="Calle, número, colonia, ciudad y estado"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Row: Norma & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Norma de Inspección
                      </label>
                      <input
                        type="text"
                        value={qrNorma}
                        onChange={(e) => setQrNorma(e.target.value)}
                        placeholder="NOM-001-SEDE-2012"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        URL de Verificación Web
                      </label>
                      <input
                        type="text"
                        value={qrUrlVerificacion}
                        onChange={(e) => setQrUrlVerificacion(e.target.value)}
                        placeholder="https://peritos.org/verificar/CFP-359"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <label className="block font-bold text-slate-700">
                    Contenido Personalizado / Texto Libre para el QR:
                  </label>
                  <textarea
                    rows={6}
                    value={qrTextoLibre}
                    onChange={(e) => setQrTextoLibre(e.target.value)}
                    placeholder="Ingresa aquí cualquier texto, URL de validación o datos que desees codificar en el código QR..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Cualquier smartphone que escanee este QR mostrará exactamente este texto o abrirá la dirección URL si comienza con http.
                  </p>
                </div>
              )}

              {/* Visual QR Styling Options */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  <span>Estilo y Calidad de Imagen:</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Color QR</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <span className="font-mono text-[11px]">{qrColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Color Fondo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <span className="font-mono text-[11px]">{qrBgColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Resolución</label>
                    <select
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value={200}>200 px (Pequeño)</option>
                      <option value={300}>300 px (Estándar)</option>
                      <option value={500}>500 px (Alta Calidad)</option>
                      <option value={800}>800 px (Impresión HD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Corrección Error</label>
                    <select
                      value={qrCorrectionLevel}
                      onChange={(e) => setQrCorrectionLevel(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="L">L (7% corrección)</option>
                      <option value="M">M (15% estándar)</option>
                      <option value="Q">Q (25% alta)</option>
                      <option value="H">H (30% máxima)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live QR Preview & Export (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-center flex flex-col items-center justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block">
                    Vista Previa de Código QR
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    Dictamen Oficial #{qrFolio || '000'}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[260px] mx-auto">
                    {qrClientName}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`Código QR Dictamen ${qrFolio}`}
                      className="w-56 h-56 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                      Generando QR...
                    </div>
                  )}

                  {/* Caption badge underneath QR */}
                  <div className="mt-2 text-[10px] font-mono text-slate-600 text-center space-y-0.5">
                    <p className="font-bold text-slate-900">CFP • NOM-001-SEDE-2012</p>
                    <p className="text-[9px] text-slate-500">Folio: #{qrFolio} • Cédula: {qrCedula}</p>
                  </div>
                </div>

                {/* Action Buttons for QR */}
                <div className="w-full space-y-2 pt-1">
                  
                  {/* Copy Image Button */}
                  <button
                    onClick={handleCopyImageToClipboard}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                    <span>{copied ? '¡Imagen Copiada! (Pega con Ctrl+V)' : 'Copiar Imagen al Portapapeles'}</span>
                  </button>

                  {/* Download PNG & SVG Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownloadPng}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Descargar PNG</span>
                    </button>

                    <button
                      onClick={handleDownloadSvg}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar SVG</span>
                    </button>
                  </div>

                  {/* Save to History / Dictamen button */}
                  <button
                    onClick={handleSaveQrRecord}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Guardar en Historial de Dictámenes</span>
                  </button>
                </div>

                {/* Info Note */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 text-left w-full space-y-1">
                  <p className="font-semibold text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>¿Cómo incrustar en tus dictámenes?</span>
                  </p>
                  <p className="text-[10px]">
                    Descarga el <strong>PNG</strong> o haz clic en <strong>Copiar Imagen</strong> para pegarla directamente en la carátula, anexos o planos de tu dictamen pericial.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Saved Generated QRs History Section */}
          {savedQrs.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Historial de Códigos QR Generados ({savedQrs.length})
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  Disponibles para re-descargar o volver a incrustar
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {savedQrs.map(sqr => (
                  <div
                    key={sqr.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 hover:bg-slate-100/70 transition"
                  >
                    {sqr.dataUrl && (
                      <img
                        src={sqr.dataUrl}
                        alt={sqr.titulo}
                        className="w-14 h-14 object-contain rounded border border-slate-200 bg-white flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-slate-900 truncate">
                        Folio #{sqr.folio}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">
                        {sqr.clienteNombre}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => handleLoadSavedQr(sqr)}
                          className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline"
                        >
                          Cargar
                        </button>
                        <a
                          href={sqr.dataUrl}
                          download={`QR_Folio_${sqr.folio}.png`}
                          className="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline"
                        >
                          PNG
                        </a>
                        <button
                          onClick={() => handleDeleteSavedQr(sqr.id)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-800 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: VERIFICADOR & ESCÁNER (VALIDACIÓN EN CAMPO)         */}
      {/* ============================================================== */}
      {activeSubTab === 'verificar' && (
        <div className="space-y-6">

          {/* Quick Folios Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Folios oficiales emitidos:</span>
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => handleQuickLookup(r.folio)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 rounded-lg text-xs font-mono font-bold transition shadow-2xs"
              >
                #{r.folio} • {r.titularNombreComercial?.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Input Box & Scanner Simulation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="max-w-2xl mx-auto space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                Escanear o Ingresar Número de Folio / Clave de Dictamen
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <BarcodeIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="Ejemplo: 359 o CFP0125/PCIEMBT..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
                
                <button
                  onClick={() => handleVerify()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Verificar</span>
                </button>

                <button
                  onClick={handleSimulateLaserScan}
                  disabled={isSimulatingScan}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2"
                  title="Simular escaneo de código de barras físico"
                >
                  <Camera className={`w-4 h-4 text-cyan-400 ${isSimulatingScan ? 'animate-pulse text-amber-400' : ''}`} />
                  <span className="hidden sm:inline">Escanear</span>
                </button>
              </div>

              {isSimulatingScan && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs text-cyan-700 flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping"></span>
                  <span>Lector óptico activado... decodificando código pericial...</span>
                </div>
              )}
            </div>
          </div>

          {/* Verification Result Not Found */}
          {searched && !matchedReport && (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-rose-900">Dictamen No Encontrado</h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto">
                El código o folio "{scannedCode}" no corresponde a ningún informe emitido o vigente en la base de datos pericial.
              </p>
            </div>
          )}

          {/* Verification Result Found */}
          {matchedReport && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
              {/* Top Status Bar */}
              <div className="bg-emerald-600 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-100">
                      Dictamen Verificado y Vigente
                    </span>
                    <h3 className="text-lg font-black">
                      Folio Oficial #{matchedReport.folio}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onSelectReport(matchedReport.id)}
                  className="px-4 py-2 bg-white text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-50 transition shadow"
                >
                  Abrir Documento Completo
                </button>
              </div>

              {/* Details Grid */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Visual QR Verification Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Sello Digital Oficial
                  </span>
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR"
                      className="w-32 h-32 object-contain bg-white p-1 rounded-lg border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-lg" />
                  )}
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <p className="font-bold text-slate-800 font-mono">Folio Oficial #{matchedReport.folio}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">{matchedReport.claveExpediente}</p>
                    <p className="text-emerald-700 font-semibold pt-1">Validado conforme NOM-001</p>
                  </div>
                </div>

                {/* Installation & Technical Parameters */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block border-b pb-1">
                    Parámetros Técnicos Auditados
                  </span>
                  
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tipo de Instalación:</span>
                      <span className="font-bold text-slate-800">{matchedReport.tipoInstalacionPrincipal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tensión de Suministro:</span>
                      <span className="font-bold text-slate-800">{matchedReport.tensionSuministro}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacidad Subestación:</span>
                      <span className="font-mono font-bold text-slate-900">{matchedReport.capacidadSubestacionKva} kVA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Carga Instalada:</span>
                      <span className="font-mono font-bold text-slate-900">{matchedReport.cargaInstaladaKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Clasificación:</span>
                      <span className="font-semibold text-slate-800">{matchedReport.clasificacionInstalacion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tipo de Servicio:</span>
                      <span className="font-semibold text-slate-800">{matchedReport.tipoServicio}</span>
                    </div>
                  </div>
                </div>

                {/* Titular & Perito Dictaminador */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block border-b pb-1">
                    Titular y Perito Dictaminador
                  </span>

                  <div className="space-y-1.5 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Establecimiento:</span>
                      <span className="font-bold text-slate-900">{matchedReport.titularNombreComercial}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">RFC:</span>
                      <span className="font-mono font-bold text-slate-800">{matchedReport.titularRfc}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Ubicación:</span>
                      <span className="text-slate-700">{matchedReport.titularCalleNumero}, {matchedReport.titularCiudadEstado}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500 block uppercase">Perito Responsable:</span>
                      <span className="font-bold text-slate-900 block">{matchedReport.peritoNombre}</span>
                      <span className="text-[10px] font-mono text-slate-600">Cédula: {matchedReport.peritoCedula} • {matchedReport.peritoAfiliacion}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
