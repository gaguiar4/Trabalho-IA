const sizes = {
  sm: 'spinner spinner--sm',
  md: 'spinner spinner--md',
  lg: 'spinner spinner--lg',
}

function Spinner({ size = 'md', color }) {
  return (
    <span
      className={sizes[size] || sizes.md}
      style={color ? { borderTopColor: color } : undefined}
      role="status"
      aria-label="Carregando"
    />
  )
}

export default Spinner
