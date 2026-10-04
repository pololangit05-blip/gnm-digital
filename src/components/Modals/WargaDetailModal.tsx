import React from 'react';
import { X, User, Home, Phone, Shield, FileText, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import { Warga } from '../../types';

interface WargaDetailModalProps {
  warga: Warga | null;
  allWarga: Warga[];
  onClose: () => void;
  onEdit: (w: Warga) => void;
  onOpenQrPayment: (w: Warga) => void;
}

export const WargaDetailModal: React.FC<WargaDetailModalProps> = ({
  warga,
  allWarga,
  onClose,
  onEdit,
  onOpenQrPayment,
}) => {
  if (!warga) return null;

  // Family members sharing the same KK
  const familyMembers = allWarga.filter((w) => w.kk === warga.kk);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-150 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner">
            {warga.nama.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">{warga.nama}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {warga.status}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold">{warga.jabatan}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {warga.alamat}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Nomor Induk Kependudukan (NIK)</span>
            <span className="font-mono font-bold text-slate-800">{warga.nik}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Nomor Kartu Keluarga (KK)</span>
            <span className="font-mono font-bold text-slate-800">{warga.kk}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Jenis Kelamin</span>
            <span className="font-semibold text-slate-800">{warga.jenisKelamin || 'Laki-laki'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Agama</span>
            <span className="font-semibold text-slate-800">{warga.agama || 'Islam'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Pekerjaan / Profesi</span>
            <span className="font-semibold text-slate-800">{warga.pekerjaan || 'Wiraswasta / Karyawan'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Nomor WhatsApp / HP</span>
            <a
              href={`https://wa.me/${warga.hp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 hover:underline flex items-center"
            >
              <Phone className="w-3 h-3 mr-1" />
              {warga.hp}
            </a>
          </div>
          <div className="flex justify-between py-1 items-center">
            <span className="text-slate-500 font-medium">Status Iuran Bulanan</span>
            {warga.iuranLunas ? (
              <span className="font-bold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Lunas (Rp 50.000)
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-bold text-red-600 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> Belum Lunas
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenQrPayment(warga);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition shadow-xs"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Bayar QRIS</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Family members sharing same KK */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Anggota Keluarga Serumah (No. KK: {warga.kk})</span>
            <span className="text-slate-400 font-normal">{familyMembers.length} Orang</span>
          </h4>

          <div className="space-y-2">
            {familyMembers.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  m.id === warga.id
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <span>{m.nama}</span>
                    {m.id === warga.id && (
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold">
                        Profil Ini
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    NIK: {m.nik} • {m.jabatan}
                  </div>
                </div>
                <span className="text-slate-500 text-[11px]">{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onEdit(warga);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Edit Profil
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
