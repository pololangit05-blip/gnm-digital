import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { PengumumanKategori } from '../../types';

interface PengumumanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    judul: string;
    kategori: PengumumanKategori;
    isi: string;
    lokasi?: string;
    tanggal: string;
  }) => void;
}

export const PengumumanModal: React.FC<PengumumanModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<PengumumanKategori>('Kegiatan / Agenda');
  const [lokasi, setLokasi] = useState('');
  const [isi, setIs] = useState('');
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;

    onSave({
      judul: judul.trim(),
      kategori,
      lokasi: lokasi.trim() || undefined,
      isi: isi.trim(),
      tanggal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Megaphone className="w-5 h-5 text-purple-600 mr-2" />
          Buat Pengumuman & Agenda Baru
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Judul Pengumuman *
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Kerja Bakti Massal Membersihkan Selokan"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Kategori Informasi *
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Kegiatan / Agenda">Kegiatan / Agenda</option>
                <option value="Penting / Urgen">Penting / Urgen</option>
                <option value="Info Umum">Info Umum</option>
                <option value="Kerja Bakti">Kerja Bakti</option>
                <option value="Keamanan">Keamanan Lingkungan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tanggal Pelaksanaan / Rilis *
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Lokasi Tempat Kegiatan (Opsional)
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Pos Satpam / Taman Fasum Perumahan"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Rincian Isi Pengumuman *
            </label>
            <textarea
              required
              rows={4}
              value={isi}
              onChange={(e) => setIs(e.target.value)}
              placeholder="Tuliskan detail pengumuman, agenda, instruksi untuk warga..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 transition cursor-pointer"
            >
              Publikasikan Pengumuman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
