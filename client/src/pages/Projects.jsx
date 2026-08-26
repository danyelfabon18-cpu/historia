import { useState } from "react";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Maximize2,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   PROJECT IMAGES
========================================================= */

import invensionScanner from "../assets/projects/invension-scanner-settings.png";
import invensionStock from "../assets/projects/invension-stock-adjustment.png";
import invensionUsers from "../assets/projects/invension-user-profiles.png";
import invensionRoles from "../assets/projects/invension-role-permissions.png";

import unitradePages from "../assets/projects/unitrade-pages.png";
import unitradeHome from "../assets/projects/unitrade-home.png";

/* =========================================================
   PROJECT DATA
========================================================= */

const invensionImages = [
  {
    image: invensionScanner,
    title: "RFID Scanner Settings",
  },
  {
    image: invensionStock,
    title: "Stock Adjustment",
  },
  {
    image: invensionUsers,
    title: "User Profiles",
  },
  {
    image: invensionRoles,
    title: "Role & Permission Management",
  },
];

const unitradeImages = [
  {
    image: unitradeHome,
    title: "Marketplace Landing Page",
  },
  {
    image: unitradePages,
    title: "Platform Pages",
  },
];

const invensionTech = [
  "React",
  "Vite",
  "Spring Boot",
  "MySQL",
  "WebSocket",
  "AWS",
  "Raspberry Pi 4",
  "UHF RFID",
];

const invensionMetrics = [
  {
    value: "37.9s",
    label: "Avg. Transaction",
  },
  {
    value: "78.9%",
    label: "Speed Improvement",
  },
  {
    value: "100%",
    label: "Inventory Accuracy",
  },
];

const unitradeFeatures = [
  "Verified campus accounts",
  "Marketplace listings",
  "User profiles",
  "Secure messaging",
  "Ratings & reviews",
  "Search & filtering",
];

/* =========================================================
   PROJECT GALLERY
========================================================= */

