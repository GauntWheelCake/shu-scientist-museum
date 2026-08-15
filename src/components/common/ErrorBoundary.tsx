import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Museum render error', error, info);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main id="main-content" className="error-boundary" tabIndex={-1}>
          <div>
            <p className="page-intro__eyebrow">SYSTEM NOTICE</p>
            <h1>展馆暂时无法加载</h1>
            <p>请刷新页面后重试，已加载的档案内容不会受到影响。</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
