import './Skeleton.css';

export function Skeleton({
  variant = 'rect', // 'text' | 'rect' | 'circle'
  width = '100%',
  height,
  className = '',
}) {
  const style = {
    width,
    ...(height ? { height } : {}),
  };

  return (
    <span
      className={`atom-skeleton atom-skeleton--${variant} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}