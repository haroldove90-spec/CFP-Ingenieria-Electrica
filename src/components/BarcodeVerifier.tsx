import React, { useState } from 'react';
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
  QrCode
} from 'lucide-react';
import { RevisionReport } from '../types';
import { generateBarcodeSvg, generateQrMatrixSvg } from '../utils/barcode';

interface BarcodeVerifierProps {
  reports: RevisionReport[];
  onSelectReport: (reportId: string) => void;
}

export const BarcodeVerifier: React.FC<BarcodeVerifierProps> = ({
  reports,
  onSelectReport,
}) => {
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
    // Find by folio, clave, or rfc
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
      // Auto scan sample 359
      const sampleFolio = '359';
      setScannedCode(sampleFolio);
      handleVerify(sampleFolio);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BarcodeIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              Verificador Pericial de Código de Barras & QR
            </h2>
            <p className="text-xs text-slate-400">
              Validación en campo de autenticidad pericial y cumplimiento NOM-001-SEDE-2012
            </p>
          </div>
        </div>

        {/* Quick sample buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Folios rápidos:</span>
          {reports.slice(0, 3).map((r) => (
            <button
              key={r.id}
              onClick={() => handleQuickLookup(r.folio)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg text-xs font-mono font-bold transition"
            >
              #{r.folio}
            </button>
          ))}
        </div>
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
            <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-center justify-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Lector óptico activado... decodificando código de barras pericial...</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Result */}
      {searched && !matchedReport && (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-rose-900">Dictamen No Encontrado</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">
            El código o folio "{scannedCode}" no corresponde a ningún informe emitido o vigente en la base de datos pericial.
          </p>
        </div>
      )}

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
            
            {/* Visual Barcode & QR Verification Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Código de Barras Oficial
              </span>
              <div
                className="w-full flex justify-center py-2 bg-white rounded border border-slate-200 p-2"
                dangerouslySetInnerHTML={{
                  __html: generateBarcodeSvg(matchedReport.folio, 260, 42),
                }}
              />

              <div className="w-full pt-2 border-t border-slate-200 flex items-center justify-center gap-3">
                <div
                  className="p-1 bg-white border border-slate-300 rounded"
                  dangerouslySetInnerHTML={{
                    __html: generateQrMatrixSvg(
                      `CFP:${matchedReport.folio}:${matchedReport.claveExpediente}`,
                      80
                    ),
                  }}
                />
                <div className="text-left text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800">Sello Criptográfico</p>
                  <p className="font-mono text-[10px] text-slate-500 truncate max-w-[130px]">{matchedReport.claveExpediente}</p>
                  <p className="text-emerald-700 font-semibold mt-0.5">Certificado Activo</p>
                </div>
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
  );
};
