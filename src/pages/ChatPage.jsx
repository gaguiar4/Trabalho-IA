import { useEffect } from 'react'
import { useChat } from '../hooks/useChat.js'
import { useHistory } from '../hooks/useHistory.js'
import { useUpload } from '../hooks/useUpload.js'
import { useIngestionStatus } from '../hooks/useIngestionStatus.js'
import { useHealthCheck } from '../hooks/useHealthCheck.js'
import { useAuth } from '../hooks/useAuth.js'
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
import IngestionStatus from '../components/upload/IngestionStatus.jsx'
import ErrorMessage from '../components/shared/ErrorMessage.jsx'

function ChatPage() {
  const { messages, isLoading, isUploading, currentSessionId, error, sendMessage, loadSession } = useChat()
  const { sessions, isLoadingSessions, errorSessions, fetchSessions, loadMore, hasNext, selectSession } = useHistory()
  const { selectedFiles, uploadProgress, uploadStatus, uploadError, jobId, addFiles, removeFile, startUpload, resetUpload } = useUpload()
  const { status: ingestionStatus, chunksCount, errorMessage: ingestionError } = useIngestionStatus(jobId)
  const { apiStatus, lastCheck, checkHealth, startPolling } = useHealthCheck()
  const { user, logout } = useAuth()

  useEffect(() => {
    startPolling()
    fetchSessions()
  }, [])

  function handleSelectSession(sessionId) {
    selectSession(sessionId)
    loadSession(sessionId)
  }

  function handleSend(text, files) {
    const allFiles = [...files, ...selectedFiles]
    sendMessage(text, allFiles)
    resetUpload()
  }

  return (
    <MainLayout
      sidebar={
        <Sidebar>
          <div className="sidebar__user">
            <span className="sidebar__username">{user}</span>
            <button className="sidebar__logout" onClick={logout}>Sair</button>
          </div>
          {errorSessions && <div className="sidebar__error">{errorSessions}</div>}
          <SessionList
            sessions={sessions}
            activeSessionId={currentSessionId}
            isLoading={isLoadingSessions}
            hasNext={hasNext}
            onSelect={handleSelectSession}
            onLoadMore={loadMore}
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
          {error && <div className="chat-error">{error}</div>}
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            currentSessionId={currentSessionId}
          />
          <MessageInput
            onSend={handleSend}
            isDisabled={isLoading}
            isUploading={isUploading}
          />
          <DropZone
            onDrop={addFiles}
            disabled={isLoading}
          >
            {selectedFiles.map((file, i) => (
              <FileItem key={i} file={file} onRemove={() => removeFile(i)} />
            ))}
            {uploadStatus === UPLOAD_STATUS.IDLE && selectedFiles.length > 0 && (
              <UploadButton onClick={() => startUpload(currentSessionId)} disabled={isLoading} />
            )}
            {uploadStatus !== UPLOAD_STATUS.IDLE && (
              <ProgressBar progress={uploadProgress} status={uploadStatus} />
            )}
            {uploadError && (
              <ErrorMessage message={uploadError} onRetry={resetUpload} />
            )}
            {(uploadStatus === UPLOAD_STATUS.SUCCESS || ingestionStatus) && (
              <IngestionStatus status={ingestionStatus} chunksCount={chunksCount} errorMessage={ingestionError} />
            )}
            {uploadStatus === UPLOAD_STATUS.SUCCESS && ingestionStatus !== 'QUEUED' && ingestionStatus !== 'PARSING' && ingestionStatus !== 'CHUNKING' && ingestionStatus !== 'EMBEDDING' && (
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
