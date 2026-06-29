function UploadButton({ onClick, disabled }) {
  return (
    <button
      className="upload-button"
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="Selecionar arquivo"
    >
      Selecionar arquivo
    </button>
  )
}

export default UploadButton
