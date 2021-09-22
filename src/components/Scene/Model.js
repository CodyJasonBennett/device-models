import { useEffect } from 'react';
import { Color, sRGBEncoding, MathUtils } from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { usePrefersReducedMotion } from 'hooks';
import deviceModels from './deviceModels';

const modelColor = new Color();

const Model = ({ model, selection, color = '#FFFFFF', modelRotation, ...rest }) => {
  const targetModel = deviceModels[model];
  const url = targetModel?.url || model;
  const gltf = useGLTF(url);
  const texture = useTexture(selection || targetModel?.texture);
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
    modelColor.set(color);

    gltf.scene.traverse(node => {
      if (node.material && node.name !== 'Screen') {
        node.material.color = modelColor;
      }
    });
  }, [color, gltf.scene]);

  useEffect(() => {
    texture.encoding = sRGBEncoding;
    texture.flipY = false;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();

    // Decode the texture to prevent jank on first render
    gl.initTexture(texture);

    gltf.scene.traverse(node => {
      if (node.name === 'Screen') {
        node.material.color = new Color(0xffffff);
        node.material.transparent = false;
        node.material.map = texture;
        node.material.needsUpdate = true;
      }
    });
  }, [texture, gl, gltf.scene]);

  return <animated.primitive rotation={rotation} object={gltf.scene} {...rest} />;
};

export default Model;
