export type WargaStatus = 'Tetap' | 'Kontrak';
export type WargaJabatan = 'Ketua Pengurus' | 'Ketua RT' | 'Sekretaris' | 'Bendahara' | 'Keamanan' | 'Warga';

export interface Warga {
  id: number;
  nama: string;
  nik: string;
  kk: string;
  alamat: string;
  hp: string;
  status: WargaStatus;
  jabatan: WargaJabatan;
  iuranLunas: boolean;
  jenisKelamin?: 'Laki-laki' | 'Perempuan';
  agama?: string;
  pekerjaan?: string;
}

export type KasJenis = 'Pemasukan' | 'Pengeluaran';
export type KasKategori =
  | 'Iuran Warga'
  | 'Keamanan'
  | 'Kebersihan'
  | 'Sosial'
  | 'Infrastruktur'
  | 'Lainnya';

export interface KasItem {
  id: number;
  tanggal: string;
  desc: string;
  kategori: KasKategori;
  jenis: KasJenis;
  amount: number;
  pj?: string;
}

export type PengumumanKategori =
  | 'Kegiatan / Agenda'
  | 'Penting / Urgen'
  | 'Info Umum'
  | 'Kerja Bakti'
  | 'Keamanan';

export interface PengumumanItem {
  id: number;
  judul: string;
  kategori: PengumumanKategori;
  tanggal: string;
  isi: string;
  lokasi?: string;
}

export type UserRole = 'admin' | 'warga';

export interface BankAccount {
  id: string;
  namaBank: string;
  nomorRekening: string;
  atasNama: string;
  keterangan?: string;
  isActive: boolean;
}

export interface PaymentSettings {
  namaKetuaPaguyuban: string; // e.g. "Bambang Setiawan"
  kontakKetua?: string; // e.g. "081298765432"
  kontakPosSatpam?: string; // e.g. "081233445566"
  namaPosSatpam?: string; // e.g. "Pos Satpam"
  nominalIuranPerBulan: number; // e.g. 50000
  qrId: string; // NMID QRIS e.g. ID1020260409001
  merchantName: string; // e.g. KAS PERUMAHAN GNM
  terminalId?: string; // e.g. A01
  kota?: string; // e.g. CIREBON
  kodePos?: string; // e.g. 45173
  bankAccounts: BankAccount[];
  adminPin: string; // default "1234"
}
