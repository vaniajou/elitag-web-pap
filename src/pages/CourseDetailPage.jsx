import { useState } from 'react';
import { Badge, Button } from '../components/atoms';
import { ActivityItem, PageHeader } from '../components/molecules';
import { ConfirmDialog } from '../components/organisms';
import { AppLayoutTemplate } from '../components/templates';
import {
  MOCK_COURSE_CATALOG,
  MOCK_COURSE_CONTENT,
} from '../data/mockElitagData';
import './CourseDetailPage.css';

function VideoIcon() {
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
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function MegaphoneIcon() {
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
      <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M19.5 6.5a9 9 0 0 1 0 11" />
    </svg>
  );
}

function BookIcon() {
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
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function TaskDocIcon() {
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
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function QuizIcon() {
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
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function ForumIcon() {
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
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function getActivityIcon(type) {
  if (type === 'task') return <TaskDocIcon />;
  if (type === 'quiz') return <QuizIcon />;
  if (type === 'forum') return <ForumIcon />;
  return <BookIcon />;
}

export function CourseDetailPage({
  course,
  logoSrc = '',
  onNavigate,
  onBack,
  onOpenMaterial,
  onOpenTasks,
  onOpenQuiz,
  onOpenForum,
  onLeaveCourse,
}) {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [meetingNotice, setMeetingNotice] = useState('');

  const fallbackCourse = MOCK_COURSE_CATALOG[0];
  const matchedCatalog = MOCK_COURSE_CATALOG.find(
    (item) => item.id === course?.id
  );
  const activeCourse = {
    ...fallbackCourse,
    ...matchedCatalog,
    ...course,
  };

  const courseContent =
    MOCK_COURSE_CONTENT[activeCourse.id] || MOCK_COURSE_CONTENT.default;

  function handleActivityClick(activity) {
    if (activity.type === 'task') {
      onOpenTasks?.(activeCourse);
    } else if (activity.type === 'quiz') {
      onOpenQuiz?.({ course: activeCourse, quiz: activity });
    } else if (activity.type === 'forum') {
      onOpenForum?.({ course: activeCourse, forum: activity });
    } else {
      onOpenMaterial?.({ course: activeCourse, material: activity });
    }
  }

  function handleMeetingClick() {
    setMeetingNotice(
      `Membuka ruang rapat daring: ${courseContent.meetingLink.url}`
    );
  }

  function handleConfirmLeave() {
    setIsLeaveDialogOpen(false);
    onLeaveCourse?.(activeCourse);
  }

  return (
    <AppLayoutTemplate
      activeNav="beranda"
      onNavigate={onNavigate}
      logoSrc={logoSrc}
    >
      <div className="page-course">
        <PageHeader
          title={activeCourse.title}
          backLabel="Kembali ke Beranda"
          onBack={onBack}
        />

        {/* Kartu Identitas Kelas + Satu Aksi Primer (Tautan Rapat Daring) */}
        <section
          className="page-course__hero"
          aria-labelledby="course-detail-title"
        >
          <div className="page-course__hero-info">
            <div className="page-course__badges">
              <Badge tone="utama">
                {activeCourse.credits} SKS · {activeCourse.category}
              </Badge>
            </div>

            <h2 id="course-detail-title" className="page-course__title">
              {activeCourse.title}
            </h2>

            <p className="page-course__code">
              Kode: {activeCourse.code} · {activeCourse.classGroup || 'Kelas B'}
            </p>

            <p className="page-course__lecturer">{activeCourse.lecturer}</p>
          </div>

          <div className="page-course__hero-action">
            <Button
              variant="primer"
              fullWidthMobile
              leftIcon={<VideoIcon />}
              onClick={handleMeetingClick}
            >
              {courseContent.meetingLink.label}
            </Button>
            <p className="page-course__meeting-note">
              {courseContent.meetingLink.note}
            </p>
          </div>
        </section>

        {meetingNotice && (
          <p className="page-course__notice" role="status">
            {meetingNotice}
          </p>
        )}

        <div className="page-course__layout">
          {/* Kolom Utama: Aktivitas Pertemuan 1 & Daftar Pertemuan */}
          <div className="page-course__main">
            <section
              className="page-course__section"
              aria-labelledby="featured-activities-heading"
            >
              <h3
                id="featured-activities-heading"
                className="page-course__section-title"
              >
                {courseContent.featuredSectionTitle}
              </h3>

              <div className="page-course__list">
                {courseContent.featuredActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    subtitle={activity.subtitle}
                    badgeLabel={activity.badgeLabel}
                    badgeTone={activity.badgeTone}
                    icon={getActivityIcon(activity.type)}
                    onClick={() => handleActivityClick(activity)}
                  />
                ))}
              </div>
            </section>

            <section
              className="page-course__section"
              aria-labelledby="meetings-list-heading"
            >
              <h3
                id="meetings-list-heading"
                className="page-course__section-title"
              >
                Daftar Pertemuan ({courseContent.meetings.length})
              </h3>

              <div className="page-course__list">
                {courseContent.meetings.map((meeting) => (
                  <ActivityItem
                    key={meeting.id}
                    title={meeting.title}
                    subtitle={meeting.subtitle}
                    badgeLabel={meeting.statusLabel}
                    badgeTone={meeting.statusTone}
                    icon={<BookIcon />}
                    onClick={() =>
                      onOpenMaterial?.({
                        course: activeCourse,
                        material: meeting,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Kolom Pendamping: Pengumuman Kelas & Aksi Keluar dari Kelas */}
          <aside className="page-course__side">
            <section
              className="page-course__announcement"
              aria-labelledby="course-announcement-heading"
            >
              <div className="page-course__announcement-head">
                <span className="page-course__announcement-icon">
                  <MegaphoneIcon />
                </span>
                <h3
                  id="course-announcement-heading"
                  className="page-course__announcement-title"
                >
                  {courseContent.announcement.title}
                </h3>
              </div>
              <p className="page-course__announcement-body">
                {courseContent.announcement.message}
              </p>
              <p className="page-course__announcement-meta">
                {courseContent.announcement.postedAt}
              </p>
            </section>

            <section
              className="page-course__danger-box"
              aria-labelledby="course-manage-heading"
            >
              <h3
                id="course-manage-heading"
                className="page-course__danger-title"
              >
                Keanggotaan Kelas
              </h3>
              <p className="page-course__danger-desc">
                Anda dapat keluar dari kelas ini bila salah memilih kelas pada KRS.
              </p>
              <Button
                variant="tersier"
                className="page-course__leave-btn"
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                Keluar dari Kelas
              </Button>
            </section>
          </aside>
        </div>

        {/* Panel Simulasi State E05 */}
        <aside
          className="page-course__demo-bar"
          aria-label="Simulasi keadaan layar E05 Halaman Kelas"
        >
          <span className="page-course__demo-label">Simulasi State E05:</span>
          <div className="page-course__demo-actions">
            <button
              type="button"
              className={`page-course__demo-btn ${
                !isLeaveDialogOpen ? 'page-course__demo-btn--active' : ''
              }`}
              aria-pressed={!isLeaveDialogOpen}
              onClick={() => setIsLeaveDialogOpen(false)}
            >
              Normal
            </button>
            <button
              type="button"
              className={`page-course__demo-btn ${
                isLeaveDialogOpen ? 'page-course__demo-btn--active' : ''
              }`}
              aria-pressed={isLeaveDialogOpen}
              onClick={() => setIsLeaveDialogOpen(true)}
            >
              Pop-up Keluar Kelas
            </button>
          </div>
        </aside>

        {/* Dialog Konfirmasi Keluar dari Kelas (E05 Pop Up) */}
        <ConfirmDialog
          isOpen={isLeaveDialogOpen}
          title="Keluar dari Kelas ini?"
          description="Anda harus bergabung ulang jika ingin mengakses materi kembali."
          cancelLabel="Batal"
          confirmLabel="Ya, Keluar"
          confirmVariant="destruktif"
          onCancel={() => setIsLeaveDialogOpen(false)}
          onConfirm={handleConfirmLeave}
        />
      </div>
    </AppLayoutTemplate>
  );
}