import './Badge.css';

export function Badge({
  children,
  tone = 'utama', // 'utama' | 'berhasil' | 'peringatan' | 'gagal' | 'info' | 'netral'
  icon = null,
  className = '',
}) {
  return (
    <span className={`atom-badge atom-badge--${tone} ${className}`.trim()}>
      {icon && (
        <span className="atom-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}