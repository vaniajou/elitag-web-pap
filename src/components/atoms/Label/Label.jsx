import './Label.css';

export function Label({
  htmlFor,
  children,
  required = false,
  className = '',
  ...rest
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`atom-label ${className}`.trim()}
      {...rest}
    >
      <span>{children}</span>
      {required && (
        <span className="atom-label__required" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}