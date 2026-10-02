import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // API Endpoint: AI Assistant powered by Google Gemini
  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const { type, record, context } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(503).json({
          success: false,
          error: 'GEMINI_API_KEY tidak ditemukan di environment server.'
        });
      }

      const ai = new GoogleGenAI();
      let prompt = '';
      const systemInstruction = 'Anda adalah Asisten Pakar Penilaian & Coaching Observasi Kinerja Guru Kemdikbudristek (PMM). Berikan rekomendasi dan pertanyaan pemantik yang aplikatif, memberdayakan, berbasis rubrik observasi kelas, dan bernada positif dalam Bahasa Indonesia baku.';

      if (type === 'rekomendasi_b') {
        prompt = `
Berikut adalah data observasi pembelajaran di kelas:
- Guru yang diobservasi: ${record?.guru || 'Guru'}
- Kelas & Mata Pelajaran: ${record?.kelas || '-'}
- Indikator yang dinilai: ${context?.indicatorTitles?.join(', ') || '-'}
- Ringkasan Capaian Rubrik: ${record?.persentaseEfektif || 0}% efektif (${record?.efektifCount || 0} efektif, ${record?.belumEfektifCount || 0} belum efektif, ${record?.belumDilakukanCount || 0} belum dilakukan).
- Catatan Observer Perilaku Dianjurkan: ${context?.catatanDianjurkan || '-'}
- Catatan Observer Perilaku Dihindari: ${context?.catatanDihindari || '-'}
- Catatan Umum Pembelajaran: ${record?.catatanObs || '-'}

Tugas:
Buatlah 3 pilihan rekomendasi tindak lanjut observer yang konkret, terukur, dan bermakna untuk guru tersebut dalam meningkatkan kualitas pembelajarannya sesuai panduan PMM.
Tampilkan dalam format:
1. [Rekomendasi 1]
2. [Rekomendasi 2]
3. [Rekomendasi 3]
Setiap poin terdiri dari 1-2 kalimat yang padat, aplikatif, dan bernada memberdayakan.
`;
      } else if (type === 'pertanyaan_c') {
        prompt = `
Berikut adalah data observasi Formulir B dan refleksi awal Formulir C:
- Guru: ${record?.guru || 'Guru'}
- Kelas / Mapel: ${record?.kelas || '-'}
- Kategori Kesadaran Guru saat ini: ${record?.kategoriKesadaranC || 'Sadar Kesulitan'}
- Upaya Belajar yang telah dilakukan: ${record?.upayaBelajar || '-'}
- Hasil Observasi: ${record?.persentaseEfektif || 0}% efektif
- Catatan Observer Form B: ${record?.catatanObs || '-'}

Tugas:
Buatlah 3 pilihan pertanyaan pemantik refleksi (coaching questions) yang ramah, terbuka, dan memberdayakan untuk observer tanyakan kepada guru, disesuaikan dengan tingkat kesadaran guru (${record?.kategoriKesadaranC}).
Tujuannya agar guru menyadari tantangan belajarnya tanpa merasa dihakimi dan termotivasi menyusun rencana tindak lanjut.
Tampilkan dalam format:
1. [Pertanyaan 1]
2. [Pertanyaan 2]
3. [Pertanyaan 3]
`;
      } else if (type === 'pertanyaan_d') {
        prompt = `
Berikut adalah data evaluasi tindak lanjut Formulir D:
- Guru: ${record?.guru || 'Guru'}
- Kategori Tindak Lanjut: ${record?.kategoriTLD || 'Peningkatan Kinerja'}
- Capaian yang berhasil diraih: ${record?.capaianD || '-'}
- Tantangan yang masih dihadapi: ${record?.tantanganD || '-'}
- Upaya peningkatan lanjutan yang direncanakan: ${record?.upayaPeningkatanD || '-'}
- Kategori Kesadaran Terkini: ${record?.kesadaranD || 'Sadar Dampak Kesulitan'}

Tugas:
Buatlah 3 pilihan pertanyaan pemantik refleksi akhir pasca tindak lanjut (observer) untuk menggali dampak perubahan pembelajaran terhadap murid dan keberlanjutan praktik baik guru.
Tampilkan dalam format:
1. [Pertanyaan 1]
2. [Pertanyaan 2]
3. [Pertanyaan 3]
`;
      } else {
        return res.status(400).json({ success: false, error: 'Jenis permintaan tidak valid.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || '';
      
      // Parse suggestions into array
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const suggestions: string[] = [];
      lines.forEach(line => {
        const match = line.match(/^(\d+[\.\)]\s*|\-\s*|\*\s*)(.*)/);
        if (match && match[2] && match[2].trim().length > 10) {
          suggestions.push(match[2].trim());
        }
      });

      return res.json({
        success: true,
        text,
        suggestions: suggestions.length > 0 ? suggestions : [text]
      });

    } catch (err: any) {
      console.error('Error generating AI assistance:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Gagal memproses permintaan AI.'
      });
    }
  });

  // Health check route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'observasi-guru-pmm' });
  });

  // Vite middleware in dev or static serving in prod
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
