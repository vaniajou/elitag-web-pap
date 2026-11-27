import { useMemo, useState } from 'react';
import { Badge, Button, Skeleton } from '../components/atoms';
import {
  EmptyState,
  ErrorState,
  FilterChipGroup,
  PageHeader,
} from '../components/molecules';
import { AppLayoutTemplate } from '../components/templates';
import { MOCK_GRADES } from '../data/mockElitagData';
import './GradesPage.css';

const CATEGORY_OPTIONS = [
  { value: 'semua', label: 'Semua Jenis' },
  { value: 'Tugas', label: 'Tugas' },
  { value: 'Kuis', label: 'Kuis' },
  { value: 'UTS/UAS', label: 'UTS/UAS' },
];

function AwardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function MessageSquareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function getLetterGrade(score) {
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'E';
}

function formatDecimalId(value) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function GradeSkeletonCard() {
  return (
    <div className="page-grades__skeleton-card" aria-hidden="true">
      <div className="page-grades__skeleton-top">
        <Skeleton variant="rect" width="110px" height="28px" />
        <Skeleton variant="rect" width="90px" height="24px" />
      </div>
      <Skeleton variant="text" width="68%" height="22px" />
      <Skeleton variant="text" width="52%" height="16px" />
      <Skeleton variant="rect" width="100%" height="64px" />
    </div>
  );
}

