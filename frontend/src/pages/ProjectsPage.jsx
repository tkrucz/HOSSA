import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { API_URL } from "../api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = useCallback(() => {
    return fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleReload = () => {
    setSyncing(true);
    setError(null);

    fetch(`${API_URL}/sync`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => fetchProjects())
      .catch(() => setError("Nie udało się załadować dokumentów ponownie."))
      .finally(() => setSyncing(false));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projekty</h1>

        <button
          className="reload-button"
          onClick={handleReload}
          disabled={syncing}
        >
          {syncing ? "Ładowanie…" : "Załaduj ponownie"}
        </button>
      </div>

      {error && <p className="modal-error">{error}</p>}

      <div className="card-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => navigate(`/projects/${project.id}/folders`)}
          />
        ))}
      </div>
    </div>
  );
}