import { Routes, Route } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import FoldersPage from "./pages/FoldersPage";
import DocumentsPage from "./pages/DocumentsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./authContext";

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="page">Ładowanie…</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <div className="top-bar">
        <span>{user.name}</span>
        <button className="top-bar-logout" onClick={logout}>
          Wyloguj
        </button>
      </div>

      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:projectId/folders" element={<FoldersPage />} />
        <Route
          path="/projects/:projectId/folders/:folderId/documents"
          element={<DocumentsPage />}
        />
        <Route path="/projects/:projectId/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;