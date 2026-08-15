import { type JSX } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Gallery } from '../pages/Gallery';
import { Home } from '../pages/Home';
import { ScientistDetail } from '../pages/ScientistDetail';
import { App } from './App';

function page(title: string): JSX.Element {
  return <section aria-labelledby="page-title"><h1 id="page-title">{title}</h1></section>;
}

export const appRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'scientists', element: <Gallery /> },
        { path: 'scientists/:slug', element: <ScientistDetail /> },
        { path: 'timeline', element: page('时间轴') },
        { path: 'spirit', element: page('科学家精神') },
        { path: 'graph', element: page('关系图谱') },
        { path: 'footprints', element: page('实践足迹') },
        { path: 'media', element: page('融媒体') },
        { path: 'about', element: page('关于展馆') },
        { path: '*', element: page('页面未找到') },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
