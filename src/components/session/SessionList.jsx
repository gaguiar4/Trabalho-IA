import SessionItem from './SessionItem.jsx'

function SessionList({ sessions, activeSessionId, isLoading, hasNext, onSelect, onLoadMore }) {
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
      {hasNext && (
        <button
          className="session-list__load-more"
          onClick={onLoadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </nav>
  )
}

export default SessionList
