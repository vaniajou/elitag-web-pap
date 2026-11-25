import { NavigationShell } from '../../organisms';
import './AppLayoutTemplate.css';

export function AppLayoutTemplate({
  activeNav,
  onNavigate,
  logoSrc = '',
  children,
}) {
  return (
    <div className="tpl-app">
      <NavigationShell
        activeNav={activeNav}
        onNavigate={onNavigate}
        logoSrc={logoSrc}
      />

      <main className="tpl-app__main">
        <div className="tpl-app__content">{children}</div>
      </main>
    </div>
  );
}