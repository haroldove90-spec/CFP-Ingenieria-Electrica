import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Image as ImageIcon, Eye, Plus, Check } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceUploaderProps {
  evidencias: EvidenceItem[];
  onChange: (evidencias: EvidenceItem[]) => void;
  readOnly?: boolean;
  maxItems?: number;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  evidencias,
  onChange,
  readOnly = false,
  maxItems = 12,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreview, setSelectedPreview] = useState<EvidenceItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Resize and compress image using HTML5 Canvas to prevent LocalStorage bloat
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newItems: EvidenceItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        if (evidencias.length + newItems.length >= maxItems) break;
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const dataUrl = await processImageFile(file);
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
          year: '2-digit'
        });

        newItems.push({
          id: `evi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          dataUrl,
          nombre: file.name.replace(/\.[^/.]+$/, '').substring(0, 40),
          descripcion: 'Evidencia fotográfica levantada en sitio',
          fecha: dateStr,
        });
      }

      if (newItems.length > 0) {
        onChange([...evidencias, ...newItems]);
      }
    } catch (err) {
      console.error('Error al procesar imágenes de evidencia:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleDeleteItem = (id: string) => {
    onChange(evidencias.filter(item => item.id !== id));
    if (selectedPreview?.id === id) setSelectedPreview(null);
  };

  const handleUpdateDescription = (id: string, descripcion: string) => {
    onChange(
      evidencias.map(item =>
        item.id === id ? { ...item, descripcion } : item
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload trigger bar */}
      {!readOnly && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-xl shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>Evidencia Fotográfica de la Instalación</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                  {evidencias.length}/{maxItems} fotos
                </span>
              </h4>
              <p className="text-[11px] text-slate-300">
                Toma fotos directas desde tu móvil o sube imágenes de la subestación, tableros y medidor
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Camera Input for Mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFilesSelected}
              className="hidden"
            />
            {/* Gallery / File Picker Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />

            {/* Button 1: Tomar Foto (Mobile Camera) */}
            <button
              type="button"
              disabled={isProcessing || evidencias.length >= maxItems}
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Abrir cámara del dispositivo móvil para tomar foto en sitio"
            >
              <Camera className="w-4 h-4" />
              <span>Tomar Foto</span>
            </button>

            {/* Button 2: Subir Imagen (Files / Gallery) */}
            <button
              type="button"
              disabled={isProcessing || evidencias.length >= maxItems}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Seleccionar imágenes de la galería o archivos"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Subir Imagen</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of uploaded evidence items */}
      {evidencias.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50/50">
          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
          <p className="text-xs font-semibold text-slate-600">
            No se han adjuntado evidencias fotográficas aún.
          </p>
          {!readOnly && (
            <p className="text-[11px] text-slate-400">
              Pulsa en &quot;Subir Fotos / Evidencia&quot; para cargar imágenes desde la galería o tomar fotos directas desde tu móvil.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {evidencias.map((item, idx) => (
            <div
              key={item.id}
              className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              {/* Image Thumbnail */}
              <div 
                className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedPreview(item)}
              >
                <img
                  src={item.dataUrl}
                  alt={item.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                  #{idx + 1}
                </span>

                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-1.5 bg-white/90 text-slate-900 rounded-full shadow-sm hover:scale-110 transition">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-2 flex-1 flex flex-col justify-between gap-1 bg-white">
                {!readOnly ? (
                  <input
                    type="text"
                    value={item.descripcion || ''}
                    onChange={(e) => handleUpdateDescription(item.id, e.target.value)}
                    placeholder="Descripción o pie de foto..."
                    className="w-full text-[11px] font-medium text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-0.5 pb-0.5"
                  />
                ) : (
                  <p className="text-[11px] font-medium text-slate-800 truncate" title={item.descripcion}>
                    {item.descripcion || item.nombre}
                  </p>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="font-mono">{item.fecha}</span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-0.5 rounded hover:bg-rose-50 transition cursor-pointer"
                      title="Eliminar evidencia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal Preview */}
      {selectedPreview && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPreview(null)}
        >
          <div 
            className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-white">
              <span className="text-xs font-bold truncate">
                {selectedPreview.descripcion || selectedPreview.nombre}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-2 max-h-[75vh] flex items-center justify-center overflow-auto bg-black">
              <img
                src={selectedPreview.dataUrl}
                alt={selectedPreview.nombre}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded"
              />
            </div>
            <div className="p-3 text-right bg-slate-900 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
