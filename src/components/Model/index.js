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
  MathUtils,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { delay, chain, spring, value } from 'popmotion';
import { usePrefersReducedMotion } from 'hooks';
import { cleanScene, cleanRenderer, removeLights } from 'utils/three';
import { numToMs } from 'utils/style';
import { ModelAnimationType } from './deviceModels';
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
      animated,
      show = true,
      showDelay = 200,
      cameraPosition = { x: 0, y: 0, z: 8 },
      cameraRotation = { x: 0, y: 0, z: 0 },
      controls: controlOverrides,
      style,
      className,
      alt = 'Model Preview',
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

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

      modelLoader.current = new GLTFLoader();
      modelLoader.current.setDRACOLoader(dracoLoader);

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

        gltf.scene.traverse(node => {
          if (node.material) {
            node.material.color = new Color(color);
            node.material.color.convertSRGBToLinear();
          }

          if (node.name === MeshType.Screen) {
            loadFullResTexture = async () => {
              const image = await textureLoader.current.loadAsync(texture);
              await applyScreenTexture(image, node);
            };
          }
        });

        gltf.scene.name = `model-${index}`;
        gltf.scene.position.set(position.x, position.y, position.z);
        gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z);

        modelGroup.current.add(gltf.scene);

        const animation = getModelAnimation({
          animated,
          model,
          gltf,
          position,
          reduceMotion,
          renderFrame,
          index,
          showDelay,
        });

        return { ...animation, loadFullResTexture };
      });

      setModelData(deviceConfigPromises);

      controls.current = new OrbitControls(camera.current, renderer.current.domElement);
      controls.current.keys = {};
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

    // Create export method
    useEffect(() => {
      canvas.current.export = (pixelRatio = 2) => {
        renderer.current.setPixelRatio(pixelRatio);
        renderFrame();

        return canvas.current.toDataURL('image/png', 1);
      };
    }, [canvas, renderFrame]);

    // Init models
    useEffect(() => {
      const introSprings = [];

      if (!modelData) return;

      scene.current.add(modelGroup.current);

      const loadScene = async () => {
        const loadedModels = await Promise.all(modelData);

        const handleModelLoad = loadedModels.map(async model => {
          if (model.animation && animated) {
            const modelAnimation = model.animation.start(model.modelValue);
            introSprings.push(modelAnimation);
          }

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

      if (show) loadScene();

      return () => {
        for (const spring of introSprings) {
          spring.stop();
        }
      };
    }, [modelData, animated, reduceMotion, renderFrame, show]);

    // Syn device rotation inputs
    useMemo(() => {
      if (!loaded) return;

      const springs = [];

      models.forEach(({ rotation }, index) => {
        const model = modelGroup.current.getObjectByName(`model-${index}`);

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

    // Sync camera rotation inputs
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

    // Sync device color inputs
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

    // Sync texture selection
    useEffect(() => {
      if (!loaded) return;

      models.forEach(({ texture }, index) => {
        const model = modelGroup.current.getObjectByName(`model-${index}`);

        model.traverse(async node => {
          if (node.name === MeshType.Screen) {
            const image = await textureLoader.current.loadAsync(texture);
            await applyScreenTexture(image, node);
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

    // Auto-update if dampened
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
        aria-label={alt}
        {...rest}
      >
        <canvas className="model__canvas" ref={canvas} />
      </div>
    );
  }
);

// Get custom model animation
function getModelAnimation({
  animated,
  model,
  gltf,
  reduceMotion,
  renderFrame,
  index,
  showDelay,
}) {
  if (!animated) return;

  const positionVector = new Vector3(
    model.position.x,
    model.position.y,
    model.position.z
  );

  if (reduceMotion) {
    return void gltf.scene.position.set(...positionVector.toArray());
  }

  // Simple slide up animation
  if (model.animation === ModelAnimationType.SpringUp) {
    const startPosition = new Vector3(
      positionVector.x,
      positionVector.y - 6,
      positionVector.z
    );
    const endPosition = positionVector;

    gltf.scene.position.set(...startPosition.toArray());

    const modelValue = value(gltf.scene.position, ({ x, y, z }) => {
      gltf.scene.position.set(x, y, z);
      renderFrame();
    });

    const animation = chain(
      delay(100 * index + showDelay * 0.6),
      spring({
        from: startPosition,
        to: endPosition,
        stiffness: 60,
        damping: 16,
        restSpeed: 0.001,
      })
    );

    return { animation, modelValue };
  }

  // Laptop open animation
  if (model.animation === ModelAnimationType.LaptopOpen) {
    const frameNode = gltf.scene.children.find(node => node.name === MeshType.Frame);
    const startRotation = new Vector3(MathUtils.degToRad(90), 0, 0);
    const endRotation = new Vector3(0, 0, 0);

    gltf.scene.position.set(...positionVector.toArray());
    frameNode.rotation.set(...startRotation.toArray());

    const modelValue = value(frameNode.rotation, ({ x, y, z }) => {
      frameNode.rotation.set(x, y, z);
      renderFrame();
    });

    const animation = chain(
      delay(300 * index + showDelay + 200),
      spring({
        from: startRotation,
        to: endRotation,
        stiffness: 50,
        damping: 14,
        restSpeed: 0.001,
      })
    );

    return { animation, modelValue };
  }
}

export default Model;
