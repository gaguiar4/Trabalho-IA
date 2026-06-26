import Button from './Button.jsx'

const variants = {
  inline: 'error-message error-message--inline',
  full: 'error-message error-message--full',
}

function ErrorMessage({ message, onRetry, variant = 'inline' }) {
  return (
    <div className={variants[variant] || variants.inline} role="alert">
      <p className="error-message__text">{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry} ariaLabel="Tentar novamente">Tentar novamente</Button>}
    </div>
  )
}

export default ErrorMessage
