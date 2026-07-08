import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DocumentCard from "../components/DocumentCard";
import DocumentModal from "../components/DocumentModal";
import { API_URL } from "../api";

// Mirrors the `status` table - kept here so the legend always renders even
// before any documents load.
const LEGEND = [
  { status: "brak", color: "9E9D9B" },
  { status: "w trakcie przygotowania", color: "FFA200" },
  { status: "przygotowany", color: "A4E805" },
  { status: "zatwierdzony", color: "05E810" },
  { status: "nie dotyczy", color: "440373" },
  { status: "wymaga zmian", color: "E81033" },
];

export default function DocumentsPage() {
  const { projectId, folderId } = useParams();
  const [docs, setDocs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/projects/${projectId}/folders/${folderId}/documents`)
      .then((res) => res.json())
      .then(setDocs)
      .catch(console.error);
  }, [projectId, folderId]);

  const handleSaved = (updated) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === updated.id ? { ...d, status: updated.status, color: updated.color } : d
      )
    );
  };

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Projekty</Link> /{" "}
        <Link to={`/projects/${projectId}/folders`}>{projectId}</Link> /{" "}
        {folderId}
      </div>

      <h1>
        {projectId} / {folderId} - Dokumenty
      </h1>

      <div className="doc-grid">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            onClick={() => setSelectedId(doc.id)}
          />
        ))}
      </div>

      <div className="legend">
        {LEGEND.map((item) => (
          <span key={item.status} className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: `#${item.color}` }}
            />
            {item.status}
          </span>
        ))}
      </div>

      <DocumentModal
        documentId={selectedId}
        onClose={() => setSelectedId(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}