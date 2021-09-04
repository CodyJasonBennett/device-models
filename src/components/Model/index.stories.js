import { useRef } from 'react';
import Model from 'components/Model';
import { StoryContainer } from '../../../.storybook/StoryContainer';
import deviceModels from './deviceModels';

const modelStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 };

const ModelWrapper = props => {
  const canvas = useRef();

  return (
    <StoryContainer padding={0}>
      <Model animated ref={canvas} style={modelStyle} {...props} />
    </StoryContainer>
  );
};

export default {
  title: 'Model',
};

export const phone = () => (
  <ModelWrapper
    cameraPosition={{ x: 0, y: 0, z: 10 }}
    alt="Phone Models"
    models={[
      {
        ...deviceModels['iPhone 11'],
        position: { x: -1.2, y: -0.4, z: 0.1 },
        rotation: { x: -0.4, y: 0.4, z: 0.2 },
      },
      {
        ...deviceModels['iPhone 11'],
        position: { x: 0.6, y: 0.4, z: 1.2 },
        rotation: { x: 0, y: -0.6, z: -0.2 },
      },
    ]}
  />
);

export const laptop = () => (
  <ModelWrapper alt="Laptop Model" models={[deviceModels['Macbook Pro']]} />
);
