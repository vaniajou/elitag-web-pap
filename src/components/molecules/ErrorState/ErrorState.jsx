import { Button } from '../../atoms';
import './ErrorState.css';

function AlertTriangleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function ErrorState({
  title = 'Daftar Kelas Gagal Dimuat',
  description = 'Periksa koneksi internet Anda lalu coba beberapa saat lagi.',
  actionLabel = 'Coba Lagi',
  onRetry,
}) {
  return (
    <div className="mol-error-state" role="alert">
      <div className="mol-error-state__header">
        <span className="mol-error-state__icon" aria-hidden="true">
          <AlertTriangleIcon />
        </span>
        <h3 className="mol-error-state__title">{title}</h3>
      </div>

      <p className="mol-error-state__description">{description}</p>

      {onRetry && (
        <div className="mol-error-state__action">
          <Button variant="sekunder" onClick={onRetry}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}