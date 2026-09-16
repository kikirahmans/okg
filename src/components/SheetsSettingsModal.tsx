import React, { useState } from 'react';
import { SheetConfig } from '../types';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../services/googleSheets';
import { X, Check, Copy, ExternalLink, HelpCircle, Save, Volume2, Bell, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfig;
  onSaveConfig: (cfg: SheetConfig) => void;
  onTestConnection: (url: string) => Promise<boolean>;
}

export const SheetsSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTestConnection
}) => {
  const [scriptUrl, setScriptUrl] = useState(config.scriptUrl || '');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(config.spreadsheetUrl || '');
  const [syncInterval, setSyncInterval] = useState(config.syncIntervalSeconds || 15);
  const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled ?? true);
  const [browserNotification, setBrowserNotification] = useState(config.browserNotificationEnabled ?? false);
  const [copied, setCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await onTestConnection(scriptUrl);
      if (ok) {
        setTestResult({ success: true, message: 'Koneksi ke Google Spreadsheet Web App berhasil!' });
      } else {
        setTestResult({ success: false, message: 'Tidak dapat terhubung ke URL tersebut. Pastikan izin akses disetel ke "Anyone" (Siapa saja).' });
      }
    } catch {
      setTestResult({ success: false, message: 'Gagal menghubungi server Google Apps Script.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      scriptUrl: (scriptUrl || '').trim(),
      spreadsheetUrl: (spreadsheetUrl || '').trim(),
      syncIntervalSeconds: Number(syncInterval),
      soundEnabled,
      browserNotificationEnabled: browserNotification
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-[#DDD8C9] overflow-hidden text-[#1B2A41]">
        
        {/* Modal Header */}
        <div className="bg-[#1B2A41] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#9C7A2E] flex items-center justify-center font-bold text-white shadow-xs">
              📊
            </div>
            <div>
              <h2 className="text-base font-semibold font-serif">Pengaturan Google Spreadsheet</h2>
              <p className="text-xs text-[#B9C2CE]">Penyimpanan Utama & Sinkronisasi Real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Main Info */}
          <div className="bg-[#EBF7EE] border border-[#B9E1C2] p-4 rounded text-xs text-[#1E562F] flex items-start gap-3">
            <span className="text-base">✅</span>
            <div>
              <p className="font-semibold mb-1">Google Apps Script Tersemat &amp; Siap Sinkronisasi Otomatis</p>
              <p className="leading-relaxed">
                URL Google Apps Script Web App Anda telah disematkan secara permanen ke sistem. Data Formulir Observasi Guru (Form A, B, C, D) akan dikirim dan tersinkronkan langsung ke Google Spreadsheet Anda secara real-time.
              </p>
            </div>
          </div>

          {/* Web App URL Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-[#1B2A41] flex items-center justify-between">
              <span>URL Aplikasi Web (Google Apps Script Web App URL)</span>
              <button
                type="button"
                onClick={() => setShowTutorial(!showTutorial)}
                className="text-[#9C7A2E] hover:underline flex items-center gap-1 font-normal text-xs"
              >
                <HelpCircle size={14} />
                {showTutorial ? 'Sembunyikan Panduan' : 'Cara Mendapatkan URL'}
              </button>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3 py-2 border border-[#DDD8C9] rounded text-sm focus:outline-none focus:border-[#9C7A2E] bg-[#FAFAF8]"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !(scriptUrl || '').trim()}
                className="px-3 py-2 bg-[#F5F3EC] hover:bg-[#EAE6D9] border border-[#DDD8C9] rounded text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
                {testing ? 'Menguji...' : 'Uji Koneksi'}
              </button>
            </div>
            {testResult && (
              <p className={`text-xs mt-1 font-medium ${testResult.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                {testResult.message}
              </p>
            )}
          </div>

          {/* Spreadsheet Link Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-[#1B2A41] flex items-center justify-between">
              <span>Tautan Dokumen Google Spreadsheet (Opsional)</span>
              {spreadsheetUrl && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#9C7A2E] hover:underline flex items-center gap-1 text-xs"
                >
                  Buka Spreadsheet <ExternalLink size={12} />
                </a>
              )}
            </label>
            <input
              type="url"
              value={spreadsheetUrl}
              onChange={(e) => setSpreadsheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-3 py-2 border border-[#DDD8C9] rounded text-sm focus:outline-none focus:border-[#9C7A2E] bg-[#FAFAF8]"
            />
            <p className="text-[11px] text-[#4B5A6E]">
              Digunakan untuk pintasan tombol &quot;Buka Spreadsheet&quot; langsung dari Admin Dashboard.
            </p>
          </div>

          {/* Step-by-Step Tutorial Card */}
          {showTutorial && (
            <div className="border border-[#DDD8C9] rounded-md p-4 bg-[#F5F3EC] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-[#1B2A41] uppercase tracking-wide">
                  Panduan 3 Menit Pasang di Google Spreadsheet:
                </h4>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 bg-[#9C7A2E] hover:bg-[#7A5F22] text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Tersalin!' : 'Salin Skrip Google Apps Script'}
                </button>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#4B5A6E] leading-relaxed">
                <li>Buka atau buat file Google Spreadsheet baru di <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-[#9C7A2E] underline">sheets.new</a>.</li>
                <li>Beri nama spreadsheet, contoh: <strong>Observasi Kinerja Guru PMM 2026</strong>.</li>
                <li>Klik menu <strong>Ekstensi (Extensions) &gt; Apps Script</strong>.</li>
                <li>Hapus kode di layar editor, lalu <strong>tempel (paste)</strong> skrip yang sudah disalin di atas.</li>
                <li>Klik tombol biru <strong>Terapkan (Deploy) &gt; Deployment baru (New deployment)</strong>.</li>
                <li>Pilih jenis <strong>Aplikasi Web (Web App)</strong>.</li>
                <li>Pada opsi <em>&quot;Siapa yang memiliki akses&quot; (Who has access)</em>, pilih <strong>&quot;Siapa saja&quot; (Anyone)</strong> agar formulir dapat mengirim data.</li>
                <li>Klik <strong>Deploy</strong>, lalu salin <strong>URL Aplikasi Web</strong> yang diakhiri dengan <code>/exec</code> dan tempelkan pada kolom di atas!</li>
              </ol>
            </div>
          )}

          {/* Real-time Settings & Notifications */}
          <div className="border-t border-[#EAE6D9] pt-4 space-y-4">
            <h4 className="font-semibold text-xs text-[#1B2A41] uppercase tracking-wider">
              Notifikasi &amp; Pembaruan Real-Time Admin
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sound toggle */}
              <label className="flex items-center gap-3 p-3 border border-[#DDD8C9] rounded bg-[#FAFAF8] cursor-pointer hover:border-[#9C7A2E]">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="accent-[#9C7A2E] w-4 h-4 rounded"
                />
                <div className="flex items-center gap-2 text-xs">
                  <Volume2 size={16} className="text-[#9C7A2E]" />
                  <div>
                    <span className="font-semibold block text-[#1B2A41]">Suara Lonceng Notifikasi</span>
                    <span className="text-[#4B5A6E] text-[11px]">Bunyikan nada saat ada observasi baru masuk</span>
                  </div>
                </div>
              </label>

              {/* Browser Notification toggle */}
              <label className="flex items-center gap-3 p-3 border border-[#DDD8C9] rounded bg-[#FAFAF8] cursor-pointer hover:border-[#9C7A2E]">
                <input
                  type="checkbox"
                  checked={browserNotification}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    setBrowserNotification(checked);
                    if (checked && 'Notification' in window) {
                      await Notification.requestPermission();
                    }
                  }}
                  className="accent-[#9C7A2E] w-4 h-4 rounded"
                />
                <div className="flex items-center gap-2 text-xs">
                  <Bell size={16} className="text-[#9C7A2E]" />
                  <div>
                    <span className="font-semibold block text-[#1B2A41]">Notifikasi Pop-up Browser</span>
                    <span className="text-[#4B5A6E] text-[11px]">Munculkan peringatan desktop sistem</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Sync Interval */}
            <div className="flex items-center justify-between text-xs bg-[#FAFAF8] p-3 border border-[#DDD8C9] rounded">
              <span className="font-medium text-[#1B2A41]">Frekuensi Pembaruan Real-Time Admin:</span>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(Number(e.target.value))}
                className="px-3 py-1.5 border border-[#DDD8C9] rounded bg-white font-medium text-xs text-[#1B2A41] focus:outline-none focus:border-[#9C7A2E]"
              >
                <option value={10}>Setiap 10 Detik (Sangat Cepat)</option>
                <option value={15}>Setiap 15 Detik (Disarankan)</option>
                <option value={30}>Setiap 30 Detik</option>
                <option value={60}>Setiap 1 Menit</option>
              </select>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F5F3EC] border-t border-[#DDD8C9] px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#4B5A6E] hover:text-[#1B2A41] hover:bg-black/5 rounded transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#1B2A41] hover:bg-[#111c2e] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save size={14} />
            Simpan Pengaturan
          </button>
        </div>

      </div>
    </div>
  );
};
