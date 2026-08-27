export const pagesRouteStorageKey = 'museum:pages-route';

type StoredRoute = {
  pathname: string;
  search?: string;
  hash?: string;
};

export type RouteStorage = Pick<Storage, 'getItem' | 'removeItem'>;

type RestorePagesRouteOptions = {
  baseUrl: string;
  storage?: RouteStorage;
  replace: (url: string) => void;
};

const isSafeRoute = (route: StoredRoute) =>
  route.pathname.startsWith('/') &&
  !route.pathname.startsWith('//') &&
  !route.pathname.includes('\\') &&
  (!route.search || route.search.startsWith('?')) &&
  (!route.hash || route.hash.startsWith('#'));

export function getPagesRouteStorage(
  source: Pick<Window, 'sessionStorage'>,
): RouteStorage | undefined {
  try {
    return source.sessionStorage;
  } catch {
    return undefined;
  }
}

export function restorePagesRoute({ baseUrl, storage, replace }: RestorePagesRouteOptions) {
  if (!storage) return;

  let savedRoute: string | null;
  try {
    savedRoute = storage.getItem(pagesRouteStorageKey);
  } catch {
    return;
  }
  if (!savedRoute) return;

  try {
    storage.removeItem(pagesRouteStorageKey);
  } catch {
    // Cleanup denial must not prevent restoration of an otherwise valid route.
  }

  try {
    const route = JSON.parse(savedRoute) as StoredRoute;
    if (!route || typeof route.pathname !== 'string' || !isSafeRoute(route)) return;

    const baseSegment = baseUrl.replace(/^\/+|\/+$/g, '');
    const normalizedBase = baseSegment ? `/${baseSegment}` : '';
    const pathname = route.pathname === '/' ? '' : route.pathname;
    replace(`${normalizedBase}${pathname}${route.search ?? ''}${route.hash ?? ''}` || '/');
  } catch {
    // A stale or user-edited value must not prevent application startup.
  }
}
