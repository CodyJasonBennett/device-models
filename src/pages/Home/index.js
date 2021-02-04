import { lazy, useRef, Fragment, Suspense } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { Transition } from 'react-transition-group';
import Icon from 'components/Icon';
import Heading from 'components/Heading';
import Text from 'components/Text';
import Button from 'components/Button';
import Link from 'components/Link';
import { tokens } from 'components/ThemeProvider/theme';
import { useWindowSize } from 'hooks';
import { media, msToNum } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import socials from './socials';
import deviceModels from 'components/Model/deviceModels';
import iphone11 from 'assets/iphone-11.glb';
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
      </Helmet>
      <section className="intro">
        <Transition appear={!prerender} in={!prerender} timeout={0} onEnter={reflow}>
          {status => (
            <Fragment>
              <div className="intro__text">
                <Icon
                  className={classNames('intro__logo', `intro__logo--${status}`)}
                  icon="logo"
                  width={size}
                  height={size}
                />
                <Heading
                  className={classNames('intro__title', `intro__title--${status}`)}
                  level={2}
                  weight="bold"
                >
                  Device Models
                </Heading>
                <Text
                  className={classNames(
                    'intro__description',
                    `intro__description--${status}`
                  )}
                  size="xl"
                  weight="medium"
                >
                  Create 3D device mockups from your layers in Figma. Choose a model, set
                  a camera angle, and change device color.
                </Text>
                <div
                  className={classNames('intro__buttons', `intro__buttons--${status}`)}
                >
                  <Link
                    secondary
                    href="https://www.figma.com/community/plugin/906973799344127422"
                    aria-label="Install to Figma"
                  >
                    <Button primary>Install to Figma</Button>
                  </Link>
                  <div className="intro__socials">
                    {socials.map(({ href, icon, label }, index) => (
                      <Link
                        secondary
                        key={href}
                        href={href}
                        style={{ '--index': index }}
                        className={classNames(
                          'intro__social',
                          `intro__social--${status}`
                        )}
                      >
                        <Button iconOnly icon={icon} aria-label={label} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {!prerender && (
                <Suspense fallback={null}>
                  <Model
                    animated
                    ref={canvas}
                    showDelay={msToNum(tokens.base.durationXL)}
                    className="intro__models"
                    cameraPosition={{ x: 0, y: 0, z: isMobile ? 9 : 10 }}
                    controls={{
                      enableZoom: false,
                      enablePan: false,
                      enableDamping: true,
                      maxPolarAngle: Math.PI / 2,
                      minPolarAngle: Math.PI / 2,
                    }}
                    alt="Phone models"
                    models={[
                      {
                        ...deviceModels.iphone11,
                        position: { x: -1.2, y: -0.4, z: 0.1 },
                        rotation: { x: -0.4, y: 0.4, z: 0.2 },
                      },
                      {
                        ...deviceModels.iphone11,
                        position: { x: 0.6, y: 0.4, z: 1.2 },
                        rotation: { x: 0, y: -0.6, z: -0.2 },
                      },
                    ]}
                  />
                </Suspense>
              )}
            </Fragment>
          )}
        </Transition>
      </section>
    </div>
  );
};

export default Home;
