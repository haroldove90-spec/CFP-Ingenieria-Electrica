import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  PlusCircle,
  Barcode, 
  Server,
  ChevronLeft,
  ChevronRight,
  ShieldCheck, 
  Zap, 
  LogOut, 
  FileText
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab = 'dashboard' | 'revisiones' | 'nuevo_dictamen' | 'verificador' | 'configuracion';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onToggle: () => void;
  activeRole: UserRole;
  onLogout: () => void;
  reportsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onToggle,
  activeRole,
  onLogout,
  reportsCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Panel General',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'nuevo_dictamen' as ActiveTab,
      label: 'Nuevo Dictamen',
      icon: PlusCircle,
      badge: 'Crear',
      highlight: true,
    },
    {
      id: 'revisiones' as ActiveTab,
      label: 'Historial de Dictámenes',
      icon: FileCheck2,
      badge: reportsCount.toString(),
    },
    {
      id: 'verificador' as ActiveTab,
      label: 'Verificador Código / QR',
      icon: Barcode,
      badge: 'NOM',
    },
    {
      id: 'configuracion' as ActiveTab,
      label: 'Base de Datos & Supabase',
      icon: Server,
      badge: null,
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 z-20 flex-shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Sidebar Brand header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          {isOpen && (
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold tracking-wider text-white uppercase">CFP Peritajes</span>
              <span className="text-[10px] text-amber-400 font-medium">NOM-001-SEDE-2012</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title={isOpen ? "Colapsar menú" : "Expandir menú"}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isHighlight = item.highlight;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isHighlight
                  ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                isActive ? 'text-slate-950' : isHighlight ? 'text-amber-400' : 'text-slate-400'
              }`} />
              {isOpen && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : isHighlight
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-amber-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Perito Responsable Card at bottom */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={`rounded-xl bg-slate-800/70 p-3 border border-slate-700/60 ${
            isOpen ? '' : 'flex flex-col items-center justify-center p-2'
          }`}
        >
          {isOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{activeRole}</p>
                <p className="text-[10px] text-emerald-400 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Perito Autorizado
                </p>
              </div>
            </div>
          ) : (
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          )}

          <button
            onClick={onLogout}
            className={`mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 py-1.5 rounded-lg border border-rose-800/50 transition cursor-pointer ${
              isOpen ? '' : 'p-1.5'
            }`}
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            {isOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
