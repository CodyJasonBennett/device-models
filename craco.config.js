const postcssOptions = require('./postcss.config');

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      ...postcssOptions,
    },
  },
};
