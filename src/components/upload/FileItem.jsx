import Icon from '../shared/Icon.jsx'
import { formatFileSize } from '../../utils/formatters.js'

function FileItem({ file, onRemove }) {
  return (
    <div className="file-item">
      <Icon name="file" size="sm" />
      <span className="file-item__name">{file.name}</span>
      <span className="file-item__size">{formatFileSize(file.size)}</span>
      <button
        className="file-item__remove"
        onClick={onRemove}
        type="button"
        aria-label={`Remover ${file.name}`}
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  )
}

export default FileItem
