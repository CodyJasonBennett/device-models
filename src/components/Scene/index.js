import { useRef, useLayoutEffect, useContext, useCallback, Suspense } from 'react';
import { render, unmountComponentAtNode } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import Controls from './Controls';
import { PluginContext } from 'plugin';
import exportSettings from 'data/export';
import './index.css';

const Canvas = ({ children, ...props }) => {
  const container = useRef();
  const canvas = useRef();

  // Render to canvas
  useLayoutEffect(() => {
    const Content = () => <Suspense fallback={null}>{children}</Suspense>;
    render(<Content />, canvas.current, props);
  }, [children, props]);

  // Cleanup on unmount
  useLayoutEffect(() => {
    const canvasRef = canvas.current;
    return () => unmountComponentAtNode(canvasRef);
  }, []);

  return (
    <div className="scene" ref={container}>
      <canvas className="scene__canvas" aria-hidden ref={canvas} />
    </div>
  );
};

const Scene = ({
  clay,
  model = 'iPhone 11',
  environment = 'studio',
  controls,
  ...rest
}) => {
  const { dispatch } = useContext(PluginContext);

  const onCreated = useCallback(
    ({ gl, scene, camera }) => {
      gl.physicallyCorrectLights = true;

      const requestOutputFrame = exportQuality => {
        // Get export settings
        const pixelRatio = gl.getPixelRatio();
        const exportRatio = exportSettings[exportQuality];

        // Render
        gl.setPixelRatio(exportRatio);
        gl.render(scene, camera);
        const render = gl.domElement.toDataURL('image/png', 1);

        // Cleanup
        gl.setPixelRatio(pixelRatio);

        return render;
      };

      dispatch({ type: 'setRequestOutputFrame', value: requestOutputFrame });
    },
    [dispatch]
  );

  return (
    <Canvas
      flat={clay}
      frameloop="always"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      camera={{
        fov: 36,
        near: 0.1,
        far: 100,
        position: [0, 0, 8],
      }}
      size={{ width: 560, height: 500 }}
      onCreated={onCreated}
    >
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1.1} position={[0.5, 0, 0.866]} />
      <directionalLight intensity={0.8} position={[-6, 2, 2]} />
      <Model clay={clay} model={model} {...rest} />
      {!clay && <Environment preset="studio" />}
      <Controls minDistance={2} maxDistance={8} dampingFactor={0.1} {...controls} />
    </Canvas>
  );
};

export default Scene;
