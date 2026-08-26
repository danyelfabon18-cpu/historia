import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar appears at the top only outside Home */}
      {!isHome && <Navbar floating />}

      <main className={!isHome ? "pt-[73px]" : ""}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
