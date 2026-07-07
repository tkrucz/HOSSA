export default function DocumentCard({ doc }) {
  return (
    <div className="doc-card" style={{ backgroundColor: `#${doc.color}` }}>
      <div className="doc-header">
        <span className="doc-icon">📄</span>
        <strong>{doc.name}</strong>
      </div>

      <div className="doc-info">
        <span>{doc.status}</span>
        <span className="doc-meta">
          {doc.size != null ? (doc.size / 1024 / 1024).toFixed(1) : "?"} MB
          {doc.modified_at ? ` · ${doc.modified_at.slice(0, 10)}` : ""}
        </span>
      </div>
    </div>
  );
}