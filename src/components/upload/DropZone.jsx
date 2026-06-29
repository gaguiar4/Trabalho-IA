import { useState, useRef, Children } from 'react'

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

  function openFileDialog() {
    if (!disabled) inputRef.current?.click()
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
      onClick={openFileDialog}
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
      {Children.count(children) === 0 ? (
        <p className="drop-zone__placeholder">Arraste um arquivo .txt ou .pdf</p>
      ) : (
        children
      )}
    </div>
  )
}

export default DropZone
