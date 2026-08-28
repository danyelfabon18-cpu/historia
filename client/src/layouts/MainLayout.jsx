import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";

function MainLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Floating navbar on all pages except Home */}

      {!isHome && <Navbar floating />}

      <main className={!isHome ? "pt-[94px] md:pt-[56px]" : ""}>
        <Outlet />
      </main>

      {/* Global AI Assistant */}

      <Chatbot />
    </div>
  );
}

export default MainLayout;
