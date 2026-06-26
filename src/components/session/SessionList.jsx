import SessionItem from './SessionItem.jsx'

function SessionList({ sessions, activeSessionId, onSelect }) {
  return (
    <nav className="session-list" aria-label="Histórico de sessões">
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          isActive={session.id === activeSessionId}
          onClick={() => onSelect(session.id)}
        />
      ))}
    </nav>
  )
}

export default SessionList
