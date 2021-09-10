import pixel6ModelPath from 'assets/Google Pixel 6.glb';
import pixel6Texture from 'assets/pixel-6.jpg';
import iPhone11ModelPath from 'assets/iPhone 11.glb';
import iPhone11Texture from 'assets/iphone-11.jpg';
import iPhone12ModelPath from 'assets/iPhone 12.glb';
import iPhone12Texture from 'assets/iphone-12.jpg';
import MacbookModelPath from 'assets/Macbook Pro.gltf';
import MacbookTexture from 'assets/macbook-pro.jpg';
import iMac2021ModelPath from 'assets/iMac 2021.glb';
import iMac2021Texture from 'assets/imac-2021.jpg';
import iMacProModelPath from 'assets/iMac Pro.glb';
import iMacProTexture from 'assets/imac-pro.jpg';
import iPadAirModelPath from 'assets/iPad Air 3.glb';
import iPadAirTexture from 'assets/ipad-air.jpg';

const models = {
  'Google Pixel 6': {
    name: 'Google Pixel 6',
    url: pixel6ModelPath,
    texture: pixel6Texture,
    width: 389,
    height: 818,
  },
  'iPhone 11': {
    name: 'iPhone 11',
    url: iPhone11ModelPath,
    texture: iPhone11Texture,
    width: 375,
    height: 812,
  },
  'iPhone 12': {
    name: 'iPhone 12',
    url: iPhone12ModelPath,
    texture: iPhone12Texture,
    width: 530,
    height: 1148,
  },
  'Macbook Pro': {
    name: 'Macbook Pro',
    url: MacbookModelPath,
    texture: MacbookTexture,
    width: 1280,
    height: 800,
  },
  'iMac 2021': {
    name: 'iMac 2021',
    url: iMac2021ModelPath,
    texture: iMac2021Texture,
    width: 2240,
    height: 1260,
  },
  'iMac Pro': {
    name: 'iMac Pro',
    url: iMacProModelPath,
    texture: iMacProTexture,
    width: 2560,
    height: 1440,
  },
  'iPad Air': {
    name: 'iPad Air',
    url: iPadAirModelPath,
    texture: iPadAirTexture,
    width: 820,
    height: 1180,
  },
};

export default models;
