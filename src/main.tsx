import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { bootstrapApp } from './app/bootstrap';

bootstrapApp({
  source: window,
  baseUrl: import.meta.env.BASE_URL,
  render: (router) =>
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    ),
});
