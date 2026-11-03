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
  ClipboardList
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface BottomBarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  reportsCount: number;
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
      shortLabel: '1. Revisión P.1-2',
      fullTitle: '1.- REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 1 y 2 • Dictamen Pericial NOM-001-SEDE-2012',
      icon: FileCheck2,
      badge: reportsCount,
    },
    {
      num: '2',
      id: 'condiciones_operativas' as ActiveTab,
      shortLabel: '2. Revisión P.3-4',
      fullTitle: '2.- REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 3 y 4 • Condiciones Operativas de Seguridad',
      icon: Wrench,
      badge: operatingConditionsCount,
    },
    {
      num: '3',
      id: 'evaluacion_seguridad' as ActiveTab,
      shortLabel: '3. Evaluación Seg.',
      fullTitle: '3.- FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 5 a 8 • Evaluación de Seguridad de Instalaciones',
      icon: ShieldCheck,
      badge: safetyEvaluationsCount,
    },
    {
      num: '4',
      id: 'mediciones_electricas' as ActiveTab,
      shortLabel: '4. Mediciones',
      fullTitle: '4.- FORMATO TECNICO DE MEDICIONES DE VARIABLES ELECTRICAS',
      sublabel: 'Página 9 • Mediciones de Variables y Aislamiento',
      icon: Activity,
      badge: electricalMeasurementsCount,
    },
    {
      num: '5',
      id: 'diagrama_unifilar' as ActiveTab,
      shortLabel: '5. Diagrama',
      fullTitle: '5.- DIAGRAMA UNIFILAR GENERAL',
      sublabel: 'Diagrama Unifilar Formato Carta Horizontal / Vertical',
      icon: Layers,
      badge: diagramsCount,
    },
    {
      num: '6',
      id: 'cedula_perito' as ActiveTab,
      shortLabel: '6. Cédula',
      fullTitle: '6.- Cédula profesional del Perito',
      sublabel: 'Dirección General de Profesiones (SEP)',
      icon: Award,
      badge: 0,
    },
    {
      num: '7',
      id: 'certificado_perito' as ActiveTab,
      shortLabel: '7. Certificado',
      fullTitle: '7.- CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELECTRICAS EN MEDIA Y BAJA TENSION',
      sublabel: 'Perito Dictaminador CFP Oficial M.T. y B.T.',
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

  // Elementos visibles en la barra inferior (Secuencia 1 al 7 prioritaria + Inicio & Agenda)
  const allBarTabs: BarTabItem[] = [
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
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsSheetOpen(false);
                    }}
                    className={`w-full text-left pt-2.5 first:pt-0 p-3 rounded-xl transition flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5 ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}>
                      {item.num}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${
                        isActive ? 'text-slate-950' : 'text-white'
                      }`}>
                        {item.fullTitle}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${
                        isActive ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {item.sublabel}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 flex-shrink-0 self-center ${
                      isActive ? 'text-slate-950' : 'text-slate-500'
                    }`} />
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

            return (
              <button
                key={tab.id}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex-shrink-0 flex flex-col items-center justify-center px-2.5 py-1 min-w-[70px] sm:min-w-[85px] h-14 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-full shadow-sm shadow-amber-400/50"></span>
                )}
                
                <div className="relative flex items-center gap-1">
                  {tab.num && (
                    <span className={`text-[10px] font-black px-1 rounded ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {tab.num}
                    </span>
                  )}
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-amber-400 scale-110'
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
