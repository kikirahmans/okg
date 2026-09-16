import { ObservationData, SheetConfig } from '../types';
import { INDICATORS } from '../data/indicators';

const STORAGE_KEY_CONFIG = 'pmm_sheets_config_v1';
const STORAGE_KEY_RECORDS = 'pmm_observation_records_v1';
const STORAGE_KEY_DELETED_IDS = 'pmm_deleted_record_ids_v1';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx4qNLcx9rF19U6ZGeJ-w_YWQl_nLqWFrmDx8H87GsOb6-nfJcSV0__5ZntKG5BBhDrKQ/exec';

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  scriptUrl: DEFAULT_APPS_SCRIPT_URL,
  spreadsheetId: '',
  spreadsheetUrl: '',
  autoSync: true,
  syncIntervalSeconds: 15,
  soundEnabled: true,
  browserNotificationEnabled: false,
  lastSyncTime: undefined
};

// Google Apps Script code template for users to paste into Extensions > Apps Script
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * SKRIP GOOGLE SPREADSHEET — OBSERVASI KINERJA GURU (PMM SKP)
 * Pasang di Google Spreadsheet: Ekstensi > Apps Script > Tempel Kode Ini > Terapkan sebagai Aplikasi Web (Web App)
 * Akses: "Siapa saja" (Anyone)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Data Observasi") || ss.getActiveSheet();
    
    // Buat header jika sheet masih baru/kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID Observasi",
        "Waktu Input",
        "Nama Guru (Observee)",
        "Observer / KS",
        "Mata Pelajaran / Kelas",
        "Sekolah / Tempat",
        "Periode",
        "Tanggal Observasi",
        "Indikator Dipilih",
        "Skor Efektif (%)",
        "Efektif",
        "Belum Efektif",
        "Upaya Belajar (Form A)",
        "Perangkat Ajar",
        "Hasil Kerja",
        "Catatan Observer (Form B)",
        "Rekomendasi (Form B)",
        "Kategori Kesadaran (Form C)",
        "Upaya Tindak Lanjut (Form C)",
        "Jadwal TL",
        "Kebutuhan Dukungan",
        "Catatan KS (Form C)",
        "Kategori TL (Form D)",
        "Capaian (Form D)",
        "Tantangan (Form D)",
        "Upaya Peningkatan (Form D)",
        "Kesadaran Pasca TL (Form D)",
        "Data Mentah JSON"
      ]);
      
      // Styling header baris pertama
      var headerRange = sheet.getRange(1, 1, 1, 28);
      headerRange.setBackground("#1B2A41").setFontColor("#FFFFFF").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // Periksa apakah tindakan adalah menghapus data (DELETE)
    if (data.action === "delete") {
      var rows = sheet.getDataRange().getValues();
      var deleted = false;
      for (var d = 1; d < rows.length; d++) {
        if (rows[d][0] === data.id) {
          sheet.deleteRow(d + 1);
          deleted = true;
          break;
        }
      }
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          id: data.id,
          action: "deleted",
          found: deleted,
          totalRows: sheet.getLastRow()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Periksa apakah ID sudah pernah ada untuk update atau baris baru
    var rows = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    var rowData = [
      data.id,
      new Date().toLocaleString("id-ID", {timeZone: "Asia/Jakarta"}),
      data.guru,
      data.kepsek,
      data.kelas,
      data.tempat,
      data.periode,
      data.tanggal,
      data.indikatorText || "",
      (data.persentaseEfektif || 0) + "%",
      data.efektifCount || 0,
      data.belumEfektifCount || 0,
      data.upayaBelajar || "",
      data.perangkatAjar || "",
      data.hasilKerja || "",
      data.catatanObs || "",
      data.rekomendasi || "",
      data.kategoriKesadaranC || "",
      data.upayaTL || "",
      data.kapanTL || "",
      data.dukunganTL || "",
      data.catatanKepsekC || "",
      data.kategoriTLD || "",
      data.capaianD || "",
      data.tantanganD || "",
      data.upayaPeningkatanD || "",
      data.kesadaranD || "",
      JSON.stringify(data)
    ];
    
    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        id: data.id,
        guru: data.guru,
        action: rowIndex > 0 ? "updated" : "created",
        totalRows: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Data Observasi") || ss.getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    var list = [];
    // Baris 0 adalah header, mulai dari baris 1
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (!row[0]) continue;
      // Kolom 27 (indeks ke-27) menyimpan JSON data mentah
      var rawJson = row[27];
      if (rawJson && typeof rawJson === "string" && rawJson.startsWith("{")) {
        try {
          list.push(JSON.parse(rawJson));
        } catch (e) {
          list.push({ id: row[0], guru: row[2], kelas: row[4], persentaseEfektif: parseInt(row[9]) || 0 });
        }
      } else {
        list.push({
          id: row[0],
          guru: row[2],
          kepsek: row[3],
          kelas: row[4],
          tempat: row[5],
          periode: row[6],
          tanggal: row[7],
          persentaseEfektif: parseInt(row[9]) || 0,
          catatanObs: row[15],
          rekomendasi: row[16]
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        sheetName: sheet.getName(),
        spreadsheetTitle: ss.getName(),
        total: list.length,
        data: list
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export function getStoredConfig(): SheetConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SHEET_CONFIG,
        ...parsed,
        scriptUrl: parsed.scriptUrl && parsed.scriptUrl.trim().length > 0
          ? parsed.scriptUrl.trim()
          : DEFAULT_APPS_SCRIPT_URL
      };
    }
  } catch (e) {
    console.error('Error reading sheet config from localStorage:', e);
  }
  return DEFAULT_SHEET_CONFIG;
}

