import React, { useState, useEffect } from 'react';
import { ObservationData } from '../types';
import { AIAssistantType, AIAssistantResult, requestAIAssistance } from '../services/aiAssistant';
import { Sparkles, X, Check, Copy, RefreshCw, ArrowRight, Lightbulb, Bot, Wand2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  type: AIAssistantType;
  record: ObservationData;
  onClose: () => void;
  onApply: (text: string, mode: 'replace' | 'append') => void;
}

export const AIAssistantModal: React.FC<Props> = ({
  isOpen,
  type,
  record,
  onClose,
  onApply
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAssistantResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await requestAIAssistance(type, record);
      setResult(data);
      setSelectedIndex(0);
    } catch (e) {
      console.error('Failed to get AI suggestions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    } else {
      setResult(null);
      setCopiedIndex(null);
    }
  }, [isOpen, type, record.id]);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getBadgeLabel = () => {
    switch (type) {
      case 'rekomendasi_b':
        return 'Formulir B — Rekomendasi Observer';
      case 'pertanyaan_c':
        return 'Formulir C — Pertanyaan Pemantik';
      case 'pertanyaan_d':
        return 'Formulir D — Pertanyaan Refleksi Akhir';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col border border-[#DDD8C9] overflow-hidden text-[#1B2A41]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B2A41] to-[#2B3E5C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-[#9C7A2E] flex items-center justify-center text-white shadow-xs">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base m-0 text-white">
                  AI Asisten PMM
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  {result?.source === 'gemini' ? '✨ Gemini AI' : '💡 Rekomendasi Pintar'}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 m-0 mt-0.5">
                {getBadgeLabel()} · Untuk {record.guru || 'Guru Observee'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#9C7A2E] border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#1B2A41]">
                  Menghubungkan ke AI Asisten...
                </p>
                <p className="text-[11px] text-[#4B5A6E] mt-0.5">
                  Menganalisis hasil observasi, catatan rubrik, dan fokus perilaku kelas
                </p>
              </div>
            </div>
          ) : result && result.suggestions && result.suggestions.length > 0 ? (
            <>
              <div className="flex items-center justify-between text-xs text-[#4B5A6E] pb-1 border-b border-[#EAE6D9]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lightbulb size={14} className="text-[#9C7A2E]" />
                  Pilih salah satu saran rekomendasi atau pertanyaan berikut:
                </span>
                <button
                  onClick={fetchSuggestions}
                  className="text-[11px] font-semibold text-[#9C7A2E] hover:text-[#7A5F22] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Buat Ulang</span>
                </button>
              </div>

              <div className="space-y-3">
                {result.suggestions.map((text, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isCopied = copiedIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#9C7A2E] bg-[#FAF8F3] shadow-xs ring-1 ring-[#9C7A2E]'
                          : 'border-[#DDD8C9] bg-white hover:border-[#9C7A2E]/60 hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#9C7A2E] text-white'
                                : 'bg-[#EAE6D9] text-[#4B5A6E]'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-xs leading-relaxed text-[#1B2A41] m-0">
                            {text}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(text, idx);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#1B2A41] hover:bg-gray-100 rounded transition-colors shrink-0"
                          title="Salin ke papan klip"
                        >
                          {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>

                      {/* Action buttons on active card */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-[#EAE6D9] flex flex-wrap items-center justify-end gap-2 animate-in fade-in duration-150">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApply(text, 'append');
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded text-[11px] font-medium border border-[#DDD8C9] bg-white hover:bg-gray-50 text-[#4B5A6E] transition-colors"
                          >
                            Tambahkan di Akhir Teks
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApply(text, 'replace');
                              onClose();
                            }}
                            className="px-3.5 py-1.5 rounded text-[11px] font-semibold bg-[#9C7A2E] hover:bg-[#7A5F22] text-white shadow-2xs flex items-center gap-1.5 transition-colors"
                          >
                            <Check size={13} />
                            <span>Gunakan Saran Ini</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs text-[#4B5A6E]">
              <p>Tidak ada saran yang dapat dimuat.</p>
              <button
                onClick={fetchSuggestions}
                className="mt-2 px-3 py-1.5 rounded bg-[#9C7A2E] text-white text-xs font-semibold"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#FAF8F3] border-t border-[#DDD8C9] px-6 py-3 flex items-center justify-between text-[11px] text-[#4B5A6E]">
          <div className="flex items-center gap-1.5">
            <Wand2 size={13} className="text-[#9C7A2E]" />
            <span>Saran dirancang selaras dengan panduan rubrik observasi PMM Kemdikbudristek.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-[#DDD8C9] bg-white text-[#1B2A41] hover:bg-gray-50 text-xs font-medium"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
