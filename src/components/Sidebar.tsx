import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Barcode, 
  Server,
  ChevronLeft,
  ChevronRight,
  ShieldCheck, 
  Zap, 
  LogOut, 
  Wrench,
  ClipboardList,
  Activity,
  Layers,
  Award,
  Calendar
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab = 
  | 'dashboard' 
  | 'agenda'
  | 'nuevo_dictamen' 
  | 'revisiones' 
  | 'solicitud_servicios' 
  | 'condiciones_operativas' 
  | 'evaluacion_seguridad'
  | 'mediciones_electricas'
  | 'diagrama_unifilar'
  | 'cedula_perito'
  | 'certificado_perito'
  | 'verificador' 
  | 'configuracion';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onToggle: () => void;
  activeRole: UserRole;
  onLogout: () => void;
  reportsCount: number;
  appointmentsCount?: number;
  serviceRequestsCount?: number;
  operatingConditionsCount?: number;
  safetyEvaluationsCount?: number;
  electricalMeasurementsCount?: number;
  diagramsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onToggle,
  activeRole,
  onLogout,
  reportsCount,
  appointmentsCount = 0,
  serviceRequestsCount = 0,
  operatingConditionsCount = 0,
  safetyEvaluationsCount = 0,
  electricalMeasurementsCount = 0,
  diagramsCount = 0,
}) => {
  // Accesos de Control y Gestión
  const generalItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Panel General',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'agenda' as ActiveTab,
      label: 'Agenda de Citas',
      icon: Calendar,
      badge: appointmentsCount > 0 ? appointmentsCount.toString() : null,
      highlight: true,
    },
    {
      id: 'solicitud_servicios' as ActiveTab,
      label: 'Solicitud de Servicios',
      icon: ClipboardList,
      badge: serviceRequestsCount > 0 ? serviceRequestsCount.toString() : null,
    },
  ];

  // 7 Módulos Oficiales del Expediente Pericial en el orden exacto solicitado
  const officialModules = [
    {
      num: '1',
      id: 'revisiones' as ActiveTab,
      label: '1.- REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 1 y 2 • Dictamen Pericial NOM-001',
      icon: FileCheck2,
      badge: reportsCount > 0 ? `${reportsCount} doc` : 'Pág. 1-2',
    },
    {
      num: '2',
      id: 'condiciones_operativas' as ActiveTab,
      label: '2.- REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 3 y 4 • Condiciones Operativas',
      icon: Wrench,
      badge: operatingConditionsCount > 0 ? `${operatingConditionsCount} doc` : 'Pág. 3-4',
    },
    {
      num: '3',
      id: 'evaluacion_seguridad' as ActiveTab,
      label: '3.- FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD',
      sublabel: 'Páginas 5 a 8 • Evaluación de Seguridad',
      icon: ShieldCheck,
      badge: safetyEvaluationsCount > 0 ? `${safetyEvaluationsCount} doc` : 'Pág. 5-8',
    },
    {
      num: '4',
      id: 'mediciones_electricas' as ActiveTab,
      label: '4.- FORMATO TECNICO DE MEDICIONES DE VARIABLES ELECTRICAS',
      sublabel: 'Página 9 • Mediciones de Variables',
      icon: Activity,
      badge: electricalMeasurementsCount > 0 ? `${electricalMeasurementsCount} doc` : 'Pág. 9',
    },
    {
      num: '5',
      id: 'diagrama_unifilar' as ActiveTab,
      label: '5.- DIAGRAMA UNIFILAR GENERAL',
      sublabel: 'Formato Carta Horizontal / Vertical',
      icon: Layers,
      badge: diagramsCount > 0 ? `${diagramsCount} doc` : 'Plano',
    },
    {
      num: '6',
      id: 'cedula_perito' as ActiveTab,
      label: '6.- Cédula profesional del Perito',
      sublabel: 'Dirección General de Profesiones (SEP)',
      icon: Award,
      badge: 'SEP',
    },
    {
      num: '7',
      id: 'certificado_perito' as ActiveTab,
      label: '7.- CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELECTRICAS EN MEDIA Y BAJA TENSION',
      sublabel: 'Colegio / CFP Peritaje Oficial M.T. y B.T.',
      icon: ShieldCheck,
      badge: 'CFP',
    },
  ];

  // Herramientas y Configuración
  const utilityItems = [
    {
      id: 'verificador' as ActiveTab,
      label: 'Verificador Código / QR',
      icon: Barcode,
      badge: 'QR',
    },
    {
      id: 'configuracion' as ActiveTab,
      label: 'Administración y Supabase',
      icon: Server,
      badge: 'Cloud',
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 z-20 flex-shrink-0 ${
        isOpen ? 'w-80' : 'w-20'
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
              <span className="text-xs font-black tracking-wider text-white uppercase">CFP PERITAJES</span>
              <span className="text-[10px] text-amber-400 font-semibold">NOM-001-SEDE-2012</span>
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
      <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        
        {/* Sección 1: Panel y Agenda */}
        <div className="space-y-1">
          {isOpen && (
            <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gestión General
            </div>
          )}
          {generalItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isHighlight = item.highlight;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : isHighlight
                    ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-slate-950' : isHighlight ? 'text-amber-400' : 'text-slate-400'
                }`} />
                {isOpen ? (
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
                ) : (
                  item.badge && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 self-center"></span>
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Sección 2: Los 7 Módulos Oficiales Reorganizados */}
        <div className="space-y-1 pt-1 border-t border-slate-800/80">
          {isOpen && (
            <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <span>Expediente Oficial (1 al 7)</span>
              <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20 text-[9px]">
                Secuencia NOM
              </span>
            </div>
          )}

          {officialModules.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition cursor-pointer relative group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {/* Badge con el número de módulo 1 al 7 */}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5 ${
                  isActive
                    ? 'bg-slate-950 text-amber-400'
                    : 'bg-slate-800 text-amber-400 border border-slate-700 group-hover:border-amber-500/50'
                }`}>
                  {item.num}
                </div>

                {isOpen ? (
                  <div className="flex-1 min-w-0 pr-1">
                    <p className={`text-[11px] leading-tight font-bold line-clamp-2 ${
                      isActive ? 'text-slate-950' : 'text-slate-200'
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 truncate ${
                      isActive ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {item.sublabel}
                    </p>
                  </div>
                ) : (
                  <div className="hidden"></div>
                )}

                {isOpen && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 self-center ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sección 3: Herramientas y Supabase */}
        <div className="space-y-1 pt-1 border-t border-slate-800/80">
          {isOpen && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Herramientas y Nube
            </div>
          )}
          {utilityItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-slate-950' : 'text-slate-400'
                }`} />
                {isOpen && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
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
        </div>

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
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{activeRole}</p>
                <p className="text-[10px] text-emerald-400 truncate flex items-center gap-1 font-semibold">
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
            className={`mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 py-1.5 rounded-lg border border-rose-800/50 transition cursor-pointer font-medium ${
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
