import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'

function ChatWindow({ messages, isLoading, currentSessionId }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-window" role="log" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isUser={message.sender === 'user'}
        />
      ))}
      {isLoading && <div className="chat-window__typing" aria-label="Assistente digitando" />}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow
