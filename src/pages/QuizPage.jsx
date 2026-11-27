import { useEffect, useState } from 'react';
import { Badge, Button, Skeleton } from '../components/atoms';
import { EmptyState, ErrorState, PageHeader } from '../components/molecules';
import { ConfirmDialog } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import {
  MOCK_COURSE_CATALOG,
  MOCK_QUIZ_DETAILS,
} from '../data/mockElitagData';
import './QuizPage.css';

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
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function formatTimer(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
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
  const quizLookup = MOCK_QUIZ_DETAILS[quiz?.id] || MOCK_QUIZ_DETAILS.default;
  const activeQuiz = {
    ...quizLookup,
    id: quiz?.id || quizLookup.id,
    title:
      quiz?.id && MOCK_QUIZ_DETAILS[quiz.id]
        ? quizLookup.title
        : quiz?.title || quizLookup.title,
  };

  const initialSeconds = activeQuiz.durationMinutes * 60;

  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'
  const [answers, setAnswers] = useState(savedResult?.answers || {});
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [result, setResult] = useState(savedResult);
  const [lastSavedText, setLastSavedText] = useState('Siap menyimpan otomatis');
  const [submitWarning, setSubmitWarning] = useState('');

  const totalQuestions = activeQuiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  useEffect(() => {
    if (viewState !== 'normal' || result) return undefined;

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
  }, [viewState, result]);

  function handleSelectOption(questionId, optionId) {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setSubmitWarning('');
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setLastSavedText(`Tersimpan otomatis pukul ${hh}.${mm}`);
  }

  function scrollToQuestion(questionId) {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  function handleConfirmSubmit() {
    let correctCount = 0;
    activeQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctOptionId) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= activeQuiz.passingScore;
    const elapsedSeconds = initialSeconds - secondsLeft;

    const summary = {
      quizId: activeQuiz.id,
      score,
      correctCount,
      wrongCount: totalQuestions - correctCount,
      totalQuestions,
      passed,
      elapsedText: formatTimer(elapsedSeconds),
      answers: { ...answers },
    };

    setIsConfirmOpen(false);
    setResult(summary);
    onSubmitQuiz?.(summary);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRetake() {
    setAnswers({});
    setResult(null);
    setSecondsLeft(initialSeconds);
    setSubmitWarning('');
    setLastSavedText('Siap menyimpan otomatis');
  }

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 600);
  }

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-quiz">
        <PageHeader
          title={activeQuiz.title}
          backLabel="Kembali ke Halaman Kelas"
          onBack={onBack}
        />

        {viewState === 'loading' && (
          <div
            className="page-quiz__skeleton-wrap"
            aria-busy="true"
            aria-label="Memuat soal kuis"
          >
            <Skeleton variant="rect" width="100%" height="96px" />
            <Skeleton variant="rect" width="100%" height="220px" />
            <Skeleton variant="rect" width="100%" height="220px" />
          </div>
        )}

        {viewState === 'error' && (
          <ErrorState
            title="Soal Kuis Gagal Dimuat"
            description="Koneksi terputus saat mengambil daftar soal. Periksa jaringan Anda lalu coba lagi."
            actionLabel="Coba Lagi"
            onRetry={handleRetry}
          />
        )}

        {viewState === 'empty' && (
          <EmptyState
            title="Belum Ada Soal Kuis Tersedia"
            description="Kuis untuk pertemuan ini belum dibuka oleh dosen pengampu."
            actionLabel="Kembali ke Halaman Kelas"
            onAction={onBack}
          />
        )}

        {viewState === 'normal' && (
          <>
            {/* Ringkasan Skor setelah Kuis Dikirim */}
            {result ? (
              <section
                className="page-quiz__result-wrap"
                aria-labelledby="quiz-result-heading"
              >
                <div className="page-quiz__result-card">
                  <div className="page-quiz__result-head">
                    <Badge tone={result.passed ? 'berhasil' : 'peringatan'}>
                      {result.passed ? 'Lulus Kuis' : 'Perlu Mengulang'}
                    </Badge>
                    <p className="page-quiz__course-ref">
                      {activeCourse.code} · {activeCourse.title}
                    </p>
                  </div>

                  <h2 id="quiz-result-heading" className="page-quiz__score">
                    Skor Anda: {result.score} / 100
                  </h2>

                  <p className="page-quiz__result-desc">
                    Batas minimal kelulusan: {activeQuiz.passingScore}. Waktu
                    pengerjaan: {result.elapsedText}.
                  </p>

                  <div className="page-quiz__stats-grid">
                    <div className="page-quiz__stat-box">
                      <span className="page-quiz__stat-label">Benar</span>
                      <span className="page-quiz__stat-value page-quiz__stat-value--success">
                        {result.correctCount}
                      </span>
                    </div>
                    <div className="page-quiz__stat-box">
                      <span className="page-quiz__stat-label">Salah / Kosong</span>
                      <span className="page-quiz__stat-value page-quiz__stat-value--error">
                        {result.wrongCount}
                      </span>
                    </div>
                    <div className="page-quiz__stat-box">
                      <span className="page-quiz__stat-label">Total Soal</span>
                      <span className="page-quiz__stat-value">
                        {result.totalQuestions}
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
                      onClick={handleRetake}
                    >
                      Kerjakan Ulang Kuis
                    </Button>
                  </div>
                </div>

                {/* Pembahasan Ringkas Per Soal */}
                <div className="page-quiz__review-list">
                  <h3 className="page-quiz__section-title">
                    Ringkasan Jawaban &amp; Pembahasan
                  </h3>

                  {activeQuiz.questions.map((question, index) => {
                    const userChoice = result.answers[question.id];
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
                          <span className="page-quiz__q-number">
                            Soal {index + 1}
                          </span>
                          <Badge tone={isCorrect ? 'berhasil' : 'gagal'}>
                            {isCorrect ? 'Benar' : 'Kurang Tepat'}
                          </Badge>
                        </div>

                        <p className="page-quiz__q-text">{question.text}</p>

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
            ) : (
              /* Mode Pengerjaan Kuis Aktif */
              <div className="page-quiz__layout">
                {/* Daftar Soal Pilihan Ganda */}
                <div className="page-quiz__questions">
                  <section className="page-quiz__intro-card">
                    <div className="page-quiz__intro-meta">
                      <Badge
                        tone={secondsLeft <= 120 ? 'gagal' : 'utama'}
                        icon={<ClockIcon />}
                      >
                        Sisa Waktu: {formatTimer(secondsLeft)}
                      </Badge>
                      <Badge tone="info">
                        Durasi: {activeQuiz.durationMinutes} menit
                      </Badge>
                      <Badge tone="netral" icon={<CheckCircleIcon />}>
                        {lastSavedText}
                      </Badge>
                    </div>
                    <p className="page-quiz__intro-desc">
                      {activeQuiz.description}
                    </p>
                  </section>

                  {activeQuiz.questions.map((question, index) => {
                    const selectedOption = answers[question.id];
                    return (
                      <fieldset
                        key={question.id}
                        id={`question-${question.id}`}
                        className="page-quiz__question-card"
                      >
                        <legend className="page-quiz__question-legend">
                          <span className="page-quiz__q-number">
                            Soal {index + 1} dari {totalQuestions}
                          </span>
                          <span className="page-quiz__q-text">
                            {question.text}
                          </span>
                        </legend>

                        <div className="page-quiz__options">
                          {question.options.map((option) => {
                            const isSelected = selectedOption === option.id;
                            const inputId = `${question.id}-${option.id}`;

                            return (
                              <label
                                key={option.id}
                                htmlFor={inputId}
                                className={`page-quiz__option ${
                                  isSelected
                                    ? 'page-quiz__option--selected'
                                    : ''
                                }`}
                              >
                                <input
                                  id={inputId}
                                  type="radio"
                                  name={question.id}
                                  value={option.id}
                                  checked={isSelected}
                                  onChange={() =>
                                    handleSelectOption(question.id, option.id)
                                  }
                                  className="page-quiz__radio"
                                />
                                <span className="page-quiz__option-key">
                                  {option.id.toUpperCase()}
                                </span>
                                <span className="page-quiz__option-label">
                                  {option.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                {/* Panel Navigasi Soal & Tombol Kirim Jawaban */}
                <aside
                  className="page-quiz__side"
                  aria-label="Navigasi dan pengiriman kuis"
                >
                  <div className="page-quiz__nav-card">
                    <div className="page-quiz__nav-header">
                      <h2 className="page-quiz__nav-title">Navigasi Soal</h2>
                      <span className="page-quiz__nav-count">
                        {answeredCount}/{totalQuestions} terjawab
                      </span>
                    </div>

                    <div className="page-quiz__nav-grid">
                      {activeQuiz.questions.map((question, index) => {
                        const isAnswered = Boolean(answers[question.id]);
                        return (
                          <button
                            key={question.id}
                            type="button"
                            className={`page-quiz__nav-num ${
                              isAnswered ? 'page-quiz__nav-num--answered' : ''
                            }`}
                            aria-label={`Lompat ke soal ${index + 1}${
                              isAnswered ? ' (sudah dijawab)' : ' (belum dijawab)'
                            }`}
                            onClick={() => scrollToQuestion(question.id)}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>

                    {submitWarning && (
                      <p className="page-quiz__warning" role="alert">
                        {submitWarning}
                      </p>
                    )}

                    <div className="page-quiz__submit-actions">
                      <Button
                        variant="primer"
                        fullWidth
                        onClick={handleRequestSubmit}
                      >
                        Kirim Jawaban
                      </Button>
                      <Button variant="sekunder" fullWidth onClick={onBack}>
                        Kembali ke Halaman Kelas
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </>
        )}

        {/* Panel Simulasi 4 State Kuis */}
        <aside
          className="page-quiz__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman Kuis"
        >
          <span className="page-quiz__demo-label">Simulasi State Kuis:</span>
          <div className="page-quiz__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-quiz__demo-btn ${
                  viewState === item.key ? 'page-quiz__demo-btn--active' : ''
                }`}
                aria-pressed={viewState === item.key}
                onClick={() => setViewState(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Dialog Konfirmasi Kirim Kuis (Wajib ETS E09) */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Kirim Jawaban Kuis?"
          description={
            unansweredCount > 0
              ? `Anda baru menjawab ${answeredCount} dari ${totalQuestions} soal (${unansweredCount} soal masih kosong). Jawaban tidak dapat diubah setelah dikirim.`
              : `Seluruh ${totalQuestions} soal telah dijawab. Jawaban tidak dapat diubah setelah dikirim.`
          }
          cancelLabel="Periksa Lagi"
          confirmLabel="Ya, Kirim Jawaban"
          confirmVariant="primer"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
        />
      </div>
    </AppLayoutTemplate>
  );
}