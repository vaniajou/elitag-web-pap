import { Button } from '../../atoms';
import './EmptyState.css';

export function EmptyState({
  title,
  description = '',
  actionLabel = '',
  onAction,
}) {
  return (
    <div className="mol-empty-state" role="status">
      <p className="mol-empty-state__title">{title}</p>
      {description && (
        <p className="mol-empty-state__description">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mol-empty-state__action">
          <Button variant="sekunder" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}