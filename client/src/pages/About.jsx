import {
  Camera,
  Clapperboard,
  Code2,
  Cpu,
  GraduationCap,
  ImageIcon,
  Palette,
  Radio,
  ShoppingBag,
  Wrench,
} from "lucide-react";

const backgroundItems = [
  {
    number: "01",
    title: "Computer Engineering",
    text: "BS Computer Engineering graduate from Bulacan State University – Meneses Campus.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "IT Support",
    text: "Hands-on experience in troubleshooting, workstation setup, computer hardware, peripherals, and technical support.",
    icon: Wrench,
  },
  {
    number: "03",
    title: "Web Development",
    text: "Experience building responsive web interfaces and working with modern frontend technologies.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Embedded Systems",
    text: "Experience working with Raspberry Pi, RFID hardware, microcontrollers, sensors, and electronics.",
    icon: Cpu,
  },
];

const creativeItems = [
  {
    title: "Photography",
    icon: Camera,
  },
  {
    title: "Videography",
    icon: Clapperboard,
  },
  {
    title: "Video Editing",
    icon: ImageIcon,
  },
  {
    title: "Graphic Design",
    icon: Palette,
  },
];

const projects = [
  {
    number: "01",
    title: "InvenSion",
    type: "Thesis Project",
    description:
      "An RFID-driven inventory monitoring and automated POS integration system combining custom hardware with a web-based platform.",
    icon: Radio,
  },
  {
    number: "02",
    title: "UniTrade",
    type: "Venture Concept",
    description:
      "A campus-based marketplace concept designed to create safer and more trusted peer-to-peer transactions for students and staff.",
    icon: ShoppingBag,
  },
];

function About() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="home-grid pointer-events-none absolute inset-0" />
      <div className="home-moving-light pointer-events-none absolute inset-0" />

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute right-[6%] top-[15%] h-[500px] w-[500px] rounded-full bg-orange-500/[0.03] blur-[150px]" />

      {/* FLOATING DECORATIONS */}
      <Code2
        size={34}
        className="tech-float tech-float-one pointer-events-none absolute left-[5%] top-[16%] hidden text-orange-400/15 lg:block"
      />

      <Cpu
        size={30}
        className="tech-float tech-float-two pointer-events-none absolute right-[7%] top-[20%] hidden text-orange-400/15 lg:block"
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pb-14 lg:pt-12">
        {/* PAGE INDICATOR */}
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-400">
            02
          </span>

          <div className="h-px w-12 bg-orange-400/50" />

          <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            About
          </span>
        </div>

        {/* =====================================================
            MAIN ABOUT
        ====================================================== */}

        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* LEFT */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-orange-500">
              Daniel F. Domingo
            </p>

            <h1 className="max-w-xl text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Computer Engineering
              <span className="block text-zinc-500">& Web Development.</span>
            </h1>

            <div className="my-7 h-px max-w-sm bg-gradient-to-r from-orange-400/70 via-white/10 to-transparent" />

            {/* SHORT ABOUT TEXT */}
            <div className="max-w-xl space-y-5 text-sm leading-7 text-zinc-400 sm:text-base">
              <p>
                I’m Daniel Domingo, a Computer Engineering graduate with
                hands-on experience in web development, IT support, computer
                hardware, embedded systems, and multimedia production.
              </p>

              <p>
                My experience includes developing systems that combine hardware
                and software, providing technical support, and working on
                practical projects involving web applications and embedded
                technologies.
              </p>

              <p>
                Currently, I’m focused on improving my frontend development
                skills while continuing to build projects that combine
                engineering, technology, creativity, and problem-solving.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                Engineering • Development • Creative
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            {/* LARGE NUMBER */}
            <span className="pointer-events-none absolute -right-2 -top-14 hidden select-none text-[180px] font-semibold leading-none text-white/[0.018] lg:block">
              02
            </span>

            {/* BACKGROUND HEADER */}
            <div className="relative mb-2 flex items-end justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                  Background
                </p>

                <h2 className="mt-2 text-2xl font-medium text-white sm:text-3xl">
                  Engineering,
                  <span className="text-orange-400"> technology </span>&
                  development.
                </h2>
              </div>

              <span className="hidden font-mono text-[8px] tracking-[0.2em] text-zinc-700 sm:block">
                DANIEL / 2026
              </span>
            </div>

            {/* BACKGROUND ITEMS */}
            <div>
              {backgroundItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group grid gap-4 border-b border-white/[0.07] py-4 sm:grid-cols-[38px_46px_1fr] sm:items-center"
                  >
                    <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-700">
                      {item.number}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400 transition-all duration-300 group-hover:border-orange-400/30 group-hover:bg-orange-400/[0.07]">
                      <Icon size={16} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 max-w-lg text-xs leading-5 text-zinc-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CREATIVE */}
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.012] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-600">
                    Creative Experience
                  </p>

                  <h3 className="mt-1.5 text-base font-medium text-white">
                    Multimedia
                    <span className="text-orange-400"> & Visual Work</span>
                  </h3>
                </div>

                <Camera size={17} className="text-orange-400" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {creativeItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.01] px-3 py-4 text-center transition-all duration-300 hover:border-orange-400/20"
                    >
                      <Icon size={16} className="mb-2 text-orange-400/80" />

                      <span className="text-[10px] text-zinc-400">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SELECTED PROJECTS
        ====================================================== */}

        <div className="mt-12 border-t border-white/10 pt-8">
          {/* HEADER */}
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-orange-400">
                Selected Projects
              </p>

              <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                A glimpse of
                <span className="text-zinc-500"> my work.</span>
              </h2>
            </div>

            <span className="hidden font-mono text-[8px] tracking-[0.2em] text-zinc-700 sm:block">
              PROJECTS / 02
            </span>
          </div>

          {/* PROJECT CARDS */}
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => {
              const Icon = project.icon;

              return (
                <div
                  key={project.number}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012] p-5 transition-all duration-300 hover:border-orange-400/20"
                >
                  {/* GLOW */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/[0.025] blur-[40px]" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                      <Icon size={18} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[8px] uppercase tracking-[0.25em] text-orange-400">
                          {project.type}
                        </p>

                        <span className="font-mono text-[8px] text-zinc-700">
                          {project.number}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-medium text-white">
                        {project.title}
                      </h3>

                      <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-500">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM DETAIL */}
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <span className="font-mono text-[8px] tracking-[0.22em] text-zinc-700">
            {"< ABOUT />"}
          </span>

          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default About;
