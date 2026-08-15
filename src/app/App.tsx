import { type JSX } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { SkipLink } from '../components/layout/SkipLink';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/utilities.css';

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <SkipLink />
      <Header />
      <main id="main-content" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