function ProjectGallery({
  images,
  activeIndex,
  setActiveIndex,
  label,
  onExpand,
}) {
  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const activeImage = images[activeIndex];

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={activeImage.image}
            alt={activeImage.title}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* OVERLAY */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />

          {/* LABEL */}
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/65 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-300">
              {label}
            </span>
          </div>

          {/* EXPAND */}
          <button
            type="button"
            onClick={onExpand}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/65 text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400"
            aria-label="View screenshot fullscreen"
          >
            <Maximize2 size={15} />
          </button>

          {/* IMAGE TITLE */}
          <div className="absolute bottom-4 left-4">
            <p className="text-xs font-medium text-white">
              {activeImage.title}
            </p>

            <p className="mt-1 font-mono text-[8px] tracking-[0.18em] text-zinc-400">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
          </div>

          {/* NAVIGATION */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={previousImage}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/65 text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400"
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/65 text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400"
                aria-label="Next screenshot"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div
        className={`mt-3 grid gap-2.5 ${
          images.length === 4
            ? "grid-cols-4"
            : images.length === 3
              ? "grid-cols-3"
              : "grid-cols-2"
        }`}
      >
        {images.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
              activeIndex === index
                ? "border-orange-400/50"
                : "border-white/[0.06] hover:border-white/20"
            }`}
          >
            <div className="aspect-[16/9] overflow-hidden bg-zinc-950">
              <img
                src={item.image}
                alt={item.title}
                className={`h-full w-full object-cover object-top transition-all duration-300 ${
                  activeIndex === index
                    ? "opacity-100"
                    : "opacity-40 group-hover:opacity-75"
                }`}
              />
            </div>

            {activeIndex === index && (
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-orange-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PROJECTS PAGE
========================================================= */

function Projects() {
  const [invensionActive, setInvensionActive] = useState(0);
  const [unitradeActive, setUnitradeActive] = useState(0);

  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (images, index) => {
    setLightbox({
      images,
      index,
    });
  };

  const closeLightbox = () => {
    setLightbox(null);
  };

  const lightboxPrevious = () => {
    setLightbox((current) => ({
      ...current,
      index:
        current.index === 0 ? current.images.length - 1 : current.index - 1,
    }));
  };

  const lightboxNext = () => {
    setLightbox((current) => ({
      ...current,
      index:
        current.index === current.images.length - 1 ? 0 : current.index + 1,
    }));
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="home-grid pointer-events-none absolute inset-0" />
      <div className="home-moving-light pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute right-[5%] top-[12%] h-[520px] w-[520px] rounded-full bg-orange-500/[0.025] blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[10%] left-[4%] h-[420px] w-[420px] rounded-full bg-white/[0.015] blur-[150px]" />

      {/* FLOATING DECORATIONS */}
      <Code2
        size={34}
        className="tech-float tech-float-one pointer-events-none absolute left-[5%] top-[14%] hidden text-orange-400/15 lg:block"
      />

      <Cpu
        size={30}
        className="tech-float tech-float-two pointer-events-none absolute right-[7%] top-[17%] hidden text-orange-400/15 lg:block"
      />

      <Database
        size={28}
        className="tech-float tech-float-three pointer-events-none absolute bottom-[14%] right-[10%] hidden text-white/[0.05] lg:block"
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-16 lg:pt-12">
        {/* PAGE INDICATOR */}
        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-400">
            04
          </span>

          <div className="h-px w-12 bg-orange-400/50" />

          <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Projects
          </span>
        </div>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <div className="grid items-end gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-orange-500">
              Selected Work
            </p>

            <h1 className="max-w-3xl text-4xl font-medium leading-[1] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Projects built through
              <span className="block text-zinc-500">technology & ideas.</span>
            </h1>
          </div>

          <div className="max-w-lg lg:justify-self-end">
            <p className="text-sm leading-7 text-zinc-500">
              A selection of work involving web development, engineering,
              hardware-software integration, and digital product concepts.
            </p>
          </div>
        </div>

        {/* =====================================================
            PROJECT 01 — INVENSION
        ====================================================== */}

        <article className="mt-12">
          {/* HEADER */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] tracking-[0.22em] text-orange-400">
                  01 / 02
                </span>

                <div className="h-px w-8 bg-orange-400/40" />

                <span className="text-[8px] uppercase tracking-[0.26em] text-zinc-600">
                  Featured Project
                </span>
              </div>

              <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
                InvenSion
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
                RFID-Driven Real-Time Inventory Monitoring and Automated POS
                Integration System
              </p>
            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-400/20 bg-orange-400/[0.035] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-orange-400">
                Thesis Project
              </span>

              <span className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-zinc-500">
                Hardware + Software
              </span>
            </div>
          </div>

          {/* PROJECT LAYOUT */}
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            {/* SCREENSHOTS */}
            <ProjectGallery
              images={invensionImages}
              activeIndex={invensionActive}
              setActiveIndex={setInvensionActive}
              label="InvenSion / System Interface"
              onExpand={() => openLightbox(invensionImages, invensionActive)}
            />

            {/* DETAILS */}
            <div>
              {/* SUMMARY */}
              <div className="border-b border-white/[0.08] pb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                  <Radio size={17} />
                </div>

                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  InvenSion is an integrated RFID inventory and Point-of-Sale
                  system designed to automate product tracking, inventory
                  monitoring, and retail transactions.
                </p>

                <p className="mt-3 text-xs leading-6 text-zinc-600">
                  A custom UHF RFID reader and Raspberry Pi communicate with the
                  web platform to support real-time scanning and inventory
                  updates.
                </p>
              </div>

              {/* KEY AREAS */}
              <div className="border-b border-white/[0.08] py-6">
                <p className="text-[8px] uppercase tracking-[0.27em] text-zinc-600">
                  Key Areas
                </p>

                <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5">
                  <div>
                    <Radio size={14} className="text-orange-400" />

                    <p className="mt-2 text-xs font-medium text-zinc-300">
                      RFID Integration
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-zinc-600">
                      Real-time tag scanning.
                    </p>
                  </div>

                  <div>
                    <Database size={14} className="text-orange-400" />

                    <p className="mt-2 text-xs font-medium text-zinc-300">
                      Inventory
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-zinc-600">
                      Stock and batch tracking.
                    </p>
                  </div>

                  <div>
                    <Users size={14} className="text-orange-400" />

                    <p className="mt-2 text-xs font-medium text-zinc-300">
                      Users
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-zinc-600">
                      Account management.
                    </p>
                  </div>

                  <div>
                    <ShieldCheck size={14} className="text-orange-400" />

                    <p className="mt-2 text-xs font-medium text-zinc-300">
                      Permissions
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-zinc-600">
                      Role-based access.
                    </p>
                  </div>
                </div>
              </div>

              {/* TECHNOLOGIES */}
              <div className="border-b border-white/[0.08] py-6">
                <p className="text-[8px] uppercase tracking-[0.27em] text-zinc-600">
                  Technologies
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {invensionTech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] text-zinc-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-3 gap-3 pt-6">
                {invensionMetrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-lg font-medium tracking-tight text-white sm:text-xl">
                      {metric.value}
                    </p>

                    <p className="mt-1 text-[7px] uppercase leading-4 tracking-[0.15em] text-zinc-600">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* =====================================================
            PROJECT DIVIDER
        ====================================================== */}

        <div className="my-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-white/[0.02]" />

          <span className="font-mono text-[8px] tracking-[0.25em] text-zinc-700">
            PROJECT / 02
          </span>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.08] to-white/[0.02]" />
        </div>

        {/* =====================================================
            PROJECT 02 — UNITRADE
        ====================================================== */}

        <article>
          {/* HEADER */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] tracking-[0.22em] text-orange-400">
                  02 / 02
                </span>

                <div className="h-px w-8 bg-orange-400/40" />

                <span className="text-[8px] uppercase tracking-[0.26em] text-zinc-600">
                  Venture Project
                </span>
              </div>

              <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
                UniTrade
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Campus-Based Peer-to-Peer Marketplace
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-400/20 bg-orange-400/[0.035] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-orange-400">
                Marketplace
              </span>

              <span className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-zinc-500">
                Venture Concept
              </span>
            </div>
          </div>

          {/* UNITRADE LAYOUT */}
          <div className="grid gap-9 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
            {/* DETAILS */}
            <div className="order-2 lg:order-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                <ShoppingBag size={17} />
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                UniTrade is a campus-focused marketplace concept designed to
                provide students and staff with a safer and more trusted way to
                buy and sell within their university community.
              </p>

              {/* FEATURES */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <p className="text-[8px] uppercase tracking-[0.27em] text-zinc-600">
                  Platform Features
                </p>

                <div className="mt-4">
                  {unitradeFeatures.map((feature, index) => (
                    <div
                      key={feature}
                      className="group flex items-center justify-between border-b border-white/[0.05] py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[8px] text-zinc-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-xs text-zinc-400 transition-colors duration-300 group-hover:text-white">
                          {feature}
                        </span>
                      </div>

                      <ArrowUpRight
                        size={12}
                        className="text-zinc-700 transition-colors duration-300 group-hover:text-orange-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTRIBUTION */}
              <div className="mt-6 border-l border-orange-400/30 pl-4">
                <p className="text-[8px] uppercase tracking-[0.25em] text-orange-400">
                  My Contribution
                </p>

                <p className="mt-2 text-[10px] leading-5 text-zinc-500">
                  Contributed to the target market, business model, financial
                  projections, and venture presentation.
                </p>
              </div>
            </div>

            {/* SCREENSHOTS */}
            <div className="order-1 lg:order-2">
              <ProjectGallery
                images={unitradeImages}
                activeIndex={unitradeActive}
                setActiveIndex={setUnitradeActive}
                label="UniTrade / Interface Concept"
                onExpand={() => openLightbox(unitradeImages, unitradeActive)}
              />
            </div>
          </div>
        </article>

        {/* =====================================================
            END
        ====================================================== */}

        <div className="mt-16 border-t border-white/[0.08] pt-8">
          <p className="text-[8px] uppercase tracking-[0.28em] text-zinc-700">
            Selected Projects
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            More projects will be added as I continue building and learning.
          </p>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <span className="font-mono text-[8px] tracking-[0.22em] text-zinc-700">
            {"< PROJECTS />"}
          </span>

          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>

      {/* =====================================================
          FULLSCREEN LIGHTBOX
      ====================================================== */}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-8 backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400"
            aria-label="Close fullscreen screenshot"
          >
            <X size={18} />
          </button>

          {/* PREVIOUS */}
          {lightbox.images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                lightboxPrevious();
              }}
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-zinc-300 transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400 sm:left-7"
              aria-label="Previous fullscreen screenshot"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* IMAGE */}
          <div
            className="relative max-h-[88vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index].image}
              alt={lightbox.images[lightbox.index].title}
              className="max-h-[82vh] max-w-full rounded-lg border border-white/10 object-contain shadow-2xl"
            />

            <div className="mt-4 flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-medium text-white">
                  {lightbox.images[lightbox.index].title}
                </p>

                <p className="mt-1 font-mono text-[8px] tracking-[0.18em] text-zinc-600">
                  {String(lightbox.index + 1).padStart(2, "0")} /{" "}
                  {String(lightbox.images.length).padStart(2, "0")}
                </p>
              </div>

              <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-700">
                PROJECT PREVIEW
              </span>
            </div>
          </div>

          {/* NEXT */}
          {lightbox.images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                lightboxNext();
              }}
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-zinc-300 transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400 sm:right-7"
              aria-label="Next fullscreen screenshot"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Projects;
