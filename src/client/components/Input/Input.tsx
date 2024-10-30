interface InputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
    type?: string
    name?: string
    ariaLabel?: string
    disabled?: boolean
    readOnly?: boolean
    icon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder = '',
    className = '',
    type = 'text',
    name,
    ariaLabel,
    disabled = false,
    readOnly = false,
    icon
}) => {
    return (
        <div className="relative w-full">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                name={name}
                aria-label={ariaLabel}
                disabled={disabled}
                readOnly={readOnly}
                className={`w-full rounded-md py-2 pl-${icon ? '10' : '4'} pr-4 text-sm sm:text-base leading-6 text-gray-700 placeholder-gray-500 bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ease-in-out ${className} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
        </div>
    )
}

export default Input
