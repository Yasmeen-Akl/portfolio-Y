import { useCallback, useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { isConnected, messagesApi } from '../../data/api.js';
import { cx } from '../../lib/cx.js';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle.jsx';
import './AdminLayout.css';

const LINKS = [
  ['profile', 'Profile & Hero'],
  ['stats', 'Stats'],
  ['about', 'About'],
  ['education', 'Education'],
  ['journey', 'Journey'],
  ['skills', 'Skills'],
  ['services', 'Services'],
  ['projects', 'Projects'],
  ['contact', 'Contact & Links'],
  ['messages', 'Messages'],
];

// Protected shell: sidebar on desktop, scrollable tabs on mobile.
export default function AdminLayout() {
  const { status, user, signOut } = useAuth();
  const [unread, setUnread] = useState(0);
  const allowed = status === 'admin' || status === 'preview';

  const refreshUnread = useCallback(
    () => messagesApi.unreadCount().then(({ data }) => setUnread(data || 0)),
    [],
  );

  useEffect(() => {
    if (!allowed) return undefined;
    let active = true;
    messagesApi.unreadCount().then(({ data }) => {
      if (active) setUnread(data || 0);
    });
    return () => {
      active = false;
    };
  }, [allowed]);

  if (status === 'loading') return <p className="admin-loading">Loading…</p>;
  if (!allowed) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-top">
          <p className="admin-brand">
            <em>Yasmeen</em> Dashboard
          </p>
          <ThemeToggle />
        </div>
        <div className="admin-menu" role="navigation" aria-label="Dashboard sections">
          {LINKS.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              className={({ isActive }) => cx('admin-link', isActive && 'is-active')}
            >
              {label}
              {path === 'messages' && unread > 0 && (
                <span className="admin-badge" aria-label={`${unread} unread`}>
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </div>
        <div className="admin-side-foot">
          {user?.email && <span className="admin-user">{user.email}</span>}
          <a className="admin-link" href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          {status === 'admin' && (
            <button type="button" className="admin-link" onClick={signOut}>
              Sign out
            </button>
          )}
        </div>
      </aside>

      <main className="admin-main">
        {!isConnected && (
          <p className="admin-notice" role="status">
            <strong>Supabase not connected.</strong> You’re looking at the local seed data. You can try every
            editor, but changes can’t be saved until <code>.env</code> is filled in (see{' '}
            <code>supabase/README.md</code>).
          </p>
        )}
        <Outlet context={{ refreshUnread }} />
      </main>
    </div>
  );
}
