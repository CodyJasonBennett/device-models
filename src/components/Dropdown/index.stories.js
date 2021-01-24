import { action } from '@storybook/addon-actions';
import Dropdown from 'components/Dropdown';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Dropdown',
};

export const dropdown = () => (
  <StoryContainer>
    <Dropdown
      options={['Dropdown', 'Value 1', 'Value 2', 'Value 3']}
      onChange={action('changed')}
    />
  </StoryContainer>
);
