export const MOCK_STUDENT = {
  name: 'Raka Pratama Wijaya',
  nim: '1462400001',
  email: 'raka.pratama@contoh.untag-sby.ac.id',
  program: 'Teknik Informatika',
  semester: 'Ganjil 2026/2027',
  phone: '0812-3456-7890',
  academicStats: {
    gpa: '3,84',
    completedCredits: 84,
    totalCredits: 144,
    averageQuizScore: 88,
    completedTasks: 12,
    attendanceRate: 96,
  },
};

export const MOCK_URGENT_DEADLINE = {
  id: 'task-pap-03',
  courseId: 'mk-pap-01',
  badgeLabel: 'Sisa 2 jam',
  title: 'Tugas 3: Tipografi Digital',
  courseName: 'Pengembangan Antarmuka Pengguna',
  dueDateText: 'Batas: 30 Nov 2026 · 00.00 WIB',
};

export const MOCK_ENROLLED_COURSES = [
  {
    id: 'mk-pw-01',
    code: 'IF201',
    classGroup: 'Kelas B',
    title: 'Pemrograman Web',
    lecturer: 'Budi Santoso, M.Kom.',
    credits: 3,
    category: 'Wajib',
    progress: 65,
  },
  {
    id: 'mk-imk-01',
    code: 'IF205',
    classGroup: 'Kelas A',
    title: 'Interaksi Manusia dan Komputer',
    lecturer: 'Siti Rahmawati, S.Kom., M.T.',
    credits: 3,
    category: 'Wajib',
    progress: 80,
  },
];

/* Katalog mata kuliah contoh untuk E03 Cari Mata Kuliah & E04 Pratinjau Kelas */
export const MOCK_COURSE_CATALOG = [
  {
    id: 'mk-pw-01',
    code: 'IF201',
    classGroup: 'Kelas B',
    title: 'Pemrograman Web',
    lecturer: 'Budi Santoso, M.Kom.',
    credits: 3,
    category: 'Wajib',
    semester: 3,
    schedule: 'Senin, 08.00 – 10.30 WIB',
    room: 'Lab Komputer 3',
    remainingSeats: 5,
    totalSeats: 30,
    prerequisites: ['IF101 · Algoritma dan Pemrograman'],
    description:
      'Mata kuliah ini membahas perancangan dan implementasi antarmuka web modern dengan fokus pada kegunaan (usability) dan standar aksesibilitas.',
    modules: [
      'Pertemuan 1–3: HTML Semantik & Struktur Dokumen Web',
      'Pertemuan 4–7: Tata Letak Responsif, Flexbox, dan CSS Grid',
      'Pertemuan 8–11: Interaktivitas JavaScript & Arsitektur Komponen',
      'Pertemuan 12–14: Standar Aksesibilitas WCAG & Proyek Akhir',
    ],
  },
  {
    id: 'mk-kb-01',
    code: 'IF301',
    classGroup: 'Kelas A',
    title: 'Kecerdasan Buatan',
    lecturer: 'Dr. Hendra, M.Kom.',
    credits: 3,
    category: 'Wajib',
    semester: 5,
    schedule: 'Selasa, 08.00 – 10.30 WIB',
    room: 'Gedung Q · R.302',
    remainingSeats: 8,
    totalSeats: 40,
    prerequisites: [
      'IF104 · Matematika Diskrit',
      'IF203 · Struktur Data',
    ],
    description:
      'Mempelajari konsep pencarian heuristik, representasi pengetahuan, penalaran logis, serta pengantar pembelajaran mesin untuk penyelesaian masalah komputasi.',
    modules: [
      'Pertemuan 1–3: Agen Cerdas & Algoritma Pencarian',
      'Pertemuan 4–7: Logika Proposisional & Representasi Pengetahuan',
      'Pertemuan 8–11: Penalaran Probabilistik & Pengantar Machine Learning',
      'Pertemuan 12–14: Evaluasi Model & Studi Kasus Terapan',
    ],
  },
  {
    id: 'mk-mbd-01',
    code: 'IF202',
    classGroup: 'Kelas B',
    title: 'Manajemen Basis Data',
    lecturer: 'Siti Aminah, M.T.',
    credits: 3,
    category: 'Wajib',
    semester: 3,
    schedule: 'Rabu, 10.30 – 13.00 WIB',
    room: 'Lab Basis Data 2',
    remainingSeats: 12,
    totalSeats: 35,
    prerequisites: ['IF101 · Algoritma dan Pemrograman'],
    description:
      'Membahas perancangan skema relasional, normalisasi, manajemen transaksi, optimasi kueri SQL, dan administrasi basis data.',
    modules: [
      'Pertemuan 1–3: Pemodelan ERD & Skema Relasional',
      'Pertemuan 4–7: Normalisasi & Bahasa Kueri SQL Lanjut',
      'Pertemuan 8–11: Indeks, Transaksi, dan Kontrol Konkurensi',
      'Pertemuan 12–14: Keamanan Data & Pemulihan Basis Data',
    ],
  },
  {
    id: 'mk-pap-01',
    code: 'IF304',
    classGroup: 'Kelas A',
    title: 'Pengembangan Antarmuka Pengguna',
    lecturer: 'Rudi Hartono, S.Kom., M.A.',
    credits: 3,
    category: 'Pilihan',
    semester: 5,
    schedule: 'Kamis, 09.30 – 12.00 WIB',
    room: 'Gedung Q · R.307',
    remainingSeats: 4,
    totalSeats: 30,
    prerequisites: ['IF205 · Interaksi Manusia dan Komputer'],
    description:
      'Merancang dan mengimplementasikan antarmuka pengguna lintas platform berbasis design system, atomic design, mobile-first, dan standar aksesibilitas.',
    modules: [
      'Pertemuan 1–4: Konsep Layar, Grid, Tipografi, dan Sistem Warna',
      'Pertemuan 5–7: Hirarki Visual, Komponen UI, dan Atomic Design',
      'Pertemuan 8–11: Design to Code & Mobile-First Development',
      'Pertemuan 12–14: Audit Aksesibilitas & Pengujian Konsistensi',
    ],
  },
];

