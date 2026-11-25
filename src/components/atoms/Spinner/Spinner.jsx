import './Spinner.css';

export function Spinner({ size = 'md', label = 'Memuat...' }) {
  return (
    <span
      className={`atom-spinner atom-spinner--${size}`}
      role="status"
      aria-label={label}
    />
  );
}