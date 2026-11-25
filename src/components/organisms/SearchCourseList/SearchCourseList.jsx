import { Skeleton } from '../../atoms';
import { CourseCard, EmptyState, ErrorState } from '../../molecules';
import './SearchCourseList.css';

function SearchSkeletonCard() {
  return (
    <div className="org-search-list__skeleton-card" aria-hidden="true">
      <Skeleton variant="text" width="68%" height="22px" />
      <Skeleton variant="text" width="48%" height="16px" />
    </div>
  );
}

export function SearchCourseList({
  status = 'normal', // 'normal' | 'loading' | 'empty' | 'error'
  courses = [],
  enrolledIds = [],
  hasActiveFilter = false,
  onSelectCourse,
  onResetSearch,
  onRetry,
}) {
  if (status === 'loading') {
    return (
      <section
        className="org-search-list"
        aria-busy="true"
        aria-label="Memuat hasil pencarian mata kuliah"
      >
        <Skeleton variant="text" width="160px" height="20px" />
        <div className="org-search-list__grid">
          <SearchSkeletonCard />
          <SearchSkeletonCard />
          <SearchSkeletonCard />
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="org-search-list" aria-label="Pencarian gagal">
        <ErrorState
          title="Pencarian Gagal Dimuat"
          description="Periksa koneksi internet Anda lalu coba lagi."
          actionLabel="Coba Lagi"
          onRetry={onRetry}
        />
      </section>
    );
  }

  if (status === 'empty' || courses.length === 0) {
    return (
      <section className="org-search-list" aria-label="Hasil pencarian kosong">
        <EmptyState
          title="Tidak Ada Mata Kuliah yang Cocok"
          description="Periksa kembali ejaan kode atau nama mata kuliah yang Anda cari."
          actionLabel={hasActiveFilter ? 'Reset Pencarian' : ''}
          onAction={hasActiveFilter ? onResetSearch : undefined}
        />
      </section>
    );
  }

  return (
    <section
      className="org-search-list"
      aria-labelledby="search-result-heading"
    >
      <h2 id="search-result-heading" className="org-search-list__heading">
        Hasil Pencarian ({courses.length})
      </h2>

      <div className="org-search-list__grid">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            variant="catalog"
            isEnrolled={enrolledIds.includes(course.id)}
            onSelect={onSelectCourse}
          />
        ))}
      </div>
    </section>
  );
}