import { forwardRef, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import classNames from 'classnames';
import {
  sRGBEncoding,
  LinearFilter,
  Color,
  TextureLoader,
  Vector3,
  MathUtils,
  Object3D,
  AmbientLight,
  DirectionalLight,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { delay, chain, spring, value } from 'popmotion';
import { usePrefersReducedMotion } from 'hooks';
import { cleanScene, cleanRenderer, removeLights } from 'utils/three';
import { numToMs } from 'utils/style';
import devices from './devices';
import './index.css';

const MeshType = {
  Frame: 'Frame',
  Logo: 'Logo',
  Screen: 'Screen',
};

const Device = forwardRef(
  (
    {
      showDelay = 200,
      texture,
      color,
      device,
      style,
      className,
      deviceRotation = [0, 0, 0],
      cameraRotation = [0, 0, 0],
      ...rest
    },
    canvas
  ) => {
    const [deviceData, setDeviceData] = useState();
    const [loaded, setLoaded] = useState(false);
    const container = useRef();
    const camera = useRef();
    const textureLoader = useRef();
    const deviceLoader = useRef();
    const deviceGroup = useRef();
    const scene = useRef();
    const renderer = useRef();
    const lights = useRef();
    const controls = useRef();
    const reduceMotion = usePrefersReducedMotion();

    const applyScreenTexture = async (texture, node) => {
      texture.encoding = sRGBEncoding;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.flipY = false;
      texture.anisotropy = renderer.current.capabilities.getMaxAnisotropy();
      texture.generateMipmaps = false;

      // Decode the texture to prevent jank on first render
      await renderer.current.initTexture(texture);

      node.material.color = new Color(0xffffff);
      node.material.transparent = false;
      node.material.map = texture;
      node.material.needsUpdate = true;
    };

    useEffect(() => {
      const { clientWidth, clientHeight } = container.current;

      renderer.current = new WebGLRenderer({
        canvas: canvas.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });

      renderer.current.setPixelRatio(2);
      renderer.current.setSize(clientWidth, clientHeight);
      renderer.current.outputEncoding = sRGBEncoding;
      renderer.current.physicallyCorrectLights = true;

      camera.current = new PerspectiveCamera(36, clientWidth / clientHeight, 0.1, 100);
      camera.current.position.set(0, 0, 8);
      scene.current = new Scene();

      textureLoader.current = new TextureLoader();
      deviceLoader.current = new GLTFLoader();
      deviceGroup.current = new Object3D();

      // Lighting
      const ambientLight = new AmbientLight(0xffffff, 1.2);
      const keyLight = new DirectionalLight(0xffffff, 1.1);
      const fillLight = new DirectionalLight(0xffffff, 0.8);

      fillLight.position.set(-6, 2, 2);
      keyLight.position.set(0.5, 0, 0.866);
      lights.current = [ambientLight, keyLight, fillLight];
      lights.current.forEach(light => scene.current.add(light));

      // Build an array of promises to fetch and apply devices & animations
      const deviceConfigPromises = devices
        .filter(({ name }) => name === device)
        .map(async ({ url }, index) => {
          const gltf = await Promise.resolve(await deviceLoader.current.loadAsync(url));

          return deviceGroup.current.add(gltf.scene);
        });

      setDeviceData(deviceConfigPromises);

      controls.current = new OrbitControls(camera.current, renderer.current.domElement);
      controls.current.enableDamping = true;

      return () => {
        removeLights(lights.current);
        cleanScene(scene.current);
        cleanRenderer(renderer.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle render passes for a single frame
    const renderFrame = useCallback(() => {
      renderer.current.render(scene.current, camera.current);
    }, []);

    useEffect(() => {
      if (!deviceData) return;

      scene.current.add(deviceGroup.current);

      const loadScene = async () => {
        const loadedDevices = await Promise.all(deviceData);

        setLoaded(true);

        const handleDeviceLoad = loadedDevices.map(device => {
          // Render the loaded texture
          if (reduceMotion) {
            renderFrame();
          }

          return device;
        });

        await Promise.all(handleDeviceLoad);
      };

      loadScene();
    }, [deviceData, reduceMotion, renderFrame]);

    useEffect(() => {
      if (!loaded) return;

      const [x, y, z] = deviceRotation;

      const startRotation = new Vector3(...deviceGroup.current.rotation.toArray());
      const endRotation = new Vector3(
        MathUtils.degToRad(x),
        MathUtils.degToRad(y),
        MathUtils.degToRad(z)
      );

      const deviceValue = value(deviceGroup.current.rotation, ({ x, y, z }) => {
        deviceGroup.current.rotation.set(x, y, z);
      });

      const transformation = chain(
        delay(300 + showDelay * 0.6),
        spring({
          from: startRotation,
          to: endRotation,
          stiffness: 60,
          damping: 16,
          restSpeed: 0.001,
        })
      );

      const animation = transformation.start(deviceValue);
      const cancelAnimation = () => animation.stop();

      canvas.current.addEventListener('pointerdown', cancelAnimation);

      return () => {
        cancelAnimation();
        canvas.current.removeEventListener('pointerdown', cancelAnimation);
      };
    }, [loaded, deviceRotation, showDelay]);

    useEffect(() => {
      if (!loaded) return;

      const [x, y] = cameraRotation;

      const startRotation = new Vector3(...controls.current.object.rotation.toArray());
      const endRotation = new Vector3(MathUtils.degToRad(x), MathUtils.degToRad(y), 0);

      const center = new Vector3(0, 0, 0);

      const xAxis = new Vector3(-1, 0, 0);
      const yAxis = new Vector3(0, -1, 0);

      const deviceValue = value(controls.current.object.rotation, ({ x, y }) => {
        const axes = [xAxis, yAxis];

        [
          controls.current.object.rotation.x - x,
          controls.current.object.rotation.y - y,
        ].forEach((theta, index) => {
          const axis = axes[index];

          controls.current.object.position.sub(center);
          controls.current.object.position.applyAxisAngle(axis, theta);
          controls.current.object.position.add(center);

          controls.current.object.rotateOnAxis(axis, theta);
        });

        controls.current.update();
      });

      const transformation = chain(
        delay(300 + showDelay * 0.6),
        spring({
          from: startRotation,
          to: endRotation,
          stiffness: 60,
          damping: 16,
          restSpeed: 0.001,
        })
      );

      const animation = transformation.start(deviceValue);
      const cancelAnimation = () => animation.stop();

      canvas.current.addEventListener('pointerdown', cancelAnimation);

      return () => {
        cancelAnimation();
        canvas.current.removeEventListener('pointerdown', cancelAnimation);
      };
    }, [loaded, cameraRotation, showDelay]);

    useEffect(() => {
      if (!loaded) return;

      deviceGroup.current.traverse(async node => {
        if (node.material && node.name !== MeshType.Screen) {
          node.material.color = new Color(color);
          node.material.color.convertSRGBToLinear();
        }
      });
    }, [loaded, color]);

    useMemo(() => {
      if (!loaded) return;

      deviceGroup.current.traverse(async node => {
        if (node.name === MeshType.Screen) {
          const image = await textureLoader.current.loadAsync(texture);

          await applyScreenTexture(image, node);
        }
      });
    }, [loaded, texture]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        if (!container.current) return;

        const { clientWidth, clientHeight } = container.current;

        renderer.current.setSize(clientWidth, clientHeight);
        camera.current.aspect = clientWidth / clientHeight;
        camera.current.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      const animate = () => {
        renderFrame();
      };

      if (!reduceMotion) {
        renderer.current.setAnimationLoop(animate);
      }

      return () => {
        renderer.current.setAnimationLoop(null);
      };
    }, [reduceMotion, renderFrame]);

    return (
      <div
        className={classNames('device', { 'device--loaded': loaded }, className)}
        style={{ '--delay': numToMs(showDelay), ...style }}
        ref={container}
        role="img"
        aria-label="Device Preview"
        {...rest}
      >
        <canvas className="device__canvas" ref={canvas} />
      </div>
    );
  }
);

export default Device;
export { devices };
