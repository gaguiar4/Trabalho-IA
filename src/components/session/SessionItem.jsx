import { formatTimestamp } from '../../utils/formatters.js'

function SessionItem({ session, isActive, onClick }) {
  return (
    <button
      className={`session-item${isActive ? ' session-item--active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
    >
      <span className="session-item__name">{session.title}</span>
      <span className="session-item__last-message">{session.lastMessage || 'Nenhuma mensagem'}</span>
      <span className="session-item__timestamp">{formatTimestamp(session.updatedAt)}</span>
    </button>
  )
}

export default SessionItem
