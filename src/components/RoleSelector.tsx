import React from 'react';
import { UserRole } from '../types';
import { Lock } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

interface RoleCardItem {
  id: UserRole;
  title: string;
  active: boolean;
}

const ROLES: RoleCardItem[] = [
  {
    id: 'Perito Dictaminador',
    title: 'Perito Dictaminador',
    active: true, // Único rol activo por el momento
  },
  {
    id: 'Inspector Técnico',
    title: 'Inspector Técnico',
    active: false, // Desactivado por el momento
  },
  {
    id: 'Coordinador de Proyectos',
    title: 'Coordinador de Proyectos',
    active: false, // Desactivado por el momento
  },
  {
    id: 'Administrador General',
    title: 'Administrador General',
    active: false, // Desactivado por el momento
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Cuadrícula de 2 Columnas Móvil / 4 Columnas Escritorio sin headers ni descripciones */}
      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {ROLES.map((role) => {
          if (!role.active) {
            return (
              <div
                key={role.id}
                title="Rol desactivado temporalmente"
                className="relative flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-slate-800/40 border-2 border-slate-800 rounded-2xl opacity-50 cursor-not-allowed aspect-square sm:aspect-auto sm:min-h-[260px] select-none"
              >
                {/* Badge Desactivado */}
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Desactivado</span>
                </div>

                {/* Logo con filtro grayscale */}
                <div className="relative mb-4 sm:mb-6 w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center grayscale opacity-60">
                  <img
                    src="/logo-cfp.svg"
                    alt="Logo CFP"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Solo nombre del rol */}
                <span className="text-sm sm:text-base lg:text-lg font-bold text-slate-400 tracking-wide">
                  {role.title}
                </span>
              </div>
            );
          }

          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="group relative flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-slate-800/90 hover:bg-slate-800 border-2 border-amber-500 rounded-2xl shadow-xl shadow-amber-500/10 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-2xl hover:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 cursor-pointer aspect-square sm:aspect-auto sm:min-h-[260px]"
            >
              {/* Badge Activo */}
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Activo</span>
              </div>

              {/* Logo del sistema CFP */}
              <div className="relative mb-4 sm:mb-6 w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-lg group-hover:bg-amber-500/35 transition-all"></div>
                <img
                  src="/logo-cfp.svg"
                  alt="Logo Colegio Federal Peritos"
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Solo nombre del rol */}
              <span className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-amber-400 tracking-wide transition-colors">
                {role.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
