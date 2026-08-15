import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from './app/router';
import { restorePagesRoute } from './app/pagesFallback';

restorePagesRoute({
  baseUrl: import.meta.env.BASE_URL,
  storage: window.sessionStorage,
  replace: (url) => window.history.replaceState(null, '', url),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>,
);
