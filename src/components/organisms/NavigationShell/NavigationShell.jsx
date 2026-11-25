import { NavItem } from '../../molecules';
import './NavigationShell.css';

function HomeIcon({ filled = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5.5v-6.5h-5V21H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

function SearchNavIcon({ filled = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={filled ? '2.4' : '1.8'}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7.5" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TaskIcon({ filled = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line
        x1="9"
        y1="12"
        x2="15"
        y2="12"
        stroke={filled ? '#FFFFFF' : 'currentColor'}
      />
      <line
        x1="9"
        y1="16"
        x2="13"
        y2="16"
        stroke={filled ? '#FFFFFF' : 'currentColor'}
      />
    </svg>
  );
}

function ProfileIcon({ filled = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    id: 'beranda',
    route: '#/beranda',
    label: 'Beranda',
    desktopLabel: 'Beranda',
    icon: <HomeIcon />,
    activeIcon: <HomeIcon filled />,
  },
  {
    id: 'cari',
    route: '#/cari',
    label: 'Cari',
    desktopLabel: 'Cari Mata Kuliah',
    icon: <SearchNavIcon />,
    activeIcon: <SearchNavIcon filled />,
  },
  {
    id: 'tugas',
    route: '#/tugas',
    label: 'Tugas',
    desktopLabel: 'Daftar Tugas',
    icon: <TaskIcon />,
    activeIcon: <TaskIcon filled />,
  },
  {
    id: 'profil',
    route: '#/profil',
    label: 'Profil',
    desktopLabel: 'Profil Saya',
    icon: <ProfileIcon />,
    activeIcon: <ProfileIcon filled />,
  },
];

export function NavigationShell({ activeNav, onNavigate, logoSrc = '' }) {
  return (
    <aside className="org-nav" aria-label="Navigasi utama ELITAG">
      {/* Header merek hanya tampil di Sidebar Desktop (>= 840px) */}
      <div className="org-nav__brand">
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Logo Untag Surabaya"
            className="org-nav__logo"
          />
        )}
        <div className="org-nav__brand-text">
          <span className="org-nav__title">ELITAG</span>
          <span className="org-nav__subtitle">Untag Surabaya</span>
        </div>
      </div>

      <nav className="org-nav__list">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            desktopLabel={item.desktopLabel}
            icon={item.icon}
            activeIcon={item.activeIcon}
            isActive={activeNav === item.id}
            onClick={() => onNavigate?.(item.route)}
          />
        ))}
      </nav>
    </aside>
  );
}