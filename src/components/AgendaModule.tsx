import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Share2, 
  Download, 
  CalendarPlus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Zap, 
  Sparkles, 
  Bell, 
  Check, 
  X,
  FileText,
  CalendarCheck2
} from 'lucide-react';
import { Appointment, AppointmentStatus, UserRole, RevisionReport } from '../types';
import { 
  buildGoogleCalendarUrl, 
  generateIcsCalendar, 
  buildWhatsAppReminderUrl, 
  getTodayDateString 
} from '../utils/storage';

interface AgendaModuleProps {
  appointments: Appointment[];
  reports: RevisionReport[];
  activeRole: UserRole | null;
  onSaveAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const SERVICE_TYPES = [
  'Dictamen Pericial NOM-001-SEDE-2012',
  'Revisión Periódica de Seguridad Eléctrica',
  'Medición de Resistencia de Puesta a Tierra (SPAT)',
  'Medición de Variables Eléctricas y Calidad de Energía',
  'Levantamiento de Diagrama Unifilar y Censo de Cargas',
  'Evaluación Integral de Seguridad en Áreas Peligrosas',
  'Inspección Previa para Contratación CFE',
  'Asesoría Técnica y Dictaminación Especializada',
  'Otro Servicio Pericial'
];

export const AgendaModule: React.FC<AgendaModuleProps> = ({
  appointments,
  reports,
  activeRole,
  onSaveAppointment,
  onDeleteAppointment,
}) => {
  const todayStr = getTodayDateString();

  // Calendar View State: Year & Month
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Appointment>>({
    clienteNombre: '',
    representante: '',
    recomendadoPor: '',
    direccionEmpresa: '',
    telefonos: '',
    whatsapp: '',
    correoElectronico: '',
    fechaCita: todayStr,
    horaCita: '10:00',
    duracionMinutos: 90,
    tipoServicio: 'Dictamen Pericial NOM-001-SEDE-2012',
    motivoNotas: '',
    peritoAsignado: 'Ing. Israel Orozco Arias',
    folioDictamenRelacionado: '',
    estado: 'Programada',
    recordatorioMinutos: 30,
  });

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Month navigation
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayStr(todayStr);
  };

