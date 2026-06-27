import { useEffect } from 'react'
import { useChat } from '../hooks/useChat.js'
import { useHistory } from '../hooks/useHistory.js'
import { useUpload } from '../hooks/useUpload.js'
import { useHealthCheck } from '../hooks/useHealthCheck.js'
import { UPLOAD_STATUS } from '../utils/constants.js'
import MainLayout from '../layouts/MainLayout.jsx'
import Sidebar from '../layouts/Sidebar.jsx'
import ContentArea from '../layouts/ContentArea.jsx'
import ChatWindow from '../components/chat/ChatWindow.jsx'
import MessageInput from '../components/chat/MessageInput.jsx'
import SessionList from '../components/session/SessionList.jsx'
import HealthIndicator from '../components/health/HealthIndicator.jsx'
import DropZone from '../components/upload/DropZone.jsx'
import FileItem from '../components/upload/FileItem.jsx'
import ProgressBar from '../components/upload/ProgressBar.jsx'
import UploadButton from '../components/upload/UploadButton.jsx'
import ErrorMessage from '../components/shared/ErrorMessage.jsx'

function ChatPage() {
  const { messages, isLoading, currentSessionId, sendMessage, loadSession } = useChat()
  const { sessions, fetchSessions, selectSession } = useHistory()
  const { selectedFiles, uploadProgress, uploadStatus, uploadError, addFiles, removeFile, startUpload, resetUpload } = useUpload()
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
          >
            {selectedFiles.map((file, i) => (
              <FileItem key={i} file={file} onRemove={() => removeFile(i)} />
            ))}
            {uploadStatus === UPLOAD_STATUS.IDLE && selectedFiles.length > 0 && (
              <UploadButton onClick={startUpload} disabled={isLoading} />
            )}
            {uploadStatus !== UPLOAD_STATUS.IDLE && (
              <ProgressBar progress={uploadProgress} status={uploadStatus} />
            )}
            {uploadError && (
              <ErrorMessage message={uploadError} onRetry={resetUpload} />
            )}
            {uploadStatus === UPLOAD_STATUS.SUCCESS && (
              <button type="button" onClick={resetUpload} className="upload-button">
                Novo Upload
              </button>
            )}
          </DropZone>
        </ContentArea>
      }
    />
  )
}

export default ChatPage
