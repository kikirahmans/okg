import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ObservationData, SheetConfig, NotificationItem } from './types';
import { INITIAL_SAMPLE_RECORDS } from './data/indicators';
import {
  getStoredConfig,
  saveStoredConfig,
  getStoredRecords,
  saveStoredRecords,
  syncRecordToGoogleSheets,
  fetchRemoteRecords,
  deleteRecordFromGoogleSheets,
  normalizeObservationRecord
} from './services/googleSheets';
import { playNotificationSound, sendBrowserNotification } from './services/soundNotification';
import { HeaderNav } from './components/HeaderNav';
import { ObservationForm } from './components/ObservationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { DetailModal } from './components/DetailModal';
import { SheetsSettingsModal } from './components/SheetsSettingsModal';
import { Watermark } from './components/Watermark';

function createNewRecord(): ObservationData {
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

export default function App() {
  const [activeView, setActiveView] = useState<'form' | 'dashboard'>('form');
  const [records, setRecords] = useState<ObservationData[]>(() => {
    const saved = getStoredRecords();
    return saved.length > 0 ? saved : INITIAL_SAMPLE_RECORDS.map(normalizeObservationRecord);
  });

  const [currentRecord, setCurrentRecord] = useState<ObservationData>(() => {
    const saved = getStoredRecords();
    return saved.length > 0 ? saved[0] : normalizeObservationRecord(INITIAL_SAMPLE_RECORDS[0]);
  });

  const [config, setConfig] = useState<SheetConfig>(() => getStoredConfig());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [latestNotification, setLatestNotification] = useState<NotificationItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<ObservationData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const prevRecordCountRef = useRef(records.length);

  // Save records to storage whenever updated
  useEffect(() => {
    saveStoredRecords(records);
  }, [records]);

  // Save config whenever updated
  useEffect(() => {
    saveStoredConfig(config);
  }, [config]);

  // Trigger Notification Helper
  const triggerNewNotification = useCallback((title: string, message: string, record: ObservationData) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      guru: record.guru || 'Guru',
      kelas: record.kelas || 'Kelas',
      timestamp: new Date().toISOString(),
      read: false,
      recordId: record.id,
      efektifPct: record.persentaseEfektif || 0
    };

    setNotifications(prev => [newNotif, ...prev]);
    setLatestNotification(newNotif);

    if (config.soundEnabled) {
      playNotificationSound();
    }

    if (config.browserNotificationEnabled) {
      sendBrowserNotification(title, message);
    }
  }, [config.soundEnabled, config.browserNotificationEnabled]);

  // Handle Save to Google Sheets
  const handleSaveToSheets = async (recordToSave: ObservationData) => {
    setIsSaving(true);
    try {
      const updatedRecord: ObservationData = {
        ...recordToSave,
        updatedAt: new Date().toISOString(),
        syncedToGoogleSheets: true,
        syncTimestamp: new Date().toLocaleString('id-ID')
      };

      // Call Google Sheets API / Apps Script
      const syncResult = await syncRecordToGoogleSheets(updatedRecord, config);

      // Update local state
      setRecords(prev => {
        const idx = prev.findIndex(r => r.id === updatedRecord.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = updatedRecord;
          return copy;
        }
        return [updatedRecord, ...prev];
      });

      setCurrentRecord(updatedRecord);

      // Trigger automatic real-time notification
      const teacherName = (updatedRecord.guru || '').trim() || 'Guru';
      const className = (updatedRecord.kelas || '').trim() || 'Kelas';
      triggerNewNotification(
        `Data Observasi Baru: ${teacherName}`,
        `Observasi kinerja untuk ${className} telah disinkronkan ke Google Spreadsheet. Skor efektivitas: ${updatedRecord.persentaseEfektif || 0}%.`,
        updatedRecord
      );

      alert(syncResult.message || 'Data berhasil disimpan dan disinkronkan ke Google Spreadsheet!');
    } catch (err: unknown) {
      console.error('Error saving observation:', err);
      alert('Terjadi kesalahan saat menyimpan ke Google Spreadsheet.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Manual/Auto Refresh from Google Spreadsheet
  const handleRefreshFromSheets = useCallback(async (isInitial = false) => {
    if (!config.scriptUrl) {
      if (!isInitial) {
        alert('Untuk sinkronisasi live dua arah, hubungkan Google Apps Script Web App URL di menu Pengaturan.');
      }
      return;
    }

    setIsRefreshing(true);
    try {
      const res = await fetchRemoteRecords(config);
      if (res.success && res.records && res.records.length > 0) {
        const remoteList = res.records;

        setRecords(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const brandNewRecords = remoteList.filter(r => !existingIds.has(r.id));

          // Only alert for new records arriving during active session (not first mount)
          if (!isInitial && brandNewRecords.length > 0) {
            const newest = brandNewRecords[0];
            triggerNewNotification(
              `Data Baru dari Google Spreadsheet`,
              `${brandNewRecords.length} data baru masuk dari spreadsheet, termasuk observasi guru ${newest.guru || 'Guru'}.`,
              newest
            );
          }

          return remoteList;
        });

        // If current record in form is empty, load the latest from spreadsheet
        setCurrentRecord(curr => {
          if (!curr.guru && remoteList.length > 0) {
            return normalizeObservationRecord(remoteList[0]);
          }
          return curr;
        });
      }
    } catch (e) {
      console.warn('Refresh from sheets failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [config, triggerNewNotification]);

  // Initial load from Google Spreadsheet when scriptUrl is present
  useEffect(() => {
    if (config.scriptUrl) {
      handleRefreshFromSheets(true);
    }
  }, [config.scriptUrl, handleRefreshFromSheets]);

  // Real-time polling timer when configured with auto-sync
  useEffect(() => {
    if (!config.autoSync || !config.scriptUrl) return;

    const intervalSeconds = Math.max(10, config.syncIntervalSeconds || 15);
    const timer = setInterval(() => {
      handleRefreshFromSheets(false);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [config.autoSync, config.scriptUrl, config.syncIntervalSeconds, handleRefreshFromSheets]);

  // Load Record into active form
  const handleLoadRecordIntoForm = (rec: ObservationData) => {
    setCurrentRecord(normalizeObservationRecord(rec));
    setActiveView('form');
  };

  // Load Saved Record by ID from dropdown
  const handleLoadSavedRecordById = (id: string) => {
    const found = records.find(r => r.id === id);
    if (found) {
      setCurrentRecord(normalizeObservationRecord(found));
    }
  };

  // Delete Record (Lokal & Google Spreadsheet)
  const handleDeleteRecord = async (id: string) => {
    // 1. Update state segera agar responsif di UI
    const target = records.find(r => r.id === id);
    setRecords(prev => prev.filter(r => r.id !== id));
    
    // 2. Reset formulir jika data yang sedang diedit adalah yang dihapus
    if (currentRecord.id === id) {
      setCurrentRecord(createNewRecord());
    }

    // 3. Hapus dari Google Spreadsheet & catat ke deletedRecordIds agar tidak muncul lagi saat polling
    try {
      await deleteRecordFromGoogleSheets(id, config);
    } catch (e) {
      console.warn('Error deleting record from Google Sheets:', e);
    }

    // 4. Tampilkan info singkat
    setLatestNotification({
      id: `del_${Date.now()}`,
      teacherName: target?.guru || 'Data Observasi',
      school: target?.tempat || '',
      className: target?.kelas || '',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      score: target?.persentaseEfektif || 0
    });
  };

  // Add Sample Record for Immediate Live Testing
  const handleAddSampleRecord = () => {
    const teacherNames = [
      'Ahmad Zulkarnain, S.Pd.',
      'Dewi Lestari, M.Pd.',
      'Ir. Hendra Wijaya',
      'Fitri Handayani, S.Pd.I.',
      'Budi Santoso, S.T.'
    ];
    const classes = [
      'Teknik Komputer / XII TKJ-2',
      'Desain Komunikasi Visual / X DKV-1',
      'Akuntansi / XI AKL-3',
      'Tata Boga / XI Kuliner-1',
      'Otomotif / X TO-2'
    ];
    const randomTeacher = teacherNames[Math.floor(Math.random() * teacherNames.length)];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const randomInd1 = Math.floor(Math.random() * 4) + 1;
    const randomInd2 = Math.floor(Math.random() * 4) + 5;

    const newSample: ObservationData = {
      id: `obs_${Date.now()}_sample`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      guru: randomTeacher,
      kepsek: currentRecord.kepsek || 'Hj. Siti Rahmawati, S.Pd., M.M.',
      kelas: randomClass,
      tempat: currentRecord.tempat || 'SMK Negeri 1 Jakarta',
      periode: 'Januari - Juni 2026',
      tanggal: new Date().toISOString().slice(0, 10),
      pickedIndicators: [randomInd1, randomInd2],
      upayaBelajar: 'Mendiskusikan penerapan rubrik PMM bersama rekan sejawat dan merancang lembar asesmen formatif.',
      hariObs: new Date().toISOString().slice(0, 10),
      waktuObs: '08.30 - 10.00',
      perangkatAjar: 'Modul Ajar Pembelajaran Interaktif',
      hasilKerja: 'Keterlibatan aktif peserta didik meningkat dan kesepakatan kelas terlaksana baik.',
      catatanLain: 'Sesi observasi berlangsung lancar dan partisipatif.',
      ratings: {
        [`${randomInd1}_dianjurkan_0`]: 'Dilakukan dan Efektif',
        [`${randomInd1}_dianjurkan_1`]: 'Dilakukan dan Efektif',
        [`${randomInd1}_dianjurkan_2`]: 'Dilakukan tapi Belum Efektif',
        [`${randomInd1}_dihindari_0`]: 'Belum Dilakukan',
        [`${randomInd1}_dihindari_1`]: 'Belum Dilakukan',
        [`${randomInd1}_dihindari_2`]: 'Belum Dilakukan',
        [`${randomInd2}_dianjurkan_0`]: 'Dilakukan dan Efektif',
        [`${randomInd2}_dianjurkan_1`]: 'Dilakukan dan Efektif',
        [`${randomInd2}_dianjurkan_2`]: 'Dilakukan dan Efektif',
        [`${randomInd2}_dihindari_0`]: 'Belum Dilakukan',
        [`${randomInd2}_dihindari_1`]: 'Belum Dilakukan',
        [`${randomInd2}_dihindari_2`]: 'Belum Dilakukan',
      },
      catatanObs: 'Guru mengarahkan siswa dengan pendekatan positif dan interaktif.',
      rekomendasi: 'Pertahankan metode bimbingan kelompok dan perkuat apresiasi belajar.',
      kategoriKesadaranC: 'Sadar Dampak Kesulitan',
      pertanyaanC: 'Bagaimana siswa menanggapi variasi pertanyaan pemantik hari ini?',
      responC: 'Siswa tampak lebih aktif berebut menjawab dan berdiskusi.',
      catatanC: 'Refleksi berlangsung terbuka dan solutif.',
      tujuanTL: 'Mengembangkan media ajar interaktif berbasis digital.',
      upayaTL: 'Mengikuti pelatihan mandiri PMM topik media ajar.',
      kapanTL: 'Bulan depan',
      dukunganTL: 'Komunitas Belajar Sekolah',
      catatanKepsekC: 'Sangat baik, lanjutkan peningkatan kompetensi.',
      kategoriTLD: 'Peningkatan Kinerja',
      capaianD: 'Tingkat keaktifan siswa mencapai 90%.',
      tantanganD: 'Manajemen waktu presentasi kelompok.',
      upayaPeningkatanD: 'Menggunakan timer visual di layar proyektor.',
      kesadaranD: 'Sadar Dampak Kesulitan',
      pertanyaanD: 'Bagaimana dampak timer visual tersebut?',
      responD: 'Waktu presentasi tiap kelompok lebih tertib.',
      catatanKepsekD: 'Inisiatif yang sangat efektif.',
      totalPerilaku: 12,
      efektifCount: 5,
      belumEfektifCount: 1,
      belumDilakukanCount: 6,
      persentaseEfektif: 83,
      syncedToGoogleSheets: true,
      syncTimestamp: new Date().toLocaleString('id-ID')
    };

    setRecords(prev => [newSample, ...prev]);

    // Fire real-time notification with chime
    triggerNewNotification(
      `Observasi Baru Masuk: ${newSample.guru}`,
      `Data observasi baru untuk kelas ${newSample.kelas} berhasil ditambahkan dan disinkronkan ke Google Spreadsheet.`,
      newSample
    );
  };

  // Test Connection to user's Google Apps Script
  const handleTestConnection = async (url: string): Promise<boolean> => {
    if (!url || !url.startsWith('http')) return false;
    try {
      const res = await fetch(url, { method: 'GET' });
      const json = await res.json();
      return json.status === 'success' || !!json.total !== undefined;
    } catch {
      // Sometimes GAS returns redirected text
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#1B2A41] flex flex-col font-sans selection:bg-[#FBF3E1]">
      
      {/* App Header & Navigation */}
      <HeaderNav
        activeView={activeView}
        setActiveView={setActiveView}
        config={config}
        notifications={notifications}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearNotifications={() => setNotifications([])}
        onSelectRecordFromNotif={(id) => {
          const rec = records.find(r => r.id === id);
          if (rec) {
            setDetailRecord(rec);
          }
        }}
        onToggleSound={() => setConfig(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        totalRecordsCount={records.length}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'form' ? (
          <ObservationForm
            currentRecord={currentRecord}
            onUpdateCurrentRecord={setCurrentRecord}
            onSaveToSheets={handleSaveToSheets}
            savedRecords={records}
            onLoadSavedRecord={handleLoadSavedRecordById}
            onDeleteSavedRecord={handleDeleteRecord}
            config={config}
            isSaving={isSaving}
          />
        ) : (
          <AdminDashboard
            records={records}
            config={config}
            onRefreshFromSheets={handleRefreshFromSheets}
            isRefreshing={isRefreshing}
            onOpenDetail={(rec) => setDetailRecord(rec)}
            onLoadIntoForm={handleLoadRecordIntoForm}
            onDeleteRecord={handleDeleteRecord}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onAddSampleRecord={handleAddSampleRecord}
            latestNotification={latestNotification}
            onDismissNotification={() => setLatestNotification(null)}
          />
        )}
      </div>

      {/* Detail Inspection Modal */}
      {detailRecord && (
        <DetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
          onLoadIntoForm={handleLoadRecordIntoForm}
        />
      )}

      {/* Google Spreadsheet Configuration Modal */}
      {isSettingsOpen && (
        <SheetsSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={config}
          onSaveConfig={(newCfg) => setConfig(newCfg)}
          onTestConnection={handleTestConnection}
        />
      )}

      {/* Watermark Bagian Bawah & Samping (kikybahsoan) */}
      <Watermark text="kikybahsoan" showSide={true} showBottom={true} />

    </div>
  );
}
