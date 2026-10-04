/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { WargaView } from './components/WargaView';
import { KasView } from './components/KasView';
import { PengumumanView } from './components/PengumumanView';

// Modals
import { WargaModal } from './components/Modals/WargaModal';
import { WargaDetailModal } from './components/Modals/WargaDetailModal';
import { KasModal } from './components/Modals/KasModal';
import { PengumumanModal } from './components/Modals/PengumumanModal';
import { SosModal } from './components/Modals/SosModal';
import { QrPaymentModal } from './components/Modals/QrPaymentModal';
import { KuitansiModal } from './components/Modals/KuitansiModal';
import { PaymentSettingsModal } from './components/Modals/PaymentSettingsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { GNM_LOGO } from './assets/logo';

// Initial Data & Types
import {
  initialWarga,
  initialKas,
  initialPengumuman,
  initialPaymentSettings,
} from './data/initialData';
import {
  Warga,
  KasItem,
  PengumumanItem,
  PaymentSettings,
  UserRole,
} from './types';

export default function App() {
  // --- Persistent State ---
  const [warga, setWarga] = useState<Warga[]>(() => {
    const saved = localStorage.getItem('rt_digital_warga_gnm');
    return saved ? JSON.parse(saved) : initialWarga;
  });

  const [kas, setKas] = useState<KasItem[]>(() => {
    const saved = localStorage.getItem('rt_digital_kas_gnm');
    return saved ? JSON.parse(saved) : initialKas;
  });

  const [pengumuman, setPengumuman] = useState<PengumumanItem[]>(() => {
    const saved = localStorage.getItem('rt_digital_pengumuman_gnm');
    return saved ? JSON.parse(saved) : initialPengumuman;
  });

  // --- Payment & Bank Settings (Admin Configurable) ---
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('rt_digital_payment_settings_gnm');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialPaymentSettings,
          ...parsed,
          namaKetuaPaguyuban:
            parsed.namaKetuaPaguyuban || initialPaymentSettings.namaKetuaPaguyuban,
          kontakPosSatpam:
            parsed.kontakPosSatpam || initialPaymentSettings.kontakPosSatpam,
          namaPosSatpam:
            parsed.namaPosSatpam || initialPaymentSettings.namaPosSatpam,
          nominalIuranPerBulan:
            Number(parsed.nominalIuranPerBulan) || initialPaymentSettings.nominalIuranPerBulan,
        };
      } catch {
        return initialPaymentSettings;
      }
    }
    return initialPaymentSettings;
  });

  // --- User Role (Admin vs Warga) ---
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('rt_digital_user_role_gnm');
    return saved === 'warga' || saved === 'admin' ? saved : 'admin';
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('rt_digital_warga_gnm', JSON.stringify(warga));
  }, [warga]);

  useEffect(() => {
    localStorage.setItem('rt_digital_kas_gnm', JSON.stringify(kas));
  }, [kas]);

  useEffect(() => {
    localStorage.setItem('rt_digital_pengumuman_gnm', JSON.stringify(pengumuman));
  }, [pengumuman]);

  useEffect(() => {
    localStorage.setItem(
      'rt_digital_payment_settings_gnm',
      JSON.stringify(paymentSettings)
    );
  }, [paymentSettings]);

  useEffect(() => {
    localStorage.setItem('rt_digital_user_role_gnm', userRole);
  }, [userRole]);

  // --- Active Tab Navigation ---
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // --- Modal States ---
  const [isWargaModalOpen, setIsWargaModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedWargaDetail, setSelectedWargaDetail] = useState<Warga | null>(null);

  const [isKasModalOpen, setIsKasModalOpen] = useState(false);
  const [isPengumumanModalOpen, setIsPengumumanModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // --- QR Payment, Kuitansi & Settings Modal State ---
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrWarga, setSelectedQrWarga] = useState<Warga | null>(null);
  const [isKuitansiModalOpen, setIsKuitansiModalOpen] = useState(false);
  const [isPaymentSettingsModalOpen, setIsPaymentSettingsModalOpen] = useState(false);
  const [kuitansiData, setKuitansiData] = useState<{
    warga: Warga;
    amount: number;
    bulan: string;
    metode: string;
    kuitansiNo: string;
    tanggal?: string;
  } | null>(null);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Payment Settings Actions ---
  const handleSavePaymentSettings = (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);

    // Sync Ketua Paguyuban name & phone to warga record with jabatan 'Ketua Pengurus' or 'Ketua RT'
    setWarga((prev) =>
      prev.map((w) => {
        if (newSettings.namaKetuaPaguyuban && (w.jabatan === 'Ketua Pengurus' || w.jabatan === 'Ketua RT')) {
          return {
            ...w,
            nama: newSettings.namaKetuaPaguyuban,
            hp: newSettings.kontakKetua || w.hp,
          };
        }
        if (newSettings.kontakPosSatpam && w.jabatan === 'Keamanan') {
          return {
            ...w,
            hp: newSettings.kontakPosSatpam,
          };
        }
        return w;
      })
    );

    addToast(
      `Pengaturan disimpan! Ketua: ${newSettings.namaKetuaPaguyuban} • Pos Satpam: ${newSettings.kontakPosSatpam || '081233445566'}`,
      'success'
    );
  };

  const handleResetPaymentSettings = () => {
    setPaymentSettings(initialPaymentSettings);
    localStorage.removeItem('rt_digital_payment_settings_gnm');
    addToast('Pengaturan QRIS & Rekening Bank dikembalikan ke default.', 'info');
  };

  const handleToggleRole = () => {
    if (userRole === 'admin') {
      setUserRole('warga');
      addToast(
        'Beralih ke Mode Warga. Pengubahan QR dan Rekening Bank dikunci.',
        'info'
      );
    } else {
      setIsPaymentSettingsModalOpen(true);
    }
  };

  // --- Reset to default seed ---
  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan semua data ke pengaturan awal Perumahan Graha Nuansa Mundu? Data kustom akan tereset.'
      )
    ) {
      setWarga(initialWarga);
      setKas(initialKas);
      setPengumuman(initialPengumuman);
      setPaymentSettings(initialPaymentSettings);
      localStorage.removeItem('rt_digital_warga_gnm');
      localStorage.removeItem('rt_digital_kas_gnm');
      localStorage.removeItem('rt_digital_pengumuman_gnm');
      localStorage.removeItem('rt_digital_payment_settings_gnm');
      addToast('Data sistem Graha Nuansa Mundu berhasil dikembalikan ke default.', 'info');
    }
  };

  // --- Warga Actions ---
  const handleSaveWarga = (data: Omit<Warga, 'id'>, id?: number) => {
    if (id) {
      // Edit
      setWarga((prev) =>
        prev.map((w) => (w.id === id ? { ...data, id } : w))
      );
      addToast(`Data warga "${data.nama}" berhasil diperbarui.`);
    } else {
      // Create
      const newId = warga.length > 0 ? Math.max(...warga.map((w) => w.id)) + 1 : 1;
      setWarga((prev) => [{ ...data, id: newId }, ...prev]);
      addToast(`Warga baru "${data.nama}" berhasil didaftarkan ke Graha Nuansa Mundu.`);
    }
  };

  const handleDeleteWarga = (id: number) => {
    const target = warga.find((w) => w.id === id);
    if (!target) return;
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus data warga "${target.nama}"?`
      )
    ) {
      setWarga((prev) => prev.filter((w) => w.id !== id));
      addToast(`Data warga "${target.nama}" telah dihapus.`, 'info');
    }
  };

  // --- Kas Actions ---
  const handleSaveKas = (item: {
    tanggal: string;
    desc: string;
    kategori: any;
    jenis: any;
    amount: number;
    pj?: string;
  }) => {
    const newId = kas.length > 0 ? Math.max(...kas.map((k) => k.id)) + 1 : 1;
    setKas((prev) => [{ ...item, id: newId }, ...prev]);
    addToast(
      `Transaksi ${item.jenis} sebesar Rp ${item.amount.toLocaleString(
        'id-ID'
      )} dicatat ke Kas.`
    );
  };

  const handleDeleteKas = (id: number) => {
    setKas((prev) => prev.filter((k) => k.id !== id));
    addToast('Transaksi kas berhasil dihapus.', 'info');
  };

  // --- Open QR Payment Modal ---
  const handleOpenQrPayment = (targetWarga?: Warga) => {
    setSelectedQrWarga(targetWarga || (warga.length > 0 ? warga[0] : null));
    setIsQrModalOpen(true);
  };

  // --- Handle QR Payment Completion ---
  const handlePaymentSuccess = (details: {
    warga: Warga;
    amount: number;
    bulan: string;
    metode: string;
    kuitansiNo: string;
  }) => {
    // 1. Update warga payment status
    setWarga((prev) =>
      prev.map((w) => (w.id === details.warga.id ? { ...w, iuranLunas: true } : w))
    );

    // 2. Automatically log to Kas
    const newKasId = kas.length > 0 ? Math.max(...kas.map((k) => k.id)) + 1 : 1;
    const newKasItem: KasItem = {
      id: newKasId,
      tanggal: new Date().toISOString().slice(0, 10),
      desc: `Pembayaran QRIS Iuran - ${details.warga.nama} (${details.bulan})`,
      kategori: 'Iuran Warga',
      jenis: 'Pemasukan',
      amount: details.amount,
      pj: 'Sistem QRIS Kas',
    };
    setKas((prevKas) => [newKasItem, ...prevKas]);

    // 3. Set kuitansi data
    setKuitansiData({
      warga: details.warga,
      amount: details.amount,
      bulan: details.bulan,
      metode: details.metode,
      kuitansiNo: details.kuitansiNo,
    });

    addToast(
      `Pembayaran QRIS ${details.warga.nama} sebesar Rp ${details.amount.toLocaleString(
        'id-ID'
      )} diverifikasi lunas!`,
      'success'
    );
  };

  // --- Toggle Iuran with auto-Kas sync ---
  const handleToggleIuran = (wargaId: number) => {
    setWarga((prev) =>
      prev.map((w) => {
        if (w.id === wargaId) {
          const nextStatus = !w.iuranLunas;
          if (nextStatus) {
            // Automatically log income to Kas
            const nominalIuran = paymentSettings.nominalIuranPerBulan || 50000;
            const newKasId =
              kas.length > 0 ? Math.max(...kas.map((k) => k.id)) + 1 : 1;
            const newKasItem: KasItem = {
              id: newKasId,
              tanggal: new Date().toISOString().slice(0, 10),
              desc: `Iuran Bulanan Tunai - ${w.nama} (${w.alamat})`,
              kategori: 'Iuran Warga',
              jenis: 'Pemasukan',
              amount: nominalIuran,
              pj: 'Bendahara Ahmad',
            };
            setKas((prevKas) => [newKasItem, ...prevKas]);
            addToast(
              `Iuran ${w.nama} lunas! Rp ${nominalIuran.toLocaleString('id-ID')} otomatis masuk ke Jurnal Kas.`
            );
          } else {
            addToast(`Status iuran ${w.nama} diubah menjadi belum lunas.`, 'info');
          }
          return { ...w, iuranLunas: nextStatus };
        }
        return w;
      })
    );
  };

  // --- Pengumuman Actions ---
  const handleSavePengumuman = (data: {
    judul: string;
    kategori: any;
    isi: string;
    lokasi?: string;
    tanggal: string;
  }) => {
    const newId =
      pengumuman.length > 0 ? Math.max(...pengumuman.map((p) => p.id)) + 1 : 1;
    setPengumuman((prev) => [{ ...data, id: newId }, ...prev]);
    addToast(`Pengumuman "${data.judul}" berhasil dipublikasikan.`);
  };

  const handleDeletePengumuman = (id: number) => {
    setPengumuman((prev) => prev.filter((p) => p.id !== id));
    addToast('Pengumuman telah dihapus.', 'info');
  };

  // Balance calculation for badges
  const totalMasuk = kas
    .filter((k) => k.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalKeluar = kas
    .filter((k) => k.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const saldoKas = totalMasuk - totalKeluar;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSos={() => setIsSosModalOpen(true)}
        onResetData={handleResetData}
        onOpenPaymentSettings={() => setIsPaymentSettingsModalOpen(true)}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        namaKetua={paymentSettings.namaKetuaPaguyuban}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <Navigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          wargaCount={warga.length}
          saldoKas={saldoKas}
          pengumumanCount={pengumuman.length}
        />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            warga={warga}
            kas={kas}
            pengumuman={pengumuman}
            onNavigate={setActiveTab}
            onOpenAddWarga={() => {
              setEditingWarga(null);
              setIsWargaModalOpen(true);
            }}
            onOpenAddKas={() => setIsKasModalOpen(true)}
            onOpenAddPengumuman={() => setIsPengumumanModalOpen(true)}
            onOpenQrPayment={handleOpenQrPayment}
          />
        )}

        {activeTab === 'warga' && (
          <WargaView
            warga={warga}
            onOpenAdd={() => {
              setEditingWarga(null);
              setIsWargaModalOpen(true);
            }}
            onOpenEdit={(w) => {
              setEditingWarga(w);
              setIsWargaModalOpen(true);
            }}
            onOpenDetail={(w) => {
              setSelectedWargaDetail(w);
              setIsDetailModalOpen(true);
            }}
            onDelete={handleDeleteWarga}
            onOpenQrPayment={handleOpenQrPayment}
          />
        )}

        {activeTab === 'kas' && (
          <KasView
            kas={kas}
            warga={warga}
            onOpenAddKas={() => setIsKasModalOpen(true)}
            onDeleteKas={handleDeleteKas}
            onToggleIuran={handleToggleIuran}
            onOpenQrPayment={handleOpenQrPayment}
            onOpenPaymentSettings={() => setIsPaymentSettingsModalOpen(true)}
            userRole={userRole}
            paymentSettings={paymentSettings}
          />
        )}

        {activeTab === 'pengumuman' && (
          <PengumumanView
            pengumuman={pengumuman}
            onOpenAddPengumuman={() => setIsPengumumanModalOpen(true)}
            onDeletePengumuman={handleDeletePengumuman}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <img
              src={GNM_LOGO}
              alt="Logo Perumahan GNM"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-md object-cover border border-slate-200 shadow-xs"
            />
            <span className="font-extrabold text-slate-800">
              PERUMAHAN GNM • GRAHA NUANSA MUNDU
            </span>
            <span>•</span>
            <span>Kec. Mundu, Kab. Cirebon, Jawa Barat</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              Didukung Pembayaran Digital QRIS GPN & Transparansi Kas Terbuka
            </span>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <WargaModal
        isOpen={isWargaModalOpen}
        editingWarga={editingWarga}
        onClose={() => {
          setIsWargaModalOpen(false);
          setEditingWarga(null);
        }}
        onSave={handleSaveWarga}
      />

      <WargaDetailModal
        warga={selectedWargaDetail}
        allWarga={warga}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedWargaDetail(null);
        }}
        onEdit={(w) => {
          setEditingWarga(w);
          setIsWargaModalOpen(true);
        }}
        onOpenQrPayment={handleOpenQrPayment}
      />

      <KasModal
        isOpen={isKasModalOpen}
        onClose={() => setIsKasModalOpen(false)}
        onSave={handleSaveKas}
      />

      <PengumumanModal
        isOpen={isPengumumanModalOpen}
        onClose={() => setIsPengumumanModalOpen(false)}
        onSave={handleSavePengumuman}
      />

      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        kontakPosSatpam={paymentSettings.kontakPosSatpam}
        namaPosSatpam={paymentSettings.namaPosSatpam}
      />

      {/* QRIS Payment Modal */}
      <QrPaymentModal
        isOpen={isQrModalOpen}
        selectedWarga={selectedQrWarga}
        wargaList={warga}
        onClose={() => {
          setIsQrModalOpen(false);
          setSelectedQrWarga(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenKuitansi={() => setIsKuitansiModalOpen(true)}
        paymentSettings={paymentSettings}
        onOpenSettings={() => setIsPaymentSettingsModalOpen(true)}
        userRole={userRole}
      />

      {/* Payment & Bank Settings Modal (Admin Protected) */}
      <PaymentSettingsModal
        isOpen={isPaymentSettingsModalOpen}
        onClose={() => setIsPaymentSettingsModalOpen(false)}
        settings={paymentSettings}
        onSaveSettings={handleSavePaymentSettings}
        onResetSettings={handleResetPaymentSettings}
        userRole={userRole}
        onSwitchRole={(role) => {
          setUserRole(role);
          if (role === 'admin') {
            addToast('Hak akses Admin / Pengurus berhasil diaktifkan.', 'success');
          }
        }}
      />

      {/* Digital Receipt Modal */}
      <KuitansiModal
        isOpen={isKuitansiModalOpen}
        kuitansiData={kuitansiData}
        onClose={() => {
          setIsKuitansiModalOpen(false);
          setKuitansiData(null);
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
