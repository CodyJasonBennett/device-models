import { useContext, useCallback } from 'react';
import Canvas from './Canvas';
import Model from './Model';
import Controls from './Controls';
import { PluginContext } from 'plugin';
import exportSettings from 'data/export';

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
      flat
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
      <Controls minDistance={2} maxDistance={8} dampingFactor={0.1} {...controls} />
    </Canvas>
  );
};

export default Scene;
