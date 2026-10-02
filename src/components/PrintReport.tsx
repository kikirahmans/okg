import React from 'react';
import { ObservationData } from '../types';
import { INDICATORS } from '../data/indicators';

interface Props {
  record: ObservationData;
}

export const PrintReport: React.FC<Props> = ({ record }) => {
  const ratings = record.ratings || {};
  const catatanIndikator = record.catatanIndikator || {};
  const pickedIndicators = record.pickedIndicators || [];

  // Helper untuk format tanggal Indonesia
  const formatDateID = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatDateID(record.tanggal);

  return (
    <div className="print-report-root bg-white text-gray-900 font-sans text-[11px] leading-relaxed max-w-[210mm] mx-auto p-4 print:p-0">
      
      {/* ======================================================== */}
      {/* 1. KOP RESMI DOKUMEN OBSERVASI PMM KEMDIKBUDRISTEK       */}
      {/* ======================================================== */}
      <div className="border-b-2 border-black pb-2 mb-3 avoid-break">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Tut Wuri Handayani / PMM Badge */}
          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none" stroke="currentColor">
              {/* Tut Wuri Handayani stylized emblem */}
              <circle cx="50" cy="50" r="45" stroke="#1B2A41" strokeWidth="2.5" fill="#FAF8F3" />
              <polygon points="50,15 58,35 80,35 62,49 69,70 50,56 31,70 38,49 20,35 42,35" fill="#9C7A2E" />
              <circle cx="50" cy="50" r="16" fill="#1B2A41" />
              <circle cx="50" cy="50" r="12" fill="#FAF8F3" />
              <path d="M42,50 Q50,42 58,50" stroke="#9C7A2E" strokeWidth="2" fill="none" />
              <path d="M45,55 L55,55" stroke="#1B2A41" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Heading Teks KOP */}
          <div className="flex-1 text-center">
            <p className="font-bold text-[12px] uppercase tracking-wider text-black m-0">
              Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
            </p>
            <p className="font-semibold text-[11px] uppercase tracking-wide text-gray-800 m-0">
              Direktorat Jenderal Guru dan Tenaga Kependidikan
            </p>
            <p className="font-bold text-[13px] uppercase tracking-wide text-[#1B2A41] mt-0.5 m-0 font-serif">
              Pengelolaan Kinerja Guru — Platform Merdeka Mengajar (PMM)
            </p>
            <p className="text-[10px] text-gray-600 m-0 italic mt-0.5">
              Laporan Hasil Observasi Praktik Kinerja Guru Berdasarkan Rubrik Observasi Kinerja
            </p>
          </div>

          {/* Badge PMM SKP */}
          <div className="w-16 shrink-0 text-right">
            <div className="inline-block border border-gray-400 rounded px-1.5 py-0.5 text-center text-[9px] font-mono uppercase bg-gray-50">
              <span className="block font-bold text-[#9C7A2E]">PMM</span>
              <span className="block text-gray-600 font-semibold">SKP 2026</span>
            </div>
          </div>

        </div>

        {/* Double Border Divider */}
        <div className="border-b border-black mt-2"></div>
      </div>

      {/* ======================================================== */}
      {/* 2. JUDUL DOKUMEN & IDENTITAS OBSERVASI                   */}
      {/* ======================================================== */}
      <div className="text-center mb-3 avoid-break">
        <h1 className="text-[13px] font-bold uppercase tracking-wide underline font-serif m-0">
          Lembar Laporan Observasi Praktik Kinerja Guru
        </h1>
        <p className="text-[10px] text-gray-600 font-mono mt-0.5">
          ID Dokumen: {record.id} · Periode: {record.periode || 'Tahun 2026'}
        </p>
      </div>

      {/* Tabel Identitas Observasi */}
      <div className="border border-black rounded mb-3 overflow-hidden avoid-break">
        <table className="w-full border-collapse text-[10.5px]">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="w-[18%] py-1 px-2.5 bg-gray-100 font-semibold border-r border-gray-300 text-gray-700">Nama Guru (Observee)</td>
              <td className="w-[32%] py-1 px-2.5 font-bold text-black border-r border-gray-300">{record.guru || '-'}</td>
              <td className="w-[18%] py-1 px-2.5 bg-gray-100 font-semibold border-r border-gray-300 text-gray-700">Observer / Penilai</td>
              <td className="w-[32%] py-1 px-2.5 font-bold text-black">{record.kepsek || '-'}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-1 px-2.5 bg-gray-100 font-semibold border-r border-gray-300 text-gray-700">Mata Pelajaran / Kelas</td>
              <td className="py-1 px-2.5 font-medium border-r border-gray-300">{record.kelas || '-'}</td>
              <td className="py-1 px-2.5 bg-gray-100 font-semibold border-r border-gray-300 text-gray-700">Satuan Pendidikan</td>
              <td className="py-1 px-2.5 font-medium">{record.tempat || '-'}</td>
            </tr>
            <tr>
              <td className="py-1 px-2.5 bg-gray-100 font-semibold border-r border-gray-300 text-gray-700">Hari / Tanggal</td>
              <td className="py-1 px-2.5 font-medium border-r border-gray-300">{formattedDate}</td>
              <td className="py-1 px-2.5 bg-gray-100 font-semibold border-r border-gray-300 text-gray-700">Waktu Observasi</td>
              <td className="py-1 px-2.5 font-medium">{record.waktuObs || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ringkasan Skor & Capaian Perilaku */}
      <div className="bg-gray-50 border border-black rounded p-2 mb-3 flex items-center justify-between text-[10.5px] avoid-break">
        <div>
          <span className="font-bold text-gray-800">Capaian Perilaku Efektif: </span>
          <span className="font-extrabold text-black">
            {record.efektifCount || 0} dari {record.totalPerilaku || 0} perilaku ({record.persentaseEfektif || 0}%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-600">
            Belum Efektif: <strong className="text-black">{record.belumEfektifCount || 0}</strong>
          </span>
          <span className="text-[10px] text-gray-600">
            Belum Dilakukan: <strong className="text-black">{record.belumDilakukanCount || 0}</strong>
          </span>
          <span className="px-2 py-0.5 bg-black text-white font-bold rounded text-[9.5px]">
            {record.persentaseEfektif >= 80 ? 'Sangat Baik' : record.persentaseEfektif >= 60 ? 'Baik' : 'Perlu Pendampingan'}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FORMULIR A: DISKUSI PERSIAPAN OBSERVASI               */}
      {/* ======================================================== */}
      <div className="mb-3 avoid-break">
        <div className="bg-[#1B2A41] text-white px-2.5 py-1 font-bold text-[11px] uppercase tracking-wide flex items-center justify-between">
          <span>Formulir A — Diskusi Persiapan Observasi Praktik Pembelajaran</span>
          <span className="text-[9.5px] font-normal opacity-80">Tahap 1: Pra-Observasi</span>
        </div>

        <div className="border border-t-0 border-black p-2.5 space-y-2">
          {/* Indikator Fokus */}
          <div>
            <span className="font-bold text-gray-900 block text-[10.5px] mb-1">
              Fokus Indikator Kinerja yang Dipilih:
            </span>
            <div className="space-y-1">
              {pickedIndicators.length > 0 ? (
                pickedIndicators.map(id => {
                  const ind = INDICATORS.find(i => i.id === id);
                  return (
                    <div key={id} className="pl-2 border-l-2 border-[#9C7A2E] text-[10px]">
                      <span className="font-bold text-black">Indikator {id}: {ind?.title}</span>
                      <span className="text-gray-600 block italic">Fokus: {ind?.focus}</span>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-500 italic text-[10px]">Belum memilih indikator fokus</span>
              )}
            </div>
          </div>

          {/* Rincian Persiapan */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Upaya Mempelajari Target Perilaku:</span>
              <p className="text-gray-900 m-0">{record.upayaBelajar || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Perangkat Ajar & Media Pembelajaran:</span>
              <p className="text-gray-900 m-0">{record.perangkatAjar || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Hasil Kerja yang Diharapkan:</span>
              <p className="text-gray-900 m-0">{record.hasilKerja || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Catatan Persiapan Lainnya:</span>
              <p className="text-gray-900 m-0">{record.catatanLain || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FORMULIR B: PELAKSANAAN OBSERVASI (RUBRIK & CATATAN)   */}
      {/* ======================================================== */}
      <div className="mb-3">
        <div className="bg-[#1B2A41] text-white px-2.5 py-1 font-bold text-[11px] uppercase tracking-wide flex items-center justify-between avoid-break">
          <span>Formulir B — Pelaksanaan Observasi Praktik Pembelajaran</span>
          <span className="text-[9.5px] font-normal opacity-80">Tahap 2: Rubrik & Penilaian Kinerja</span>
        </div>

        <div className="border border-t-0 border-black p-2.5 space-y-3">
          {pickedIndicators.map(indId => {
            const ind = INDICATORS.find(i => i.id === indId);
            if (!ind) return null;

            const catatanDianjurkan = catatanIndikator[`${ind.id}_dianjurkan`];
            const catatanDihindari = catatanIndikator[`${ind.id}_dihindari`];

            return (
              <div key={indId} className="border border-gray-400 rounded overflow-hidden avoid-break">
                {/* Judul Indikator */}
                <div className="bg-gray-100 px-2.5 py-1 border-b border-gray-400 flex items-center justify-between">
                  <span className="font-bold text-[11px] text-black">
                    Indikator {ind.id} — {ind.title}
                  </span>
                  <span className="text-[9.5px] text-gray-600 italic">
                    {ind.focus}
                  </span>
                </div>

                {/* Rubrik Perilaku yang Dianjurkan */}
                <div className="p-2 border-b border-gray-300">
                  <p className="font-bold text-[10px] text-emerald-800 uppercase tracking-wider mb-1">
                    A. Perilaku yang Dianjurkan
                  </p>
                  <table className="w-full text-[10px] border-collapse">
                    <tbody>
                      {ind.dianjurkan.map((txt, idx) => {
                        const rating = ratings[`${ind.id}_dianjurkan_${idx}`] || 'Belum Dinilai';
                        const isEfektif = rating === 'Dilakukan dan Efektif';
                        const isBelumEfektif = rating === 'Dilakukan tapi Belum Efektif';

                        return (
                          <tr key={idx} className="border-b border-dashed border-gray-200">
                            <td className="py-1 pr-2 align-top text-gray-800 w-[70%]">
                              {idx + 1}. {txt}
                            </td>
                            <td className="py-1 text-right align-top w-[30%]">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                                  isEfektif
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : isBelumEfektif
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                {rating}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Catatan Observer Dianjurkan */}
                  {catatanDianjurkan && (
                    <div className="mt-1.5 p-1.5 rounded bg-emerald-50/60 border border-emerald-300 text-[10px]">
                      <span className="font-bold text-emerald-900 block mb-0.5">
                        Catatan Observer (Perilaku yang Dianjurkan):
                      </span>
                      <p className="text-gray-900 m-0 italic pl-2 border-l-2 border-emerald-600">
                        {catatanDianjurkan}
                      </p>
                    </div>
                  )}
                </div>

                {/* Rubrik Perilaku yang Dihindari */}
                <div className="p-2">
                  <p className="font-bold text-[10px] text-rose-800 uppercase tracking-wider mb-1">
                    B. Perilaku yang Dihindari
                  </p>
                  <table className="w-full text-[10px] border-collapse">
                    <tbody>
                      {ind.dihindari.map((txt, idx) => {
                        const rating = ratings[`${ind.id}_dihindari_${idx}`] || 'Belum Dinilai';
                        const isBelumDilakukan = rating === 'Belum Dilakukan';

                        return (
                          <tr key={idx} className="border-b border-dashed border-gray-200">
                            <td className="py-1 pr-2 align-top text-gray-800 w-[70%]">
                              {idx + 1}. {txt}
                            </td>
                            <td className="py-1 text-right align-top w-[30%]">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                                  isBelumDilakukan
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                {rating}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Catatan Observer Dihindari */}
                  {catatanDihindari && (
                    <div className="mt-1.5 p-1.5 rounded bg-rose-50/60 border border-rose-300 text-[10px]">
                      <span className="font-bold text-rose-900 block mb-0.5">
                        Catatan Observer (Perilaku yang Dihindari):
                      </span>
                      <p className="text-gray-900 m-0 italic pl-2 border-l-2 border-rose-600">
                        {catatanDihindari}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {/* Catatan Observasi Umum & Rekomendasi */}
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 avoid-break">
            <div className="border border-gray-400 p-2 rounded bg-gray-50">
              <span className="font-bold text-gray-900 block mb-0.5">
                Catatan Umum Observasi (Observer):
              </span>
              <p className="text-gray-900 m-0 leading-relaxed">
                {record.catatanObs || 'Tidak ada catatan khusus saat observasi berlangsung.'}
              </p>
            </div>
            <div className="border border-gray-400 p-2 rounded bg-gray-50">
              <span className="font-bold text-gray-900 block mb-0.5">
                Rekomendasi Tindak Lanjut (Observer):
              </span>
              <p className="text-gray-900 m-0 leading-relaxed">
                {record.rekomendasi || 'Guru disarankan terus mempertahankan praktik baik dan mengikuti pelatihan mandiri di PMM.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. FORMULIR C: TINDAK LANJUT OBSERVASI                   */}
      {/* ======================================================== */}
      <div className="mb-3 avoid-break">
        <div className="bg-[#1B2A41] text-white px-2.5 py-1 font-bold text-[11px] uppercase tracking-wide flex items-center justify-between">
          <span>Formulir C — Tindak Lanjut Observasi Praktik Pembelajaran</span>
          <span className="text-[9.5px] font-normal opacity-80">Tahap 3: Pasca Observasi & Komitmen</span>
        </div>

        <div className="border border-t-0 border-black p-2.5 space-y-2 text-[10px]">
          {/* Kategori Kesadaran & Pertanyaan Pemantik */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Tingkat Kesadaran Guru:</span>
              <span className="inline-block px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300 text-[9.5px]">
                {record.kategoriKesadaranC || 'Sadar Kesulitan'}
              </span>
            </div>
            <div className="col-span-2 border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Pertanyaan Pemantik (Observer):</span>
              <p className="text-gray-900 m-0 italic">{record.pertanyaanC || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Respon Guru Terhadap Pertanyaan:</span>
              <p className="text-gray-900 m-0">{record.responC || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Catatan Refleksi Bersama:</span>
              <p className="text-gray-900 m-0">{record.catatanC || '-'}</p>
            </div>
          </div>

          {/* Rencana Aksi Tindak Lanjut */}
          <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
            <span className="font-bold text-gray-900 block mb-1">Rencana Aksi Program Tindak Lanjut:</span>
            <div className="grid grid-cols-4 gap-2 text-[9.5px]">
              <div>
                <span className="font-semibold text-gray-700 block">Tujuan:</span>
                <p className="text-gray-900 m-0">{record.tujuanTL || '-'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 block">Upaya / Strategi:</span>
                <p className="text-gray-900 m-0">{record.upayaTL || '-'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 block">Waktu Pelaksanaan:</span>
                <p className="text-gray-900 m-0">{record.kapanTL || '-'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 block">Kebutuhan Dukungan:</span>
                <p className="text-gray-900 m-0">{record.dukunganTL || '-'}</p>
              </div>
            </div>
          </div>

          {record.catatanKepsekC && (
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Catatan Observer / Kepala Sekolah:</span>
              <p className="text-gray-900 m-0">{record.catatanKepsekC}</p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. FORMULIR D: REFLEKSI TINDAK LANJUT                    */}
      {/* ======================================================== */}
      <div className="mb-4 avoid-break">
        <div className="bg-[#1B2A41] text-white px-2.5 py-1 font-bold text-[11px] uppercase tracking-wide flex items-center justify-between">
          <span>Formulir D — Refleksi Tindak Lanjut (Kondisi Terkini)</span>
          <span className="text-[9.5px] font-normal opacity-80">Tahap 4: Dampak & Keberlanjutan</span>
        </div>

        <div className="border border-t-0 border-black p-2.5 space-y-2 text-[10px]">
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Kategori Tindak Lanjut:</span>
              <span className="inline-block px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9.5px]">
                {record.kategoriTLD || 'Peningkatan Kinerja'}
              </span>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Tingkat Kesadaran Refleksi Akhir:</span>
              <span className="inline-block px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-900 border border-blue-300 text-[9.5px]">
                {record.kesadaranD || 'Sadar Dampak Kesulitan'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Capaian / Kemajuan di Kelas:</span>
              <p className="text-gray-900 m-0">{record.capaianD || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Tantangan &amp; Kendala:</span>
              <p className="text-gray-900 m-0">{record.tantanganD || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Upaya Peningkatan Lanjutan:</span>
              <p className="text-gray-900 m-0">{record.upayaPeningkatanD || '-'}</p>
            </div>
          </div>

          {/* Pertanyaan Observer & Respon Guru pada Formulir D */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Pertanyaan Refleksi (Observer):</span>
              <p className="text-gray-900 m-0 italic">{record.pertanyaanD || '-'}</p>
            </div>
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Respon Refleksi Guru:</span>
              <p className="text-gray-900 m-0">{record.responD || '-'}</p>
            </div>
          </div>

          {record.catatanKepsekD && (
            <div className="border border-gray-300 p-1.5 rounded bg-gray-50">
              <span className="font-bold text-gray-800 block mb-0.5">Catatan &amp; Evaluasi Akhir Kepala Sekolah:</span>
              <p className="text-gray-900 m-0">{record.catatanKepsekD}</p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. LEMBAR PENGESAHAN & TANDA TANGAN (OBSERVER & OBSERWEE) */}
      {/* ======================================================== */}
      <div className="mt-4 pt-2 border-t border-black avoid-break">
        
        {/* Titik Lokasi dan Tanggal */}
        <div className="text-right text-[10.5px] font-medium text-gray-800 mb-2">
          {record.tempat || 'Ditetapkan'}, {formattedDate}
        </div>

        {/* Kotak Tanda Tangan Dua Kolom */}
        <div className="grid grid-cols-2 gap-8 text-[11px] text-center">
          
          {/* Kolom Kiri: Guru yang Diobservasi (Observee) */}
          <div className="flex flex-col items-center">
            <p className="font-bold text-gray-900 m-0">Guru yang Diobservasi (Observee),</p>
            <p className="text-[10px] text-gray-600 m-0 mt-0.5">Mata Pelajaran: {record.kelas || '-'}</p>

            {/* Ruang Tanda Tangan */}
            <div className="h-16 flex items-center justify-center">
              <span className="text-gray-300 italic text-[10px] select-none">
                [ Tanda Tangan &amp; Stempel ]
              </span>
            </div>

            {/* Garis Nama dan NIP */}
            <div className="w-[85%] border-b border-black pb-1">
              <p className="font-bold text-black uppercase m-0">
                ( {record.guru || '...................................................'} )
              </p>
            </div>
            <p className="text-[10px] text-gray-800 mt-1 m-0">
              NIP. ..............................................................
            </p>
          </div>

          {/* Kolom Kanan: Observer / Kepala Sekolah */}
          <div className="flex flex-col items-center">
            <p className="font-bold text-gray-900 m-0">Observer / Kepala Sekolah,</p>
            <p className="text-[10px] text-gray-600 m-0 mt-0.5">Penilai Kinerja Guru</p>

            {/* Ruang Tanda Tangan */}
            <div className="h-16 flex items-center justify-center">
              <span className="text-gray-300 italic text-[10px] select-none">
                [ Tanda Tangan &amp; Stempel ]
              </span>
            </div>

            {/* Garis Nama dan NIP */}
            <div className="w-[85%] border-b border-black pb-1">
              <p className="font-bold text-black uppercase m-0">
                ( {record.kepsek || '...................................................'} )
              </p>
            </div>
            <p className="text-[10px] text-gray-800 mt-1 m-0">
              NIP. ..............................................................
            </p>
          </div>

        </div>

        {/* Footer Dokumen Otentik */}
        <div className="mt-4 pt-2 border-t border-gray-300 flex items-center justify-between text-[9px] text-gray-500 font-mono">
          <span>Dicetak melalui Sistem Observasi Kinerja Guru PMM SKP · Platform Merdeka Mengajar</span>
          <span>Halaman 1 dari 1 (Format Ringkas A4 PMM) · kikybahsoan</span>
        </div>

      </div>

    </div>
  );
};
