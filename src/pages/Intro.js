import { Fragment, Suspense, useEffect } from 'react';
import classNames from 'classnames';
import { sRGBEncoding, Color } from 'three';
import { animated, useSpring } from '@react-spring/three';
import { Transition } from 'react-transition-group';
import { useThree, Canvas } from '@react-three/fiber';
import { useGLTF, useTexture, OrbitControls } from '@react-three/drei';
import Icon from 'components/Icon';
import Heading from 'components/Heading';
import Text from 'components/Text';
import Button from 'components/Button';
import Link from 'components/Link';
import { useWindowSize } from 'hooks';
import { media } from 'utils/style';
import { reflow } from 'utils/transition';
import deviceModels from 'components/Scene/deviceModels';
import prerender from 'utils/prerender';
import socials from './socials';
import './Intro.css';

const IntroModel = ({ model, position, delay, ...rest }) => {
  const { url, texture } = deviceModels[model];
  const { gl } = useThree();
  const { scene } = useGLTF(url);
  const image = useTexture(texture);

  const [x, y, z] = position;
  const spring = useSpring({
    delay,
    config: {
      tension: 120,
      friction: 26,
    },
    from: { position: [x, y - 6, z] },
    to: { position: [x, y, z] },
  });

  useEffect(() => {
    scene.traverse(node => {
      if (node.name === 'Screen') {
        image.encoding = sRGBEncoding;
        image.flipY = false;
        image.anisotropy = gl.capabilities.getMaxAnisotropy();

        // Decode the texture to prevent jank on first render
        gl.initTexture(image);

        node.material.color = new Color(0xffffff);
        node.material.transparent = false;
        node.material.map = image;
        node.material.needsUpdate = true;
      }
    });
  }, [scene, image, gl]);

  return <animated.primitive {...spring} object={scene} {...rest} />;
};

const IntroScene = ({ isMobile }) => {
  return (
    <div className="intro__models">
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        camera={{ position: [0, 0, isMobile ? 9 : 10], fov: 36 }}
        style={{ position: 'absolute' }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => (gl.physicallyCorrectLights = true)}
      >
        <Suspense fallback={null}>
          <IntroModel
            delay={800}
            model="iPhone 11"
            position={[-1.2, -0.4, 0.1]}
            rotation={[-0.4, 0.4, 0.2]}
          />
          <IntroModel
            delay={900}
            model="iPhone 12"
            position={[0.6, 0.4, 1.2]}
            rotation={[0, -0.6, -0.2]}
          />
        </Suspense>
        <ambientLight intensity={1.2} />
        <directionalLight intensity={1.1} position={[0.5, 0, 0.866]} />
        <directionalLight intensity={0.8} position={[-6, 2, 2]} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.3}
          maxPolarAngle={Math.PI / 2.3}
        />
      </Canvas>
    </div>
  );
};

const Intro = ({ center, title, description, buttons, children, models }) => {
  const { width } = useWindowSize();
  const isMobile = width <= media.tablet;
  const size = isMobile ? 48 : 96;

  return (
    <section className={classNames('intro', { 'intro--center': center })}>
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
              {title && (
                <Heading
                  className={classNames('intro__title', `intro__title--${status}`)}
                  level={2}
                  weight="bold"
                >
                  {title}
                </Heading>
              )}
              {description && (
                <Text
                  className={classNames(
                    'intro__description',
                    `intro__description--${status}`
                  )}
                  size="xl"
                  weight="medium"
                >
                  {description}
                </Text>
              )}
              <div className={classNames('intro__content', `intro__content--${status}`)}>
                {buttons && (
                  <div className="intro__buttons">
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
                )}
                {children}
              </div>
            </div>
            {!prerender && <IntroScene isMobile={isMobile} />}
          </Fragment>
        )}
      </Transition>
    </section>
  );
};

export default Intro;
