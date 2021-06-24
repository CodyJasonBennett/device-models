module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': {
          importFrom: 'src/app/index.css',
        },
      },
    }),
  ],
};
