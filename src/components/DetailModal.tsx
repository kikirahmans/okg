import React from 'react';
import { ObservationData } from '../types';
import { INDICATORS } from '../data/indicators';
import { X, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  record: ObservationData | null;
  onClose: () => void;
  onLoadIntoForm: (record: ObservationData) => void;
}

export const DetailModal: React.FC<Props> = ({ record, onClose, onLoadIntoForm }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-[#DDD8C9] overflow-hidden text-[#1B2A41]">
        
        {/* Header */}
        <div className="bg-[#1B2A41] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#9C7A2E] flex items-center justify-center font-bold text-white text-base">
              📋
            </div>
            <div>
              <h2 className="text-base font-semibold font-serif leading-snug">
                Detail Observasi — {record.guru || 'Tanpa Nama'}
              </h2>
              <p className="text-xs text-[#B9C2CE]">
                {record.kelas} · {record.periode} · {record.tanggal || 'Tanpa tanggal'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              Cetak Dokumen
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#1B2A41]">
          
          {/* Identity Info Card */}
          <div className="bg-[#F5F3EC] p-4 rounded border border-[#DDD8C9] grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-[#4B5A6E] block">Nama Guru (Observee)</span>
              <span className="font-semibold text-sm">{record.guru || '-'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4B5A6E] block">Observer / Kepala Sekolah</span>
              <span className="font-semibold text-sm">{record.kepsek || '-'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4B5A6E] block">Mata Pelajaran / Kelas</span>
              <span className="font-semibold text-sm">{record.kelas || '-'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4B5A6E] block">Tempat / Sekolah</span>
              <span className="font-semibold text-sm">{record.tempat || '-'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4B5A6E] block">Periode</span>
              <span className="font-semibold text-sm">{record.periode || '-'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#4B5A6E] block">Hari / Tanggal</span>
              <span className="font-semibold text-sm">{record.tanggal || '-'}</span>
            </div>
          </div>

          {/* Skor Summary Badge */}
          <div className="flex items-center justify-between p-3.5 bg-[#EAF1EA] border border-[#3D6B4F]/20 rounded text-[#3D6B4F]">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} />
              <span className="font-semibold text-sm">Tingkat Capaian Perilaku Efektif</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">
                {record.efektifCount} dari {record.totalPerilaku} perilaku terlaksana efektif
              </span>
              <span className="text-lg font-bold bg-[#3D6B4F] text-white px-3 py-0.5 rounded-full">
                {record.persentaseEfektif}%
              </span>
            </div>
          </div>

          {/* FORM A REVIEW */}
          <div className="border border-[#DDD8C9] rounded p-4 space-y-3 bg-white">
            <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5">
              Formulir A — Diskusi Persiapan Observasi
            </h3>
            
            <div>
              <span className="font-semibold text-[#4B5A6E] block mb-1">Indikator Fokus yang Dipilih:</span>
              <div className="flex flex-wrap gap-2">
                {record.pickedIndicators?.length > 0 ? (
                  record.pickedIndicators.map(id => {
                    const ind = INDICATORS.find(i => i.id === id);
                    return (
                      <span key={id} className="px-2.5 py-1 bg-[#FBF3E1] border border-[#9C7A2E]/40 text-[#7A5F22] rounded font-semibold text-xs">
                        Indikator {id} — {ind?.title || ''}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400 italic">Belum ada indikator</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Upaya Mempelajari:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.upayaBelajar || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Perangkat Ajar &amp; Waktu:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.perangkatAjar || '-'} ({record.waktuObs || '-'})
                </p>
              </div>
            </div>
          </div>

          {/* FORM B REVIEW (Rubric) */}
          <div className="border border-[#DDD8C9] rounded p-4 space-y-3 bg-white">
            <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5">
              Formulir B — Pelaksanaan Observasi (Rubrik &amp; Catatan)
            </h3>

            {record.pickedIndicators?.map(indId => {
              const ind = INDICATORS.find(i => i.id === indId);
              if (!ind) return null;
              return (
                <div key={indId} className="border border-[#DDD8C9] rounded mb-3 overflow-hidden">
                  <div className="bg-[#F0EDE1] px-3 py-2 border-b border-[#DDD8C9] font-semibold text-xs text-[#1B2A41]">
                    Indikator {ind.id} — {ind.title}
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-[#3D6B4F] uppercase tracking-wider">Perilaku yang Dianjurkan</p>
                    {ind.dianjurkan.map((txt, idx) => {
                      const ratings = record.ratings || {};
                      const rating = ratings[`${ind.id}_dianjurkan_${idx}`] || 'Belum Dinilai';
                      return (
                        <div key={idx} className="flex items-center justify-between gap-2 py-1 border-b border-dashed border-[#EAE6D9] text-xs">
                          <span className="flex-1">{txt}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            rating === 'Dilakukan dan Efektif'
                              ? 'bg-[#EAF1EA] text-[#3D6B4F]'
                              : rating === 'Dilakukan tapi Belum Efektif'
                              ? 'bg-[#FBF3E1] text-[#7A5F22]'
                              : 'bg-[#F5EAE8] text-[#9C4A3D]'
                          }`}>
                            {rating}
                          </span>
                        </div>
                      );
                    })}

                    <p className="text-[11px] font-semibold text-[#9C4A3D] uppercase tracking-wider pt-2">Perilaku yang Dihindari</p>
                    {ind.dihindari.map((txt, idx) => {
                      const ratings = record.ratings || {};
                      const rating = ratings[`${ind.id}_dihindari_${idx}`] || 'Belum Dinilai';
                      return (
                        <div key={idx} className="flex items-center justify-between gap-2 py-1 border-b border-dashed border-[#EAE6D9] text-xs">
                          <span className="flex-1">{txt}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            rating === 'Belum Dilakukan'
                              ? 'bg-[#EAF1EA] text-[#3D6B4F]'
                              : 'bg-[#F5EAE8] text-[#9C4A3D]'
                          }`}>
                            {rating}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Catatan Observer:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.catatanObs || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Rekomendasi Observer:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.rekomendasi || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* FORM C & D REVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Form C */}
            <div className="border border-[#DDD8C9] rounded p-4 space-y-2 bg-white">
              <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5">
                Formulir C — Tindak Lanjut
              </h3>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Kategori Kesadaran Guru:</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full font-semibold text-xs bg-[#FBF3E1] text-[#7A5F22]">
                  {record.kategoriKesadaranC || 'Belum Diisi'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Upaya Tindak Lanjut:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.upayaTL || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Waktu &amp; Dukungan:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.kapanTL || '-'} · Dukungan: {record.dukunganTL || '-'}
                </p>
              </div>
            </div>

            {/* Form D */}
            <div className="border border-[#DDD8C9] rounded p-4 space-y-2 bg-white">
              <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5">
                Formulir D — Refleksi Tindak Lanjut
              </h3>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Kategori Tindak Lanjut:</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full font-semibold text-xs bg-[#EAF1EA] text-[#3D6B4F]">
                  {record.kategoriTLD || 'Belum Diisi'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Capaian:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.capaianD || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Tantangan &amp; Upaya Peningkatan:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41]">
                  {record.tantanganD || '-'} · Lanjutan: {record.upayaPeningkatanD || '-'}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F5F3EC] border-t border-[#DDD8C9] px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] text-[#4B5A6E] flex items-center gap-2">
            <Clock size={13} />
            <span>Tersimpan: {new Date(record.updatedAt || record.createdAt).toLocaleString('id-ID')}</span>
            <span className="text-gray-300">·</span>
            <span className="font-mono text-[10px] tracking-wider uppercase opacity-60">kikybahsoan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLoadIntoForm(record);
                onClose();
              }}
              className="px-4 py-2 bg-[#9C7A2E] hover:bg-[#7A5F22] text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              Buka di Formulir Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-[#DDD8C9] rounded text-xs font-semibold text-[#1B2A41] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
