import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-red-600">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-extrabold text-red-600 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-400 mb-6">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>

              { this.state.error && (
                <details className="text-left mb-6 bg-gray-800 p-4 rounded-lg">
                  <summary className="text-red-500 cursor-pointer mb-2 font-semibold">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-gray-300 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition"
              >
                Go to Home Page
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full mt-3 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
