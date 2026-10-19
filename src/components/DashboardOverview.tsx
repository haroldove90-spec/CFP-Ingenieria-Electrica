import { 
  FileCheck2, 
  Zap, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Building2, 
  AlertTriangle, 
  Barcode as BarcodeIcon,
  Server,
  Sparkles,
  ClipboardList,
  Wrench
} from 'lucide-react';
import { RevisionReport, UserRole } from '../types';
import { ActiveTab } from './Sidebar';

interface DashboardOverviewProps {
  reports: RevisionReport[];
  activeRole: UserRole;
  onNavigate: (tab: ActiveTab) => void;
  onOpenDataModal: () => void;
  serviceRequestsCount?: number;
  operatingConditionsCount?: number;
  safetyEvaluationsCount?: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reports,
  activeRole,
  onNavigate,
  onOpenDataModal,
  serviceRequestsCount = 0,
  operatingConditionsCount = 0,
  safetyEvaluationsCount = 0,
}) => {
  // Aggregate stats
  const totalReports = reports.length;
  const totalSubestacionesKva = reports.reduce((sum, r) => sum + (r.capacidadSubestacionKva || 0), 0);
  const totalCargaKw = reports.reduce((sum, r) => sum + (r.cargaInstaladaKw || 0), 0);
  const favorables = reports.filter(r => r.resultadoDictamen.includes('Favorable')).length;
  const complianceRate = totalReports > 0 ? Math.round((favorables / totalReports) * 100) : 100;

  const mediaTensionCount = reports.filter(r => r.tipoInstalacionPrincipal === 'Media y Baja Tensión').length;
  const bajaTensionCount = reports.filter(r => r.tipoInstalacionPrincipal === 'Baja Tensión').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <img src="/logo-cfp.svg" alt="CFP Watermark" className="w-72 h-72 object-contain" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ingeniería Eléctrica CFP • Michoacán</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Ingeniería Eléctrica CFP
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Plataforma oficial de dictaminación, inspección y emisión de informes de seguridad en instalaciones eléctricas de Media y Baja Tensión conforme a la NOM-001-SEDE-2012.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('nuevo_dictamen')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuevo Dictamen</span>
            </button>

            <button
              onClick={() => onNavigate('solicitud_servicios')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <span>Solicitudes ({serviceRequestsCount})</span>
            </button>

            <button
              onClick={() => onNavigate('condiciones_operativas')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Revisión ({operatingConditionsCount})</span>
            </button>

            <button
              onClick={() => onNavigate('evaluacion_seguridad')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Eval. Seguridad ({safetyEvaluationsCount})</span>
            </button>

            <button
              onClick={() => onNavigate('revisiones')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Historial ({totalReports})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Reports */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dictámenes Emitidos</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalReports}</span>
            <span className="text-xs font-semibold text-emerald-600">Activos</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Registrados con clave pericial única
          </p>
        </div>

        {/* Card 2: Subestaciones kVA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Capacidad Subestaciones</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalSubestacionesKva.toFixed(0)}</span>
            <span className="text-xs font-bold text-slate-600">kVA</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Potencia de transformación auditada
          </p>
        </div>

        {/* Card 3: Carga kW */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Carga Eléctrica</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalCargaKw.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-600">kW</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Demanda total instalada evaluada
          </p>
        </div>

        {/* Card 4: Tasa Cumplimiento */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Conformidad NOM-001</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{complianceRate}%</span>
            <span className="text-xs font-semibold text-slate-500">Aprobados</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {favorables} de {totalReports} instalaciones favorables
          </p>
        </div>

      </div>

      {/* Main split: Recent Reports + Quick Actions & Technical Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Reports Table (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Dictámenes Recientes de Seguridad Eléctrica
              </h3>
            </div>
            <button
              onClick={() => onNavigate('revisiones')}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                onClick={() => onNavigate('revisiones')}
                className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-rose-600 text-xs sm:text-sm">
                      FOLIO #{report.folio}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {report.tipoInstalacionPrincipal}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {report.titularNombreComercial}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-md">
                    {report.giroInstalacion}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-mono text-xs text-slate-600 font-medium">
                    {report.fecha}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {report.resultadoDictamen}
                  </span>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay dictámenes en la base de datos.
              </div>
            )}
          </div>
        </div>

        {/* Right side: Tension Breakdown & Quick Tools */}
        <div className="space-y-6">
          
          {/* Tension distribution card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Distribución por Tensión
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Media y Baja Tensión (≥ 1000 V)</span>
                  <span className="text-slate-900 font-bold">{mediaTensionCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{ width: `${totalReports > 0 ? (mediaTensionCount / totalReports) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Baja Tensión (&lt; 1000 V)</span>
                  <span className="text-slate-900 font-bold">{bajaTensionCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-2.5 rounded-full"
                    style={{ width: `${totalReports > 0 ? (bajaTensionCount / totalReports) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management & Database card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
              <Server className="w-4 h-4" />
              <span>Administración de Base de Datos</span>
            </div>

            <p className="text-xs text-slate-300">
              Administra los registros y datos del sistema, activa la exclusión de datos muestra o gestiona la persistencia.
            </p>

            <button
              onClick={onOpenDataModal}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Administrar Datos & Limpieza</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
