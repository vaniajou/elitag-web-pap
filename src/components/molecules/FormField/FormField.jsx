import { Label, Input } from '../../atoms';
import './FormField.css';

function WarningIcon() {
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
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  inputMode,
  leftIcon = null,
  rightAction = null,
  helperText = '',
  errorMessage = '',
  onChange,
  onBlur,
}) {
  const hasError = Boolean(errorMessage);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const describedBy = hasError
    ? errorId
    : helperText
      ? helperId
      : undefined;

  const inputClasses = [
    leftIcon ? 'mol-field__input--has-left' : '',
    rightAction ? 'mol-field__input--has-right' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mol-field">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      <div className="mol-field__control">
        {leftIcon && (
          <span
            className={`mol-field__left-icon ${hasError ? 'mol-field__left-icon--error' : ''}`}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          hasError={hasError}
          describedBy={describedBy}
          className={inputClasses}
          onChange={onChange}
          onBlur={onBlur}
        />

        {rightAction && (
          <div className="mol-field__right-action">{rightAction}</div>
        )}
      </div>

      {hasError ? (
        <p id={errorId} className="mol-field__error" role="alert">
          <span className="mol-field__error-icon">
            <WarningIcon />
          </span>
          <span>{errorMessage}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="mol-field__helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}