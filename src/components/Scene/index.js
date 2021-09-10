import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import Controls from './Controls';
import './index.css';

const Scene = ({
  clay,
  model = 'Google Pixel 6',
  environment = 'studio',
  controls,
  ...rest
}) => (
  <Canvas
    className="scene"
    frameloop="always"
    dpr={[1, 2]}
    gl={{ preserveDrawingBuffer: true }}
    camera={{ position: [0, 0, 6], fov: 45 }}
    resize={{ scroll: false, debounce: { scroll: 0, resize: 3000 } }}
  >
    <Model clay={clay} model={model} {...rest} />
    {!clay && <Environment preset={environment} />}
    {clay && <ambientLight intensity={1.2} />}
    <Controls minDistance={4} maxDistance={16} dampingFactor={0.1} {...controls} />
  </Canvas>
);

export default Scene;
