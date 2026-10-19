import React, { useState, useEffect } from 'react';
import { UserRole, RevisionReport, ServiceRequest, OperatingConditionsReport } from './types';
import { 
  getActiveRole, 
  setActiveRole as persistActiveRole, 
  getRevisionReports, 
  saveRevisionReport, 
  deleteRevisionReport,
  getServiceRequests,
  saveServiceRequest,
  deleteServiceRequest,
  getOperatingConditionsReports,
  saveOperatingConditionsReport,
  deleteOperatingConditionsReport
} from './utils/storage';
import { usePWAInstall } from './hooks/usePWAInstall';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { DashboardOverview } from './components/DashboardOverview';
import { RevisionModule } from './components/RevisionModule';
import { ServiceRequestModule } from './components/ServiceRequestModule';
import { OperatingConditionsModule } from './components/OperatingConditionsModule';
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();

  // Reload data when storage changes
  const refreshAllData = () => {
    setReports(getRevisionReports());
    setServiceRequests(getServiceRequests());
    setOperatingConditions(getOperatingConditionsReports());
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

  // Revision Reports CRUD
  const handleSaveReport = (report: RevisionReport) => {
    const updated = saveRevisionReport(report);
    setReports(updated);
  };

  const handleDeleteReport = (id: string) => {
    const updated = deleteRevisionReport(id);
    setReports(updated);
  };

  // Service Requests CRUD
  const handleSaveServiceRequest = (req: ServiceRequest) => {
    const updated = saveServiceRequest(req);
    setServiceRequests(updated);
  };

  const handleDeleteServiceRequest = (id: string) => {
    const updated = deleteServiceRequest(id);
    setServiceRequests(updated);
  };

  // Operating Conditions CRUD
  const handleSaveOperatingConditions = (rep: OperatingConditionsReport) => {
    const updated = saveOperatingConditionsReport(rep);
    setOperatingConditions(updated);
  };

  const handleDeleteOperatingConditions = (id: string) => {
    const updated = deleteOperatingConditionsReport(id);
    setOperatingConditions(updated);
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
          serviceRequestsCount={serviceRequests.length}
          operatingConditionsCount={operatingConditions.length}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              reports={reports}
              activeRole={activeRole}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenDataModal={() => setIsDataModalOpen(true)}
              serviceRequestsCount={serviceRequests.length}
              operatingConditionsCount={operatingConditions.length}
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
            />
          )}

          {currentTab === 'revisiones' && (
            <RevisionModule
              reports={reports}
              activeRole={activeRole}
              onSaveReport={handleSaveReport}
              onDeleteReport={handleDeleteReport}
            />
          )}

          {currentTab === 'solicitud_servicios' && (
            <ServiceRequestModule
              requests={serviceRequests}
              activeRole={activeRole}
              onSaveRequest={handleSaveServiceRequest}
              onDeleteRequest={handleDeleteServiceRequest}
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
        serviceRequestsCount={serviceRequests.length}
        operatingConditionsCount={operatingConditions.length}
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

    </div>
  );
}
