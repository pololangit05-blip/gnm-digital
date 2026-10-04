import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  QrCode,
  X,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Building,
  Smartphone,
  Wallet,
  Receipt,
  Sparkles,
  Settings,
} from 'lucide-react';
import { Warga, PaymentSettings, UserRole } from '../../types';
import { GNM_LOGO } from '../../assets/logo';

interface QrPaymentModalProps {
  isOpen: boolean;
  selectedWarga: Warga | null;
  wargaList: Warga[];
  onClose: () => void;
  onPaymentSuccess: (details: {
    warga: Warga;
    amount: number;
    bulan: string;
    metode: string;
    kuitansiNo: string;
  }) => void;
  onOpenKuitansi?: () => void;
  paymentSettings?: PaymentSettings;
  onOpenSettings?: () => void;
  userRole?: UserRole;
}

export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({
  isOpen,
  selectedWarga,
  wargaList,
  onClose,
  onPaymentSuccess,
  onOpenKuitansi,
  paymentSettings,
  onOpenSettings,
  userRole = 'admin',
}) => {
  const [currentWargaId, setCurrentWargaId] = useState<number>(1);
  const [bulanPeriode, setBulanPeriode] = useState('1 Bulan (Oktober 2026)');
  const [durasiBulan, setDurasiBulan] = useState(1);
  const [sukaDonasi, setSukaDonasi] = useState(false);
  const [nominalDonasi, setNominalDonasi] = useState(10000);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'qr' | 'transfer' | 'verifikasi'>('qr');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [lastKuitansiNo, setLastKuitansiNo] = useState('');
  const [uploadedProofName, setUploadedProofName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default resident when opened
  useEffect(() => {
    if (selectedWarga) {
      setCurrentWargaId(selectedWarga.id);
    } else if (wargaList.length > 0 && !currentWargaId) {
      setCurrentWargaId(wargaList[0].id);
    }
  }, [selectedWarga, wargaList, isOpen]);

  const activeWarga =
    wargaList.find((w) => w.id === currentWargaId) ||
    selectedWarga ||
    wargaList[0];

  // Base iuran calculation & editable nominal
  const baseTarifPerBulan = paymentSettings?.nominalIuranPerBulan || 50000;
  const [customNominalIuran, setCustomNominalIuran] = useState<number>(baseTarifPerBulan);

  // Sync nominal when modal opens or baseTarif changes
  useEffect(() => {
    if (isOpen) {
      const tarif = paymentSettings?.nominalIuranPerBulan || 50000;
      setCustomNominalIuran(tarif * (durasiBulan || 1));
    }
  }, [isOpen, paymentSettings?.nominalIuranPerBulan]);

  const subtotal = customNominalIuran;
  const donasi = sukaDonasi ? nominalDonasi : 0;
  const totalAmount = subtotal + donasi;

  const currentNmid = paymentSettings?.qrId || 'ID1020260409001';
  const currentMerchant = paymentSettings?.merchantName || 'KAS PERUMAHAN GNM';
  const currentTerminal = paymentSettings?.terminalId || 'A01';
  const currentKota = paymentSettings?.kota || 'CIREBON';
  const currentKodePos = paymentSettings?.kodePos || '45173';
  const activeBankList = (paymentSettings?.bankAccounts || []).filter((b) => b.isActive);

  // Generate dynamic QRIS string
  useEffect(() => {
    if (!isOpen || !activeWarga) return;

    // Standard simulated QRIS EMVCo payload format with merchant info
    const payload = `00020101021226600014ID.GO.QRIS.WWW0118${currentNmid}0215GNMUNDU520489995303360540${totalAmount}5802ID5926${currentMerchant.slice(
      0,
      25
    ).toUpperCase()}6008${currentKota.slice(0, 15).toUpperCase()}6105${currentKodePos}62200116${activeWarga.nik.slice(
      -6
    )}${durasiBulan}M6304`;

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed generating QR Code:', err));
  }, [isOpen, activeWarga, totalAmount, durasiBulan, currentNmid, currentMerchant, currentKota, currentKodePos]);

  if (!isOpen || !activeWarga) return null;

  // Download QR image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRIS_Iuran_${activeWarga.nama.replace(/\s+/g, '_')}_Rp${totalAmount}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share to WhatsApp
  const handleShareWA = () => {
    const bankSection =
      activeBankList.length > 0
        ? activeBankList
            .map(
              (b) =>
                `• ${b.namaBank}: ${b.nomorRekening} (a.n ${b.atasNama}${
                  b.keterangan ? ` - ${b.keterangan}` : ''
                })`
            )
            .join('\n')
        : '• Hubungi Pengurus / Bendahara untuk transfer manual';

    const text =
      `*TAGIHAN IURAN PERUMAHAN GRAHA NUANSA MUNDU*\n\n` +
      `👤 *Warga/KK:* ${activeWarga.nama}\n` +
      `🏠 *Alamat:* ${activeWarga.alamat}\n` +
      `📅 *Periode:* ${bulanPeriode}\n` +
      `💰 *Total Pembayaran:* Rp ${totalAmount.toLocaleString('id-ID')}\n\n` +
      `📲 *Metode Pembayaran QRIS:* Bisa discan langsung menggunakan seluruh aplikasi M-Banking (BCA, Mandiri, BRI, BNI, BSI) & E-Wallet (GoPay, OVO, DANA, ShopeePay).\n` +
      `Merchant: *${currentMerchant}* (NMID: ${currentNmid})\n\n` +
      `🏦 *Pilihan Transfer Manual Kas Perumahan:*\n` +
      `${bankSection}\n\n` +
      `_Harap konfirmasikan bukti bayar setelah transfer. Terima kasih._`;

    window.open(
      `https://wa.me/${activeWarga.hp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const handleCopyRekening = (bank: string, norek: string) => {
    navigator.clipboard.writeText(norek);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // Simulation: Resident / Admin confirms payment
  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);

      const kuitansiNumber = `KW/GNM/${new Date().getFullYear()}/${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`;

      setLastKuitansiNo(kuitansiNumber);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399', '#fbbf24'],
        });
      } catch {
        // ignore
      }

      onPaymentSuccess({
        warga: activeWarga,
        amount: totalAmount,
        bulan: bulanPeriode,
        metode: 'QRIS Standar Nasional (GPN)',
        kuitansiNo: kuitansiNumber,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="absolute top-4 sm:top-5 right-4 sm:right-5 flex items-center space-x-1 sm:space-x-2">
          {onOpenSettings && (
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              title="Ubah ID QR & Rekening Bank (Admin)"
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-xl transition cursor-pointer flex items-center space-x-1 text-xs font-semibold border border-slate-200"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ubah QR & Rekening</span>
              {userRole === 'admin' ? (
                <span className="hidden sm:inline-block text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded">
                  Admin
                </span>
              ) : null}
            </button>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 sm:p-2 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={GNM_LOGO}
            alt="Logo Perumahan GNM"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                Pembayaran Iuran QRIS
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                GPN Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Perumahan GNM (Graha Nuansa Mundu)
            </p>
          </div>
        </div>

        {/* If payment was just completed successfully */}
        {paymentDone ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Pembayaran Berhasil Diverifikasi
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Iuran Lunas!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Dana sebesar{' '}
                <strong className="text-emerald-700 font-extrabold">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </strong>{' '}
                telah dicatat otomatis ke <strong>Jurnal Kas</strong> dan status iuran{' '}
                <strong>{activeWarga.nama}</strong> telah diperbarui.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left max-w-sm mx-auto space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>No. Kuitansi:</span>
                <span className="font-bold text-slate-800">{lastKuitansiNo}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pembayar:</span>
                <span className="font-bold text-slate-800">{activeWarga.nama}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Alamat:</span>
                <span className="text-slate-700">{activeWarga.alamat}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Metode:</span>
                <span className="text-emerald-700 font-bold">QRIS Standar Nasional</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 pt-2">
              {onOpenKuitansi && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenKuitansi();
                  }}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md transition cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Lihat & Cetak Kuitansi Digital</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resident & Duration Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Pilih Warga / Kepala Keluarga:
                </label>
                <select
                  value={currentWargaId}
                  onChange={(e) => setCurrentWargaId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {wargaList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nama} • {w.alamat} ({w.iuranLunas ? '✓ Lunas' : 'Belum Lunas'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Periode Iuran & Edit Nominal Card */}
              <div className="bg-slate-100/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dropdown Periode */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pilihan Periode Iuran:
                    </label>
                    <select
                      value={durasiBulan}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDurasiBulan(val);
                        if (val === 1) {
                          setBulanPeriode('1 Bulan (Oktober 2026)');
                          setCustomNominalIuran(baseTarifPerBulan * 1);
                        } else if (val === 3) {
                          setBulanPeriode('3 Bulan (Okt - Des 2026)');
                          setCustomNominalIuran(baseTarifPerBulan * 3);
                        } else if (val === 6) {
                          setBulanPeriode('6 Bulan (Semester II 2026)');
                          setCustomNominalIuran(baseTarifPerBulan * 6);
                        } else if (val === 12) {
                          setBulanPeriode('1 Tahun Penuh (2026 - 2027)');
                          setCustomNominalIuran(baseTarifPerBulan * 12);
                        } else if (val === 0) {
                          setBulanPeriode('Periode Bebas / Kustom');
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value={1}>1 Bulan (Rp {baseTarifPerBulan.toLocaleString('id-ID')})</option>
                      <option value={3}>3 Bulan (Rp {(baseTarifPerBulan * 3).toLocaleString('id-ID')})</option>
                      <option value={6}>6 Bulan (Rp {(baseTarifPerBulan * 6).toLocaleString('id-ID')})</option>
                      <option value={12}>1 Tahun (Rp {(baseTarifPerBulan * 12).toLocaleString('id-ID')})</option>
                      <option value={0}>Kustom / Nominal Bebas</option>
                    </select>
                  </div>

                  {/* EDIT NOMINAL INPUT */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <span>Nominal Iuran (Rp):</span>
                      </label>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-300">
                        Dapat Diedit
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={customNominalIuran}
                        onChange={(e) => setCustomNominalIuran(Math.max(0, Number(e.target.value)))}
                        placeholder="Nominal iuran"
                        className="w-full bg-white border-2 border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* If custom period selected, allow custom description */}
                {durasiBulan === 0 && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Keterangan Periode Iuran Kustom:
                    </label>
                    <input
                      type="text"
                      value={bulanPeriode}
                      onChange={(e) => setBulanPeriode(e.target.value)}
                      placeholder="Contoh: Iuran 2 Bulan + Kebersihan Ekstra"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Preset Chips for quick nominal editing */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold">Pilih Cepat:</span>
                  {[baseTarifPerBulan, baseTarifPerBulan * 3, baseTarifPerBulan * 6, baseTarifPerBulan * 12, 100000].map((presetVal, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomNominalIuran(presetVal)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                        customNominalIuran === presetVal
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Rp {presetVal.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                {/* Donasi Checkbox */}
                <div className="pt-1">
                  <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                    <input
                      type="checkbox"
                      id="donasi-check"
                      checked={sukaDonasi}
                      onChange={(e) => setSukaDonasi(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor="donasi-check"
                      className="text-xs text-slate-700 cursor-pointer font-medium flex items-center justify-between w-full"
                    >
                      <span>+ Donasi Kas Sosial Paguyuban (Opsional)</span>
                      <span className="font-bold text-emerald-700 font-mono">+ Rp 10.000</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tab Navigation: QRIS vs Transfer Manual */}
            <div className="flex border-b border-slate-200 space-x-2">
              <button
                onClick={() => setActiveSubTab('qr')}
                className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
                  activeSubTab === 'qr'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QRIS Instan (Semua Bank & E-Wallet)</span>
              </button>
              <button
                onClick={() => setActiveSubTab('transfer')}
                className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
                  activeSubTab === 'transfer'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Transfer Bank</span>
              </button>
            </div>

            {/* TAB 1: QRIS CARD */}
            {activeSubTab === 'qr' && (
              <div className="space-y-4">
                {/* Official QRIS Display Card */}
                <div className="bg-gradient-to-b from-white to-slate-50 border-2 border-red-600 rounded-3xl p-5 shadow-lg max-w-sm mx-auto text-center relative overflow-hidden">
                  {/* QRIS Top Badge */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-3">
                    <div className="flex items-center space-x-1 text-left">
                      <span className="text-xl font-black tracking-tighter text-red-600">
                        QRIS
                      </span>
                      <div className="text-[9px] font-bold text-slate-700 leading-tight border-l border-slate-300 pl-1">
                        STANDAR PEMBAYARAN<br />NASIONAL
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-600 text-white tracking-wider">
                      GPN
                    </span>
                  </div>

                  {/* Merchant Identity */}
                  <div className="mb-2 flex items-center justify-center space-x-2.5">
                    <img
                      src={GNM_LOGO}
                      alt="Logo Perumahan GNM"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="text-left">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight uppercase leading-tight">
                        {currentMerchant}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono leading-tight">
                        NMID: {currentNmid} • {currentTerminal}
                      </p>
                    </div>
                  </div>

                  {/* QR Code Container with Center Logo */}
                  <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200 inline-block relative my-1">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="QRIS Pembayaran Iuran"
                        className="w-56 h-56 mx-auto object-contain"
                      />
                    ) : (
                      <div className="w-56 h-56 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                        Memuat QR Code...
                      </div>
                    )}
                  </div>

                  {/* Amount Breakdown */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                      Total Tagihan Iuran:
                    </p>
                    <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      {activeWarga.nama} • {bulanPeriode}
                    </p>
                  </div>

                  {/* Supported Wallets / Banks Footer */}
                  <div className="mt-3 pt-2 text-[9px] text-slate-400 font-medium">
                    BCA • Mandiri • BRI • BNI • BSI • GoPay • OVO • DANA • ShopeePay
                  </div>
                </div>

                {/* QR Quick Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={handleDownloadQr}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Gambar QR</span>
                  </button>

                  <button
                    onClick={handleShareWA}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kirim Tagihan ke WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL BANK TRANSFER */}
            {activeSubTab === 'transfer' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  {activeBankList.length > 0 ? (
                    activeBankList.map((bank, idx) => (
                      <React.Fragment key={bank.id}>
                        {idx > 0 && <hr className="border-slate-200" />}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{bank.namaBank}</span>
                              {bank.keterangan && (
                                <span className="text-[10px] font-normal text-slate-500">
                                  ({bank.keterangan})
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-mono font-extrabold text-blue-900 mt-0.5">
                              {bank.nomorRekening}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              a.n {bank.atasNama}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleCopyRekening(bank.id, bank.nomorRekening.replace(/[^0-9]/g, ''))
                            }
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1 transition cursor-pointer"
                          >
                            {copiedBank === bank.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin No Rek</span>
                              </>
                            )}
                          </button>
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-500">
                      Belum ada rekening bank aktif. Admin dapat menambahkannya di Pengaturan.
                    </div>
                  )}
                </div>

                {/* Upload proof simulator */}
                <div className="p-3.5 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl text-center bg-white transition cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedProofName(e.target.files[0].name);
                      }
                    }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center space-y-1"
                  >
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {uploadedProofName
                        ? `Bukti Terpilih: ${uploadedProofName}`
                        : 'Unggah Bukti Struk / Screenshot Pembayaran'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      JPG, PNG atau screenshot M-Banking
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Confirmation Action */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Total: <strong className="text-emerald-700 text-sm">Rp {totalAmount.toLocaleString('id-ID')}</strong>
              </div>

              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Memverifikasi QRIS...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Konfirmasi Pembayaran QR Lunas</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
