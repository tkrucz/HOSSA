import { Routes, Route } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import FoldersPage from "./pages/FoldersPage";
import DocumentsPage from "./pages/DocumentsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/projects/:projectId/folders" element={<FoldersPage />} />
      <Route
        path="/projects/:projectId/folders/:folderId/documents"
        element={<DocumentsPage />}
      />
      <Route path="/projects/:projectId/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;