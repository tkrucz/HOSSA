import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DocumentCard from "../components/DocumentCard";
import DocumentModal from "../components/DocumentModal";
import ReloadButton from "../components/ReloadButton";
import { API_URL } from "../api";
import { STATUS_LEGEND } from "../statusLegend";

export default function DocumentsPage() {
  const { projectId, folderId } = useParams();
  const [docs, setDocs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const fetchDocs = useCallback(() => {
    return fetch(`${API_URL}/projects/${projectId}/folders/${folderId}/documents`)
      .then((res) => res.json())
      .then(setDocs)
      .catch(console.error);
  }, [projectId, folderId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

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

      <div className="page-header">
        <h1>
          {projectId} / {folderId} - Dokumenty
        </h1>
        <ReloadButton onSynced={fetchDocs} />
      </div>

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
        {STATUS_LEGEND.map((item) => (
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