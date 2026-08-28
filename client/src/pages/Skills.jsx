import {
  Camera,
  Code2,
  Cpu,
  Database,
  Laptop,
  Radio,
  Server,
  Terminal,
  Wrench,
} from "lucide-react";

const skillGroups = [
  {
    number: "01",
    label: "Development",
    title: "Frontend Development",
    description:
      "Building responsive and modern web interfaces for personal and academic projects.",
    icon: Code2,
    skills: [
      "React",
      "JavaScript / JSX",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "HTML",
      "CSS",
    ],
  },
  {
    number: "02",
    label: "System Development",
    title: "Backend & Data",
    description:
      "Technologies used for application logic, real-time communication, structured data, and deployment.",
    icon: Server,
    skills: [
      "Spring Boot",
      "Java",
      "MySQL",
      "REST API",
      "WebSocket",
      "AWS",
      "Node.js",
    ],
  },
  {
    number: "03",
    label: "Engineering",
    title: "Hardware & Embedded Systems",
    description:
      "Experience integrating physical components with software-based systems.",
    icon: Cpu,
    skills: [
      "Raspberry Pi 4",
      "UHF RFID",
      "Arduino",
      "Microcontrollers",
      "Sensor Integration",
      "Basic Electronics",
      "USB-to-UART",
    ],
  },
  {
    number: "04",
    label: "Technical Support",
    title: "IT Support & Hardware",
    description:
      "Practical experience maintaining, configuring, and troubleshooting computer systems.",
    icon: Wrench,
    skills: [
      "Hardware Troubleshooting",
      "Software Troubleshooting",
      "Computer Assembly",
      "Workstation Setup",
      "Peripheral Installation",
      "System Configuration",
      "Preventive Maintenance",
      "Technical Assistance",
    ],
  },
  {
    number: "05",
    label: "Creative",
    title: "Creative & Multimedia",
    description:
      "Creative experience developed through multimedia work, documentation, and visual production.",
    icon: Camera,
    skills: [
      "Photography",
      "Videography",
      "Video Editing",
      "DaVinci Resolve",
      "CapCut",
      "Canva",
      "Adobe Photoshop",
      "Event Documentation",
    ],
  },
  {
    number: "06",
    label: "Workflow",
    title: "Software & Development Tools",
    description:
      "Tools used across development, engineering, documentation, and productivity workflows.",
    icon: Laptop,
    skills: [
      "Visual Studio Code",
      "GitHub",
      "AutoCAD",
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint",
    ],
  },
];

const programmingLanguages = ["C++", "Python", "PHP"];

const strengths = [
  "Problem Solving",
  "Analytical Thinking",
  "Team Collaboration",
  "Communication",
  "Adaptability",
  "Continuous Learning",
];

function Skills() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <div className="home-grid pointer-events-none absolute inset-0" />

      <div className="home-moving-light pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-[5%] top-[18%] h-[450px] w-[450px] rounded-full bg-orange-500/[0.025] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-white/[0.015] blur-[160px]" />

      {/* FLOATING DECORATIONS */}

      <Code2
        size={34}
        className="tech-float tech-float-one pointer-events-none absolute left-[5%] top-[15%] hidden text-orange-400/15 lg:block"
      />

      <Radio
        size={30}
        className="tech-float tech-float-two pointer-events-none absolute right-[7%] top-[18%] hidden text-orange-400/15 lg:block"
      />

      <Database
        size={28}
        className="tech-float tech-float-three pointer-events-none absolute bottom-[18%] right-[12%] hidden text-white/[0.05] lg:block"
      />

      {/* MAIN CONTENT */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pb-14 lg:pt-12">
        {/* PAGE INDICATOR */}

        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-400">
            03
          </span>

          <div className="h-px w-12 bg-orange-400/50" />

          <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Skills
          </span>
        </div>

        {/* INTRO */}

        <div className="grid items-end gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-orange-500">
              Technical Skillset
            </p>

            <h1 className="max-w-3xl text-4xl font-medium leading-[1] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Skills built through
              <span className="block text-zinc-500">
                learning & experience.
              </span>
            </h1>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-sm leading-7 text-zinc-500">
              My experience covers web development, system integration, embedded
              hardware, IT support, and multimedia. These skills have been
              developed through academic projects, practical training, and
              hands-on work.
            </p>
          </div>
        </div>

        {/* AREAS OF EXPERIENCE */}

        <div className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-orange-400">
                Areas of Experience
              </p>

              <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                What I work with.
              </h2>
            </div>

            <span className="hidden font-mono text-[8px] tracking-[0.2em] text-zinc-700 sm:block">
              SKILLS / 06
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {skillGroups.map((group) => {
              const Icon = group.icon;

              return (
                <article
                  key={group.number}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012] p-5 transition-all duration-300 hover:border-orange-400/20 sm:p-6"
                >
                  {/* SUBTLE CARD LIGHT */}

                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-500/[0.025] blur-[45px]" />

                  <div className="relative z-10 flex items-start gap-4">
                    {/* SMALL NUMBER ONLY */}

                    <span className="mt-1 font-mono text-[8px] tracking-[0.2em] text-zinc-700">
                      {group.number}
                    </span>

                    {/* ICON */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400 transition-all duration-300 group-hover:border-orange-400/30 group-hover:bg-orange-400/[0.07]">
                      <Icon size={18} />
                    </div>

                    {/* TEXT */}

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.25em] text-orange-400">
                        {group.label}
                      </p>

                      <h3 className="mt-1.5 text-base font-medium text-white">
                        {group.title}
                      </h3>

                      <p className="mt-2 max-w-lg text-xs leading-5 text-zinc-600">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* SKILLS */}

                  <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/[0.07] bg-white/[0.012] px-3 py-1.5 text-[10px] text-zinc-400 transition-all duration-300 hover:border-orange-400/25 hover:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* PROGRAMMING LANGUAGES */}

        <div className="mt-10 grid gap-7 border-y border-white/10 py-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Terminal size={16} className="text-orange-400" />

              <p className="text-[9px] uppercase tracking-[0.3em] text-orange-400">
                Programming
              </p>
            </div>

            <h2 className="mt-2 text-xl font-medium text-white">
              Other languages
              <span className="text-zinc-500"> I've worked with.</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {programmingLanguages.map((language) => (
              <div
                key={language}
                className="group flex min-w-[120px] items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.012] px-4 py-3 transition-all duration-300 hover:border-orange-400/20"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-400/10 text-orange-400">
                  <Terminal size={13} />
                </div>

                <span className="text-xs font-medium text-zinc-300">
                  {language}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PROFESSIONAL STRENGTHS */}

        <div className="mt-9">
          <div className="grid gap-6 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                Professional Strengths
              </p>

              <h2 className="mt-2 text-xl font-medium text-white">
                Beyond the
                <span className="text-orange-400"> technical side.</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {strengths.map((strength) => (
                <div
                  key={strength}
                  className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.012] px-4 py-2 text-xs text-zinc-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

                  {strength}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <span className="font-mono text-[8px] tracking-[0.22em] text-zinc-700">
            {"< SKILLS />"}
          </span>

          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default Skills;
