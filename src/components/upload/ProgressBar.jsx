function ProgressBar({ progress, status }) {
  return (
    <div
      className={`progress-bar progress-bar--${status}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

export default ProgressBar
