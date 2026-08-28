import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  Braces,
  Code2,
  Cpu,
  Database,
  Terminal,
} from "lucide-react";

import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt } from "react-icons/fa";

import Navbar from "../components/Navbar";
import profileImage from "../assets/historia2.jpg";

function TailwindIcon({ size = 30, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8.8-1.6 1.733-2.2 2.8-1.8.608.228 1.043.668 1.526 1.156.786.794 1.696 1.713 3.674 1.713 3.2 0 5.2-1.6 6-4.8-.8 1.6-1.733 2.2-2.8 1.8-.608-.228-1.043-.668-1.526-1.156C14.889 5.719 13.979 4.8 12.001 4.8zm-6 4.8c-3.2 0-5.2 1.6-6 4.8.8-1.6 1.733-2.2 2.8-1.8.608.228 1.043.668 1.526 1.156.786.794 1.696 1.713 3.674 1.713 3.2 0 5.2-1.6 6-4.8-.8 1.6-1.733 2.2-2.8 1.8-.608-.228-1.043-.668-1.526-1.156C8.889 10.519 7.979 9.6 6.001 9.6z" />
    </svg>
  );
}

const technologies = [
  {
    name: "HTML",
    icon: FaHtml5,
    color: "text-orange-500",
  },
  {
    name: "CSS",
    icon: FaCss3Alt,
    color: "text-blue-500",
  },
  {
    name: "JavaScript",
    icon: FaJs,
    color: "text-yellow-400",
  },
  {
    name: "React",
    icon: FaReact,
    color: "text-cyan-400",
  },
  {
    name: "Tailwind",
    icon: TailwindIcon,
    color: "text-sky-400",
  },
  {
    name: "Git",
    icon: FaGitAlt,
    color: "text-orange-600",
  },
];

const features = [
  {
    title: "Clean Code",
    description: "Writing maintainable and scalable code.",
    icon: Code2,
  },
  {
    title: "Responsive Design",
    description: "Building seamless experiences across all devices.",
    icon: Braces,
  },
  {
    title: "Continuous Learning",
    description: "Always exploring new tools and technologies.",
    icon: Cpu,
  },
  {
    title: "User Focused",
    description: "Creating intuitive and meaningful interfaces.",
    icon: Terminal,
  },
];

