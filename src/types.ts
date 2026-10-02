export interface Indicator {
  id: number;
  title: string;
  focus: string;
  dianjurkan: string[];
  dihindari: string[];
}

export type RatingValue = 'Belum Dilakukan' | 'Dilakukan tapi Belum Efektif' | 'Dilakukan dan Efektif' | '';

export interface ObservationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Identitas
  guru: string;
  kepsek: string;
  kelas: string;
  tempat: string;
  periode: string;
  tanggal: string;

  // Formulir A - Persiapan
  pickedIndicators: number[];
  upayaBelajar: string;
  hariObs: string;
  waktuObs: string;
  perangkatAjar: string;
  hasilKerja: string;
  catatanLain: string;

  // Formulir B - Observasi
  ratings: Record<string, RatingValue>; // key: `${indId}_${type}_${idx}`
  catatanIndikator?: Record<string, string>; // key: `${indId}_dianjurkan` & `${indId}_dihindari` (catatan observer penilai)
  catatanObs: string;
  rekomendasi: string;

  // Formulir C - Tindak Lanjut
  kategoriKesadaranC: string;
  pertanyaanC: string;
  responC: string;
  catatanC: string;
  tujuanTL: string;
  upayaTL: string;
  kapanTL: string;
  dukunganTL: string;
  catatanKepsekC: string;

  // Formulir D - Refleksi Tindak Lanjut
  kategoriTLD: string;
  capaianD: string;
  tantanganD: string;
  upayaPeningkatanD: string;
  kesadaranD: string;
  pertanyaanD: string;
  responD: string;
  catatanKepsekD: string;

  // Skor & Summary
  totalPerilaku: number;
  efektifCount: number;
  belumEfektifCount: number;
  belumDilakukanCount: number;
  persentaseEfektif: number;

  // Sync state
  syncedToGoogleSheets: boolean;
  syncTimestamp?: string;
  sheetRowIndex?: number;
}

export interface SheetConfig {
  scriptUrl: string; // Google Apps Script Web App URL
  spreadsheetId: string;
  spreadsheetUrl: string;
  autoSync: boolean;
  syncIntervalSeconds: number;
  soundEnabled: boolean;
  browserNotificationEnabled: boolean;
  lastSyncTime?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  guru: string;
  kelas: string;
  timestamp: string;
  read: boolean;
  recordId: string;
  efektifPct: number;
}

export type LogoPreset = 'preset_tutwuri' | 'preset_garuda' | 'preset_provinsi' | 'preset_pmm' | 'preset_smk' | 'custom' | 'none';

export interface KopConfig {
  showLeftLogo: boolean;
  leftLogoType: LogoPreset;
  leftLogoUrl: string; // base64 / URL
  leftLogoWidth: number;

  showRightLogo: boolean;
  rightLogoType: LogoPreset;
  rightLogoUrl: string; // base64 / URL
  rightLogoWidth: number;

  instansiTingkat1: string;
  instansiTingkat2: string;
  namaSekolah: string;
  alamatKontak: string;
  judulDokumen: string;
  subJudulDokumen: string;
  showDoubleLine: boolean;
}
