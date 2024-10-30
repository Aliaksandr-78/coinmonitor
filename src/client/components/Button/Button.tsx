interface ButtonProps {
    onClick?: () => void
    children: React.ReactNode
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    ariaLabel?: string
}

const Button: React.FC<ButtonProps> = ({ 
    onClick, 
    children, 
    className = '', 
    disabled = false, 
    type = 'button', 
    ariaLabel 
}) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-md font-display text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 disabled:bg-blue-200 disabled:text-blue-600 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
            disabled={disabled}
            type={type}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    )
}

export default Button
