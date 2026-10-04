import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  QrCode,
  Building,
  CreditCard,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Save,
  HelpCircle,
  Eye,
  EyeOff,
  AlertCircle,
  UserCheck,
  Coins,
  User,
} from 'lucide-react';
import { PaymentSettings, BankAccount, UserRole } from '../../types';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PaymentSettings;
  onSaveSettings: (newSettings: PaymentSettings) => void;
  onResetSettings: () => void;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

const COMMON_BANKS = [
  'Bank Mandiri',
  'Bank BCA',
  'Bank BRI',
  'Bank BNI',
  'Bank BSI (Syariah)',
  'Bank BJB',
  'Bank CIMB Niaga',
  'Bank Permata',
  'Bank Danamon',
  'Bank BTN',
  'Lainnya',
];

export const PaymentSettingsModal: React.FC<PaymentSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetSettings,
  userRole,
  onSwitchRole,
}) => {
  // Local form state
  const [formData, setFormData] = useState<PaymentSettings>(settings);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(userRole === 'admin');

  // New bank form
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankName, setNewBankName] = useState('Bank Mandiri');
  const [customBankName, setCustomBankName] = useState('');
  const [newNoRek, setNewNoRek] = useState('');
  const [newAtasNama, setNewAtasNama] = useState('');
  const [newKeterangan, setNewKeterangan] = useState('');

  // Active section tab in settings
  const [activeTab, setActiveTab] = useState<'ketua' | 'qr' | 'rekening' | 'keamanan'>('ketua');

  // Live QR Preview
  const [previewQrUrl, setPreviewQrUrl] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Sync state when opened or settings change
  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      setIsUnlocked(userRole === 'admin');
      setPinInput('');
      setPinError('');
      setShowAddBank(false);
    }
  }, [isOpen, settings, userRole]);

  // Live preview QR Code generation
  useEffect(() => {
    if (!isOpen) return;

    const payload = `00020101021226600014ID.GO.QRIS.WWW0118${formData.qrId || 'ID1020260409001'}0215GNMUNDU520489995303360540500005802ID5926${(
      formData.merchantName || 'KAS GNM'
    ).toUpperCase()}6008${formData.kota || 'CIREBON'}6105${formData.kodePos || '45173'}62200116PREVIEW6304`;

    QRCode.toDataURL(payload, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setPreviewQrUrl(url))
      .catch(() => {});
  }, [isOpen, formData.qrId, formData.merchantName, formData.kota, formData.kodePos]);

  if (!isOpen) return null;

  // Handle PIN verification to unlock admin access
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '1234') {
      setIsUnlocked(true);
      onSwitchRole('admin');
      setPinError('');
    } else {
      setPinError('PIN Admin salah! Masukkan PIN yang valid (bawaan: 1234)');
    }
  };

  // Add Bank Account
  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBankName = newBankName === 'Lainnya' ? customBankName.trim() : newBankName;

    if (!finalBankName || !newNoRek.trim() || !newAtasNama.trim()) {
      alert('Mohon lengkapi Nama Bank, Nomor Rekening, dan Atas Nama!');
      return;
    }

    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      namaBank: finalBankName,
      nomorRekening: newNoRek.trim(),
      atasNama: newAtasNama.trim().toUpperCase(),
      keterangan: newKeterangan.trim() || undefined,
      isActive: true,
    };

    setFormData((prev) => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, newBank],
    }));

    // Reset form
    setNewNoRek('');
    setNewAtasNama('');
    setNewKeterangan('');
    setCustomBankName('');
    setShowAddBank(false);
  };

  // Delete Bank Account
  const handleDeleteBank = (id: string) => {
    if (formData.bankAccounts.length <= 1) {
      alert('Minimal harus menyisakan 1 rekening bank untuk keperluan transfer warga!');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((b) => b.id !== id),
    }));
  };

  // Toggle Bank Active status
  const handleToggleBankActive = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((b) =>
        b.id === id ? { ...b, isActive: !b.isActive } : b
      ),
    }));
  };

  // Save Settings
  const handleSave = () => {
    if (!formData.namaKetuaPaguyuban?.trim()) {
      alert('Nama Ketua Paguyuban tidak boleh kosong!');
      return;
    }
    if (!formData.qrId.trim()) {
      alert('ID QRIS (NMID) tidak boleh kosong!');
      return;
    }
    if (!formData.merchantName.trim()) {
      alert('Nama Merchant / Kas tidak boleh kosong!');
      return;
    }

    onSaveSettings({
      ...formData,
      namaKetuaPaguyuban: formData.namaKetuaPaguyuban.trim(),
      kontakKetua: formData.kontakKetua?.trim() || '',
      kontakPosSatpam: formData.kontakPosSatpam?.trim() || '081233445566',
      namaPosSatpam: formData.namaPosSatpam?.trim() || 'Pos Satpam',
      nominalIuranPerBulan: Number(formData.nominalIuranPerBulan) || 50000,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                Pengaturan Sistem & Paguyuban
              </h3>
              <p className="text-xs text-slate-400">
                Ubah Nama Ketua Paguyuban, Nominal Iuran, ID QRIS, dan Rekening Bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOCKED SCREEN (For Non-Admin / Resident) */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-8 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" /> Hak Akses Khusus Admin
              </span>
              <h4 className="text-lg font-extrabold text-slate-900">
                Pengaturan Terkunci
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Untuk menjaga keamanan kas dan mencegah kesalahan transfer warga, hanya{' '}
                <strong className="text-slate-800">Admin / Pengurus (Ketua & Bendahara)</strong> yang
                berhak mengubah ID QRIS dan Rekening Bank.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-left text-xs font-bold text-slate-700">
                Masukkan PIN Admin Pengurus:
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN Admin (4-6 angka)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="text-[11px] text-red-600 font-semibold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Kunci Akses Admin</span>
              </button>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Petunjuk: PIN default sistem adalah <span className="font-mono font-bold text-emerald-700">1234</span>
              </div>
            </form>
          </div>
        ) : (
          /* UNLOCKED ADMIN PANEL */
          <>
            {/* Status bar */}
            <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Status:{' '}
                  <strong>
                    Admin Terverifikasi (Bpk. {formData.namaKetuaPaguyuban || 'Bambang Setiawan'} / Ketua Paguyuban)
                  </strong>
                </span>
              </div>
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  onSwitchRole('warga');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer"
              >
                Kunci Kembali
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-1.5 sm:gap-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('ketua')}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl border-t border-x transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'ketua'
                    ? 'bg-white border-slate-200 text-emerald-700 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pengurus & Satpam</span>
              </button>

              <button
                onClick={() => setActiveTab('qr')}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl border-t border-x transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'qr'
                    ? 'bg-white border-slate-200 text-emerald-700 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>ID QRIS & Merchant</span>
              </button>

              <button
                onClick={() => setActiveTab('rekening')}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl border-t border-x transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'rekening'
                    ? 'bg-white border-slate-200 text-emerald-700 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Rekening Bank ({formData.bankAccounts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('keamanan')}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl border-t border-x transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'keamanan'
                    ? 'bg-white border-slate-200 text-emerald-700 shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>PIN Keamanan</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* TAB 0: KETUA PAGUYUBAN & TARIF IURAN */}
              {activeTab === 'ketua' && (
                <div className="space-y-4">
                  {/* Card 1: Nama Ketua Paguyuban */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Identitas Ketua Paguyuban
                        </h4>
                        <p className="text-xs text-slate-500">
                          Ubah nama ketua paguyuban/pengurus yang memimpin warga Graha Nuansa Mundu
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Lengkap Ketua Paguyuban <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.namaKetuaPaguyuban || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, namaKetuaPaguyuban: e.target.value })
                          }
                          placeholder="Contoh: Bambang Setiawan, S.T."
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Nama ini akan tampil di Header navigasi atas, kartu status admin, kuitansi, dan disinkronkan ke profil pengurus warga.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          No. Kontak / WhatsApp Ketua Paguyuban
                        </label>
                        <input
                          type="text"
                          value={formData.kontakKetua || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, kontakKetua: e.target.value })
                          }
                          placeholder="Contoh: 081298765432"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Kontak Pos Satpam & Keamanan (Darurat SOS) */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>Kontak Pos Satpam / Keamanan</span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            Darurat SOS
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Nomor HP / WhatsApp Pos Satpam yang dihubungi warga saat tombol SOS darurat diaktifkan
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          No. HP / WhatsApp Pos Satpam <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.kontakPosSatpam || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, kontakPosSatpam: e.target.value })
                          }
                          placeholder="Contoh: 081233445566"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Nomor ini otomatis terpasang pada tombol telepon dan kirim pesan WhatsApp cepat di fitur tombol darurat SOS perumahan.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama / Label Unit Keamanan
                        </label>
                        <input
                          type="text"
                          value={formData.namaPosSatpam || 'Pos Satpam'}
                          onChange={(e) =>
                            setFormData({ ...formData, namaPosSatpam: e.target.value })
                          }
                          placeholder="Contoh: Pos Satpam"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Nominal Iuran Bulanan Standar */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Nominal Standar Iuran Bulanan
                        </h4>
                        <p className="text-xs text-slate-500">
                          Tarif dasar iuran kas & kebersihan yang digunakan pada pilihan periode iuran
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tarif Iuran per Bulan (Rp) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            min={0}
                            step={5000}
                            value={formData.nominalIuranPerBulan || 50000}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nominalIuranPerBulan: Math.max(0, Number(e.target.value)),
                              })
                            }
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-extrabold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Tarif dasar ini otomatis dikalikan pada pilihan periode (1 bln, 3 bln, 6 bln, 12 bln) di modal QRIS dan rekap iuran kas.
                        </p>
                      </div>

                      {/* Quick chips */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500">Pilihan cepat:</span>
                        {[35000, 50000, 75000, 100000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, nominalIuranPerBulan: val })
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                              formData.nominalIuranPerBulan === val
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            Rp {val.toLocaleString('id-ID')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* TAB 1: QRIS SETTINGS */}
              {activeTab === 'qr' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left: Input Fields */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ID QRIS / NMID (National Merchant ID) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.qrId}
                          onChange={(e) =>
                            setFormData({ ...formData, qrId: e.target.value.trim() })
                          }
                          placeholder="Contoh: ID1020260409001"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          NMID resmi yang terdaftar pada Penyelenggara Jasa Pembayaran (PJP) QRIS Bank Indonesia.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Merchant QRIS <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.merchantName}
                          onChange={(e) =>
                            setFormData({ ...formData, merchantName: e.target.value })
                          }
                          placeholder="Contoh: KAS PERUMAHAN GNM"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Nama yang tampil di aplikasi perbankan warga saat scan QR code.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Terminal ID
                          </label>
                          <input
                            type="text"
                            value={formData.terminalId || 'A01'}
                            onChange={(e) =>
                              setFormData({ ...formData, terminalId: e.target.value.trim() })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Kota
                          </label>
                          <input
                            type="text"
                            value={formData.kota || 'CIREBON'}
                            onChange={(e) =>
                              setFormData({ ...formData, kota: e.target.value.toUpperCase() })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Kode Pos
                          </label>
                          <input
                            type="text"
                            value={formData.kodePos || '45173'}
                            onChange={(e) =>
                              setFormData({ ...formData, kodePos: e.target.value.trim() })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 text-center">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Preview QR Real-time
                      </span>
                      {previewQrUrl ? (
                        <img
                          src={previewQrUrl}
                          alt="Preview QR"
                          className="w-32 h-32 object-contain rounded-lg border border-slate-100 shadow-xs"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                          Loading Preview
                        </div>
                      )}
                      <div className="mt-2 text-[10px] font-extrabold text-slate-800 uppercase truncate max-w-[150px]">
                        {formData.merchantName || 'KAS GNM'}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        {formData.qrId || 'ID1020260409001'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BANK ACCOUNTS */}
              {activeTab === 'rekening' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Daftar Rekening Bank Kas Perumahan
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Rekening ini ditampilkan kepada warga pada menu transfer manual.
                      </p>
                    </div>
                    {!showAddBank && (
                      <button
                        onClick={() => setShowAddBank(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Rekening</span>
                      </button>
                    )}
                  </div>

                  {/* Add Bank Form */}
                  {showAddBank && (
                    <form
                      onSubmit={handleAddBank}
                      className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                        <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-emerald-700" />
                          Tambah Rekening Bank Baru
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddBank(false)}
                          className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Pilih Bank:
                          </label>
                          <select
                            value={newBankName}
                            onChange={(e) => setNewBankName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          >
                            {COMMON_BANKS.map((bank) => (
                              <option key={bank} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                        </div>

                        {newBankName === 'Lainnya' && (
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Tulis Nama Bank:
                            </label>
                            <input
                              type="text"
                              value={customBankName}
                              onChange={(e) => setCustomBankName(e.target.value)}
                              placeholder="Contoh: Bank Mega / Seabank"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Nomor Rekening:
                          </label>
                          <input
                            type="text"
                            value={newNoRek}
                            onChange={(e) => setNewNoRek(e.target.value)}
                            placeholder="Contoh: 134-00-9876543-2"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Atas Nama (a.n):
                          </label>
                          <input
                            type="text"
                            value={newAtasNama}
                            onChange={(e) => setNewAtasNama(e.target.value)}
                            placeholder="Contoh: KAS GRAHA NUANSA MUNDU"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Keterangan (Opsional):
                          </label>
                          <input
                            type="text"
                            value={newKeterangan}
                            onChange={(e) => setNewKeterangan(e.target.value)}
                            placeholder="Contoh: Rekening Kas Resmi / Bendahara"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                        >
                          Simpan Rekening Baru
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Bank Accounts */}
                  <div className="space-y-2.5">
                    {formData.bankAccounts.map((bank, index) => (
                      <div
                        key={bank.id}
                        className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          bank.isActive
                            ? 'bg-white border-slate-200 shadow-xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-extrabold text-slate-900">
                                {bank.namaBank}
                              </span>
                              {bank.isActive ? (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                  Aktif
                                </span>
                              ) : (
                                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                                  Non-Aktif
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-mono font-black text-blue-900 mt-0.5">
                              {bank.nomorRekening}
                            </div>
                            <div className="text-xs text-slate-600">
                              a.n <span className="font-semibold">{bank.atasNama}</span>
                              {bank.keterangan && (
                                <span className="text-slate-400"> • {bank.keterangan}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleBankActive(bank.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              bank.isActive
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {bank.isActive ? 'Non-aktifkan' : 'Aktifkan'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBank(bank.id)}
                            title="Hapus rekening ini"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY & ADMIN PIN */}
              {activeTab === 'keamanan' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Ubah PIN Admin Pengurus
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      PIN ini digunakan untuk melindungi pengaturan sensitif (ID QRIS & Rekening Bank) agar tidak diubah oleh sembarang orang.
                    </p>
                  </div>

                  <div className="max-w-xs space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      PIN Admin Baru (4 - 6 Angka):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.adminPin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminPin: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      placeholder="Contoh: 1234"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Pastikan Anda mengingat PIN ini. Bawaan sistem: 1234.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Kembalikan ID QR dan Rekening Bank ke konfigurasi default Perumahan GNM?'
                    )
                  ) {
                    onResetSettings();
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center space-x-1 cursor-pointer order-2 sm:order-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Default</span>
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto order-1 sm:order-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
