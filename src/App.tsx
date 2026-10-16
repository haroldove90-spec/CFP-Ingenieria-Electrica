import React, { useState, useEffect } from 'react';
import { UserRole, RevisionReport } from './types';
import { 
  getActiveRole, 
  setActiveRole as persistActiveRole, 
  getRevisionReports, 
  saveRevisionReport, 
  deleteRevisionReport 
} from './utils/storage';
import { usePWAInstall } from './hooks/usePWAInstall';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { DashboardOverview } from './components/DashboardOverview';
import { RevisionModule } from './components/RevisionModule';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();

  // Reload reports when storage changes
  const refreshReports = () => {
    setReports(getRevisionReports());
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

  const handleSaveReport = (report: RevisionReport) => {
    const updated = saveRevisionReport(report);
    setReports(updated);
  };

  const handleDeleteReport = (id: string) => {
    const updated = deleteRevisionReport(id);
    setReports(updated);
  };

  // If no role is selected, show exclusively the RoleSelector
  // (2 cols mobile / 4 cols desktop, no header, no descriptions, only logo and role name)
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
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              reports={reports}
              activeRole={activeRole}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenDataModal={() => setIsDataModalOpen(true)}
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
              onDataChanged={refreshReports}
            />
          )}
        </main>
      </div>

      {/* Tactile Mobile & Tablet Bottom Navigation Bar */}
      <BottomBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        reportsCount={reports.length}
      />

      {/* PWA Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        onNativeInstall={triggerInstall}
        isIOS={isIOS}
      />

      {/* Data Management & Supabase Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onDataChanged={refreshReports}
      />

    </div>
  );
}
