import { createContext, useMemo, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import useTheme from './useTheme';
import { theme, tokens } from './theme';
import { usePrefersColorScheme } from 'hooks';
import { media } from 'utils/style';
import InterRegular from 'assets/fonts/inter-regular.woff2';
import InterMedium from 'assets/fonts/inter-medium.woff2';
import InterBold from 'assets/fonts/inter-bold.woff2';

export const fontStyles = `
  @font-face {
    font-family: "Inter";
    font-weight: 400;
    src: url(${InterRegular}) format("woff");
    font-display: swap;
  }

  @font-face {
    font-family: "Inter";
    font-weight: 500;
    src: url(${InterMedium}) format("woff");
    font-display: swap;
  }

  @font-face {
    font-family: "Inter";
    font-weight: 700;
    src: url(${InterBold}) format("woff2");
    font-display: swap;
  }
`;

const ThemeContext = createContext({});

const ThemeProvider = ({
  themeId,
  theme: themeOverrides,
  children,
  className,
  as: Component = 'div',
  inline,
}) => {
  const colorScheme = usePrefersColorScheme();
  const currentTheme = useMemo(() => {
    return { ...theme[colorScheme || themeId], ...themeOverrides };
  }, [colorScheme, themeId, themeOverrides]);
  const parentTheme = useTheme();
  const isRootProvider = inline || !parentTheme.themeId;

  // Save root theme id to localstorage and apply class to body
  useEffect(() => {
    if (isRootProvider) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(currentTheme.themeId);
    }
  }, [isRootProvider, currentTheme]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {/* Add fonts and base tokens for the root provider */}
      {isRootProvider && (
        <Fragment>
          {inline && (
            <Helmet>
              <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Roboto+Mono&amp;display=swap"
                rel="stylesheet"
              />
              <style>{tokenStyles}</style>
            </Helmet>
          )}
          {!inline && (
            <Helmet>
              <link rel="preload" href={InterRegular} as="font" crossorigin="" />
              <link rel="preload" href={InterMedium} as="font" crossorigin="" />
              <link rel="preload" href={InterBold} as="font" crossorigin="" />
              <style>{fontStyles}</style>
              <style>{tokenStyles}</style>
            </Helmet>
          )}
          {children}
        </Fragment>
      )}
      {/* Nested providers need a div to override theme tokens */}
      {!isRootProvider && (
        <Component
          className={classNames('theme-provider', className)}
          style={createThemeStyleObject(currentTheme)}
        >
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  );
};

/**
 * Transform theme token objects into CSS custom property strings
 */
function createThemeProperties(theme) {
  return Object.keys(theme)
    .filter(key => key !== 'themeId')
    .map(key => `--${key}: ${theme[key]};`)
    .join('\n');
}

/**
 * Transform theme tokens into a React CSSProperties object
 */
function createThemeStyleObject(theme) {
  let style = {};

  for (const key of Object.keys(theme)) {
    if (key !== 'themeId') {
      style[`--${key}`] = theme[key];
    }
  }

  return style;
}

/**
 * Generate media queries for tokens
 */
function createMediaTokenProperties() {
  return Object.keys(media)
    .map(key => {
      return `
        @media (max-width: ${media[key]}px) {
          :root {
            ${createThemeProperties(tokens[key])}
          }
        }
      `;
    })
    .join('\n');
}

export const tokenStyles = `
  :root {
    ${createThemeProperties(tokens.base)}
  }

  .dark {
    ${createThemeProperties(theme.dark)}
  }

  .light {
    ${createThemeProperties(theme.light)}
  }

  ${createMediaTokenProperties()}
`;

export {
  theme,
  useTheme,
  ThemeContext,
  createThemeProperties,
  createThemeStyleObject,
  createMediaTokenProperties,
};

export default ThemeProvider;
