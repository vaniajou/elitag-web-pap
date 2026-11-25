import './FilterChipGroup.css';

export function FilterChipGroup({
  label = 'Filter kategori',
  options = [],
  selectedValue,
  onChange,
}) {
  return (
    <div className="mol-filter-group" role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === selectedValue;
        return (
          <button
            key={option.value}
            type="button"
            className={`mol-filter-chip ${
              isActive ? 'mol-filter-chip--active' : ''
            }`}
            aria-pressed={isActive}
            onClick={() => onChange?.(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}