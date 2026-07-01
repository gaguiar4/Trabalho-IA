import { formatTimestamp } from '../../utils/formatters.js'
import SourcePanel from './SourcePanel.jsx'

function MessageBubble({ message, isUser }) {
  return (
    <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
      {message.text && <p className="message-bubble__text">{message.text}</p>}
      {message.attachments?.length > 0 && (
        <div className="message-bubble__attachments">
          {message.attachments.map((att, i) => (
            <span key={i} className="message-bubble__attachment">
              <svg className="message-bubble__attachment-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {att.name}
            </span>
          ))}
        </div>
      )}
      {!isUser && <SourcePanel sources={message.sources} />}
      <span className="message-bubble__timestamp">{formatTimestamp(message.timestamp)}</span>
    </div>
  )
}

export default MessageBubble
