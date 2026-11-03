import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  RevisionReport, 
  ServiceRequest, 
  OperatingConditionsReport, 
  SafetyEvaluationReport, 
  ElectricalMeasurementsReport,
  SingleLineDiagram,
  PeritoCedula,
  PeritoCertificado,
  Appointment,
  FullDictamenExpediente,
  WizardModuleStep
} from './types';
import { 
  getActiveRole, 
  setActiveRole as persistActiveRole, 
  getRevisionReports, 
  saveRevisionReport, 
  deleteRevisionReport,
  deleteRevisionReports,
  saveReportToSupabase,
  deleteReportsFromSupabase,
  getSupabaseSettings,
  SUPABASE_TABLES,
  syncRecordToSupabaseTable,
  deleteRecordsFromSupabaseTable,
  getServiceRequests,
  saveServiceRequest,
  deleteServiceRequest,
  getOperatingConditionsReports,
  saveOperatingConditionsReport,
  deleteOperatingConditionsReport,
  getSafetyEvaluations,
  saveSafetyEvaluation,
  deleteSafetyEvaluation,
  getElectricalMeasurements,
  saveElectricalMeasurement,
  deleteElectricalMeasurement,
  getSingleLineDiagrams,
  saveSingleLineDiagram,
  deleteSingleLineDiagram,
  getPeritoCedula,
  savePeritoCedula,
  getPeritoCertificado,
  savePeritoCertificado,
  getAppointments,
  saveAppointment,
  deleteAppointment,
  loadAllFromSupabase,
  getFullDictamenes,
  saveFullDictamen,
  deleteFullDictamen,
  createInitialDictamen
} from './utils/storage';
import { usePWAInstall } from './hooks/usePWAInstall';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { DashboardOverview } from './components/DashboardOverview';
import { AgendaModule } from './components/AgendaModule';
import { RevisionModule } from './components/RevisionModule';
import { ServiceRequestModule } from './components/ServiceRequestModule';
import { OperatingConditionsModule } from './components/OperatingConditionsModule';
import { SafetyEvaluationModule } from './components/SafetyEvaluationModule';
import { ElectricalMeasurementsModule } from './components/ElectricalMeasurementsModule';
import { SingleLineDiagramModule } from './components/SingleLineDiagramModule';
import { PeritoCedulaModule } from './components/PeritoCedulaModule';
import { PeritoCertificadoModule } from './components/PeritoCertificadoModule';
import { WizardStepBanner } from './components/WizardStepBanner';
import { HistorialDictamenesModule } from './components/HistorialDictamenesModule';
import { FullDictamenViewerModal } from './components/FullDictamenViewerModal';
import { BarcodeVerifier } from './components/BarcodeVerifier';
import { SupabaseConfigView } from './components/SupabaseConfigView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { DataManagementModal } from './components/DataManagementModal';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    const saved = getActiveRole();
    if (saved && saved !== 'Perito Dictaminador') {
      persistActiveRole('Perito Dictaminador');
      return 'Perito Dictaminador';
    }
    return (saved as UserRole) || null;
  });

  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  const [reports, setReports] = useState<RevisionReport[]>(() => getRevisionReports());
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => getServiceRequests());
  const [operatingConditions, setOperatingConditions] = useState<OperatingConditionsReport[]>(() => getOperatingConditionsReports());
  const [safetyEvaluations, setSafetyEvaluations] = useState<SafetyEvaluationReport[]>(() => getSafetyEvaluations());
  const [electricalMeasurements, setElectricalMeasurements] = useState<ElectricalMeasurementsReport[]>(() => getElectricalMeasurements());
  const [diagrams, setDiagrams] = useState<SingleLineDiagram[]>(() => getSingleLineDiagrams());
  const [cedula, setCedula] = useState<PeritoCedula>(() => getPeritoCedula());
  const [certificado, setCertificado] = useState<PeritoCertificado>(() => getPeritoCertificado());
  const [appointments, setAppointments] = useState<Appointment[]>(() => getAppointments());

  // Full 10-page Dictamenes Expedientes
  const [fullDictamenes, setFullDictamenes] = useState<FullDictamenExpediente[]>(() => getFullDictamenes());
  const [activeDictamen, setActiveDictamen] = useState<FullDictamenExpediente | null>(null);
  const [selectedDictamenForModal, setSelectedDictamenForModal] = useState<FullDictamenExpediente | null>(null);
  const [isFullViewerOpen, setIsFullViewerOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();

  // Sincronización automática con Supabase al iniciar la aplicación
  useEffect(() => {
    let isMounted = true;
    const initSync = async () => {
      try {
        const res = await loadAllFromSupabase();
        if (isMounted && res.success && res.data) {
          if (res.data.reports) setReports(res.data.reports);
          if (res.data.serviceRequests) setServiceRequests(res.data.serviceRequests);
          if (res.data.operatingConditions) setOperatingConditions(res.data.operatingConditions);
          if (res.data.safetyEvaluations) setSafetyEvaluations(res.data.safetyEvaluations);
          if (res.data.electricalMeasurements) setElectricalMeasurements(res.data.electricalMeasurements);
          if (res.data.diagrams) setDiagrams(res.data.diagrams);
          if (res.data.cedula) setCedula(res.data.cedula);
          if (res.data.certificado) setCertificado(res.data.certificado);
          if (res.data.appointments) setAppointments(res.data.appointments);
          if (res.data.dictamenes) setFullDictamenes(res.data.dictamenes);
          console.log('[Supabase Cloud Sync]', res.message);
        }
      } catch (err) {
        console.warn('[Supabase Init Sync Error]', err);
      }
    };
    initSync();
    return () => { isMounted = false; };
  }, []);

  // Reload data when storage changes
  const refreshAllData = async () => {
    setReports(getRevisionReports());
    setServiceRequests(getServiceRequests());
    setOperatingConditions(getOperatingConditionsReports());
    setSafetyEvaluations(getSafetyEvaluations());
    setElectricalMeasurements(getElectricalMeasurements());
    setDiagrams(getSingleLineDiagrams());
    setCedula(getPeritoCedula());
    setCertificado(getPeritoCertificado());
    setAppointments(getAppointments());
    setFullDictamenes(getFullDictamenes());

    // Cargar también cambios frescos desde Supabase
    try {
      const res = await loadAllFromSupabase();
      if (res.success && res.data) {
        if (res.data.reports) setReports(res.data.reports);
        if (res.data.serviceRequests) setServiceRequests(res.data.serviceRequests);
        if (res.data.operatingConditions) setOperatingConditions(res.data.operatingConditions);
        if (res.data.safetyEvaluations) setSafetyEvaluations(res.data.safetyEvaluations);
        if (res.data.electricalMeasurements) setElectricalMeasurements(res.data.electricalMeasurements);
        if (res.data.diagrams) setDiagrams(res.data.diagrams);
        if (res.data.cedula) setCedula(res.data.cedula);
        if (res.data.certificado) setCertificado(res.data.certificado);
        if (res.data.appointments) setAppointments(res.data.appointments);
        if (res.data.dictamenes) setFullDictamenes(res.data.dictamenes);
      }
    } catch (e) {
      console.warn('[Supabase Refresh Error]', e);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    persistActiveRole(role);
  };

  const handleLogout = () => {
    setActiveRole(null);
    persistActiveRole(null);
    setCurrentTab('dashboard');
  };

  // Revision Reports CRUD with automatic Supabase sync
  const handleSaveReport = (report: RevisionReport) => {
    const updated = saveRevisionReport(report);
    setReports(updated);

    // Auto-save new / updated reports to Supabase
    const settings = getSupabaseSettings();
    if (settings.url && settings.anonKey) {
      saveReportToSupabase(report, settings).then((res) => {
        if (res.success) {
          console.log(`[Supabase Sincronizado] Folio #${report.folio} persistido en la nube`);
        } else {
          console.warn(`[Supabase Sincronización Advertencia] ${res.message}`);
        }
      }).catch((err) => {
        console.error('[Supabase Error]', err);
      });
    }
  };

  const handleDeleteReport = (id: string) => {
    const updated = deleteRevisionReport(id);
    setReports(updated);
    deleteReportsFromSupabase([id]).catch(console.error);
  };

  const handleDeleteReports = (ids: string[]) => {
    const updated = deleteRevisionReports(ids);
    setReports(updated);
    deleteReportsFromSupabase(ids).catch(console.error);
  };

  // Service Requests CRUD
  const handleSaveServiceRequest = (req: ServiceRequest) => {
    const updated = saveServiceRequest(req);
    setServiceRequests(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.SOLICITUDES, req).catch(console.error);
  };

  const handleDeleteServiceRequest = (id: string) => {
    const updated = deleteServiceRequest(id);
    setServiceRequests(updated);
    deleteRecordsFromSupabaseTable(SUPABASE_TABLES.SOLICITUDES, [id]).catch(console.error);
  };

  // Operating Conditions CRUD
  const handleSaveOperatingConditions = (rep: OperatingConditionsReport) => {
    const updated = saveOperatingConditionsReport(rep);
    setOperatingConditions(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.CONDICIONES, rep).catch(console.error);
  };

  const handleDeleteOperatingConditions = (id: string) => {
    const updated = deleteOperatingConditionsReport(id);
    setOperatingConditions(updated);
    deleteRecordsFromSupabaseTable(SUPABASE_TABLES.CONDICIONES, [id]).catch(console.error);
  };

  // Safety Evaluations CRUD
  const handleSaveSafetyEvaluation = (rep: SafetyEvaluationReport) => {
    const updated = saveSafetyEvaluation(rep);
    setSafetyEvaluations(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.EVALUACIONES, rep).catch(console.error);
  };

  const handleDeleteSafetyEvaluation = (id: string) => {
    const updated = deleteSafetyEvaluation(id);
    setSafetyEvaluations(updated);
    deleteRecordsFromSupabaseTable(SUPABASE_TABLES.EVALUACIONES, [id]).catch(console.error);
  };

  // Electrical Measurements (Página 9) CRUD
  const handleSaveElectricalMeasurement = (rep: ElectricalMeasurementsReport) => {
    const updated = saveElectricalMeasurement(rep);
    setElectricalMeasurements(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.MEDICIONES, rep).catch(console.error);
  };

  const handleDeleteElectricalMeasurement = (id: string) => {
    const updated = deleteElectricalMeasurement(id);
    setElectricalMeasurements(updated);
    deleteRecordsFromSupabaseTable(SUPABASE_TABLES.MEDICIONES, [id]).catch(console.error);
  };

  // Diagrama Unifilar CRUD
  const handleSaveDiagram = (diag: SingleLineDiagram) => {
    const updated = saveSingleLineDiagram(diag);
    setDiagrams(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.DIAGRAMAS, diag).catch(console.error);
  };

  const handleDeleteDiagram = (id: string) => {
    const updated = deleteSingleLineDiagram(id);
    setDiagrams(updated);
    deleteRecordsFromSupabaseTable(SUPABASE_TABLES.DIAGRAMAS, [id]).catch(console.error);
  };

  // Cédula Profesional del Perito
  const handleSaveCedula = (newCedula: PeritoCedula) => {
    const updated = savePeritoCedula(newCedula);
    setCedula(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.CEDULA, newCedula).catch(console.error);
  };

  // Certificado como Perito Dictaminador CFP
  const handleSaveCertificado = (newCert: PeritoCertificado) => {
    const updated = savePeritoCertificado(newCert);
    setCertificado(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.CERTIFICADO, newCert).catch(console.error);
  };

  // Agenda de Citas del Perito / Admin
  const handleSaveAppointment = (appointment: Appointment) => {
    const updated = saveAppointment(appointment);
    setAppointments(updated);
    syncRecordToSupabaseTable(SUPABASE_TABLES.AGENDA, appointment).catch(console.error);
  };

  const handleDeleteAppointment = (id: string) => {
    const updated = deleteAppointment(id);
    setAppointments(updated);
    deleteRecordsFromSupabaseTable(SUPABASE_TABLES.AGENDA, [id]).catch(console.error);
  };

  // Full 10-Page Dictamen Expediente Management
  const handleStartNewDictamenExpediente = () => {
    const newDoc = createInitialDictamen();
    setActiveDictamen(newDoc);
    setCurrentTab('revisiones');
  };

  const handleEditDictamenExpediente = (dictamen: FullDictamenExpediente, targetStep: WizardModuleStep = 1) => {
    setActiveDictamen(dictamen);
    const tabMap: Record<WizardModuleStep, ActiveTab> = {
      1: 'revisiones',
      2: 'solicitud_servicios',
      3: 'evaluacion_seguridad',
      4: 'mediciones_electricas',
      5: 'diagrama_unifilar',
      6: 'cedula_perito',
      7: 'certificado_perito',
    };
    setCurrentTab(tabMap[targetStep] || 'revisiones');
  };

  const handleOpenFullViewer = (dictamen: FullDictamenExpediente) => {
    setSelectedDictamenForModal(dictamen);
    setIsFullViewerOpen(true);
  };

  const handleDeleteFullDictamen = (id: string) => {
    const updated = deleteFullDictamen(id);
    setFullDictamenes(updated);
    if (activeDictamen?.id === id) {
      setActiveDictamen(null);
    }
  };

  // Sequential Wizard Step Handlers
  const handleNextFromRevision = (report: RevisionReport) => {
    handleSaveReport(report);
    if (activeDictamen) {
      const updated: FullDictamenExpediente = {
        ...activeDictamen,
        folio: report.folio || activeDictamen.folio,
        titularNombreComercial: report.titularNombreComercial || activeDictamen.titularNombreComercial,
        titularRazonSocial: report.titularRazonSocial || activeDictamen.titularRazonSocial,
        titularRfc: report.titularRfc || activeDictamen.titularRfc,
        titularCalleNumero: report.titularCalleNumero || activeDictamen.titularCalleNumero,
        titularColonia: report.titularColonia || activeDictamen.titularColonia,
        peritoNombre: report.peritoNombre || activeDictamen.peritoNombre,
        peritoCedula: report.peritoCedula || activeDictamen.peritoCedula,
        module1_revision: report,
        revisionData: report,
        stepProgress: (Math.max(activeDictamen.stepProgress || 1, 2) as WizardModuleStep),
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(updated);
      setActiveDictamen(updated);
      setFullDictamenes(getFullDictamenes());
    }
    setCurrentTab('solicitud_servicios');
  };

  const handleNextFromServiceRequest = (req: ServiceRequest) => {
    handleSaveServiceRequest(req);
    if (activeDictamen) {
      const updated: FullDictamenExpediente = {
        ...activeDictamen,
        folio: req.folio || activeDictamen.folio,
        titularNombreComercial: req.nombreComercial || activeDictamen.titularNombreComercial,
        titularRazonSocial: req.nombreRazonSocial || activeDictamen.titularRazonSocial,
        titularRfc: req.rfc || activeDictamen.titularRfc,
        solicitanteNombre: req.solicitanteNombre || activeDictamen.solicitanteNombre,
        module2_solicitud: req,
        solicitudData: req,
        stepProgress: (Math.max(activeDictamen.stepProgress || 1, 3) as WizardModuleStep),
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(updated);
      setActiveDictamen(updated);
      setFullDictamenes(getFullDictamenes());
    }
    setCurrentTab('evaluacion_seguridad');
  };

  const handleNextFromSafetyEvaluation = (evalReport: SafetyEvaluationReport) => {
    handleSaveSafetyEvaluation(evalReport);
    if (activeDictamen) {
      const updated: FullDictamenExpediente = {
        ...activeDictamen,
        folio: evalReport.folio || activeDictamen.folio,
        titularNombreComercial: evalReport.nombreComercial || activeDictamen.titularNombreComercial,
        titularRazonSocial: evalReport.razonSocial || activeDictamen.titularRazonSocial,
        titularRfc: evalReport.rfc || activeDictamen.titularRfc,
        module3_evaluacion: evalReport,
        evaluacionData: evalReport,
        stepProgress: (Math.max(activeDictamen.stepProgress || 1, 4) as WizardModuleStep),
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(updated);
      setActiveDictamen(updated);
      setFullDictamenes(getFullDictamenes());
    }
    setCurrentTab('mediciones_electricas');
  };

  const handleNextFromMeasurements = (meas: ElectricalMeasurementsReport) => {
    handleSaveElectricalMeasurement(meas);
    if (activeDictamen) {
      const updated: FullDictamenExpediente = {
        ...activeDictamen,
        folio: meas.folio || activeDictamen.folio,
        titularNombreComercial: meas.nombreComercial || activeDictamen.titularNombreComercial,
        titularRazonSocial: meas.nombreRazonSocial || activeDictamen.titularRazonSocial,
        titularRfc: meas.rfc || activeDictamen.titularRfc,
        module4_mediciones: meas,
        medicionesData: meas,
        stepProgress: (Math.max(activeDictamen.stepProgress || 1, 5) as WizardModuleStep),
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(updated);
      setActiveDictamen(updated);
      setFullDictamenes(getFullDictamenes());
    }
    setCurrentTab('diagrama_unifilar');
  };

  const handleNextFromDiagram = (diag: SingleLineDiagram) => {
    handleSaveDiagram(diag);
    if (activeDictamen) {
      const updated: FullDictamenExpediente = {
        ...activeDictamen,
        folio: diag.folio || activeDictamen.folio,
        titularNombreComercial: diag.titularNombreComercial || activeDictamen.titularNombreComercial,
        titularRazonSocial: diag.titularRazonSocial || activeDictamen.titularRazonSocial,
        titularRfc: diag.titularRfc || activeDictamen.titularRfc,
        module5_diagrama: diag,
        diagramaData: diag,
        stepProgress: (Math.max(activeDictamen.stepProgress || 1, 6) as WizardModuleStep),
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(updated);
      setActiveDictamen(updated);
      setFullDictamenes(getFullDictamenes());
    }
    setCurrentTab('cedula_perito');
  };

  const handleNextFromCedula = (ced: PeritoCedula) => {
    handleSaveCedula(ced);
    if (activeDictamen) {
      const updated: FullDictamenExpediente = {
        ...activeDictamen,
        peritoNombre: ced.peritoNombre || activeDictamen.peritoNombre,
        peritoCedula: ced.numeroCedula || activeDictamen.peritoCedula,
        module6_cedula: ced,
        cedulaData: ced,
        stepProgress: (Math.max(activeDictamen.stepProgress || 1, 7) as WizardModuleStep),
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(updated);
      setActiveDictamen(updated);
      setFullDictamenes(getFullDictamenes());
    }
    setCurrentTab('certificado_perito');
  };

  const handleCompleteDictamenFromCert = (cert: PeritoCertificado) => {
    handleSaveCertificado(cert);
    if (activeDictamen) {
      const completed: FullDictamenExpediente = {
        ...activeDictamen,
        module7_certificado: cert,
        certificadoData: cert,
        peritoNombre: cert.peritoNombre || activeDictamen.peritoNombre,
        stepProgress: 7 as WizardModuleStep,
        isCompleted: true,
        fechaActualizacion: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      saveFullDictamen(completed);
      setActiveDictamen(completed);
      const list = getFullDictamenes();
      setFullDictamenes(list);
      setSelectedDictamenForModal(completed);
      setIsFullViewerOpen(true);
    }
  };

  const isModuleTab = [
    'revisiones',
    'solicitud_servicios',
    'evaluacion_seguridad',
    'mediciones_electricas',
    'diagrama_unifilar',
    'cedula_perito',
    'certificado_perito'
  ].includes(currentTab);

  const getCurrentStepNumber = (): WizardModuleStep => {
    switch (currentTab) {
      case 'revisiones': return 1;
      case 'solicitud_servicios': return 2;
      case 'evaluacion_seguridad': return 3;
      case 'mediciones_electricas': return 4;
      case 'diagrama_unifilar': return 5;
      case 'cedula_perito': return 6;
      case 'certificado_perito': return 7;
      default: return 1;
    }
  };

  // If no role is selected, show exclusively the RoleSelector
  if (!activeRole) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col antialiased">
      
      {/* Unified Institutional Header */}
      <Header
        activeRole={activeRole}
        onLogout={handleLogout}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isInstallable={isInstallable}
      />

      {/* Main Layout Area: Sidebar (Desktop) + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeRole={activeRole}
          onLogout={handleLogout}
          reportsCount={reports.length}
          dictamenesCount={fullDictamenes.length}
          activeDictamen={activeDictamen}
          appointmentsCount={appointments.length}
          serviceRequestsCount={serviceRequests.length}
          operatingConditionsCount={operatingConditions.length}
          safetyEvaluationsCount={safetyEvaluations.length}
          electricalMeasurementsCount={electricalMeasurements.length}
          diagramsCount={diagrams.length}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Top Sequential Wizard Banner when an active dictamen session is present */}
          {isModuleTab && activeDictamen && (
            <WizardStepBanner
              dictamen={activeDictamen}
              currentStep={currentTab}
              onNavigateStep={(tab) => setCurrentTab(tab)}
              onOpenViewer={() => {
                setSelectedDictamenForModal(activeDictamen);
                setIsFullViewerOpen(true);
              }}
              onExitWizard={() => setActiveDictamen(null)}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardOverview
              reports={reports}
              activeRole={activeRole}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenDataModal={() => setIsDataModalOpen(true)}
              appointmentsCount={appointments.length}
              serviceRequestsCount={serviceRequests.length}
              operatingConditionsCount={operatingConditions.length}
              safetyEvaluationsCount={safetyEvaluations.length}
              electricalMeasurementsCount={electricalMeasurements.length}
              diagramsCount={diagrams.length}
            />
          )}

          {currentTab === 'historial_dictamenes' && (
            <HistorialDictamenesModule
              dictamenes={fullDictamenes}
              activeRole={activeRole}
              onStartNewDictamen={handleStartNewDictamenExpediente}
              onEditDictamen={(doc) => handleEditDictamenExpediente(doc, 1)}
              onDeleteDictamen={handleDeleteFullDictamen}
            />
          )}

          {currentTab === 'agenda' && (
            <AgendaModule
              appointments={appointments}
              reports={reports}
              activeRole={activeRole}
              onSaveAppointment={handleSaveAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {currentTab === 'nuevo_dictamen' && (
            <RevisionModule
              key="nuevo-dictamen-mode"
              reports={reports}
              activeRole={activeRole}
              initialMode="form"
              autoCreate={true}
              onSaveReport={(report) => {
                handleSaveReport(report);
                setCurrentTab('revisiones');
              }}
              onDeleteReport={handleDeleteReport}
              onDeleteReports={handleDeleteReports}
              onSaveAndContinueNext={handleNextFromRevision}
            />
          )}

          {currentTab === 'revisiones' && (
            <RevisionModule
              reports={reports}
              activeRole={activeRole}
              onSaveReport={handleSaveReport}
              onDeleteReport={handleDeleteReport}
              onDeleteReports={handleDeleteReports}
              onSaveAndContinueNext={handleNextFromRevision}
            />
          )}

          {currentTab === 'solicitud_servicios' && (
            <ServiceRequestModule
              requests={serviceRequests}
              activeRole={activeRole}
              onSaveRequest={handleSaveServiceRequest}
              onDeleteRequest={handleDeleteServiceRequest}
              onSaveAndContinueNext={handleNextFromServiceRequest}
            />
          )}

          {currentTab === 'condiciones_operativas' && (
            <OperatingConditionsModule
              reports={operatingConditions}
              activeRole={activeRole}
              onSaveReport={handleSaveOperatingConditions}
              onDeleteReport={handleDeleteOperatingConditions}
            />
          )}

          {currentTab === 'evaluacion_seguridad' && (
            <SafetyEvaluationModule
              reports={safetyEvaluations}
              activeRole={activeRole}
              onSaveReport={handleSaveSafetyEvaluation}
              onDeleteReport={handleDeleteSafetyEvaluation}
              onSaveAndContinueNext={handleNextFromSafetyEvaluation}
            />
          )}

          {currentTab === 'mediciones_electricas' && (
            <ElectricalMeasurementsModule
              reports={electricalMeasurements}
              activeRole={activeRole}
              onSaveReport={handleSaveElectricalMeasurement}
              onDeleteReport={handleDeleteElectricalMeasurement}
              onSaveAndContinueNext={handleNextFromMeasurements}
            />
          )}

          {currentTab === 'diagrama_unifilar' && (
            <SingleLineDiagramModule
              diagrams={diagrams}
              activeRole={activeRole}
              onSaveDiagram={handleSaveDiagram}
              onDeleteDiagram={handleDeleteDiagram}
              onSaveAndContinueNext={handleNextFromDiagram}
            />
          )}

          {currentTab === 'cedula_perito' && (
            <PeritoCedulaModule
              cedula={cedula}
              activeRole={activeRole}
              onSaveCedula={handleSaveCedula}
              onSaveAndContinueNext={handleNextFromCedula}
            />
          )}

          {currentTab === 'certificado_perito' && (
            <PeritoCertificadoModule
              certificado={certificado}
              activeRole={activeRole}
              onSaveCertificado={handleSaveCertificado}
              onCompleteDictamen={handleCompleteDictamenFromCert}
            />
          )}

          {currentTab === 'verificador' && (
            <BarcodeVerifier
              reports={reports}
              onSelectReport={(reportId) => {
                setCurrentTab('revisiones');
              }}
            />
          )}

          {currentTab === 'configuracion' && (
            <SupabaseConfigView
              reports={reports}
              onDataChanged={refreshAllData}
            />
          )}
        </main>
      </div>

      {/* Tactile Mobile & Tablet Bottom Navigation Bar */}
      <BottomBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        reportsCount={reports.length}
        dictamenesCount={fullDictamenes.length}
        activeDictamen={activeDictamen}
        appointmentsCount={appointments.length}
        serviceRequestsCount={serviceRequests.length}
        operatingConditionsCount={operatingConditions.length}
        safetyEvaluationsCount={safetyEvaluations.length}
        electricalMeasurementsCount={electricalMeasurements.length}
        diagramsCount={diagrams.length}
      />

      {/* PWA Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        onNativeInstall={triggerInstall}
        isIOS={isIOS}
      />

      {/* Data Management Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onDataChanged={refreshAllData}
      />

      {/* Full 10-Page Dictamen Modal Viewer & PDF Exporter */}
      {isFullViewerOpen && selectedDictamenForModal && (
        <FullDictamenViewerModal
          dictamen={selectedDictamenForModal}
          isOpen={isFullViewerOpen}
          onClose={() => setIsFullViewerOpen(false)}
          onEdit={(dictamen) => {
            setIsFullViewerOpen(false);
            handleEditDictamenExpediente(dictamen, 1);
          }}
        />
      )}

    </div>
  );
}