/* Data isi kelas (pengumuman, tautan rapat, aktivitas, dan pertemuan) untuk E05 Halaman Kelas */
export const MOCK_COURSE_CONTENT = {
  'mk-pw-01': {
    meetingLink: {
      label: 'Tautan Rapat Daring (Zoom / Google Meet)',
      url: 'https://meet.google.com/contoh-if201-elitag',
      note: 'Tautan aktif setiap Senin, 08.00 – 10.30 WIB.',
    },
    announcement: {
      title: 'Pengumuman Kelas',
      message: 'Kuis 1 diadakan pekan depan pada jam kuliah.',
      postedAt: 'Diperbarui 2 jam yang lalu',
    },
    featuredSectionTitle: 'Aktivitas Pertemuan 1',
    featuredActivities: [
      {
        id: 'act-pw-m1',
        type: 'material',
        title: 'Pertemuan 1: Pengantar Web',
        subtitle: 'Slide PDF · Video Rekaman · 15 menit baca',
        badgeLabel: 'Materi',
        badgeTone: 'info',
      },
      {
        id: 'act-pw-t1',
        type: 'task',
        title: 'Tugas 1: Analisis UI/UX',
        subtitle: 'Batas: 30 Nov 2026 · 00.00 WIB · Belum Dikumpulkan',
        badgeLabel: 'Tugas',
        badgeTone: 'peringatan',
      },
      {
        id: 'act-pw-q1',
        type: 'quiz',
        title: 'Kuis 1: HTML & CSS Dasar',
        subtitle: '5 soal pilihan ganda · Durasi 15 menit',
        badgeLabel: 'Kuis',
        badgeTone: 'utama',
      },
      {
        id: 'act-pw-f1',
        type: 'forum',
        title: 'Forum Diskusi Kelas',
        subtitle: 'Tanya jawab materi pertemuan 1 (12 tanggapan)',
        badgeLabel: 'Diskusi',
        badgeTone: 'netral',
      },
    ],
    meetings: [
      {
        id: 'meet-pw-01',
        number: 1,
        title: 'Pertemuan 1: Pengantar Web',
        subtitle: 'Arsitektur HTTP, peramban, dan dasar HTML',
        statusLabel: 'Selesai',
        statusTone: 'berhasil',
      },
      {
        id: 'meet-pw-02',
        number: 2,
        title: 'Pertemuan 2: Struktur HTML',
        subtitle: 'Elemen semantik, formulir, dan aksesibilitas',
        statusLabel: 'Tersedia',
        statusTone: 'info',
      },
      {
        id: 'meet-pw-03',
        number: 3,
        title: 'Pertemuan 3: Dasar CSS',
        subtitle: 'Box model, selektor, dan variabel CSS',
        statusLabel: 'Tersedia',
        statusTone: 'info',
      },
      {
        id: 'meet-pw-04',
        number: 4,
        title: 'Pertemuan 4: Tata Letak Responsif',
        subtitle: 'Flexbox, CSS Grid, dan media query mobile-first',
        statusLabel: 'Terjadwal',
        statusTone: 'netral',
      },
    ],
  },
  default: {
    meetingLink: {
      label: 'Tautan Rapat Daring (Zoom / Google Meet)',
      url: 'https://meet.google.com/contoh-kelas-elitag',
      note: 'Tautan aktif sesuai jadwal perkuliahan mingguan.',
    },
    announcement: {
      title: 'Pengumuman Kelas',
      message: 'Silakan pelajari materi Pertemuan 1 sebelum sesi tatap muka dimulai.',
      postedAt: 'Diperbarui hari ini',
    },
    featuredSectionTitle: 'Aktivitas Pertemuan 1',
    featuredActivities: [
      {
        id: 'act-def-m1',
        type: 'material',
        title: 'Pertemuan 1: Pengantar Mata Kuliah',
        subtitle: 'RPS · Slide PDF · Bahan Bacaan',
        badgeLabel: 'Materi',
        badgeTone: 'info',
      },
      {
        id: 'act-def-t1',
        type: 'task',
        title: 'Tugas 1: Ringkasan Materi Pertemuan',
        subtitle: 'Lihat daftar tugas & tenggat mata kuliah ini',
        badgeLabel: 'Tugas',
        badgeTone: 'peringatan',
      },
      {
        id: 'act-def-q1',
        type: 'quiz',
        title: 'Kuis 1: Pemahaman Konsep Dasar',
        subtitle: '5 soal pilihan ganda · Durasi 15 menit',
        badgeLabel: 'Kuis',
        badgeTone: 'utama',
      },
      {
        id: 'act-def-f1',
        type: 'forum',
        title: 'Forum Diskusi Kelas',
        subtitle: 'Ruang diskusi mahasiswa dan dosen pengampu',
        badgeLabel: 'Diskusi',
        badgeTone: 'netral',
      },
    ],
    meetings: [
      {
        id: 'meet-def-01',
        number: 1,
        title: 'Pertemuan 1: Pengantar & Kontrak Kuliah',
        subtitle: 'Capaian pembelajaran dan alur praktikum',
        statusLabel: 'Tersedia',
        statusTone: 'info',
      },
      {
        id: 'meet-def-02',
        number: 2,
        title: 'Pertemuan 2: Konsep Inti & Studi Kasus',
        subtitle: 'Ringkasan teori dan latihan terbimbing',
        statusLabel: 'Tersedia',
        statusTone: 'info',
      },
      {
        id: 'meet-def-03',
        number: 3,
        title: 'Pertemuan 3: Penerapan & Evaluasi',
        subtitle: 'Studi kasus implementasi bertahap',
        statusLabel: 'Terjadwal',
        statusTone: 'netral',
      },
    ],
  },
};

