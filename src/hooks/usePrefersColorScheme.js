import { useEffect, useState } from 'react';

function usePrefersColorScheme() {
  const [colorScheme, setColorScheme] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

    const handleMediaChange = () => {
      setColorScheme(mediaQuery?.matches);
    };

    mediaQuery?.addListener(handleMediaChange);
    handleMediaChange();

    return () => {
      mediaQuery?.removeListener(handleMediaChange);
    };
  }, []);

  return colorScheme ? 'dark' : 'light';
}

export default usePrefersColorScheme;
