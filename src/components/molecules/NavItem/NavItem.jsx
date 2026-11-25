import './NavItem.css';

export function NavItem({
  label,
  desktopLabel,
  icon,
  activeIcon,
  isActive = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`mol-nav-item ${isActive ? 'mol-nav-item--active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="mol-nav-item__icon" aria-hidden="true">
        {isActive && activeIcon ? activeIcon : icon}
      </span>
      <span className="mol-nav-item__label-mobile">{label}</span>
      <span className="mol-nav-item__label-desktop">
        {desktopLabel || label}
      </span>
    </button>
  );
}