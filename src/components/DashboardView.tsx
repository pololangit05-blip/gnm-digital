import React from 'react';
import {
  Users,
  Home,
  Vault,
  Clock,
  UserPlus,
  ArrowDownRight,
  Scroll,
  Megaphone,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  AlertCircle,
  QrCode,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { Warga, KasItem, PengumumanItem } from '../types';
import { TabType } from './Navigation';

interface DashboardViewProps {
  warga: Warga[];
  kas: KasItem[];
  pengumuman: PengumumanItem[];
  onNavigate: (tab: TabType) => void;
  onOpenAddWarga: () => void;
  onOpenAddKas: () => void;
  onOpenAddPengumuman: () => void;
  onOpenQrPayment: (w?: Warga) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  warga,
  kas,
  pengumuman,
  onNavigate,
  onOpenAddWarga,
  onOpenAddKas,
  onOpenAddPengumuman,
  onOpenQrPayment,
}) => {
  // Statistics calculations
  const totalWarga = warga.length;
  const uniqueKK = new Set(warga.map((w) => w.kk)).size;

  const totalMasuk = kas
    .filter((k) => k.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalKeluar = kas
    .filter((k) => k.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const saldoKas = totalMasuk - totalKeluar;

  // Iuran stats for KKs
  const uniqueKKList = Array.from(new Set(warga.map((w) => w.kk)));
  const totalKKCount = uniqueKKList.length;
  const paidKKCount = uniqueKKList.filter((kkNum) => {
    const members = warga.filter((w) => w.kk === kkNum);
    return members.some((m) => m.iuranLunas);
  }).length;

  const iuranPercentage =
    totalKKCount > 0 ? Math.round((paidKKCount / totalKKCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Total Warga */}
        <div
          onClick={() => onNavigate('warga')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Warga
            </p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
              {totalWarga} <span className="text-sm font-normal text-slate-500">Jiwa</span>
            </h3>
            <span className="text-xs text-emerald-600 font-semibold inline-flex items-center mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Graha Nuansa Mundu
            </span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:scale-105 transition-transform">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Stat 2: Total KK */}
        <div
          onClick={() => onNavigate('warga')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kepala Keluarga (KK)
            </p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
              {uniqueKK} <span className="text-sm font-normal text-slate-500">Rumah</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium inline-flex items-center mt-1.5">
              <Home className="w-3.5 h-3.5 mr-1" /> Terdaftar di Blok A-C
            </span>
          </div>
          <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl group-hover:scale-105 transition-transform">
            <Home className="w-7 h-7" />
          </div>
        </div>

        {/* Stat 3: Saldo Kas */}
        <div
          onClick={() => onNavigate('kas')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saldo Kas
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
              Rp {saldoKas.toLocaleString('id-ID')}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold inline-flex items-center mt-1.5">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Update Real-time
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl group-hover:scale-105 transition-transform">
            <Vault className="w-7 h-7" />
          </div>
        </div>

        {/* Stat 4: Pengumuman & Agenda */}
        <div
          onClick={() => onNavigate('pengumuman')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pengumuman & Agenda
            </p>
            <h3 className="text-3xl font-extrabold text-purple-600 mt-1">
              {pengumuman.length}{' '}
              <span className="text-sm font-normal text-slate-500">Publikasi</span>
            </h3>
            <span className="text-xs text-purple-600 font-semibold inline-flex items-center mt-1.5">
              <Megaphone className="w-3.5 h-3.5 mr-1" /> Agenda Aktif Warga
            </span>
          </div>
          <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl group-hover:scale-105 transition-transform">
            <Megaphone className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Row 2: Pengumuman Terbaru & Quick Actions / Iuran Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pengumuman Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                <Megaphone className="w-5 h-5 text-emerald-600 mr-2" />
                Pengumuman & Agenda Graha Nuansa Mundu
              </h2>
              <button
                onClick={() => onNavigate('pengumuman')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center cursor-pointer transition"
              >
                Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {pengumuman.slice(0, 3).map((p) => {
                let badgeStyle = 'bg-slate-100 text-slate-700';
                if (p.kategori === 'Kegiatan / Agenda') badgeStyle = 'bg-blue-100 text-blue-700 border-blue-200';
                if (p.kategori === 'Penting / Urgen') badgeStyle = 'bg-red-100 text-red-700 border-red-200';
                if (p.kategori === 'Kerja Bakti') badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
                if (p.kategori === 'Keamanan') badgeStyle = 'bg-purple-100 text-purple-700 border-purple-200';

                return (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/70 rounded-xl transition duration-150"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}
                      >
                        {p.kategori}
                      </span>
                      <span className="text-xs text-slate-500 font-medium inline-flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                        {p.tanggal}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">{p.judul}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {p.isi}
                    </p>
                    {p.lokasi && (
                      <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                        📍 Lokasi: {p.lokasi}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Diterbitkan oleh Pengurus Graha Nuansa Mundu</span>
            <button
              onClick={onOpenAddPengumuman}
              className="text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              + Terbitkan Info Baru
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Monthly Iuran Widget with QRIS Button */}
        <div className="space-y-6">
          {/* Quick Action Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-800 mb-3.5 flex items-center justify-between">
              <span>Aksi Cepat</span>
              <span className="text-[11px] font-normal text-slate-400">Pintasan</span>
            </h2>

            {/* Prominent QRIS Payment Button */}
            <button
              onClick={() => onOpenQrPayment()}
              className="w-full mb-2.5 p-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white rounded-xl text-left shadow-md shadow-red-600/25 flex items-center justify-between group cursor-pointer hover:opacity-95 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-extrabold flex items-center space-x-1.5">
                    <span>Bayar Iuran via QRIS</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="text-[10px] text-red-100">Scan M-Banking / E-Wallet</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenAddWarga}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 rounded-xl text-left transition text-slate-700 hover:border-emerald-300 group cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">Tambah Warga</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Input warga baru</div>
              </button>

              <button
                onClick={onOpenAddKas}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 rounded-xl text-left transition text-slate-700 hover:border-emerald-300 group cursor-pointer"
              >
                <ArrowDownRight className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">Catat Transaksi</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kas masuk / keluar</div>
              </button>

              <button
                onClick={() => onNavigate('kas')}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 rounded-xl text-left transition text-slate-700 hover:border-emerald-300 group cursor-pointer"
              >
                <Wallet className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">Iuran & Kas</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pantau keuangan</div>
              </button>

              <button
                onClick={onOpenAddPengumuman}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 rounded-xl text-left transition text-slate-700 hover:border-emerald-300 group cursor-pointer"
              >
                <Scroll className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">Pengumuman</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Siarkan agenda</div>
              </button>
            </div>
          </div>

          {/* Monthly Collection Progress Widget */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl shadow-md p-5 border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Iuran Graha Nuansa Mundu</h3>
                <p className="text-[11px] text-slate-400">Kebersihan & Keamanan (Rp 50.000)</p>
              </div>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                Target: 80%
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {paidKKCount}{' '}
                <span className="text-sm font-normal text-slate-400">/ {totalKKCount} KK</span>
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {iuranPercentage}% Lunas
              </span>
            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
                style={{ width: `${Math.min(iuranPercentage, 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => onOpenQrPayment()}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Bayar QRIS</span>
              </button>
              <button
                onClick={() => onNavigate('kas')}
                className="bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Kelola Iuran</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
