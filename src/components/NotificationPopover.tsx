import React from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCheck, Trash2, Volume2, VolumeX, ExternalLink, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectRecord: (recordId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationPopover: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onSelectRecord,
  soundEnabled,
  onToggleSound
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-24px)] bg-white rounded-lg shadow-2xl border border-[#DDD8C9] overflow-hidden text-[#1B2A41] animate-in fade-in slide-in-from-top-2 duration-150">
      
      {/* Header */}
      <div className="bg-[#1B2A41] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-[#9C7A2E]" />
          <span className="font-semibold text-xs uppercase tracking-wider">Notifikasi Real-Time</span>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="bg-[#9C7A2E] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {notifications.filter(n => !n.read).length} baru
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={onClose}
            className="text-xs text-gray-300 hover:text-white px-1.5 py-0.5"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Action buttons */}
      {notifications.length > 0 && (
        <div className="bg-[#F5F3EC] px-4 py-1.5 border-b border-[#DDD8C9] flex items-center justify-between text-[11px] text-[#4B5A6E]">
          <button
            onClick={onMarkAllRead}
            className="hover:text-[#1B2A41] flex items-center gap-1 font-medium"
          >
            <CheckCheck size={13} />
            Tandai semua dibaca
          </button>
          <button
            onClick={onClearAll}
            className="hover:text-rose-700 flex items-center gap-1 font-medium"
          >
            <Trash2 size={13} />
            Hapus riwayat
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#EAE6D9]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[#4B5A6E] text-xs">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#F5F3EC] flex items-center justify-center text-lg">
              🔕
            </div>
            <p className="font-semibold">Belum ada notifikasi baru</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Notifikasi akan otomatis berbunyi dan muncul setiap kali formulir observasi baru masuk ke Google Spreadsheet.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onSelectRecord(n.recordId);
                onClose();
              }}
              className={`p-3 text-xs cursor-pointer transition-colors hover:bg-[#FBF3E1] ${
                !n.read ? 'bg-[#FBF3E1]/40 font-medium' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#9C7A2E] shrink-0" />
                  )}
                  <span className="font-semibold text-[#1B2A41] line-clamp-1">{n.title}</span>
                </div>
                <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                  <Clock size={10} />
                  {new Date(n.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-[#4B5A6E] text-[11px] mt-1 line-clamp-2">
                {n.message}
              </p>

              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="px-1.5 py-0.5 bg-[#EAF1EA] text-[#3D6B4F] rounded font-semibold">
                  Skor: {n.efektifPct}% Efektif
                </span>
                <span className="text-[#9C7A2E] hover:underline flex items-center gap-0.5">
                  Lihat detail <ExternalLink size={10} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="bg-[#F5F3EC] border-t border-[#DDD8C9] p-2 text-center text-[10px] text-[#4B5A6E]">
        Pembaruan otomatis tersinkron ke Google Spreadsheet
      </div>

    </div>
  );
};
