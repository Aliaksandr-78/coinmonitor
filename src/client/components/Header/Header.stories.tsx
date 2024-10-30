import { Meta, StoryFn } from '@storybook/react'
import Header from './Header'

export default {
  title: 'Components/Header',
  component: Header,
} as Meta

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />

export const Default = Template.bind({})
Default.args = {}
