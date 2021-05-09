import { Helmet } from 'react-helmet';
import Intro from './Intro';
import deviceModels from 'components/Model/deviceModels';
import iphone11 from 'assets/iphone-11.glb';
import './Home.css';

const Home = () => (
  <div className="home">
    <Helmet>
      <title>Device Models</title>
      <meta
        name="description"
        content="Create 3D device mockups from your layers in Figma. Choose a model, set a camera angle, and change device color."
      />
      <link rel="prefetch" href={iphone11} as="fetch" crossorigin="" />
    </Helmet>
    <Intro
      buttons
      title="Device Models"
      description="Create 3D device mockups from your layers in Figma. Choose a model, set a camera angle, and change device color."
      alt="Phone models"
      models={[
        {
          ...deviceModels.iphone11,
          position: { x: -1.2, y: -0.4, z: 0.1 },
          rotation: { x: -0.4, y: 0.4, z: 0.2 },
        },
        {
          ...deviceModels.iphone12,
          position: { x: 0.6, y: 0.4, z: 1.2 },
          rotation: { x: 0, y: -0.6, z: -0.2 },
        },
      ]}
    />
  </div>
);

export default Home;
