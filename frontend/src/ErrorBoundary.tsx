import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error in app:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <p className="error-boundary__text">
            Etwas ist schiefgelaufen.{"\n"}
            Bitte lade die Seite neu.
          </p>
          <button className="btn btn--accent" onClick={() => window.location.reload()}>
            Neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
