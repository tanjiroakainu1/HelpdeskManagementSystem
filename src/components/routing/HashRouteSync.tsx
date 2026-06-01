import { useEffect } from 'react';

/**
 * Vite dev URLs like /super-admin/dashboard (no hash) do not reach HashRouter.
 * Sync pathname → #/pathname so bookmarks and mistaken URLs still work.
 */
export function HashRouteSync() {
  useEffect(() => {
    const { pathname, hash, search } = window.location;
    const hasHashRoute = hash.length > 1 && hash.startsWith('#/');

    if (!hasHashRoute && pathname && pathname !== '/' && !pathname.endsWith('.html')) {
      const route = `${pathname}${search}`;
      window.location.replace(`${window.location.origin}/#${route}`);
    }
  }, []);

  return null;
}
