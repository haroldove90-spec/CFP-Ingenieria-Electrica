import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RotateCw, 
  Save, 
  CheckCircle2, 
  FileCheck2, 
  ShieldCheck, 
  Building, 
  Calendar, 
  Eye, 
  Info,
  Loader2,
  RefreshCw,
  Zap,
  Award
} from 'lucide-react';
import { PeritoCertificado, UserRole } from '../types';
import { exportDirectImageToPdf, exportDocumentToPdf } from '../utils/pdfExport';
import { SAMPLE_CERTIFICADO_DATA_URL } from '../utils/documentSamples';

interface PeritoCertificadoModuleProps {
  certificado: PeritoCertificado;
  activeRole: UserRole;
  onSaveCertificado: (cert: PeritoCertificado) => void;
}

export const PeritoCertificadoModule: React.FC<PeritoCertificadoModuleProps> = ({
  certificado,
  activeRole,
  onSaveCertificado,
}) => {
  const [formState, setFormState] = useState<PeritoCertificado>(certificado);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFormState(certificado);
  }, [certificado]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione una imagen válida (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormState(prev => ({
          ...prev,
          imagenDataUrl: result,
        }));
        setRotation(0);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleSave = () => {
    onSaveCertificado(formState);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleRestoreSample = () => {
    setFormState(prev => ({
      ...prev,
      imagenDataUrl: SAMPLE_CERTIFICADO_DATA_URL,
    }));
    setRotation(0);
  };

  // Export to Letter PDF spanning full width and length ("a todo lo ancho y largo")
  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const filename = `Certificado_Perito_${formState.numeroRegistro.replace(/[^a-zA-Z0-9]/g, '_')}_${formState.peritoNombre.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Export to full letter page (margin 0 for full bleed or 4mm for clean border)
      await exportDirectImageToPdf({
        imageDataUrl: formState.imagenDataUrl,
        filename,
        orientation: 'portrait',
        fullBleed: false,
        marginMm: 4, // 4mm margin allows full width and length while preventing printer clipping
      });
    } catch (err) {
      console.error('Error al exportar certificado a PDF:', err);
      alert('Hubo un inconveniente al generar el PDF del certificado. Por favor reintente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
              Certificación Colegiada CFP
            </span>
            <span className="text-xs font-bold text-slate-500">
              NOM-001-SEDE-2012 • Media y Baja Tensión
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            Certificado como Perito Dictaminador en Media y Baja Tensión
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Carga y resguardo del certificado pericial autorizado para exportar en PDF en una hoja tamaño carta a todo lo ancho y largo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Certificado</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando Carta...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Exportar PDF Carta (Ancho y Largo Completo)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>¡Certificado de perito dictaminador autorizado guardado exitosamente en el sistema!</span>
        </div>
      )}

      {/* Main Grid: Left Controls (5 cols) + Right Full Bleed Preview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Upload & Accreditation Form */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Image Upload Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-600" />
              Subir Certificado Autorizado
            </h2>

            <p className="text-xs text-slate-600">
              Suba la imagen o escaneo de su constancia autorizada como perito dictaminador. El sistema conservará toda la resolución para la exportación a hoja carta completa.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs border border-amber-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Subir Imagen del Certificado</span>
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-slate-600" />
                <span>Girar ({rotation}°)</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">¿Restaurar el formato autorizado de muestra?</span>
              <button
                type="button"
                onClick={handleRestoreSample}
                className="text-amber-700 font-semibold hover:underline cursor-pointer"
              >
                Restaurar muestra
              </button>
            </div>
          </div>

          {/* Accreditation Details Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Datos de la Acreditación Pericial
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Título de la Certificación</label>
                <input
                  type="text"
                  value={formState.tituloCertificado}
                  onChange={(e) => setFormState({ ...formState, tituloCertificado: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Perito Dictaminador Acreditado</label>
                <input
                  type="text"
                  value={formState.peritoNombre}
                  onChange={(e) => setFormState({ ...formState, peritoNombre: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Número de Registro / Afiliación CFP</label>
                <input
                  type="text"
                  value={formState.numeroRegistro}
                  onChange={(e) => setFormState({ ...formState, numeroRegistro: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Cédula Profesional</label>
                  <input
                    type="text"
                    value={formState.numeroCedula}
                    onChange={(e) => setFormState({ ...formState, numeroCedula: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Vigencia</label>
                  <input
                    type="text"
                    value={formState.vigencia}
                    onChange={(e) => setFormState({ ...formState, vigencia: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Especialidad</label>
                  <input
                    type="text"
                    value={formState.especialidad}
                    onChange={(e) => setFormState({ ...formState, especialidad: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Fecha de Emisión</label>
                  <input
                    type="text"
                    value={formState.fechaEmision}
                    onChange={(e) => setFormState({ ...formState, fechaEmision: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Colegio Emisor</label>
                <input
                  type="text"
                  value={formState.colegioEmisor}
                  onChange={(e) => setFormState({ ...formState, colegioEmisor: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Observaciones</label>
                <textarea
                  rows={2}
                  value={formState.observaciones || ''}
                  onChange={(e) => setFormState({ ...formState, observaciones: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Letter Size Sheet Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">
                Vista de Constancia en Hoja Tamaño Carta (215.9 x 279.4 mm)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                A Todo lo Ancho y Largo
              </span>
            </div>
          </div>

          {/* Sheet Preview Container */}
          <div className="bg-slate-200 p-4 sm:p-6 rounded-2xl flex items-center justify-center overflow-auto border border-slate-300">
            
            {/* Exact Letter Ratio Sheet (215.9 / 279.4) */}
            <div
              id="certificado-preview-sheet"
              style={{
                width: '100%',
                maxWidth: '560px',
                aspectRatio: '215.9 / 279.4',
              }}
              className="bg-white rounded-lg shadow-xl border border-slate-300 p-4 flex flex-col justify-between transition-all"
            >
              
              {/* Full Bleed / Full Height Certificate Image */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden rounded bg-slate-50/50">
                <img
                  src={formState.imagenDataUrl}
                  alt={formState.tituloCertificado}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  className="rounded transition-transform duration-200 shadow-xs"
                />
              </div>

            </div>

          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Hoja Tamaño Carta a Todo lo Ancho y Largo:</strong> Al exportar a PDF, la constancia abarca toda la superficie de la hoja tamaño carta (8.5 x 11 pulgadas / 215.9 x 279.4 mm), conservando su membrete institucional, escudos, firmas y sellos periciales con máxima nitidez.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
