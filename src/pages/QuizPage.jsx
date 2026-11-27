import './QuizPage.css';
import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Skeleton } from '../components/atoms';
import { EmptyState, ErrorState, PageHeader } from '../components/molecules';
import { ConfirmDialog } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import {
  MOCK_COURSE_CATALOG,
  MOCK_QUIZ_DETAILS,
} from '../data/mockElitagData';
import './QuizPage.css';

/* Katalog & soal kuis selaras dengan desain Figma E09 (tanpa perlu mengubah mockElitagData.js) */
const FIGMA_QUIZ_CATALOG = [
  {
    id: 'act-pw-q1',
    title: 'Kuis 1: HTML & CSS',
    dueDateText: 'Batas: 25 Okt 2026',
    durationMinutes: 60,
    initialSeconds: 45 * 60 + 12, // 45:12 sesuai tampilan desain E09
    passingScore: 70,
    questions: [
      {
        id: 'q-e09-1',
        text: 'Apakah kepanjangan dari HTML dalam pengembangan web?',
        options: [
          { id: 'a', label: 'HyperText Markup Language' },
          { id: 'b', label: 'HighText Machine Language' },
          { id: 'c', label: 'Hyperlink Text Markup Language' },
          { id: 'd', label: 'Home Tool Markup Language' },
        ],
        correctOptionId: 'a',
        explanation:
          'HTML merupakan singkatan dari HyperText Markup Language, bahasa markah standar untuk menyusun struktur halaman web.',
      },
      {
        id: 'q-e09-2',
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
          'Elemen <button> semantik membawa dukungan aksesibilitas papan ketik dan pembaca layar secara bawaan.',
      },
      {
        id: 'q-e09-3',
        text: 'Pada alur kerja mobile-first CSS, aturan media query ditulis menggunakan kondisi...',
        options: [
          { id: 'a', label: 'max-width untuk mengecilkan layout desktop' },
          { id: 'b', label: 'min-width untuk menambah aturan saat layar melebar' },
          { id: 'c', label: 'device-width tetap sebesar 980px' },
          { id: 'd', label: 'orientation: portrait untuk semua layar' },
        ],
        correctOptionId: 'b',
        explanation:
          'Pendekatan mobile-first menulis gaya dasar untuk layar sempit lalu memperkaya tata letak dengan @media (min-width: ...).',
      },
      {
        id: 'q-e09-4',
        text: 'Berapa rasio kontras minimum WCAG 2.2 tingkat AA untuk teks ukuran biasa (di bawah 24px)?',
        options: [
          { id: 'a', label: '2,5 : 1' },
          { id: 'b', label: '3,0 : 1' },
          { id: 'c', label: '4,5 : 1' },
          { id: 'd', label: '7,0 : 1' },
        ],
        correctOptionId: 'c',
        explanation:
          'WCAG 2.2 tingkat AA mensyaratkan rasio kontras minimal 4,5:1 untuk teks biasa dan 3:1 untuk teks besar serta komponen.',
      },
      {
        id: 'q-e09-5',
        text: 'Manakah contoh penamaan design token yang benar menurut tugasnya (task-based)?',
        options: [
          { id: 'a', label: '--merah-gelap' },
          { id: 'b', label: '--teks-besar-24' },
          { id: 'c', label: '--color-primary' },
          { id: 'd', label: '--kotak-kiri-biru' },
        ],
        correctOptionId: 'c',
        explanation:
          'Penamaan menurut tugas (--color-primary) tetap relevan meskipun nilai warna merek berubah di kemudian hari.',
      },
    ],
  },
  {
    id: 'act-pw-q2',
    title: 'Kuis 2: JavaScript Dasar',
    dueDateText: 'Batas: 1 Nov 2026',
    durationMinutes: 60,
    initialSeconds: 60 * 60,
    passingScore: 70,
    questions: [
      {
        id: 'q-js-1',
        text: 'Kata kunci mana yang digunakan di JavaScript modern untuk mendeklarasikan variabel yang nilainya tidak di-reassign?',
        options: [
          { id: 'a', label: 'const' },
          { id: 'b', label: 'var' },
          { id: 'c', label: 'static' },
          { id: 'd', label: 'fixed' },
        ],
        correctOptionId: 'a',
        explanation:
          'const mencegah penetapan ulang referensi variabel dan memiliki cakupan blok (block scope).',
      },
      {
        id: 'q-js-2',
        text: 'Hook React manakah yang digunakan untuk menyimpan dan memperbarui state lokal di dalam komponen fungsi?',
        options: [
          { id: 'a', label: 'useClass' },
          { id: 'b', label: 'useState' },
          { id: 'c', label: 'useDOM' },
          { id: 'd', label: 'useStyle' },
        ],
        correctOptionId: 'b',
        explanation:
          'useState mengembalikan pasangan nilai state saat ini beserta fungsi pembaruannya di React.',
      },
      {
        id: 'q-js-3',
        text: 'Metode array manakah yang menghasilkan array baru berisi elemen yang memenuhi kondisi tertentu?',
        options: [
          { id: 'a', label: 'forEach()' },
          { id: 'b', label: 'push()' },
          { id: 'c', label: 'filter()' },
          { id: 'd', label: 'join()' },
        ],
        correctOptionId: 'c',
        explanation:
          'filter() mengembalikan array baru tanpa mengubah array aslinya, berisi item yang lolos pengujian fungsi callback.',
      },
    ],
  },
  {
    id: 'act-pw-q3',
    title: 'Kuis 3: Bootstrap',
    dueDateText: 'Batas: 8 Nov 2026',
    durationMinutes: 60,
    initialSeconds: 60 * 60,
    passingScore: 70,
    questions: [
      {
        id: 'q-bs-1',
        text: 'Sistem grid standar pada sebagian besar framework CSS responsif seperti Bootstrap membagi satu baris menjadi berapa kolom?',
        options: [
          { id: 'a', label: '5 kolom' },
          { id: 'b', label: '7 kolom' },
          { id: 'c', label: '12 kolom' },
          { id: 'd', label: '15 kolom' },
        ],
        correctOptionId: 'c',
        explanation:
          'Angka 12 habis dibagi 2, 3, 4, dan 6 sehingga fleksibel melayani banyak kombinasi tata letak.',
      },
      {
        id: 'q-bs-2',
        text: 'Apa salah satu pertimbangan utama sebelum memutuskan memakai framework CSS pada proyek antarmuka?',
        options: [
          {
            id: 'a',
            label:
              'Risiko tampilan mudah mirip situs lain dan penambahan bobot halaman bila tidak dibutuhkan',
          },
          { id: 'b', label: 'Framework CSS tidak dapat berjalan di peramban ponsel' },
          { id: 'c', label: 'Framework CSS melarang penggunaan elemen HTML semantik' },
          { id: 'd', label: 'Framework CSS menghilangkan kebutuhan meta viewport' },
        ],
        correctOptionId: 'a',
        explanation:
          'Sesuai materi Pertemuan 11, penggunaan framework adalah pilihan; kecepatannya perlu ditimbang terhadap bobot dan kekhasan desain.',
      },
      {
        id: 'q-bs-3',
        text: 'Dalam tata letak responsif, mengapa container utama sebaiknya tetap diberi max-width pada layar yang sangat lebar?',
        options: [
          { id: 'a', label: 'Agar seluruh halaman harus digeser ke samping' },
          {
            id: 'b',
            label:
              'Agar panjang baris teks tetap nyaman dibaca (45–75 karakter) dan elemen tidak melar berlebihan',
          },
          { id: 'c', label: 'Agar media query tidak perlu dijalankan' },
          { id: 'd', label: 'Agar pengguna tidak dapat memperbesar halaman' },
        ],
        correctOptionId: 'b',
        explanation:
          'Membatasi lebar maksimum menjaga panjang baris bacaan tetap nyaman dan formulir tetap proporsional di monitor lebar.',
      },
    ],
  },
];

function ClockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function formatTimer(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function resolveQuizData(quizId, quizProp) {
  const fromCatalog = FIGMA_QUIZ_CATALOG.find((item) => item.id === quizId);
  if (fromCatalog) {
    return fromCatalog;
  }

  const fromMock = MOCK_QUIZ_DETAILS[quizId] || MOCK_QUIZ_DETAILS.default;
  return {
    ...fromMock,
    id: quizId || fromMock.id,
    title: quizProp?.title || fromMock.title,
    dueDateText: 'Batas: 25 Okt 2026',
    initialSeconds: (fromMock.durationMinutes || 15) * 60,
  };
}

export function QuizPage({
  course,
  quiz,
  savedResult = null,
  logoSrc = '',
  onNavigate,
  onBack,
  onSubmitQuiz,
}) {
  const activeCourse = course || MOCK_COURSE_CATALOG[0];
  const initialQuizId = quiz?.id || FIGMA_QUIZ_CATALOG[0].id;

  const [selectedQuizId, setSelectedQuizId] = useState(initialQuizId);
  const [screenMode, setScreenMode] = useState(
    quiz ? (savedResult ? 'review' : 'playing') : 'list'
  ); // 'list' | 'playing' | 'review'
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'

  const activeQuiz = useMemo(
    () => resolveQuizData(selectedQuizId, selectedQuizId === quiz?.id ? quiz : null),
    [selectedQuizId, quiz]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersByQuiz, setAnswersByQuiz] = useState(() =>
    savedResult?.answers ? { [initialQuizId]: savedResult.answers } : {}
  );
  const [resultsByQuiz, setResultsByQuiz] = useState(() =>
    savedResult ? { [initialQuizId]: savedResult } : {}
  );
  const [secondsLeft, setSecondsLeft] = useState(activeQuiz.initialSeconds);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [autoSaveText, setAutoSaveText] = useState('Tersimpan otomatis');
  const [submitWarning, setSubmitWarning] = useState('');

  const answers = answersByQuiz[activeQuiz.id] || {};
  const activeResult = resultsByQuiz[activeQuiz.id] || null;
  const totalQuestions = activeQuiz.questions.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalQuestions - 1));
  const currentQuestion = activeQuiz.questions[safeIndex];
  const answeredCount = activeQuiz.questions.filter(
    (q) => Boolean(answers[q.id])
  ).length;
  const unansweredCount = totalQuestions - answeredCount;

  /* Hitung mundur aktif hanya saat mengerjakan kuis */
  useEffect(() => {
    if (viewState !== 'normal' || screenMode !== 'playing') return undefined;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [viewState, screenMode, activeQuiz.id]);

  /* Tutup Pop-up Hasil Kuis dengan tombol Escape */
  useEffect(() => {
    if (!isResultModalOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsResultModalOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResultModalOpen]);

  function handleStartQuiz(quizItem) {
    setSelectedQuizId(quizItem.id);
    setCurrentIndex(0);
    setSubmitWarning('');
    setIsConfirmOpen(false);
    setIsResultModalOpen(false);
    setViewState('normal');

    if (resultsByQuiz[quizItem.id]) {
      setScreenMode('review');
    } else {
      setSecondsLeft(quizItem.initialSeconds);
      setAutoSaveText('Tersimpan otomatis');
      setScreenMode('playing');
    }
  }

  function handleSelectOption(questionId, optionId) {
    if (screenMode !== 'playing') return;

    setAnswersByQuiz((prev) => ({
      ...prev,
      [activeQuiz.id]: {
        ...(prev[activeQuiz.id] || {}),
        [questionId]: optionId,
      },
    }));
    setSubmitWarning('');
    setAutoSaveText('Tersimpan otomatis');
  }

  function handleRequestSubmit() {
    if (answeredCount === 0) {
      setSubmitWarning(
        'Pilih minimal satu jawaban sebelum mengirim kuis.'
      );
      return;
    }
    setSubmitWarning('');
    setIsConfirmOpen(true);
  }

  function computeAndSaveResult(overrideAnswers = null) {
    const usedAnswers = overrideAnswers || answers;
    let correctCount = 0;

    activeQuiz.questions.forEach((question) => {
      if (usedAnswers[question.id] === question.correctOptionId) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= activeQuiz.passingScore;
    const totalDurationSeconds = activeQuiz.durationMinutes * 60;
    const elapsedSeconds = Math.max(0, totalDurationSeconds - secondsLeft);

    const summary = {
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      score,
      correctCount,
      wrongCount: totalQuestions - correctCount,
      totalQuestions,
      passed,
      elapsedText: formatTimer(elapsedSeconds),
      answers: { ...usedAnswers },
    };

    setResultsByQuiz((prev) => ({
      ...prev,
      [activeQuiz.id]: summary,
    }));
    onSubmitQuiz?.(summary);
    return summary;
  }

  function handleConfirmSubmit() {
    setIsConfirmOpen(false);
    computeAndSaveResult();
    setScreenMode('review');
    setIsResultModalOpen(true);
  }

  function handleRetakeQuiz() {
    setAnswersByQuiz((prev) => ({
      ...prev,
      [activeQuiz.id]: {},
    }));
    setResultsByQuiz((prev) => {
      const next = { ...prev };
      delete next[activeQuiz.id];
      return next;
    });
    setCurrentIndex(0);
    setSecondsLeft(activeQuiz.initialSeconds);
    setAutoSaveText('Tersimpan otomatis');
    setSubmitWarning('');
    setIsResultModalOpen(false);
    setScreenMode('playing');
  }

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 600);
  }

  function handleHeaderBack() {
    if (screenMode === 'playing' || screenMode === 'review') {
      setIsConfirmOpen(false);
      setIsResultModalOpen(false);
      setScreenMode('list');
      return;
    }
    onBack?.();
  }

  /* Helper simulasi cepat untuk semua tampilan Figma E09 dan 4 state data */
  function applyDemoMode(mode) {
    setSubmitWarning('');
    setIsConfirmOpen(false);
    setIsResultModalOpen(false);

    if (mode === 'list') {
      setViewState('normal');
      setScreenMode('list');
    } else if (mode === 'playing') {
      setSelectedQuizId('act-pw-q1');
      setCurrentIndex(0);
      setSecondsLeft(45 * 60 + 12);
      setViewState('normal');
      setScreenMode('playing');
    } else if (mode === 'popup-confirm') {
      setSelectedQuizId('act-pw-q1');
      setCurrentIndex(0);
      setSecondsLeft(45 * 60 + 12);
      setViewState('normal');
      setScreenMode('playing');
      setIsConfirmOpen(true);
    } else if (mode === 'popup-result') {
      setSelectedQuizId('act-pw-q1');
      setViewState('normal');
      const existing = resultsByQuiz['act-pw-q1'];
      if (!existing) {
        const sampleAnswers = {
          'q-e09-1': 'a',
          'q-e09-2': 'b',
          'q-e09-3': 'b',
          'q-e09-4': 'c',
          'q-e09-5': 'a',
        };
        setAnswersByQuiz((prev) => ({
          ...prev,
          'act-pw-q1': sampleAnswers,
        }));
        const targetQuiz = FIGMA_QUIZ_CATALOG[0];
        let correctCount = 0;
        targetQuiz.questions.forEach((q) => {
          if (sampleAnswers[q.id] === q.correctOptionId) correctCount += 1;
        });
        setResultsByQuiz((prev) => ({
          ...prev,
          'act-pw-q1': {
            quizId: targetQuiz.id,
            quizTitle: targetQuiz.title,
            score: Math.round((correctCount / targetQuiz.questions.length) * 100),
            correctCount,
            wrongCount: targetQuiz.questions.length - correctCount,
            totalQuestions: targetQuiz.questions.length,
            passed: true,
            elapsedText: '14:48',
            answers: sampleAnswers,
          },
        }));
      }
      setScreenMode('review');
      setIsResultModalOpen(true);
    } else if (mode === 'loading' || mode === 'empty' || mode === 'error') {
      setViewState(mode);
    }
  }

  const pageTitle =
    screenMode === 'list' ? 'Pengerjaan Kuis' : activeQuiz.title;
  const pageBackLabel =
    screenMode === 'list'
      ? 'Kembali ke Halaman Kelas'
      : 'Kembali ke Daftar Kuis';

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-quiz">
        <div className="page-quiz__top-bar">
          <PageHeader
            title={pageTitle}
            backLabel={pageBackLabel}
            onBack={handleHeaderBack}
          />

          {screenMode !== 'list' && viewState === 'normal' && (
            <Button
              variant="tersier"
              size="sm"
              onClick={() => setScreenMode('list')}
            >
              Daftar Kuis
            </Button>
          )}
        </div>

        {/* State Data: Loading */}
        {viewState === 'loading' && (
          <div
            className="page-quiz__skeleton-wrap"
            aria-busy="true"
            aria-label="Memuat data pengerjaan kuis"
          >
            <div className="page-quiz__skeleton-row">
              <Skeleton variant="rect" width="150px" height="32px" />
              <Skeleton variant="rect" width="140px" height="24px" />
            </div>
            <div className="page-quiz__skeleton-pills">
              <Skeleton variant="rect" width="100%" height="44px" />
              <Skeleton variant="rect" width="100%" height="44px" />
              <Skeleton variant="rect" width="100%" height="44px" />
              <Skeleton variant="rect" width="100%" height="44px" />
              <Skeleton variant="rect" width="100%" height="44px" />
            </div>
            <Skeleton variant="rect" width="100%" height="260px" />
          </div>
        )}

        {/* State Data: Galat */}
        {viewState === 'error' && (
          <ErrorState
            title="Kuis Gagal Dimuat"
            description="Koneksi terputus saat mengambil soal kuis. Periksa jaringan Anda lalu coba lagi."
            actionLabel="Coba Lagi"
            onRetry={handleRetry}
          />
        )}

        {/* State Data: Kosong */}
        {viewState === 'empty' && (
          <EmptyState
            title="Belum Ada Kuis Tersedia"
            description="Dosen pengampu belum membuka kuis untuk mata kuliah ini saat ini."
            actionLabel="Kembali ke Halaman Kelas"
            onAction={onBack}
          />
        )}

        {/* State Data: Normal */}
        {viewState === 'normal' && (
          <>
            {/* MODE 1: Daftar Kuis (Sesuai E09 - Pengerjaan Kuis.pdf) */}
            {screenMode === 'list' && (
              <section
                className="page-quiz__catalog"
                aria-label="Daftar kuis mata kuliah"
              >
                <p className="page-quiz__catalog-course">
                  {activeCourse.code} · {activeCourse.title}
                </p>

                <div className="page-quiz__catalog-grid">
                  {FIGMA_QUIZ_CATALOG.map((item) => {
                    const itemResult = resultsByQuiz[item.id];
                    return (
                      <article key={item.id} className="page-quiz__catalog-card">
                        <div className="page-quiz__catalog-info">
                          <div className="page-quiz__catalog-title-row">
                            <h2 className="page-quiz__catalog-title">
                              {item.title}
                            </h2>
                            {itemResult && (
                              <Badge
                                tone={itemResult.passed ? 'berhasil' : 'peringatan'}
                              >
                                Skor: {itemResult.score}
                              </Badge>
                            )}
                          </div>

                          <p className="page-quiz__catalog-meta">
                            <span className="page-quiz__catalog-meta-part">
                              <CalendarIcon />
                              <span>{item.dueDateText}</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="page-quiz__catalog-meta-part">
                              <ClockIcon />
                              <span>{item.durationMinutes} Menit</span>
                            </span>
                          </p>
                        </div>

                        <div className="page-quiz__catalog-action">
                          <Button
                            variant="sekunder"
                            size="sm"
                            onClick={() => handleStartQuiz(item)}
                          >
                            {itemResult ? 'Lihat Hasil' : 'Mulai'}
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="page-quiz__catalog-footer">
                  <Button variant="sekunder" fullWidthMobile onClick={onBack}>
                    Kembali ke Halaman Kelas
                  </Button>
                </div>
              </section>
            )}

            {/* MODE 2: Pengerjaan Soal Aktif (Sesuai E09 - Pengerjaan Kuis-1.pdf) */}
            {screenMode === 'playing' && currentQuestion && (
              <div className="page-quiz__play-shell">
                {/* Bar Status: Sisa Waktu + Tersimpan otomatis */}
                <div className="page-quiz__status-bar">
                  <Badge
                    tone={secondsLeft <= 300 ? 'gagal' : 'utama'}
                    icon={<ClockIcon />}
                    className="page-quiz__timer-badge"
                  >
                    Sisa Waktu: {formatTimer(secondsLeft)}
                  </Badge>

                  <span className="page-quiz__autosave" role="status">
                    <CheckIcon />
                    <span>{autoSaveText}</span>
                  </span>
                </div>

                {/* Bar Navigasi Nomor Soal Horizontal (1 2 3 4 5) */}
                <nav
                  className="page-quiz__number-nav"
                  aria-label="Navigasi nomor soal kuis"
                >
                  <div className="page-quiz__number-strip">
                    {activeQuiz.questions.map((question, index) => {
                      const isActive = index === safeIndex;
                      const isAnswered = Boolean(answers[question.id]);

                      const pillClasses = [
                        'page-quiz__num-btn',
                        isActive ? 'page-quiz__num-btn--active' : '',
                        !isActive && isAnswered
                          ? 'page-quiz__num-btn--answered'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <button
                          key={question.id}
                          type="button"
                          className={pillClasses}
                          aria-current={isActive ? 'step' : undefined}
                          aria-label={`Soal ${index + 1}${
                            isActive
                              ? ' (sedang dibuka)'
                              : isAnswered
                                ? ' (sudah dijawab)'
                                : ' (belum dijawab)'
                          }`}
                          onClick={() => setCurrentIndex(index)}
                        >
                          <span>{index + 1}</span>
                          {isAnswered && !isActive && (
                            <span
                              className="page-quiz__num-dot"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <p className="page-quiz__progress-text">
                    {answeredCount} dari {totalQuestions} soal terjawab
                  </p>
                </nav>

                {/* Kartu Soal Aktif (Satu soal per layar sesuai Figma) */}
                <fieldset className="page-quiz__question-card">
                  <legend className="page-quiz__question-legend">
                    <span className="page-quiz__q-prefix">
                      Soal {safeIndex + 1} dari {totalQuestions}:{' '}
                    </span>
                    <span className="page-quiz__q-text">
                      {currentQuestion.text}
                    </span>
                  </legend>

                  <div className="page-quiz__options">
                    {currentQuestion.options.map((option) => {
                      const isSelected =
                        answers[currentQuestion.id] === option.id;
                      const inputId = `${currentQuestion.id}-${option.id}`;

                      return (
                        <label
                          key={option.id}
                          htmlFor={inputId}
                          className={`page-quiz__option ${
                            isSelected ? 'page-quiz__option--selected' : ''
                          }`}
                        >
                          <input
                            id={inputId}
                            type="radio"
                            name={currentQuestion.id}
                            value={option.id}
                            checked={isSelected}
                            onChange={() =>
                              handleSelectOption(currentQuestion.id, option.id)
                            }
                            className="page-quiz__radio"
                          />
                          <span className="page-quiz__option-letter">
                            {option.id.toUpperCase()}.
                          </span>
                          <span className="page-quiz__option-label">
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Peringatan validasi bila belum ada jawaban */}
                {submitWarning && (
                  <p className="page-quiz__warning" role="alert">
                    {submitWarning}
                  </p>
                )}

                {/* Navigasi Sebelumnya / Berikutnya + Aksi Primer Kirim Kuis */}
                <div className="page-quiz__play-actions">
                  <div className="page-quiz__step-controls">
                    <Button
                      variant="sekunder"
                      size="sm"
                      disabled={safeIndex === 0}
                      onClick={() =>
                        setCurrentIndex((prev) => Math.max(0, prev - 1))
                      }
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="sekunder"
                      size="sm"
                      disabled={safeIndex === totalQuestions - 1}
                      onClick={() =>
                        setCurrentIndex((prev) =>
                          Math.min(totalQuestions - 1, prev + 1)
                        )
                      }
                    >
                      Berikutnya
                    </Button>
                  </div>

                  <Button
                    variant="primer"
                    fullWidth
                    onClick={handleRequestSubmit}
                  >
                    Kirim Kuis
                  </Button>
                </div>
              </div>
            )}

            {/* MODE 3: Ringkasan Skor & Pembahasan (setelah kuis dikirim) */}
            {screenMode === 'review' && activeResult && (
              <section
                className="page-quiz__review-shell"
                aria-labelledby="quiz-review-heading"
              >
                <div className="page-quiz__result-card">
                  <div className="page-quiz__result-head">
                    <Badge
                      tone={activeResult.passed ? 'berhasil' : 'peringatan'}
                    >
                      {activeResult.passed ? 'Lulus Kuis' : 'Perlu Mengulang'}
                    </Badge>
                    <span className="page-quiz__course-ref">
                      {activeCourse.code} · {activeCourse.title}
                    </span>
                  </div>

                  <h2 id="quiz-review-heading" className="page-quiz__score">
                    Skor Anda: {activeResult.score} / 100
                  </h2>

                  <p className="page-quiz__result-desc">
                    Batas kelulusan: {activeQuiz.passingScore} · Waktu
                    pengerjaan: {activeResult.elapsedText}
                  </p>

                  <div className="page-quiz__stats-grid">
                    <div className="page-quiz__stat-box">
                      <span className="page-quiz__stat-label">Benar</span>
                      <span className="page-quiz__stat-value page-quiz__stat-value--success">
                        {activeResult.correctCount}
                      </span>
                    </div>
                    <div className="page-quiz__stat-box">
                      <span className="page-quiz__stat-label">
                        Salah / Kosong
                      </span>
                      <span className="page-quiz__stat-value page-quiz__stat-value--error">
                        {activeResult.wrongCount}
                      </span>
                    </div>
                    <div className="page-quiz__stat-box">
                      <span className="page-quiz__stat-label">Total Soal</span>
                      <span className="page-quiz__stat-value">
                        {activeResult.totalQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="page-quiz__result-actions">
                    <Button variant="primer" fullWidthMobile onClick={onBack}>
                      Kembali ke Halaman Kelas
                    </Button>
                    <Button
                      variant="sekunder"
                      fullWidthMobile
                      onClick={handleRetakeQuiz}
                    >
                      Kerjakan Ulang
                    </Button>
                    <Button
                      variant="tersier"
                      fullWidthMobile
                      onClick={() => setIsResultModalOpen(true)}
                    >
                      Lihat Pop-up Hasil
                    </Button>
                  </div>
                </div>

                <div className="page-quiz__review-list">
                  <h3 className="page-quiz__section-title">
                    Pembahasan Jawaban
                  </h3>

                  {activeQuiz.questions.map((question, index) => {
                    const userChoice = activeResult.answers[question.id];
                    const isCorrect = userChoice === question.correctOptionId;
                    const chosenOption = question.options.find(
                      (opt) => opt.id === userChoice
                    );
                    const rightOption = question.options.find(
                      (opt) => opt.id === question.correctOptionId
                    );

                    return (
                      <article
                        key={question.id}
                        className="page-quiz__review-item"
                      >
                        <div className="page-quiz__review-top">
                          <span className="page-quiz__review-num">
                            Soal {index + 1} dari {totalQuestions}
                          </span>
                          <Badge tone={isCorrect ? 'berhasil' : 'gagal'}>
                            {isCorrect ? 'Benar' : 'Kurang Tepat'}
                          </Badge>
                        </div>

                        <p className="page-quiz__review-q">{question.text}</p>

                        <p className="page-quiz__review-answer">
                          Jawaban Anda:{' '}
                          <strong>
                            {chosenOption
                              ? `${chosenOption.id.toUpperCase()}. ${chosenOption.label}`
                              : 'Tidak dijawab'}
                          </strong>
                        </p>

                        {!isCorrect && rightOption && (
                          <p className="page-quiz__review-correct">
                            Jawaban tepat:{' '}
                            <strong>
                              {rightOption.id.toUpperCase()}. {rightOption.label}
                            </strong>
                          </p>
                        )}

                        <p className="page-quiz__review-exp">
                          {question.explanation}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* Panel Simulasi Lengkap untuk Demo & Pengujian E09 */}
        <aside
          className="page-quiz__demo-bar"
          aria-label="Simulasi tampilan dan 4 keadaan data halaman E09"
        >
          <span className="page-quiz__demo-label">Simulasi State E09:</span>
          <div className="page-quiz__demo-actions">
            {[
              {
                key: 'list',
                label: 'Daftar Kuis',
                active: viewState === 'normal' && screenMode === 'list',
              },
              {
                key: 'playing',
                label: 'Soal Aktif',
                active:
                  viewState === 'normal' &&
                  screenMode === 'playing' &&
                  !isConfirmOpen,
              },
              {
                key: 'popup-confirm',
                label: 'Pop-up Kirim',
                active: viewState === 'normal' && isConfirmOpen,
              },
              {
                key: 'popup-result',
                label: 'Pop-up Hasil',
                active: viewState === 'normal' && isResultModalOpen,
              },
              {
                key: 'loading',
                label: 'Loading',
                active: viewState === 'loading',
              },
              {
                key: 'empty',
                label: 'Kosong',
                active: viewState === 'empty',
              },
              {
                key: 'error',
                label: 'Galat',
                active: viewState === 'error',
              },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-quiz__demo-btn ${
                  item.active ? 'page-quiz__demo-btn--active' : ''
                }`}
                aria-pressed={item.active}
                onClick={() => applyDemoMode(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Pop Up Konfirmasi Kirim Kuis (Persis E09 - Pengerjaan Kuis Pop Up.pdf) */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Kirim Kuis Sekarang?"
          description={
            unansweredCount > 0
              ? `Pastikan seluruh soal telah terjawab (${answeredCount}/${totalQuestions} terjawab). Jawaban tidak dapat diubah setelah dikirim.`
              : 'Pastikan seluruh soal telah terjawab. Jawaban tidak dapat diubah setelah dikirim.'
          }
          cancelLabel="Batal"
          confirmLabel="Ya, Kirim"
          confirmVariant="primer"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
        />

        {/* Pop Up Hasil Kuis (Muncul otomatis setelah menekan Ya, Kirim) */}
        {isResultModalOpen && activeResult && (
          <div
            className="page-quiz__modal-backdrop"
            role="presentation"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsResultModalOpen(false);
              }
            }}
          >
            <div
              className="page-quiz__result-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quiz-result-modal-title"
              aria-describedby="quiz-result-modal-desc"
            >
              <div className="page-quiz__modal-badge">
                <Badge tone={activeResult.passed ? 'berhasil' : 'peringatan'}>
                  {activeResult.passed ? 'Kuis Selesai · Lulus' : 'Kuis Selesai'}
                </Badge>
              </div>

              <h2
                id="quiz-result-modal-title"
                className="page-quiz__modal-title"
              >
                Hasil {activeResult.quizTitle}
              </h2>

              <p
                id="quiz-result-modal-desc"
                className="page-quiz__modal-score-wrap"
              >
                <span className="page-quiz__modal-score">
                  {activeResult.score}
                </span>
                <span className="page-quiz__modal-max">/ 100</span>
              </p>

              <div className="page-quiz__modal-stats">
                <div className="page-quiz__stat-box">
                  <span className="page-quiz__stat-label">Benar</span>
                  <span className="page-quiz__stat-value page-quiz__stat-value--success">
                    {activeResult.correctCount}
                  </span>
                </div>
                <div className="page-quiz__stat-box">
                  <span className="page-quiz__stat-label">Salah</span>
                  <span className="page-quiz__stat-value page-quiz__stat-value--error">
                    {activeResult.wrongCount}
                  </span>
                </div>
                <div className="page-quiz__stat-box">
                  <span className="page-quiz__stat-label">Durasi</span>
                  <span className="page-quiz__stat-value">
                    {activeResult.elapsedText}
                  </span>
                </div>
              </div>

              <div className="page-quiz__modal-actions">
                <Button
                  variant="sekunder"
                  fullWidth
                  onClick={() => setIsResultModalOpen(false)}
                >
                  Lihat Pembahasan
                </Button>
                <Button variant="primer" fullWidth onClick={onBack}>
                  Kembali ke Kelas
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayoutTemplate>
  );
}