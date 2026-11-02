import React from 'react';
import { StoryFn } from '@storybook/react';
import { HelpBlock } from './help-block';
import { HelpBlockProps } from './types';

const story = {
  title: 'Example/HelpBlock',
  component: HelpBlock,
  parameters: {
    controls: {
      include: ['className', 'children']
    }
  }
};

const Template: StoryFn<HelpBlockProps> = args => {
  return <HelpBlock {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  children: 'This is a HelpBlock'
};

export default story;
