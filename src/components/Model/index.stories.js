import { useRef } from 'react';
import Model from 'components/Model';
import { StoryContainer } from '../../../.storybook/StoryContainer';
import iphoneTexture from 'assets/iphone-preview.jpg';
import macbookTexture from 'assets/macbook-preview.jpg';

const style = {
  display: 'grid',
  gridTemplateColumns: '100%',
  gridTemplateRows: '100%',
  gridColumn: '1',
  gridRow: '1',
  width: '100%',
  height: '100%',
};

const ModelPreview = ({ color = '#FFFFFF', ...rest }) => {
  const ref = useRef();

  return (
    <StoryContainer padding={0}>
      <div style={style}>
        <Model ref={ref} color="#FFFFFF" {...rest} />
      </div>
    </StoryContainer>
  );
};

export default {
  title: 'Model',
};

export const phone = () => <ModelPreview device="iPhone" texture={iphoneTexture} />;
export const laptop = () => <ModelPreview device="Macbook" texture={macbookTexture} />;
