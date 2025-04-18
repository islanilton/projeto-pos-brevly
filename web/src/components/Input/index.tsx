import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
}

export function Input({ label, error, success, className, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <input
        id={inputId}
        className={`
          block w-full
          px-4 py-3
          rounded-md
          border
          shadow-sm
          focus:outline-none
          sm:text-sm
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : success
              ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
} 