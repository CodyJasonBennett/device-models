import { useRef, useState } from 'react';
import Tooltip from 'components/Tooltip';
import { StoryContainer } from '../../../.storybook/StoryContainer';

const TooltipWrapper = props => {
  const parent = useRef();
  const [visible, setVisible] = useState(false);

  return (
    <StoryContainer>
      <p
        ref={parent}
        onMouseOver={() => setVisible(true)}
        onFocus={() => setVisible(true)}
        onMouseOut={() => setVisible(false)}
        onBlur={() => setVisible(false)}
        style={{ cursor: 'help' }}
      >
        Hover
      </p>
      <Tooltip visible={visible} parent={parent} {...props} />
    </StoryContainer>
  );
};

export default {
  title: 'Tooltip',
};

export const normal = () => <TooltipWrapper>Normal</TooltipWrapper>;

export const top = () => <TooltipWrapper top>Top</TooltipWrapper>;

export const bottom = () => <TooltipWrapper bottom>Bottom</TooltipWrapper>;