/* Detail materi bacaan, video, dan berkas unduhan untuk E06 Materi Pertemuan */
const PERTEMUAN_1_WEB_MATERIAL = {
  id: 'act-pw-m1',
  meetingBadge: 'Pertemuan 1',
  title: 'Pertemuan 1: Konsep Web',
  estimatedRead: '15 menit baca',
  video: {
    title: 'Video Rekaman: Cara Kerja HTTP & Peramban',
    duration: '12:40',
    description:
      'Penjelasan visual alur permintaan (request) dan tanggapan (response) antara klien dan server web.',
  },
  summary:
    'World Wide Web bekerja menggunakan protokol HTTP untuk mengirimkan dokumen HTML dari server ke peramban pengguna. Setiap halaman web tersusun atas struktur HTML, tampilan CSS, dan interaksi JavaScript.',
  keyPoints: [
    'HTML menyediakan struktur dan makna semantik konten halaman.',
    'CSS mengatur tata letak, tipografi, warna, serta responsivitas lintas layar.',
    'JavaScript menangani perilaku interaktif dan pengelolaan state antarmuka.',
  ],
  attachments: [
    {
      id: 'file-pw-01',
      title: 'Pertemuan 1: Konsep Dasar Web',
      fileName: 'Modul_1_Pengenalan.pdf',
      fileSize: '1,8 MB',
      fileType: 'PDF',
    },
    {
      id: 'file-pw-02',
      title: 'Slide Presentasi Kuliah 01',
      fileName: 'Slide_01_Arsitektur_Web.pdf',
      fileSize: '2,4 MB',
      fileType: 'Slide',
    },
  ],
};

