const statusClasses = {
  online: 'status-dot--online',
  offline: 'status-dot--offline',
  checking: 'status-dot--checking',
}

function StatusDot({ status }) {
  return (
    <span
      className={`status-dot ${statusClasses[status] || statusClasses.checking}`}
      role="status"
      aria-label={status}
    />
  )
}

export default StatusDot
