import React from 'react';
import { LayoutDashboard, FileCheck2, PlusCircle, ClipboardList, Wrench, ShieldCheck, Activity } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface BottomBarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  reportsCount: number;
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
  serviceRequestsCount = 0,
  operatingConditionsCount = 0,
  safetyEvaluationsCount = 0,
  electricalMeasurementsCount = 0,
  diagramsCount = 0,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Inicio',
      icon: LayoutDashboard,
    },
    {
      id: 'solicitud_servicios' as ActiveTab,
      label: 'Solicitud',
      icon: ClipboardList,
      badge: serviceRequestsCount,
    },
    {
      id: 'condiciones_operativas' as ActiveTab,
      label: 'Pág 3-4',
      icon: Wrench,
      badge: operatingConditionsCount,
    },
    {
      id: 'evaluacion_seguridad' as ActiveTab,
      label: 'Pág 5-8',
      icon: ShieldCheck,
      badge: safetyEvaluationsCount,
    },
    {
      id: 'mediciones_electricas' as ActiveTab,
      label: 'Pág 9',
      icon: Activity,
      badge: electricalMeasurementsCount,
    },
    {
      id: 'revisiones' as ActiveTab,
      label: 'Historial',
      icon: FileCheck2,
      badge: reportsCount,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 safe-area-pb shadow-2xl">
      <div className="grid grid-cols-6 h-16 max-w-xl mx-auto px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const isAction = 'isAction' in tab && Boolean((tab as any).isAction);

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : isAction
                  ? 'text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-full shadow-sm shadow-amber-400/50"></span>
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-amber-400 scale-110'
                      : isAction
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[65px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