export const MOCK_MATERIAL_DETAILS = {
  'act-pw-m1': PERTEMUAN_1_WEB_MATERIAL,
  'meet-pw-01': PERTEMUAN_1_WEB_MATERIAL,
  'meet-pw-02': {
    id: 'meet-pw-02',
    meetingBadge: 'Pertemuan 2',
    title: 'Pertemuan 2: Struktur HTML Semantik',
    estimatedRead: '20 menit baca',
    video: {
      title: 'Video Rekaman: Elemen Semantik & Aksesibilitas',
      duration: '16:15',
      description:
        'Membedakan tag generik div/span dengan elemen bermakna seperti header, nav, main, button, dan label.',
    },
    summary:
      'Pemilihan elemen HTML berdasarkan maknanya membantu mesin pencari dan pembaca layar memahami struktur dokumen. Hirarki dokumen (h1–h6) dipisahkan dari ukuran visual agar tetap konsisten dan aksesibel.',
    keyPoints: [
      'Gunakan elemen <button> asli untuk aksi dan <a> untuk navigasi tautan.',
      'Pasangkan setiap <input> dengan <label htmlFor="..."> agar mudah difokuskan.',
      'Susun landmark halaman dengan <header>, <nav>, <main>, dan <footer>.',
    ],
    attachments: [
      {
        id: 'file-pw-03',
        title: 'Pertemuan 2: Panduan HTML Semantik',
        fileName: 'Modul_2_HTML_Semantik.pdf',
        fileSize: '2,1 MB',
        fileType: 'PDF',
      },
    ],
  },
  'meet-pw-03': {
    id: 'meet-pw-03',
    meetingBadge: 'Pertemuan 3',
    title: 'Pertemuan 3: Dasar CSS & Design Token',
    estimatedRead: '18 menit baca',
    video: {
      title: 'Video Rekaman: Box Model & CSS Custom Properties',
      duration: '14:50',
      description:
        'Menerjemahkan skala warna, tipografi, dan spasi dari berkas desain menjadi variabel CSS di :root.',
    },
    summary:
      'CSS Custom Properties memungkinkan nilai desain ditulis satu kali di berkas tokens.css lalu dipakai ulang di seluruh komponen. Pendekatan ini mencegah nilai warna atau spasi melenceng antarhalaman.',
    keyPoints: [
      'Gunakan box-sizing: border-box agar lebar elemen konsisten.',
      'Hindari angka mentah (hardcode) pada komponen; gunakan var(--token).',
      'Gunakan satuan relatif rem untuk tipografi agar menghormati pengaturan peramban.',
    ],
    attachments: [
      {
        id: 'file-pw-04',
        title: 'Pertemuan 3: CSS & Variabel Token',
        fileName: 'Modul_3_CSS_Token.pdf',
        fileSize: '1,9 MB',
        fileType: 'PDF',
      },
    ],
  },
  default: {
    id: 'material-default',
    meetingBadge: 'Materi Pertemuan',
    title: 'Pertemuan 1: Pengantar & Konsep Dasar',
    estimatedRead: '15 menit baca',
    video: {
      title: 'Video Pengantar Pertemuan',
      duration: '11:20',
      description:
        'Gambaran umum capaian pembelajaran, topik inti pertemuan, serta panduan pengerjaan latihan.',
    },
    summary:
      'Materi ini merangkum konsep fondasi pertemuan pertama beserta daftar bacaan pendukung yang perlu dipahami sebelum mengerjakan kuis atau tugas praktikum.',
    keyPoints: [
      'Pahami istilah inti dan capaian pembelajaran pertemuan.',
      'Unduh berkas modul PDF untuk panduan belajar mandiri.',
      'Tandai selesai setelah membaca ringkasan dan menonton video.',
    ],
    attachments: [
      {
        id: 'file-def-01',
        title: 'Modul Bacaan Pertemuan 1',
        fileName: 'Modul_1_Pengantar.pdf',
        fileSize: '1,5 MB',
        fileType: 'PDF',
      },
    ],
  },
};