function Home() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white lg:h-[100dvh]">
      {/* BACKGROUND */}

      <div className="home-grid pointer-events-none absolute inset-0" />

      <div className="home-moving-light pointer-events-none absolute inset-0" />

      {/* FLOATING DECORATIONS */}

      <Code2
        size={34}
        className="tech-float tech-float-one pointer-events-none absolute left-[6%] top-[15%] hidden text-orange-400/20 lg:block"
      />

      <Braces
        size={32}
        className="tech-float tech-float-two pointer-events-none absolute left-[48%] top-[14%] hidden text-orange-400/20 lg:block"
      />

      <Database
        size={30}
        className="tech-float tech-float-three pointer-events-none absolute right-[6%] top-[11%] hidden text-orange-400/20 lg:block"
      />

      <Cpu
        size={30}
        className="tech-float tech-float-four pointer-events-none absolute left-[49%] top-[53%] hidden text-white/[0.055] lg:block"
      />

      <Terminal
        size={30}
        className="tech-float tech-float-five pointer-events-none absolute bottom-[15%] left-[45%] hidden text-white/[0.055] lg:block"
      />

      <span className="floating-code floating-code-one pointer-events-none absolute left-[55%] top-[21%] hidden font-mono text-[9px] tracking-[0.25em] text-orange-400/20 lg:block">
        01
      </span>

      <span className="floating-code floating-code-two pointer-events-none absolute right-[14%] top-[29%] hidden font-mono text-[9px] tracking-[0.2em] text-white/[0.08] lg:block">
        SYSTEM
      </span>

      <span className="floating-code floating-code-three pointer-events-none absolute bottom-[18%] right-[10%] hidden font-mono text-[9px] tracking-[0.2em] text-orange-400/20 lg:block">
        {"{ CODE }"}
      </span>

      <div className="design-dots pointer-events-none absolute bottom-[12%] right-[3%] hidden grid-cols-4 gap-3 lg:grid">
        {Array.from({
          length: 12,
        }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-orange-400/30"
          />
        ))}
      </div>

      {/* MAIN */}

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-7xl px-6 pb-8 pt-14 lg:h-full lg:min-h-0 lg:px-10 lg:pb-3 lg:pt-6">
        <div className="relative lg:h-full">
          {/* LEFT CONTENT */}

          <div className="relative z-40 lg:absolute lg:left-0 lg:top-[4%] lg:w-[52%]">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-orange-500 sm:text-sm">
              Hello, I'm
            </p>

            <h1 className="text-6xl font-medium leading-[0.86] tracking-[-0.05em] text-white sm:text-7xl lg:text-[clamp(4.5rem,10vh,7rem)]">
              Daniel
              <span className="block">Domingo</span>
            </h1>

            {/* NAVBAR */}

            <div className="my-6 border-y border-white/10 py-4 lg:my-4 lg:py-3">
              <Navbar />
            </div>

            {/* PROFESSION */}

            <h2 className="text-3xl font-light leading-tight text-zinc-400 sm:text-4xl lg:text-[clamp(2rem,4.4vh,2.8rem)]">
              I'm an aspiring
              <span className="mt-1 block font-medium">
                <span className="text-orange-400">Web</span>{" "}
                <span className="text-white">Developer.</span>
              </span>
            </h2>

            {/* DESCRIPTION */}

            <div className="mt-4 flex max-w-xl">
              <span className="mr-4 w-px shrink-0 bg-orange-500/70" />

              <p className="text-sm leading-6 text-zinc-500">
                I enjoy building clean, responsive, and modern web experiences
                while continuously learning new technologies and improving my
                skills.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="group flex items-center gap-3 rounded-full bg-orange-500 px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-orange-400"
              >
                View my work
                <ArrowDownRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-white/15 bg-black/20 px-7 py-3 text-sm text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-orange-400/30 hover:text-white"
              >
                Let's talk
              </Link>
            </div>
          </div>

          {/* =================================================
              PROFILE
              NO RINGS
              NO GLOW
              NO RECTANGULAR OVERLAY
              IMAGE ITSELF FADES AT THE BOTTOM
          ================================================== */}

          <div className="relative mt-12 min-h-[520px] lg:absolute lg:bottom-[55px] lg:right-[-2%] lg:top-0 lg:mt-0 lg:min-h-0 lg:w-[53%]">
            {/* DESKTOP PROFILE */}

            <img
              src={profileImage}
              alt="Daniel Domingo"
              className="
                absolute
                bottom-[-3%]
                left-1/2
                z-20
                h-[102%]
                w-auto
                max-w-none
                -translate-x-1/2
                object-contain
                object-bottom
                mix-blend-lighten

                max-lg:hidden
              "
              style={{
                filter: "grayscale(100%) contrast(1.26) brightness(0.94)",

                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.98) 78%, rgba(0,0,0,0.9) 84%, rgba(0,0,0,0.68) 89%, rgba(0,0,0,0.38) 94%, rgba(0,0,0,0.12) 98%, transparent 100%)",

                maskImage:
                  "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.98) 78%, rgba(0,0,0,0.9) 84%, rgba(0,0,0,0.68) 89%, rgba(0,0,0,0.38) 94%, rgba(0,0,0,0.12) 98%, transparent 100%)",
              }}
            />

            {/* MOBILE PROFILE */}

            <div className="relative flex min-h-[500px] items-end justify-center overflow-hidden lg:hidden">
              <img
                src={profileImage}
                alt="Daniel Domingo"
                className="
                  relative
                  z-20
                  max-h-[600px]
                  w-auto
                  max-w-full
                  object-contain
                  object-bottom
                  mix-blend-lighten
                "
                style={{
                  filter: "grayscale(100%) contrast(1.26) brightness(0.94)",

                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.98) 77%, rgba(0,0,0,0.88) 84%, rgba(0,0,0,0.62) 90%, rgba(0,0,0,0.3) 95%, rgba(0,0,0,0.1) 98%, transparent 100%)",

                  maskImage:
                    "linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.98) 77%, rgba(0,0,0,0.88) 84%, rgba(0,0,0,0.62) 90%, rgba(0,0,0,0.3) 95%, rgba(0,0,0,0.1) 98%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* TECHNOLOGIES */}

          <div className="relative z-50 mt-6 rounded-2xl border border-orange-400/20 bg-zinc-950/90 px-5 py-3 backdrop-blur-xl lg:absolute lg:bottom-[76px] lg:left-0 lg:mt-0 lg:w-[540px]">
            <p className="mb-3 text-[9px] uppercase tracking-[0.32em] text-zinc-500">
              Technologies I work with
            </p>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {technologies.map((tech) => {
                const Icon = tech.icon;

                return (
                  <div
                    key={tech.name}
                    className="tech-card-item group text-center"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-orange-400/30">
                      <Icon
                        size={23}
                        className={`${tech.color} transition-transform duration-300 group-hover:scale-110`}
                      />
                    </div>

                    <p className="mt-1 text-[9px] text-zinc-500">{tech.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FEATURE STRIP */}

          <div className="relative z-50 mt-4 grid overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl sm:grid-cols-2 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:mt-0 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    index !== features.length - 1
                      ? "border-b border-white/[0.06] xl:border-b-0 xl:border-r"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-400/20 bg-orange-400/[0.05] text-orange-400">
                    <Icon size={16} />
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-[9px] leading-4 text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
