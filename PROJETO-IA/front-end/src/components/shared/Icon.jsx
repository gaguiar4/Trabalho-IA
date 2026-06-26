function Icon({ name, size = 'md', ariaHidden = true }) {
  const sizes = { sm: 16, md: 24, lg: 32 }
  const dimension = sizes[size] || sizes.md

  return (
    <svg
      className={`icon icon--${name}`}
      width={dimension}
      height={dimension}
      aria-hidden={ariaHidden}
      role="img"
    >
      <use href={`/dist/opicons.svg#${name}`} />
    </svg>
  )
}

export default Icon
