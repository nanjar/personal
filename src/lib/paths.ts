const rawBase = import.meta.env.BASE_URL || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/** Prefix an internal URL with the deployment base path. */
export function url(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}${path.replace(/^\//, '')}`;
}

/** Public-folder asset helper. */
export function asset(path: string): string {
  return url(path.replace(/^\/?assets\//, 'assets/'));
}

/** Relative pathname without the deployment base, for active nav states. */
export function currentPath(pathname: string): string {
  const withoutBase = base === '/' ? pathname : pathname.replace(base.replace(/\/$/, ''), '') || '/';
  return withoutBase.startsWith('/') ? withoutBase : `/${withoutBase}`;
}
