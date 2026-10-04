# Petunjuk Penerapan ke Google Apps Script (Web App)

Aplikasi **RT Digital - Perumahan Graha Nuansa Mundu** telah disiapkan agar dapat dijalankan langsung sebagai **Google Apps Script Web App** secara gratis dan dapat diakses siapa saja melalui link web Apps Script.

---

## File yang Disediakan
1. **`Code.gs`**: Kode backend controller Google Apps Script (fungsi `doGet`, `doPost`, dan sinkronisasi opsional ke Google Sheets).
2. **`Index.html`**: File tunggal mandiri (single-file bundle) yang berisi seluruh antarmuka React, Tailwind CSS, icon Lucide, generator QRIS & kuitansi, simulator tombol darurat SOS, dan seluruh fitur RT Digital dengan logo terintegrasi.

---

## Langkah-langkah Pasang di Google Apps Script:

### 1. Buat Proyek Google Apps Script Baru
1. Buka [https://script.google.com](https://script.google.com) di browser Anda.
2. Klik tombol **"New project"** (Proyek baru) di pojok kiri atas.
3. Beri judul proyek di bagian kiri atas, misalnya: **`RT Digital Graha Nuansa Mundu`**.

### 2. Masukkan Kode `Code.gs`
1. Buka file `Code.gs` default yang ada di editor.
2. Hapus seluruh isi default-nya.
3. Buka file `google-apps-script/Code.gs` dan salin (copy) seluruh kodenya, lalu tempel (paste) ke editor `Code.gs`.
4. Klik tombol **Save** (ikon disket) atau tekan `Ctrl + S`.

### 3. Buat File `Index.html`
1. Di panel kiri menu **Files**, klik tombol tambah **(+)** lalu pilih **HTML**.
2. Beri nama file persis: **`Index`** (jangan ketik `.html`, sistem akan otomatis membuatnya menjadi `Index.html`).
3. Buka file `google-apps-script/Index.html` dan salin seluruh isinya, lalu tempel ke dalam file `Index.html` di Apps Script.
4. Klik tombol **Save** (ikon disket).

### 4. (Opsional) Menghubungkan Google Sheets
Jika Anda ingin data warga, kas, dan pengaturan tersinkronisasi otomatis ke Google Spreadsheet:
1. Buat file Google Spreadsheet baru di Google Drive Anda.
2. Salin **Spreadsheet ID** dari URL browser:
   `https://docs.google.com/spreadsheets/d/`**`[ID_SPREADSHEET_ANDA]`**`/edit`
3. Masukkan ID tersebut ke dalam variabel `SPREADSHEET_ID` di baris 32 file `Code.gs`:
   ```javascript
   var SPREADSHEET_ID = "ID_SPREADSHEET_ANDA";
   ```
4. Di dropdown fungsi bagian atas editor, pilih `setupSpreadsheet` lalu klik **Run** untuk membuat format sheet secara otomatis.

*(Catatan: Tanpa Google Sheets pun aplikasi tetap berfungsi penuh menggunakan LocalStorage di HP/komputer pengguna).*

### 5. Deploy Sebagai Web App
1. Klik tombol **Deploy** (Terapkan) berwarna biru di pojok kanan atas.
2. Pilih **New deployment** (Penerapan baru).
3. Klik ikon gerigi (roda gigi) di samping *Select type* -> pilih **Web app**.
4. Isi konfigurasi berikut:
   - **Description**: `Web App RT Digital Graha Nuansa Mundu v1.0`
   - **Execute as**: `Me` (email Anda)
   - **Who has access**: `Anyone` (Siapa saja)
5. Klik tombol **Deploy**.
6. Google akan meminta izin akses pertama kali:
   - Klik **Review Permissions**.
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) di kiri bawah -> klik **Go to RT Digital Graha Nuansa Mundu (unsafe)**.
   - Klik **Allow** (Izinkan).
7. Salin **Web app URL** yang muncul (contoh: `https://script.google.com/macros/s/.../exec`).
8. Bagikan link tersebut kepada warga dan pengurus perumahan. Web app siap digunakan!
