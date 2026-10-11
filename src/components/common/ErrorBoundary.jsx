import { Component } from 'react';

// Error Boundary لازم يكون Class، فهو الاستثناء الوحيد من استخدام Functions في المشروع
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    // ستايل عادي بدون MUI، لأن المشكلة قد تكون في الثيم نفسه
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: 24,
          background: '#121214',
          color: '#fff',
          fontFamily: 'sans-serif',
          direction: 'ltr',
        }}
      >
        <h2 style={{ color: '#ef4444' }}>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#9e9eaf' }}>
          {String(error.stack || error.message)}
        </pre>
      </div>
    );
  }
}