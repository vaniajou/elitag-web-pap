import './AuthTemplate.css';

/* Emblem placeholder SVG; ganti dengan <img src={logoUntag} alt="..." /> bila aset logo sudah ada di src/assets/ */
function DefaultCampusEmblem() {
  return (
    <svg
      className="tpl-auth__emblem-svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="Logo Universitas 17 Agustus 1945 Surabaya"
    >
      <polygon
        points="60,6 112,44 92,108 28,108 8,44"
        fill="#F2A900"
        stroke="#14101E"
        strokeWidth="4"
      />
      <circle cx="60" cy="58" r="24" fill="#B40000" />
      <text
        x="60"
        y="64"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="16"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        UNTAG
      </text>
    </svg>
  );
}

export function AuthTemplate({
  logoSrc = '',
  brandSubtitle = 'E-LEARNING',
  brandTitle = 'UNTAG SURABAYA',
  children,
}) {
  return (
    <div className="tpl-auth">
      <header className="tpl-auth__brand">
        <div className="tpl-auth__brand-inner">
          <div className="tpl-auth__logo-wrap">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Logo Universitas 17 Agustus 1945 Surabaya"
                className="tpl-auth__logo-img"
              />
            ) : (
              <DefaultCampusEmblem />
            )}
          </div>
          <p className="tpl-auth__brand-subtitle">{brandSubtitle}</p>
          <p className="tpl-auth__brand-title">{brandTitle}</p>
        </div>
      </header>

      <main className="tpl-auth__main">
        <div className="tpl-auth__card">{children}</div>
      </main>
    </div>
  );
}