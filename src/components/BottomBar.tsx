import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Wrench, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Award, 
  Calendar, 
  Layers3, 
  X, 
  ChevronRight, 
  ClipboardList,
  Lock
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { FullDictamenExpediente } from '../types';

interface BottomBarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  reportsCount: number;
  dictamenesCount?: number;
  activeDictamen?: FullDictamenExpediente | null;
  appointmentsCount?: number;
  serviceRequestsCount?: number;
  operatingConditionsCount?: number;
  safetyEvaluationsCount?: number;
  electricalMeasurementsCount?: number;
  diagramsCount?: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentTab,
  onSelectTab,
  reportsCount,
  dictamenesCount = 0,
  activeDictamen = null,
  appointmentsCount = 0,
  serviceRequestsCount = 0,
  operatingConditionsCount = 0,
  safetyEvaluationsCount = 0,
  electricalMeasurementsCount = 0,
  diagramsCount = 0,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 7 Módulos Oficiales en la secuencia exacta solicitada
  const officialModules = [
    {
      num: '1',
      id: 'revisiones' as ActiveTab,
      shortLabel: '1. Revisión P.1',
      fullTitle: '1.- REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Página 1 • Dictamen Pericial NOM-001',
      icon: FileCheck2,
      badge: reportsCount,
    },
    {
      num: '2',
      id: 'solicitud_servicios' as ActiveTab,
      shortLabel: '2. Solicitud P.2',
      fullTitle: '2.- SOLICITUD DE SERVICIOS',
      sublabel: 'Página 2 • Datos y Foto Fachada',
      icon: ClipboardList,
      badge: serviceRequestsCount,
    },
    {
      num: '3',
      id: 'evaluacion_seguridad' as ActiveTab,
      shortLabel: '3. Eval. Seg. P.3-6',
      fullTitle: '3.- FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 3 a 6 • Evaluación Integral de Seguridad',
      icon: ShieldCheck,
      badge: safetyEvaluationsCount,
    },
    {
      num: '4',
      id: 'mediciones_electricas' as ActiveTab,
      shortLabel: '4. Mediciones P.7',
      fullTitle: '4.- FORMATO TECNICO DE MEDICIONES DE VARIABLES ELECTRICAS',
      sublabel: 'Página 7 • Mediciones de Variables y SPAT',
      icon: Activity,
      badge: electricalMeasurementsCount,
    },
    {
      num: '5',
      id: 'diagrama_unifilar' as ActiveTab,
      shortLabel: '5. Diagrama P.8',
      fullTitle: '5.- DIAGRAMA UNIFILAR GENERAL',
      sublabel: 'Página 8 • Plano Carta Horizontal / Vertical',
      icon: Layers,
      badge: diagramsCount,
    },
    {
      num: '6',
      id: 'cedula_perito' as ActiveTab,
      shortLabel: '6. Cédula P.9',
      fullTitle: '6.- Cédula profesional del Perito',
      sublabel: 'Página 9 • Dirección General de Profesiones (SEP)',
      icon: Award,
      badge: 0,
    },
    {
      num: '7',
      id: 'certificado_perito' as ActiveTab,
      shortLabel: '7. Certificado P.10',
      fullTitle: '7.- CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELECTRICAS EN MEDIA Y BAJA TENSION',
      sublabel: 'Página 10 • Colegio Federal de Peritos (CFP)',
      icon: ShieldCheck,
      badge: 0,
    },
  ];

  interface BarTabItem {
    id: ActiveTab;
    num?: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    isCore: boolean;
  }

  // Elementos visibles en la barra inferior (Historial + Inicio + Agenda + Secuencia 1 al 7)
  const allBarTabs: BarTabItem[] = [
    {
      id: 'historial_dictamenes',
      shortLabel: 'Historial',
      icon: FileCheck2,
      badge: dictamenesCount,
      isCore: false,
    },
    {
      id: 'dashboard',
      shortLabel: 'Inicio',
      icon: LayoutDashboard,
      badge: 0,
      isCore: false,
    },
    {
      id: 'agenda',
      shortLabel: 'Agenda',
      icon: Calendar,
      badge: appointmentsCount,
      isCore: false,
    },
    ...officialModules.map(m => ({
      id: m.id,
      num: m.num,
      shortLabel: m.shortLabel,
      icon: m.icon,
      badge: m.badge,
      isCore: true,
    }))
  ];

  // Auto-scroll al elemento activo en móviles
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentTab]);

  return (
    <>
      {/* Botón flotante rápido para abrir el índice oficial de los 7 módulos en móvil/tablet */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/50 text-amber-400 rounded-full shadow-xl shadow-black/40 backdrop-blur-md active:scale-95 transition text-xs font-bold cursor-pointer"
          title="Ver índice de los 7 módulos oficiales"
        >
          <Layers3 className="w-4 h-4 text-amber-400" />
          <span>Módulos 1 al 7</span>
        </button>
      </div>

      {/* Modal / Bottom Sheet con los 7 módulos oficiales en su formato completo */}
      {isSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header del Bottom Sheet */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                  1-7
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Expediente Oficial de Dictamen
                  </h3>
                  <p className="text-[11px] text-amber-400 font-semibold">
                    NOM-001-SEDE-2012 • 7 Módulos Periciales
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listado 1 al 7 */}
            <div className="p-4 space-y-2.5 overflow-y-auto divide-y divide-slate-800/60">
              {officialModules.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const stepNum = parseInt(item.num, 10);
                const isLocked = activeDictamen && !activeDictamen.isCompleted && !isNaN(stepNum) && stepNum > (activeDictamen.stepProgress || 1);

                const handleClick = () => {
                  if (isLocked) {
                    alert(`🔒 Módulo bloqueado. Para acceder al Paso ${item.num} (${item.fullTitle}), primero debes completar y guardar los módulos anteriores en orden.`);
                    return;
                  }
                  onSelectTab(item.id);
                  setIsSheetOpen(false);
                };

                return (
                  <button
                    key={item.id}
                    onClick={handleClick}
                    className={`w-full text-left pt-2.5 first:pt-0 p-3 rounded-xl transition flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : isLocked
                        ? 'text-slate-500 opacity-60'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5 ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : isLocked
                        ? 'bg-slate-800 text-slate-500 border border-slate-800'
                        : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}>
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : item.num}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${
                        isActive ? 'text-slate-950' : isLocked ? 'text-slate-400' : 'text-white'
                      }`}>
                        {item.fullTitle}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${
                        isActive ? 'text-slate-800' : 'text-slate-500'
                      }`}>
                        {item.sublabel}
                      </p>
                    </div>

                    {isLocked ? (
                      <Lock className="w-4 h-4 text-slate-500 self-center" />
                    ) : (
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 self-center ${
                        isActive ? 'text-slate-950' : 'text-slate-500'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Accesos rápidos de gestión */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  onSelectTab('dashboard');
                  setIsSheetOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Panel Inicio</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('agenda');
                  setIsSheetOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 font-semibold"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Agenda ({appointmentsCount})</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('solicitud_servicios');
                  setIsSheetOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 font-semibold"
              >
                <ClipboardList className="w-4 h-4 text-amber-400" />
                <span>Solicitudes ({serviceRequestsCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de navegación inferior principal (Móvil y Tablet) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 safe-area-pb shadow-2xl">
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 h-16 max-w-full mx-auto scroll-smooth"
        >
          {allBarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const stepNum = tab.num ? parseInt(tab.num, 10) : NaN;
            const isLocked = activeDictamen && !activeDictamen.isCompleted && !isNaN(stepNum) && stepNum > (activeDictamen.stepProgress || 1);

            const handleClick = () => {
              if (isLocked) {
                alert(`🔒 Módulo bloqueado. Para acceder al Paso ${tab.num}, primero debes completar y guardar los módulos anteriores.`);
                return;
              }
              onSelectTab(tab.id);
            };

            return (
              <button
                key={tab.id}
                data-active={isActive ? 'true' : 'false'}
                onClick={handleClick}
                className={`relative flex-shrink-0 flex flex-col items-center justify-center px-2.5 py-1 min-w-[70px] sm:min-w-[85px] h-14 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/40'
                    : isLocked
                    ? 'text-slate-600 opacity-60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-full shadow-sm shadow-amber-400/50"></span>
                )}
                
                <div className="relative flex items-center gap-1">
                  {tab.num && (
                    <span className={`text-[10px] font-black px-1 rounded ${
                      isActive ? 'bg-amber-400 text-slate-950' : isLocked ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {isLocked ? '🔒' : tab.num}
                    </span>
                  )}
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-amber-400 scale-110'
                        : isLocked
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[80px]">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
