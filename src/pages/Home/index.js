import Helmet from 'react-helmet';
import iphone from 'assets/iphone.glb';
import macbook from 'assets/macbook.glb';

const Home = () => (
  <Helmet>
    <title>Device Models</title>
    <meta
      name="description"
      content="Create mockups with 3D device models. Customize the color, camera angle, and device model for your mockups. Includes models for the iPhone and Macbook Pro, with more models on the way for other devices."
    />
    <link rel="prefetch" href={iphone} as="fetch" crossorigin="" />
    <link rel="prefetch" href={macbook} as="fetch" crossorigin="" />
  </Helmet>
);

export default Home;
