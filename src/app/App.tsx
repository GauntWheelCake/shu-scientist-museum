import { Component, type JSX, type ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main id="main-content" tabIndex={-1}>
          <h1>展馆暂时无法加载</h1>
          <p>请刷新页面后重试。</p>
        </main>
      );
    }

    return this.props.children;
  }
}

function SkipLink(): JSX.Element {
  return <a href="#main-content">跳至主要内容</a>;
}

function Header(): JSX.Element {
  return (
    <header>
      <Link to="/">上海大学科学家精神数字展馆</Link>
    </header>
  );
}

function Footer(): JSX.Element {
  return <footer>上海大学科学家精神数字展馆</footer>;
}

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
