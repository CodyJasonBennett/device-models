import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Intro from './Intro';
import iphone11 from 'assets/iphone-11.glb';
import iphone12 from 'assets/iphone-12.glb';

const Home = () => (
  <Fragment>
    <Helmet>
      <title>Device Models</title>
      <meta
        name="description"
        content="Create 3D device mockups from your layers in Figma. Choose a model, set a camera angle, and change device color."
      />
      <link rel="prefetch" href={iphone11} as="fetch" crossorigin="" />
      <link rel="prefetch" href={iphone12} as="fetch" crossorigin="" />
    </Helmet>
    <Intro
      buttons
      title="Device Models"
      description="Create 3D device mockups from your layers in Figma. Choose a model, set a camera angle, and change device color."
    />
  </Fragment>
);

export default Home;
