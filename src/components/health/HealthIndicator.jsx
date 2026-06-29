import StatusDot from './StatusDot.jsx'
import { formatTimestamp } from '../../utils/formatters.js'

function HealthIndicator({ status, lastCheck, onClick }) {
  return (
    <button className="health-indicator" onClick={onClick} type="button" aria-label="Status da API">
      <StatusDot status={status} />
      <span className="health-indicator__label">{status}</span>
      {lastCheck && (
        <span className="health-indicator__last-check">{formatTimestamp(lastCheck)}</span>
      )}
    </button>
  )
}

export default HealthIndicator
