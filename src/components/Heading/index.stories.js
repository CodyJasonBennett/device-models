import Heading from 'components/Heading';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Heading',
};

export const level = () => (
  <StoryContainer vertical>
    <Heading level={0}>Heading 0</Heading>
    <Heading level={1}>Heading 1</Heading>
    <Heading level={2}>Heading 2</Heading>
    <Heading level={3}>Heading 3</Heading>
    <Heading level={4}>Heading 4</Heading>
  </StoryContainer>
);

export const weight = () => (
  <StoryContainer vertical>
    <Heading level={3} weight="regular">
      Regular
    </Heading>
    <Heading level={3} weight="medium">
      Medium
    </Heading>
    <Heading level={3} weight="bold">
      Bold
    </Heading>
  </StoryContainer>
);

export const align = () => (
  <StoryContainer vertical stretch>
    <Heading level={3} align="start">
      Start
    </Heading>
    <Heading level={3} align="center">
      Center
    </Heading>
  </StoryContainer>
);
