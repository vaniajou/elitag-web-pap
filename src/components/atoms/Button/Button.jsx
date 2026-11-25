import { Spinner } from '../Spinner/Spinner';
import './Button.css';

export function Button({
  children,
  variant = 'primer', // 'primer' | 'sekunder' | 'tersier' | 'destruktif'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  fullWidthMobile = false,
  fullWidth = false,
  isLoading = false,
  loadingText,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  const classes = [
    'atom-btn',
    `atom-btn--${variant}`,
    `atom-btn--${size}`,
    fullWidthMobile ? 'atom-btn--full-mobile' : '',
    fullWidth ? 'atom-btn--full' : '',
    isLoading ? 'atom-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" label={loadingText || 'Sedang memproses'} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="atom-btn__icon" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <span className="atom-btn__label">{children}</span>
          {rightIcon && (
            <span className="atom-btn__icon" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}