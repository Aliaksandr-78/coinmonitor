import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
}

export const Default = () => (
  <Button className="bg-primary text-white px-4 py-2 rounded-md">
    Нажми меня
  </Button>
)

export const Disabled = () => (
  <Button className="bg-primary text-white px-4 py-2 rounded-md" disabled>
    Неактивная кнопка
  </Button>
)