export function saveStoredConfig(config: SheetConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving sheet config to localStorage:', e);
  }
}

export function normalizeObservationRecord(raw: any): ObservationData {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      guru: '',
      kepsek: '',
      kelas: '',
      tempat: '',
      periode: 'Januari - Juni 2026',
      tanggal: new Date().toISOString().slice(0, 10),
      pickedIndicators: [],
      upayaBelajar: '',
      hariObs: new Date().toISOString().slice(0, 10),
      waktuObs: '',
      perangkatAjar: '',
      hasilKerja: '',
      catatanLain: '',
      ratings: {},
      catatanObs: '',
      rekomendasi: '',
      kategoriKesadaranC: 'Sadar Kesulitan',
      pertanyaanC: '',
      responC: '',
      catatanC: '',
      tujuanTL: '',
      upayaTL: '',
      kapanTL: '',
      dukunganTL: '',
      catatanKepsekC: '',
      kategoriTLD: 'Peningkatan Kinerja',
      capaianD: '',
      tantanganD: '',
      upayaPeningkatanD: '',
      kesadaranD: 'Sadar Dampak Kesulitan',
      pertanyaanD: '',
      responD: '',
      catatanKepsekD: '',
      totalPerilaku: 0,
      efektifCount: 0,
      belumEfektifCount: 0,
      belumDilakukanCount: 0,
      persentaseEfektif: 0,
      syncedToGoogleSheets: false
    };
  }

  // Ensure ratings is a valid object
  let ratingsObj = raw.ratings;
  if (!ratingsObj || typeof ratingsObj !== 'object' || Array.isArray(ratingsObj)) {
    ratingsObj = {};
  }

  // Ensure pickedIndicators is a valid number array
  let pickedIndicators = raw.pickedIndicators;
  if (!Array.isArray(pickedIndicators)) {
    pickedIndicators = [];
  } else {
    pickedIndicators = pickedIndicators.map(Number).filter((n: number) => !isNaN(n) && n > 0);
  }

  return {
    id: String(raw.id || `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`),
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
    guru: String(raw.guru || ''),
    kepsek: String(raw.kepsek || ''),
    kelas: String(raw.kelas || ''),
    tempat: String(raw.tempat || ''),
    periode: String(raw.periode || 'Januari - Juni 2026'),
    tanggal: String(raw.tanggal || new Date().toISOString().slice(0, 10)),
    pickedIndicators,
    upayaBelajar: String(raw.upayaBelajar || ''),
    hariObs: String(raw.hariObs || new Date().toISOString().slice(0, 10)),
    waktuObs: String(raw.waktuObs || ''),
    perangkatAjar: String(raw.perangkatAjar || ''),
    hasilKerja: String(raw.hasilKerja || ''),
    catatanLain: String(raw.catatanLain || ''),
    ratings: ratingsObj,
    catatanObs: String(raw.catatanObs || ''),
    rekomendasi: String(raw.rekomendasi || ''),
    kategoriKesadaranC: String(raw.kategoriKesadaranC || 'Sadar Kesulitan'),
    pertanyaanC: String(raw.pertanyaanC || ''),
    responC: String(raw.responC || ''),
    catatanC: String(raw.catatanC || ''),
    tujuanTL: String(raw.tujuanTL || ''),
    upayaTL: String(raw.upayaTL || ''),
    kapanTL: String(raw.kapanTL || ''),
    dukunganTL: String(raw.dukunganTL || ''),
    catatanKepsekC: String(raw.catatanKepsekC || ''),
    kategoriTLD: String(raw.kategoriTLD || 'Peningkatan Kinerja'),
    capaianD: String(raw.capaianD || ''),
    tantanganD: String(raw.tantanganD || ''),
    upayaPeningkatanD: String(raw.upayaPeningkatanD || ''),
    kesadaranD: String(raw.kesadaranD || 'Sadar Dampak Kesulitan'),
    pertanyaanD: String(raw.pertanyaanD || ''),
    responD: String(raw.responD || ''),
    catatanKepsekD: String(raw.catatanKepsekD || ''),
    totalPerilaku: Number(raw.totalPerilaku) || 0,
    efektifCount: Number(raw.efektifCount) || 0,
    belumEfektifCount: Number(raw.belumEfektifCount) || 0,
    belumDilakukanCount: Number(raw.belumDilakukanCount) || 0,
    persentaseEfektif: Number(raw.persentaseEfektif) || 0,
    syncedToGoogleSheets: Boolean(raw.syncedToGoogleSheets),
    syncTimestamp: raw.syncTimestamp ? String(raw.syncTimestamp) : undefined,
    sheetRowIndex: raw.sheetRowIndex ? Number(raw.sheetRowIndex) : undefined
  };
}

