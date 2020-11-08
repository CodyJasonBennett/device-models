import frontLeft from 'assets/front-left.png';
import front from 'assets/front.png';
import frontRight from 'assets/front-right.png';
import tiltedLeft from 'assets/tilted-left.png';
import tiltedRight from 'assets/tilted-right.png';

const presets = [
  {
    label: 'Front Left',
    src: frontLeft,
    deviceRotation: [-10, 0, 0],
    cameraRotation: [0, 30],
  },
  {
    label: 'Front',
    src: front,
    deviceRotation: [0, 0, 0],
    cameraRotation: [0, 0],
  },
  {
    label: 'Front Right',
    src: frontRight,
    deviceRotation: [-10, 0, 0],
    cameraRotation: [0, -30],
  },
  {
    label: 'Tilted Left',
    src: tiltedLeft,
    deviceRotation: [-10, 0, 20],
    cameraRotation: [0, -20],
  },
  {
    label: 'Tilted Right',
    src: tiltedRight,
    deviceRotation: [-10, 0, -20],
    cameraRotation: [0, 20],
  },
];

export default presets;
