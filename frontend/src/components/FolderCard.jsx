export default function FolderCard({ folder, onClick }) {
  return (
    <div className="nav-card" onClick={onClick}>
      <span className="nav-card-icon">📁</span>
      <div className="nav-card-body">
        <strong>{folder.name}</strong>
        <span className="nav-card-meta">{folder.count} dokumentów</span>
      </div>
    </div>
  );
}