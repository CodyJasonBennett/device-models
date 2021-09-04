import iphone11 from 'assets/iphone-11.glb';
import iphone11Texture from 'assets/iphone-11.jpg';
import iphone11FrontLeft from 'assets/iphone-11-front-left.png';
import iphone11Front from 'assets/iphone-11-front.png';
import iphone11FrontRight from 'assets/iphone-11-front-right.png';
import iphone11TiltedLeft from 'assets/iphone-11-tilted-left.png';
import iphone11TiltedRight from 'assets/iphone-11-tilted-right.png';
import iphone12 from 'assets/iphone-12.glb';
import iphone12Texture from 'assets/iphone-12.jpg';
import iphone12FrontLeft from 'assets/iphone-12-front-left.png';
import iphone12Front from 'assets/iphone-12-front.png';
import iphone12FrontRight from 'assets/iphone-12-front-right.png';
import iphone12TiltedLeft from 'assets/iphone-12-tilted-left.png';
import iphone12TiltedRight from 'assets/iphone-12-tilted-right.png';
import macbookPro from 'assets/macbook-pro.glb';
import macbookProTexture from 'assets/macbook-pro.jpg';
import macbookProFrontLeft from 'assets/macbook-pro-front-left.png';
import macbookProFront from 'assets/macbook-pro-front.png';
import macbookProFrontRight from 'assets/macbook-pro-front-right.png';
import macbookProTiltedLeft from 'assets/macbook-pro-tilted-left.png';
import macbookProTiltedRight from 'assets/macbook-pro-tilted-right.png';
import iMac2021 from 'assets/imac-2021.glb';
import iMac2021Texture from 'assets/imac-2021.jpg';
import iMac2021FrontLeft from 'assets/imac-2021-front-left.png';
import iMac2021Front from 'assets/imac-2021-front.png';
import iMac2021FrontRight from 'assets/imac-2021-front-right.png';
import iMac2021TiltedLeft from 'assets/imac-2021-tilted-left.png';
import iMac2021TiltedRight from 'assets/imac-2021-tilted-right.png';
import iMacPro from 'assets/imac-pro.glb';
import iMacProTexture from 'assets/imac-pro.jpg';
import iMacProFrontLeft from 'assets/imac-pro-front-left.png';
import iMacProFront from 'assets/imac-pro-front.png';
import iMacProFrontRight from 'assets/imac-pro-front-right.png';
import iMacProTiltedLeft from 'assets/imac-pro-tilted-left.png';
import iMacProTiltedRight from 'assets/imac-pro-tilted-right.png';
import iPadAir from 'assets/ipad-air.glb';
import iPadAirTexture from 'assets/ipad-air.jpg';
import iPadAirFrontLeft from 'assets/ipad-air-front-left.png';
import iPadAirFront from 'assets/ipad-air-front.png';
import iPadAirFrontRight from 'assets/ipad-air-front-right.png';
import iPadAirTiltedLeft from 'assets/ipad-air-tilted-left.png';
import iPadAirTiltedRight from 'assets/ipad-air-tilted-right.png';

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
};

const models = {
  'iPhone 11': {
    name: 'iPhone 11',
    url: iphone11,
    width: 375,
    height: 812,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
    texture: iphone11Texture,
    renders: [
      iphone11FrontLeft,
      iphone11Front,
      iphone11FrontRight,
      iphone11TiltedLeft,
      iphone11TiltedRight,
    ],
  },
  'iPhone 12': {
    name: 'iPhone 12',
    url: iphone12,
    width: 530,
    height: 1148,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
    texture: iphone12Texture,
    renders: [
      iphone12FrontLeft,
      iphone12Front,
      iphone12FrontRight,
      iphone12TiltedLeft,
      iphone12TiltedRight,
    ],
  },
  'Macbook Pro': {
    name: 'Macbook Pro',
    url: macbookPro,
    width: 1280,
    height: 800,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.LaptopOpen,
    texture: macbookProTexture,
    renders: [
      macbookProFrontLeft,
      macbookProFront,
      macbookProFrontRight,
      macbookProTiltedLeft,
      macbookProTiltedRight,
    ],
  },
  'iMac 2021': {
    name: 'iMac 2021',
    url: iMac2021,
    width: 2240,
    height: 1260,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
    texture: iMac2021Texture,
    renders: [
      iMac2021FrontLeft,
      iMac2021Front,
      iMac2021FrontRight,
      iMac2021TiltedLeft,
      iMac2021TiltedRight,
    ],
  },
  'iMac Pro': {
    name: 'iMac Pro',
    url: iMacPro,
    width: 2560,
    height: 1440,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
    texture: iMacProTexture,
    renders: [
      iMacProFrontLeft,
      iMacProFront,
      iMacProFrontRight,
      iMacProTiltedLeft,
      iMacProTiltedRight,
    ],
  },
  'iPad Air': {
    name: 'iPad Air',
    url: iPadAir,
    width: 820,
    height: 1180,
    color: 0xffffff,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
    texture: iPadAirTexture,
    renders: [
      iPadAirFrontLeft,
      iPadAirFront,
      iPadAirFrontRight,
      iPadAirTiltedLeft,
      iPadAirTiltedRight,
    ],
  },
};

export default models;