  // Calendar Days calculation (Monday-first)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Day of week: 0=Sun, 1=Mon, ..., 6=Sat. Convert to Mon=0 ... Sun=6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Next month padding to fill grid (up to multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Appointments mapped by Date string for calendar badges
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const app of appointments) {
      const list = map.get(app.fechaCita) || [];
      list.push(app);
      map.set(app.fechaCita, list);
    }
    return map;
  }, [appointments]);

  // Filtered appointments list for bottom list
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      // Date filter from calendar selection
      if (selectedDayStr && app.fechaCita !== selectedDayStr) {
        return false;
      }

      // Status filter
      if (filterStatus === 'hoy') {
        if (app.fechaCita !== todayStr) return false;
      } else if (filterStatus === 'proximas') {
        if (app.fechaCita < todayStr || app.estado === 'Realizada' || app.estado === 'Cancelada') return false;
      } else if (filterStatus !== 'all' && app.estado.toLowerCase() !== filterStatus.toLowerCase()) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match = 
          app.clienteNombre.toLowerCase().includes(q) ||
          app.representante.toLowerCase().includes(q) ||
          (app.recomendadoPor && app.recomendadoPor.toLowerCase().includes(q)) ||
          app.direccionEmpresa.toLowerCase().includes(q) ||
          app.telefonos.toLowerCase().includes(q) ||
          app.tipoServicio.toLowerCase().includes(q) ||
          (app.folioDictamenRelacionado && app.folioDictamenRelacionado.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [appointments, selectedDayStr, filterStatus, searchTerm, todayStr]);

  // Metrics
  const stats = useMemo(() => {
    const total = appointments.length;
    const hoy = appointments.filter(a => a.fechaCita === todayStr).length;
    const proximas = appointments.filter(a => a.fechaCita >= todayStr && a.estado !== 'Realizada' && a.estado !== 'Cancelada').length;
    const confirmadas = appointments.filter(a => a.estado === 'Confirmada').length;
    return { total, hoy, proximas, confirmadas };
  }, [appointments, todayStr]);

  // Open modal for new appointment
  const handleOpenNewModal = (defaultDate?: string) => {
    setEditingAppointment(null);
    setFormData({
      clienteNombre: '',
      representante: '',
      recomendadoPor: '',
      direccionEmpresa: '',
      telefonos: '',
      whatsapp: '',
      correoElectronico: '',
      fechaCita: defaultDate || selectedDayStr || todayStr,
      horaCita: '10:00',
      duracionMinutos: 90,
      tipoServicio: 'Dictamen Pericial NOM-001-SEDE-2012',
      motivoNotas: '',
      peritoAsignado: 'Ing. Israel Orozco Arias',
      folioDictamenRelacionado: '',
      estado: 'Programada',
      recordatorioMinutos: 30,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (app: Appointment) => {
    setEditingAppointment(app);
    setFormData({ ...app });
    setIsModalOpen(true);
  };

  // Save handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteNombre?.trim() || !formData.fechaCita || !formData.horaCita) {
      alert('Por favor complete los campos obligatorios: Nombre del cliente, Fecha y Hora de la cita.');
      return;
    }

    const toSave: Appointment = {
      id: editingAppointment?.id || `cita-${Date.now()}`,
      clienteNombre: formData.clienteNombre.trim(),
      representante: formData.representante?.trim() || '',
      recomendadoPor: formData.recomendadoPor?.trim() || '',
      direccionEmpresa: formData.direccionEmpresa?.trim() || '',
      telefonos: formData.telefonos?.trim() || '',
      whatsapp: formData.whatsapp?.trim() || '',
      correoElectronico: formData.correoElectronico?.trim() || '',
      fechaCita: formData.fechaCita,
      horaCita: formData.horaCita,
      duracionMinutos: Number(formData.duracionMinutos) || 60,
      tipoServicio: formData.tipoServicio || 'Dictamen Pericial NOM-001-SEDE-2012',
      motivoNotas: formData.motivoNotas?.trim() || '',
      peritoAsignado: formData.peritoAsignado?.trim() || 'Ing. Israel Orozco Arias',
      folioDictamenRelacionado: formData.folioDictamenRelacionado?.trim() || '',
      estado: (formData.estado as AppointmentStatus) || 'Programada',
      recordatorioMinutos: Number(formData.recordatorioMinutos) || 30,
      createdAt: editingAppointment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveAppointment(toSave);
    setIsModalOpen(false);
    showNotification(
      editingAppointment ? 'Cita técnica actualizada correctamente.' : 'Cita agendada con éxito.'
    );
  };

  // Pre-fill from existing report
  const handleSelectExistingReport = (folio: string) => {
    const rep = reports.find(r => r.folio === folio);
    if (!rep) return;
    setFormData(prev => ({
      ...prev,
      clienteNombre: rep.titularNombreComercial || rep.titularRazonSocial || '',
      representante: rep.solicitanteNombre || '',
      direccionEmpresa: `${rep.titularCalleNumero}, Col. ${rep.titularColonia}, ${rep.titularCiudadEstado}`,
      telefonos: rep.titularTelefono || rep.solicitanteTelefono || '',
      whatsapp: rep.solicitanteTelefono || rep.titularTelefono || '',
      correoElectronico: rep.peritoEmail || '',
      folioDictamenRelacionado: rep.folio,
      tipoServicio: rep.tipoServicio === 'Revisión periódica' 
        ? 'Revisión Periódica de Seguridad Eléctrica' 
        : 'Dictamen Pericial NOM-001-SEDE-2012'
    }));
  };

  // Download .ics file
  const handleDownloadIcs = (app: Appointment) => {
    const icsContent = generateIcsCalendar(app);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cita-${app.clienteNombre.replace(/\s+/g, '_')}-${app.fechaCita}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Archivo .ics generado con alerta y recordatorio.');
  };

  // Share via mobile API if available
  const handleShareMobileCalendar = async (app: Appointment) => {
    const icsContent = generateIcsCalendar(app);
    const fileName = `cita-cfp-${app.fechaCita}.ics`;
    const file = new File([icsContent], fileName, { type: 'text/calendar' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Cita Pericial CFP: ${app.clienteNombre}`,
          text: `Cita técnica pericial el ${app.fechaCita} a las ${app.horaCita} hrs.`,
          files: [file],
        });
        showNotification('Cita enviada al calendario del dispositivo.');
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleDownloadIcs(app);
        }
        return;
      }
    }
    handleDownloadIcs(app);
  };

  // Quick status change
  const handleQuickStatusChange = (app: Appointment, newStatus: AppointmentStatus) => {
    const updated: Appointment = {
      ...app,
      estado: newStatus,
      updatedAt: new Date().toISOString()
    };
    onSaveAppointment(updated);
    showNotification(`Estado de la cita cambiado a: ${newStatus}`);
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                Agenda de Citas & Calendario Técnico
              </h2>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                NOM-001
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Organización de visitas periciales en campo, recordatorios por WhatsApp y sincronización con Google Calendar / Móvil.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleOpenNewModal()}
            className="w-full md:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agendar Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Citas de Hoy</p>
            <p className="text-lg font-black text-slate-900">{stats.hoy}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Próximas Citas</p>
            <p className="text-lg font-black text-slate-900">{stats.proximas}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Confirmadas</p>
            <p className="text-lg font-black text-slate-900">{stats.confirmadas}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total en Agenda</p>
            <p className="text-lg font-black text-slate-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notificationMsg && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg transition-all animate-fade-in ${
          notificationMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-blue-50 text-blue-900 border-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notificationMsg.text}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. SECCIÓN PRINCIPAL: CALENDARIO INTERACTIVO                    */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        
        {/* Calendar Month Navigation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight capitalize">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            {selectedDayStr && (
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                Filtro: {selectedDayStr}
                <button 
                  onClick={() => setSelectedDayStr(null)}
                  className="hover:text-amber-950 font-bold ml-0.5"
                  title="Quitar filtro de día"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handleGoToday}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Hoy
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-4 text-center">
          {DAY_NAMES.map(name => (
            <div key={name} className="py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid of Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-1">
          {calendarDays.map((day, idx) => {
            const isToday = day.dateStr === todayStr;
            const isSelected = day.dateStr === selectedDayStr;
            const dayAppointments = appointmentsByDate.get(day.dateStr) || [];
            const hasAppointments = dayAppointments.length > 0;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (isSelected) {
                    setSelectedDayStr(null);
                  } else {
                    setSelectedDayStr(day.dateStr);
                  }
                }}
                className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  !day.isCurrentMonth
                    ? 'bg-slate-50/50 border-slate-100 text-slate-300'
                    : isSelected
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                    : isToday
                    ? 'bg-blue-50/50 border-blue-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Day Number and Badges */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                      isToday
                        ? 'bg-blue-600 text-white font-black shadow-sm'
                        : isSelected
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : day.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.dayNum}
                  </span>

                  {hasAppointments && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-400">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                {/* Day Appointment Mini-Chips */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayAppointments.slice(0, 2).map(app => {
                    const statusColor = 
                      app.estado === 'Confirmada' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      app.estado === 'Realizada' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      app.estado === 'Cancelada' ? 'bg-slate-100 text-slate-500 border-slate-200 line-through' :
                      'bg-amber-100 text-amber-900 border-amber-300';

                    return (
                      <div
                        key={app.id}
                        title={`${app.horaCita} - ${app.clienteNombre} (${app.tipoServicio})`}
                        className={`text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded border truncate ${statusColor}`}
                      >
                        <span className="font-bold">{app.horaCita}</span> {app.clienteNombre}
                      </div>
                    );
                  })}
                  {dayAppointments.length > 2 && (
                    <p className="text-[9px] text-slate-500 font-bold pl-1">
                      +{dayAppointments.length - 2} más...
                    </p>
                  )}
                </div>

                {/* Quick Add Button on Hover / Tap */}
                <div className="pt-1 flex justify-end opacity-40 hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNewModal(day.dateStr);
                    }}
                    title={`Agendar cita el ${day.dateStr}`}
                    className="p-1 rounded bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-500 transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Programada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Confirmada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Realizada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Cancelada
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Haz clic en cualquier día para filtrar las citas de esa fecha.
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SECCIÓN INFERIOR: LISTADO DE CITAS AGENDADAS                */}
      {/* ============================================================== */}
      <div className="space-y-4">
        
        {/* Subheader and Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Listado de Citas Agendadas
              {selectedDayStr ? ` (${selectedDayStr})` : ''}
            </h3>
            <p className="text-xs text-slate-500">
              Mostrando {filteredAppointments.length} de {appointments.length} citas registradas.
            </p>
          </div>

          {/* Search box & filter buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente, representante, dirección..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Status Pill Filters */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setFilterStatus('all'); setSelectedDayStr(null); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'all' && !selectedDayStr
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterStatus('hoy')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'hoy'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setFilterStatus('proximas')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'proximas'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Próximas
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredAppointments.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No hay citas para mostrar</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No se encontraron citas que coincidan con los filtros seleccionados. Puedes agendar una nueva cita o limpiar los filtros.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              {selectedDayStr && (
                <button
                  onClick={() => setSelectedDayStr(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Ver todas las fechas
                </button>
              )}
              <button
                onClick={() => handleOpenNewModal()}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Agendar cita
              </button>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map(app => {
            const googleCalUrl = buildGoogleCalendarUrl(app);
            const waUrl = buildWhatsAppReminderUrl(app);

            return (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Date, Time & Status */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex flex-col items-center justify-center flex-shrink-0 font-mono">
                      <span className="text-[10px] uppercase font-bold leading-none">
                        {app.fechaCita.split('-')[1]}
                      </span>
                      <span className="text-sm font-black leading-none">
                        {app.fechaCita.split('-')[2]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {app.fechaCita}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {app.horaCita} hrs ({app.duracionMinutos} min)
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 truncate max-w-[220px]">
                        {app.tipoServicio}
                      </p>
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <select
                    value={app.estado}
                    onChange={(e) => handleQuickStatusChange(app, e.target.value as AppointmentStatus)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                      app.estado === 'Confirmada' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      app.estado === 'Realizada' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                      app.estado === 'Cancelada' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                      'bg-amber-50 text-amber-900 border-amber-300'
                    }`}
                  >
                    <option value="Programada">Programada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="En curso">En curso</option>
                    <option value="Realizada">Realizada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Card Middle: Client info and details */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Cliente:</span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {app.clienteNombre}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    {app.representante && (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">Rep: <strong className="text-slate-900">{app.representante}</strong></span>
                      </div>
                    )}
                    {app.recomendadoPor && (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="truncate">Recomendó: <strong className="text-slate-900">{app.recomendadoPor}</strong></span>
                      </div>
                    )}
                  </div>

                  {app.direccionEmpresa && (
                    <div className="flex items-start gap-1.5 text-slate-600 text-[11px] pt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{app.direccionEmpresa}</span>
                    </div>
                  )}

                  {/* Contact Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    {app.telefonos && (
                      <a
                        href={`tel:${app.telefonos.split('/')[0].trim()}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
                      >
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{app.telefonos}</span>
                      </a>
                    )}
                    {app.whatsapp && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-[11px] font-bold transition"
                        title="Enviar confirmación y recordatorio por WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {app.correoElectronico && (
                      <a
                        href={`mailto:${app.correoElectronico}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
                      >
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[140px]">{app.correoElectronico}</span>
                      </a>
                    )}
                  </div>

                  {/* Notes / Dictamen folio */}
                  {(app.motivoNotas || app.folioDictamenRelacionado) && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 mt-2 space-y-1">
                      {app.folioDictamenRelacionado && (
                        <div className="flex items-center gap-1 font-bold text-amber-700">
                          <FileText className="w-3 h-3" />
                          <span>Dictamen Relacionado: #{app.folioDictamenRelacionado}</span>
                        </div>
                      )}
                      {app.motivoNotas && <p className="italic">"{app.motivoNotas}"</p>}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Sync Options & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  {/* Calendar Sync Actions */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition"
                      title="Abrir y guardar en Google Calendar"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Google Cal</span>
                    </a>

                    <button
                      onClick={() => handleShareMobileCalendar(app)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      title="Sincronizar con calendario de dispositivo móvil / Descargar .ics con alarma"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Móvil (.ics)</span>
                    </button>
                  </div>

                  {/* Edit & Delete Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(app)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Editar cita"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la cita de "${app.clienteNombre}"?`)) {
                          onDeleteAppointment(app.id);
                          showNotification('Cita eliminada de la agenda.');
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Eliminar cita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL: FORMULARIO DE AGENDAR / EDITAR CITA                  */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-scale-in">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAppointment ? 'Editar Cita Pericial' : 'Agendar Nueva Cita Técnica'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Completa la información del cliente y la programación técnica
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Auto-Fill from Existing Dictamen / Solicitud */}
            {reports.length > 0 && !editingAppointment && (
              <div className="p-3 bg-amber-50/60 border-b border-amber-200/60 px-6 flex items-center gap-2 text-xs text-amber-900">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="font-semibold">Autocompletar datos desde dictamen existente:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) handleSelectExistingReport(e.target.value);
                  }}
                  className="bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-950 px-2 py-1 focus:outline-none"
                >
                  <option value="">Seleccionar expediente...</option>
                  {reports.map(r => (
                    <option key={r.id} value={r.folio}>
                      Folio #{r.folio} - {r.titularNombreComercial || r.titularRazonSocial}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Row 1: Nombre del Cliente & Representante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre del Cliente / Empresa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clienteNombre || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, clienteNombre: e.target.value }))}
                    placeholder="Ej: ABARROTES AZTECA S.A DE C.V"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Representante Legal / Técnico
                  </label>
                  <input
                    type="text"
                    value={formData.representante || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, representante: e.target.value }))}
                    placeholder="Ej: Lic. Víctor Daniel Ríos Ramírez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Nombre de quien lo recomienda & Perito asignado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre de quien lo recomienda
                  </label>
                  <input
                    type="text"
                    value={formData.recomendadoPor || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, recomendadoPor: e.target.value }))}
                    placeholder="Ej: Ing. Héctor Sánchez (CFE Distribución)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Perito Responsable Asignado
                  </label>
                  <input
                    type="text"
                    value={formData.peritoAsignado || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, peritoAsignado: e.target.value }))}
                    placeholder="Ing. Israel Orozco Arias"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Dirección de la empresa */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dirección de la Empresa / Instalación
                </label>
                <input
                  type="text"
                  value={formData.direccionEmpresa || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccionEmpresa: e.target.value }))}
                  placeholder="Calle, número, colonia, municipio y estado"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Row 4: Contacto: Teléfonos, WhatsApp & Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Teléfonos (Fijo / Cel)
                  </label>
                  <input
                    type="text"
                    value={formData.telefonos || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefonos: e.target.value }))}
                    placeholder="4433234075 / 4438573253"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp (con Lada)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="4438573253"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.correoElectronico || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, correoElectronico: e.target.value }))}
                    placeholder="contacto@empresa.mx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 5: Fecha, Hora y Duración */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Fecha de la Cita <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fechaCita || todayStr}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaCita: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hora de Inicio <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.horaCita || '10:00'}
                    onChange={(e) => setFormData(prev => ({ ...prev, horaCita: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Duración Estimada
                  </label>
                  <select
                    value={formData.duracionMinutos || 60}
                    onChange={(e) => setFormData(prev => ({ ...prev, duracionMinutos: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>1 hora (60 min)</option>
                    <option value={90}>1 hora y media (90 min)</option>
                    <option value={120}>2 horas (120 min)</option>
                    <option value={180}>3 horas (180 min)</option>
                    <option value={240}>4 horas (Medio día)</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Tipo de Servicio & Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tipo de Servicio / Objeto de la Cita
                  </label>
                  <select
                    value={formData.tipoServicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoServicio: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    {SERVICE_TYPES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estado de la Cita
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as AppointmentStatus }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Programada">Programada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="En curso">En curso</option>
                    <option value="Realizada">Realizada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Folio Dictamen Relacionado & Recordatorio Móvil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Folio o Expediente Relacionado (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.folioDictamenRelacionado || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, folioDictamenRelacionado: e.target.value }))}
                    placeholder="Ej: 359 o CFP0125..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recordatorio en Calendario (.ics)</span>
                  </label>
                  <select
                    value={formData.recordatorioMinutos || 30}
                    onChange={(e) => setFormData(prev => ({ ...prev, recordatorioMinutos: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value={15}>15 minutos antes</option>
                    <option value={30}>30 minutos antes (Recomendado)</option>
                    <option value={60}>1 hora antes</option>
                    <option value={120}>2 horas antes</option>
                    <option value={1440}>1 día antes (24 horas)</option>
                  </select>
                </div>
              </div>

              {/* Row 8: Notas / Observaciones */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notas Adicionales / Alcance de la Visita
                </label>
                <textarea
                  rows={2}
                  value={formData.motivoNotas || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivoNotas: e.target.value }))}
                  placeholder="Detalles sobre equipo a inspeccionar, personas de contacto en caseta, equipo de seguridad requerido..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingAppointment ? 'Guardar Cambios' : 'Agendar Cita'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
