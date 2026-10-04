/**
 * ============================================================================
 * SISTEM INFORMASI PAGUYUBAN & RT DIGITAL
 * Perumahan Graha Nuansa Mundu (GNM) - Cirebon
 * File: Code.gs (Google Apps Script Controller)
 * ============================================================================
 * 
 * CARA MENGGUNAKAN DI GOOGLE APPS SCRIPT:
 * 1. Buka Google Drive -> Buat "Google Apps Script" baru (atau buka https://script.google.com).
 * 2. Beri nama proyek: "RT Digital Graha Nuansa Mundu".
 * 3. Hapus isi default di file "Code.gs", lalu salin & tempel seluruh isi file ini (Code.gs).
 * 4. Buat file HTML baru di editor Apps Script:
 *    - Klik tanda (+) di samping Files -> Pilih "HTML".
 *    - Beri nama persis: "Index" (tanpa ekstensi .html, otomatis jadi Index.html).
 *    - Tempel seluruh isi file Index.html yang sudah digenerate.
 * 5. (Opsional) Jika ingin data tersimpan otomatis di Google Sheets:
 *    - Buat Google Spreadsheet baru di Google Drive Anda.
 *    - Salin ID Spreadsheet dari URL (karakter antara /d/ dan /edit).
 *    - Masukkan ID tersebut ke variabel SPREADSHEET_ID di bawah ini.
 *    - Jalankan fungsi `setupSpreadsheet()` sekali untuk membuat struktur kolom sheet otomatis.
 * 6. Klik tombol "Deploy" (Terapkan) di kanan atas:
 *    - Pilih "New deployment" (Penerapan baru).
 *    - Klik icon roda gigi (Select type) -> Pilih "Web app" (Aplikasi Web).
 *    - Description: "Versi 1.0 Web App RT Digital".
 *    - Execute as: "Me (email Anda)".
 *    - Who has access: "Anyone" (Siapa saja).
 *    - Klik "Deploy", izinkan akses izin (Review permissions / Advanced -> Go to ... (unsafe)).
 *    - Salin URL Web App yang dihasilkan. Siap dibuka di HP/Laptop warga & pengurus!
 * ============================================================================
 */

// Masukkan ID Spreadsheet Anda di sini jika ingin integrasi Google Sheets
// Contoh: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
// Kosongkan "" jika ingin mengandalkan penyimpanan offline/browser LocalStorage
var SPREADSHEET_ID = "";

/**
 * Handler HTTP GET: Menampilkan antarmuka Web App React
 */
function doGet(e) {
  var htmlOutput = HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('PERUMAHAN GNM - Graha Nuansa Mundu | Sistem RT Digital')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
  return htmlOutput;
}

/**
 * Handler HTTP POST: Menerima data sinkronisasi jika diakses melalui Webhook/API
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'save';
    
    if (action === 'save') {
      var result = saveSpreadsheetData(JSON.stringify(data.payload));
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'get') {
      var result = getSpreadsheetData();
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'unknown_action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Mengambil data dari Google Sheets (Warga, Kas, Pengumuman, Settings)
 */
