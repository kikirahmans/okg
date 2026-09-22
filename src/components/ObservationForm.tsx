import React, { useState, useEffect } from 'react';
import { ObservationData, RatingValue, SheetConfig } from '../types';
import { INDICATORS, RATINGS_LIST } from '../data/indicators';
import { getStoredObservees } from '../data/observees';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Cloud, Save, Printer, ArrowRight, ArrowLeft, Trash2, FolderOpen, Check, RotateCcw, PlusCircle, UserCheck, AlertTriangle } from 'lucide-react';

interface Props {
  currentRecord: ObservationData;
  onUpdateCurrentRecord: (record: ObservationData) => void;
  onSaveToSheets: (record: ObservationData) => Promise<void>;
  savedRecords: ObservationData[];
  onLoadSavedRecord: (id: string) => void;
  onDeleteSavedRecord: (id: string) => void;
  onNewObservation?: (observeeName?: string) => void;
  config: SheetConfig;
  isSaving: boolean;
}

export const ObservationForm: React.FC<Props> = ({
  currentRecord,
  onUpdateCurrentRecord,
  onSaveToSheets,
  savedRecords,
  onLoadSavedRecord,
  onDeleteSavedRecord,
  onNewObservation,
  config,
  isSaving
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; subtitle?: string } | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [observeesList] = useState<string[]>(() => getStoredObservees());

  useEffect(() => {
    if (currentRecord.syncedToGoogleSheets) {
      setStatusMessage(`Tersimpan di Google Spreadsheet (${currentRecord.syncTimestamp || 'Baru Saja'})`);
    } else {
      setStatusMessage('Draft belum disinkronkan ke Spreadsheet');
    }
  }, [currentRecord]);

  // Indicator selection (Max 2 indicators)
  const toggleIndicator = (id: number) => {
    let nextPicked = [...(currentRecord.pickedIndicators || [])];
    const index = nextPicked.indexOf(id);
    if (index >= 0) {
      nextPicked.splice(index, 1);
    } else {
      if (nextPicked.length >= 2) {
        nextPicked.shift();
      }
      nextPicked.push(id);
    }

    recalcAndSave({
      ...currentRecord,
      pickedIndicators: nextPicked
    });
  };

  // Set Rubric Rating
  const setRating = (key: string, val: RatingValue) => {
    const nextRatings = {
      ...(currentRecord.ratings || {}),
      [key]: val
    };

    recalcAndSave({
      ...currentRecord,
      ratings: nextRatings
    });
  };

  // Calculate scores
  const recalcAndSave = (rec: ObservationData) => {
    let efektifCount = 0;
    let belumEfektifCount = 0;
    let belumDilakukanCount = 0;
    let totalPerilaku = 0;

    const ratings = rec.ratings || {};
    const picked = rec.pickedIndicators || [];
    picked.forEach(indId => {
      const ind = INDICATORS.find(i => i.id === indId);
      if (ind) {
        // Dianjurkan (3 items)
        ind.dianjurkan.forEach((_, idx) => {
          totalPerilaku++;
          const val = ratings[`${indId}_dianjurkan_${idx}`];
          if (val === 'Dilakukan dan Efektif') efektifCount++;
          else if (val === 'Dilakukan tapi Belum Efektif') belumEfektifCount++;
          else if (val === 'Belum Dilakukan') belumDilakukanCount++;
        });

        // Dihindari (3 items): For negative behaviors, NOT doing it ('Belum Dilakukan') is the desired effective conduct!
        ind.dihindari.forEach((_, idx) => {
          totalPerilaku++;
          const val = ratings[`${indId}_dihindari_${idx}`];
          if (val === 'Belum Dilakukan') efektifCount++;
          else if (val === 'Dilakukan tapi Belum Efektif') belumEfektifCount++;
          else if (val === 'Dilakukan dan Efektif') belumDilakukanCount++;
        });
      }
    });

    const persentaseEfektif = totalPerilaku > 0 ? Math.round((efektifCount / totalPerilaku) * 100) : 0;

    onUpdateCurrentRecord({
      ...rec,
      totalPerilaku,
      efektifCount,
      belumEfektifCount,
      belumDilakukanCount,
      persentaseEfektif
    });
  };

  const handleSave = async () => {
    await onSaveToSheets(currentRecord);
  };

  const switchTab = (tab: 'A' | 'B' | 'C' | 'D') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-16 text-[#1B2A41]">
      
      {/* QUICK OBSERVEES BAR (6 Observees Tracker) */}
      <div className="bg-[#FAF8F3] border-b border-[#DDD8C9] px-4 sm:px-7 py-2.5">
        <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1B2A41]">
            <UserCheck size={15} className="text-[#9C7A2E]" />
            <span>Pilih Cepat Guru Observee:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {observeesList.map(name => {
              const matchedRecords = savedRecords.filter(r => r.guru && r.guru.trim().toLowerCase() === name.trim().toLowerCase());
              const isCurrent = currentRecord.guru && currentRecord.guru.trim().toLowerCase() === name.trim().toLowerCase();
              const hasSaved = matchedRecords.length > 0;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    if (isCurrent) return;
                    if (hasSaved) {
                      // Buka observasi tersimpan yang terakhir untuk guru ini
                      onLoadSavedRecord(matchedRecords[0].id);
                    } else if (onNewObservation) {
                      // Buat observasi baru untuk guru ini
                      onNewObservation(name);
                    } else {
                      onUpdateCurrentRecord({ ...currentRecord, guru: name });
                    }
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#1B2A41] text-white border-[#1B2A41] shadow-xs font-semibold'
                      : hasSaved
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 font-medium'
                      : 'bg-white hover:bg-[#EAE6D9] text-[#4B5A6E] border-[#DDD8C9]'
                  }`}
                  title={hasSaved ? `${name} (Sudah ada ${matchedRecords.length} observasi)` : `${name} (Belum diobservasi)`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-amber-300' : hasSaved ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <span>{name}</span>
                  {hasSaved && (
                    <span className="text-[9px] opacity-75 font-mono">
                      ({matchedRecords[0].persentaseEfektif || 0}%)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* IDENTITY BAR */}
      <div className="bg-white border-b border-[#DDD8C9] shadow-xs">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#4B5A6E] font-medium flex items-center justify-between">
              <span>Nama Guru (Observee)</span>
              {currentRecord.guru && (
                <span className="text-[10px] text-[#9C7A2E] font-normal">Tersedia 6 Observee</span>
              )}
            </label>
            <input
              id="i_guru"
              list="observeeList"
              value={currentRecord.guru || ''}
              onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, guru: e.target.value })}
              placeholder="Pilih atau ketik nama guru"
              className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-[#1B2A41] text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
            <datalist id="observeeList">
              {observeesList.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#4B5A6E] font-medium">Nama Observer / Kepala Sekolah</label>
            <input
              id="i_kepsek"
              value={currentRecord.kepsek || ''}
              onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, kepsek: e.target.value })}
              placeholder="Nama kepala sekolah / observer"
              className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-[#1B2A41] text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#4B5A6E] font-medium">Mata Pelajaran / Kelas</label>
            <input
              id="i_kelas"
              value={currentRecord.kelas || ''}
              onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, kelas: e.target.value })}
              placeholder="Contoh: Produktif SMK / XI TKR-1"
              className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-[#1B2A41] text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#4B5A6E] font-medium">Tempat / Sekolah</label>
            <input
              id="i_tempat"
              value={currentRecord.tempat || ''}
              onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, tempat: e.target.value })}
              placeholder="Nama sekolah"
              className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-[#1B2A41] text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#4B5A6E] font-medium">Periode</label>
            <input
              id="i_periode"
              value={currentRecord.periode || 'Januari - Juni 2026'}
              onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, periode: e.target.value })}
              className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-[#1B2A41] text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#4B5A6E] font-medium">Hari / Tanggal</label>
            <input
              id="i_tanggal"
              type="date"
              value={currentRecord.tanggal || ''}
              onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, tanggal: e.target.value })}
              className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-[#1B2A41] text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
          </div>

        </div>
      </div>

      {/* RECORDS ACTION BAR */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#DDD8C9] bg-[#F5F3EC]">
        
        {/* Left: New Observation & Saved records selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Observasi Baru (Anti-Overwrite) */}
          <button
            type="button"
            onClick={() => {
              if (onNewObservation) {
                onNewObservation();
              }
            }}
            className="px-3 py-1.5 bg-[#9C7A2E] hover:bg-[#856725] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Mulai lembar observasi baru dengan ID unik terpisah agar tidak menimpa data sebelumnya"
          >
            <PlusCircle size={14} />
            <span>Observasi Baru</span>
          </button>

          <div className="h-4 w-px bg-[#DDD8C9] mx-1 hidden sm:block" />

          <select
            id="recordSelect"
            value={selectedRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="border border-[#DDD8C9] rounded px-2.5 py-1.5 bg-white text-xs text-[#1B2A41] focus:outline-none max-w-[240px]"
          >
            <option value="">— Pilih Data Tersimpan —</option>
            {savedRecords.map(r => (
              <option key={r.id} value={r.id}>
                {r.guru || 'Tanpa Nama'} — {r.kelas || r.tanggal}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (selectedRecordId) onLoadSavedRecord(selectedRecordId);
            }}
            disabled={!selectedRecordId}
            className="px-3 py-1.5 bg-white hover:bg-[#EAE6D9] border border-[#DDD8C9] rounded text-xs font-semibold text-[#1B2A41] disabled:opacity-50 flex items-center gap-1"
          >
            <FolderOpen size={13} />
            Buka
          </button>

          <button
            onClick={() => {
              if (selectedRecordId) {
                const found = savedRecords.find(r => r.id === selectedRecordId);
                setItemToDelete({
                  id: selectedRecordId,
                  name: found?.guru || 'Data Observasi',
                  subtitle: `Kelas: ${found?.kelas || '-'} · Tanggal: ${found?.tanggal || '-'}`
                });
              }
            }}
            disabled={!selectedRecordId}
            className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-[#DDD8C9] text-rose-700 rounded text-xs font-semibold disabled:opacity-50 flex items-center gap-1 transition-colors"
            title="Hapus data observasi terpilih"
          >
            <Trash2 size={13} />
            Hapus
          </button>
        </div>

        {/* Center/Info: Anti-overwrite Status Indicator */}
        <div className="flex items-center">
          {savedRecords.some(r => r.id === currentRecord.id) ? (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
              <AlertTriangle size={13} className="text-amber-600 shrink-0" />
              <span>
                Sedang mengedit: <strong>{currentRecord.guru || 'Data Tersimpan'}</strong>. (Gunakan <em>Observasi Baru</em> untuk guru lain).
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              <Check size={13} className="text-emerald-600 shrink-0" />
              <span>Observasi Baru (ID Mandiri — data guru lain aman tidak tertimpa)</span>
            </div>
          )}
        </div>

        {/* Right: Save & Print actions */}
        <div className="flex items-center gap-2.5">
          <span
            id="statusChip"
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              currentRecord.syncedToGoogleSheets
                ? 'bg-[#EAF1EA] text-[#3D6B4F] border border-[#3D6B4F]/20'
                : 'bg-white text-[#7A5F22] border border-[#DDD8C9]'
            }`}
          >
            {statusMessage}
          </span>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#9C7A2E] hover:bg-[#7A5F22] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            title="Simpan data ke Google Spreadsheet dan kirim notifikasi ke Admin Dashboard"
          >
            <Cloud size={14} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Spreadsheet'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-[#EAE6D9] border border-[#DDD8C9] text-[#1B2A41] rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Printer size={13} />
            Cetak PDF
          </button>
        </div>

      </div>

      {/* TABBAR (1: Form A, 2: Form B, 3: Form C, 4: Form D) */}
      <div className="border-b border-[#DDD8C9] bg-[#F5F3EC]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex flex-wrap gap-1 sm:gap-2">
          
          <button
            onClick={() => switchTab('A')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'A'
                ? 'text-[#1B2A41] border-[#9C7A2E] bg-white'
                : 'text-[#4B5A6E] border-transparent hover:text-[#1B2A41]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              activeTab === 'A' ? 'bg-[#9C7A2E] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              1
            </span>
            <span>Formulir A — Persiapan</span>
          </button>

          <button
            onClick={() => switchTab('B')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'B'
                ? 'text-[#1B2A41] border-[#9C7A2E] bg-white'
                : 'text-[#4B5A6E] border-transparent hover:text-[#1B2A41]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              activeTab === 'B' ? 'bg-[#9C7A2E] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              2
            </span>
            <span>Formulir B — Observasi</span>
          </button>

          <button
            onClick={() => switchTab('C')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'C'
                ? 'text-[#1B2A41] border-[#9C7A2E] bg-white'
                : 'text-[#4B5A6E] border-transparent hover:text-[#1B2A41]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              activeTab === 'C' ? 'bg-[#9C7A2E] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              3
            </span>
            <span>Formulir C — Tindak Lanjut</span>
          </button>

          <button
            onClick={() => switchTab('D')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'D'
                ? 'text-[#1B2A41] border-[#9C7A2E] bg-white'
                : 'text-[#4B5A6E] border-transparent hover:text-[#1B2A41]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              activeTab === 'D' ? 'bg-[#9C7A2E] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              4
            </span>
            <span>Formulir D — Refleksi</span>
          </button>

        </div>
      </div>

      {/* FORM CONTENT CONTAINER */}
      <main className="max-w-[1180px] mx-auto px-4 sm:px-7 pt-6">

        {/* ======================= FORM A ======================= */}
        {activeTab === 'A' && (
          <div className="bg-white border border-[#DDD8C9] rounded p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1B2A41] m-0">
                Formulir A — Diskusi Persiapan Observasi Kinerja Guru
              </h2>
              <p className="text-xs text-[#4B5A6E] mt-1">
                Guru dan Kepala Sekolah menyepakati fokus perilaku yang akan diobservasi, upaya belajar untuk menampilkannya secara efektif, serta jadwal dan kelengkapan observasi.
              </p>
            </div>

            {/* Section 1: Focus Indicators */}
            <div className="border-t border-[#EAE6D9] pt-5">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41] mb-1">
                1. Pilih Fokus Perilaku yang Diobservasi
              </h3>
              <p className="text-xs text-[#4B5A6E] mb-3">
                Pilih 1–2 indikator yang akan disepakati bersama guru untuk periode ini (Klik kartu untuk memilih).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="indicatorGrid">
                {INDICATORS.map(ind => {
                  const isPicked = currentRecord.pickedIndicators?.includes(ind.id);
                  return (
                    <div
                      key={ind.id}
                      onClick={() => toggleIndicator(ind.id)}
                      className={`border rounded p-3.5 cursor-pointer transition-all ${
                        isPicked
                          ? 'border-[#9C7A2E] bg-[#FBF3E1] shadow-xs'
                          : 'border-[#DDD8C9] bg-white hover:border-[#9C7A2E]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#7A5F22] tracking-wider uppercase">
                          Indikator {ind.id}
                        </span>
                        {isPicked && (
                          <span className="w-5 h-5 rounded-full bg-[#9C7A2E] text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#1B2A41] mt-1 mb-1">
                        {ind.title}
                      </h4>
                      <p className="text-xs text-[#4B5A6E] leading-relaxed m-0">
                        {ind.focus}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 p-2.5 bg-[#F5F3EC] rounded text-xs text-[#4B5A6E]">
                <strong className="text-[#1B2A41]">Indikator Terpilih: </strong>
                {currentRecord.pickedIndicators?.length > 0 ? (
                  currentRecord.pickedIndicators
                    .map(id => INDICATORS.find(i => i.id === id)?.title)
                    .join(', ')
                ) : (
                  <span className="italic text-gray-400">Belum ada indikator dipilih.</span>
                )}
              </div>
            </div>

            {/* Section 2: Upaya Mempelajari */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-2">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                2. Upaya Mempelajari
              </h3>
              <label className="text-xs text-[#4B5A6E] block font-medium">
                Upaya belajar yang akan dilakukan guru agar mampu menampilkan perilaku target secara efektif:
              </label>
              <textarea
                id="a_upaya"
                rows={3}
                value={currentRecord.upayaBelajar || ''}
                onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, upayaBelajar: e.target.value })}
                placeholder="Contoh: berdiskusi dengan rekan sejawat, mempelajari modul PMM terkait, mencoba strategi baru di kelas, dsb."
                className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs text-[#1B2A41] focus:outline-none focus:border-[#9C7A2E]"
              />
            </div>

            {/* Section 3: Rencana Observasi Kinerja */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-4">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                3. Rencana Observasi Kinerja
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Hari / Tanggal Observasi</label>
                  <input
                    id="a_hariobs"
                    type="date"
                    value={currentRecord.hariObs || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, hariObs: e.target.value })}
                    className="w-full border border-[#DDD8C9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Waktu</label>
                  <input
                    id="a_waktuobs"
                    value={currentRecord.waktuObs || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, waktuObs: e.target.value })}
                    placeholder="Contoh: 08.00 - 09.30"
                    className="w-full border border-[#DDD8C9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Perangkat Ajar</label>
                  <input
                    id="a_perangkat"
                    value={currentRecord.perangkatAjar || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, perangkatAjar: e.target.value })}
                    placeholder="Contoh: Modul Ajar Bab 3"
                    className="w-full border border-[#DDD8C9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Rencana Hasil Kerja</label>
                  <textarea
                    id="a_hasilkerja"
                    rows={2}
                    value={currentRecord.hasilKerja || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, hasilKerja: e.target.value })}
                    placeholder="Hasil kerja yang diharapkan dari sesi observasi ini"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Catatan Lain</label>
                  <textarea
                    id="a_catatanlain"
                    rows={2}
                    value={currentRecord.catatanLain || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, catatanLain: e.target.value })}
                    placeholder="Catatan tambahan hasil diskusi persiapan"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="border-t border-[#EAE6D9] pt-4 flex justify-between items-center">
              <span className="text-xs text-[#4B5A6E]">Formulir 1 dari 4</span>
              <button
                type="button"
                onClick={() => switchTab('B')}
                className="px-5 py-2.5 bg-[#1B2A41] hover:bg-[#111c2e] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Lanjut ke Formulir B</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

        {/* ======================= FORM B ======================= */}
        {activeTab === 'B' && (
          <div className="bg-white border border-[#DDD8C9] rounded p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1B2A41] m-0">
                Formulir B — Pelaksanaan Observasi Kinerja Guru
              </h2>
              <p className="text-xs text-[#4B5A6E] mt-1">
                Nilai setiap perilaku pada indikator yang telah disepakati. Tandai capaian, lalu tuliskan catatan dan rekomendasi Anda sebagai observer.
              </p>
            </div>

            {/* Rubrics Container */}
            <div className="space-y-5" id="rubricContainer">
              {currentRecord.pickedIndicators?.length === 0 ? (
                <div className="p-6 bg-[#FBF3E1] border border-[#DDD8C9] rounded text-center text-xs text-[#7A5F22]">
                  <p className="font-semibold mb-1">Belum ada indikator yang dipilih.</p>
                  <p className="text-[#4B5A6E] mb-3">
                    Kembali ke Formulir A untuk memilih fokus perilaku terlebih dahulu.
                  </p>
                  <button
                    onClick={() => switchTab('A')}
                    className="px-4 py-2 bg-[#9C7A2E] text-white rounded font-semibold text-xs inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft size={13} />
                    Pilih Indikator di Form A
                  </button>
                </div>
              ) : (
                currentRecord.pickedIndicators?.map(indId => {
                  const ind = INDICATORS.find(i => i.id === indId);
                  if (!ind) return null;

                  return (
                    <div key={indId} className="border border-[#DDD8C9] rounded overflow-hidden shadow-2xs">
                      
                      {/* Rubric Header */}
                      <div className="bg-[#F0EDE1] p-3.5 border-b border-[#DDD8C9]">
                        <h3 className="font-serif font-bold text-sm text-[#1B2A41] m-0">
                          Indikator {ind.id} — {ind.title}
                        </h3>
                        <p className="text-xs text-[#4B5A6E] mt-0.5 m-0">
                          {ind.focus}
                        </p>
                      </div>

                      {/* Perilaku yang Dianjurkan */}
                      <div className="p-4 bg-white border-b border-[#EAE6D9]">
                        <div className="text-xs font-semibold text-[#3D6B4F] flex items-center gap-2 mb-3">
                          <span className="w-2 h-2 rounded-full bg-[#3D6B4F]" />
                          <span>Perilaku yang Dianjurkan</span>
                        </div>

                        <div className="space-y-3">
                          {ind.dianjurkan.map((text, idx) => {
                            const key = `${ind.id}_dianjurkan_${idx}`;
                            const currentVal = (currentRecord.ratings || {})[key] || '';

                            return (
                              <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2.5 border-b border-dashed border-[#EAE6D9] last:border-none"
                              >
                                <div className="md:col-span-7 text-xs text-[#1B2A41] leading-relaxed">
                                  {text}
                                </div>
                                <div className="md:col-span-5 flex flex-wrap sm:flex-nowrap gap-1.5">
                                  {RATINGS_LIST.map((rating) => (
                                    <label
                                      key={rating}
                                      className={`flex-1 text-center text-[10px] sm:text-[11px] py-1.5 px-2 rounded border cursor-pointer font-medium transition-all ${
                                        currentVal === rating
                                          ? 'bg-[#3D6B4F] text-white border-[#3D6B4F] shadow-2xs'
                                          : 'bg-[#FAFAF8] text-[#4B5A6E] border-[#DDD8C9] hover:border-[#9C7A2E]'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`r_${key}`}
                                        value={rating}
                                        checked={currentVal === rating}
                                        onChange={() => setRating(key, rating as RatingValue)}
                                        className="sr-only"
                                      />
                                      {rating === 'Dilakukan dan Efektif'
                                        ? 'Efektif'
                                        : rating === 'Dilakukan tapi Belum Efektif'
                                        ? 'Belum Efektif'
                                        : 'Belum Dilakukan'}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Perilaku yang Dihindari */}
                      <div className="p-4 bg-white">
                        <div className="text-xs font-semibold text-[#9C4A3D] flex items-center gap-2 mb-3">
                          <span className="w-2 h-2 rounded-full bg-[#9C4A3D]" />
                          <span>Perilaku yang Dihindari</span>
                        </div>

                        <div className="space-y-3">
                          {ind.dihindari.map((text, idx) => {
                            const key = `${ind.id}_dihindari_${idx}`;
                            const currentVal = (currentRecord.ratings || {})[key] || '';

                            return (
                              <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2.5 border-b border-dashed border-[#EAE6D9] last:border-none"
                              >
                                <div className="md:col-span-7 text-xs text-[#1B2A41] leading-relaxed">
                                  {text}
                                </div>
                                <div className="md:col-span-5 flex flex-wrap sm:flex-nowrap gap-1.5">
                                  {RATINGS_LIST.map((rating) => (
                                    <label
                                      key={rating}
                                      className={`flex-1 text-center text-[10px] sm:text-[11px] py-1.5 px-2 rounded border cursor-pointer font-medium transition-all ${
                                        currentVal === rating
                                          ? 'bg-[#9C4A3D] text-white border-[#9C4A3D] shadow-2xs'
                                          : 'bg-[#FAFAF8] text-[#4B5A6E] border-[#DDD8C9] hover:border-[#9C7A2E]'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`r_${key}`}
                                        value={rating}
                                        checked={currentVal === rating}
                                        onChange={() => setRating(key, rating as RatingValue)}
                                        className="sr-only"
                                      />
                                      {rating === 'Dilakukan dan Efektif'
                                        ? 'Terjadi'
                                        : rating === 'Dilakukan tapi Belum Efektif'
                                        ? 'Sebagian'
                                        : 'Dihindari (Bagus)'}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {/* Catatan Umum Observer & Rekomendasi */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-4">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Catatan Umum Observer &amp; Rekomendasi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Catatan Umum</label>
                  <textarea
                    id="b_catatan"
                    rows={3}
                    value={currentRecord.catatanObs || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, catatanObs: e.target.value })}
                    placeholder="Catatan umum selama observasi pembelajaran berlangsung"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Rekomendasi</label>
                  <textarea
                    id="b_rekomendasi"
                    rows={3}
                    value={currentRecord.rekomendasi || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, rekomendasi: e.target.value })}
                    placeholder="Rekomendasi tindak lanjut bagi guru untuk meningkatkan efektivitas pembelajaran"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="border-t border-[#EAE6D9] pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => switchTab('A')}
                className="px-4 py-2 border border-[#DDD8C9] bg-white hover:bg-[#EAE6D9] rounded text-xs font-semibold text-[#1B2A41] flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Kembali ke Form A
              </button>

              <button
                type="button"
                onClick={() => switchTab('C')}
                className="px-5 py-2 bg-[#1B2A41] hover:bg-[#111c2e] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Lanjut ke Formulir C</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

        {/* ======================= FORM C ======================= */}
        {activeTab === 'C' && (
          <div className="bg-white border border-[#DDD8C9] rounded p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1B2A41] m-0">
                Formulir C — Tindak Lanjut Observasi Kinerja Guru
              </h2>
              <p className="text-xs text-[#4B5A6E] mt-1">
                Bagaimana upaya guru melakukan refleksi untuk menyadari kesulitannya dalam peningkatan pembelajaran?
              </p>
            </div>

            {/* Refleksi Guru */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-4">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Refleksi Guru
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-[#4B5A6E] font-medium block">Kategori Kesadaran Guru</label>
                <div className="flex flex-wrap gap-2" id="c_kategori_group">
                  {['Tidak Sadar Kesulitan', 'Sadar Kesulitan', 'Sadar Dampak Kesulitan'].map((kat) => (
                    <label
                      key={kat}
                      className={`px-3.5 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
                        currentRecord.kategoriKesadaranC === kat
                          ? 'border-[#9C7A2E] bg-[#FBF3E1] text-[#7A5F22] font-semibold'
                          : 'border-[#DDD8C9] bg-white text-[#4B5A6E] hover:border-[#9C7A2E]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="c_kategori"
                        value={kat}
                        checked={currentRecord.kategoriKesadaranC === kat}
                        onChange={() => onUpdateCurrentRecord({ ...currentRecord, kategoriKesadaranC: kat })}
                        className="sr-only"
                      />
                      {kat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Pertanyaan (Observer)</label>
                  <textarea
                    id="c_pertanyaan"
                    rows={2}
                    value={currentRecord.pertanyaanC || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, pertanyaanC: e.target.value })}
                    placeholder="Pertanyaan pemantik refleksi yang diajukan kepada guru"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Respon (Guru)</label>
                  <textarea
                    id="c_respon"
                    rows={2}
                    value={currentRecord.responC || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, responC: e.target.value })}
                    placeholder="Respon atau jawaban reflektif dari guru"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#4B5A6E] font-medium block">Catatan Tambahan Refleksi</label>
                <textarea
                  id="c_catatan"
                  rows={2}
                  value={currentRecord.catatanC || ''}
                  onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, catatanC: e.target.value })}
                  placeholder="Catatan tambahan hasil diskusi refleksi"
                  className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                />
              </div>
            </div>

            {/* Upaya Tindak Lanjut */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-4">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Upaya Tindak Lanjut
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Tujuan Tindak Lanjut</label>
                  <textarea
                    id="c_tujuan"
                    rows={2}
                    value={currentRecord.tujuanTL || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, tujuanTL: e.target.value })}
                    placeholder="Tujuan spesifik tindak lanjut yang disepakati"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Upaya Tindak Lanjut</label>
                  <textarea
                    id="c_upaya"
                    rows={2}
                    value={currentRecord.upayaTL || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, upayaTL: e.target.value })}
                    placeholder="Langkah nyata yang akan dilaksanakan guru"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Kapan (Target Waktu)</label>
                  <input
                    id="c_kapan"
                    value={currentRecord.kapanTL || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, kapanTL: e.target.value })}
                    placeholder="Contoh: 2 minggu ke depan"
                    className="w-full border border-[#DDD8C9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Kebutuhan Dukungan (Apa / Siapa)</label>
                  <input
                    id="c_dukungan"
                    value={currentRecord.dukunganTL || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, dukunganTL: e.target.value })}
                    placeholder="Contoh: pendampingan rekan sejawat, pelatihan PMM, sarana alat praktik"
                    className="w-full border border-[#DDD8C9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#4B5A6E] font-medium block">Catatan Kepala Sekolah</label>
                <textarea
                  id="c_catatankepsek"
                  rows={2}
                  value={currentRecord.catatanKepsekC || ''}
                  onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, catatanKepsekC: e.target.value })}
                  placeholder="Catatan persetujuan dan bimbingan dari Kepala Sekolah"
                  className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                />
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="border-t border-[#EAE6D9] pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => switchTab('B')}
                className="px-4 py-2 border border-[#DDD8C9] bg-white hover:bg-[#EAE6D9] rounded text-xs font-semibold text-[#1B2A41] flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Kembali ke Form B
              </button>

              <button
                type="button"
                onClick={() => switchTab('D')}
                className="px-5 py-2 bg-[#1B2A41] hover:bg-[#111c2e] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Lanjut ke Formulir D</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

        {/* ======================= FORM D ======================= */}
        {activeTab === 'D' && (
          <div className="bg-white border border-[#DDD8C9] rounded p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1B2A41] m-0">
                Formulir D — Refleksi Tindak Lanjut Observasi Kinerja Guru
              </h2>
              <p className="text-xs text-[#4B5A6E] mt-1">
                Merujuk pada kategori dan upaya tindak lanjut yang disepakati di Formulir C.
              </p>
            </div>

            {/* Kategori Tindak Lanjut */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-3">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Kategori Tindak Lanjut
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Pengembangan Kompetensi', 'Peningkatan Kinerja'].map((kat) => (
                  <label
                    key={kat}
                    className={`px-4 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
                      currentRecord.kategoriTLD === kat
                        ? 'border-[#9C7A2E] bg-[#FBF3E1] text-[#7A5F22] font-semibold'
                        : 'border-[#DDD8C9] bg-white text-[#4B5A6E] hover:border-[#9C7A2E]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="d_kategori"
                      value={kat}
                      checked={currentRecord.kategoriTLD === kat}
                      onChange={() => onUpdateCurrentRecord({ ...currentRecord, kategoriTLD: kat })}
                      className="sr-only"
                    />
                    {kat}
                  </label>
                ))}
              </div>
            </div>

            {/* Hasil: Capaian, Tantangan, Upaya Peningkatan */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-4">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Hasil Evaluasi Tindak Lanjut
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Capaian</label>
                  <textarea
                    id="d_capaian"
                    rows={3}
                    value={currentRecord.capaianD || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, capaianD: e.target.value })}
                    placeholder="Apa yang berhasil dicapai guru setelah tindak lanjut"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Tantangan</label>
                  <textarea
                    id="d_tantangan"
                    rows={3}
                    value={currentRecord.tantanganD || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, tantanganD: e.target.value })}
                    placeholder="Tantangan yang masih dihadapi selama pelaksanaan"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Upaya Peningkatan Lanjutan</label>
                  <textarea
                    id="d_upayapeningkatan"
                    rows={3}
                    value={currentRecord.upayaPeningkatanD || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, upayaPeningkatanD: e.target.value })}
                    placeholder="Upaya lanjutan yang direncanakan berikutnya"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Refleksi Tindak Lanjut */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-4">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Refleksi Tindak Lanjut (Kondisi Terkini)
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-[#4B5A6E] font-medium block">
                  Kategori Kesadaran (Setelah Dilakukan Tindak Lanjut)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Tidak Sadar Kesulitan', 'Sadar Kesulitan', 'Sadar Dampak Kesulitan'].map((kat) => (
                    <label
                      key={kat}
                      className={`px-3.5 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
                        currentRecord.kesadaranD === kat
                          ? 'border-[#9C7A2E] bg-[#FBF3E1] text-[#7A5F22] font-semibold'
                          : 'border-[#DDD8C9] bg-white text-[#4B5A6E] hover:border-[#9C7A2E]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="d_kesadaran"
                        value={kat}
                        checked={currentRecord.kesadaranD === kat}
                        onChange={() => onUpdateCurrentRecord({ ...currentRecord, kesadaranD: kat })}
                        className="sr-only"
                      />
                      {kat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Pertanyaan (Observer)</label>
                  <textarea
                    id="d_pertanyaan"
                    rows={2}
                    value={currentRecord.pertanyaanD || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, pertanyaanD: e.target.value })}
                    placeholder="Pertanyaan refleksi akhir pasca tindak lanjut"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#4B5A6E] font-medium block">Respon (Guru)</label>
                  <textarea
                    id="d_respon"
                    rows={2}
                    value={currentRecord.responD || ''}
                    onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, responD: e.target.value })}
                    placeholder="Respon guru terhadap capaian dan dampak pembelajaran"
                    className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#4B5A6E] font-medium block">Catatan Kepala Sekolah</label>
                <textarea
                  id="d_catatankepsek"
                  rows={2}
                  value={currentRecord.catatanKepsekD || ''}
                  onChange={(e) => onUpdateCurrentRecord({ ...currentRecord, catatanKepsekD: e.target.value })}
                  placeholder="Catatan akhir evaluasi dan apresiasi dari Kepala Sekolah"
                  className="w-full border border-[#DDD8C9] rounded p-2.5 text-xs focus:outline-none focus:border-[#9C7A2E]"
                />
              </div>
            </div>

            {/* Ringkasan Observasi Skor */}
            <div className="border-t border-[#EAE6D9] pt-5 space-y-3">
              <h3 className="font-serif font-semibold text-sm text-[#1B2A41]">
                Ringkasan Capaian Observasi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="summaryBox">
                {currentRecord.pickedIndicators?.length === 0 ? (
                  <p className="text-xs text-[#4B5A6E] italic">Belum ada indikator yang dinilai.</p>
                ) : (
                  currentRecord.pickedIndicators?.map(indId => {
                    const ind = INDICATORS.find(i => i.id === indId);
                    if (!ind) return null;

                    let indEfektif = 0;
                    const totalInd = ind.dianjurkan.length + ind.dihindari.length;

                    const ratings = currentRecord.ratings || {};

                    ind.dianjurkan.forEach((_, idx) => {
                      if (ratings[`${indId}_dianjurkan_${idx}`] === 'Dilakukan dan Efektif') {
                        indEfektif++;
                      }
                    });

                    ind.dihindari.forEach((_, idx) => {
                      if (ratings[`${indId}_dihindari_${idx}`] === 'Belum Dilakukan') {
                        indEfektif++;
                      }
                    });

                    const indPct = totalInd > 0 ? Math.round((indEfektif / totalInd) * 100) : 0;
                    const badgeClass =
                      indPct >= 70
                        ? 'bg-[#EAF1EA] text-[#3D6B4F]'
                        : indPct >= 40
                        ? 'bg-[#FBF3E1] text-[#7A5F22]'
                        : 'bg-[#F5EAE8] text-[#9C4A3D]';

                    return (
                      <div
                        key={indId}
                        className="p-3 bg-[#FAFAF8] border border-[#DDD8C9] rounded flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-semibold block text-[#1B2A41]">
                            Indikator {ind.id} — {ind.title}
                          </span>
                          <span className="text-[11px] text-[#4B5A6E]">
                            {indEfektif} dari {totalInd} perilaku target terpenuhi
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${badgeClass}`}>
                          {indPct}% Efektif
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Nav & Save Button */}
            <div className="border-t border-[#EAE6D9] pt-4 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => switchTab('C')}
                className="px-4 py-2 border border-[#DDD8C9] bg-white hover:bg-[#EAE6D9] rounded text-xs font-semibold text-[#1B2A41] flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Kembali ke Form C
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#9C7A2E] hover:bg-[#7A5F22] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Cloud size={14} />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan & Sinkron ke Spreadsheet'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-[#1B2A41] hover:bg-[#111c2e] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer size={14} />
                  <span>Cetak / Ekspor PDF</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL KONFIRMASI HAPUS */}
      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={async () => {
          if (itemToDelete) {
            setIsDeletingItem(true);
            try {
              await onDeleteSavedRecord(itemToDelete.id);
              if (selectedRecordId === itemToDelete.id) {
                setSelectedRecordId('');
              }
            } finally {
              setIsDeletingItem(false);
              setItemToDelete(null);
            }
          }
        }}
        recordName={itemToDelete?.name || 'Data Observasi'}
        recordSubtitle={itemToDelete?.subtitle}
        isDeleting={isDeletingItem}
      />

      {/* FOOTER WATERMARK BAGIAN BAWAH */}
      <footer className="text-center pt-4 pb-8 text-xs text-[#4B5A6E]/70 font-mono tracking-widest uppercase select-none">
        kikybahsoan · Platform Merdeka Mengajar (PMM)
      </footer>

    </div>
  );
};
