import { useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import historiaLogo from "../assets/historia-logo.png";

function Navbar({ floating = false }) {
  const [isMoving, setIsMoving] = useState(false);

  const navRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  /* =========================================================
     NORMAL NAVIGATION
  ========================================================= */

  const handleNavigation = (event, path) => {
    if (
      !floating &&
      location.pathname === "/" &&
      path !== "/" &&
      navRef.current
    ) {
      event.preventDefault();

      const rect = navRef.current.getBoundingClientRect();

      const distanceToTop = Math.max(rect.top - 12, 0);

      navRef.current.style.setProperty(
        "--navbar-lift-distance",
        `${distanceToTop}px`,
      );

      setIsMoving(true);

      window.setTimeout(() => {
        navigate(path);
      }, 70);
    }
  };

  /* =========================================================
     H LOGO ADMIN ACCESS
  ========================================================= */

  const handleAdminClick = () => {
    const adminToken = sessionStorage.getItem("historia_admin_token");

    if (adminToken) {
      navigate("/admin/inbox");
      return;
    }

    navigate("/admin");
  };

  return (
    <nav
      ref={navRef}
      className={`${floating ? "navbar-top-enter" : "navbar-home-enter"} ${
        isMoving ? "navbar-moving-top" : ""
      } ${
        floating
          ? "fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl"
          : "relative z-50 w-full"
      }`}
    >
      {floating ? (
        /* =====================================================
           INNER PAGE NAVBAR
        ====================================================== */

        <div className="mx-auto max-w-7xl px-5 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* BRAND */}

            <div className="flex items-center gap-[2px]">
              {/* H LOGO = ADMIN */}

              <button
                type="button"
                onClick={handleAdminClick}
                className="group relative flex h-8 w-8 shrink-0 items-center justify-center"
                aria-label="Historia access"
              >
                <span className="pointer-events-none absolute inset-0 rounded-lg bg-white/[0.04] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                <img
                  src={historiaLogo}
                  alt=""
                  className="relative z-10 h-7 w-7 object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
              </button>

              {/* HISTORIA TEXT = HOME */}

              <NavLink
                to="/"
                onClick={(event) => handleNavigation(event, "/")}
                className="text-lg font-semibold tracking-tight text-white"
              >
                Historia.
              </NavLink>
            </div>

            {/* DESKTOP LINKS */}

            <div className="hidden items-center gap-8 md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={(event) => handleNavigation(event, link.path)}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-white" : "text-zinc-500 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}

                      <span
                        className={`absolute -bottom-2 left-0 h-px bg-orange-400 transition-all duration-200 ${
                          isActive ? "w-full" : "w-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* =================================================
             MOBILE DIRECT LINKS
             NO HAMBURGER
          ================================================== */}

          <div className="mt-3 flex items-center gap-5 overflow-x-auto border-t border-white/[0.06] pt-3 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(event) => handleNavigation(event, link.path)}
                className={({ isActive }) =>
                  `relative shrink-0 text-[11px] font-medium transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-orange-400 transition-all duration-200 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ) : (
        /* =====================================================
           HOME NAVBAR
        ====================================================== */

        <div className="w-full">
          {/* DESKTOP */}

          <div className="hidden items-center gap-7 md:flex">
            {/* H LOGO = ADMIN */}

            <button
              type="button"
              onClick={handleAdminClick}
              className="group relative flex h-7 w-7 shrink-0 items-center justify-center"
              aria-label="Historia access"
            >
              <span className="pointer-events-none absolute inset-0 rounded-md bg-white/[0.04] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

              <img
                src={historiaLogo}
                alt=""
                className="relative z-10 h-6 w-6 object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
              />
            </button>

            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(event) => handleNavigation(event, link.path)}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-orange-400 transition-all duration-200 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* =================================================
             MOBILE HOME NAV
             DIRECTLY VISIBLE
          ================================================== */}

          <div className="flex w-full items-center gap-5 overflow-x-auto border-y border-white/[0.07] py-3 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* H LOGO */}

            <button
              type="button"
              onClick={handleAdminClick}
              className="flex h-6 w-6 shrink-0 items-center justify-center"
              aria-label="Historia access"
            >
              <img
                src={historiaLogo}
                alt=""
                className="h-5 w-5 object-contain opacity-90"
              />
            </button>

            {/* LINKS */}

            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(event) => handleNavigation(event, link.path)}
                className={({ isActive }) =>
                  `relative shrink-0 text-[11px] font-medium transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-orange-400 transition-all duration-200 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