export function getStoredRecords(): ObservationData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeObservationRecord);
      }
    }
  } catch (e) {
    console.error('Error reading records from localStorage:', e);
  }
  return [];
}

export function saveStoredRecords(records: ObservationData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving records to localStorage:', e);
  }
}

export function getDeletedRecordIds(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DELETED_IDS);
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch (e) {
    console.error('Error reading deleted IDs from localStorage:', e);
  }
  return new Set();
}

export function addDeletedRecordId(id: string): void {
  try {
    const current = getDeletedRecordIds();
    current.add(id);
    localStorage.setItem(STORAGE_KEY_DELETED_IDS, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.error('Error adding deleted ID:', e);
  }
}

export function removeDeletedRecordId(id: string): void {
  try {
    const current = getDeletedRecordIds();
    current.delete(id);
    localStorage.setItem(STORAGE_KEY_DELETED_IDS, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.error('Error removing deleted ID:', e);
  }
}

/**
 * Send delete request to Google Apps Script Web App
 */
export async function deleteRecordFromGoogleSheets(
  id: string,
  config: SheetConfig
): Promise<{ success: boolean; message: string }> {
  addDeletedRecordId(id);

  if (config.scriptUrl && config.scriptUrl.trim().startsWith('http')) {
    const url = config.scriptUrl.trim();
    const payload = { id, action: 'delete' };

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return { success: true, message: 'Data berhasil dihapus dari Google Spreadsheet.' };
    } catch {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        return { success: true, message: 'Data berhasil dihapus.' };
      } catch (err: unknown) {
        console.warn('Error sending delete to Google Apps Script:', err);
      }
    }
  }

  return { success: true, message: 'Data dihapus dari sistem lokal.' };
}

/**
 * Sync a single observation record to Google Spreadsheet
 */
