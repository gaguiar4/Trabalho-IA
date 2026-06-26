import Spinner from './Spinner.jsx'

const variants = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost',
}

function Button({ children, variant = 'primary', onClick, disabled = false, type = 'button', ariaLabel, isLoading = false }) {
  return (
    <button
      type={type}
      className={variants[variant] || variants.primary}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  )
}

export default Button
