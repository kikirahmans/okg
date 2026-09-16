import React from 'react';

interface Props {
  text?: string;
  showSide?: boolean;
  showBottom?: boolean;
}

export const Watermark: React.FC<Props> = ({
  text = 'kikybahsoan',
  showSide = true,
  showBottom = true
}) => {
  return (
    <>
      {/* SIDE WATERMARK — Samping Kanan (Fixed Vertical) */}
      {showSide && (
        <div
          aria-hidden="true"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none select-none hidden sm:flex flex-col items-center"
        >
          <div
            className="transform rotate-90 origin-right translate-x-2.5 px-3 py-1 bg-white/70 backdrop-blur-xs border border-[#DDD8C9]/80 rounded-t-md shadow-xs flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[#1B2A41]/50 uppercase font-mono"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C7A2E]/60"></span>
            <span>{text}</span>
          </div>
        </div>
      )}

      {/* SIDE WATERMARK — Samping Kiri (Fixed Vertical Subdued) */}
      {showSide && (
        <div
          aria-hidden="true"
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none select-none hidden lg:flex flex-col items-center"
        >
          <div
            className="transform -rotate-90 origin-left -translate-x-2.5 px-3 py-1 bg-white/70 backdrop-blur-xs border border-[#DDD8C9]/80 rounded-t-md shadow-xs flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[#1B2A41]/50 uppercase font-mono"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C7A2E]/60"></span>
            <span>{text}</span>
          </div>
        </div>
      )}

      {/* BOTTOM WATERMARK — Bagian Bawah (Fixed Floating Badge) */}
      {showBottom && (
        <div
          aria-hidden="true"
          className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none flex items-center"
        >
          <div className="px-3.5 py-1 bg-white/85 backdrop-blur-xs border border-[#DDD8C9] rounded-full shadow-xs flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#1B2A41]/60 uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C7A2E]"></span>
            <span>{text}</span>
          </div>
        </div>
      )}

      {/* PRINT-ONLY WATERMARKS (Samping & Bawah saat dicetak ke PDF/Kertas) */}
      <div
        aria-hidden="true"
        className="hidden print:block fixed right-2 top-1/2 -translate-y-1/2 transform rotate-90 origin-right text-[12px] font-bold tracking-[0.25em] text-gray-400/80 uppercase font-mono select-none"
      >
        {text}
      </div>
      <div
        aria-hidden="true"
        className="hidden print:block fixed left-2 top-1/2 -translate-y-1/2 transform -rotate-90 origin-left text-[12px] font-bold tracking-[0.25em] text-gray-400/80 uppercase font-mono select-none"
      >
        {text}
      </div>
      <div
        aria-hidden="true"
        className="hidden print:block fixed bottom-2 left-0 right-0 text-center text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase font-mono select-none"
      >
        — {text} —
      </div>
    </>
  );
};
