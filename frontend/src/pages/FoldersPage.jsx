import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FolderCard from "../components/FolderCard";
import ReloadButton from "../components/ReloadButton";
import { API_URL } from "../api";

export default function FoldersPage() {
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  const fetchFolders = useCallback(() => {
    return fetch(`${API_URL}/projects/${projectId}/folders`)
      .then((res) => res.json())
      .then(setFolders)
      .catch(console.error);
  }, [projectId]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">← Projekty</Link> / {projectId}
      </div>

      <div className="page-header">
        <h1>{projectId} - Podkatalogi</h1>

        <div className="page-header-actions">
          <div className="view-tabs">
            <span className="view-tab view-tab-active">Widok folderów</span>
            <Link to={`/projects/${projectId}/dashboard`} className="view-tab">
              Dashboard
            </Link>
          </div>
          <ReloadButton onSynced={fetchFolders} />
        </div>
      </div>

      <div className="card-grid">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onClick={() =>
              navigate(`/projects/${projectId}/folders/${folder.id}/documents`)
            }
          />
        ))}
      </div>
    </div>
  );
}