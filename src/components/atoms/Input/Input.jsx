import { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(function Input(
  {
    id,
    name,
    type = 'text',
    value,
    defaultValue,
    placeholder,
    hasError = false,
    disabled = false,
    describedBy,
    className = '',
    onChange,
    onBlur,
    ...rest
  },
  ref
) {
  const classes = [
    'atom-input',
    hasError ? 'atom-input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      ref={ref}
      id={id}
      name={name}
      type={type}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={hasError ? 'true' : undefined}
      aria-describedby={describedBy || undefined}
      className={classes}
      onChange={onChange}
      onBlur={onBlur}
      {...rest}
    />
  );
});