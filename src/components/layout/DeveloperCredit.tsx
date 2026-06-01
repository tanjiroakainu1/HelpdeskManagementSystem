import { DEVELOPER } from '@/lib/developer';

type Variant = 'hero' | 'auth' | 'sidebar' | 'footer' | 'drawer';

export function DeveloperCredit({ variant = 'footer' }: { variant?: Variant }) {
  if (variant === 'hero') {
    return (
      <div className="dev-credit dev-credit--hero" aria-label={`Developed by ${DEVELOPER.name}`}>
        <div className="dev-credit-glow" aria-hidden />
        <div className="dev-credit-inner">
          <span className="dev-avatar dev-avatar--lg" aria-hidden>
            {DEVELOPER.initials}
          </span>
          <div className="min-w-0">
            <p className="dev-eyebrow">Crafted by</p>
            <p className="dev-name dev-name--shine">{DEVELOPER.name}</p>
            <p className="dev-role">{DEVELOPER.role}</p>
          </div>
        </div>
        <p className="dev-tagline">{DEVELOPER.tagline}</p>
      </div>
    );
  }

  if (variant === 'auth') {
    return (
      <div className="dev-credit dev-credit--auth" aria-label={`Developed by ${DEVELOPER.name}`}>
        <span className="dev-sparkle dev-sparkle--1" aria-hidden>✦</span>
        <span className="dev-sparkle dev-sparkle--2" aria-hidden>✦</span>
        <div className="dev-credit-inner dev-credit-inner--center">
          <span className="dev-avatar" aria-hidden>{DEVELOPER.initials}</span>
          <div>
            <p className="dev-eyebrow">Developed by</p>
            <p className="dev-name dev-name--shine">{DEVELOPER.name}</p>
            <p className="dev-role">{DEVELOPER.role}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="dev-credit dev-credit--sidebar" aria-label={`Developed by ${DEVELOPER.name}`}>
        <span className="dev-avatar dev-avatar--sm" aria-hidden>{DEVELOPER.initials}</span>
        <div className="min-w-0 flex-1">
          <p className="dev-eyebrow dev-eyebrow--tight">Developer</p>
          <p className="dev-name dev-name--compact truncate">{DEVELOPER.name}</p>
        </div>
      </div>
    );
  }

  if (variant === 'drawer') {
    return (
      <div className="dev-credit dev-credit--drawer" aria-label={`Developed by ${DEVELOPER.name}`}>
        <span className="dev-avatar dev-avatar--sm" aria-hidden>{DEVELOPER.initials}</span>
        <div className="min-w-0">
          <p className="dev-eyebrow dev-eyebrow--tight">Developed by</p>
          <p className="dev-name dev-name--compact">{DEVELOPER.name}</p>
          <p className="dev-role dev-role--xs">{DEVELOPER.role}</p>
        </div>
      </div>
    );
  }

  return (
    <footer className="dev-credit dev-credit--footer" aria-label={`Developed by ${DEVELOPER.name}`}>
      <div className="dev-credit-footer-inner">
        <span className="dev-avatar" aria-hidden>{DEVELOPER.initials}</span>
        <div className="dev-credit-footer-text">
          <span className="dev-eyebrow">Developed with ✦ by</span>
          <span className="dev-name dev-name--shine">{DEVELOPER.name}</span>
          <span className="dev-role-dot" aria-hidden>·</span>
          <span className="dev-role">{DEVELOPER.role}</span>
        </div>
        <span className="dev-footer-badge hidden sm:inline" aria-hidden>
          HD v2
        </span>
      </div>
    </footer>
  );
}