export function GradesPage({
  grades = MOCK_GRADES,
  initialCourseId = 'mk-pw-01',
  fromCourse = false,
  logoSrc = '',
  onNavigate,
  onBackToCourse,
  onBackToHome,
}) {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourseId || 'semua'
  );
  const [selectedCategory, setSelectedCategory] = useState('semua');

  const courseOptions = useMemo(() => {
    const map = new Map();
    grades.forEach((item) => {
      if (!map.has(item.courseId)) {
        map.set(item.courseId, `${item.courseName} (${item.courseCode})`);
      }
    });
    return [
      { value: 'semua', label: 'Semua Mata Kuliah' },
      ...Array.from(map.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [grades]);

  const filteredGrades = useMemo(() => {
    return grades.filter((item) => {
      const matchesCourse =
        selectedCourseId === 'semua' || item.courseId === selectedCourseId;
      const matchesCategory =
        selectedCategory === 'semua' || item.category === selectedCategory;
      return matchesCourse && matchesCategory;
    });
  }, [grades, selectedCourseId, selectedCategory]);

  const summary = useMemo(() => {
    const gradedItems = filteredGrades.filter(
      (item) => item.status === 'Dinilai' && typeof item.score === 'number'
    );
    const pendingCount = filteredGrades.length - gradedItems.length;

    if (gradedItems.length === 0) {
      return {
        gradedCount: 0,
        pendingCount,
        average: null,
        letter: '-',
      };
    }

    const totalScore = gradedItems.reduce((sum, item) => sum + item.score, 0);
    const average = totalScore / gradedItems.length;

    return {
      gradedCount: gradedItems.length,
      pendingCount,
      average,
      letter: getLetterGrade(average),
    };
  }, [filteredGrades]);

  const activeCourseLabel = useMemo(() => {
    if (selectedCourseId === 'semua') return 'Seluruh Mata Kuliah Aktif';
    const found = courseOptions.find((opt) => opt.value === selectedCourseId);
    return found ? found.label : 'Pemrograman Web (IF201)';
  }, [selectedCourseId, courseOptions]);

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 600);
  }

  function handleResetFilters() {
    setSelectedCourseId('semua');
    setSelectedCategory('semua');
    setViewState('normal');
  }

  const effectiveStatus =
    viewState === 'normal' && filteredGrades.length === 0 ? 'empty' : viewState;

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-grades">
        <PageHeader
          title="Nilai & Umpan Balik"
          backLabel={
            fromCourse ? 'Kembali ke Halaman Kelas' : 'Kembali ke Beranda'
          }
          onBack={fromCourse ? onBackToCourse : onBackToHome}
        />

        {/* State Data: Loading */}
        {effectiveStatus === 'loading' && (
          <div
            className="page-grades__skeleton-wrap"
            aria-busy="true"
            aria-label="Memuat rekap nilai dan umpan balik"
          >
            <Skeleton variant="rect" width="100%" height="128px" />
            <div className="page-grades__grid">
              <GradeSkeletonCard />
              <GradeSkeletonCard />
            </div>
          </div>
        )}

        {/* State Data: Galat */}
        {effectiveStatus === 'error' && (
          <ErrorState
            title="Rekap Nilai Gagal Dimuat"
            description="Periksa koneksi internet Anda lalu coba muat ulang halaman nilai ini."
            actionLabel="Coba Lagi"
            onRetry={handleRetry}
          />
        )}

        {/* State Data: Kosong */}
        {effectiveStatus === 'empty' && (
          <EmptyState
            title="Belum Ada Nilai yang Tersedia"
            description="Nilai tugas, kuis, maupun ujian akan tampil di sini setelah dosen menyelesaikan penilaian."
            actionLabel={
              viewState !== 'empty' &&
              (selectedCourseId !== 'semua' || selectedCategory !== 'semua')
                ? 'Tampilkan Semua Nilai'
                : 'Kembali ke Beranda'
            }
            onAction={
              viewState !== 'empty' &&
              (selectedCourseId !== 'semua' || selectedCategory !== 'semua')
                ? handleResetFilters
                : onBackToHome
            }
          />
        )}

        {/* State Data: Normal */}
        {effectiveStatus === 'normal' && (
          <>
            {/* Kartu Ringkasan Indeks & Rata-Rata Nilai (Sesuai E12 - Nilai & Umpan Balik.pdf) */}
            <section
              className="page-grades__summary-card"
              aria-labelledby="grades-summary-heading"
            >
              <div className="page-grades__summary-main">
                <div className="page-grades__summary-badges">
                  <Badge tone="utama" icon={<AwardIcon />}>
                    {summary.gradedCount} Penilaian Dinilai
                  </Badge>
                  <Badge tone="netral">Semester Ganjil</Badge>
                  {summary.pendingCount > 0 && (
                    <Badge tone="peringatan">
                      {summary.pendingCount} Menunggu Penilaian
                    </Badge>
                  )}
                </div>

                <h2
                  id="grades-summary-heading"
                  className="page-grades__summary-course"
                >
                  {activeCourseLabel}
                </h2>

                <p className="page-grades__summary-score">
                  Rata-rata Nilai:{' '}
                  <strong>
                    {summary.average !== null
                      ? `${formatDecimalId(summary.average)} / 100 (${summary.letter})`
                      : 'Belum tersedia'}
                  </strong>
                </p>
              </div>

              <div className="page-grades__summary-actions">
                {fromCourse && (
                  <Button
                    variant="sekunder"
                    size="sm"
                    onClick={onBackToCourse}
                  >
                    Kembali ke Kelas
                  </Button>
                )}
                <Button variant="sekunder" size="sm" onClick={onBackToHome}>
                  Ke Beranda
                </Button>
              </div>
            </section>

            {/* Filter Mata Kuliah & Jenis Penilaian */}
            <section
              className="page-grades__filters"
              aria-label="Filter rekap nilai"
            >
              <div className="page-grades__filter-group">
                <label
                  htmlFor="grades-course-select"
                  className="page-grades__filter-label"
                >
                  Mata Kuliah
                </label>
                <select
                  id="grades-course-select"
                  className="page-grades__select"
                  value={selectedCourseId}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                >
                  {courseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="page-grades__filter-chips">
                <FilterChipGroup
                  label="Filter jenis penilaian"
                  options={CATEGORY_OPTIONS}
                  selectedValue={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </section>

            {/* Rincian Nilai & Umpan Balik per Aktivitas */}
            <section
              className="page-grades__list-section"
              aria-labelledby="grades-detail-heading"
            >
              <h2
                id="grades-detail-heading"
                className="page-grades__section-title"
              >
                Rincian Nilai &amp; Umpan Balik ({filteredGrades.length})
              </h2>

              <div className="page-grades__grid">
                {filteredGrades.map((item) => {
                  const isGraded =
                    item.status === 'Dinilai' &&
                    typeof item.score === 'number';

                  return (
                    <article key={item.id} className="page-grades__card">
                      <div className="page-grades__card-top">
                        <div className="page-grades__card-badges">
                          <Badge tone={isGraded ? 'berhasil' : 'peringatan'}>
                            {isGraded
                              ? `Nilai: ${item.score}/${item.maxScore}`
                              : item.status}
                          </Badge>
                          <Badge tone="info">{item.category}</Badge>
                        </div>

                        <span className="page-grades__weight">
                          Bobot {item.weight}%
                        </span>
                      </div>

                      <div className="page-grades__card-body">
                        {selectedCourseId === 'semua' && (
                          <p className="page-grades__card-course">
                            {item.courseName} ({item.courseCode})
                          </p>
                        )}
                        <h3 className="page-grades__card-title">
                          {item.title}
                        </h3>
                        <p className="page-grades__card-meta">
                          {item.gradedAt} · {item.graderName}
                        </p>
                      </div>

                      {item.feedback ? (
                        <div className="page-grades__feedback-box">
                          <div className="page-grades__feedback-head">
                            <MessageSquareIcon />
                            <span>Umpan Balik Dosen</span>
                          </div>
                          <p className="page-grades__feedback-text">
                            {item.feedback}
                          </p>
                        </div>
                      ) : (
                        <p className="page-grades__pending-note">
                          Berkas Anda sedang dalam antrean pemeriksaan dosen
                          pengampu.
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Panel Simulasi 4 State E12 */}
        <aside
          className="page-grades__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E12 Nilai & Umpan Balik"
        >
          <span className="page-grades__demo-label">Simulasi State E12:</span>
          <div className="page-grades__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-grades__demo-btn ${
                  viewState === item.key ? 'page-grades__demo-btn--active' : ''
                }`}
                aria-pressed={viewState === item.key}
                onClick={() => setViewState(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </AppLayoutTemplate>
  );
}