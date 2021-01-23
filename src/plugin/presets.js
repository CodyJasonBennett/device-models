const presets = [
  {
    label: 'Front Left',
    deviceRotation: { x: -10, y: 0, z: 0 },
    cameraRotation: { x: 0, y: 30, z: 0 },
  },
  {
    label: 'Front',
    deviceRotation: { x: 0, y: 0, z: 0 },
    cameraRotation: { x: 0, y: 0, z: 0 },
  },
  {
    label: 'Front Right',
    deviceRotation: { x: -10, y: 0, z: 0 },
    cameraRotation: { x: 0, y: -30, z: 0 },
  },
  {
    label: 'Tilted Left',
    deviceRotation: { x: -10, y: 0, z: 20 },
    cameraRotation: { x: 0, y: -20, z: 0 },
  },
  {
    label: 'Tilted Right',
    deviceRotation: { x: -10, y: 0, z: -20 },
    cameraRotation: { x: 0, y: 20, z: 0 },
  },
];

export default presets;
