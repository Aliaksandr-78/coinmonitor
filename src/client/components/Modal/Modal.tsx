import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains('background-overlay')) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={handleBackgroundClick}
    >
      <div className="absolute inset-0 bg-gray-900 opacity-70 background-overlay"></div>

      <div className="relative bg-white text-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md z-10 transition-transform transform-gpu scale-95 animate-modal-fade-in">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-lg"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
