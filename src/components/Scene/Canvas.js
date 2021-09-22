import { useLayoutEffect, Component, useRef, useState, Suspense } from 'react';
import { render, unmountComponentAtNode } from '@react-three/fiber';
import './Canvas.css';

const Block = ({ set }) => {
  useLayoutEffect(() => {
    set(new Promise(() => null));
    return () => set(false);
  }, [set]);

  return null;
};

class ErrorBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError = () => ({ error: true });
  componentDidCatch(error) {
    this.props.set(error);
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}

const Canvas = ({ children, ...props }) => {
  const container = useRef();
  const canvas = useRef();
  const [block, setBlock] = useState();
  const [error, setError] = useState();

  // Suspend this component if block is a promise (2nd run)
  if (block) throw block;
  // Throw exception outwards if anything within canvas throws
  if (error) throw error;

  // Render to canvas
  useLayoutEffect(() => {
    render(
      <ErrorBoundary set={setError}>
        <Suspense fallback={<Block set={setBlock} />}>{children}</Suspense>
      </ErrorBoundary>,
      canvas.current,
      props
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  // Cleanup on unmount
  useLayoutEffect(() => {
    const canvasRef = canvas.current;
    return () => unmountComponentAtNode(canvasRef);
  }, []);

  return (
    <div className="canvas-container" ref={container}>
      <canvas className="canvas" aria-hidden ref={canvas} />
    </div>
  );
};

export default Canvas;