export async function syncRecordToGoogleSheets(
  record: ObservationData,
  config: SheetConfig
): Promise<{ success: boolean; message: string; remoteId?: string }> {
  // Compute indicator titles string
  const indicatorTitles = (record.pickedIndicators || [])
    .map(id => {
      const ind = INDICATORS.find(i => i.id === id);
      return ind ? `Indikator ${id}: ${ind.title}` : `Indikator ${id}`;
    })
    .join('; ');

  const payload = {
    ...record,
    indikatorText: indicatorTitles,
    timestamp: new Date().toISOString()
  };

  // If user has provided a Google Apps Script Web App URL
  if (config.scriptUrl && config.scriptUrl.trim().startsWith('http')) {
    const url = config.scriptUrl.trim();
    try {
      // Send payload via POST to Google Apps Script
      // Note: text/plain prevents CORS preflight OPTIONS request in browser
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      try {
        const result = await response.json();
        return {
          success: true,
          message: 'Berhasil disinkronkan ke Google Spreadsheet!',
          remoteId: result.id || record.id
        };
      } catch {
        return {
          success: true,
          message: 'Data berhasil dikirim dan tersimpan di Google Spreadsheet.',
          remoteId: record.id
        };
      }
    } catch (networkErr: unknown) {
      // If browser CORS or redirect interception occurred, use mode: 'no-cors'
      // This sends the full POST data through to the Apps Script execution reliably
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        return {
          success: true,
          message: 'Data berhasil dikirim dan tersinkronkan ke Google Spreadsheet!',
          remoteId: record.id
        };
      } catch (fallbackErr: unknown) {
        console.warn('Network error posting to Google Apps Script URL:', fallbackErr);
        return {
          success: false,
          message: fallbackErr instanceof Error ? fallbackErr.message : 'Koneksi ke Google Apps Script gagal.'
        };
      }
    }
  }

  // If no script URL is set yet, we still succeed locally and advise user
  return {
    success: true,
    message: 'Data tersimpan di database lokal. Konfigurasikan URL Google Apps Script untuk sinkronisasi live Google Spreadsheet.',
    remoteId: record.id
  };
}

/**
 * Fetch latest records from Google Spreadsheet Web App
 */
export async function fetchRemoteRecords(config: SheetConfig): Promise<{
  success: boolean;
  records?: ObservationData[];
  message?: string;
}> {
  if (!config.scriptUrl || !config.scriptUrl.trim().startsWith('http')) {
    return { success: false, message: 'URL Google Apps Script belum dikonfigurasikan.' };
  }

  try {
    const res = await fetch(config.scriptUrl.trim(), { method: 'GET' });
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      const deletedIds = getDeletedRecordIds();
      const validRecords = json.data
        .filter((r: any) => r && r.id && !deletedIds.has(r.id) && String(r.guru || '').trim().length > 0)
        .map(normalizeObservationRecord);
      return {
        success: true,
        records: validRecords
      };
    }
    return { success: false, message: json.message || 'Gagal memuat data dari Spreadsheet' };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Koneksi ke spreadsheet gagal.'
    };
  }
}

/**
 * Export records as CSV for direct import to Google Sheets or Excel
 */
export function exportToCSV(records: ObservationData[]): void {
  const headers = [
    'ID Observasi',
    'Tanggal Observasi',
    'Nama Guru',
    'Observer / KS',
    'Mata Pelajaran & Kelas',
    'Sekolah',
    'Periode',
    'Skor Efektif (%)',
    'Indikator Terpilih',
    'Upaya Belajar',
    'Catatan Observasi',
    'Rekomendasi',
    'Kategori Kesadaran Refleksi',
    'Upaya Tindak Lanjut',
    'Jadwal Tindak Lanjut',
    'Kebutuhan Dukungan'
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = records.map(r => {
    const indTitles = (r.pickedIndicators || [])
      .map(id => INDICATORS.find(i => i.id === id)?.title || `Indikator ${id}`)
      .join('; ');

    return [
      escapeCSV(r.id),
      escapeCSV(r.tanggal),
      escapeCSV(r.guru),
      escapeCSV(r.kepsek),
      escapeCSV(r.kelas),
      escapeCSV(r.tempat),
      escapeCSV(r.periode),
      escapeCSV(`${r.persentaseEfektif}%`),
      escapeCSV(indTitles),
      escapeCSV(r.upayaBelajar),
      escapeCSV(r.catatanObs),
      escapeCSV(r.rekomendasi),
      escapeCSV(r.kategoriKesadaranC),
      escapeCSV(r.upayaTL),
      escapeCSV(r.kapanTL),
      escapeCSV(r.dukunganTL)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Observasi_PMM_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
