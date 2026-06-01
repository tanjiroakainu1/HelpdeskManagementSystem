import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { QuickRoleAccess } from '@/components/QuickRoleAccess';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { DEMO_PASSWORD, ROLES } from '@/lib/roles';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={`/${ROLES[user.role].folder}/dashboard`} replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      const u = api.getUserByEmail(email);
      if (u) navigate(`/${ROLES[u.role].folder}/dashboard`);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <AuthLayout
      page="login"
      wide
      title="Welcome back"
      subtitle="Jump in with a demo role, or sign in with your email."
    >
      <section className="auth-section">
        <div className="auth-section-head">
          <span className="auth-section-step">1</span>
          <div>
            <h3 className="auth-section-title">Try a demo role</h3>
            <p className="auth-section-desc">One click — no typing. Password for all accounts:</p>
          </div>
          <code className="auth-password-chip">{DEMO_PASSWORD}</code>
        </div>
        <QuickRoleAccess variant="login" />
      </section>

      <div className="auth-divider">
        <span>or use your email</span>
      </div>

      <section className="auth-section auth-manual-panel">
        <div className="auth-section-head">
          <span className="auth-section-step">2</span>
          <div>
            <h3 className="auth-section-title">Sign in manually</h3>
            <p className="auth-section-desc">Use any registered helpdesk email.</p>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@helpdesk.local"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn-primary auth-submit-btn w-full">
            Sign in
          </button>
        </form>
      </section>
    </AuthLayout>
  );
}
