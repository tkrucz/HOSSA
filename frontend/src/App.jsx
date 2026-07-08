import { Routes, Route } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import FoldersPage from "./pages/FoldersPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/projects/:projectId/folders" element={<FoldersPage />} />
      <Route
        path="/projects/:projectId/folders/:folderId/documents"
        element={<DocumentsPage />}
      />
    </Routes>
  );
}

export default App;