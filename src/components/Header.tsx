import React from 'react';
import {
  Building2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { UserRole } from '../types';
import { GNM_LOGO } from '../assets/logo';

interface HeaderProps {
  onOpenSos: () => void;
  onResetData: () => void;
  onOpenPaymentSettings: () => void;
  userRole: UserRole;
  onToggleRole: () => void;
  namaKetua?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSos,
  onResetData,
  onOpenPaymentSettings,
  userRole,
  onToggleRole,
  namaKetua,
}) => {
  const currentDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const isAdmin = userRole === 'admin';

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            <div className="relative group shrink-0">
              <img
                src={GNM_LOGO}
                alt="Logo Perumahan GNM"
                referrerPolicy="no-referrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover bg-white p-0.5 shadow-md shadow-emerald-900/40 ring-2 ring-emerald-400/40"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-[9px] font-black tracking-widest text-white px-1 rounded-sm border border-slate-900 leading-tight">
                GNM
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-xl font-extrabold tracking-wide text-white leading-tight">
                  PERUMAHAN GNM
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Graha Nuansa Mundu
                </span>
              </div>
              <span className="text-xs text-slate-400 block leading-tight">
                Graha Nuansa Mundu • Kec. Mundu, Cirebon • {currentDate}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Payment Settings Button */}
            <button
              onClick={onOpenPaymentSettings}
              title="Pengaturan ID QRIS & Rekening Bank (Admin)"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer flex items-center space-x-1"
            >
              <Settings className="w-5 h-5 text-emerald-400 hover:rotate-45 transition-transform duration-300" />
            </button>

            {/* Reset data helper */}
            <button
              onClick={onResetData}
              title="Reset ke Data Bawaan Graha Nuansa Mundu"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition text-xs flex items-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* SOS Emergency Simulator Button */}
            <button
              onClick={onOpenSos}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-red-600/40 ring-2 ring-red-400/50 animate-pulse transition duration-200 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">TOMBOL</span>
              <span>SOS</span>
            </button>

            <div className="h-7 w-px bg-slate-800 mx-1 hidden sm:block"></div>

            {/* Profile & Role Chip with Switcher (Tanpa Foto Profil) */}
            <div
              onClick={onToggleRole}
              title={isAdmin ? 'Klik untuk beralih ke Mode Warga' : 'Klik untuk masuk ke Mode Admin (Perlu PIN)'}
              className="flex items-center space-x-2.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 cursor-pointer transition select-none group"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border transition ${
                  isAdmin
                    ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-400'
                    : 'bg-blue-600/30 border-blue-500/50 text-blue-400'
                }`}
              >
                {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>{isAdmin ? `Bpk. ${namaKetua || 'Bambang Setiawan'}` : 'Warga Graha Nuansa'}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                      isAdmin
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Warga'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium group-hover:text-emerald-300 transition">
                  {isAdmin ? 'Ketua Paguyuban • Klik ganti peran' : 'Akses Warga • Klik masuk Admin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
