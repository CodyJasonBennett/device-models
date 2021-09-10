import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Scene from 'components/Scene';

const Home = () => (
  <Fragment>
    <Helmet>
      <title>Device Models</title>
      <meta
        name="description"
        content="Create 3D device mockups from your layers in Figma. Choose a model, set a camera angle, and change device color."
      />
    </Helmet>
    <Scene />
  </Fragment>
);

export default Home;
