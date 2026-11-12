import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import './Login.css';

export default function Login() {
  const { status, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'admin') return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const problem = await signIn(email.trim(), password);
    setBusy(false);
    if (problem) setError(problem);
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <p className="login-brand">
          <em>Yasmeen</em> Dashboard
        </p>
        <h1 className="login-title">Sign in</h1>

        {status === 'preview' ? (
          <>
            <p className="admin-notice" role="status">
              <strong>Supabase not connected.</strong> Add <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code> to enable sign-in. Until then you can
              browse the dashboard with the local seed data — nothing can be saved.
            </p>
            <Link className="btn btn-primary" to="/admin">
              Open dashboard preview
            </Link>
          </>
        ) : status === 'notAdmin' ? (
          <>
            <p className="field-error" role="alert">
              This account is signed in but isn’t an admin of this site.
            </p>
            <button type="button" className="btn" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                className="field-input"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="field-input"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn-primary" type="submit" disabled={busy || status === 'loading'}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </>
        )}

        <a className="login-back" href="/">
          ← Back to the site
        </a>
      </form>
    </div>
  );
}
