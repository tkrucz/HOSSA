const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"]);
const TEXT_EXTENSIONS = new Set([".txt", ".docx", ".doc", ".rtf", ".md"]);
const SPREADSHEET_EXTENSIONS = new Set([".xlsx", ".xls", ".csv"]);

function getFileIcon(extension) {
  const ext = (extension || "").toLowerCase();

  if (IMAGE_EXTENSIONS.has(ext)) return "🖼️";
  if (TEXT_EXTENSIONS.has(ext)) return "📝";
  if (SPREADSHEET_EXTENSIONS.has(ext)) return "📊";
  return "📄";
}

export default function DocumentCard({ doc, onClick }) {
  return (
    <div
      className="doc-card"
      style={{ backgroundColor: `#${doc.color}` }}
      onClick={onClick}
    >
      <div className="doc-header">
        <span className="doc-icon">{getFileIcon(doc.extension)}</span>
        <strong>{doc.name}</strong>
      </div>

      <div className="doc-info">
        <span className="doc-meta">
          {doc.size != null ? (doc.size / 1024 / 1024).toFixed(1) : "?"} MB
          {doc.modified_at ? ` · ${doc.modified_at.slice(0, 10)}` : ""}
        </span>
      </div>
    </div>
  );
}