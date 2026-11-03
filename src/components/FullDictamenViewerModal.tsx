import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Eye, 
  Layers, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  FileCheck2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FullDictamenExpediente } from '../types';
import { Full10PageDictamenDocument } from './Full10PageDictamenDocument';
import { exportFull10PageDictamenToPdf } from '../utils/pdfExport';

interface FullDictamenViewerModalProps {
  dictamen: FullDictamenExpediente | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (dictamen: FullDictamenExpediente) => void;
}

export const FullDictamenViewerModal: React.FC<FullDictamenViewerModalProps> = ({
  dictamen,
  isOpen,
  onClose,
  onEdit
}) => {
  const [printMode, setPrintMode] = useState<'digital' | 'physical_paper'>('digital');
  const [activePageTab, setActivePageTab] = useState<number | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);

  if (!isOpen || !dictamen) return null;

  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportProgress({ current: 1, total: 10 });
    try {
      const isDigital = printMode === 'digital';
      await exportFull10PageDictamenToPdf(
        `modal-view-dictamen-${dictamen.id}`,
        dictamen.folio,
        dictamen.titularNombreComercial || 'DICTAMEN',
        isDigital,
        (current, total) => setExportProgress({ current, total })
      );
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const pages = [
    { num: 1, title: '1. Dictamen NOM-001 (P.1)' },
    { num: 2, title: '2. Solicitud y Fachada (P.2)' },
    { num: 3, title: '3. Evaluación Suministro (P.3)' },
    { num: 4, title: '4. Evaluación Tableros (P.4)' },
    { num: 5, title: '5. Seguridad Laboral (P.5)' },
    { num: 6, title: '6. Pruebas y Veredicto (P.6)' },
    { num: 7, title: '7. Mediciones Variables (P.7)' },
    { num: 8, title: '8. Diagrama Unifilar (P.8)' },
    { num: 9, title: '9. Cédula SEP (P.9)' },
    { num: 10, title: '10. Certificado CFP (P.10)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Floating Control Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white flex-shrink-0 z-20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-tight truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">
                Dictamen Completo • Folio #{dictamen.folio}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                10 Páginas Oficiales
              </span>
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {dictamen.titularNombreComercial} • Perito: {dictamen.peritoNombre}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setPrintMode('digital')}
              className={`px-3 py-1.5 rounded transition ${
                printMode === 'digital'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Incluye el fondo oficial de papel de seguridad verde para entrega digital"
            >
              Fondo Guilloché (Digital)
            </button>
            <button
              onClick={() => setPrintMode('physical_paper')}
              className={`px-3 py-1.5 rounded transition ${
                printMode === 'physical_paper'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Omite el fondo para imprimir directamente sobre papel de seguridad oficial preimpreso"
            >
              Sin Fondo (Papel Físico)
            </button>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Pág {exportProgress?.current || 1}/10...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Descargar PDF (10 Páginas)</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>

          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(dictamen);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              Editar Módulos
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Cerrar visor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Page Tabs Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar flex-shrink-0 z-10">
        <button
          onClick={() => setActivePageTab('all')}
          className={`px-3 py-1 rounded-md font-bold transition flex-shrink-0 cursor-pointer ${
            activePageTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Ver Todas (10 Páginas)
        </button>
        {pages.map((p) => (
          <button
            key={p.num}
            onClick={() => setActivePageTab(p.num)}
            className={`px-2.5 py-1 rounded-md font-medium transition flex-shrink-0 cursor-pointer ${
              activePageTab === p.num
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pág. {p.num}
          </button>
        ))}
      </div>

      {/* Main Document Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <Full10PageDictamenDocument
            dictamen={dictamen}
            securityBgStyle={printMode === 'digital' ? 'guilloche' : 'clean'}
            containerPrefix={`modal-view-dictamen-${dictamen.id}`}
            currentPageOnly={activePageTab === 'all' ? undefined : activePageTab}
          />
        </div>
      </div>

      {/* Footer Info Notice */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Norma Oficial Mexicana NOM-001-SEDE-2012 • Colegio Federal de Peritos A.C.</span>
        </div>
        <div className="text-right">
          <span>{printMode === 'digital' ? 'Modo: Papel de Seguridad Digital' : 'Modo: Preparado para Impresión en Papel Físico'}</span>
        </div>
      </footer>

    </div>
  );
};
