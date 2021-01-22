import { useRef } from 'react';
import Device from 'components/Device';
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

const DevicePreview = ({ color = '#FFFFFF', ...rest }) => {
  const ref = useRef();

  return (
    <StoryContainer padding={0}>
      <div style={style}>
        <Device ref={ref} color="#FFFFFF" {...rest} />
      </div>
    </StoryContainer>
  );
};

export default {
  title: 'Devices',
};

export const phone = () => <DevicePreview device="iPhone" texture={iphoneTexture} />;
export const laptop = () => <DevicePreview device="Macbook" texture={macbookTexture} />;
