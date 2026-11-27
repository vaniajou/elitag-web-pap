import { useEffect, useMemo, useState } from 'react';
import logoUntag from './assets/logo-untag.png';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { SearchCoursePage } from './pages/SearchCoursePage';
import { CoursePreviewPage } from './pages/CoursePreviewPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { MaterialPage } from './pages/MaterialPage';
import { QuizPage } from './pages/QuizPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskSubmitPage } from './pages/TaskSubmitPage';
import { ProfilePage } from './pages/ProfilePage';
import { DiscussionPage } from './pages/DiscussionPage';
import { GradesPage } from './pages/GradesPage';
import {
  MOCK_COURSE_CATALOG,
  MOCK_DISCUSSIONS,
  MOCK_ENROLLED_COURSES,
  MOCK_GRADES,
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
  FORUM: '#/kelas/diskusi',
  FORUM_ALT: '#/diskusi',
  FORUM_LEGACY: '#/forum',
  GRADES: '#/nilai',
  COURSE_GRADES: '#/kelas/nilai',
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
  const [studentProfile, setStudentProfile] = useState(MOCK_STUDENT);
  const [enrolledCourses, setEnrolledCourses] = useState(MOCK_ENROLLED_COURSES);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [discussionsByCourse, setDiscussionsByCourse] =
    useState(MOCK_DISCUSSIONS);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
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

  const liveAcademicStats = useMemo(() => {
    const completedTasksCount = tasks.filter(
      (item) =>
        item.type === 'task' &&
        (item.status === 'Sudah Dikumpulkan' || item.status === 'Dinilai')
    ).length;

    const quizScores = Object.values(quizResults).map((entry) => entry.score);
    const averageQuizScore =
      quizScores.length > 0
        ? Math.round(
            quizScores.reduce((sum, score) => sum + score, 0) /
              quizScores.length
          )
        : (studentProfile?.academicStats?.averageQuizScore ?? 88);

    return {
      enrolledCourses: enrolledCourses.length,
      completedTasks: completedTasksCount,
      averageQuizScore,
      attendanceRate: studentProfile.academicStats.attendanceRate,
    };
  }, [enrolledCourses, tasks, quizResults, studentProfile]);

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
      name: studentProfile.name,
    });
    navigate(ROUTES.HOME);
  }

  function handleUpdateProfile(updatedProfile) {
    setStudentProfile(updatedProfile);
    setSessionUser((prev) =>
      prev
        ? {
            ...prev,
            name: updatedProfile.name,
            identifier: updatedProfile.email,
          }
        : prev
    );
  }

  function handleLogout() {
    setSessionUser(null);
    setSelectedCourse(null);
    setSelectedActivity(null);
    setSelectedTaskId(null);
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

  function handleOpenGradesFromCourse(course) {
    setSelectedCourse(course);
    navigate(ROUTES.COURSE_GRADES);
  }

  function handleThreadsChange(courseId, updatedThreads) {
    setDiscussionsByCourse((prev) => ({
      ...prev,
      [courseId]: updatedThreads,
    }));
  }

  function handleOpenTaskSubmit(task) {
    setSelectedTaskId(task?.id || null);
    const targetRoute = task?.id
      ? `${ROUTES.TASKS}/${task.id}`
      : ROUTES.TASK_SUBMIT;
    navigate(targetRoute);
  }

  function handleSubmitTask(taskId, newSubmissionEntry) {
    setTasks((prev) =>
      prev.map((item) => {
        if (item.id !== taskId) return item;
        const previousHistory = (item.submissionHistory || []).map((entry) => ({
          ...entry,
          version: entry.version.replace(' (Aktif)', ''),
        }));
        return {
          ...item,
          status: 'Sudah Dikumpulkan',
          tabGroup: 'selesai',
          remainingTimeText: `Dikumpulkan ${newSubmissionEntry.submittedAt}`,
          submittedFile: newSubmissionEntry.fileName,
          submissionHistory: [newSubmissionEntry, ...previousHistory],
        };
      })
    );
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
        studentName={studentProfile.name}
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
        onOpenGrades={handleOpenGradesFromCourse}
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

  /* Halaman E09 Pengerjaan Kuis */
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

  /* Halaman E11 Forum Diskusi (#/kelas/diskusi, #/diskusi, atau #/forum) */
  const isForumRoute =
    location.path === ROUTES.FORUM ||
    location.path === ROUTES.FORUM_ALT ||
    location.path === ROUTES.FORUM_LEGACY;

  if (isForumRoute) {
    const activeCourse =
      selectedCourse || enrolledCourses[0] || MOCK_COURSE_CATALOG[0];
    const courseThreads =
      discussionsByCourse[activeCourse.id] || discussionsByCourse.default;

    return (
      <DiscussionPage
        key={activeCourse.id}
        course={activeCourse}
        studentName={studentProfile.name}
        initialThreads={courseThreads}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBack={() => navigate(ROUTES.COURSE_DETAIL)}
        onThreadsChange={handleThreadsChange}
      />
    );
  }

  /* Halaman E12 Nilai & Umpan Balik (#/nilai atau #/kelas/nilai) */
  const isGradesRoute =
    location.path === ROUTES.GRADES || location.path === ROUTES.COURSE_GRADES;

  if (isGradesRoute) {
    const fromCourse = location.path === ROUTES.COURSE_GRADES;
    const initialCourseId = fromCourse
      ? selectedCourse?.id || 'mk-pw-01'
      : 'semua';

    return (
      <GradesPage
        key={initialCourseId}
        grades={MOCK_GRADES}
        initialCourseId={initialCourseId}
        fromCourse={fromCourse}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBackToCourse={() => navigate(ROUTES.COURSE_DETAIL)}
        onBackToHome={() => navigate(ROUTES.HOME)}
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

  /* Halaman E08 Detail & Pengumpulan Tugas (#/tugas/kumpul atau #/tugas/:id) */
  const isTaskSubmitRoute =
    location.path === ROUTES.TASK_SUBMIT ||
    location.path.startsWith(`${ROUTES.TASKS}/`);

  if (isTaskSubmitRoute) {
    const slug = location.path.replace(`${ROUTES.TASKS}/`, '');
    const resolvedTaskId =
      slug && slug !== 'kumpul' ? slug : selectedTaskId || tasks[0]?.id;
    const resolvedTask =
      tasks.find((item) => item.id === resolvedTaskId) || tasks[0];

    return (
      <TaskSubmitPage
        key={resolvedTask.id}
        task={resolvedTask}
        logoSrc={logoUntag}
        onNavigate={navigate}
        onBack={() => navigate(ROUTES.TASKS)}
        onSubmitTask={handleSubmitTask}
      />
    );
  }

  /* Halaman E10 Profil Mahasiswa & Edit Profil */
  return (
    <ProfilePage
      studentProfile={studentProfile}
      academicStats={liveAcademicStats}
      logoSrc={logoUntag}
      onNavigate={navigate}
      onUpdateProfile={handleUpdateProfile}
      onLogout={handleLogout}
    />
  );
}