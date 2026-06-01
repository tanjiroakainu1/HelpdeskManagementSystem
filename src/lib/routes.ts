/** Build in-app path for HashRouter (use with Link / navigate — do not prefix with origin). */
export function rolePath(
  folder: string,
  slug?: string,
  query?: Record<string, string | number | undefined>,
): string {
  const path = slug ? `/${folder}/${slug}` : `/${folder}`;
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

/** Full URL for sharing (hash route). */
export function roleUrl(folder: string, slug?: string, query?: Record<string, string | number | undefined>): string {
  const path = rolePath(folder, slug, query);
  if (typeof window === 'undefined') return `#${path}`;
  return `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}#${path}`;
}
