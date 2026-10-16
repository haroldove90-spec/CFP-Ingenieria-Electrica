import React from 'react';
import { Download, LogOut, Menu, X } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeRole?: UserRole;
  onLogout: () => void;
  onOpenInstallModal: () => void;
  onOpenDataModal?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  isInstallable?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLogout,
  onOpenInstallModal,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Sidebar toggle (Desktop/Tablet) + Official Logo & System Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title={isSidebarOpen ? "Contraer menú lateral" : "Expandir menú lateral"}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-slate-800 rounded-lg p-1 border border-slate-700/60 shadow-sm flex items-center justify-center">
                <img
                  src="/logo-cfp.svg"
                  alt="CFP Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight">
                  Ingeniería Eléctrica CFP
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions (Install, Logout) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botón de Instalación Rápida PWA */}
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 shadow-sm rounded-xl transition cursor-pointer"
              title="Instalar aplicación en Android, iOS o PC"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">Instalar</span>
            </button>

            {/* Botón de Cierre de Sesión */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition cursor-pointer"
              title="Cerrar sesión y cambiar de rol"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
