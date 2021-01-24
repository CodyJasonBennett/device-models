import iphone11 from 'assets/iphone-11.glb';
import macbookPro from 'assets/macbook-pro.glb';
import iphone11Texture from 'assets/iphone-11-preview.jpg';
import iphone11FrontLeft from 'assets/iphone-11-front-left.png';
import iphone11Front from 'assets/iphone-11-front.png';
import iphone11FrontRight from 'assets/iphone-11-front-right.png';
import iphone11TiltedLeft from 'assets/iphone-11-tilted-left.png';
import iphone11TiltedRight from 'assets/iphone-11-tilted-right.png';
import macbookProTexture from 'assets/macbook-pro-preview.jpg';
import macbookProFrontLeft from 'assets/macbook-pro-front-left.png';
import macbookProFront from 'assets/macbook-pro-front.png';
import macbookProFrontRight from 'assets/macbook-pro-front-right.png';
import macbookProTiltedLeft from 'assets/macbook-pro-tilted-left.png';
import macbookProTiltedRight from 'assets/macbook-pro-tilted-right.png';

const models = {
  iphone11: {
    name: 'iPhone 11',
    url: iphone11,
    width: 375,
    height: 812,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    texture: { src: iphone11Texture },
    renders: [
      iphone11FrontLeft,
      iphone11Front,
      iphone11FrontRight,
      iphone11TiltedLeft,
      iphone11TiltedRight,
    ],
  },
  macbookPro: {
    name: 'Macbook Pro',
    url: macbookPro,
    width: 1280,
    height: 800,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    texture: { src: macbookProTexture },
    renders: [
      macbookProFrontLeft,
      macbookProFront,
      macbookProFrontRight,
      macbookProTiltedLeft,
      macbookProTiltedRight,
    ],
  },
};

export default models;