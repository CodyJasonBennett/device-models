import { useState, useLayoutEffect, useContext, useCallback } from 'react';
import { useThree, Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import Controls from './Controls';
import { PluginContext } from 'plugin';
import exportSettings from 'data/export';
import './index.css';

// react-three-fiber/issues/1394
const Scale = ({ width, height }) => {
  const state = useThree();
  const [setSize] = useState(() => state.setSize);

  useLayoutEffect(() => {
    setSize(width, height);
    state.set({ setSize: () => null });

    return () => state.set({ setSize });
  }, [setSize, width, height, state]);

  return null;
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
      const requestOutputFrame = exportQuality => {
        const pixelRatio = gl.getPixelRatio();

        const exportRatio = exportSettings[exportQuality];

        gl.setPixelRatio(exportRatio);
        gl.render(scene, camera);
        gl.setPixelRatio(pixelRatio);
        const render = gl.domElement.toDataURL('image/png', 1);

        return render;
      };

      dispatch({ type: 'setRequestOutputFrame', value: requestOutputFrame });
    },
    [dispatch]
  );

  return (
    <Canvas
      className="scene"
      frameloop="always"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      onCreated={onCreated}
    >
      <ambientLight intensity={1} />
      <spotLight intensity={2} angle={0.1} penumbra={1} position={[5, 2, 10]} />
      <spotLight intensity={2} angle={0.1} penumbra={1} position={[5, 2, -10]} />
      <fog attach="fog" args={['white', -6, 40]} />
      <Model clay={clay} model={model} {...rest} />
      <Environment preset="studio" />
      <Controls minDistance={2} maxDistance={8} dampingFactor={0.1} {...controls} />
      <Scale width={560} height={500} />
    </Canvas>
  );
};

export default Scene;
