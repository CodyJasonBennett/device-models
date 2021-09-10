const presets = [
  {
    label: 'Front Left',
    modelRotation: { x: -10, y: 0, z: 0 },
    cameraRotation: { x: 90, y: 30 },
  },
  {
    label: 'Front',
    modelRotation: { x: 0, y: 0, z: 0 },
    cameraRotation: { x: 90, y: 0 },
  },
  {
    label: 'Front Right',
    modelRotation: { x: -10, y: 0, z: 0 },
    cameraRotation: { x: 90, y: -30 },
  },
  {
    label: 'Tilted Left',
    modelRotation: { x: -10, y: 0, z: 20 },
    cameraRotation: { x: 90, y: -20 },
  },
  {
    label: 'Tilted Right',
    modelRotation: { x: -10, y: 0, z: -20 },
    cameraRotation: { x: 90, y: 20 },
  },
];

export default presets;
