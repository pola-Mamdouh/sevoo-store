
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled,
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-(--radius-button)"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/95",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20 active:bg-secondary/15",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10",
    danger: "bg-danger text-white hover:bg-danger/90 active:bg-danger/95",
    ghost: "text-text-muted hover:bg-gray-100 active:bg-gray-200",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button