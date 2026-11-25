import { useMemo, useState } from 'react';
import { Badge, Button, Skeleton } from '../components/atoms';
import { SearchBar } from '../components/molecules';
import { CourseList } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import {
  MOCK_ENROLLED_COURSES,
  MOCK_STUDENT,
  MOCK_URGENT_DEADLINE,
} from '../data/mockElitagData';
import './HomePage.css';

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
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

export function HomePage({
  studentName = MOCK_STUDENT.name,
  logoSrc = '',
  onNavigate,
  onOpenCourse,
  onOpenTaskSubmit,
}) {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return MOCK_ENROLLED_COURSES;
    return MOCK_ENROLLED_COURSES.filter(
      (course) =>
        course.title.toLowerCase().includes(keyword) ||
        course.lecturer.toLowerCase().includes(keyword) ||
        course.code.toLowerCase().includes(keyword)
    );
  }, [searchQuery]);

  function handleRetry() {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('normal');
    }, 700);
  }

  function handleSearchSubmit(query) {
    if (query.trim()) {
      onNavigate?.(`#/cari?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-home">
        {/* Baris Header: Sapaan + SearchBar (bertumpuk di mobile, sejajar di desktop) */}
        <header className="page-home__header">
          <div className="page-home__greeting">
            <p className="page-home__welcome">Selamat Datang,</p>
            <h1 className="page-home__student-name">{studentName}</h1>
          </div>

          <div className="page-home__search-wrap">
            <SearchBar
              id="home-search"
              value={searchQuery}
              placeholder="Cari mata kuliah atau tugas..."
              onChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
            />
          </div>
        </header>

        {/* Seksi Deadline Mata Kuliah (disembunyikan saat state Kosong sesuai Figma) */}
        {viewState !== 'empty' && (
          <section
            className="page-home__section"
            aria-labelledby="deadline-heading"
          >
            <h2 id="deadline-heading" className="page-home__section-title">
              Deadline Mata Kuliah
            </h2>

            {viewState === 'loading' ? (
              <div
                className="page-home__deadline-skeleton"
                aria-busy="true"
                aria-label="Memuat tenggat terdekat"
              >
                <Skeleton variant="text" width="96px" height="24px" />
                <Skeleton variant="text" width="70%" height="24px" />
                <Skeleton variant="text" width="50%" height="18px" />
                <Skeleton variant="rect" width="100%" height="48px" />
              </div>
            ) : (
              <article className="page-home__deadline-card">
                <div className="page-home__deadline-info">
                  <div className="page-home__deadline-badge">
                    <Badge tone="utama" icon={<ClockIcon />}>
                      {MOCK_URGENT_DEADLINE.badgeLabel}
                    </Badge>
                  </div>

                  <h3 className="page-home__deadline-title">
                    {MOCK_URGENT_DEADLINE.title}
                  </h3>

                  <p className="page-home__deadline-course">
                    {MOCK_URGENT_DEADLINE.courseName}
                  </p>

                  <p className="page-home__deadline-due">
                    {MOCK_URGENT_DEADLINE.dueDateText}
                  </p>
                </div>

                <div className="page-home__deadline-action">
                  <Button
                    variant="primer"
                    fullWidthMobile
                    onClick={() => onOpenTaskSubmit?.(MOCK_URGENT_DEADLINE)}
                  >
                    Kumpulkan Tugas
                  </Button>
                </div>
              </article>
            )}
          </section>
        )}

        {/* Seksi Daftar Mata Kuliah (4 State: Normal, Loading, Kosong, Galat) */}
        <CourseList
          status={viewState}
          courses={filteredCourses}
          onSelectCourse={(course) => onOpenCourse?.(course)}
          onExploreCourses={() => onNavigate?.('#/cari')}
          onRetry={handleRetry}
        />

        {/* Panel Simulasi 4 State E02 untuk pengujian & presentasi EAS */}
        <aside
          className="page-home__demo-bar"
          aria-label="Simulasi 4 keadaan data halaman E02 Beranda"
        >
          <span className="page-home__demo-label">Simulasi State E02:</span>
          <div className="page-home__demo-actions">
            {[
              { key: 'normal', label: 'Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty', label: 'Kosong' },
              { key: 'error', label: 'Galat' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`page-home__demo-btn ${
                  viewState === item.key ? 'page-home__demo-btn--active' : ''
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