/* Data soal kuis pilihan ganda untuk QuizPage (E09 / Bagian Kuis E06) */
export const MOCK_QUIZ_DETAILS = {
  'act-pw-q1': {
    id: 'act-pw-q1',
    title: 'Kuis 1: HTML & CSS Dasar',
    description:
      'Jawab seluruh pertanyaan pilihan ganda berikut. Jawaban tersimpan otomatis sebelum Anda menekan tombol Kirim Jawaban.',
    durationMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: 'q-pw-1',
        text: 'Protokol utama yang digunakan peramban untuk meminta dan menerima dokumen HTML dari server web adalah...',
        options: [
          { id: 'a', label: 'HTTP / HTTPS' },
          { id: 'b', label: 'SMTP' },
          { id: 'c', label: 'FTP' },
          { id: 'd', label: 'SSH' },
        ],
        correctOptionId: 'a',
        explanation:
          'HTTP/HTTPS adalah protokol komunikasi standar pada World Wide Web untuk mengirim dokumen HTML dan aset web.',
      },
      {
        id: 'q-pw-2',
        text: 'Mengapa tombol aksi sebaiknya ditulis menggunakan elemen <button> asli dibandingkan <div> dengan event onClick?',
        options: [
          { id: 'a', label: 'Elemen <button> tidak memerlukan CSS sama sekali' },
          {
            id: 'b',
            label:
              'Elemen <button> otomatis mendukung fokus Tab, Enter/Spasi, dan dikenali pembaca layar',
          },
          { id: 'c', label: 'Elemen <div> tidak bisa menerima warna latar' },
          { id: 'd', label: 'Elemen <button> hanya dapat dipakai di layar ponsel' },
        ],
        correctOptionId: 'b',
        explanation:
          'Elemen <button> semantik membawa dukungan aksesibilitas papan ketik dan screen reader secara bawaan.',
      },
      {
        id: 'q-pw-3',
        text: 'Pada alur kerja mobile-first CSS, aturan media query ditulis menggunakan kondisi...',
        options: [
          { id: 'a', label: 'max-width untuk mengecilkan layout desktop' },
          { id: 'b', label: 'min-width untuk menambah aturan saat layar melebar' },
          { id: 'c', label: 'device-width tetap sebesar 980px' },
          { id: 'd', label: 'orientation: portrait untuk semua layar' },
        ],
        correctOptionId: 'b',
        explanation:
          'Pendekatan mobile-first menulis gaya dasar untuk layar sempit lalu memperkaya tata letak memakai @media (min-width: ...).',
      },
      {
        id: 'q-pw-4',
        text: 'Berapa rasio kontras minimum WCAG 2.2 tingkat AA untuk teks ukuran biasa (di bawah 24px)?',
        options: [
          { id: 'a', label: '2,5 : 1' },
          { id: 'b', label: '3,0 : 1' },
          { id: 'c', label: '4,5 : 1' },
          { id: 'd', label: '7,0 : 1' },
        ],
        correctOptionId: 'c',
        explanation:
          'WCAG 2.2 AA mensyaratkan minimal 4,5:1 untuk teks biasa dan 3:1 untuk teks besar serta komponen antarmuka.',
      },
      {
        id: 'q-pw-5',
        text: 'Manakah contoh penamaan design token yang benar menurut tugasnya (task-based)?',
        options: [
          { id: 'a', label: '--merah-gelap' },
          { id: 'b', label: '--teks-besar-24' },
          { id: 'c', label: '--color-primary' },
          { id: 'd', label: '--kotak-kiri-biru' },
        ],
        correctOptionId: 'c',
        explanation:
          'Penamaan menurut tugas (--color-primary) tetap relevan meski nilai warna atau tampilannya berubah di masa depan.',
      },
    ],
  },
  default: {
    id: 'quiz-default',
    title: 'Kuis 1: Pemahaman Konsep Dasar',
    description:
      'Kerjakan soal pilihan ganda berikut untuk mengevaluasi pemahaman materi pertemuan pertama.',
    durationMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: 'q-def-1',
        text: 'Dalam Atomic Design, gabungan beberapa atom yang bekerja sebagai satu unit fungsi (misalnya Label + Input + Pesan Galat) disebut...',
        options: [
          { id: 'a', label: 'Token' },
          { id: 'b', label: 'Molekul' },
          { id: 'c', label: 'Template' },
          { id: 'd', label: 'Halaman' },
        ],
        correctOptionId: 'b',
        explanation:
          'Molekul menyatukan beberapa atom untuk menjalankan satu tanggung jawab sederhana.',
      },
      {
        id: 'q-def-2',
        text: 'Satuan tipografi CSS mana yang dianjurkan agar ukuran teks tetap menghormati pengaturan huruf peramban pengguna?',
        options: [
          { id: 'a', label: 'rem' },
          { id: 'b', label: 'cm' },
          { id: 'c', label: 'pt cetak' },
          { id: 'd', label: 'px tetap pada semua elemen' },
        ],
        correctOptionId: 'a',
        explanation:
          'Satuan rem mengacu pada ukuran huruf akar browser sehingga fleksibel dan tidak bertumpuk seperti em.',
      },
      {
        id: 'q-def-3',
        text: 'Apa tujuan utama menaruh tombol utama pada layar ponsel dengan tinggi minimal 44–48px?',
        options: [
          { id: 'a', label: 'Agar menghabiskan ruang layar' },
          { id: 'b', label: 'Agar target sentuh nyaman ditekan ibu jari tanpa salah tekan' },
          { id: 'c', label: 'Agar warna tombol terlihat lebih gelap' },
          { id: 'd', label: 'Agar dapat menampilkan efek hover di ponsel' },
        ],
        correctOptionId: 'b',
        explanation:
          'Jari tidak sepresisi kursor mouse sehingga area sentuh 44–48px mengurangi kesalahan ketuk.',
      },
    ],
  },
};

