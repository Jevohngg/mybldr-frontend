type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  iconOnly?: boolean
  loading?: boolean
}

export default function Button({ variant = 'secondary', iconOnly, loading, className = '', children, ...rest }: Props) {
  const cls =
    iconOnly
      ? `btn btnIcon ${className}`
      : `btn ${variant === 'primary' ? 'btnPrimary' : variant === 'ghost' ? 'btnGhost' : 'btnSecondary'} ${className}`
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading ? (
        <span className="btnSpinner"></span>
      ) : (
        children
      )}
    </button>
  )
}
