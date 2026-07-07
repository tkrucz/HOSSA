import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FolderCard from "../components/FolderCard.jsx";
import { API_URL } from "../api";

export default function FoldersPage() {
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/projects/${projectId}/folders`)
      .then((res) => res.json())
      .then(setFolders)
      .catch(console.error);
  }, [projectId]);

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">← Projekty</Link> / {projectId}
      </div>

      <h1>{projectId} - Podkatalogi</h1>

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