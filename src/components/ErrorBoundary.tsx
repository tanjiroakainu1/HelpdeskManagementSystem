import { Component, ErrorInfo, ReactNode } from 'react';
import { HomeButton } from '@/components/ui/HomeButton';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Helpdesk app error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas bg-mesh p-6">
          <div className="card w-full max-w-lg">
            <div className="card-body">
              <div className="empty-state py-8">
                <span className="empty-state-icon">⚠️</span>
                <h1 className="page-header-title text-xl">Something went wrong</h1>
                <p className="empty-state-desc mt-3">{this.state.error.message}</p>
                <p className="mt-6 text-center text-[11px] text-muted">
                  Helpdesk by <span className="font-medium text-candy-light">Raminder Jangao</span>
                </p>
                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <HomeButton />
                  <button
                    type="button"
                    className="btn-ghost min-h-[3.25rem] w-full px-8 sm:w-auto"
                    onClick={() => {
                      localStorage.removeItem('helpdesk_db_v2');
                      window.location.href = '/#/login';
                      window.location.reload();
                    }}
                  >
                    Reset data & reload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
