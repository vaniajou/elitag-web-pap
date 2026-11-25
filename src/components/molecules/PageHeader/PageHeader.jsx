import './PageHeader.css';

function ArrowLeftIcon() {
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
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function PageHeader({ title, backLabel = 'Kembali', onBack }) {
  return (
    <header className="mol-page-header">
      {onBack && (
        <button
          type="button"
          className="mol-page-header__back"
          aria-label={backLabel}
          onClick={onBack}
        >
          <ArrowLeftIcon />
        </button>
      )}
      <h1 className="mol-page-header__title">{title}</h1>
    </header>
  );
}