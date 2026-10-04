import React, { useState } from 'react';
import {
  CheckCircle,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Info,
  Download,
  Search,
  MessageSquare,
  ShieldCheck,
  Calendar,
  QrCode,
  Sparkles,
  Settings,
} from 'lucide-react';
import { KasItem, KasJenis, KasKategori, Warga, UserRole, PaymentSettings } from '../types';

interface KasViewProps {
  kas: KasItem[];
  warga: Warga[];
  onOpenAddKas: () => void;
  onDeleteKas: (id: number) => void;
  onToggleIuran: (wargaId: number) => void;
  onOpenQrPayment: (warga?: Warga) => void;
  onOpenPaymentSettings?: () => void;
  userRole?: UserRole;
  paymentSettings?: PaymentSettings;
}

export const KasView: React.FC<KasViewProps> = ({
  kas,
  warga,
  onOpenAddKas,
  onDeleteKas,
  onToggleIuran,
  onOpenQrPayment,
  onOpenPaymentSettings,
  userRole = 'admin',
  paymentSettings,
}) => {
  const [subTab, setSubTab] = useState<'jurnal' | 'iuran'>('jurnal');
  const [filterType, setFilterType] = useState<'ALL' | KasJenis>('ALL');
  const [filterKategori, setFilterKategori] = useState<'ALL' | KasKategori>('ALL');
  const [searchKas, setSearchKas] = useState('');
  const [selectedBulan, setSelectedBulan] = useState('Oktober 2026');

  // Calculations
  const totalMasuk = kas
    .filter((k) => k.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalKeluar = kas
    .filter((k) => k.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoKas = totalMasuk - totalKeluar;

  // Filtered Kas
  const filteredKas = kas.filter((k) => {
    const matchType = filterType === 'ALL' || k.jenis === filterType;
    const matchKategori = filterKategori === 'ALL' || k.kategori === filterKategori;
    const matchSearch =
      k.desc.toLowerCase().includes(searchKas.toLowerCase()) ||
      k.tanggal.includes(searchKas);
    return matchType && matchKategori && matchSearch;
  });

  // Export Kas to CSV
  const handleExportKasCSV = () => {
    const headers = ['ID,Tanggal,Keterangan,Kategori,Jenis,Nomor/Jumlah,PJ'];
    const rows = kas.map(
      (k) =>
        `"${k.id}","${k.tanggal}","${k.desc}","${k.kategori}","${k.jenis}","${k.amount}","${k.pj || '-'}"`
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Kas_GrahaNuansaMundu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Iuran stats
  const lunasCount = warga.filter((w) => w.iuranLunas).length;
  const belumCount = warga.length - lunasCount;
  const nominalStandar = paymentSettings?.nominalIuranPerBulan || 50000;
  const totalTerkumpul = lunasCount * nominalStandar;

  const handleBroadcastReminder = () => {
    const belumList = warga.filter((w) => !w.iuranLunas).map((w) => `${w.nama} (${w.alamat})`);
    const msg = `*PEMBERITAHUAN IURAN PERUMAHAN GRAHA NUANSA MUNDU*\n\n` +
      `Bulan: ${selectedBulan}\nNominal: Rp ${nominalStandar.toLocaleString('id-ID')} (Kebersihan Sampah & Keamanan Pos Satpam)\n\n` +
      `Kini warga dapat membayar iuran secara instan melalui *QRIS Resmi* menggunakan seluruh aplikasi M-Banking atau e-Wallet (BCA, Mandiri, BRI, GoPay, OVO, DANA).\n\n` +
      `Daftar KK belum lunas (${belumList.length} rumah):\n${belumList.map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\n` +
      `Terima kasih atas kepedulian dan kerja sama seluruh warga demi kenyamanan lingkungan perumahan kita.`;
    
    // Copy to clipboard and open WhatsApp
    navigator.clipboard.writeText(msg);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Subtab Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setSubTab('jurnal')}
            className={`px-4 py-2.5 font-bold text-sm rounded-xl transition cursor-pointer flex items-center space-x-2 ${
              subTab === 'jurnal'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Jurnal Kas</span>
          </button>
          <button
            onClick={() => setSubTab('iuran')}
            className={`px-4 py-2.5 font-bold text-sm rounded-xl transition cursor-pointer flex items-center space-x-2 ${
              subTab === 'iuran'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Status Iuran Warga</span>
            {belumCount > 0 && (
              <span className="text-[11px] bg-red-500 text-white px-2 py-0.2 rounded-full font-bold">
                {belumCount} Belum
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenPaymentSettings && (
            <button
              onClick={onOpenPaymentSettings}
              className="bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 border border-slate-200 shadow-xs transition cursor-pointer"
              title="Atur ID QRIS & Rekening Bank (Khusus Admin)"
            >
              <Settings className="w-4 h-4 text-emerald-600" />
              <span>Atur QR & Rekening</span>
              {userRole === 'admin' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
                  Admin
                </span>
              )}
            </button>
          )}

          {/* Global QRIS Button */}
          <button
            onClick={() => onOpenQrPayment()}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-red-600/25 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Buka QRIS Pembayaran Iuran</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* ================= SUBTAB 1: JURNAL KAS ================= */}
      {subTab === 'jurnal' && (
        <div className="space-y-5">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Pemasukan
                </p>
                <h4 className="text-2xl font-extrabold text-emerald-600 mt-1">
                  + Rp {totalMasuk.toLocaleString('id-ID')}
                </h4>
                <span className="text-xs text-slate-500 font-medium">Iuran QRIS & swadaya</span>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Pengeluaran
                </p>
                <h4 className="text-2xl font-extrabold text-red-600 mt-1">
                  - Rp {totalKeluar.toLocaleString('id-ID')}
                </h4>
                <span className="text-xs text-slate-500 font-medium">Operasional perumahan</span>
              </div>
              <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                  Saldo Kas Terkini
                </p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Rp {saldoKas.toLocaleString('id-ID')}
                </h4>
                <span className="text-xs text-emerald-100 font-medium">Kas Graha Nuansa Mundu</span>
              </div>
              <div className="bg-white/20 text-white p-3 rounded-xl backdrop-blur-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative min-w-[200px] flex-grow sm:flex-grow-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchKas}
                  onChange={(e) => setSearchKas(e.target.value)}
                  placeholder="Cari transaksi kas..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
              >
                <option value="ALL">Semua Jenis Transaksi</option>
                <option value="Pemasukan">Pemasukan (+)</option>
                <option value="Pengeluaran">Pengeluaran (-)</option>
              </select>

              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value as any)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Iuran Warga">Iuran Warga (QRIS & Tunai)</option>
                <option value="Keamanan">Keamanan / Pos Satpam</option>
                <option value="Kebersihan">Kebersihan / Sampah</option>
                <option value="Sosial">Sosial / Duka</option>
                <option value="Infrastruktur">Infrastruktur & Sarana</option>
                <option value="Lainnya">Lain-lain</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <button
                onClick={handleExportKasCSV}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={onOpenAddKas}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-sm shadow-emerald-600/25 transition cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Transaksi Kas</span>
              </button>
            </div>
          </div>

          {/* Table of Transactions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">Tanggal</th>
                    <th className="py-3.5 px-4">Keterangan / Uraian</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4 text-right">Nominal (Rp)</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                        Belum ada riwayat transaksi kas yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredKas.map((k) => {
                      const isMasuk = k.jenis === 'Pemasukan';
                      const amountClass = isMasuk
                        ? 'text-emerald-600 font-bold'
                        : 'text-red-600 font-bold';
                      const prefix = isMasuk ? '+' : '-';

                      return (
                        <tr key={k.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                            {k.tanggal}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                              <span>{k.desc}</span>
                              {k.desc.toLowerCase().includes('qris') && (
                                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold border border-red-200">
                                  QRIS
                                </span>
                              )}
                            </div>
                            {k.pj && (
                              <div className="text-[11px] text-slate-400">PJ: {k.pj}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                              {k.kategori}
                            </span>
                          </td>
                          <td className={`py-3.5 px-4 text-right font-mono text-sm ${amountClass}`}>
                            {prefix} Rp {k.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => onDeleteKas(k.id)}
                              title="Hapus Transaksi"
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: STATUS IURAN WARGA ================= */}
      {subTab === 'iuran' && (
        <div className="space-y-4">
          {/* Informational Banner with QRIS highlight */}
          <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-200/90 text-slate-800 p-4 rounded-2xl text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="bg-red-600 text-white p-2 rounded-xl shrink-0 mt-0.5 shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <strong className="font-bold text-slate-900">
                    Iuran Perumahan Graha Nuansa Mundu: Rp {nominalStandar.toLocaleString('id-ID')} / bulan
                  </strong>
                  <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.2 rounded-full">
                    QRIS AKTIF
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Warga dapat membayar langsung menggunakan kode QRIS dengan seluruh bank dan e-wallet. Bukti dan kuitansi digital diterbitkan otomatis!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onOpenQrPayment()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Bayar via QRIS</span>
              </button>
              <button
                onClick={handleBroadcastReminder}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Broadcast Tagihan WA</span>
              </button>
            </div>
          </div>

          {/* Month selector & summary counts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Periode Bulan:</span>
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="font-bold text-sm text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <option value="Oktober 2026">Oktober 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="Agustus 2026">Agustus 2026</option>
                <option value="Juli 2026">Juli 2026</option>
              </select>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400">Total KK:</span>{' '}
                <strong className="text-slate-800">{warga.length}</strong>
              </div>
              <div>
                <span className="text-slate-400">Lunas:</span>{' '}
                <strong className="text-emerald-600">{lunasCount} KK</strong>
              </div>
              <div>
                <span className="text-slate-400">Belum:</span>{' '}
                <strong className="text-red-600">{belumCount} KK</strong>
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-xl text-emerald-800 font-bold border border-emerald-200">
                Terkumpul: Rp {totalTerkumpul.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Table of Iuran with QRIS Payment button on each row */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">Nama Warga / Kepala Keluarga</th>
                    <th className="py-3.5 px-4">Alamat Rumah / Blok</th>
                    <th className="py-3.5 px-4 text-center">Status Pembayaran</th>
                    <th className="py-3.5 px-4 text-center">Bayar via QRIS / Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {warga.map((w) => {
                    const statusBadge = w.iuranLunas ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Lunas (Rp {nominalStandar.toLocaleString('id-ID')})
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center">
                        <Info className="w-3.5 h-3.5 mr-1 text-red-600" />
                        Belum Bayar
                      </span>
                    );

                    return (
                      <tr key={w.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {w.nama}
                          <div className="text-[11px] text-slate-400 font-normal">
                            NIK: {w.nik}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{w.alamat}</td>
                        <td className="py-3.5 px-4 text-center">{statusBadge}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* QR Payment Trigger */}
                            <button
                              onClick={() => onOpenQrPayment(w)}
                              title="Buka QRIS Pembayaran Warga Ini"
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center space-x-1"
                            >
                              <QrCode className="w-3.5 h-3.5 text-red-600" />
                              <span>QRIS</span>
                            </button>

                            {/* Direct Toggle */}
                            {w.iuranLunas ? (
                              <button
                                onClick={() => onToggleIuran(w.id)}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl font-medium transition cursor-pointer"
                              >
                                Batal
                              </button>
                            ) : (
                              <button
                                onClick={() => onToggleIuran(w.id)}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                              >
                                Lunas Tunai
                              </button>
                            )}

                            {/* WhatsApp Reminder */}
                            <a
                              href={`https://wa.me/${w.hp.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Halo Bpk/Ibu ${w.nama}, salam hangat dari Pengurus Graha Nuansa Mundu. Mengingatkan untuk iuran bulanan ${selectedBulan} sebesar Rp ${nominalStandar.toLocaleString('id-ID')}. Pembayaran dapat dilakukan langsung via QRIS atau transfer ke kas perumahan. Terima kasih atas partisipasinya 🙏`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl transition cursor-pointer"
                              title="Kirim Pesan WhatsApp Pengingat"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
