import Model from 'components/Model';
import { StoryContainer } from '../../../.storybook/StoryContainer';
import deviceModels from './deviceModels';

export default {
  title: 'Model',
};

const modelStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 };

export const phone = () => (
  <StoryContainer padding={0}>
    <Model
      style={modelStyle}
      cameraPosition={{ x: 0, y: 0, z: 11.5 }}
      alt="Phone models"
      models={[
        {
          ...deviceModels.iphone11,
          position: { x: -0.6, y: 0.8, z: 0.1 },
        },
        {
          ...deviceModels.iphone11,
          position: { x: 0.6, y: -0.8, z: 0.4 },
        },
      ]}
    />
  </StoryContainer>
);

export const laptop = () => (
  <StoryContainer padding={0}>
    <Model style={modelStyle} alt="Laptop Model" models={[deviceModels.macbookPro]} />
  </StoryContainer>
);