/* Daftar tugas & tenggat mahasiswa untuk E07 Daftar Tugas dan E08 Kirim Tugas */
export const MOCK_TASKS = [
  {
    id: 'task-pw-01',
    courseId: 'mk-pw-01',
    courseName: 'Pemrograman Web',
    type: 'task',
    title: 'Tugas 1: Analisis UI/UX',
    dueDateText: 'Batas: 30 Nov 2026 · 00.00 WIB',
    status: 'Belum Dikumpulkan',
    tabGroup: 'mendatang',
    description:
      'Lakukan audit kegunaan pada satu aplikasi web kampus, susun temuan ke dalam dokumen PDF maksimal 5 halaman, lalu unggah sebelum batas waktu.',
    allowedFormats: 'PDF, DOCX (maks. 10 MB)',
  },
  {
    id: 'task-pap-03',
    courseId: 'mk-pap-01',
    courseName: 'Pengembangan Antarmuka Pengguna',
    type: 'task',
    title: 'Tugas 3: Tipografi Digital',
    dueDateText: 'Batas: 30 Nov 2026 · 00.00 WIB',
    status: 'Belum Dikumpulkan',
    tabGroup: 'mendatang',
    isUrgent: true,
    description:
      'Susun type scale berbasis 16px lengkap dengan peran tipe (type role) di berkas Figma dan terapkan pada satu layar ELITAG.',
    allowedFormats: 'PDF atau tautan berkas desain (maks. 10 MB)',
  },
  {
    id: 'act-pw-q1',
    courseId: 'mk-pw-01',
    courseName: 'Pemrograman Web',
    type: 'quiz',
    title: 'Kuis 1: HTML & CSS Dasar',
    dueDateText: 'Batas: 2 Des 2026 · 12.00 WIB',
    status: 'Belum Dikumpulkan',
    statusDisplay: 'Belum Dikerjakan',
    tabGroup: 'mendatang',
    description:
      'Kuis pilihan ganda 5 soal dengan durasi pengerjaan 15 menit mengenai HTTP, HTML semantik, dan CSS mobile-first.',
  },
  {
    id: 'task-imk-02',
    courseId: 'mk-imk-01',
    courseName: 'Interaksi Manusia dan Komputer',
    type: 'task',
    title: 'Tugas 2: Evaluasi Heuristik Nielsen',
    dueDateText: 'Batas: 24 Nov 2026 · 23.59 WIB',
    status: 'Terlambat',
    tabGroup: 'mendatang',
    description:
      'Identifikasi minimal lima pelanggaran heuristik pada antarmuka layanan publik disertai rekomendasi perbaikannya.',
    allowedFormats: 'PDF (maks. 10 MB)',
  },
  {
    id: 'task-mbd-01',
    courseId: 'mk-mbd-01',
    courseName: 'Manajemen Basis Data',
    type: 'task',
    title: 'Tugas 1: Normalisasi Skema Akademik',
    dueDateText: 'Dikumpulkan: 20 Nov 2026 · 18.40 WIB',
    status: 'Sudah Dikumpulkan',
    tabGroup: 'selesai',
    submittedFile: '1462400001_Normalisasi_MBD.pdf',
    description:
      'Ubah tabel transaksi KRS menjadi bentuk normal ketiga (3NF) lengkap dengan diagram relasi antar entitas.',
    allowedFormats: 'PDF, SQL (maks. 5 MB)',
  },
  {
    id: 'task-imk-01',
    courseId: 'mk-imk-01',
    courseName: 'Interaksi Manusia dan Komputer',
    type: 'task',
    title: 'Tugas 1: Persona & Skenario Pengguna',
    dueDateText: 'Dinilai: 15 Nov 2026 · 14.20 WIB',
    status: 'Dinilai',
    tabGroup: 'selesai',
    score: 92,
    feedback: 'Analisis kebutuhan mahasiswa dan alur tugas sudah runtut dan jelas.',
    submittedFile: '1462400001_Persona_IMK.pdf',
    description:
      'Buat dua persona mahasiswa aktif beserta skenario penggunaan aplikasi belajar daring.',
    allowedFormats: 'PDF (maks. 5 MB)',
  },
];

