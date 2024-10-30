import { useState } from 'react'
import Input from './Input'

export default {
  title: 'Components/Input',
  component: Input,
}

export const Default = () => {
  const [value, setValue] = useState('')

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Введите текст..."
    />
  )
}
