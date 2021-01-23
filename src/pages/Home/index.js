import { lazy, useRef, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import Icon from 'components/Icon';
import Heading from 'components/Heading';
import Text from 'components/Text';
import Button from 'components/Button';
import Link from 'components/Link';
import { useWindowSize } from 'hooks';
import { media } from 'utils/style';
import prerender from 'utils/prerender';
import socials from './socials';
import deviceModels from 'components/Model/deviceModels';
import iphone11 from 'assets/iphone-11.glb';
import macbookPro from 'assets/macbook-pro.glb';
import phoneTexture from 'assets/phone-texture.jpg';
import phoneTextureLarge from 'assets/phone-texture-large.jpg';
import phoneTexturePlaceholder from 'assets/phone-texture-placeholder.jpg';
import './index.css';

const Model = lazy(() => import('components/Model'));

const Home = () => {
  const canvas = useRef();
  const { width } = useWindowSize();
  const isMobile = width <= media.tablet;
  const size = isMobile ? 48 : 96;

  return (
    <div className="home">
      <Helmet>
        <title>Device Models</title>
        <meta
          name="description"
          content="Create mockups with 3D device models. Customize the color, camera angle, and device model for your mockups. Includes models for the iPhone and Macbook Pro, with more models on the way for other devices."
        />
        <link rel="prefetch" href={iphone11} as="fetch" crossorigin="" />
        <link rel="prefetch" href={macbookPro} as="fetch" crossorigin="" />
      </Helmet>
      <section className="intro">
        <div className="intro__text">
          <Icon className="intro__logo" icon="logo" width={size} height={size} />
          <Heading className="intro__title" level={2} weight="bold">
            Device Models
          </Heading>
          <Text className="intro__description" size="xl" weight="medium">
            Create 3D device mockups from your layers in Figma. Choose a model, set a
            camera angle, and change device color.
          </Text>
          <div className="intro__buttons">
            <Link
              secondary
              href="https://www.figma.com/community/plugin/906973799344127422"
              aria-label="Install to Figma"
            >
              <Button primary>Install to Figma</Button>
            </Link>
            <div className="intro__socials">
              {socials.map(({ href, icon, label }) => (
                <Link key={icon} secondary href={href} aria-label={label}>
                  <Button iconOnly icon={icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        {!prerender && (
          <Suspense fallback={null}>
            <Model
              ref={canvas}
              className="intro__models"
              cameraPosition={{ x: 0, y: 0, z: 10 }}
              controls={{ enableZoom: false, enableDamping: true }}
              alt="Phone models"
              models={[
                {
                  ...deviceModels.iphone11,
                  position: { x: -1.2, y: -0.4, z: 0.1 },
                  rotation: { x: -0.4, y: 0.4, z: 0.2 },
                  texture: {
                    src: phoneTexture,
                    srcSet: `${phoneTexture} 800w, ${phoneTextureLarge} 1440w`,
                    placeholder: phoneTexturePlaceholder,
                  },
                },
                {
                  ...deviceModels.iphone11,
                  position: { x: 0.6, y: 0.4, z: 1.2 },
                  rotation: { x: 0, y: -0.6, z: -0.2 },
                  texture: {
                    src: phoneTexture,
                    srcSet: `${phoneTexture} 800w, ${phoneTextureLarge} 1440w`,
                    placeholder: phoneTexturePlaceholder,
                  },
                },
              ]}
            />
          </Suspense>
        )}
      </section>
    </div>
  );
};

export default Home;
