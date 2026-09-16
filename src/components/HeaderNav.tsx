import React from 'react';
import { SheetConfig, NotificationItem } from '../types';
import { Bell, Settings, FileText, LayoutDashboard, Radio } from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

interface Props {
  activeView: 'form' | 'dashboard';
  setActiveView: (view: 'form' | 'dashboard') => void;
  config: SheetConfig;
  notifications: NotificationItem[];
  onOpenSettings: () => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
  onSelectRecordFromNotif: (recordId: string) => void;
  onToggleSound: () => void;
  totalRecordsCount: number;
}

export const HeaderNav: React.FC<Props> = ({
  activeView,
  setActiveView,
  config,
  notifications,
  onOpenSettings,
  onMarkAllRead,
  onClearNotifications,
  onSelectRecordFromNotif,
  onToggleSound,
  totalRecordsCount
}) => {
  const [showNotifPopover, setShowNotifPopover] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-[#1B2A41] text-[#F0EEE4] border-b border-[#111c2e] shadow-md sticky top-0 z-40">
      
      {/* Top bar with title and quick actions */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#9C7A2E] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            PMM
          </div>
          <div>
            <h1 className="font-serif font-semibold text-lg sm:text-xl tracking-tight leading-tight m-0">
              Observasi Kinerja Guru
            </h1>
            <p className="text-xs text-[#B9C2CE] m-0 hidden sm:block">
              Pengelolaan Kinerja Guru dan Kepala Sekolah · Platform Merdeka Mengajar
            </p>
          </div>
        </div>

        {/* Action icons & view buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Sync Status Pill */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            title="Klik untuk melihat konfigurasi Google Spreadsheet"
          >
            <Radio size={12} className={config.scriptUrl ? 'text-emerald-400 animate-pulse' : 'text-amber-300'} />
            <span className="text-[11px] text-[#F0EEE4]">
              {config.scriptUrl ? 'Spreadsheet Terhubung' : 'Mode Spreadsheet Lokal'}
            </span>
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => setShowNotifPopover(!showNotifPopover)}
              aria-label="Notifikasi Real-time"
              className="relative p-2 rounded hover:bg-white/10 text-white transition-colors"
              title="Notifikasi Real-Time Data Masuk"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9C7A2E] text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationPopover
              isOpen={showNotifPopover}
              onClose={() => setShowNotifPopover(false)}
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
              onClearAll={onClearNotifications}
              onSelectRecord={(id) => {
                onSelectRecordFromNotif(id);
                setShowNotifPopover(false);
              }}
              soundEnabled={config.soundEnabled}
              onToggleSound={onToggleSound}
            />
          </div>

          {/* Google Spreadsheet Settings button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
          >
            <Settings size={14} />
            <span className="hidden sm:inline">Pengaturan Spreadsheet</span>
          </button>

        </div>

      </div>

      {/* Navigation Switcher Tabs */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 flex items-center justify-between border-t border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('form')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeView === 'form'
                ? 'text-white border-[#9C7A2E] bg-white/5'
                : 'text-[#B9C2CE] border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText size={16} />
            <span>Formulir Observasi (Form A - D)</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all relative ${
              activeView === 'dashboard'
                ? 'text-white border-[#9C7A2E] bg-white/5'
                : 'text-[#B9C2CE] border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard Admin &amp; Real-Time</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#9C7A2E] text-white font-bold">
              {totalRecordsCount}
            </span>
          </button>
        </div>

        {/* Live status badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#B9C2CE]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px]">Real-Time Sync Active</span>
        </div>
      </div>

    </header>
  );
};
