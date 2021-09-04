import { useEffect, useCallback, useRef, useState, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import {
  sRGBEncoding,
  LinearFilter,
  Color,
  TextureLoader,
  Vector2,
  Vector3,
  AmbientLight,
  DirectionalLight,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  MathUtils,
  Object3D,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Tween, Easing, update } from '@tweenjs/tween.js';
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
      animated = false,
      showDelay = 200,
      style,
      className,
      controls: controlOverrides,
      models,
      cameraPosition = { x: 0, y: 0, z: 8 },
      cameraRotation = { x: 0, y: 0, z: 0 },
      ...rest
    },
    canvas
  ) => {
    const [loaded, setLoaded] = useState(false);
    const container = useRef();
    const camera = useRef();
    const scene = useRef();
    const controls = useRef();
    const renderer = useRef();
    const lights = useRef();
    const textureLoader = useRef();
    const modelLoader = useRef();
    const modelGroup = useRef();
    const reduceMotion = usePrefersReducedMotion();

    // Handle render passes for a single frame
    const renderFrame = useCallback(() => {
      renderer.current.render(scene.current, camera.current);
    }, []);

    // Create export method
    useEffect(() => {
      canvas.current.export = pixelRatio => {
        renderer.current.setPixelRatio(pixelRatio);
        renderFrame();

        return canvas.current.toDataURL('image/png', 1);
      };
    }, [canvas, renderFrame]);

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
      });

      renderer.current.setPixelRatio(Math.max(window.devicePixelRatio, 2));
      renderer.current.setSize(clientWidth, clientHeight);
      renderer.current.outputEncoding = sRGBEncoding;
      renderer.current.physicallyCorrectLights = true;

      camera.current = new PerspectiveCamera(36, clientWidth / clientHeight, 0.1, 100);
      camera.current.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

      controls.current = new OrbitControls(camera.current, renderer.current.domElement);
      controls.current.enableKeys = false;
      controls.current.enablePan = true;
      controls.current.enableZoom = true;
      controls.current.maxDistance = 16;
      controls.current.minDistance = 4;
      controls.current.enableRotate = true;
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.1;
      Object.assign(controls.current, controlOverrides);

      scene.current = new Scene();

      // Lighting
      const ambientLight = new AmbientLight(0xffffff, 1.2);
      const keyLight = new DirectionalLight(0xffffff, 1.1);
      const fillLight = new DirectionalLight(0xffffff, 0.8);

      fillLight.position.set(-6, 2, 2);
      keyLight.position.set(0.5, 0, 0.866);
      lights.current = [ambientLight, keyLight, fillLight];
      lights.current.forEach(light => scene.current.add(light));

      textureLoader.current = new TextureLoader();

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

      modelLoader.current = new GLTFLoader();
      modelLoader.current.setDRACOLoader(dracoLoader);

      modelGroup.current = new Object3D();
      scene.current.add(modelGroup.current);

      const loadScene = async () => {
        const handleModelLoad = models.map(async (model, index) => {
          const { url, color, texture, position, rotation } = model;

          let loadFullResTexture;

          const gltf = await modelLoader.current.loadAsync(url);

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

          if (animated) {
            gltf.scene.position.set(position.x, position.y, position.z);
            gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z);

            const animation = getModelAnimation({
              animated,
              model,
              gltf,
              reduceMotion,
              renderFrame,
              index,
              showDelay,
            });

            animation.start();
          }

          modelGroup.current.add(gltf.scene);

          if (reduceMotion) {
            renderFrame();
          }

          // Load full res screen texture
          await loadFullResTexture();

          // Render the loaded texture
          if (reduceMotion) {
            renderFrame();
          }
        });

        await Promise.all(handleModelLoad);

        setLoaded(true);
      };

      loadScene();

      return () => {
        removeLights(lights.current);
        cleanScene(scene.current);
        cleanRenderer(renderer.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync device position inputs
    useMemo(() => {
      if (!loaded || animated) return;

      const springs = [];

      models.forEach(({ position }, index) => {
        const gltf = scene.current.getObjectByName(`model-${index}`);

        const startPosition = gltf.position.clone();
        const endPosition = new Vector3(position.x, position.y, position.z);

        if (reduceMotion) {
          gltf.rotation.copy(endPosition);
        } else {
          springs.push(
            new Tween(startPosition)
              .to(endPosition)
              .onUpdate(({ x, y, z }) => gltf.position.set(x, y, z))
              .easing(Easing.Quartic.Out)
              .start()
          );
        }
      });

      return () => {
        springs.forEach(spring => spring?.stop());
      };
    }, [loaded, animated, models, reduceMotion]);

    // Sync device rotation inputs
    useMemo(() => {
      if (!loaded || animated) return;

      const springs = [];

      models.forEach(({ rotation }, index) => {
        const gltf = scene.current.getObjectByName(`model-${index}`);

        const startRotation = new Vector3(...gltf.rotation.toArray());
        const endRotation = new Vector3(
          MathUtils.degToRad(rotation.x),
          MathUtils.degToRad(rotation.y),
          MathUtils.degToRad(rotation.z)
        );

        if (reduceMotion) {
          gltf.rotation.set(...endRotation.toArray());
        } else {
          springs.push(
            new Tween(startRotation)
              .to(endRotation)
              .onUpdate(({ x, y, z }) => gltf.rotation.set(x, y, z))
              .easing(Easing.Quartic.Out)
              .start()
          );
        }
      });

      return () => {
        springs.forEach(spring => spring?.stop());
      };
    }, [loaded, animated, models, reduceMotion]);

    // Sync camera rotation inputs
    useMemo(() => {
      if (!loaded || animated) return;

      const startRotation = new Vector2(...controls.current.object.rotation.toArray());
      const endRotation = new Vector2(
        MathUtils.degToRad(cameraRotation.x),
        MathUtils.degToRad(cameraRotation.y)
      );

      const axes = [new Vector3(-1, 0, 0), new Vector3(0, -1, 0)];

      let animation;

      if (reduceMotion) {
        controls.current.enabled = false;
        startRotation
          .sub(endRotation)
          .toArray()
          .forEach((theta, index) => {
            const axis = axes[index];

            controls.current.object.position.applyAxisAngle(axis, theta);
            controls.current.object.rotateOnAxis(axis, theta);
          });
        controls.current.enabled = true;
      } else {
        controls.current.enabled = false;

        animation = new Tween(startRotation)
          .to(endRotation)
          .onUpdate(({ x, y }) => {
            [
              controls.current.object.rotation.x - x,
              controls.current.object.rotation.y - y,
            ].forEach((theta, index) => {
              const axis = axes[index];

              controls.current.object.position.applyAxisAngle(axis, theta);
              controls.current.object.rotateOnAxis(axis, theta);
            });
          })
          .easing(Easing.Quartic.Out)
          .start()
          .onComplete(() => (controls.current.enabled = true));
      }

      return () => {
        animation?.stop();
      };
    }, [loaded, animated, cameraRotation.x, cameraRotation.y, reduceMotion]);

    // Sync device color inputs
    useEffect(() => {
      if (!loaded) return;

      models.forEach(({ color }, index) => {
        const gltf = scene.current.getObjectByName(`model-${index}`);

        const currentColor = new Color(color);
        currentColor.convertSRGBToLinear();

        gltf.traverse(node => {
          if (node.isMesh && node.name !== MeshType.Screen) {
            node.material.color = currentColor;
          }
        });
      });
    }, [loaded, models]);

    // Sync texture selection
    useEffect(() => {
      if (!loaded) return;

      models.forEach(({ texture }, index) => {
        const gltf = scene.current.getObjectByName(`model-${index}`);

        gltf.traverse(async node => {
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

    useEffect(() => {
      if (!reduceMotion) {
        renderer.current.setAnimationLoop(time => {
          update(time);
          controls.current.update();

          renderFrame();
        });
      }

      return () => {
        renderer.current.setAnimationLoop(null);
      };
    }, [reduceMotion, renderFrame]);

    return (
      <div
        className={classNames('model', { 'model--loaded': loaded }, className)}
        ref={container}
        style={{ '--delay': numToMs(showDelay), ...style }}
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

    const animation = new Tween(startPosition)
      .to(endPosition)
      .delay(100 * index + showDelay * 0.6)
      .onUpdate(({ x, y, z }) => {
        gltf.scene.position.set(x, y, z);
        renderFrame();
      })
      .easing(Easing.Quartic.Out);

    return animation;
  }

  // Laptop open animation
  if (model.animation === ModelAnimationType.LaptopOpen) {
    const frameNode = gltf.scene.children.find(node => node.name === MeshType.Frame);
    const startRotation = new Vector3(MathUtils.degToRad(90), 0, 0);
    const endRotation = new Vector3(0, 0, 0);

    gltf.scene.position.set(...positionVector.toArray());
    frameNode.rotation.set(...startRotation.toArray());

    const animation = new Tween(startRotation)
      .to(endRotation)
      .delay(300 * index + showDelay + 200)
      .onUpdate(({ x, y, z }) => {
        frameNode.rotation.set(x, y, z);
        renderFrame();
      })
      .easing(Easing.Quartic.Out);

    return animation;
  }
}

export default Model;
