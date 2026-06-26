import { useState, useRef } from 'react'

function DropZone({ onDrop, disabled, children }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef(null)

  function handleDragOver(e) {
    e.preventDefault()
    if (!disabled) setIsDragActive(true)
  }

  function handleDragLeave() {
    setIsDragActive(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragActive(false)
    if (disabled) return
    onDrop(Array.from(e.dataTransfer.files))
  }

  function handleChange(e) {
    onDrop(Array.from(e.target.files))
    e.target.value = ''
  }

  return (
    <div
      className={`drop-zone${isDragActive ? ' drop-zone--active' : ''}${disabled ? ' drop-zone--disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="Área de upload"
    >
      <input
        ref={inputRef}
        type="file"
        className="drop-zone__input"
        onChange={handleChange}
        disabled={disabled}
        accept=".txt,.pdf"
        multiple
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export default DropZone
