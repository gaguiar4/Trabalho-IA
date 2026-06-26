import { useState } from 'react'
import Button from '../shared/Button.jsx'
import Icon from '../shared/Icon.jsx'

function MessageInput({ onSend, isDisabled }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input__field"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isDisabled}
        placeholder="Digite uma mensagem..."
        aria-label="Campo de mensagem"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={isDisabled || !text.trim()}
        ariaLabel="Enviar mensagem"
      >
        <Icon name="send" size="sm" />
      </Button>
    </form>
  )
}

export default MessageInput
