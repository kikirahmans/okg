import { ObservationData } from '../types';
import { INDICATORS } from '../data/indicators';

export type AIAssistantType = 'rekomendasi_b' | 'pertanyaan_c' | 'pertanyaan_d';

export interface AIAssistantResult {
  source: 'gemini' | 'offline_rules';
  title: string;
  subtitle: string;
  suggestions: string[];
}

export async function requestAIAssistance(
  type: AIAssistantType,
  record: ObservationData
): Promise<AIAssistantResult> {
  const indTitles = (record.pickedIndicators || [])
    .map(id => {
      const ind = INDICATORS.find(i => i.id === id);
      return ind ? `Indikator ${ind.id} (${ind.title})` : `Indikator ${id}`;
    });

  const catatanDianjurkan = (record.pickedIndicators || [])
    .map(id => record.catatanIndikator?.[`${id}_dianjurkan`])
    .filter(Boolean)
    .join('; ');

  const catatanDihindari = (record.pickedIndicators || [])
    .map(id => record.catatanIndikator?.[`${id}_dihindari`])
    .filter(Boolean)
    .join('; ');

  const payload = {
    type,
    record,
    context: {
      indicatorTitles: indTitles,
      catatanDianjurkan,
      catatanDihindari
    }
  };

  try {
    const res = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        return {
          source: 'gemini',
          title: getTitleForType(type),
          subtitle: `Rekomendasi AI Gemini berdasarkan data observasi ${record.guru || 'Guru'}`,
          suggestions: data.suggestions
        };
      }
    }
  } catch (err) {
    console.info('Server AI endpoint unavailable, using smart contextual fallback generator:', err);
  }

  // Graceful fallback for static GitHub Pages or offline environment
  return {
    source: 'offline_rules',
    title: getTitleForType(type),
    subtitle: `Rekomendasi Pintar PMM berbasis data observasi ${record.guru || 'Guru'}`,
    suggestions: generateContextualFallback(type, record, indTitles)
  };
}

function getTitleForType(type: AIAssistantType): string {
  switch (type) {
    case 'rekomendasi_b':
      return 'Saran Rekomendasi Observer (Formulir B)';
    case 'pertanyaan_c':
      return 'Pertanyaan Pemantik Diskusi Tindak Lanjut (Formulir C)';
    case 'pertanyaan_d':
      return 'Pertanyaan Refleksi Akhir Tindak Lanjut (Formulir D)';
  }
}

