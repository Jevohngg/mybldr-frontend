import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'small'
  iconOnly?: boolean
  loading?: boolean
  fixedWidth?: number
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'secondary', size = 'default', iconOnly, loading, fixedWidth, className = '', children, style, ...rest }, ref) => {
    const sizeClass = size === 'small' ? 'btnSmall' : '';
    const cls =
      iconOnly
        ? `btn btnIcon ${className}`
        : `btn ${variant === 'primary' ? 'btnPrimary' : variant === 'ghost' ? 'btnGhost' : 'btnSecondary'} ${sizeClass} ${className}`.trim()

    const buttonStyle = fixedWidth ? { ...style, width: `${fixedWidth}px` } : style

    return (
      <button ref={ref} className={cls} disabled={loading || rest.disabled} style={buttonStyle} {...rest}>
        {loading ? (
          <span className="btnSpinner"></span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
