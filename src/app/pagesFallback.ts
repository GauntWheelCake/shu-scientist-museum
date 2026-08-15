export const pagesRouteStorageKey = 'museum:pages-route';

type StoredRoute = {
  pathname: string;
  search?: string;
  hash?: string;
};

type RouteStorage = Pick<Storage, 'getItem' | 'removeItem'>;

type RestorePagesRouteOptions = {
  baseUrl: string;
  storage: RouteStorage;
  replace: (url: string) => void;
};

const isSafeRoute = (route: StoredRoute) =>
  route.pathname.startsWith('/') &&
  !route.pathname.startsWith('//') &&
  !route.pathname.includes('\\') &&
  (!route.search || route.search.startsWith('?')) &&
  (!route.hash || route.hash.startsWith('#'));

export function restorePagesRoute({ baseUrl, storage, replace }: RestorePagesRouteOptions) {
  const savedRoute = storage.getItem(pagesRouteStorageKey);
  if (!savedRoute) return;

  storage.removeItem(pagesRouteStorageKey);

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
