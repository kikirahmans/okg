import { Indicator, ObservationData } from '../types';

export const INDICATORS: Indicator[] = [
  {
    id: 1,
    title: 'Penerapan Disiplin Positif',
    focus: 'Upaya guru menerapkan prinsip disiplin positif untuk mengelola perilaku dan membangun suasana kelas yang tertib tanpa kekerasan.',
    dianjurkan: [
      'Guru melakukan refleksi praktik disiplin pemahaman kesepakatan kelas.',
      'Guru melakukan penguatan positif terhadap perilaku yang sesuai atau patuh.',
      'Guru memfasilitasi peserta didik menyadari konsekuensi dari perilakunya.'
    ],
    dihindari: [
      'Guru mengabaikan perilaku melanggar kesepakatan tanpa tindak lanjut.',
      'Guru memberikan hukuman fisik atau psikis yang merendahkan martabat murid.',
      'Guru memberikan sanksi di luar kesepakatan yang telah dibuat bersama.'
    ]
  },
  {
    id: 2,
    title: 'Keteraturan Suasana Kelas',
    focus: 'Kemampuan guru menjaga kondisi kelas agar tetap kondusif dan meminimalisir gangguan belajar.',
    dianjurkan: [
      'Guru memanggil peserta didik dengan menyebut namanya secara personal.',
      'Guru menyampaikan aturan/penjelasan kelas dengan cara yang mudah dipahami.',
      'Guru memberikan perhatian penuh pada peserta didik saat mereka merespons.'
    ],
    dihindari: [
      'Guru memanggil dengan sebutan yang merendahkan atau memberi label negatif.',
      'Guru membiarkan kelas gaduh atau tidak kondusif tanpa ada upaya menenangkan.',
      'Guru bersikap acuh tak acuh atau sibuk sendiri saat siswa sedang berbicara/bertanya.'
    ]
  },
  {
    id: 3,
    title: 'Umpan Balik Konstruktif',
    focus: 'Pemberian informasi yang bermakna dari guru terkait kemajuan belajar siswa untuk memotivasi peningkatan.',
    dianjurkan: [
      'Guru memberikan umpan balik spesifik dan berorientasi pada proses belajar.',
      'Guru memberikan umpan balik dengan cara yang membangun/konstruktif.',
      'Guru mendiskusikan rencana tindak lanjut umpan balik bersama peserta didik.'
    ],
    dihindari: [
      'Guru hanya memberikan penilaian akhir tanpa penjelasan (misal: hanya mencoret atau memberi nilai angka saja).',
      'Guru memberikan umpan balik bernada negatif, menghakimi, atau menyalahkan siswa.',
      'Guru mengabaikan respons atau pertanyaan balik dari siswa terkait hasil belajarnya.'
    ]
  },
  {
    id: 4,
    title: 'Aktivasi Interaktif',
    focus: 'Memicu keterlibatan aktif dan interaksi bermakna di antara seluruh peserta didik.',
    dianjurkan: [
      'Guru memfasilitasi kegiatan kolaboratif yang melibatkan seluruh siswa.',
      'Guru mengajukan pertanyaan pemantik yang merangsang diskusi kritis.',
      'Guru memberikan kesempatan yang merata kepada siswa untuk berbagi pendapat.'
    ],
    dihindari: [
      'Guru mendominasi seluruh waktu pembelajaran secara searah (metode ceramah terus-menerus).',
      'Guru membiarkan diskusi kelompok didominasi oleh siswa tertentu saja.',
      'Guru langsung menyalahkan atau memotong pendapat siswa yang kurang tepat.'
    ]
  },
  {
    id: 5,
    title: 'Instruksi Pembelajaran',
    focus: 'Efektivitas penyampaian materi pelajaran yang terstruktur dan mudah dipahami siswa.',
    dianjurkan: [
      'Guru menyampaikan materi dengan contoh nyata dan kontekstual.',
      'Guru menjelaskan konsep pelajaran secara terstruktur dan logis.',
      'Guru mengecek pemahaman siswa secara berkala di sela-sela materi.'
    ],
    dihindari: [
      'Guru menjelaskan konsep dengan berbelit-belit atau menggunakan istilah yang terlalu rumit bagi siswa.',
      'Guru menyampaikan materi secara terburu-buru tanpa memedulikan daya tangkap siswa.',
      'Guru melanjutkan ke materi baru tanpa memastikan siswa paham materi sebelumnya.'
    ]
  },
  {
    id: 6,
    title: 'Instruksi yang Adaptif',
    focus: 'Penyesuaian strategi mengajar berdasarkan respons, kebutuhan, dan tingkat pemahaman murid.',
    dianjurkan: [
      'Guru bersikap responsif terhadap dinamika dan umpan balik langsung di kelas.',
      'Guru menyesuaikan metode mengajar dengan karakteristik unik siswa.',
      'Guru mengajak siswa merefleksikan praktik pembelajaran yang telah dilalui.'
    ],
    dihindari: [
      'Guru kaku mengikuti rencana pembelajaran (RPP/Modul Ajar) tanpa peduli siswa kebingungan.',
      'Guru menyamaratakan semua kebutuhan belajar siswa (mengabaikan pembelajaran berdiferensiasi).',
      'Guru mengakhiri kelas begitu saja tanpa melakukan refleksi bersama siswa.'
    ]
  },
  {
    id: 7,
    title: 'Ekspektasi pada Peserta Didik',
    focus: 'Menunjukkan harapan tinggi yang realistis terhadap potensi seluruh murid untuk memacu prestasi.',
    dianjurkan: [
      'Guru mengenali dan menghargai potensi belajar unik setiap siswa.',
      'Guru memberikan tantangan belajar yang menumbuhkan motivasi (zone of proximal development).',
      'Guru memperlakukan seluruh siswa secara adil tanpa membeda-bedakan latar belakang.'
    ],
    dihindari: [
      'Guru menunjukkan sikap pesimis atau meragukan kemampuan siswa tertentu.',
      'Guru hanya memberikan tantangan kepada siswa yang dianggap pintar saja.',
      'Guru bersikap pilih kasih atau memberi perlakuan istimewa berdasarkan latar belakang siswa.'
    ]
  },
  {
    id: 8,
    title: 'Perhatian dan Kepedulian',
    focus: 'Kepekaan dan empati guru terhadap kondisi emosional serta kesejahteraan (well-being) murid.',
    dianjurkan: [
      'Guru bersedia mendengarkan keluh kesah dan pandangan siswa secara empati.',
      'Guru memberikan perhatian lebih kepada siswa yang menunjukkan hambatan belajar.',
      'Guru menunjukkan kepedulian yang tulus terhadap kenyamanan psikologis siswa di kelas.'
    ],
    dihindari: [
      'Guru bersikap dingin, cuek, atau mengabaikan kondisi emosional siswa yang sedang cemas/sedih.',
      'Guru membiarkan siswa yang kesulitan berjuang sendirian tanpa diberikan bimbingan khusus.',
      'Guru membuat siswa merasa tertekan, takut, atau tidak aman secara psikologis di dalam kelas.'
    ]
  }
];

