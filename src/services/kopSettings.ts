import { KopConfig } from '../types';

const STORAGE_KEY_KOP = 'pmm_kop_config_v1';

export const DEFAULT_KOP_CONFIG: KopConfig = {
  showLeftLogo: true,
  leftLogoType: 'preset_tutwuri',
  leftLogoUrl: '',
  leftLogoWidth: 64,

  showRightLogo: true,
  rightLogoType: 'preset_pmm',
  rightLogoUrl: '',
  rightLogoWidth: 64,

  instansiTingkat1: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI',
  instansiTingkat2: 'DIREKTORAT JENDERAL GURU DAN TENAGA KEPENDIDIKAN',
  namaSekolah: '', // Jika kosong, otomatis memakai Tempat/Sekolah dari formulir
  alamatKontak: 'Laman: guru.kemdikbud.go.id · Pos-el: pengaduan@kemdikbud.go.id',
  judulDokumen: 'PENGELOLAAN KINERJA GURU — PLATFORM MERDEKA MENGAJAR (PMM)',
  subJudulDokumen: 'Laporan Hasil Observasi Praktik Kinerja Guru (Formulir A s.d D)',
  showDoubleLine: true
};

export function getStoredKopConfig(): KopConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KOP);
    if (!raw) return { ...DEFAULT_KOP_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_KOP_CONFIG,
      ...parsed
    };
  } catch (e) {
    console.error('Failed to parse KopConfig from localStorage:', e);
    return { ...DEFAULT_KOP_CONFIG };
  }
}

export function saveStoredKopConfig(config: KopConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_KOP, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save KopConfig to localStorage:', e);
  }
}
