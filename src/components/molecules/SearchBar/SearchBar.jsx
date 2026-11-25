import { Input } from '../../atoms';
import './SearchBar.css';

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function SearchBar({
  id = 'search-elitag',
  value,
  placeholder = 'Cari mata kuliah atau tugas...',
  ariaLabel = 'Cari mata kuliah atau tugas',
  onChange,
  onSubmit,
  onClear,
  className = '',
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form
      role="search"
      className={`mol-search ${className}`.trim()}
      onSubmit={handleSubmit}
    >
      <span className="mol-search__icon" aria-hidden="true">
        <SearchIcon />
      </span>

      <Input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`mol-search__input ${value ? 'mol-search__input--has-clear' : ''}`}
        onChange={(event) => onChange?.(event.target.value)}
      />

      {value && (
        <button
          type="button"
          className="mol-search__clear"
          aria-label="Hapus kata pencarian"
          onClick={() => {
            onChange?.('');
            onClear?.();
          }}
        >
          <ClearIcon />
        </button>
      )}
    </form>
  );
}