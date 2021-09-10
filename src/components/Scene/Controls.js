import { useMemo, useEffect, useRef } from 'react';
import {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
} from 'three';
import CameraControls from 'camera-controls';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { usePrefersReducedMotion } from 'hooks';

CameraControls.install({
  THREE: {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
  },
});

extend({ CameraControls });

const Controls = ({ cameraRotation, onUpdate, ...rest }) => {
  const { camera, gl } = useThree();
  const controls = useMemo(
    () => new CameraControls(camera, gl.domElement),
    [camera, gl.domElement]
  );
  const animating = useRef(false);
  const transition = useRef(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (animating.current) return;

    let timeout;

    const onSleep = () => {
      controls.removeEventListener('sleep', onSleep);
      transition.current = false;
    };

    const handleUpdate = () => {
      timeout = null;
      transition.current = true;

      controls.rotateTo(
        MathUtils.degToRad(Number(cameraRotation.y)) % 360,
        MathUtils.degToRad(Number(cameraRotation.x)) % 360,
        !reduceMotion
      );

      controls.addEventListener('sleep', onSleep);
    };

    clearTimeout(timeout);
    timeout = setTimeout(handleUpdate, 250);

    return () => {
      controls.removeEventListener('sleep', onSleep);
    };
  }, [reduceMotion, controls, cameraRotation.y, cameraRotation.x]);

  useFrame((_, delta) => {
    const needsUpdate = controls.update(delta);

    if (!needsUpdate || !onUpdate || transition.current) {
      return (animating.current = false);
    }

    const cameraRotation = {
      x: Math.round(MathUtils.radToDeg(controls.polarAngle) % 360),
      y: Math.round(MathUtils.radToDeg(controls.azimuthAngle) % 360),
    };

    animating.current = true;

    return onUpdate(cameraRotation);
  });

  return <primitive object={controls} {...rest} />;
};

export default Controls;
