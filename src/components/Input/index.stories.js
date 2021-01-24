import Input from 'components/Input';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Input',
};

export const input = () => (
  <StoryContainer>
    <Input label="Default Input" value="Default Input" />
    <Input icon="check" label="With Icon" value="With Icon" />
  </StoryContainer>
);
