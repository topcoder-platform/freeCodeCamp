import { StoryFn } from '@storybook/react';
import React from 'react';
import { CloseButton, CloseButtonProps } from './close-button';

const story = {
  title: 'Example/CloseButton',
  component: CloseButton
};

const Template: StoryFn<CloseButtonProps> = args => <CloseButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  label: ''
};

export default story;
