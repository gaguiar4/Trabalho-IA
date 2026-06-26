import { formatTimestamp } from '../../utils/formatters.js'

function MessageBubble({ message, isUser }) {
  return (
    <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
      <p className="message-bubble__text">{message.text}</p>
      <span className="message-bubble__timestamp">{formatTimestamp(message.timestamp)}</span>
    </div>
  )
}

export default MessageBubble
