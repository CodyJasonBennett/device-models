import { useEffect } from 'react';
import {
  Color,
  MeshStandardMaterial,
  MeshBasicMaterial,
  sRGBEncoding,
  LinearFilter,
} from 'three';
import { useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
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
  setRequestExportFrame,
  ...rest
}) => {
  const targetModel = deviceModels[model];
  const url = targetModel?.url || model;
  const gltf = useGLTF(url);
  const texture = useTexture(targetModel?.texture || selection);
  const { gl, scene, camera } = useThree();

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
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.flipY = false;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.generateMipmaps = false;

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
    if (!setRequestExportFrame) return;

    const handleExport = exportQuality => {
      const pixelRatio = gl.getPixelRatio();

      gl.setPixelRatio(exportQuality);
      gl.render(scene, camera);
      gl.setPixelRatio(pixelRatio);
      const render = gl.domElement.toDataURL('image/png', 1);

      return render;
    };

    setRequestExportFrame(handleExport);

    return () => {
      setRequestExportFrame(null);
    };
  }, [setRequestExportFrame, gl, scene, camera, model]);

  return <primitive object={gltf.scene} {...rest} />;
};

export default Model;
