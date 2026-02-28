
const Input = ({ 
  type = 'text',
  label,
  error,
  icon: Icon,
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={`
            w-full rounded-lg border bg-surface px-4 py-2.5
            ${Icon ? 'pr-10' : ''}
            ${error ? 'border-danger' : 'border-gray-200'}
            focus:border-accent focus:ring-2 focus:ring-accent/20
            outline-none transition-all
            placeholder:text-text-muted/60
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-danger flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}