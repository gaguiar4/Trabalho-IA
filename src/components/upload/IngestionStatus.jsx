import { INGESTION_STATUS } from '../../utils/constants.js'

const LABELS = {
  [INGESTION_STATUS.QUEUED]: 'Na fila...',
  [INGESTION_STATUS.PARSING]: 'Analisando...',
  [INGESTION_STATUS.CHUNKING]: 'Fragmentando...',
  [INGESTION_STATUS.EMBEDDING]: 'Indexando...',
  [INGESTION_STATUS.READY]: 'Pronto',
  [INGESTION_STATUS.FAILED]: 'Falhou',
}

function IngestionStatus({ status, chunksCount, errorMessage }) {
  if (!status || status === INGESTION_STATUS.IDLE) return null

  const isProcessing = [INGESTION_STATUS.QUEUED, INGESTION_STATUS.PARSING, INGESTION_STATUS.CHUNKING, INGESTION_STATUS.EMBEDDING].includes(status)
  const isReady = status === INGESTION_STATUS.READY
  const isFailed = status === INGESTION_STATUS.FAILED

  return (
    <div className={`ingestion-status ingestion-status--${status.toLowerCase()}`}>
      <span className="ingestion-status__icon">
        {isProcessing && '\u23F3'}
        {isReady && '\u2705'}
        {isFailed && '\u274C'}
      </span>
      <span className="ingestion-status__label">{LABELS[status] || status}</span>
      {isReady && chunksCount != null && (
        <span className="ingestion-status__detail">{chunksCount} fragmentos indexados</span>
      )}
      {isFailed && errorMessage && (
        <span className="ingestion-status__detail">{errorMessage}</span>
      )}
    </div>
  )
}

export default IngestionStatus
