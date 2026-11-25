import './InfoList.css';

export function InfoList({ items = [] }) {
  return (
    <dl className="mol-info-list">
      {items.map((item) => (
        <div key={item.label} className="mol-info-list__row">
          <dt className="mol-info-list__term">
            {item.icon && (
              <span className="mol-info-list__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </dt>
          <dd
            className={`mol-info-list__value ${
              item.emphasis ? `mol-info-list__value--${item.emphasis}` : ''
            }`}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}