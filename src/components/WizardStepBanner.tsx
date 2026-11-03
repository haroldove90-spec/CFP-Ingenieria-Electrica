import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Eye, 
  FileCheck2, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';
import { FullDictamenExpediente, WizardModuleStep } from '../types';
import { ActiveTab } from './Sidebar';

interface WizardStepBannerProps {
  dictamen: FullDictamenExpediente;
  currentStep: ActiveTab;
  onNavigateStep: (step: ActiveTab) => void;
  onOpenViewer: () => void;
  onExitWizard: () => void;
}

export const WIZARD_STEPS: {
  num: number;
  id: ActiveTab;
  shortTitle: string;
  pageRange: string;
}[] = [
  { num: 1, id: 'revisiones', shortTitle: '1. Revisión NOM-001', pageRange: 'Pág. 1' },
  { num: 2, id: 'solicitud_servicios', shortTitle: '2. Solicitud & Fachada', pageRange: 'Pág. 2' },
  { num: 3, id: 'evaluacion_seguridad', shortTitle: '3. Evaluación Seg.', pageRange: 'Págs. 3-6' },
  { num: 4, id: 'mediciones_electricas', shortTitle: '4. Mediciones Técnicas', pageRange: 'Pág. 7' },
  { num: 5, id: 'diagrama_unifilar', shortTitle: '5. Diagrama Unifilar', pageRange: 'Pág. 8' },
  { num: 6, id: 'cedula_perito', shortTitle: '6. Cédula Profesional', pageRange: 'Pág. 9' },
  { num: 7, id: 'certificado_perito', shortTitle: '7. Certificado Perito', pageRange: 'Pág. 10' },
];

export const WizardStepBanner: React.FC<WizardStepBannerProps> = ({
  dictamen,
  currentStep,
  onNavigateStep,
  onOpenViewer,
  onExitWizard,
}) => {
  // Find current step number
  const currentStepObj = WIZARD_STEPS.find(s => s.id === currentStep);
  const currentStepNum = currentStepObj ? currentStepObj.num : 1;

  // An item is accessible if it's <= dictamen.stepProgress (already completed/unlocked) or if dictamen.isCompleted
  const isStepAccessible = (stepNum: number) => {
    if (dictamen.isCompleted) return true;
    return stepNum <= (dictamen.stepProgress || 1);
  };

  const handleStepClick = (stepNum: number, stepId: ActiveTab) => {
    if (isStepAccessible(stepNum)) {
      onNavigateStep(stepId);
    } else {
      alert(`🔒 Módulo bloqueado. Para acceder al Paso ${stepNum}, primero debes completar y guardar el módulo anterior.`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden mb-6 text-white">
      
      {/* Top Header info */}
      <div className="bg-slate-800/90 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">
                Flujo Guiado de Dictamen • Folio #{dictamen.folio}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                dictamen.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {dictamen.isCompleted ? '✅ Completo (10/10 Págs)' : `Paso ${currentStepNum} de 7`}
              </span>
            </div>
            <span className="text-xs text-slate-300">
              {dictamen.titularNombreComercial || 'Nuevo Inmueble en Inspección'} • {dictamen.fecha}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenViewer}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Dictamen (10 Págs)</span>
          </button>

          <button
            onClick={onExitWizard}
            className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Ir al Historial de Dictámenes"
          >
            <span>Historial</span>
          </button>
        </div>
      </div>

      {/* Stepper buttons (1 to 7) */}
      <div className="p-3 sm:p-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {WIZARD_STEPS.map((step, idx) => {
            const isAccessible = isStepAccessible(step.num);
            const isCurrent = currentStep === step.id;
            const isFinished = step.num < (dictamen.stepProgress || 1) || dictamen.isCompleted;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(step.num, step.id)}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md font-black'
                      : isFinished
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900/50'
                      : isAccessible
                      ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800/60 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isCurrent
                      ? 'bg-slate-950 text-amber-400'
                      : isFinished
                      ? 'bg-emerald-600 text-white'
                      : isAccessible
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-800 text-slate-600'
                  }`}>
                    {isFinished ? '✓' : step.num}
                  </div>

                  <div className="flex flex-col text-left leading-none">
                    <span>{step.shortTitle}</span>
                    <span className="text-[9px] opacity-75 mt-0.5">{step.pageRange}</span>
                  </div>

                  {!isAccessible && (
                    <Lock className="w-3 h-3 text-slate-500 ml-1" />
                  )}
                </button>

                {idx < WIZARD_STEPS.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${
                    step.num < (dictamen.stepProgress || 1) ? 'text-emerald-500' : 'text-slate-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
};
