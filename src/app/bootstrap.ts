import { createAppRouter } from './router';
import { getPagesRouteStorage, restorePagesRoute } from './pagesFallback';

type BootstrapWindow = Pick<Window, 'sessionStorage' | 'history'>;

export function bootstrapApp({
  source,
  baseUrl,
  render,
}: {
  source: BootstrapWindow;
  baseUrl: string;
  render: (router: ReturnType<typeof createAppRouter>) => void;
}) {
  const storage = getPagesRouteStorage(source);
  restorePagesRoute({
    baseUrl,
    storage,
    replace: (url) => source.history.replaceState(null, '', url),
  });
  const router = createAppRouter(baseUrl);
  render(router);
  return router;
}
