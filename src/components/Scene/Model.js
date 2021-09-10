import { useEffect, useRef } from 'react';
import {
  Color,
  MeshStandardMaterial,
  MeshBasicMaterial,
  sRGBEncoding,
  Vector3,
  MathUtils,
} from 'three';
import { Tween, Easing, update } from '@tweenjs/tween.js';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { usePrefersReducedMotion } from 'hooks';
import deviceModels from './deviceModels';

const modelColor = new Color();
const logoMaterial = new MeshStandardMaterial({ roughness: 0.4 });
const frameMaterial = new MeshStandardMaterial({ roughness: 0.7 });
const screenMaterial = new MeshBasicMaterial();

const Model = ({
  clay = false,
  model,
  selection,
  color = '#FFFFFF',
  modelRotation,
  ...rest
}) => {
  const targetModel = deviceModels[model];
  const url = targetModel?.url || model;
  const gltf = useGLTF(url);
  const texture = useTexture(targetModel?.texture || selection);
  const { gl, scene, camera } = useThree();
  const ref = useRef();
  const reduceMotion = usePrefersReducedMotion();

  useFrame(() => update(performance.now()));

  useEffect(() => {
    let animation;

    const model = ref.current;

    const startRotation = new Vector3(...model.rotation.toArray());
    const endRotation = new Vector3(
      MathUtils.degToRad(Number(modelRotation.x)),
      MathUtils.degToRad(Number(modelRotation.y)),
      MathUtils.degToRad(Number(modelRotation.z))
    );

    if (reduceMotion) {
      model.rotation.set(...endRotation.toArray());
    } else {
      animation = new Tween(startRotation)
        .to(endRotation)
        .onUpdate(({ x, y, z }) => model.rotation.set(x, y, z))
        .easing(Easing.Quartic.Out)
        .start();
    }

    return () => {
      animation?.stop();
    };
  }, [reduceMotion, modelRotation.x, modelRotation.y, modelRotation.z]);

  useEffect(() => {
    if (!clay) return;

    modelColor.set(color);

    logoMaterial.color = modelColor;
    frameMaterial.color = modelColor;

    gltf.scene.traverse(node => {
      if (node.material === 'Logo') {
        node.material = logoMaterial;

        if (node.children?.length) {
          node.traverse(node => {
            if (node.isMesh) {
              node.material = logoMaterial;
            }
          });
        }
      } else if (node.name === 'Frame') {
        node.material = frameMaterial;

        if (node.children?.length) {
          node.traverse(node => {
            if (node.isMesh) {
              node.material = frameMaterial;
            }
          });
        }
      }
    });
  }, [clay, color, gltf.scene]);

  useEffect(() => {
    texture.encoding = sRGBEncoding;
    texture.flipY = false;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();

    // Decode the texture to prevent jank on first render
    gl.initTexture(texture);

    gltf.scene.traverse(node => {
      if (node.name === 'Screen') {
        node.material = screenMaterial;
        node.material.map = texture;
        node.material.needsUpdate = true;
      }
    });
  }, [gltf.scene, texture, gl]);

  useEffect(() => {
    const handleExport = exportQuality => {
      const pixelRatio = gl.getPixelRatio();

      const exportRatio = {
        Low: 2,
        Medium: 4,
        High: 8,
      }[exportQuality];

      console.log(exportQuality, exportRatio);

      gl.setPixelRatio(exportRatio);
      gl.render(scene, camera);
      gl.setPixelRatio(pixelRatio);
      const render = gl.domElement.toDataURL('image/png', 1);

      return render;
    };

    window.export = handleExport;

    return () => {
      window.export = null;
    };
  }, [gl, scene, camera, model]);

  return (
    <group ref={ref}>
      <primitive object={gltf.scene} {...rest} />
    </group>
  );
};

export default Model;
