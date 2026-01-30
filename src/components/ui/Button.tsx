import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'danger'
  size?: 'default' | 'small' | 'sm' | 'xs'
  iconOnly?: boolean
  loading?: boolean
  fixedWidth?: number
}

const variantClassMap: Record<NonNullable<Props['variant']>, string> = {
  primary: 'btnPrimary',
  secondary: 'btnSecondary',
  ghost: 'btnGhost',
  link: 'btnLink',
  danger: 'btnDanger',
}

const sizeClassMap: Record<NonNullable<Props['size']>, string> = {
  default: '',
  small: 'btnSmall',
  sm: 'btnSm',
  xs: 'btnXs',
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'secondary', size = 'default', iconOnly, loading, fixedWidth, className = '', children, style, ...rest }, ref) => {
    const variantClass = variantClassMap[variant]
    const sizeClass = sizeClassMap[size]

    const cls = iconOnly
      ? `btn btnIcon ${variantClass} ${sizeClass} ${className}`.trim()
      : `btn ${variantClass} ${sizeClass} ${className}`.trim()

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
