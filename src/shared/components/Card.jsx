import styles from './Card.module.css'

export default function Card({ children, elevated = false, padded = false, onClick, className = '', ...props }) {
  const classes = [
    styles.card,
    elevated ? styles.elevated : '',
    padded ? styles.padded : '',
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  function handleClick(e) {
    if (e.target.closest('button, a, input, select, textarea')) return
    onClick(e)
  }

  return (
    <div
      className={classes}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && handleClick(e) : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`${styles.header} ${className}`} {...props}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`${styles.body} ${className}`} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`${styles.footer} ${className}`} {...props}>
      {children}
    </div>
  )
}
