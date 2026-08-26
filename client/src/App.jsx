import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Conversation from "./pages/Conversation";

import AdminPortalLogin from "./pages/AdminPortalLogin";
import AdminInbox from "./pages/AdminInbox";

function ProtectedAdminRoute({ children }) {
  const token = sessionStorage.getItem("historia_admin_token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/conversation/:id" element={<Conversation />} />
      </Route>

      <Route path="/admin" element={<AdminPortalLogin />} />

      <Route
        path="/admin/inbox"
        element={
          <ProtectedAdminRoute>
            <AdminInbox />
          </ProtectedAdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
