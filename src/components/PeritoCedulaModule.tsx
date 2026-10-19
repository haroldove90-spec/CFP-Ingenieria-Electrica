import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RotateCw, 
  Save, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  FileCheck, 
  Eye, 
  Info,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { PeritoCedula, UserRole } from '../types';
import { exportDirectImageToPdf, exportDocumentToPdf } from '../utils/pdfExport';
import { SAMPLE_CEDULA_DATA_URL } from '../utils/documentSamples';

interface PeritoCedulaModuleProps {
  cedula: PeritoCedula;
  activeRole: UserRole;
  onSaveCedula: (cedula: PeritoCedula) => void;
}

export const PeritoCedulaModule: React.FC<PeritoCedulaModuleProps> = ({
  cedula,
  activeRole,
  onSaveCedula,
}) => {
  const [formState, setFormState] = useState<PeritoCedula>(cedula);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if prop updates
  React.useEffect(() => {
    setFormState(cedula);
  }, [cedula]);

  // Handle uploading user's own cédula image
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
    onSaveCedula(formState);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleRestoreSample = () => {
    setFormState(prev => ({
      ...prev,
      imagenDataUrl: SAMPLE_CEDULA_DATA_URL,
    }));
    setRotation(0);
  };

  // Export to Letter PDF spanning the FULL WIDTH of the page
  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const filename = `Cedula_Profesional_${formState.numeroCedula}_${formState.peritoNombre.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Export using high fidelity letter renderer
      await exportDirectImageToPdf({
        imageDataUrl: formState.imagenDataUrl,
        filename,
        orientation: 'portrait',
        fullBleed: false,
        marginMm: 8, // minimal margin so it spans the full width of the letter page
      });
    } catch (err) {
      console.error('Error al exportar cédula a PDF:', err);
      alert('Hubo un inconveniente al generar el PDF de la cédula. Por favor reintente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Acreditación Oficial
            </span>
            <span className="text-xs font-bold text-slate-500">
              Secretaría de Educación Pública • DGP
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            Cédula Profesional del Perito
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Carga y resguardo de la cédula profesional oficial para anexar y exportar en PDF en todo lo ancho de la hoja tamaño carta.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cédula</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando Carta...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Exportar PDF Carta (Todo el Ancho)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>¡Datos e imagen de la cédula profesional guardados exitosamente!</span>
        </div>
      )}

      {/* Main Grid: Data & Actions (Left 5) + Live Full Width Preview (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Image Actions */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Image Upload & Management Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" />
              Gestión de Imagen de la Cédula
            </h2>

            <p className="text-xs text-slate-600">
              Suba la imagen o escaneo nítido de la cédula profesional (frente o formato credencial/electrónico). El sistema ajustará la imagen a todo lo ancho de la hoja tamaño carta al exportar.
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
                className="flex-1 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs border border-emerald-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Subir Imagen de Cédula</span>
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
              <span className="text-slate-500">¿Desea restaurar el formato de muestra?</span>
              <button
                type="button"
                onClick={handleRestoreSample}
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Restaurar muestra
              </button>
            </div>
          </div>

          {/* Form Fields: Perito & Cedula Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Datos Oficiales Registrados
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Nombre Completo del Perito</label>
                <input
                  type="text"
                  value={formState.peritoNombre}
                  onChange={(e) => setFormState({ ...formState, peritoNombre: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Número de Cédula</label>
                  <input
                    type="text"
                    value={formState.numeroCedula}
                    onChange={(e) => setFormState({ ...formState, numeroCedula: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Año / Expedición</label>
                  <input
                    type="text"
                    value={formState.fechaExpedicion}
                    onChange={(e) => setFormState({ ...formState, fechaExpedicion: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Profesión / Licenciatura</label>
                <input
                  type="text"
                  value={formState.profesion}
                  onChange={(e) => setFormState({ ...formState, profesion: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Institución Emisora</label>
                <input
                  type="text"
                  value={formState.institucionEmisora}
                  onChange={(e) => setFormState({ ...formState, institucionEmisora: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">CURP</label>
                  <input
                    type="text"
                    value={formState.curp || ''}
                    onChange={(e) => setFormState({ ...formState, curp: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Folio de Registro</label>
                  <input
                    type="text"
                    value={formState.folioRegistro || ''}
                    onChange={(e) => setFormState({ ...formState, folioRegistro: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Observaciones y Acreditación</label>
                <textarea
                  rows={2}
                  value={formState.observaciones || ''}
                  onChange={(e) => setFormState({ ...formState, observaciones: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Letter Size Sheet Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                Vista de Impresión Tamaño Carta (215.9 x 279.4 mm)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Abarca Todo el Ancho
              </span>
            </div>
          </div>

          {/* Letter Container Sheet */}
          <div className="bg-slate-200 p-4 sm:p-6 rounded-2xl flex items-center justify-center overflow-auto border border-slate-300">
            
            {/* Exact Letter Proportion (215.9 / 279.4) */}
            <div
              id="cedula-preview-sheet"
              style={{
                width: '100%',
                maxWidth: '560px',
                aspectRatio: '215.9 / 279.4',
              }}
              className="bg-white rounded-lg shadow-xl border border-slate-300 p-6 flex flex-col justify-between transition-all"
            >
              
              {/* Institutional Header */}
              <div className="border-b-2 border-slate-800 pb-2.5 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 tracking-wider">COLEGIO FEDERAL DE PERITOS</h3>
                    <p className="text-[10px] font-semibold text-slate-600">ANEXO TÉCNICO • CONSTANCIA DE CÉDULA PROFESIONAL</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold text-[10px] rounded">
                      CÉDULA {formState.numeroCedula}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cédula Image Spanning Full Width */}
              <div className="flex-1 w-full flex items-center justify-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200 p-2 overflow-hidden">
                <img
                  src={formState.imagenDataUrl}
                  alt={`Cédula Profesional ${formState.numeroCedula}`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  className="rounded shadow-sm transition-transform duration-200"
                />
              </div>

              {/* Institutional Bottom Box */}
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-center">
                <p className="text-xs font-black text-slate-800">
                  {formState.peritoNombre.toUpperCase()}
                </p>
                <p className="text-[11px] text-emerald-800 font-bold">
                  {formState.profesion} • CÉDULA PROFESIONAL NO. {formState.numeroCedula}
                </p>
                <p className="text-[9px] text-slate-500">
                  Documento validado para la emisión de Dictámenes Periciales de Instalaciones Eléctricas en Media y Baja Tensión bajo la NOM-001-SEDE-2012.
                </p>
              </div>

            </div>

          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Formato Carta a Todo lo Ancho:</strong> Al generar el PDF, la imagen de la cédula se escala para ocupar el ancho total útil de la hoja tamaño carta (8.5 x 11 pulgadas / 215.9 x 279.4 mm), manteniendo la nitidez de números, nombres, sellos y códigos QR oficiales para su cotejo legal.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
