import { action } from '@storybook/addon-actions';
import Button from 'components/Button';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Button',
};

export const normal = () => (
  <StoryContainer>
    <Button onClick={action('clicked')}>Normal</Button>
  </StoryContainer>
);

export const primary = () => (
  <StoryContainer>
    <Button primary onClick={action('clicked')}>
      Primary
    </Button>
  </StoryContainer>
);

export const grey = () => (
  <StoryContainer>
    <Button grey onClick={action('clicked')}>
      Grey
    </Button>
  </StoryContainer>
);

export const iconOnly = () => (
  <StoryContainer>
    <Button iconOnly aria-label="Check" icon="check" onClick={action('clicked')} />
  </StoryContainer>
);
