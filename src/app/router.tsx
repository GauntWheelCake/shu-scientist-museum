import { createBrowserRouter } from 'react-router-dom';
import { About } from '../pages/About';
import { Footprints } from '../pages/Footprints';
import { Gallery } from '../pages/Gallery';
import { Graph } from '../pages/Graph';
import { Home } from '../pages/Home';
import { Media } from '../pages/Media';
import { NotFound } from '../pages/NotFound';
import { ScientistDetail } from '../pages/ScientistDetail';
import { Spirit } from '../pages/Spirit';
import { Timeline } from '../pages/Timeline';
import { App } from './App';

export const appRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'scientists', element: <Gallery /> },
        { path: 'scientists/:slug', element: <ScientistDetail /> },
        { path: 'timeline', element: <Timeline /> },
        { path: 'spirit', element: <Spirit /> },
        { path: 'graph', element: <Graph /> },
        { path: 'footprints', element: <Footprints /> },
        { path: 'media', element: <Media /> },
        { path: 'about', element: <About /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
