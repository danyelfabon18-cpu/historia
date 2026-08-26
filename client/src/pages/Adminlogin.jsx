import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    setStatus({
      type: "",
      message: "",
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in.");
      }

      sessionStorage.setItem("historia_admin_token", data.token);

      navigate("/admin/inbox");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to sign in.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      {/* BACKGROUND */}

      <div className="home-grid pointer-events-none absolute inset-0" />
      <div className="home-moving-light pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.035] blur-[160px]" />

      {/* LOGIN */}

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.04] text-orange-400">
            <ShieldCheck size={20} />
          </div>

          <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-orange-400">
            Historia Administration
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-white">
            Admin Access
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Sign in to manage portfolio messages.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-500/[0.035] blur-[70px]" />

          <form onSubmit={handleSubmit} className="relative z-10">
            {/* EMAIL */}

            <div>
              <label
                htmlFor="admin-email"
                className="text-[8px] uppercase tracking-[0.25em] text-zinc-600"
              >
                Admin Email
              </label>

              <div className="relative mt-2">
                <Mail
                  size={15}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700"
                />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Admin email"
                  required
                  autoComplete="email"
                  className="w-full border-b border-white/10 bg-transparent py-3 pl-7 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/60"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="mt-7">
              <label
                htmlFor="admin-password"
                className="text-[8px] uppercase tracking-[0.25em] text-zinc-600"
              >
                Password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={15}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700"
                />

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Admin password"
                  required
                  autoComplete="current-password"
                  className="w-full border-b border-white/10 bg-transparent py-3 pl-7 pr-10 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-600 transition-colors hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* ERROR */}

            {status.message && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.035] px-4 py-3 text-xs text-red-300">
                {status.message}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-orange-400/25 bg-orange-400/[0.06] px-5 py-3.5 text-xs font-medium text-orange-300 transition-all duration-300 hover:border-orange-400/50 hover:bg-orange-400/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}

              {!isLoading && (
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-zinc-800">
          Authorized Access Only
        </p>
      </div>
    </section>
  );
}

export default AdminLogin;
