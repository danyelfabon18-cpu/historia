import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Conversation from "./pages/Conversation";

import AdminLogin from "./pages/AdminLogin";
import AdminInbox from "./pages/AdminInbox";

/* =========================================================
   ADMIN PROTECTED ROUTE
========================================================= */

function ProtectedAdminRoute({ children }) {
  const token = sessionStorage.getItem("historia_admin_token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Routes>
      {/* PUBLIC PORTFOLIO */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/skills" element={<Skills />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/conversation/:id" element={<Conversation />} />
      </Route>

      {/* ADMIN */}

      <Route path="/admin" element={<AdminLogin />} />

      <Route
        path="/admin/inbox"
        element={
          <ProtectedAdminRoute>
            <AdminInbox />
          </ProtectedAdminRoute>
        }
      />

      {/* FALLBACK */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