export const RATINGS_LIST = [
  'Belum Dilakukan',
  'Dilakukan tapi Belum Efektif',
  'Dilakukan dan Efektif'
] as const;

export const INITIAL_SAMPLE_RECORDS: ObservationData[] = [
  {
    id: 'obs_sample_1',
    createdAt: '2026-09-10T08:30:00Z',
    updatedAt: '2026-09-10T09:45:00Z',
    guru: 'Lazijmatul Hilma Kau, M.Pd',
    kepsek: 'Abdul Bahsoan, M.Pd.',
    kelas: 'Bahasa Indonesia / XI SMK-1',
    tempat: 'SMK Negeri',
    periode: 'Januari - Juni 2026',
    tanggal: '2026-09-10',
    pickedIndicators: [1, 4],
    upayaBelajar: 'Mempelajari modul PMM Disiplin Positif dan berdiskusi dengan Tim Kurikulum terkait teknik asesmen formatif interaktif.',
    hariObs: '2026-09-10',
    waktuObs: '08.00 - 09.30',
    perangkatAjar: 'Modul Ajar Bubut CNC & Kesepakatan Kelas',
    hasilKerja: 'Terbentuknya budaya kerja bengkel disiplin positif dan keaktifan siswa bertanya meningkat.',
    catatanLain: 'Observasi berjalan kondusif, siswa antusias dalam sesi demonstrasi alat.',
    ratings: {
      '1_dianjurkan_0': 'Dilakukan dan Efektif',
      '1_dianjurkan_1': 'Dilakukan dan Efektif',
      '1_dianjurkan_2': 'Dilakukan tapi Belum Efektif',
      '1_dihindari_0': 'Belum Dilakukan',
      '1_dihindari_1': 'Belum Dilakukan',
      '1_dihindari_2': 'Belum Dilakukan',
      '4_dianjurkan_0': 'Dilakukan dan Efektif',
      '4_dianjurkan_1': 'Dilakukan dan Efektif',
      '4_dianjurkan_2': 'Dilakukan dan Efektif',
      '4_dihindari_0': 'Belum Dilakukan',
      '4_dihindari_1': 'Belum Dilakukan',
      '4_dihindari_2': 'Belum Dilakukan',
    },
    catatanObs: 'Guru menguasai materi dengan sangat baik dan menerapkan aturan K3 bengkel dengan pendekatan persuasif positif.',
    rekomendasi: 'Pertahankan pemberian apresiasi pada siswa yang disiplin, serta variasikan pertanyaan pemantik untuk kelompok kerja belakang.',
    kategoriKesadaranC: 'Sadar Dampak Kesulitan',
    pertanyaanC: 'Bagaimana dampak dari keterlibatan siswa secara merata terhadap pemahaman konsep keselamatan kerja di bengkel?',
    responC: 'Siswa lebih teliti dan tidak canggung bertanya ketika terjadi kendala pada mesin bubut.',
    catatanC: 'Guru menunjukkan refleksi mendalam dan siap melakukan perbaikan.',
    tujuanTL: 'Meningkatkan diferensiasi bimbingan bagi siswa yang lambat beradaptasi dengan mesin.',
    upayaTL: 'Mengikuti komunitas belajar MGMP SMK dan membuat video panduan interaktif.',
    kapanTL: 'Bulan Oktober 2026',
    dukunganTL: 'Kepala Program Keahlian dan Rekan Sejawat Guru Produktif',
    catatanKepsekC: 'Sangat mendukung rencana pengembangan mandiri guru.',
    kategoriTLD: 'Peningkatan Kinerja',
    capaianD: 'Tingkat kepatuhan K3 mencapai 100% dan seluruh siswa aktif dalam praktik mesin.',
    tantanganD: 'Waktu praktik bengkel terbatas sehingga rotasi giliran perlu dioptimalkan.',
    upayaPeningkatanD: 'Mengatur skema stasiun kerja berpasangan (peer buddy system).',
    kesadaranD: 'Sadar Dampak Kesulitan',
    pertanyaanD: 'Bagaimana hasil dari penerapan buddy system tersebut terhadap ritme kerja kelas?',
    responD: 'Sangat efektif menghemat waktu setup mesin hingga 25 menit.',
    catatanKepsekD: 'Praktik baik ini layak didesiminasikan ke guru mata pelajaran lain.',
    totalPerilaku: 12,
    efektifCount: 5,
    belumEfektifCount: 1,
    belumDilakukanCount: 6,
    persentaseEfektif: 83,
    syncedToGoogleSheets: true,
    syncTimestamp: '2026-09-10 10:00:15'
  },
  {
    id: 'obs_sample_2',
    createdAt: '2026-09-12T10:15:00Z',
    updatedAt: '2026-09-12T11:30:00Z',
    guru: 'Irfan Syahrul Basri, S.Pd',
    kepsek: 'Abdul Bahsoan, M.Pd.',
    kelas: 'Matematika / X SMK-2',
    tempat: 'SMK Negeri',
    periode: 'Januari - Juni 2026',
    tanggal: '2026-09-12',
    pickedIndicators: [2, 3],
    upayaBelajar: 'Mengkaji rubrik umpan balik konstruktif di PMM dan menyusun form peer review antar siswa.',
    hariObs: '2026-09-12',
    waktuObs: '10.00 - 11.30',
    perangkatAjar: 'Modul Ajar Pemrograman Dasar JavaScript',
    hasilKerja: 'Siswa saling memberikan umpan balik kode program secara santun dan konstruktif.',
    catatanLain: 'Suasana kelas laboratorium komputer sangat teratur dan kondusif.',
    ratings: {
      '2_dianjurkan_0': 'Dilakukan dan Efektif',
      '2_dianjurkan_1': 'Dilakukan dan Efektif',
      '2_dianjurkan_2': 'Dilakukan dan Efektif',
      '2_dihindari_0': 'Belum Dilakukan',
      '2_dihindari_1': 'Belum Dilakukan',
      '2_dihindari_2': 'Belum Dilakukan',
      '3_dianjurkan_0': 'Dilakukan dan Efektif',
      '3_dianjurkan_1': 'Dilakukan tapi Belum Efektif',
      '3_dianjurkan_2': 'Dilakukan dan Efektif',
      '3_dihindari_0': 'Belum Dilakukan',
      '3_dihindari_1': 'Belum Dilakukan',
      '3_dihindari_2': 'Belum Dilakukan',
    },
    catatanObs: 'Guru memanggil nama siswa dengan hangat dan memberikan umpan balik langsung pada baris kode yang error.',
    rekomendasi: 'Tingkatkan pemberian petunjuk pemecahan masalah agar siswa belajar menemukan solusi secara mandiri.',
    kategoriKesadaranC: 'Sadar Kesulitan',
    pertanyaanC: 'Apa tantangan utama saat memberikan umpan balik kepada 36 siswa dalam waktu terbatas?',
    responC: 'Keterbatasan waktu per anak sehingga belum semua mendapatkan review mendalam.',
    catatanC: 'Perlu formulir review standar atau otomatisasi pengecekan linter.',
    tujuanTL: 'Mengimplementasikan automated feedback dan rubrik peer assessment.',
    upayaTL: 'Membuat template rubrik review mandiri di platform LMS sekolah.',
    kapanTL: '1 bulan ke depan',
    dukunganTL: 'Guru TIK dan Laboran Komputer',
    catatanKepsekC: 'Inovasi yang baik dan relevan dengan industri IT.',
    kategoriTLD: 'Pengembangan Kompetensi',
    capaianD: 'Template peer review berjalan efektif di 2 kelas paralel.',
    tantanganD: 'Ada beberapa siswa yang masih ragu memberikan masukan kritis pada temannya.',
    upayaPeningkatanD: 'Memberikan contoh kalimat umpan balik yang membangun di lembar kerja.',
    kesadaranD: 'Sadar Dampak Kesulitan',
    pertanyaanD: 'Bagaimana respon siswa saat membaca panduan kalimat umpan balik tersebut?',
    responD: 'Komentar siswa menjadi lebih berbobot dan fokus pada logika coding.',
    catatanKepsekD: 'Peningkatan yang sangat nyata pada kolaborasi antar peserta didik.',
    totalPerilaku: 12,
    efektifCount: 5,
    belumEfektifCount: 1,
    belumDilakukanCount: 6,
    persentaseEfektif: 83,
    syncedToGoogleSheets: true,
    syncTimestamp: '2026-09-12 11:45:00'
  }
];
