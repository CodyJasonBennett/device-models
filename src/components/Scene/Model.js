import { useEffect } from 'react';
import {
  Color,
  MeshStandardMaterial,
  MeshBasicMaterial,
  sRGBEncoding,
  MathUtils,
} from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
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
  const { gl } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const { rotation } = useSpring({
    immediate: reduceMotion,
    rotation: [
      MathUtils.degToRad(Number(modelRotation.x)),
      MathUtils.degToRad(Number(modelRotation.y)),
      MathUtils.degToRad(Number(modelRotation.z)),
    ],
  });

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

  return <animated.primitive rotation={rotation} object={gltf.scene} {...rest} />;
};

export default Model;
