import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Share2,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { PengumumanItem, PengumumanKategori } from '../types';

interface PengumumanViewProps {
  pengumuman: PengumumanItem[];
  onOpenAddPengumuman: () => void;
  onDeletePengumuman: (id: number) => void;
}

export const PengumumanView: React.FC<PengumumanViewProps> = ({
  pengumuman,
  onOpenAddPengumuman,
  onDeletePengumuman,
}) => {
  const [filterKategori, setFilterKategori] = useState<'ALL' | PengumumanKategori>('ALL');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredPengumuman = pengumuman.filter(
    (p) => filterKategori === 'ALL' || p.kategori === filterKategori
  );

  const handleShareWA = (item: PengumumanItem) => {
    const text = `📢 *PENGUMUMAN PERUMAHAN GRAHA NUANSA MUNDU*\n\n📌 *${item.judul.toUpperCase()}*\n🏷️ Kategori: ${item.kategori}\n📅 Tanggal: ${item.tanggal}\n${
      item.lokasi ? `📍 Lokasi: ${item.lokasi}\n` : ''
    }\n📝 *Isi Informasi:*\n${item.isi}\n\n_Demikian disampaikan oleh Pengurus Perumahan Graha Nuansa Mundu. Mohon partisipasi dan perhatian seluruh warga._`;

    // Copy to clipboard
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);

    // Also open WhatsApp link
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterKategori('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterKategori === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({pengumuman.length})
          </button>
          <button
            onClick={() => setFilterKategori('Kegiatan / Agenda')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterKategori === 'Kegiatan / Agenda'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            Kegiatan & Agenda
          </button>
          <button
            onClick={() => setFilterKategori('Penting / Urgen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterKategori === 'Penting / Urgen'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            Penting / Urgen
          </button>
          <button
            onClick={() => setFilterKategori('Kerja Bakti')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterKategori === 'Kerja Bakti'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Kerja Bakti
          </button>
        </div>

        {/* Add Announcement Button */}
        <button
          onClick={onOpenAddPengumuman}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-sm shadow-emerald-600/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredPengumuman.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            Belum ada pengumuman dalam kategori ini.
          </div>
        ) : (
          filteredPengumuman.map((item) => {
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
            if (item.kategori === 'Kegiatan / Agenda') badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
            if (item.kategori === 'Penting / Urgen') badgeStyle = 'bg-red-50 text-red-700 border-red-200';
            if (item.kategori === 'Kerja Bakti') badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
            if (item.kategori === 'Keamanan') badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3.5 flex flex-col justify-between hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeStyle}`}
                    >
                      {item.kategori}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {item.tanggal}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                    {item.judul}
                  </h3>

                  {item.lokasi && (
                    <div className="flex items-center text-xs text-slate-500 font-medium mt-1.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                      <span>{item.lokasi}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5 whitespace-pre-line">
                    {item.isi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleShareWA(item)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-emerald-200"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin & Dibuka!</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kirim ke WA Warga</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeletePengumuman(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 text-xs font-medium transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
