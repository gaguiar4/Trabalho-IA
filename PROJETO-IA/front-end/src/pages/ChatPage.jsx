import { useEffect } from 'react'
import { useChat } from '../hooks/useChat.js'
import { useHistory } from '../hooks/useHistory.js'
import { useUpload } from '../hooks/useUpload.js'
import { useHealthCheck } from '../hooks/useHealthCheck.js'
import MainLayout from '../layouts/MainLayout.jsx'
import Sidebar from '../layouts/Sidebar.jsx'
import ContentArea from '../layouts/ContentArea.jsx'
import ChatWindow from '../components/chat/ChatWindow.jsx'
import MessageInput from '../components/chat/MessageInput.jsx'
import SessionList from '../components/session/SessionList.jsx'
import HealthIndicator from '../components/health/HealthIndicator.jsx'
import DropZone from '../components/upload/DropZone.jsx'

function ChatPage() {
  const { messages, isLoading, currentSessionId, sendMessage, loadSession } = useChat()
  const { sessions, fetchSessions, selectSession } = useHistory()
  const { addFiles } = useUpload()
  const { apiStatus, lastCheck, checkHealth, startPolling } = useHealthCheck()

  useEffect(() => {
    startPolling()
    fetchSessions()
  }, [])

  function handleSelectSession(sessionId) {
    selectSession(sessionId)
    loadSession(sessionId)
  }

  return (
    <MainLayout
      sidebar={
        <Sidebar>
          <SessionList
            sessions={sessions}
            activeSessionId={currentSessionId}
            onSelect={handleSelectSession}
          />
          <HealthIndicator
            status={apiStatus}
            lastCheck={lastCheck}
            onClick={checkHealth}
          />
        </Sidebar>
      }
      content={
        <ContentArea>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            currentSessionId={currentSessionId}
          />
          <MessageInput
            onSend={sendMessage}
            isDisabled={isLoading}
          />
          <DropZone
            onDrop={addFiles}
            disabled={isLoading}
          />
        </ContentArea>
      }
    />
  )
}

export default ChatPage
