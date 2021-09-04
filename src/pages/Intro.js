import { lazy, useRef, Fragment, Suspense } from 'react';
import classNames from 'classnames';
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
import './Intro.css';

const Model = lazy(() => import('components/Model'));

const Intro = ({
  center,
  title,
  description,
  buttons,
  children,
  cameraPosition,
  controls,
  alt,
  models,
}) => {
  const canvas = useRef();
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
            {models && !prerender && (
              <Suspense fallback={null}>
                <Model
                  animated
                  ref={canvas}
                  showDelay={msToNum(tokens.base.durationXL)}
                  className="intro__models"
                  controls={{
                    enableZoom: false,
                    enablePan: false,
                    enableDamping: true,
                    maxPolarAngle: Math.PI / 2,
                    minPolarAngle: Math.PI / 2,
                  }}
                  alt={alt}
                  models={models}
                  cameraPosition={{ x: 0, y: 0, z: isMobile ? 9 : 10 }}
                />
              </Suspense>
            )}
          </Fragment>
        )}
      </Transition>
    </section>
  );
};

export default Intro;
