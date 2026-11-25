import { useState } from 'react';
import { Badge, Button } from '../components/atoms';
import { InfoList, PageHeader } from '../components/molecules';
import { AppLayoutTemplate } from '../components/templates';
import { MOCK_COURSE_CATALOG } from '../data/mockElitagData';
import './CoursePreviewPage.css';

function CalendarIcon() {
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
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MapPinIcon() {
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
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UsersIcon() {
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
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function CoursePreviewPage({
  course,
  isEnrolled = false,
  logoSrc = '',
  onNavigate,
  onBack,
  onJoinCourse,
  onOpenCourse,
}) {
  const [isJoining, setIsJoining] = useState(false);

  const activeCourse = course || MOCK_COURSE_CATALOG[0];
  const remainingSeats = activeCourse.remainingSeats ?? 5;
  const totalSeats = activeCourse.totalSeats ?? 30;
  const isQuotaLow = remainingSeats <= 5;

  const lectureInfoItems = [
    {
      label: 'Jadwal',
      value: activeCourse.schedule || 'Senin, 08.00 – 10.30 WIB',
      icon: <CalendarIcon />,
    },
    {
      label: 'Ruangan',
      value: activeCourse.room || 'Lab Komputer 3',
      icon: <MapPinIcon />,
    },
    {
      label: 'Sisa Kuota',
      value: `${remainingSeats} dari ${totalSeats} Kursi`,
      icon: <UsersIcon />,
      emphasis: isQuotaLow ? 'warning' : undefined,
    },
  ];

  function handleJoinClick() {
    setIsJoining(true);
    window.setTimeout(() => {
      setIsJoining(false);
      onJoinCourse?.(activeCourse);
    }, 600);
  }

  return (
    <AppLayoutTemplate
      activeNav="cari"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-preview">
        <PageHeader
          title="Detail Mata Kuliah"
          backLabel="Kembali ke Cari Mata Kuliah"
          onBack={onBack}
        />

        <div className="page-preview__layout">
          {/* Kolom Utama: Identitas, Deskripsi, Prasyarat, dan Ringkasan Modul */}
          <div className="page-preview__primary">
            <section
              className="page-preview__card page-preview__hero"
              aria-labelledby="preview-course-title"
            >
              <div className="page-preview__badges">
                <Badge tone="utama">
                  {activeCourse.credits} SKS · {activeCourse.category}
                </Badge>
                {isEnrolled && <Badge tone="berhasil">Sudah Bergabung</Badge>}
              </div>

              <h2 id="preview-course-title" className="page-preview__title">
                {activeCourse.title}
              </h2>

              <p className="page-preview__code">
                Kode: {activeCourse.code} · {activeCourse.classGroup || 'Kelas A'}
              </p>

              <p className="page-preview__lecturer">{activeCourse.lecturer}</p>
            </section>

            <section
              className="page-preview__card"
              aria-labelledby="preview-info-heading"
            >
              <h3 id="preview-info-heading" className="page-preview__section-title">
                Informasi Perkuliahan
              </h3>
              <InfoList items={lectureInfoItems} />
            </section>

            <section
              className="page-preview__card"
              aria-labelledby="preview-desc-heading"
            >
              <h3 id="preview-desc-heading" className="page-preview__section-title">
                Deskripsi Mata Kuliah
              </h3>
              <p className="page-preview__description">
                {activeCourse.description}
              </p>
            </section>

            {activeCourse.prerequisites?.length > 0 && (
              <section
                className="page-preview__card"
                aria-labelledby="preview-prereq-heading"
              >
                <h3
                  id="preview-prereq-heading"
                  className="page-preview__section-title"
                >
                  Prasyarat Mata Kuliah
                </h3>
                <ul className="page-preview__list">
                  {activeCourse.prerequisites.map((item) => (
                    <li key={item} className="page-preview__list-item">
                      <span
                        className="page-preview__list-icon"
                        aria-hidden="true"
                      >
                        <CheckCircleIcon />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {activeCourse.modules?.length > 0 && (
              <section
                className="page-preview__card"
                aria-labelledby="preview-modules-heading"
              >
                <h3
                  id="preview-modules-heading"
                  className="page-preview__section-title"
                >
                  Ringkasan Modul &amp; Pertemuan
                </h3>
                <ol className="page-preview__modules">
                  {activeCourse.modules.map((mod) => (
                    <li key={mod} className="page-preview__module-item">
                      {mod}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* Panel Aksi Utama (1 tombol primer per layar) */}
          <aside className="page-preview__action-panel" aria-label="Aksi kelas">
            <div className="page-preview__action-card">
              <div className="page-preview__action-meta">
                <p className="page-preview__action-label">
                  {isEnrolled ? 'Status Pendaftaran' : 'Pendaftaran Kelas'}
                </p>
                <p className="page-preview__action-value">
                  {isEnrolled
                    ? 'Anda sudah terdaftar di kelas ini'
                    : `Sisa ${remainingSeats} dari ${totalSeats} kursi`}
                </p>
              </div>

              {isEnrolled ? (
                <Button
                  variant="primer"
                  fullWidth
                  onClick={() => onOpenCourse?.(activeCourse)}
                >
                  Masuk ke Halaman Kelas
                </Button>
              ) : (
                <Button
                  variant="primer"
                  fullWidth
                  isLoading={isJoining}
                  loadingText="Bergabung..."
                  onClick={handleJoinClick}
                >
                  Gabung ke Kelas
                </Button>
              )}

              <Button variant="sekunder" fullWidth onClick={onBack}>
                Kembali ke Pencarian
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </AppLayoutTemplate>
  );
}