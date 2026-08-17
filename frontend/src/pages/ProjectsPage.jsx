import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ReloadButton from "../components/ReloadButton";
import { API_URL } from "../api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
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

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projekty</h1>
        <ReloadButton onSynced={fetchProjects} />
      </div>

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