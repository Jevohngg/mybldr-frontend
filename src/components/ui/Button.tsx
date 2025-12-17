type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  iconOnly?: boolean
}

export default function Button({ variant = 'secondary', iconOnly, className = '', ...rest }: Props) {
  const cls =
    iconOnly
      ? `btn btnIcon ${className}`
      : `btn ${variant === 'primary' ? 'btnPrimary' : variant === 'ghost' ? 'btnGhost' : 'btnSecondary'} ${className}`
  return <button className={cls} {...rest} />
}
