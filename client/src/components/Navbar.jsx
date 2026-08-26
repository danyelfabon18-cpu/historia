import { useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { LockKeyhole, Menu, ShieldCheck, X } from "lucide-react";

function Navbar({ floating = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const navRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const adminToken = sessionStorage.getItem("historia_admin_token");

  const adminPath = adminToken ? "/admin/inbox" : "/admin";

  const adminLabel = adminToken ? "Admin Inbox" : "Admin Login";

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavigation = (event, path) => {
    setMenuOpen(false);

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

      setTimeout(() => {
        navigate(path);
      }, 70);

      return;
    }
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
      <div
        className={
          floating
            ? "mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10 lg:py-3"
            : "flex items-center justify-between md:justify-start"
        }
      >
        {/* LOGO */}

        {floating && (
          <NavLink
            to="/"
            onClick={(event) => handleNavigation(event, "/")}
            className="text-lg font-semibold tracking-tight text-white"
          >
            Historia.
          </NavLink>
        )}

        {/* DESKTOP NAVIGATION */}

        <div
          className={
            floating
              ? "hidden items-center gap-8 md:flex"
              : "hidden items-center gap-9 md:flex"
          }
        >
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

          {/* ADMIN ACCESS */}

          <NavLink
            to={adminPath}
            onClick={(event) => handleNavigation(event, adminPath)}
            className="group ml-1 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.015] px-3 py-2 text-[10px] text-zinc-600 transition-all duration-200 hover:border-orange-400/20 hover:bg-orange-400/[0.035] hover:text-orange-400"
          >
            {adminToken ? (
              <ShieldCheck
                size={12}
                className="transition-colors group-hover:text-orange-400"
              />
            ) : (
              <LockKeyhole
                size={12}
                className="transition-colors group-hover:text-orange-400"
              />
            )}

            <span>{adminLabel}</span>
          </NavLink>
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-lg border border-white/10 p-2 text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div
          className={
            floating
              ? "border-t border-white/10 bg-black/95 px-6 py-5 backdrop-blur-xl md:hidden"
              : "mt-4 rounded-xl border border-white/10 bg-zinc-950/95 p-5 backdrop-blur-xl md:hidden"
          }
        >
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(event) => handleNavigation(event, link.path)}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* MOBILE ADMIN */}

            <div className="border-t border-white/[0.07] pt-5">
              <NavLink
                to={adminPath}
                onClick={(event) => handleNavigation(event, adminPath)}
                className="flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-orange-400"
              >
                {adminToken ? (
                  <ShieldCheck size={14} />
                ) : (
                  <LockKeyhole size={14} />
                )}

                {adminLabel}
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