function generateContextualFallback(
  type: AIAssistantType,
  record: ObservationData,
  indTitles: string[]
): string[] {
  const teacher = record.guru ? `Ibu/Bapak ${record.guru}` : 'guru';
  const indSummary = indTitles.length > 0 ? indTitles.join(' dan ') : 'indikator kinerja yang dipilih';
  const pct = record.persentaseEfektif || 0;

  if (type === 'rekomendasi_b') {
    if (pct >= 80) {
      return [
        `Pertahankan praktik baik dalam ${indSummary}. Jadikan kelas ${teacher} sebagai model praktik baik (*benchmarking*) dalam komunitas belajar guru serumpun.`,
        `Perluas diferensiasi proses belajar dengan memberikan tantangan pengayaan bagi peserta didik yang telah tuntas lebih cepat, sembari mempertahankan iklim kelas yang positif.`,
        `Dokumentasikan strategi penerapan perilaku efektif ke dalam portofolio digital atau modul ajar PMM agar dapat menginspirasi rekan sejawat lainnya.`
      ];
    } else if (pct >= 50) {
      return [
        `Tingkatkan konsistensi dalam ${indSummary}, khususnya pada penguatan umpan balik langsung kepada murid yang masih pasif saat pembelajaran kelompok.`,
        `Disarankan ${teacher} berdiskusi di Komunitas Belajar (Kombel) sekolah untuk memperkaya teknik kesepakatan kelas interaktif dan pengelolaan alokasi waktu praktik.`,
        `Gunakan lembar observasi mandiri (*self-reflection checklist*) sebelum mengajar guna memastikan seluruh perilaku yang dianjurkan muncul secara berkesinambungan.`
      ];
    } else {
      return [
        `Fokuskan pendampingan pada 1 target perilaku prioritas dalam ${indSummary} sebelum beralih ke indikator berikutnya agar implementasi lebih terarah.`,
        `Lakukan simulasi atau *peer-teaching* bersama rekan sejawat guru penggerak untuk melatih teknik pengelolaan kelas persuasif dan pencegahan perilaku yang dihindari.`,
        `Pelajari modul pelatihan mandiri terkait Disiplin Positif dan Ekspektasi Pembelajaran di platform PMM untuk memperdalam strategi mengaktifkan siswa.`
      ];
    }
  }

  if (type === 'pertanyaan_c') {
    const awareness = record.kategoriKesadaranC || 'Sadar Kesulitan';
    if (awareness === 'Belum Sadar Kesulitan' || awareness === 'Tidak Sadar Kesulitan') {
      return [
        `Bagaimana perasaan ${teacher} saat mengamati dinamika partisipasi murid selama proses pembelajaran tadi?`,
        `Ketika ada beberapa peserta didik yang belum sepenuhnya fokus pada tugas, menurut pengamatan ${teacher}, apa yang kira-kira menjadi penyebab utamanya?`,
        `Jika membandingkan respon murid di awal sesi dengan saat kerja kelompok, bagian mana yang menurut ${teacher} paling efektif menarik minat mereka?`
      ];
    } else if (awareness === 'Sadar Dampak Kesulitan') {
      return [
        `Bagaimana dampak dari kendala yang ${teacher} rasakan tersebut terhadap pemahaman konsep dan antusiasme belajar peserta didik secara keseluruhan?`,
        `Langkah atau inovasi konkret apa yang paling mendesak untuk ${teacher} lakukan guna meminimalkan dampak tersebut pada pertemuan berikutnya?`,
        `Dukungan sumber daya atau kolaborasi seperti apa dari sekolah yang paling ${teacher} butuhkan untuk mewujudkan rencana tindak lanjut tersebut?`
      ];
    } else {
      // Sadar Kesulitan
      return [
        `Apa bagian yang dirasa paling menantang bagi ${teacher} saat menerapkan fokus perilaku pada ${indSummary}?`,
        `Apa yang sudah berjalan baik menurut ${teacher}, dan di aspek mana yang masih membutuhkan penyesuaian strategi mengajar?`,
        `Keterampilan atau wawasan baru apa yang ingin ${teacher} pelajari dalam rencana tindak lanjut ini agar tantangan tersebut teratasi?`
      ];
    }
  }

  if (type === 'pertanyaan_d') {
    const capaian = record.capaianD || 'perubahan perilaku belajar murid';
    const tantangan = record.tantanganD || 'kendala yang dihadapi';

    return [
      `Berdasarkan capaian "${capaian}", perubahan positif apa yang paling signifikan terlihat pada sikap dan hasil belajar murid di kelas ${teacher}?`,
      `Terkait tantangan "${tantangan}", bagaimana strategi adaptif yang ${teacher} terapkan agar proses pembelajaran tetap berjalan optimal?`,
      `Bagaimana rencana ${teacher} untuk menjaga keberlanjutan praktik baik ini agar menjadi budaya belajar yang konsisten sepanjang semester?`
    ];
  }

  return [
    `Bagaimana evaluasi ${teacher} terhadap perkembangan proses pembelajaran sejauh ini?`,
    `Langkah apa yang perlu diprioritaskan untuk meningkatkan capaian pada tahap berikutnya?`,
    `Bagaimana cara mempertahankan antusiasme dan komitmen belajar peserta didik secara berkesinambungan?`
  ];
}
