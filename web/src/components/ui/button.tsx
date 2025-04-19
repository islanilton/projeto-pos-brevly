import type { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({
  children,
  asChild,
  isLoading,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const baseStyles = `
    inline-flex items-center justify-center
    rounded-md
    font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
  }

  const variantStyles = {
    primary: `
      text-white
      bg-[#2B6CB0]
      hover:bg-[#2C5282]
      focus:ring-[#2B6CB0]
    `,
    secondary: `
      text-[#2B6CB0]
      bg-white
      border border-[#2B6CB0]
      hover:bg-[#EBF8FF]
      focus:ring-[#2B6CB0]
    `,
    ghost: `
      text-gray-600
      hover:bg-gray-100
      focus:ring-gray-500
    `,
  }

  return (
    <Comp
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </Comp>
  )
} 