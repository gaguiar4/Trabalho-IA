function SourcePanel({ sources }) {
  if (sources === null || sources === undefined) return null

  if (sources.length === 0) {
    return (
      <p className="source-panel source-panel--empty">
        Resposta baseada no conhecimento geral do modelo (sem documentos)
      </p>
    )
  }

  return (
    <details className="source-panel">
      <summary className="source-panel__summary">
        Fontes ({sources.length})
      </summary>
      <div className="source-panel__list">
        {sources.map((src, i) => (
          <div key={i} className="source-panel__item">
            <div className="source-panel__item-header">
              <span className="source-panel__name">{src.documentName}</span>
              <span className="source-panel__score">
                {Math.round(src.relevanceScore * 100)}%
              </span>
            </div>
            <p className="source-panel__excerpt">{src.excerpt}</p>
          </div>
        ))}
      </div>
    </details>
  )
}

export default SourcePanel
