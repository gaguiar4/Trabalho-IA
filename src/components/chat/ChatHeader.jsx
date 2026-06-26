function ChatHeader({ sessionName, sessionId }) {
  return (
    <header className="chat-header">
      <h2 className="chat-header__name">{sessionName}</h2>
      <span className="chat-header__id">{sessionId}</span>
    </header>
  )
}

export default ChatHeader
