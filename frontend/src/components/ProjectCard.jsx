export default function ProjectCard({ project, onClick }) {
  return (
    <div className="nav-card" onClick={onClick}>
      <span className="nav-card-icon">📁</span>
      <div className="nav-card-body">
        <strong>{project.name}</strong>
        <span className="nav-card-meta">{project.count} dokumenty</span>
      </div>
    </div>
  );
}