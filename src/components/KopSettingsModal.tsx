import React, { useState } from 'react';
import { KopConfig, LogoPreset } from '../types';
import { LogoRenderer } from './LogoRenderer';
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Sliders,
  Check,
  Building,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { DEFAULT_KOP_CONFIG } from '../services/kopSettings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: KopConfig;
  onSaveConfig: (newConfig: KopConfig) => void;
  sampleSchoolName?: string;
}

export const KopSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  sampleSchoolName = 'SMK Negeri 1'
}) => {
  const [formData, setFormData] = useState<KopConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'text' | 'left_logo' | 'right_logo'>('text');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle Logo Upload via FileReader
  const handleLogoUpload = (file: File, side: 'left' | 'right') => {
    if (!file) return;

    // Check size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file logo terlalu besar. Harap pilih gambar di bawah 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (side === 'left') {
        setFormData(prev => ({
          ...prev,
          showLeftLogo: true,
          leftLogoType: 'custom',
          leftLogoUrl: dataUrl
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          showRightLogo: true,
          rightLogoType: 'custom',
          rightLogoUrl: dataUrl
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (confirm('Kembalikan pengaturan KOP dan logo ke format standar Kemendikbudristek?')) {
      setFormData({ ...DEFAULT_KOP_CONFIG });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-[#DDD8C9] overflow-hidden text-[#1B2A41]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#1B2A41] to-[#2B3E5C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#9C7A2E] to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Building size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold font-serif leading-snug m-0 text-white">
                Kustomisasi KOP Surat &amp; Logo Cetak A4
              </h2>
              <p className="text-xs text-gray-300 m-0 mt-0.5">
                Atur nama instansi, sekolah, alamat, dan logo kanan-kiri untuk laporan resmi
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real-time KOP Live Preview Card */}
        <div className="bg-[#F5F3EC] p-3.5 border-b border-[#DDD8C9] overflow-x-auto">
          <div className="flex items-center justify-between mb-1.5 text-xs text-[#4B5A6E]">
            <span className="flex items-center gap-1 font-semibold text-[#1B2A41]">
              <Eye size={13} className="text-[#9C7A2E]" />
              Pratinjau KOP Dokumen Hasil Cetak (A4)
            </span>
            <span className="text-[10px] text-gray-500 italic">
              Tampilan langsung saat dicetak / diekspor ke PDF
            </span>
          </div>

          <div className="bg-white p-3 rounded border border-gray-300 shadow-2xs">
            <div className="flex items-center justify-between gap-3 text-center">
              
              {/* Logo Kiri Preview */}
              <div className="w-16 shrink-0 flex items-center justify-center min-h-[50px]">
                {formData.showLeftLogo ? (
                  <LogoRenderer
                    type={formData.leftLogoType}
                    customUrl={formData.leftLogoUrl}
                    width={formData.leftLogoWidth ? Math.min(formData.leftLogoWidth, 60) : 50}
                  />
                ) : (
                  <div className="w-12 h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                    Tanpa Logo
                  </div>
                )}
              </div>

              {/* Teks KOP Preview */}
              <div className="flex-1 px-1">
                {formData.instansiTingkat1 && (
                  <p className="font-bold text-[10.5px] uppercase tracking-wider text-black m-0 leading-tight">
                    {formData.instansiTingkat1}
                  </p>
                )}
                {formData.instansiTingkat2 && (
                  <p className="font-semibold text-[9.5px] uppercase tracking-wide text-gray-800 m-0 leading-tight mt-0.5">
                    {formData.instansiTingkat2}
                  </p>
                )}
                <p className="font-bold text-[11px] uppercase tracking-wide text-[#1B2A41] font-serif m-0 leading-tight mt-0.5">
                  {formData.namaSekolah || sampleSchoolName || 'NAMA SATUAN PENDIDIKAN / SEKOLAH'}
                </p>
                {formData.alamatKontak && (
                  <p className="text-[8.5px] text-gray-600 m-0 italic mt-0.5 leading-tight">
                    {formData.alamatKontak}
                  </p>
                )}
                <p className="text-[9.5px] font-bold text-[#9C7A2E] m-0 mt-1 uppercase tracking-wide">
                  {formData.judulDokumen || 'PENGELOLAAN KINERJA GURU — PLATFORM MERDEKA MENGAJAR (PMM)'}
                </p>
              </div>

              {/* Logo Kanan Preview */}
              <div className="w-16 shrink-0 flex items-center justify-center min-h-[50px]">
                {formData.showRightLogo ? (
                  <LogoRenderer
                    type={formData.rightLogoType}
                    customUrl={formData.rightLogoUrl}
                    width={formData.rightLogoWidth ? Math.min(formData.rightLogoWidth, 60) : 50}
                  />
                ) : (
                  <div className="w-12 h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                    Tanpa Logo
                  </div>
                )}
              </div>

            </div>

            {/* Garis Pembatas Preview */}
            <div className="mt-2">
              <div className="border-b-2 border-black"></div>
              {formData.showDoubleLine && <div className="border-b border-black mt-0.5"></div>}
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-[#DDD8C9] bg-white px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'border-[#9C7A2E] text-[#1B2A41] font-bold'
                : 'border-transparent text-[#4B5A6E] hover:text-[#1B2A41]'
            }`}
          >
            <Building size={14} />
            <span>Teks &amp; Instansi KOP</span>
          </button>
          
          <button
            onClick={() => setActiveTab('left_logo')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'left_logo'
                ? 'border-[#9C7A2E] text-[#1B2A41] font-bold'
                : 'border-transparent text-[#4B5A6E] hover:text-[#1B2A41]'
            }`}
          >
            <ImageIcon size={14} />
            <span>Logo Kiri {formData.showLeftLogo ? '✓' : '(Mati)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('right_logo')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'right_logo'
                ? 'border-[#9C7A2E] text-[#1B2A41] font-bold'
                : 'border-transparent text-[#4B5A6E] hover:text-[#1B2A41]'
            }`}
          >
            <ImageIcon size={14} />
            <span>Logo Kanan {formData.showRightLogo ? '✓' : '(Mati)'}</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[55vh] text-xs">
          
          {/* TAB 1: TEKS INSTANSI KOP */}
          {activeTab === 'text' && (
            <div className="space-y-3.5">
              
              <div>
                <label className="font-semibold text-[#1B2A41] block mb-1">
                  Baris 1: Instansi Induk / Pemerintah Provinsi / Pusat
                </label>
                <input
                  type="text"
                  value={formData.instansiTingkat1}
                  onChange={(e) => setFormData(prev => ({ ...prev, instansiTingkat1: e.target.value }))}
                  placeholder="KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI / PEMERINTAH DAERAH PROVINSI..."
                  className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-xs focus:ring-1 focus:ring-[#9C7A2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1B2A41] block mb-1">
                  Baris 2: Dinas Pendidikan / Instansi Terkait
                </label>
                <input
                  type="text"
                  value={formData.instansiTingkat2}
                  onChange={(e) => setFormData(prev => ({ ...prev, instansiTingkat2: e.target.value }))}
                  placeholder="DIREKTORAT JENDERAL GURU DAN TENAGA KEPENDIDIKAN / DINAS PENDIDIKAN..."
                  className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-xs focus:ring-1 focus:ring-[#9C7A2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1B2A41] block mb-1">
                    Baris 3: Nama Satuan Pendidikan / Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.namaSekolah}
                    onChange={(e) => setFormData(prev => ({ ...prev, namaSekolah: e.target.value }))}
                    placeholder="Kosongkan untuk otomatis memakai nama sekolah dari form"
                    className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-xs focus:ring-1 focus:ring-[#9C7A2E] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    *Jika dikosongkan, nama sekolah otomatis mengambil dari data Tempat/Sekolah formulir.
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-[#1B2A41] block mb-1">
                    Garis Pembatas KOP
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formData.showDoubleLine}
                        onChange={(e) => setFormData(prev => ({ ...prev, showDoubleLine: e.target.checked }))}
                        className="rounded border-gray-300 text-[#9C7A2E] focus:ring-[#9C7A2E]"
                      />
                      <span>Garis Ganda Resmi Dinas (Tebal &amp; Tipis)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1B2A41] block mb-1">
                  Baris 4: Alamat Lengkap &amp; Kontak Sekolah / Instansi
                </label>
                <input
                  type="text"
                  value={formData.alamatKontak}
                  onChange={(e) => setFormData(prev => ({ ...prev, alamatKontak: e.target.value }))}
                  placeholder="Jalan Pendidikan No. 1, Kota ... · Telp: (021) 123456 · Website: www.sekolah.sch.id"
                  className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-xs focus:ring-1 focus:ring-[#9C7A2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#EAE6D9]">
                <div>
                  <label className="font-semibold text-[#1B2A41] block mb-1">
                    Judul Dokumen (Header KOP)
                  </label>
                  <input
                    type="text"
                    value={formData.judulDokumen}
                    onChange={(e) => setFormData(prev => ({ ...prev, judulDokumen: e.target.value }))}
                    placeholder="PENGELOLAAN KINERJA GURU — PLATFORM MERDEKA MENGAJAR (PMM)"
                    className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-xs focus:ring-1 focus:ring-[#9C7A2E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1B2A41] block mb-1">
                    Sub-Judul Dokumen
                  </label>
                  <input
                    type="text"
                    value={formData.subJudulDokumen}
                    onChange={(e) => setFormData(prev => ({ ...prev, subJudulDokumen: e.target.value }))}
                    placeholder="Laporan Hasil Observasi Praktik Kinerja Guru (Formulir A s.d D)"
                    className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-xs focus:ring-1 focus:ring-[#9C7A2E] focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LOGO KIRI */}
          {activeTab === 'left_logo' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] border border-[#DDD8C9]">
                <div>
                  <span className="font-bold text-xs text-[#1B2A41] block">
                    Tampilkan Logo Sisi Kiri
                  </span>
                  <span className="text-[11px] text-[#4B5A6E]">
                    Biasa digunakan untuk Tut Wuri Handayani, Lambang Pemerintah Daerah, atau Yayasan
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showLeftLogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, showLeftLogo: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#9C7A2E] focus:ring-[#9C7A2E] cursor-pointer"
                />
              </div>

              {formData.showLeftLogo && (
                <>
                  <div>
                    <label className="font-semibold text-[#1B2A41] block mb-2">
                      Pilihan Logo Kiri:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      
                      {/* Preset Tut Wuri */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, leftLogoType: 'preset_tutwuri' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.leftLogoType === 'preset_tutwuri'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <LogoRenderer type="preset_tutwuri" width={42} />
                        <span className="text-[11px] font-semibold">Tut Wuri Handayani</span>
                      </div>

                      {/* Preset Garuda */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, leftLogoType: 'preset_garuda' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.leftLogoType === 'preset_garuda'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <LogoRenderer type="preset_garuda" width={42} />
                        <span className="text-[11px] font-semibold">Garuda Pancasila</span>
                      </div>

                      {/* Preset Pemda */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, leftLogoType: 'preset_provinsi' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.leftLogoType === 'preset_provinsi'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <LogoRenderer type="preset_provinsi" width={42} />
                        <span className="text-[11px] font-semibold">Lambang Pemda</span>
                      </div>

                      {/* Custom Upload */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, leftLogoType: 'custom' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.leftLogoType === 'custom'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <Upload size={24} className="text-[#9C7A2E]" />
                        <span className="text-[11px] font-semibold">Upload Logo Sendiri</span>
                      </div>

                    </div>
                  </div>

                  {/* Upload Box if custom */}
                  {formData.leftLogoType === 'custom' && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-[#DDD8C9] space-y-3">
                      <span className="font-semibold text-xs block text-[#1B2A41]">
                        Pilih file gambar logo dari perangkat (PNG, JPG, SVG - max 2MB):
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <label className="px-3.5 py-2 rounded bg-[#1B2A41] hover:bg-[#111c2e] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <Upload size={14} />
                          <span>Pilih File Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file, 'left');
                            }}
                          />
                        </label>

                        {formData.leftLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, leftLogoUrl: '', leftLogoType: 'preset_tutwuri' }))}
                            className="px-3 py-2 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={13} />
                            <span>Hapus Logo Kustom</span>
                          </button>
                        )}
                      </div>

                      {formData.leftLogoUrl && (
                        <div className="flex items-center gap-3 pt-2">
                          <img
                            src={formData.leftLogoUrl}
                            alt="Logo Kiri Preview"
                            className="w-16 h-16 object-contain border border-gray-300 p-1 bg-white rounded"
                          />
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            ✓ Gambar logo kustom berhasil dimuat
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ukuran Logo Slider */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-[#DDD8C9] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#1B2A41] block">
                        Ukuran Lebar Logo Kiri: {formData.leftLogoWidth || 64} px
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Sesuaikan ukuran agar proporsional dengan tinggi KOP
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      step={4}
                      value={formData.leftLogoWidth || 64}
                      onChange={(e) => setFormData(prev => ({ ...prev, leftLogoWidth: Number(e.target.value) }))}
                      className="w-36 accent-[#9C7A2E] cursor-pointer"
                    />
                  </div>
                </>
              )}

            </div>
          )}

          {/* TAB 3: LOGO KANAN */}
          {activeTab === 'right_logo' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] border border-[#DDD8C9]">
                <div>
                  <span className="font-bold text-xs text-[#1B2A41] block">
                    Tampilkan Logo Sisi Kanan
                  </span>
                  <span className="text-[11px] text-[#4B5A6E]">
                    Biasa digunakan untuk Logo Sekolah / SMK Bisa / Platform Merdeka Mengajar (PMM)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showRightLogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, showRightLogo: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#9C7A2E] focus:ring-[#9C7A2E] cursor-pointer"
                />
              </div>

              {formData.showRightLogo && (
                <>
                  <div>
                    <label className="font-semibold text-[#1B2A41] block mb-2">
                      Pilihan Logo Kanan:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      
                      {/* Preset PMM */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, rightLogoType: 'preset_pmm' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.rightLogoType === 'preset_pmm'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <LogoRenderer type="preset_pmm" width={42} />
                        <span className="text-[11px] font-semibold">PMM SKP</span>
                      </div>

                      {/* Preset SMK Bisa */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, rightLogoType: 'preset_smk' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.rightLogoType === 'preset_smk'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <LogoRenderer type="preset_smk" width={42} />
                        <span className="text-[11px] font-semibold">SMK Bisa!</span>
                      </div>

                      {/* Preset Tut Wuri */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, rightLogoType: 'preset_tutwuri' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.rightLogoType === 'preset_tutwuri'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <LogoRenderer type="preset_tutwuri" width={42} />
                        <span className="text-[11px] font-semibold">Tut Wuri</span>
                      </div>

                      {/* Custom Upload */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, rightLogoType: 'custom' }))}
                        className={`p-3 rounded-lg border cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          formData.rightLogoType === 'custom'
                            ? 'border-[#9C7A2E] bg-amber-50 ring-1 ring-[#9C7A2E]'
                            : 'border-[#DDD8C9] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <Upload size={24} className="text-[#9C7A2E]" />
                        <span className="text-[11px] font-semibold">Upload Logo Sekolah</span>
                      </div>

                    </div>
                  </div>

                  {/* Upload Box if custom */}
                  {formData.rightLogoType === 'custom' && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-[#DDD8C9] space-y-3">
                      <span className="font-semibold text-xs block text-[#1B2A41]">
                        Pilih file logo sekolah Anda (PNG, JPG, SVG - max 2MB):
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <label className="px-3.5 py-2 rounded bg-[#1B2A41] hover:bg-[#111c2e] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <Upload size={14} />
                          <span>Pilih Logo Sekolah</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file, 'right');
                            }}
                          />
                        </label>

                        {formData.rightLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rightLogoUrl: '', rightLogoType: 'preset_pmm' }))}
                            className="px-3 py-2 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={13} />
                            <span>Hapus Logo Kustom</span>
                          </button>
                        )}
                      </div>

                      {formData.rightLogoUrl && (
                        <div className="flex items-center gap-3 pt-2">
                          <img
                            src={formData.rightLogoUrl}
                            alt="Logo Kanan Preview"
                            className="w-16 h-16 object-contain border border-gray-300 p-1 bg-white rounded"
                          />
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            ✓ Gambar logo sekolah kustom berhasil dimuat
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ukuran Logo Slider */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-[#DDD8C9] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#1B2A41] block">
                        Ukuran Lebar Logo Kanan: {formData.rightLogoWidth || 64} px
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Sesuaikan ukuran agar proporsional dengan tinggi KOP
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      step={4}
                      value={formData.rightLogoWidth || 64}
                      onChange={(e) => setFormData(prev => ({ ...prev, rightLogoWidth: Number(e.target.value) }))}
                      className="w-36 accent-[#9C7A2E] cursor-pointer"
                    />
                  </div>
                </>
              )}

            </div>
          )}

        </div>

        {/* Footer Modal Actions */}
        <div className="bg-[#F5F3EC] border-t border-[#DDD8C9] px-5 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Kembalikan ke Default Kemdikbud</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-[#DDD8C9] rounded text-xs font-semibold text-[#1B2A41] transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#9C7A2E] hover:bg-[#7A5F22] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Simpan Pengaturan KOP</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
