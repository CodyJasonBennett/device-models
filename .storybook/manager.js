import { themes } from '@storybook/theming';
import { addons } from '@storybook/addons';

addons.setConfig({
  theme: {
    ...themes.light,
    brandImage: 'https://devicemodels.com/icon.svg',
    brandTitle: 'Device Models Components',
    brandUrl: 'https://devicemodels.com',
  },
});
