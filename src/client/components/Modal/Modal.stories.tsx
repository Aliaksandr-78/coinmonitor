import Modal from './Modal'

export default {
  title: 'Components/Modal',
  component: Modal,
}

export const Default = () => (
  <Modal isOpen={true} onClose={() => console.log('Modal закрыт')}>
    <div className="p-4">
      <h2 className="text-lg font-bold">Содержимое модального окна</h2>
      <p>Это пример содержимого модального окна.</p>
    </div>
  </Modal>
)
