import { useState, useRef } from 'react'
import Button from '../shared/Button.jsx'
import { isValidFileType, isValidFileSize } from '../../utils/validators.js'

function MessageInput({ onSend, isDisabled, isUploading }) {
  const [text, setText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState([])
  const fileInputRef = useRef(null)

  function handleAttach() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files).filter((file) => {
      if (!isValidFileType(file)) return false
      if (!isValidFileSize(file)) return false
      return true
    })
    setAttachedFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }

  function removeFile(index) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() && attachedFiles.length === 0) return
    onSend(text.trim(), attachedFiles)
    setText('')
    setAttachedFiles([])
  }

  const canSubmit = !isDisabled && !isUploading && (text.trim() || attachedFiles.length > 0)

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="message-input__row">
        <input
          className="message-input__field"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isDisabled || isUploading}
          placeholder="Digite uma mensagem..."
          aria-label="Campo de mensagem"
        />
        <button
          type="button"
          className="message-input__attach-btn"
          onClick={handleAttach}
          disabled={isDisabled || isUploading}
          aria-label="Anexar arquivo"
          title="Anexar arquivo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <Button
          type="submit"
          variant="primary"
          disabled={!canSubmit}
          ariaLabel="Enviar mensagem"
        >
          {isUploading ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".txt,.pdf"
        onChange={handleFileChange}
        multiple
        aria-hidden="true"
      />
      {attachedFiles.length > 0 && (
        <div className="message-input__files">
          {attachedFiles.map((file, i) => (
            <span key={i} className="message-input__file">
              <svg className="message-input__file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {file.name}
              <button
                type="button"
                className="message-input__file-remove"
                onClick={() => removeFile(i)}
                disabled={isUploading}
                aria-label={`Remover ${file.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </form>
  )
}

export default MessageInput
