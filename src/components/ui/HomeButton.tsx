import { Link } from 'react-router-dom';

type Props = {
  className?: string;
  onClick?: () => void;
};

/** Compact Home control for headers only. */
export function HomeButton({ className = '', onClick }: Props) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`btn-home ${className}`.trim()}
      aria-label="Go to home page"
    >
      <span className="btn-home__icon" aria-hidden>
        🏠
      </span>
      <span className="btn-home__label">Home</span>
    </Link>
  );
}
