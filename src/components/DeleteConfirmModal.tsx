import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordName: string;
  recordSubtitle?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  recordName,
  recordSubtitle,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-[#DDD8C9] overflow-hidden text-[#1B2A41] transform transition-all">
        
        {/* Header */}
        <div className="bg-rose-50 px-5 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">Konfirmasi Hapus Data</h3>
              <p className="text-[11px] text-rose-700">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs text-[#4B5A6E] leading-relaxed">
          <p>
            Apakah Anda yakin ingin menghapus data observasi kinerja berikut?
          </p>
          
          <div className="p-3 bg-[#F5F3EC] border border-[#DDD8C9] rounded-lg text-[#1B2A41]">
            <div className="font-bold text-sm text-[#1B2A41]">{recordName || 'Data Observasi'}</div>
            {recordSubtitle && (
              <div className="text-[11px] text-[#4B5A6E] mt-0.5">{recordSubtitle}</div>
            )}
          </div>

          <p className="text-[11px] text-[#7A5F22] bg-[#FBF3E1] p-2.5 rounded border border-[#DDD8C9]">
            Data akan dihapus secara permanen dari sistem dan tidak akan ditampilkan lagi di Dashboard Admin.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-[#F5F3EC] px-5 py-3.5 border-t border-[#DDD8C9] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-[#4B5A6E] hover:text-[#1B2A41] hover:bg-black/5 rounded-md transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
          </button>
        </div>

      </div>
    </div>
  );
};
