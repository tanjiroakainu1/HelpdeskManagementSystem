import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { QuickRoleAccess } from '@/components/QuickRoleAccess';
import { useAuth } from '@/context/AuthContext';
import { DEMO_PASSWORD, ROLES } from '@/lib/roles';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={`/${ROLES[user.role].folder}/dashboard`} replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (register({ fullName, email, password, departmentId: 1 })) {
      navigate(`/${ROLES.employee.folder}/dashboard`);
    } else {
      setError('That email is already registered. Try signing in instead.');
    }
  };

  return (
    <AuthLayout
      page="register"
      wide
      title="Create your account"
      subtitle="Explore with a demo role, or register as an employee requester."
    >
      <section className="auth-section">
        <div className="auth-section-head">
          <span className="auth-section-step">1</span>
          <div>
            <h3 className="auth-section-title">Try a demo role first</h3>
            <p className="auth-section-desc">Instant access — demo password:</p>
          </div>
          <code className="auth-password-chip">{DEMO_PASSWORD}</code>
        </div>
        <QuickRoleAccess variant="register" />
      </section>

      <div className="auth-divider">
        <span>employee registration</span>
      </div>

      <section className="auth-section auth-manual-panel">
        <div className="auth-section-head">
          <span className="auth-section-step">2</span>
          <div>
            <h3 className="auth-section-title">Register as employee</h3>
            <p className="auth-section-desc">Your account is registered and available across all demo roles.</p>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="form-label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="reg-email">
              Work email
            </label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.local"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <button type="submit" className="btn-primary auth-submit-btn w-full">
            Create employee account
          </button>
        </form>
      </section>
    </AuthLayout>
  );
}
