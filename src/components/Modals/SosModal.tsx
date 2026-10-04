import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  X,
  Flame,
  ShieldAlert,
  Ambulance,
  Waves,
  PhoneCall,
  Volume2,
  VolumeX,
  Radio,
  Send,
  MessageSquare,
} from 'lucide-react';
import { playEmergencySiren, stopEmergencySiren } from '../../utils/sound';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontakPosSatpam?: string;
  namaPosSatpam?: string;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  kontakPosSatpam = '081233445566',
  namaPosSatpam = 'Pos Satpam',
}) => {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopEmergencySiren();
      setIsSirenPlaying(false);
      setActiveAlert(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerAlert = (alertTitle: string, soundEffect: boolean = true) => {
    setActiveAlert(alertTitle);
    if (soundEffect) {
      playEmergencySiren();
      setIsSirenPlaying(true);
    }
  };

  const handleToggleSirenSound = () => {
    if (isSirenPlaying) {
      stopEmergencySiren();
      setIsSirenPlaying(false);
    } else {
      playEmergencySiren();
      setIsSirenPlaying(true);
    }
  };

  const handleStopEmergency = () => {
    stopEmergencySiren();
    setIsSirenPlaying(false);
    setActiveAlert(null);
    onClose();
  };

  const handleSendWAEmergency = (emergencyType: string) => {
    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const satpamInfo = kontakPosSatpam ? `\n👮 *Kontak Pos Satpam:* ${kontakPosSatpam}` : '';
    const message = `🚨🚨 *PERINGATAN DARURAT PERUMAHAN GRAHA NUANSA MUNDU* 🚨🚨\n\n⚠️ *KONDISI DARURAT: ${emergencyType.toUpperCase()}*\n⏰ Waktu: ${time} WIB\n📍 Lokasi: Lingkungan Perumahan Graha Nuansa Mundu, Cirebon${satpamInfo}\n\n‼️ *HIMBAUAN:* Seluruh warga terdekat, Petugas Pos Satpam & Keamanan, dan Pengurus Perumahan harap waspada dan segera merapat ke lokasi atau menghubungi kontak darurat!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* Modal 1: Selection Dialog */}
      {!activeAlert && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-t-8 border-red-600 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                SIMULATOR TOMBOL DARURAT SOS
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pilih kategori keadaan darurat untuk membunyikan sirine peringatan dan
                menyiarkan peringatan instan ke grup WhatsApp pengurus & warga.
              </p>

              {/* Pos Satpam Status Badge */}
              <div className="mt-3 py-2 px-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <span className="flex items-center space-x-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>Petugas Keamanan Siaga: {namaPosSatpam}</span>
                </span>
                <a
                  href={`tel:${kontakPosSatpam.replace(/\D/g, '')}`}
                  className="text-emerald-700 font-extrabold hover:underline font-mono bg-white px-2 py-0.5 rounded-lg border border-emerald-300"
                >
                  {kontakPosSatpam}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {/* Option 1 */}
              <button
                onClick={() =>
                  handleTriggerAlert('Bahaya Keamanan / Maling / Kemalingan')
                }
                className="bg-red-50/70 hover:bg-red-100 border-2 border-red-200 hover:border-red-500 p-3.5 rounded-2xl flex items-center space-x-3.5 transition group cursor-pointer text-left"
              >
                <div className="bg-red-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-red-600/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-red-950">
                    Bahaya Keamanan & Kriminalitas
                  </div>
                  <div className="text-xs text-red-700">
                    Pencurian, Maling, Keributan, Tamu Mencurigakan
                  </div>
                </div>
              </button>

              {/* Option 2 */}
              <button
                onClick={() => handleTriggerAlert('Kebakaran / Api / Tabung Gas')}
                className="bg-orange-50/70 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-500 p-3.5 rounded-2xl flex items-center space-x-3.5 transition group cursor-pointer text-left"
              >
                <div className="bg-orange-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-orange-600/30">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-orange-950">
                    Kebakaran & Api
                  </div>
                  <div className="text-xs text-orange-700">
                    Korsleting Listrik, Kebocoran Gas, Api Membesar
                  </div>
                </div>
              </button>

              {/* Option 3 */}
              <button
                onClick={() =>
                  handleTriggerAlert('Darurat Medis / Butuh Ambulans Segera')
                }
                className="bg-blue-50/70 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-500 p-3.5 rounded-2xl flex items-center space-x-3.5 transition group cursor-pointer text-left"
              >
                <div className="bg-blue-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-blue-600/30">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-blue-950">
                    Darurat Medis & Pertolongan
                  </div>
                  <div className="text-xs text-blue-700">
                    Kritis, Sakit Jantung, Butuh Ambulans / Oksigen
                  </div>
                </div>
              </button>

              {/* Option 4 */}
              <button
                onClick={() => handleTriggerAlert('Banjir / Bencana Alam Lingkungan')}
                className="bg-teal-50/70 hover:bg-teal-100 border-2 border-teal-200 hover:border-teal-500 p-3.5 rounded-2xl flex items-center space-x-3.5 transition group cursor-pointer text-left"
              >
                <div className="bg-teal-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-teal-600/30">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-teal-950">
                    Banjir & Bencana Lingkungan
                  </div>
                  <div className="text-xs text-teal-700">
                    Luapan Saluran Air, Pohon Tumbang, Longsor
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold transition cursor-pointer"
              >
                Batal / Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Active Alarm State Overlay */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 text-center shadow-2xl border-4 border-red-600 space-y-4 relative">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center animate-bounce shadow-xl shadow-red-600/40">
                <Radio className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div>
              <span className="bg-red-100 text-red-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                STATUS: PERINGATAN DARURAT SISKAMLING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight mt-2">
                ALARM SOS DIAKTIFKAN!
              </h2>
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl mt-2 text-sm font-extrabold text-red-950">
                {activeAlert}
              </div>
            </div>

            {/* Siren toggle */}
            <div className="flex items-center justify-center space-x-2 py-1">
              <button
                onClick={handleToggleSirenSound}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition cursor-pointer ${
                  isSirenPlaying
                    ? 'bg-red-600 text-white border-red-600 animate-pulse'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {isSirenPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Suara Sirine Berbunyi (Klik untuk Senyap)</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Sirine Disenyapkan (Klik untuk Bunyikan)</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Emergency Contacts */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
              <div className="font-bold text-slate-700 flex items-center justify-between">
                <span>Kontak Panggilan Darurat:</span>
                <span className="text-[10px] text-slate-400 font-semibold">Siap Siaga 24 Jam</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <a
                  href="tel:110"
                  className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 hover:border-red-400 flex items-center space-x-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span>Polisi: 110</span>
                </a>
                <a
                  href="tel:113"
                  className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 hover:border-red-400 flex items-center space-x-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                  <span>Damkar: 113</span>
                </a>
                <a
                  href="tel:119"
                  className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 hover:border-red-400 flex items-center space-x-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ambulans: 119</span>
                </a>
                <a
                  href={`tel:${kontakPosSatpam.replace(/\D/g, '')}`}
                  className="p-2 bg-emerald-50 rounded-xl border border-emerald-300 text-slate-800 hover:border-emerald-500 hover:bg-emerald-100 flex items-center space-x-1.5 shadow-xs transition"
                  title="Telepon Pos Satpam"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                  <span className="font-bold text-emerald-950 truncate">
                    {namaPosSatpam}: {kontakPosSatpam}
                  </span>
                </a>
              </div>

              {/* Direct WhatsApp to Pos Satpam */}
              <a
                href={`https://wa.me/${kontakPosSatpam.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `🚨🚨 *LAPORAN KEADAAN DARURAT WARGA GRAHA NUANSA MUNDU* 🚨🚨\n\nKondisi: *${activeAlert}*\nMohon petugas ${namaPosSatpam} segera menuju ke lokasi!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-between transition cursor-pointer font-sans shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="font-bold text-xs">Chat WhatsApp {namaPosSatpam}</span>
                </div>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {kontakPosSatpam}
                </span>
              </a>
            </div>

            {/* Broadcast WA button */}
            <button
              onClick={() => handleSendWAEmergency(activeAlert)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Pesan Darurat ke WhatsApp Warga</span>
            </button>

            {/* Stop Alarm */}
            <button
              onClick={handleStopEmergency}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition cursor-pointer text-sm"
            >
              Matikan Alarm Darurat & Selesai
            </button>
          </div>
        </div>
      )}
    </>
  );
};
