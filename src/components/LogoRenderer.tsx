import React from 'react';
import { LogoPreset } from '../types';

interface Props {
  type: LogoPreset;
  customUrl?: string;
  width?: number;
  className?: string;
  alt?: string;
}

export const LogoRenderer: React.FC<Props> = ({
  type,
  customUrl,
  width = 64,
  className = '',
  alt = 'Logo'
}) => {
  if (type === 'none') {
    return null;
  }

  if (type === 'custom' && customUrl) {
    return (
      <img
        src={customUrl}
        alt={alt}
        style={{ width: `${width}px`, maxWidth: `${width}px` }}
        className={`object-contain max-h-20 shrink-0 ${className}`}
      />
    );
  }

  // PRESET 1: TUT WURI HANDAYANI (Kemdikbud)
  if (type === 'preset_tutwuri') {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{ width: `${width}px`, height: `${width}px` }}
        className={`shrink-0 ${className}`}
        aria-label="Logo Tut Wuri Handayani"
      >
        <circle cx="50" cy="50" r="48" fill="#FAF8F3" stroke="#1B2A41" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#9C7A2E" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Sayap Garuda / Daun */}
        <polygon points="50,14 58,34 81,34 63,48 70,70 50,56 30,70 37,48 19,34 42,34" fill="#9C7A2E" />
        {/* Lingkaran Pusat */}
        <circle cx="50" cy="50" r="16" fill="#1B2A41" />
        <circle cx="50" cy="50" r="12" fill="#FAF8F3" />
        {/* Belimbing & Obor */}
        <path d="M42,50 Q50,42 58,50" stroke="#9C7A2E" strokeWidth="2" fill="none" />
        <circle cx="50" cy="45" r="2.5" fill="#C53030" />
        <path d="M45,55 L55,55" stroke="#1B2A41" strokeWidth="1.5" />
      </svg>
    );
  }

  // PRESET 2: GARUDA PANCASILA
  if (type === 'preset_garuda') {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{ width: `${width}px`, height: `${width}px` }}
        className={`shrink-0 ${className}`}
        aria-label="Logo Garuda Pancasila"
      >
        <circle cx="50" cy="50" r="48" fill="#FFFDF8" stroke="#9C7A2E" strokeWidth="2" />
        {/* Sayap Emas */}
        <path
          d="M50,20 C35,28 20,40 18,60 C24,64 34,60 40,55 C42,66 46,75 50,82 C54,75 58,66 60,55 C66,60 76,64 82,60 C80,40 65,28 50,20 Z"
          fill="#D4AF37"
          stroke="#856404"
          strokeWidth="1.5"
        />
        {/* Perisai Merah Putih & Bintang */}
        <path d="M42,42 L58,42 L58,56 C58,62 50,68 50,68 C50,68 42,62 42,56 Z" fill="#C53030" stroke="#1B2A41" strokeWidth="1.2" />
        <path d="M50,42 L58,42 L58,56 C58,62 50,68 50,68 Z" fill="#FFFFFF" />
        <polygon points="50,45 52,49 56,49 53,52 54,56 50,53 46,56 47,52 44,49 48,49" fill="#FFD700" />
        {/* Pita Bhinneka Tunggal Ika */}
        <rect x="28" y="79" width="44" height="7" rx="2" fill="#FFFFFF" stroke="#1B2A41" strokeWidth="1" />
        <text x="50" y="84" fontSize="4.2" fontWeight="bold" textAnchor="middle" fill="#1B2A41">
          BHINNEKA TUNGGAL IKA
        </text>
      </svg>
    );
  }

  // PRESET 3: LAMBANG PEMERINTAH PROVINSI / DAERAH
  if (type === 'preset_provinsi') {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{ width: `${width}px`, height: `${width}px` }}
        className={`shrink-0 ${className}`}
        aria-label="Lambang Daerah Provinsi"
      >
        <polygon points="50,8 90,26 90,62 50,92 10,62 10,26" fill="#1B2A41" stroke="#9C7A2E" strokeWidth="2.5" />
        <polygon points="50,14 84,30 84,59 50,85 16,59 16,30" fill="#FAF8F3" stroke="#DDD8C9" strokeWidth="1" />
        {/* Simbol Padi & Kapas */}
        <path d="M30,70 C24,50 32,34 50,30 C68,34 76,50 70,70" fill="none" stroke="#2F855A" strokeWidth="2.5" />
        <circle cx="50" cy="46" r="10" fill="#9C7A2E" />
        <polygon points="50,38 53,44 59,44 54,48 56,54 50,50 44,54 46,48 41,44 47,44" fill="#FAF8F3" />
        <text x="50" y="66" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#1B2A41">
          PEMDA
        </text>
      </svg>
    );
  }

  // PRESET 4: PMM / MERDEKA MENGAJAR
  if (type === 'preset_pmm') {
    return (
      <div
        style={{ width: `${width}px` }}
        className={`border-2 border-[#1B2A41] bg-white rounded-lg p-1.5 flex flex-col items-center justify-center text-center shadow-2xs ${className}`}
      >
        <span className="text-[14px] leading-none font-extrabold text-[#9C7A2E] tracking-tight font-serif">
          PMM
        </span>
        <span className="text-[7.5px] leading-tight font-bold text-[#1B2A41] uppercase tracking-wider block mt-0.5">
          Merdeka
        </span>
        <span className="text-[6.5px] leading-tight font-semibold text-gray-500 uppercase tracking-widest block">
          Mengajar
        </span>
      </div>
    );
  }

  // PRESET 5: SMK BISA - SMK HEBAT
  if (type === 'preset_smk') {
    return (
      <div
        style={{ width: `${width}px` }}
        className={`border-2 border-[#9C7A2E] bg-white rounded-lg p-1.5 flex flex-col items-center justify-center text-center shadow-2xs ${className}`}
      >
        <span className="text-[13px] leading-none font-black text-[#1B2A41] tracking-tight">
          SMK
        </span>
        <span className="text-[8px] leading-tight font-extrabold text-[#C53030] uppercase tracking-wider block mt-0.5">
          Bisa!
        </span>
        <span className="text-[7px] leading-tight font-bold text-[#9C7A2E] uppercase tracking-widest block">
          Hebat
        </span>
      </div>
    );
  }

  return null;
};
