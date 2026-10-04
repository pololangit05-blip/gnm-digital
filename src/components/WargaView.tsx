import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Users,
  LayoutGrid,
  Table as TableIcon,
  Home,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  QrCode,
} from 'lucide-react';
import { Warga, WargaStatus, WargaJabatan } from '../types';

interface WargaViewProps {
  warga: Warga[];
  onOpenAdd: () => void;
  onOpenEdit: (w: Warga) => void;
  onOpenDetail: (w: Warga) => void;
  onDelete: (id: number) => void;
  onOpenQrPayment?: (w: Warga) => void;
}

export const WargaView: React.FC<WargaViewProps> = ({
  warga,
  onOpenAdd,
  onOpenEdit,
  onOpenDetail,
  onDelete,
  onOpenQrPayment,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | WargaStatus>('ALL');
  const [jabatanFilter, setJabatanFilter] = useState<'ALL' | WargaJabatan>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtered residents
  const filteredWarga = warga.filter((w) => {
    const q = search.toLowerCase();
    const matchSearch =
      w.nama.toLowerCase().includes(q) ||
      w.nik.includes(q) ||
      w.kk.includes(q) ||
      w.alamat.toLowerCase().includes(q) ||
      w.hp.includes(q);

    const matchStatus = statusFilter === 'ALL' || w.status === statusFilter;
    const matchJabatan =
      jabatanFilter === 'ALL' ||
      (jabatanFilter === 'Ketua Pengurus'
        ? w.jabatan === 'Ketua Pengurus' || w.jabatan === 'Ketua RT'
        : w.jabatan === jabatanFilter);

    return matchSearch && matchStatus && matchJabatan;
  });

  // Group by KK for cards view
  const groupedByKK = filteredWarga.reduce((acc, curr) => {
    if (!acc[curr.kk]) {
      acc[curr.kk] = [];
    }
    acc[curr.kk].push(curr);
    return acc;
  }, {} as Record<string, Warga[]>);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID,Nama Lengkap,NIK,No KK,Alamat,No HP,Status,Jabatan,Status Iuran',
    ];
    const rows = warga.map(
      (w) =>
        `"${w.id}","${w.nama}","${w.nik}","${w.kk}","${w.alamat}","${w.hp}","${w.status}","${w.jabatan}","${
          w.iuranLunas ? 'Lunas' : 'Belum Bayar'
        }"`
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Warga_GrahaNuansaMundu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatWA = (hp: string) => {
    const cleaned = hp.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 flex-grow max-w-3xl">
          {/* Search Input */}
          <div className="relative flex-grow min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIK, No. KK, atau alamat..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">Semua Status Warga</option>
            <option value="Tetap">Warga Tetap</option>
            <option value="Kontrak">Warga Kontrak</option>
          </select>

          {/* Jabatan Filter */}
          <select
            value={jabatanFilter}
            onChange={(e) => setJabatanFilter(e.target.value as any)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-700 font-medium"
          >
            <option value="ALL">Semua Jabatan</option>
            <option value="Ketua Pengurus">Ketua Pengurus</option>
            <option value="Sekretaris">Sekretaris</option>
            <option value="Bendahara">Bendahara</option>
            <option value="Keamanan">Seksi Keamanan</option>
            <option value="Warga">Warga Biasa</option>
          </select>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel"
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                viewMode === 'table'
                  ? 'bg-white shadow-xs text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Tampilan Kartu Keluarga (KK)"
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                viewMode === 'cards'
                  ? 'bg-white shadow-xs text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            title="Export ke file CSV / Excel"
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-sm shadow-emerald-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Warga</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4">Nama Lengkap & NIK</th>
                  <th className="py-3.5 px-4">Nomor KK</th>
                  <th className="py-3.5 px-4">Alamat Rumah</th>
                  <th className="py-3.5 px-4">WhatsApp / Kontak</th>
                  <th className="py-3.5 px-4">Status & Peran</th>
                  <th className="py-3.5 px-4 text-center">Iuran</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWarga.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-slate-400 font-medium"
                    >
                      Tidak ada data warga yang cocok dengan pencarian / filter.
                    </td>
                  </tr>
                ) : (
                  filteredWarga.map((w) => {
                    const badgeStatus =
                      w.status === 'Tetap'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800';

                    let badgeJabatan = 'bg-slate-100 text-slate-600';
                    if (w.jabatan === 'Ketua Pengurus' || w.jabatan === 'Ketua RT') badgeJabatan = 'bg-emerald-600 text-white font-bold';
                    else if (w.jabatan === 'Bendahara') badgeJabatan = 'bg-blue-600 text-white font-bold';
                    else if (w.jabatan === 'Sekretaris') badgeJabatan = 'bg-indigo-600 text-white font-bold';
                    else if (w.jabatan === 'Keamanan') badgeJabatan = 'bg-slate-800 text-white font-bold';

                    return (
                      <tr key={w.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                            <span>{w.nama}</span>
                            {w.jenisKelamin && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
                                {w.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono tracking-tight">
                            NIK: {w.nik}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                          {w.kk}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate">
                          {w.alamat}
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={`https://wa.me/${formatWA(w.hp)}?text=${encodeURIComponent(
                              `Halo Bpk/Ibu ${w.nama}, salam hangat dari Pengurus Perumahan Graha Nuansa Mundu.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                            <span>{w.hp}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeStatus}`}
                            >
                              {w.status}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md ${badgeJabatan}`}
                            >
                              {w.jabatan}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {w.iuranLunas ? (
                            <span
                              title="Iuran bulan ini telah lunas"
                              className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"
                            >
                              <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" /> Lunas
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenQrPayment?.(w)}
                              title="Klik untuk bayar iuran via QRIS"
                              className="inline-flex items-center text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 cursor-pointer transition"
                            >
                              <QrCode className="w-3 h-3 mr-1 text-red-600" /> Bayar QR
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => onOpenDetail(w)}
                              title="Lihat Detail Profil Warga & Keluarga"
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onOpenEdit(w)}
                              title="Edit Data Warga"
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(w.id)}
                              title="Hapus Data Warga"
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mode 2: KK Cards Grouping View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedByKK).map(([noKK, members]) => {
            const head =
              members.find((m) => m.jabatan === 'Ketua Pengurus' || m.jabatan === 'Ketua RT') ||
              members[0];

            return (
              <div
                key={noKK}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3.5 hover:border-emerald-300 transition"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      No. Kartu Keluarga
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 font-mono">
                      {noKK}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                      <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {head.alamat}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl">
                    {members.length} Anggota
                  </span>
                </div>

                <div className="space-y-2">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                          <span>{m.nama}</span>
                          <span className="text-[10px] text-slate-400">({m.status})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIK: {m.nik} • {m.jabatan}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onOpenDetail(m)}
                          className="p-1 text-slate-400 hover:text-slate-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(m)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