function getSpreadsheetData() {
  if (!SPREADSHEET_ID) {
    return { status: "local_storage_only", message: "SPREADSHEET_ID belum diisi. Menggunakan browser storage." };
  }
  
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return {
      status: "success",
      warga: getSheetDataAsJson(ss, "Warga"),
      kas: getSheetDataAsJson(ss, "Kas"),
      pengumuman: getSheetDataAsJson(ss, "Pengumuman"),
      settings: getSheetDataAsJson(ss, "Settings")
    };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

/**
 * Menyimpan data payload ke Google Sheets
 */
function saveSpreadsheetData(payloadJson) {
  if (!SPREADSHEET_ID) {
    return { status: "local_storage_only", message: "SPREADSHEET_ID belum diisi. Tersimpan di browser." };
  }
  
  try {
    var payload = typeof payloadJson === 'string' ? JSON.parse(payloadJson) : payloadJson;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (payload.warga && Array.isArray(payload.warga)) {
      saveJsonToSheet(ss, "Warga", payload.warga);
    }
    if (payload.kas && Array.isArray(payload.kas)) {
      saveJsonToSheet(ss, "Kas", payload.kas);
    }
    if (payload.pengumuman && Array.isArray(payload.pengumuman)) {
      saveJsonToSheet(ss, "Pengumuman", payload.pengumuman);
    }
    if (payload.settings) {
      saveJsonToSheet(ss, "Settings", [payload.settings]);
    }
    
    return { status: "success", timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

/**
 * Helper untuk membaca sheet menjadi format JSON Array
 */
function getSheetDataAsJson(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

/**
 * Helper untuk menyimpan JSON Array ke Sheet
 */
function saveJsonToSheet(ss, sheetName, dataArray) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clearContents();
  }
  
  if (!dataArray || dataArray.length === 0) return;
  
  var headers = Object.keys(dataArray[0]);
  var rows = [headers];
  
  for (var i = 0; i < dataArray.length; i++) {
    var item = dataArray[i];
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      var val = item[headers[j]];
      row.push(typeof val === 'object' ? JSON.stringify(val) : val);
    }
    rows.push(row);
  }
  
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  
  // Format header row
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#059669')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
}

/**
 * FUNGSI SETUP OTOMATIS:
 * Jalankan fungsi ini sekali dari Script Editor (pilih setupSpreadsheet lalu klik Run)
 * untuk membuat lembar kerja (sheets) dan kolom-kolom yang diperlukan secara otomatis.
 */
function setupSpreadsheet() {
  if (!SPREADSHEET_ID) {
    Logger.log("ERROR: Silakan masukkan SPREADSHEET_ID terlebih dahulu di baris 32!");
    return;
  }
  
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 1. Sheet Warga
  var sheetWarga = ss.getSheetByName("Warga") || ss.insertSheet("Warga");
  if (sheetWarga.getLastRow() === 0) {
    sheetWarga.appendRow(["id", "nama", "nik", "blok", "noRumah", "statusRumah", "pekerjaan", "hp", "iuranLunas", "tglMasuk"]);
    sheetWarga.getRange("A1:J1").setBackground("#059669").setFontColor("#FFFFFF").setFontWeight("bold");
  }
  
  // 2. Sheet Kas
  var sheetKas = ss.getSheetByName("Kas") || ss.insertSheet("Kas");
  if (sheetKas.getLastRow() === 0) {
    sheetKas.appendRow(["id", "tanggal", "jenis", "kategori", "nominal", "desc", "pj"]);
    sheetKas.getRange("A1:G1").setBackground("#0284C7").setFontColor("#FFFFFF").setFontWeight("bold");
  }
  
  // 3. Sheet Pengumuman
  var sheetPengumuman = ss.getSheetByName("Pengumuman") || ss.insertSheet("Pengumuman");
  if (sheetPengumuman.getLastRow() === 0) {
    sheetPengumuman.appendRow(["id", "judul", "tanggal", "kategori", "isi", "lokasi", "pj"]);
    sheetPengumuman.getRange("A1:G1").setBackground("#7C3AED").setFontColor("#FFFFFF").setFontWeight("bold");
  }
  
  // 4. Sheet Settings
  var sheetSettings = ss.getSheetByName("Settings") || ss.insertSheet("Settings");
  if (sheetSettings.getLastRow() === 0) {
    sheetSettings.appendRow(["namaKetuaPaguyuban", "kontakKetua", "nominalIuranPerBulan", "kontakPosSatpam", "namaPosSatpam", "qrId", "merchantName", "adminPin"]);
    sheetSettings.getRange("A1:H1").setBackground("#D97706").setFontColor("#FFFFFF").setFontWeight("bold");
  }
  
  Logger.log("Setup spreadsheet berhasil! Semua sheet siap digunakan.");
}
