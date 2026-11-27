import { useEffect, useState } from 'react';
import logoUntag from './assets/logo-untag.png';
import { Button } from './components/atoms';
import { AppLayoutTemplate } from './components/templates';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { SearchCoursePage } from './pages/SearchCoursePage';
import { CoursePreviewPage } from './pages/CoursePreviewPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { MaterialPage } from './pages/MaterialPage';
import { QuizPage } from './pages/QuizPage';
import { TaskListPage } from './pages/TaskListPage';
import {
  MOCK_COURSE_CATALOG,
  MOCK_ENROLLED_COURSES,
  MOCK_STUDENT,
  MOCK_TASKS,
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
  TASK_SUBMIT: '#/tugas/kumpul',
  PROFILE: '#/profil',
};

function parseHash() {
  const rawHash = window.location.hash || ROUTES.LOGIN;
  const [path, queryString = ''] = rawHash.split('?');
  const params = new URLSearchParams(queryString);
  return {
    path,
    query: params.get('q') || '',
    courseFilter: params.get('mk') || '',
  };
}

export default function App() {
  const [location, setLocation] = useState(parseHash);
  const [sessionUser, setSessionUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(MOCK_ENROLLED_COURSES);
  const [tasks] = useState(MOCK_TASKS);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedMaterialIds, setCompletedMaterialIds] = useState([
    'meet-pw-01',
  ]);
  const [quizResults, setQuizResults] = useState({});

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
      courseFilter: params.get('mk') || '',
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

  function handleToggleMaterialComplete(materialId) {
    setCompletedMaterialIds((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  }

  function handleOpenTasksFromCourse(course) {
    const query = course?.title
      ? `?mk=${encodeURIComponent(course.title)}`
      : '';
    navigate(`${ROUTES.TASKS}${query}`);
  }

  function handleOpenQuiz(payload) {
    setSelectedCourse(payload.course);
    setSelectedActivity(payload.quiz);
    navigate(ROUTES.QUIZ);
  }

  function handleOpenQuizFromTasks(taskItem) {
    const matchedCourse =
      MOCK_COURSE_CATALOG.find((item) => item.id === taskItem.courseId) ||
      MOCK_COURSE_CATALOG[0];
    setSelectedCourse(matchedCourse);
    setSelectedActivity({
      id: taskItem.id,
      title: taskItem.title,
    });
    navigate(ROUTES.QUIZ);
  }

  function handleSubmitQuiz(resultSummary) {
    setQuizResults((prev) => ({
      ...prev,
      [resultSummary.quizId]: resultSummary,
    }));
  }

  function handleOpenForum(payload) {
    setSelectedCourse(payload.course);
    setSelectedActivity(payload.forum);
    navigate(ROUTES.FORUM);
  }

  function handleOpenTaskSubmit(task) {
    setSelectedTask(task);
    const targetRoute = task?.id
      ? `${ROUTES.TASKS}/${task.id}`
      : ROUTES.TASK_SUBMIT;
    navigate(targetRoute);
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
        onOpenTasks={handleOpenTasksFromCourse}
        onOpenQuiz={handleOpenQuiz}
        onOpenForum={handleOpenForum}
        onLeaveCourse={handleLeaveCourse}
      />
    );
  }

  /* Halaman E06 Materi Pertemuan */
  if (location.path === ROUTES.MATERIAL) {
    const activeCourse =
      selectedCourse || enrolledCourses[0] || MOCK_COURSE_CATALOG[0];
    const materialId = selectedActivity?.id || 'act-pw-m1';

    return (
      <MaterialPage
        course={activeCourse}
        material={selectedActivity}
        isCompleted={completedMaterialIds.includes(materialId)}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBack={() => navigate(ROUTES.COURSE_DETAIL)}
        onToggleComplete={handleToggleMaterialComplete}
      />
    );
  }

  /* Halaman Pengerjaan Kuis (E09) */
  if (location.path === ROUTES.QUIZ) {
    const activeCourse =
      selectedCourse || enrolledCourses[0] || MOCK_COURSE_CATALOG[0];
    const quizId = selectedActivity?.id || 'act-pw-q1';

    return (
      <QuizPage
        key={quizId}
        course={activeCourse}
        quiz={selectedActivity}
        savedResult={quizResults[quizId] || null}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBack={() => navigate(ROUTES.COURSE_DETAIL)}
        onSubmitQuiz={handleSubmitQuiz}
      />
    );
  }

  /* Halaman E07 Daftar Tugas & Tenggat */
  if (location.path === ROUTES.TASKS) {
    return (
      <TaskListPage
        tasks={tasks}
        initialCourseFilter={location.courseFilter}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onOpenTask={handleOpenTaskSubmit}
        onOpenQuiz={handleOpenQuizFromTasks}
      />
    );
  }

  /* Deteksi rute detail/pengumpulan tugas: #/tugas/kumpul atau #/tugas/:id */
  const isTaskSubmitRoute =
    location.path === ROUTES.TASK_SUBMIT ||
    location.path.startsWith(`${ROUTES.TASKS}/`);

  const taskIdFromUrl = isTaskSubmitRoute
    ? location.path.replace(`${ROUTES.TASKS}/`, '')
    : '';
  const resolvedTask =
    selectedTask ||
    tasks.find((item) => item.id === taskIdFromUrl) ||
    tasks[0];

  /* Placeholder sementara untuk E08, E10, dan E11 */
  const placeholderMap = {
    [ROUTES.FORUM]: {
      nav: 'beranda',
      backRoute: ROUTES.COURSE_DETAIL,
      backLabel: 'Kembali ke Halaman Kelas',
      title: `E11 — ${selectedActivity?.title || 'Forum Diskusi Kelas'}`,
      desc: selectedCourse
        ? `Ruang diskusi untuk mata kuliah ${selectedCourse.title}.`
        : 'Forum diskusi kelas (halaman opsional).',
    },
    [ROUTES.PROFILE]: {
      nav: 'profil',
      backRoute: ROUTES.HOME,
      backLabel: 'Kembali ke Beranda',
      title: 'E10 — Profil Mahasiswa',
      desc: `Masuk sebagai ${sessionUser.name} (${sessionUser.identifier}).`,
    },
  };

  const activePlaceholder = isTaskSubmitRoute
    ? {
        nav: 'tugas',
        backRoute: ROUTES.TASKS,
        backLabel: 'Kembali ke Daftar Tugas',
        title: `E08 — ${resolvedTask?.title || 'Detail & Pengumpulan Tugas'}`,
        desc: resolvedTask
          ? `${resolvedTask.courseName} · ${resolvedTask.dueDateText} · Status: ${resolvedTask.status}`
          : 'Formulir unggah berkas tugas akan dibangun pada tahap berikutnya.',
      }
    : placeholderMap[location.path] || placeholderMap[ROUTES.PROFILE];

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