import { Skeleton } from '../../atoms';
import { CourseCard, EmptyState, ErrorState } from '../../molecules';
import './CourseList.css';

function CourseSkeletonCard() {
  return (
    <div className="org-course-list__skeleton-card" aria-hidden="true">
      <Skeleton variant="text" width="32%" height="20px" />
      <Skeleton variant="text" width="75%" height="22px" />
      <Skeleton variant="text" width="52%" height="16px" />
    </div>
  );
}

export function CourseList({
  status = 'normal', // 'normal' | 'loading' | 'empty' | 'error'
  courses = [],
  onSelectCourse,
  onExploreCourses,
  onRetry,
}) {
  const showCount = status === 'normal' && courses.length > 0;

  return (
    <section
      className="org-course-list"
      aria-labelledby="course-list-heading"
    >
      <h2 id="course-list-heading" className="org-course-list__heading">
        Mata Kuliah Saya{showCount ? ` (${courses.length})` : ''}
      </h2>

      {status === 'loading' && (
        <div
          className="org-course-list__grid"
          aria-busy="true"
          aria-label="Memuat daftar mata kuliah"
        >
          <CourseSkeletonCard />
          <CourseSkeletonCard />
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          title="Daftar Kelas Gagal Dimuat"
          description="Periksa koneksi internet Anda lalu coba beberapa saat lagi."
          actionLabel="Coba Lagi"
          onRetry={onRetry}
        />
      )}

      {(status === 'empty' || (status === 'normal' && courses.length === 0)) && (
        <EmptyState
          title="Belum bergabung ke kelas mana pun"
          description="Cari dan gabung ke mata kuliah sesuai KRS Anda untuk mulai mengakses materi dan tugas."
          actionLabel="Cari Mata Kuliah"
          onAction={onExploreCourses}
        />
      )}

      {status === 'normal' && courses.length > 0 && (
        <div className="org-course-list__grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
            />
          ))}
        </div>
      )}
    </section>
  );
}