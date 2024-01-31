import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
    // NOTE: here the error could be logged for a desired platform (Datadog, NewRelic, Bugsnag, ...)
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <h1 className="d-flex justify-content-center my-5">An error has occurred</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;