/* Data utas forum diskusi kelas untuk E11 Forum Diskusi */
export const MOCK_DISCUSSIONS = {
  'mk-pw-01': [
    {
      id: 'disc-pw-01',
      topicTag: 'Pertemuan 1',
      title: 'Perbedaan Web Statis dan Dinamis',
      authorName: 'Budi Santoso, M.Kom.',
      authorRole: 'Dosen',
      postedAt: '2 jam yang lalu',
      content:
        'Silakan berikan pendapat dan contoh nyata perbedaan antara website statis dan dinamis di bawah ini.',
      replies: [
        {
          id: 'rep-pw-01',
          authorName: 'Nadia Kusuma Putri',
          authorRole: 'Mahasiswa',
          postedAt: '1 jam yang lalu',
          content:
            'Web statis isinya tetap seperti web profil perusahaan, sedangkan web dinamis berubah sesuai interaksi pengguna.',
        },
        {
          id: 'rep-pw-02',
          authorName: 'Dimas Saputra Pratama',
          authorRole: 'Mahasiswa',
          postedAt: '30 menit yang lalu',
          content:
            'Setuju, contoh lainnya adalah portal ELITAG ini yang menampilkan jadwal dan tugas berbeda untuk tiap mahasiswa.',
        },
      ],
    },
    {
      id: 'disc-pw-02',
      topicTag: 'Pertemuan 2',
      title: 'Kapan Menggunakan Elemen <section> vs <article>?',
      authorName: 'Raka Pratama Wijaya',
      authorRole: 'Mahasiswa',
      postedAt: 'Kemarin · 19.15 WIB',
      content:
        'Pada tugas struktur HTML semantik, apakah kartu mata kuliah di Beranda lebih tepat memakai <article> atau <section>?',
      replies: [
        {
          id: 'rep-pw-03',
          authorName: 'Budi Santoso, M.Kom.',
          authorRole: 'Dosen',
          postedAt: 'Kemarin · 20.05 WIB',
          content:
            'Gunakan <article> untuk satu konten mandiri seperti kartu tugas atau utas diskusi, sedangkan <section> untuk mengelompokkan satu bagian tematik yang punya heading.',
        },
      ],
    },
    {
      id: 'disc-pw-03',
      topicTag: 'Pertemuan 3',
      title: 'Tips Mengatur Breakpoint Mobile-First di CSS',
      authorName: 'Budi Santoso, M.Kom.',
      authorRole: 'Dosen',
      postedAt: '3 hari yang lalu',
      content:
        'Apakah ada kendala saat menerjemahkan tata letak 1 kolom di ponsel menjadi 2 kolom di desktop menggunakan @media (min-width: 840px)? Bagikan kendala kalian di sini.',
      replies: [],
    },
  ],
  default: [
    {
      id: 'disc-def-01',
      topicTag: 'Pertemuan 1',
      title: 'Diskusi Pengantar & Kontrak Perkuliahan',
      authorName: 'Dosen Pengampu',
      authorRole: 'Dosen',
      postedAt: '1 hari yang lalu',
      content:
        'Silakan ajukan pertanyaan terkait rencana pembelajaran semester, pembagian kelompok, atau ketentuan penilaian mata kuliah ini.',
      replies: [
        {
          id: 'rep-def-01',
          authorName: 'Raka Pratama Wijaya',
          authorRole: 'Mahasiswa',
          postedAt: '18 jam yang lalu',
          content:
            'Terima kasih, apakah pengumpulan tugas mingguan dilakukan per individu atau per kelompok?',
        },
      ],
    },
  ],
};

