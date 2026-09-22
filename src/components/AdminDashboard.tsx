import React, { useState } from 'react';
import { ObservationData, SheetConfig, NotificationItem } from '../types';
import { INDICATORS } from '../data/indicators';
import { getStoredObservees } from '../data/observees';
import { exportToCSV } from '../services/googleSheets';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  Users,
  FileCheck,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface Props {
  records: ObservationData[];
  config: SheetConfig;
  onRefreshFromSheets: () => Promise<void>;
  isRefreshing: boolean;
  onOpenDetail: (record: ObservationData) => void;
  onLoadIntoForm: (record: ObservationData) => void;
  onDeleteRecord: (id: string) => void;
  onOpenSettings: () => void;
  onAddSampleRecord: () => void;
  onStartNewObservation?: (teacherName?: string) => void;
  latestNotification: NotificationItem | null;
  onDismissNotification: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  records,
  config,
  onRefreshFromSheets,
  isRefreshing,
  onOpenDetail,
  onLoadIntoForm,
  onDeleteRecord,
  onOpenSettings,
  onAddSampleRecord,
  onStartNewObservation,
  latestNotification,
  onDismissNotification
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndicatorFilter, setSelectedIndicatorFilter] = useState<number | 'all'>('all');
  const [selectedKesadaranFilter, setSelectedKesadaranFilter] = useState<string>('all');
  const [recordToDelete, setRecordToDelete] = useState<ObservationData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const observeeList = getStoredObservees();

  // Metrics Calculation
  const totalObservations = records.length;
  const uniqueTeachers = new Set(
    records
      .map(r => (r?.guru ? String(r.guru).trim().toLowerCase() : ''))
      .filter(Boolean)
  ).size;
  
  const avgEffectiveness = totalObservations > 0
    ? Math.round(records.reduce((acc, r) => acc + (r?.persentaseEfektif || 0), 0) / totalObservations)
    : 0;

  const latestObservation = records.length > 0
    ? records.reduce((latest, r) => {
        const t1 = new Date(r?.createdAt || 0).getTime();
        const t2 = new Date(latest?.createdAt || 0).getTime();
        return t1 > t2 ? r : latest;
      }, records[0])
    : null;

  // Indicator distribution
  const indicatorCounts: Record<number, number> = {};
  INDICATORS.forEach(ind => { indicatorCounts[ind.id] = 0; });
  records.forEach(r => {
    r.pickedIndicators?.forEach(id => {
      if (indicatorCounts[id] !== undefined) {
        indicatorCounts[id] += 1;
      }
    });
  });

  // Kesadaran breakdown
  const kesadaranCounts = {
    'Sadar Dampak Kesulitan': records.filter(r => r.kategoriKesadaranC === 'Sadar Dampak Kesulitan').length,
    'Sadar Kesulitan': records.filter(r => r.kategoriKesadaranC === 'Sadar Kesulitan').length,
    'Tidak Sadar Kesulitan': records.filter(r => r.kategoriKesadaranC === 'Tidak Sadar Kesulitan').length,
    'Belum Mengisi': records.filter(r => !r.kategoriKesadaranC).length,
  };

  // Filtered records
  const filteredRecords = records.filter(record => {
    const matchesSearch =
      (record.guru && record.guru.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.kelas && record.kelas.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.kepsek && record.kepsek.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.tempat && record.tempat.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndicator =
      selectedIndicatorFilter === 'all' ||
      (record.pickedIndicators && record.pickedIndicators.includes(selectedIndicatorFilter));

    const matchesKesadaran =
      selectedKesadaranFilter === 'all' || record.kategoriKesadaranC === selectedKesadaranFilter;

    return matchesSearch && matchesIndicator && matchesKesadaran;
  });

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-7 py-6 space-y-6 text-[#1B2A41]">
      
      {/* Real-time Notification Banner (Alerts Admin Instantly) */}
      {latestNotification && (
        <div className="bg-[#9C7A2E] text-white p-4 rounded-md shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center gap-2">
                <span>Notifikasi Real-Time: {latestNotification.title}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Data Baru Masuk
                </span>
              </p>
              <p className="text-xs text-white/90 mt-0.5">
                {latestNotification.message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const target = records.find(r => r.id === latestNotification.recordId);
                if (target) onOpenDetail(target);
                onDismissNotification();
              }}
              className="px-3 py-1.5 bg-white text-[#9C7A2E] hover:bg-white/90 text-xs font-bold rounded shadow-xs transition-colors"
            >
              Lihat Data
            </button>
            <button
              onClick={onDismissNotification}
              className="text-white/80 hover:text-white text-xs px-2 py-1"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Top Controls & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded border border-[#DDD8C9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-[#1B2A41] m-0">
              Dashboard Admin &amp; Pemantauan Kinerja
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-[#EAF1EA] px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-[#4B5A6E] mt-1">
            Data tersinkronisasi otomatis dengan Google Spreadsheet sebagai penyimpanan terpusat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {config.spreadsheetUrl && (
            <a
              href={config.spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-semibold bg-[#F5F3EC] hover:bg-[#EAE6D9] text-[#1B2A41] border border-[#DDD8C9] rounded flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} />
              <span>Buka Spreadsheet</span>
            </a>
          )}

          <button
            onClick={() => exportToCSV(records)}
            disabled={records.length === 0}
            className="px-3 py-2 text-xs font-semibold bg-[#F5F3EC] hover:bg-[#EAE6D9] text-[#1B2A41] border border-[#DDD8C9] rounded flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            title="Ekspor rekapan ke file CSV / Excel"
          >
            <Download size={14} />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onRefreshFromSheets}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-semibold bg-[#1B2A41] hover:bg-[#111c2e] text-white rounded flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-60"
            title="Perbarui data terbaru dari Google Spreadsheet"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Observasi */}
        <div className="bg-white p-4 rounded border border-[#DDD8C9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-md bg-[#1B2A41]/10 text-[#1B2A41] flex items-center justify-center shrink-0">
            <FileCheck size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#4B5A6E] uppercase tracking-wider block">
              Total Observasi
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#1B2A41]">
                {totalObservations}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">
                Tercatat di Sheet
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Guru Diobservasi */}
        <div className="bg-white p-4 rounded border border-[#DDD8C9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-md bg-[#9C7A2E]/15 text-[#9C7A2E] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#4B5A6E] uppercase tracking-wider block">
              Guru Diobservasi
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#1B2A41]">
                {uniqueTeachers}
              </span>
              <span className="text-[11px] text-[#4B5A6E]">
                Guru unik
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Rata-Rata Efektivitas */}
        <div className="bg-white p-4 rounded border border-[#DDD8C9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-md bg-[#3D6B4F]/15 text-[#3D6B4F] flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#4B5A6E] uppercase tracking-wider block">
              Rata-rata Capaian
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-[#3D6B4F]">
                {avgEffectiveness}%
              </span>
              <span className="text-[11px] text-[#3D6B4F] font-semibold">
                Perilaku Efektif
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Observasi Terakhir */}
        <div className="bg-white p-4 rounded border border-[#DDD8C9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#4B5A6E] uppercase tracking-wider block truncate">
              Observasi Terbaru
            </span>
            <p className="text-sm font-bold text-[#1B2A41] truncate m-0">
              {latestObservation ? latestObservation.guru : 'Belum ada'}
            </p>
            <p className="text-[11px] text-[#4B5A6E] truncate m-0">
              {latestObservation ? `${latestObservation.kelas}` : '-'}
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Row: Indicator Popularity & Kesadaran Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Indicator Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded border border-[#DDD8C9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1B2A41] m-0">
                Sebaran 8 Indikator Observasi (PMM)
              </h3>
              <p className="text-xs text-[#4B5A6E] mt-0.5">
                Frekuensi fokus indikator yang disepakati bersama guru pada Formulir A
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {INDICATORS.map(ind => {
              const count = indicatorCounts[ind.id] || 0;
              const pct = totalObservations > 0 ? Math.round((count / (totalObservations * 2)) * 100) : 0;
              return (
                <div key={ind.id} className="p-2.5 rounded border border-[#EAE6D9] bg-[#FAFAF8] text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-[#1B2A41] truncate max-w-[200px]" title={ind.title}>
                      {ind.id}. {ind.title}
                    </span>
                    <span className="font-bold text-[#9C7A2E] ml-2">
                      {count} sesi
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#DDD8C9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#9C7A2E] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, pct * 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Refleksi Kesadaran Guru Distribution (1 col) */}
        <div className="bg-white p-5 rounded border border-[#DDD8C9] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1B2A41] m-0">
              Kategori Kesadaran Guru (Form C)
            </h3>
            <p className="text-xs text-[#4B5A6E] mt-0.5">
              Refleksi guru terhadap kendala pembelajaran
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded bg-[#EAF1EA] border border-[#3D6B4F]/20 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#3D6B4F] block">Sadar Dampak Kesulitan</span>
                  <span className="text-[11px] text-[#4B5A6E]">Level refleksi tertinggi</span>
                </div>
                <span className="text-lg font-bold text-[#3D6B4F]">
                  {kesadaranCounts['Sadar Dampak Kesulitan']}
                </span>
              </div>

              <div className="p-3 rounded bg-[#FBF3E1] border border-[#9C7A2E]/20 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#7A5F22] block">Sadar Kesulitan</span>
                  <span className="text-[11px] text-[#4B5A6E]">Mengetahui kendala</span>
                </div>
                <span className="text-lg font-bold text-[#7A5F22]">
                  {kesadaranCounts['Sadar Kesulitan']}
                </span>
              </div>

              <div className="p-3 rounded bg-[#F5EAE8] border border-[#9C4A3D]/20 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#9C4A3D] block">Tidak Sadar Kesulitan</span>
                  <span className="text-[11px] text-[#4B5A6E]">Perlu bimbingan intensif</span>
                </div>
                <span className="text-lg font-bold text-[#9C4A3D]">
                  {kesadaranCounts['Tidak Sadar Kesulitan']}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#4B5A6E] bg-[#F5F3EC] p-2.5 rounded border border-[#DDD8C9]">
            🎯 Rekomendasi: Lakukan pendampingan coaching pada guru yang belum sadar kesulitan.
          </div>
        </div>

      </div>

      {/* 6 OBSERVEES DEDICATED TRACKER (Anti-Overwrite Management) */}
      <div className="bg-white rounded border border-[#DDD8C9] shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE6D9] pb-3">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1B2A41] flex items-center gap-2 m-0">
              <UserCheck size={18} className="text-[#9C7A2E]" />
              <span>Status & Progres Observasi 6 Guru Observee</span>
            </h3>
            <p className="text-xs text-[#4B5A6E] mt-0.5">
              Setiap guru memiliki ID observasi terpisah sehingga data baru tidak akan menimpa observasi sebelumnya.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F5F3EC] text-[#9C7A2E] border border-[#DDD8C9] self-start sm:self-auto">
            {records.filter(r => r.guru && observeeList.some(o => o.toLowerCase() === r.guru.toLowerCase())).length} Sesi Terdata
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {observeeList.map(name => {
            const teacherRecords = records.filter(
              r => r.guru && r.guru.trim().toLowerCase() === name.trim().toLowerCase()
            );
            const hasData = teacherRecords.length > 0;
            const latestRec = hasData ? teacherRecords[0] : null;

            return (
              <div
                key={name}
                className={`p-3.5 rounded border transition-all flex flex-col justify-between gap-3 ${
                  hasData
                    ? 'bg-[#FAFAF8] border-[#DDD8C9] hover:border-[#9C7A2E]/50'
                    : 'bg-white border-dashed border-[#DDD8C9]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-xs text-[#1B2A41] leading-tight">
                      {name}
                    </span>
                    {hasData ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        {latestRec?.persentaseEfektif || 0}% Efektif
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                        Belum Ada
                      </span>
                    )}
                  </div>

                  {hasData && latestRec ? (
                    <div className="text-[11px] text-[#4B5A6E] space-y-0.5">
                      <p className="m-0 truncate">
                        📚 {latestRec.kelas || 'Kelas belum diisi'}
                      </p>
                      <p className="m-0 text-[10px] text-gray-500">
                        🗓️ {latestRec.tanggal || 'Tanggal -'} ({teacherRecords.length} kali observasi)
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic m-0">
                      Belum ada sesi observasi yang disimpan untuk guru ini.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-[#EAE6D9]">
                  {hasData && latestRec ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onLoadIntoForm(latestRec)}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-[#EAE6D9] border border-[#DDD8C9] rounded text-[11px] font-semibold text-[#1B2A41] transition-colors"
                        title="Buka data observasi terakhir guru ini"
                      >
                        Buka Form
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDetail(latestRec)}
                        className="p-1.5 bg-white hover:bg-[#EAE6D9] border border-[#DDD8C9] rounded text-[#4B5A6E] transition-colors"
                        title="Lihat rincian lengkap"
                      >
                        <Eye size={13} />
                      </button>
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onStartNewObservation && onStartNewObservation(name)}
                    className="flex-1 py-1.5 px-2 bg-[#9C7A2E] hover:bg-[#856725] text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
                    title="Mulai observasi baru untuk guru ini (ID baru, tidak menimpa data sebelumnya)"
                  >
                    <PlusCircle size={12} />
                    <span>Observasi Baru</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Records Table Section */}
      <div className="bg-white rounded border border-[#DDD8C9] shadow-xs overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-[#DDD8C9] bg-[#FAFAF8] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-2.5 text-[#4B5A6E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, kelas, observer..."
              className="w-full pl-9 pr-3 py-1.5 border border-[#DDD8C9] rounded bg-white text-xs focus:outline-none focus:border-[#9C7A2E]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[#4B5A6E]">
              <Filter size={13} />
              <span>Indikator:</span>
            </div>
            <select
              value={selectedIndicatorFilter}
              onChange={(e) => setSelectedIndicatorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-2.5 py-1.5 border border-[#DDD8C9] rounded bg-white text-xs text-[#1B2A41] focus:outline-none"
            >
              <option value="all">Semua Indikator</option>
              {INDICATORS.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.id}. {ind.title}</option>
              ))}
            </select>

            <select
              value={selectedKesadaranFilter}
              onChange={(e) => setSelectedKesadaranFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#DDD8C9] rounded bg-white text-xs text-[#1B2A41] focus:outline-none"
            >
              <option value="all">Semua Kategori Kesadaran</option>
              <option value="Sadar Dampak Kesulitan">Sadar Dampak Kesulitan</option>
              <option value="Sadar Kesulitan">Sadar Kesulitan</option>
              <option value="Tidak Sadar Kesulitan">Tidak Sadar Kesulitan</option>
            </select>
          </div>

        </div>

        {/* Table of Records */}
        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-[#4B5A6E] space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F3EC] flex items-center justify-center text-xl">
                📂
              </div>
              <p className="font-semibold text-sm">Tidak ada data observasi yang cocok</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {records.length === 0
                  ? 'Belum ada observasi tersimpan. Anda dapat mengisi formulir observasi baru atau menambahkan data sampel pengujian.'
                  : 'Coba ubah kata kunci pencarian atau filter yang dipilih.'}
              </p>
              {records.length === 0 && (
                <button
                  onClick={onAddSampleRecord}
                  className="px-4 py-2 bg-[#9C7A2E] hover:bg-[#7A5F22] text-white rounded text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <PlusCircle size={14} />
                  Muat Contoh Data Observasi
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A41] text-white border-b border-[#DDD8C9] font-semibold">
                  <th className="py-3 px-4">Guru (Observee)</th>
                  <th className="py-3 px-3">Observer / KS</th>
                  <th className="py-3 px-3">Kelas / Tanggal</th>
                  <th className="py-3 px-3">Indikator Fokus</th>
                  <th className="py-3 px-3">Refleksi Guru</th>
                  <th className="py-3 px-3 text-center">Capaian Efektif</th>
                  <th className="py-3 px-3 text-center">Status Sheet</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6D9]">
                {filteredRecords.map((record) => {
                  const pct = record.persentaseEfektif || 0;
                  const badgeClass =
                    pct >= 70
                      ? 'bg-[#EAF1EA] text-[#3D6B4F] border-[#3D6B4F]/30'
                      : pct >= 40
                      ? 'bg-[#FBF3E1] text-[#7A5F22] border-[#9C7A2E]/30'
                      : 'bg-[#F5EAE8] text-[#9C4A3D] border-[#9C4A3D]/30';

                  return (
                    <tr key={record.id} className="hover:bg-[#FBF3E1]/30 transition-colors">
                      
                      {/* Guru */}
                      <td className="py-3 px-4 font-semibold text-[#1B2A41]">
                        <div>{record.guru || 'Tanpa Nama'}</div>
                        <span className="text-[11px] font-normal text-[#4B5A6E] block">
                          {record.tempat || 'SMK'}
                        </span>
                      </td>

                      {/* Observer */}
                      <td className="py-3 px-3 text-[#4B5A6E]">
                        {record.kepsek || '-'}
                      </td>

                      {/* Kelas & Tanggal */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#1B2A41]">{record.kelas || '-'}</div>
                        <span className="text-[11px] text-[#4B5A6E]">{record.tanggal || '-'}</span>
                      </td>

                      {/* Indikator */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {record.pickedIndicators?.map(id => (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-[#F5F3EC] border border-[#DDD8C9] rounded text-[10px] text-[#1B2A41] font-medium"
                              title={INDICATORS.find(i => i.id === id)?.title}
                            >
                              Ind {id}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Kesadaran */}
                      <td className="py-3 px-3">
                        {record.kategoriKesadaranC ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#FBF3E1] text-[#7A5F22]">
                            {record.kategoriKesadaranC}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* Skor Efektif */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-xs border ${badgeClass}`}>
                          {pct}%
                        </span>
                        <span className="block text-[10px] text-[#4B5A6E] mt-0.5">
                          {record.efektifCount}/{record.totalPerilaku} perilaku
                        </span>
                      </td>

                      {/* Status Google Sheets */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-[#EAF1EA] px-2 py-0.5 rounded-full"
                          title="Tersimpan di Google Spreadsheet"
                        >
                          <CheckCircle2 size={12} />
                          Tersinkron
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenDetail(record)}
                            className="p-1.5 rounded hover:bg-[#F5F3EC] text-[#1B2A41] transition-colors"
                            title="Lihat Formulir Lengkap"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => onLoadIntoForm(record)}
                            className="p-1.5 rounded hover:bg-[#F5F3EC] text-[#9C7A2E] transition-colors"
                            title="Buka di Formulir Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setRecordToDelete(record)}
                            className="p-1.5 rounded hover:bg-rose-50 text-rose-600 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer Stats */}
        <div className="bg-[#F5F3EC] px-4 py-3 border-t border-[#DDD8C9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5A6E]">
          <div>
            Menampilkan <strong>{filteredRecords.length}</strong> dari <strong>{records.length}</strong> data observasi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddSampleRecord}
              className="text-[#9C7A2E] hover:underline font-semibold flex items-center gap-1"
            >
              <PlusCircle size={13} />
              Tambah Contoh Data Baru (Uji Notifikasi)
            </button>
          </div>
        </div>

      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      <DeleteConfirmModal
        isOpen={Boolean(recordToDelete)}
        onClose={() => setRecordToDelete(null)}
        onConfirm={async () => {
          if (recordToDelete) {
            setIsDeleting(true);
            try {
              await onDeleteRecord(recordToDelete.id);
            } finally {
              setIsDeleting(false);
              setRecordToDelete(null);
            }
          }
        }}
        recordName={recordToDelete?.guru || 'Data Observasi'}
        recordSubtitle={`Kelas: ${recordToDelete?.kelas || '-'} · Tanggal: ${recordToDelete?.tanggal || '-'}`}
        isDeleting={isDeleting}
      />

      {/* FOOTER WATERMARK BAGIAN BAWAH */}
      <div className="text-center pt-2 pb-6 text-xs text-[#4B5A6E]/70 font-mono tracking-widest uppercase select-none">
        kikybahsoan · PMM SKP Observasi Kinerja Guru
      </div>

    </div>
  );
};
