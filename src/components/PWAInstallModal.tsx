import React, { useState } from 'react';
import { X, Smartphone, Monitor, Apple, Download, CheckCircle2, WifiOff } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onNativeInstall: () => Promise<boolean>;
  isIOS: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onNativeInstall,
  isIOS,
}) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'pc'>(
    isIOS ? 'ios' : 'android'
  );
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await onNativeInstall();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 p-1 flex items-center justify-center">
              <img src="/logo-cfp.svg" alt="CFP" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Instalar Ingeniería Eléctrica CFP</h3>
              <p className="text-xs text-amber-400 font-medium">Aplicación Web Progresiva Oficial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Direct Install Button if browser supports beforeinstallprompt */}
          {isInstallable && !installedSuccess && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-amber-300">Instalación con 1 Clic Detectada</p>
                <p className="text-xs text-slate-300">Tu navegador permite agregar la app directamente a tu dispositivo.</p>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Instalar Ahora
              </button>
            </div>
          )}

          {installedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">¡Aplicación instalada con éxito!</p>
                <p className="text-xs">Ya puedes acceder a ella directamente desde tu pantalla de inicio o escritorio.</p>
              </div>
            </div>
          )}

          {/* Platform Selector Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Instrucciones por Dispositivo:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
              <button
                onClick={() => setActivePlatform('android')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activePlatform === 'android'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Android
              </button>
              <button
                onClick={() => setActivePlatform('ios')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activePlatform === 'ios'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                iPhone / iPad
              </button>
              <button
                onClick={() => setActivePlatform('pc')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activePlatform === 'pc'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                PC / Mac
              </button>
            </div>
          </div>

          {/* Tab Content Instructions */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 text-xs sm:text-sm text-slate-300 space-y-2.5">
            {activePlatform === 'android' && (
              <>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span>Abre esta página en <strong>Google Chrome</strong> o <strong>Edge</strong> en tu teléfono.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span>Toca los tres puntos <strong>(⋮)</strong> en la esquina superior derecha del navegador.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                  <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</span>
                </div>
              </>
            )}

            {activePlatform === 'ios' && (
              <>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span>Abre esta página en el navegador <strong>Safari</strong> de tu iPhone o iPad.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span>Toca el botón <strong>Compartir</strong> (el ícono del cuadrado con la flecha hacia arriba).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                  <span>Desliza hacia abajo y presiona <strong>"Agregar a inicio" (Add to Home Screen)</strong>.</span>
                </div>
              </>
            )}

            {activePlatform === 'pc' && (
              <>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span>En Chrome o Edge, busca el ícono de <strong>Instalar</strong> en la barra de direcciones (al lado de la estrella de favoritos).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span>Haz clic en <strong>"Instalar Ingeniería Eléctrica CFP"</strong> para abrirlo en su propia ventana sin barras del navegador.</span>
                </div>
              </>
            )}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 bg-slate-800/40 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Acceso sin conexión</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-800/40 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Carga instantánea</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
