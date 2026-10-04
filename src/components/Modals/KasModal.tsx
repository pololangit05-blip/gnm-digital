import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, X, Wallet } from 'lucide-react';
import { KasJenis, KasKategori } from '../../types';

interface KasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: {
    tanggal: string;
    desc: string;
    kategori: KasKategori;
    jenis: KasJenis;
    amount: number;
    pj?: string;
  }) => void;
}

export const KasModal: React.FC<KasModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [jenis, setJenis] = useState<KasJenis>('Pemasukan');
  const [desc, setDesc] = useState('');
  const [kategori, setKategori] = useState<KasKategori>('Iuran Warga');
  const [amount, setAmount] = useState('');
  const [pj, setPj] = useState('Bendahara Ahmad');
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/\D/g, ''), 10);
    if (!desc.trim() || isNaN(numAmount) || numAmount <= 0) return;

    onSave({
      tanggal,
      desc: desc.trim(),
      kategori,
      jenis,
      amount: numAmount,
      pj: pj.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Wallet className="w-5 h-5 text-emerald-600 mr-2" />
          Catat Transaksi Kas
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Jenis Transaksi (Tabs) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Jenis Arus Kas *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setJenis('Pemasukan');
                  setKategori('Iuran Warga');
                }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 border transition cursor-pointer ${
                  jenis === 'Pemasukan'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Pemasukan (+)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setJenis('Pengeluaran');
                  setKategori('Keamanan');
                }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 border transition cursor-pointer ${
                  jenis === 'Pengeluaran'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Pengeluaran (-)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Tanggal Transaksi *
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Kategori Transaksi *
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {jenis === 'Pemasukan' ? (
                <>
                  <option value="Iuran Warga">Iuran Warga Bulanan</option>
                  <option value="Sosial">Donasi / Swadaya Sukarela</option>
                  <option value="Lainnya">Pemasukan Lain-lain</option>
                </>
              ) : (
                <>
                  <option value="Keamanan">Honor Keamanan & Ronda</option>
                  <option value="Kebersihan">Kebersihan & Petugas Sampah</option>
                  <option value="Infrastruktur">Infrastruktur, Lampu & Sarana</option>
                  <option value="Sosial">Bantuan Sosial / Warga Sakit / Duka</option>
                  <option value="Lainnya">Pengeluaran Operasional Lainnya</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Uraian / Keterangan Transaksi *
            </label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Contoh: Beli Lampu Jalan LED 3 Titik"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Nominal (Rp) *
              </label>
              <input
                type="text"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 150000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Penanggung Jawab (PJ)
              </label>
              <input
                type="text"
                value={pj}
                onChange={(e) => setPj(e.target.value)}
                placeholder="Contoh: Bendahara Ahmad"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