/* Data rekap nilai & umpan balik dosen untuk E12 Nilai & Umpan Balik */
export const MOCK_GRADES = [
  {
    id: 'grade-pw-01',
    courseId: 'mk-pw-01',
    courseCode: 'IF201',
    courseName: 'Pemrograman Web',
    semester: 'Semester Ganjil',
    category: 'Tugas',
    title: 'Tugas 1: Analisis UI/UX',
    weight: 20,
    score: 90,
    maxScore: 100,
    status: 'Dinilai',
    gradedAt: 'Dinilai 1 Nov 2026',
    graderName: 'Budi Santoso, M.Kom.',
    feedback:
      'Analisis hirarki visual dan kontras warna sudah sangat teliti serta memenuhi standar WCAG.',
  },
  {
    id: 'grade-pw-02',
    courseId: 'mk-pw-01',
    courseCode: 'IF201',
    courseName: 'Pemrograman Web',
    semester: 'Semester Ganjil',
    category: 'Kuis',
    title: 'Kuis 1: HTML & CSS Dasar',
    weight: 15,
    score: 87,
    maxScore: 100,
    status: 'Dinilai',
    gradedAt: 'Dinilai otomatis 25 Okt 2026',
    graderName: 'Sistem ELITAG',
    feedback:
      'Pemahaman struktur elemen HTML sudah baik. Tingkatkan latihan pada bagian tata letak CSS Grid.',
  },
  {
    id: 'grade-pw-03',
    courseId: 'mk-pw-01',
    courseCode: 'IF201',
    courseName: 'Pemrograman Web',
    semester: 'Semester Ganjil',
    category: 'UTS/UAS',
    title: 'ETS: Implementasi Antarmuka Responsif',
    weight: 30,
    score: null,
    maxScore: 100,
    status: 'Menunggu Penilaian',
    gradedAt: 'Dikumpulkan 18 Nov 2026',
    graderName: 'Budi Santoso, M.Kom.',
    feedback: '',
  },
  {
    id: 'grade-imk-01',
    courseId: 'mk-imk-01',
    courseCode: 'IF205',
    courseName: 'Interaksi Manusia dan Komputer',
    semester: 'Semester Ganjil',
    category: 'Tugas',
    title: 'Tugas 1: Persona & Skenario Pengguna',
    weight: 25,
    score: 92,
    maxScore: 100,
    status: 'Dinilai',
    gradedAt: 'Dinilai 15 Nov 2026',
    graderName: 'Siti Rahmawati, S.Kom., M.T.',
    feedback:
      'Analisis kebutuhan mahasiswa dan alur tugas sudah runtut dan jelas. Pertahankan ketajaman pada bagian kendala perangkat mobile.',
  },
  {
    id: 'grade-imk-02',
    courseId: 'mk-imk-01',
    courseCode: 'IF205',
    courseName: 'Interaksi Manusia dan Komputer',
    semester: 'Semester Ganjil',
    category: 'UTS/UAS',
    title: 'ETS: Audit Heuristik Layanan Kampus',
    weight: 35,
    score: 84,
    maxScore: 100,
    status: 'Dinilai',
    gradedAt: 'Dinilai 10 Nov 2026',
    graderName: 'Siti Rahmawati, S.Kom., M.T.',
    feedback:
      'Temuan heuristik sudah lengkap. Perlu tambahan prioritas perbaikan berdasarkan tingkat keparahan.',
  },
];

/* Data topik bantuan & panduan untuk halaman Profil (E10) */
export const MOCK_HELP_TOPICS = [
  {
    id: 'help-01',
    question: 'Bagaimana cara mengumpulkan tugas atau mengunggah file?',
    answer: 'Buka halaman mata kuliah terkait, pilih aktivitas bertanda Tugas, lalu unggah file sesuai format yang diminta sebelum batas waktu berakhir.',
  },
  {
    id: 'help-02',
    question: 'Mengapa nilai kuis saya belum muncul di halaman Nilai?',
    answer: 'Nilai kuis pilihan ganda muncul otomatis setelah selesai mengerjakan, sedangkan soal esai menunggu penilaian manual dari dosen pengampu.',
  },
  {
    id: 'help-03',
    question: 'Bagaimana cara memperbarui foto atau informasi profil akun?',
    answer: 'Informasi akademik utama (NIM, Program Studi, Email) tersinkronisasi langsung dengan sistem akademik kampus.',
  },
];