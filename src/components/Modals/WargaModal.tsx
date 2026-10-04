import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, X } from 'lucide-react';
import { Warga, WargaStatus, WargaJabatan } from '../../types';

interface WargaModalProps {
  isOpen: boolean;
  editingWarga: Warga | null;
  onClose: () => void;
  onSave: (w: Omit<Warga, 'id'>, id?: number) => void;
}

export const WargaModal: React.FC<WargaModalProps> = ({
  isOpen,
  editingWarga,
  onClose,
  onSave,
}) => {
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [kk, setKk] = useState('');
  const [alamat, setAlamat] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<WargaStatus>('Tetap');
  const [jabatan, setJabatan] = useState<WargaJabatan>('Warga');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [agama, setAgama] = useState('Islam');
  const [pekerjaan, setPekerjaan] = useState('');

  useEffect(() => {
    if (editingWarga) {
      setNama(editingWarga.nama);
      setNik(editingWarga.nik);
      setKk(editingWarga.kk);
      setAlamat(editingWarga.alamat);
      setHp(editingWarga.hp);
      setStatus(editingWarga.status);
      setJabatan(editingWarga.jabatan);
      setJenisKelamin(editingWarga.jenisKelamin || 'Laki-laki');
      setAgama(editingWarga.agama || 'Islam');
      setPekerjaan(editingWarga.pekerjaan || '');
    } else {
      setNama('');
      setNik('');
      setKk('');
      setAlamat('');
      setHp('');
      setStatus('Tetap');
      setJabatan('Warga');
      setJenisKelamin('Laki-laki');
      setAgama('Islam');
      setPekerjaan('');
    }
  }, [editingWarga, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nik.trim() || !kk.trim() || !alamat.trim() || !hp.trim()) {
      return;
    }

    onSave(
      {
        nama: nama.trim(),
        nik: nik.trim(),
        kk: kk.trim(),
        alamat: alamat.trim(),
        hp: hp.trim(),
        status,
        jabatan,
        jenisKelamin,
        agama,
        pekerjaan: pekerjaan.trim() || 'Wiraswasta / Karyawan',
        iuranLunas: editingWarga ? editingWarga.iuranLunas : false,
      },
      editingWarga ? editingWarga.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          {editingWarga ? (
            <>
              <Edit3 className="w-5 h-5 text-blue-600 mr-2" />
              Edit Data Kependudukan Warga
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 text-emerald-600 mr-2" />
              Tambah Data Warga Baru
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Nama Lengkap (Sesuai KTP) *
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                NIK (16 Digit KTP) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="327601xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Nomor Kartu Keluarga (KK) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={kk}
                onChange={(e) => setKk(e.target.value.replace(/\D/g, ''))}
                placeholder="327601xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Agama
              </label>
              <select
                value={agama}
                onChange={(e) => setAgama(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen Protestan">Kristen Protestan</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Alamat Rumah / Blok / No. *
            </label>
            <input
              type="text"
              required
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl. Mawar No. 12 B"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                No. HP / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Pekerjaan / Profesi
              </label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                placeholder="Contoh: Karyawan Swasta"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Status Tinggal *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Tetap">Warga Tetap (Rumah Pribadi)</option>
                <option value="Kontrak">Warga Kontrak / Sewa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Jabatan / Peran di Lingkungan
              </label>
              <select
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Warga">Warga Biasa</option>
                <option value="Ketua Pengurus">Ketua Pengurus</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Keamanan">Seksi Keamanan / Ronda</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              {editingWarga ? 'Simpan Perubahan' : 'Tambahkan Warga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
