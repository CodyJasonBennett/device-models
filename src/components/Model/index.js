import { forwardRef, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import classNames from 'classnames';
import {
  sRGBEncoding,
  LinearFilter,
  Color,
  TextureLoader,
  Vector3,
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
import { getImageFromSrcSet } from 'utils/image';
import { usePrefersReducedMotion } from 'hooks';
import { cleanScene, cleanRenderer, removeLights } from 'utils/three';
import { numToMs } from 'utils/style';
import './index.css';

const MeshType = {
  Frame: 'Frame',
  Logo: 'Logo',
  Screen: 'Screen',
};

const Model = forwardRef(
  (
    {
      models,
      show = true,
      showDelay = 200,
      cameraPosition = { x: 0, y: 0, z: 8 },
      cameraRotation = { x: 0, y: 0, z: 0 },
      controls: controlOverrides,
      style,
      className,
      alt,
      ...rest
    },
    canvas
  ) => {
    const [modelData, setModelData] = useState();
    const [loaded, setLoaded] = useState(false);
    const container = useRef();
    const camera = useRef();
    const textureLoader = useRef();
    const modelLoader = useRef();
    const modelGroup = useRef();
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
      camera.current.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      scene.current = new Scene();

      textureLoader.current = new TextureLoader();
      modelLoader.current = new GLTFLoader();
      modelGroup.current = new Object3D();

      // Lighting
      const ambientLight = new AmbientLight(0xffffff, 1.2);
      const keyLight = new DirectionalLight(0xffffff, 1.1);
      const fillLight = new DirectionalLight(0xffffff, 0.8);

      fillLight.position.set(-6, 2, 2);
      keyLight.position.set(0.5, 0, 0.866);
      lights.current = [ambientLight, keyLight, fillLight];
      lights.current.forEach(light => scene.current.add(light));

      // Build an array of promises to fetch and apply models & animations
      const deviceConfigPromises = models.map(async (model, index) => {
        const { url, color, texture, position, rotation } = model;
        let loadFullResTexture;

        const gltf = await Promise.resolve(await modelLoader.current.loadAsync(url));
        const placeholder = texture?.placeholder && await Promise.resolve(await textureLoader.current.loadAsync(texture.placeholder));

        gltf.scene.traverse(node => {
          if (node.material) {
            node.material.color = new Color(color);
            node.material.color.convertSRGBToLinear();
          }

          if (node.name === MeshType.Screen) {
            if (placeholder) applyScreenTexture(placeholder, node);

            loadFullResTexture = async () => {
              const image = await getImageFromSrcSet(texture);
              const fullSize = await textureLoader.current.loadAsync(image);
              await applyScreenTexture(fullSize, node);
            };
          }
        });

        gltf.scene.position.set(position.x, position.y, position.z);
        gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z);

        modelGroup.current.add(gltf.scene);

        return { model, gltf, loadFullResTexture };
      });

      setModelData(deviceConfigPromises);

      controls.current = new OrbitControls(camera.current, renderer.current.domElement);
      Object.assign(controls.current, controlOverrides);

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
      if (!modelData) return;

      scene.current.add(modelGroup.current);

      const loadScene = async () => {
        const loadedModels = await Promise.all(modelData);

        const handleModelLoad = loadedModels.map(async model => {
          if (reduceMotion) {
            renderFrame();
          }

          // Load full res screen texture
          await model.loadFullResTexture();

          // Render the loaded texture
          if (reduceMotion) {
            renderFrame();
          }

          return model;
        });

        await Promise.all(handleModelLoad);
        setLoaded(true);
      };

      loadScene();
    }, [modelData, reduceMotion, renderFrame]);

    useMemo(() => {
      if (!loaded) return;

      const springs = [];

      models.forEach(({ name, rotation }, index) => {
        const model = modelGroup.current.children[index];

        const startRotation = new Vector3(...model.rotation.toArray());
        const endRotation = new Vector3(rotation.x, rotation.y, rotation.z);

        const deviceValue = value(model.rotation, ({ x, y, z }) => {
          model.rotation.set(x, y, z);
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
        springs.push(animation);
      });

      return () => {
        springs.forEach(spring => spring.stop());
      };
    }, [loaded, models, showDelay]);

    useMemo(() => {
      if (!loaded) return;

      const startRotation = new Vector3(...controls.current.object.rotation.toArray());
      const endRotation = new Vector3(
        cameraRotation.x,
        cameraRotation.y,
        cameraRotation.z
      );

      const center = new Vector3(0, 0, 0);

      const xAxis = new Vector3(-1, 0, 0);
      const yAxis = new Vector3(0, -1, 0);
      const zAxis = new Vector3(0, 0, -1);
      const axes = [xAxis, yAxis, zAxis];

      const deviceValue = value(controls.current.object.rotation, ({ x, y, z }) => {
        [
          controls.current.object.rotation.x - x,
          controls.current.object.rotation.y - y,
          controls.current.object.rotation.z - z,
        ].forEach((theta, index) => {
          const axis = axes[index];

          controls.current.object.position.sub(center);
          controls.current.object.position.applyAxisAngle(axis, theta);
          controls.current.object.position.add(center);

          controls.current.object.rotateOnAxis(axis, theta);
        });
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

      return () => {
        animation.stop();
      };
    }, [loaded, cameraRotation, showDelay]);

    useEffect(() => {
      if (!loaded) return;

      models.forEach(({ color }, index) => {
        const model = modelGroup.current.children[index];

        model.traverse(async node => {
          if (node.material && node.name !== MeshType.Screen) {
            node.material.color = new Color(color);
            node.material.color.convertSRGBToLinear();
          }
        });
      });
    }, [loaded, models]);

    useEffect(() => {
      if (!loaded) return;

      models.forEach(({ texture }, index) => {
        const model = modelGroup.current.children[index];

        model.traverse(async node => {
          if (node.name === MeshType.Screen) {
            if (texture.placeholder) {
              const placeholder = await textureLoader.current.loadAsync(
                texture.placeholder
              );
              applyScreenTexture(placeholder, node);
            }

            const image = await getImageFromSrcSet(texture);
            const fullSize = await textureLoader.current.loadAsync(image);
            await applyScreenTexture(fullSize, node);
          }
        });
      });
    }, [loaded, models]);

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
        if (controls.current.enableDamping) controls.current.update();

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
        className={classNames('model', { 'model--loaded': loaded }, className)}
        style={{ '--delay': numToMs(showDelay), ...style }}
        ref={container}
        role="img"
        aria-label="Model Preview"
        {...rest}
      >
        <canvas className="model__canvas" ref={canvas} />
      </div>
    );
  }
);

export default Model;
