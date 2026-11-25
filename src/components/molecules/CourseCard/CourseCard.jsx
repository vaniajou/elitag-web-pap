import { Badge } from '../../atoms';
import './CourseCard.css';

function ChevronRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function CourseCard({
  course,
  variant = 'enrolled', // 'enrolled' (E02) | 'catalog' (E03)
  isEnrolled = false,
  onSelect,
}) {
  const isCatalog = variant === 'catalog';

  return (
    <button
      type="button"
      className="mol-course-card"
      onClick={() => onSelect?.(course)}
    >
      <div className="mol-course-card__body">
        {!isCatalog && (
          <div className="mol-course-card__meta">
            <Badge tone="netral">
              {course.credits} SKS · {course.category}
            </Badge>
          </div>
        )}

        {isCatalog && isEnrolled && (
          <div className="mol-course-card__meta">
            <Badge tone="berhasil">Sudah Bergabung</Badge>
          </div>
        )}

        <h3 className="mol-course-card__title">{course.title}</h3>

        <p className="mol-course-card__lecturer">
          {isCatalog ? `${course.code} · ${course.lecturer}` : course.lecturer}
        </p>
      </div>

      <span className="mol-course-card__chevron" aria-hidden="true">
        <ChevronRightIcon />
      </span>
    </button>
  );
}