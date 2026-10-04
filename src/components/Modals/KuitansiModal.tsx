import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { Warga } from '../../types';
import { GNM_LOGO } from '../../assets/logo';

interface KuitansiModalProps {
  isOpen: boolean;
  kuitansiData: {
    warga: Warga;
    amount: number;
    bulan: string;
    metode: string;
    kuitansiNo: string;
    tanggal?: string;
  } | null;
  onClose: () => void;
}

export const KuitansiModal: React.FC<KuitansiModalProps> = ({
  isOpen,
  kuitansiData,
  onClose,
}) => {
  if (!isOpen || !kuitansiData) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate =
    kuitansiData.tanggal ||
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mr-1.5" />
              Kuitansi Digital Pembayaran Iuran
            </h3>
            <p className="text-[11px] text-slate-500">
              Bukti sah pembayaran Perumahan Graha Nuansa Mundu
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="overflow-y-auto my-3 p-1">
          <div
            id="printable-kuitansi"
            className="border-2 border-emerald-600/60 rounded-2xl p-5 sm:p-6 bg-emerald-50/20 text-slate-800 space-y-4 relative overflow-hidden"
          >
            {/* Watermark / Header */}
            <div className="flex justify-between items-start border-b border-emerald-200 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={GNM_LOGO}
                  alt="Logo Perumahan GNM"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border border-emerald-300 shadow-xs bg-white"
                />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mb-0.5">
                    PENGELOLA KAS PERUMAHAN GNM
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    PERUMAHAN GRAHA NUANSA MUNDU
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Mundu, Cirebon • Jawa Barat
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  LUNAS / DIVERIFIKASI
                </span>
                <div className="text-[11px] font-mono text-slate-600 mt-1 font-bold">
                  {kuitansiData.kuitansiNo}
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Telah Diterima Dari:</span>
                <span className="font-bold text-slate-900">{kuitansiData.warga.nama}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Alamat / No. Rumah:</span>
                <span className="text-slate-800 font-medium">{kuitansiData.warga.alamat}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Untuk Pembayaran:</span>
                <span className="text-slate-800 font-semibold">
                  Iuran Bulanan ({kuitansiData.bulan})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Kanal / Metode Bayar:</span>
                <span className="text-emerald-700 font-bold">{kuitansiData.metode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Waktu Transaksi:</span>
                <span className="text-slate-700">{currentDate}</span>
              </div>
            </div>

            {/* Grand Total Box */}
            <div className="bg-emerald-600 text-white p-3.5 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Jumlah Diterima:
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono">
                Rp {kuitansiData.amount.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-3 text-[11px]">
              <div>
                <p className="text-slate-400">Penyetor,</p>
                <div className="h-10"></div>
                <p className="font-bold text-slate-800">({kuitansiData.warga.nama})</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Mundu, {currentDate}</p>
                <p className="font-bold text-emerald-800">Bendahara Pengelola</p>
                <div className="h-6 flex items-center justify-end">
                  <span className="text-[9px] font-bold text-emerald-600 italic bg-emerald-50 px-1 border border-emerald-300 rounded">
                    ✓ VALID DIGITALLY
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 underline">Ahmad Subagja</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kuitansi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
