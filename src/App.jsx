import { useEffect, useState } from 'react';
import logoUntag from './assets/logo-untag.png';
import { Button } from './components/atoms';
import { AppLayoutTemplate } from './components/templates';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { SearchCoursePage } from './pages/SearchCoursePage';
import { CoursePreviewPage } from './pages/CoursePreviewPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import {
  MOCK_COURSE_CATALOG,
  MOCK_ENROLLED_COURSES,
  MOCK_STUDENT,
} from './data/mockElitagData';

const ROUTES = {
  LOGIN: '#/masuk',
  HOME: '#/beranda',
  SEARCH: '#/cari',
  COURSE_PREVIEW: '#/pratinjau-kelas',
  COURSE_DETAIL: '#/kelas',
  MATERIAL: '#/materi',
  QUIZ: '#/kuis',
  FORUM: '#/forum',
  TASKS: '#/tugas',
  TASK_SUBMIT: '#/kirim-tugas',
  PROFILE: '#/profil',
};

function parseHash() {
  const rawHash = window.location.hash || ROUTES.LOGIN;
  const [path, queryString = ''] = rawHash.split('?');
  const params = new URLSearchParams(queryString);
  return {
    path,
    query: params.get('q') || '',
  };
}

export default function App() {
  const [location, setLocation] = useState(parseHash);
  const [sessionUser, setSessionUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(MOCK_ENROLLED_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = ROUTES.LOGIN;
    }

    function handleHashChange() {
      setLocation(parseHash());
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigate(nextRoute) {
    window.location.hash = nextRoute;
    const [path, queryString = ''] = nextRoute.split('?');
    const params = new URLSearchParams(queryString);
    setLocation({
      path,
      query: params.get('q') || '',
    });
  }

  function handleLoginSuccess(user) {
    setSessionUser({
      ...user,
      name: MOCK_STUDENT.name,
    });
    navigate(ROUTES.HOME);
  }

  function handleLogout() {
    setSessionUser(null);
    setSelectedCourse(null);
    setSelectedActivity(null);
    setSelectedTask(null);
    navigate(ROUTES.LOGIN);
  }

  function handleOpenCourse(course) {
    setSelectedCourse(course);
    navigate(ROUTES.COURSE_DETAIL);
  }

  function handleOpenCoursePreview(course) {
    setSelectedCourse(course);
    navigate(ROUTES.COURSE_PREVIEW);
  }

  function handleJoinCourse(course) {
    if (!course) return;
    setEnrolledCourses((prev) =>
      prev.some((item) => item.id === course.id)
        ? prev
        : [...prev, { ...course, progress: 0 }]
    );
    setSelectedCourse(course);
    navigate(ROUTES.COURSE_DETAIL);
  }

  function handleLeaveCourse(course) {
    if (!course) return;
    setEnrolledCourses((prev) => prev.filter((item) => item.id !== course.id));
    setSelectedCourse(null);
    navigate(ROUTES.HOME);
  }

  function handleOpenMaterial(payload) {
    setSelectedCourse(payload.course);
    setSelectedActivity(payload.material);
    navigate(ROUTES.MATERIAL);
  }

  function handleOpenQuiz(payload) {
    setSelectedCourse(payload.course);
    setSelectedActivity(payload.quiz);
    navigate(ROUTES.QUIZ);
  }

  function handleOpenForum(payload) {
    setSelectedCourse(payload.course);
    setSelectedActivity(payload.forum);
    navigate(ROUTES.FORUM);
  }

  function handleOpenTaskSubmit(task) {
    setSelectedTask(task);
    navigate(ROUTES.TASK_SUBMIT);
  }

  /* Halaman E01 Masuk */
  if (!sessionUser || location.path === ROUTES.LOGIN) {
    return (
      <LoginPage logoSrc={logoUntag} onLoginSuccess={handleLoginSuccess} />
    );
  }

  /* Halaman E02 Beranda */
  if (location.path === ROUTES.HOME) {
    return (
      <HomePage
        studentName={sessionUser.name}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onOpenCourse={handleOpenCourse}
        onOpenTaskSubmit={handleOpenTaskSubmit}
      />
    );
  }

  /* Halaman E03 Cari Mata Kuliah */
  if (location.path === ROUTES.SEARCH) {
    return (
      <SearchCoursePage
        initialQuery={location.query}
        enrolledCourseIds={enrolledCourses.map((course) => course.id)}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onSelectCourse={handleOpenCoursePreview}
      />
    );
  }

  /* Halaman E04 Pratinjau dan Gabung Kelas */
  if (location.path === ROUTES.COURSE_PREVIEW) {
    const previewCourse = selectedCourse || MOCK_COURSE_CATALOG[0];
    const isAlreadyEnrolled = enrolledCourses.some(
      (item) => item.id === previewCourse.id
    );

    return (
      <CoursePreviewPage
        course={previewCourse}
        isEnrolled={isAlreadyEnrolled}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBack={() => navigate(ROUTES.SEARCH)}
        onJoinCourse={handleJoinCourse}
        onOpenCourse={handleOpenCourse}
      />
    );
  }

  /* Halaman E05 Halaman Kelas */
  if (location.path === ROUTES.COURSE_DETAIL) {
    const activeCourse =
      selectedCourse || enrolledCourses[0] || MOCK_COURSE_CATALOG[0];

    return (
      <CourseDetailPage
        course={activeCourse}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBack={() => navigate(ROUTES.HOME)}
        onOpenMaterial={handleOpenMaterial}
        onOpenQuiz={handleOpenQuiz}
        onOpenForum={handleOpenForum}
        onLeaveCourse={handleLeaveCourse}
      />
    );
  }

  /* Placeholder sementara untuk E06, E07, E08, E09, E10, dan E11 */
  const placeholderMap = {
    [ROUTES.MATERIAL]: {
      nav: 'beranda',
      backRoute: ROUTES.COURSE_DETAIL,
      backLabel: 'Kembali ke Halaman Kelas',
      title: `E06 — ${selectedActivity?.title || 'Materi Pertemuan'}`,
      desc: selectedCourse
        ? `${selectedCourse.title} · ${selectedActivity?.subtitle || 'Bacaan, berkas, video, dan tombol Tandai Selesai.'}`
        : 'Halaman materi pertemuan akan dibangun pada tahap berikutnya.',
    },
    [ROUTES.QUIZ]: {
      nav: 'beranda',
      backRoute: ROUTES.COURSE_DETAIL,
      backLabel: 'Kembali ke Halaman Kelas',
      title: `E09 — ${selectedActivity?.title || 'Pengerjaan Kuis'}`,
      desc: selectedCourse
        ? `${selectedCourse.title} · ${selectedActivity?.subtitle || 'Waktu mundur, navigasi soal, dan simpan otomatis.'}`
        : 'Halaman pengerjaan kuis akan dibangun pada tahap berikutnya.',
    },
    [ROUTES.FORUM]: {
      nav: 'beranda',
      backRoute: ROUTES.COURSE_DETAIL,
      backLabel: 'Kembali ke Halaman Kelas',
      title: `E11 — ${selectedActivity?.title || 'Forum Diskusi Kelas'}`,
      desc: selectedCourse
        ? `Ruang diskusi untuk mata kuliah ${selectedCourse.title}.`
        : 'Forum diskusi kelas (halaman opsional).',
    },
    [ROUTES.TASKS]: {
      nav: 'tugas',
      backRoute: ROUTES.HOME,
      backLabel: 'Kembali ke Beranda',
      title: 'E07 — Daftar Tugas & Tenggat',
      desc: 'Daftar seluruh tugas dan kuis menurut tenggat akan dibangun pada tahap berikutnya.',
    },
    [ROUTES.TASK_SUBMIT]: {
      nav: 'tugas',
      backRoute: ROUTES.HOME,
      backLabel: 'Kembali ke Beranda',
      title: `E08 — ${selectedTask?.title || 'Detail & Pengumpulan Tugas'}`,
      desc: selectedTask
        ? `${selectedTask.courseName} · ${selectedTask.dueDateText}`
        : 'Formulir unggah berkas tugas akan dibangun pada tahap berikutnya.',
    },
    [ROUTES.PROFILE]: {
      nav: 'profil',
      backRoute: ROUTES.HOME,
      backLabel: 'Kembali ke Beranda',
      title: 'E10 — Profil Mahasiswa',
      desc: `Masuk sebagai ${sessionUser.name} (${sessionUser.identifier}).`,
    },
  };

  const activePlaceholder =
    placeholderMap[location.path] || placeholderMap[ROUTES.TASKS];

  return (
    <AppLayoutTemplate
      activeNav={activePlaceholder.nav}
      onNavigate={navigate}
      logoSrc={logoUntag}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-16)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'var(--font-size-page-title)' }}>
          {activePlaceholder.title}
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          {activePlaceholder.desc}
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-12)',
          }}
        >
          <Button
            variant="sekunder"
            onClick={() => navigate(activePlaceholder.backRoute)}
          >
            {activePlaceholder.backLabel}
          </Button>
          {location.path === ROUTES.PROFILE && (
            <Button variant="destruktif" onClick={handleLogout}>
              Keluar dari Akun
            </Button>
          )}
        </div>
      </section>
    </AppLayoutTemplate>
  );
}