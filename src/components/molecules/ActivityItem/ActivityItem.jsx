import { Badge } from '../../atoms';
import './ActivityItem.css';

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

export function ActivityItem({
  title,
  subtitle = '',
  badgeLabel = '',
  badgeTone = 'netral',
  icon = null,
  onClick,
}) {
  return (
    <button
      type="button"
      className="mol-activity-item"
      onClick={onClick}
    >
      {icon && (
        <span className="mol-activity-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <div className="mol-activity-item__body">
        <div className="mol-activity-item__top">
          <span className="mol-activity-item__title">{title}</span>
          {badgeLabel && <Badge tone={badgeTone}>{badgeLabel}</Badge>}
        </div>
        {subtitle && (
          <span className="mol-activity-item__subtitle">{subtitle}</span>
        )}
      </div>

      <span className="mol-activity-item__chevron" aria-hidden="true">
        <ChevronRightIcon />
      </span>
    </button>
  );
}