import { Link } from 'react-router-dom';

export function AuthPageFooter({ page }: { page: 'login' | 'register' }) {
  return (
    <div className="auth-page-footer">
      {page === 'login' ? (
        <>
          <p className="text-sm text-muted">New to the helpdesk?</p>
          <Link to="/register" className="auth-page-footer-link">
            Create a free employee account →
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-muted">Already registered?</p>
          <Link to="/login" className="auth-page-footer-link">
            Sign in to your workspace →
          </Link>
        </>
      )}
      <Link to="/" className="auth-page-footer-home mt-3 inline-block text-xs text-muted hover:text-candy-mint">
        ← Back to home overview
      </Link>
    </div>
  );
}
