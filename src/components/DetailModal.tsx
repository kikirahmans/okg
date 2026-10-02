import React from 'react';
import { ObservationData } from '../types';
import { INDICATORS } from '../data/indicators';
import { X, Printer, CheckCircle, Clock, AlertCircle, MessageSquare, Sliders } from 'lucide-react';

interface Props {
  record: ObservationData | null;
  onClose: () => void;
  onLoadIntoForm: (record: ObservationData) => void;
  onOpenKopSettings?: () => void;
}

export const DetailModal: React.FC<Props> = ({ record, onClose, onLoadIntoForm, onOpenKopSettings }) => {
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
            {onOpenKopSettings && (
              <button
                type="button"
                onClick={onOpenKopSettings}
                title="Kustomisasi Logo Kiri, Logo Kanan, dan KOP Surat Cetak A4"
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders size={13} className="text-amber-400" />
                <span>KOP &amp; Logo</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              title="Cetak atau simpan dokumen lengkap (Formulir A s.d D dan Tanda Tangan) dalam ukuran A4"
              className="px-3.5 py-1.5 rounded bg-[#9C7A2E] hover:bg-[#7A5F22] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak / Ekspor PDF A4</span>
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
            <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5 flex items-center justify-between">
              <span>Formulir A — Diskusi Persiapan Observasi</span>
              <span className="text-[11px] font-sans font-normal text-[#4B5A6E]">Tahap Pra-Observasi</span>
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
                <span className="font-semibold text-[#4B5A6E] block">Upaya Mempelajari Target Perilaku:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41] leading-relaxed">
                  {record.upayaBelajar || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Perangkat Ajar &amp; Waktu:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41] leading-relaxed">
                  {record.perangkatAjar || '-'} ({record.waktuObs || '-'})
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Hasil Kerja yang Diharapkan:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41] leading-relaxed">
                  {record.hasilKerja || '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#4B5A6E] block">Catatan Persiapan Lainnya:</span>
                <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] mt-1 text-[#1B2A41] leading-relaxed">
                  {record.catatanLain || '-'}
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

                    {/* Catatan Observer Dianjurkan */}
                    {record.catatanIndikator?.[`${ind.id}_dianjurkan`] && (
                      <div className="mt-2 p-2.5 rounded bg-[#F7FAF8] border border-[#C5D8C9] text-xs">
                        <span className="text-[10px] font-bold text-[#3D6B4F] flex items-center gap-1.5 uppercase tracking-wider mb-1">
                          <MessageSquare size={12} />
                          <span>Catatan Observer (Perilaku Dianjurkan):</span>
                        </span>
                        <p className="text-[#1B2A41] italic pl-4 border-l-2 border-[#3D6B4F] m-0">
                          {record.catatanIndikator[`${ind.id}_dianjurkan`]}
                        </p>
                      </div>
                    )}

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

                    {/* Catatan Observer Dihindari */}
                    {record.catatanIndikator?.[`${ind.id}_dihindari`] && (
                      <div className="mt-2 p-2.5 rounded bg-[#FCF8F7] border border-[#E8C7C1] text-xs">
                        <span className="text-[10px] font-bold text-[#9C4A3D] flex items-center gap-1.5 uppercase tracking-wider mb-1">
                          <MessageSquare size={12} />
                          <span>Catatan Observer (Perilaku Dihindari):</span>
                        </span>
                        <p className="text-[#1B2A41] italic pl-4 border-l-2 border-[#9C4A3D] m-0">
                          {record.catatanIndikator[`${ind.id}_dihindari`]}
                        </p>
                      </div>
                    )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Form C */}
            <div className="border border-[#DDD8C9] rounded p-4 space-y-3 bg-white">
              <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5 flex items-center justify-between">
                <span>Formulir C — Tindak Lanjut</span>
                <span className="text-[11px] font-sans font-normal text-[#4B5A6E]">Tahap Pasca-Observasi</span>
              </h3>
              
              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Kategori Kesadaran Guru:</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-xs bg-[#FBF3E1] text-[#7A5F22]">
                  {record.kategoriKesadaranC || 'Sadar Kesulitan'}
                </span>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Pertanyaan Pemantik (Observer):</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] italic leading-relaxed">
                  {record.pertanyaanC || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Respon Guru Terhadap Pertanyaan:</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                  {record.responC || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Catatan Refleksi Bersama:</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                  {record.catatanC || '-'}
                </p>
              </div>

              {/* Rencana Tindak Lanjut */}
              <div className="bg-[#FAF8F3] border border-[#E8DFCA] p-2.5 rounded space-y-1.5">
                <span className="font-bold text-[#7A5F22] block text-[11px] uppercase tracking-wide">
                  Rencana Program Tindak Lanjut
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-[#4B5A6E] block">Tujuan:</span>
                    <span className="text-[#1B2A41]">{record.tujuanTL || '-'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#4B5A6E] block">Upaya / Strategi:</span>
                    <span className="text-[#1B2A41]">{record.upayaTL || '-'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#4B5A6E] block">Waktu Pelaksanaan:</span>
                    <span className="text-[#1B2A41]">{record.kapanTL || '-'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#4B5A6E] block">Kebutuhan Dukungan:</span>
                    <span className="text-[#1B2A41]">{record.dukunganTL || '-'}</span>
                  </div>
                </div>
              </div>

              {record.catatanKepsekC && (
                <div>
                  <span className="font-semibold text-[#4B5A6E] block mb-0.5">Catatan Observer / Kepala Sekolah:</span>
                  <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                    {record.catatanKepsekC}
                  </p>
                </div>
              )}
            </div>

            {/* Form D */}
            <div className="border border-[#DDD8C9] rounded p-4 space-y-3 bg-white">
              <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5 flex items-center justify-between">
                <span>Formulir D — Refleksi Tindak Lanjut</span>
                <span className="text-[11px] font-sans font-normal text-[#4B5A6E]">Tahap Refleksi Akhir</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                <div>
                  <span className="font-semibold text-[#4B5A6E] block mb-0.5">Kategori Tindak Lanjut:</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-xs bg-[#EAF1EA] text-[#3D6B4F]">
                    {record.kategoriTLD || 'Peningkatan Kinerja'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#4B5A6E] block mb-0.5">Tingkat Kesadaran Akhir:</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-xs bg-[#EBF2FA] text-[#2B5C8F]">
                    {record.kesadaranD || 'Sadar Dampak Kesulitan'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Capaian / Kemajuan Kelas:</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                  {record.capaianD || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Tantangan yang Dihadapi:</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                  {record.tantanganD || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Upaya Peningkatan Lanjutan:</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                  {record.upayaPeningkatanD || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Pertanyaan Refleksi (Observer):</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] italic leading-relaxed">
                  {record.pertanyaanD || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#4B5A6E] block mb-0.5">Respon Refleksi Guru:</span>
                <p className="bg-[#FAFAF8] p-2.5 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                  {record.responD || '-'}
                </p>
              </div>

              {record.catatanKepsekD && (
                <div>
                  <span className="font-semibold text-[#4B5A6E] block mb-0.5">Catatan / Evaluasi Kepala Sekolah:</span>
                  <p className="bg-[#FAFAF8] p-2 rounded border border-[#EAE6D9] text-[#1B2A41] leading-relaxed">
                    {record.catatanKepsekD}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* LEMBAR PENGESAHAN & TANDA TANGAN REVIEW */}
          <div className="border border-[#DDD8C9] rounded p-4 bg-[#FAF9F5] space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#1B2A41] border-b border-[#DDD8C9] pb-1.5 flex items-center justify-between">
              <span>Lembar Pengesahan &amp; Tanda Tangan Observasi</span>
              <span className="text-[11px] font-sans text-[#4B5A6E]">
                {record.tempat || 'Ditetapkan'}, {record.tanggal || '-'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Observee */}
              <div className="p-3 bg-white border border-[#DDD8C9] rounded text-center">
                <span className="text-[11px] text-[#4B5A6E] font-medium block">
                  Guru yang Diobservasi (Observee)
                </span>
                <div className="h-14 flex items-center justify-center text-gray-400 text-xs italic">
                  [ Ruang Tanda Tangan ]
                </div>
                <div className="border-t border-[#DDD8C9] pt-1">
                  <span className="font-bold text-xs text-[#1B2A41] block">
                    {record.guru || '...........................................'}
                  </span>
                  <span className="text-[10px] text-[#4B5A6E]">
                    NIP. .....................................................
                  </span>
                </div>
              </div>

              {/* Observer */}
              <div className="p-3 bg-white border border-[#DDD8C9] rounded text-center">
                <span className="text-[11px] text-[#4B5A6E] font-medium block">
                  Observer / Kepala Sekolah (Penilai)
                </span>
                <div className="h-14 flex items-center justify-center text-gray-400 text-xs italic">
                  [ Ruang Tanda Tangan ]
                </div>
                <div className="border-t border-[#DDD8C9] pt-1">
                  <span className="font-bold text-xs text-[#1B2A41] block">
                    {record.kepsek || '...........................................'}
                  </span>
                  <span className="text-[10px] text-[#4B5A6E]">
                    NIP. .....................................................
                  </span>
                </div>
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
