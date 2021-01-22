import iphoneModel from 'assets/iphone.glb';
import macbookModel from 'assets/macbook.glb';
import iphoneTexture from 'assets/iphone-preview.jpg';
import iphoneFrontLeft from 'assets/iphone-front-left.png';
import iphoneFront from 'assets/iphone-front.png';
import iphoneFrontRight from 'assets/iphone-front-right.png';
import iphoneTiltedLeft from 'assets/iphone-tilted-left.png';
import iphoneTiltedRight from 'assets/iphone-tilted-right.png';
import macbookTexture from 'assets/macbook-preview.jpg';
import macbookFrontLeft from 'assets/macbook-front-left.png';
import macbookFront from 'assets/macbook-front.png';
import macbookFrontRight from 'assets/macbook-front-right.png';
import macbookTiltedLeft from 'assets/macbook-tilted-left.png';
import macbookTiltedRight from 'assets/macbook-tilted-right.png';

const devices = [
  {
    name: 'iPhone',
    url: iphoneModel,
    texture: iphoneTexture,
    width: 375,
    height: 812,
    renders: [
      iphoneFrontLeft,
      iphoneFront,
      iphoneFrontRight,
      iphoneTiltedLeft,
      iphoneTiltedRight,
    ],
  },
  {
    name: 'Macbook',
    url: macbookModel,
    texture: macbookTexture,
    width: 1280,
    height: 800,
    renders: [
      macbookFrontLeft,
      macbookFront,
      macbookFrontRight,
      macbookTiltedLeft,
      macbookTiltedRight,
    ],
  },
];

export default devices;
