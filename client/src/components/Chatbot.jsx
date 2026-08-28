import { useEffect, useRef, useState } from "react";

import { ArrowUpRight, Send, Sparkles, UserRound, X } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import historiaHead from "../assets/historia-head.png";
import historiaBot from "../assets/historia-bot.png";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "hira_local_chat";

/* =========================================================
   STARTER MESSAGE
========================================================= */

const starterMessage = {
  role: "assistant",
  content:
    "Hi, I'm HIRA — Daniel's portfolio assistant. I can help you explore his projects, skills, education, experience, and other information available in this portfolio. What would you like to know?",
};

/* =========================================================
   QUICK QUESTIONS
========================================================= */

const quickQuestions = [
  "Tell me about Daniel",
  "What is InvenSion?",
  "What are Daniel's skills?",
];

/* =========================================================
   PORTFOLIO KNOWLEDGE
========================================================= */

const knowledge = {
  daniel: {
    short:
      "Daniel F. Domingo is a Computer Engineering graduate from Bulacan State University – Meneses Campus. His portfolio focuses on web development, hardware-software integration, IT support, multimedia, and technical projects.",

    detailed:
      "Daniel F. Domingo studied Bachelor of Science in Computer Engineering at Bulacan State University – Meneses Campus from 2022 to 2026. His experience covers web development, hardware and embedded systems, IT support, multimedia, and system integration.",
  },

  location: {
    text: "Daniel is based in Bulacan, Philippines.",
  },

  education: {
    text: "Daniel studied Bachelor of Science in Computer Engineering at Bulacan State University – Meneses Campus from 2022 to 2026.",
  },

  invension: {
    overview:
      "InvenSion is an RFID-driven real-time inventory monitoring and automated Point-of-Sale integration system. It combines a web platform with RFID hardware to support product scanning, inventory updates, stock monitoring, user management, and role-based permissions.",

    contribution:
      "Daniel contributed to the software and hardware integration of InvenSion. His role involved helping connect the RFID-based hardware setup with the web system so the components could work together for real-time operation.",

    technologies:
      "InvenSion uses React, Vite, Spring Boot, MySQL, WebSocket, AWS, Raspberry Pi 4, and UHF RFID.",

    metrics:
      "The portfolio presents these InvenSion results: an average transaction time of 37.9 seconds, a 78.9% speed improvement, and 100% inventory accuracy.",

    features:
      "Some of InvenSion's main areas include RFID integration, real-time tag scanning, stock and batch tracking, user account management, and role-based permissions.",
  },

  unitrade: {
    overview:
      "UniTrade is a campus-based peer-to-peer marketplace concept designed to provide students and staff with a safer and more trusted way to buy and sell within their university community.",

    contribution:
      "Daniel contributed to UniTrade's target-market planning, business model, financial projections, and venture presentation.",

    features:
      "UniTrade's planned features include verified campus accounts, marketplace listings, user profiles, secure messaging, ratings and reviews, search, and filtering.",

    technologies:
      "The portfolio does not specify a confirmed programming technology stack for UniTrade.",
  },

  projects: {
    text: "Daniel currently highlights two main projects in this portfolio: InvenSion, an RFID inventory and POS integration system, and UniTrade, a campus-based peer-to-peer marketplace concept.",
  },

  frontend: {
    text: "Daniel's frontend skills include React, JavaScript / JSX, TypeScript, Vite, Tailwind CSS, React Router, HTML, and CSS.",
  },

  backend: {
    text: "Daniel has experience with backend and data technologies including Spring Boot, Java, MySQL, REST APIs, WebSocket, AWS, and Node.js.",
  },

  hardware: {
    text: "Daniel's hardware and embedded-system experience includes Raspberry Pi 4, UHF RFID, Arduino, microcontrollers, sensor integration, basic electronics, and USB-to-UART tools.",
  },

  itSupport: {
    text: "Daniel has practical IT support experience involving hardware troubleshooting, software troubleshooting, computer assembly, workstation setup, peripheral installation, system configuration, preventive maintenance, and technical assistance.",
  },

  multimedia: {
    text: "Daniel's multimedia skills include photography, videography, video editing, DaVinci Resolve, CapCut, Canva, Adobe Photoshop, and event documentation.",
  },

  tools: {
    text: "Daniel works with tools including Visual Studio Code, GitHub, AutoCAD, Microsoft Word, Microsoft Excel, and Microsoft PowerPoint.",
  },

  programming: {
    text: "Daniel has worked with JavaScript / JSX, TypeScript, Java, C++, Python, and PHP. His portfolio also includes React and Node.js development experience.",
  },

  skills: {
    text: "Daniel's skill set covers frontend development, backend and data technologies, hardware and embedded systems, IT support, multimedia, and development tools. Some examples are React, JavaScript, Spring Boot, MySQL, Raspberry Pi, RFID, Arduino, Photoshop, DaVinci Resolve, GitHub, and AutoCAD.",
  },

  strengths: {
    text: "Daniel's professional strengths include problem solving, analytical thinking, team collaboration, communication, adaptability, and continuous learning.",
  },

  experience: {
    text: "Daniel completed practical experience at Paradigma International Inc., including Multimedia Assistant work in June 2025 and IT Support Assistant experience in July 2025. His portfolio also includes event multimedia coverage for the BTS Comeback Watch Party at Novel Hotel Manila on March 26, 2026.",
  },

  paradigma: {
    text: "At Paradigma International Inc., Daniel gained experience as a Multimedia Assistant in June 2025 and as an IT Support Assistant in July 2025.",
  },

  contact: {
    text: "You can contact Daniel through the Contact page of this website. You can also start a private website conversation there, or use the LinkedIn and Facebook links listed on the Contact page.",
  },
};

/* =========================================================
   TEXT NORMALIZER
========================================================= */

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   MATCH HELPERS
========================================================= */

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

/* =========================================================
   SIMPLE LANGUAGE DETECTION
========================================================= */

function isTagalog(text) {
  return includesAny(text, [
    "ano",
    "sino",
    "saan",
    "paano",
    "anong",
    "ginawa",
    "kaya",
    "meron",
    "may",
    "niya",
    "nya",
    "siya",
    "sya",
    "kay",
    "ni",
    "ang",
    "yung",
    "yong",
    "ung",
    "tungkol",
    "trabaho",
    "project nya",
    "skills nya",
  ]);
}

const customReplies = [
  {
    triggers: [
      {
        text: "Kupal",
        language: "tagalog",
      },
      {
        text: "Jerk, idiot, moron, stupid, dumb, fool, imbecile, idiot, jerk, asshole",
        language: "english",
      },
    ],

    tagalog:
      "kupal ka rin bossing. Pero wag kang mag-alala, nandito ako para tulungan ka sa information tungkol kay Daniel at sa portfolio niya.",

    english:
      "don't use offensive language. I'm here to help you with information about Daniel and his portfolio.",
  },

  {
    triggers: [
      {
        text: "tagalog trigger 2",
        language: "tagalog",
      },
      {
        text: "price",
        language: "english",
      },
    ],

    tagalog: "Tagalog reply 2",

    english: "English reply 2",
  },

  {
    triggers: [
      {
        text: "price",
        language: "english",
      },
      {
        text: "pricing",
        language: "english",
      },
      {
        text: "how much",
        language: "english",
      },
      {
        text: "how much is a website",
        language: "english",
      },
      {
        text: "website price",
        language: "english",
      },
      {
        text: "website pricing",
        language: "english",
      },
      {
        text: "magkano",
        language: "tagalog",
      },
      {
        text: "magkano website",
        language: "tagalog",
      },
      {
        text: "ano presyo",
        language: "tagalog",
      },
      {
        text: "presyo ng website",
        language: "tagalog",
      },
    ],

    tagalog:
      "Depende ang presyo sa type, features, complexity, at scope ng website. Sabihin mo lang kung anong klaseng website ang kailangan mo para mabigyan ka ng mas accurate na estimate.",

    english:
      "Pricing depends on the type of website, required features, complexity, and overall scope. Tell me what kind of website you need and I can give you a more appropriate estimate.",
  },

  {
    triggers: [
      {
        text: "price range",
        language: "english",
      },
      {
        text: "website price range",
        language: "english",
      },
      {
        text: "what is the price range",
        language: "english",
      },
      {
        text: "what is your range",
        language: "english",
      },
      {
        text: "range",
        language: "english",
      },
      {
        text: "magkano range",
        language: "tagalog",
      },
      {
        text: "ano price range",
        language: "tagalog",
      },
      {
        text: "ano range ng presyo",
        language: "tagalog",
      },
    ],

    tagalog:
      "Nagva-vary ang price range depende sa project. Mas simple at frontend-only na website ay mas mababa, habang mas complex at fully functional na website ay mas mataas dahil may additional development at features.",

    english:
      "The price range varies depending on the project. A simple frontend-only website generally costs less, while a more complex and fully functional website costs more because of the additional development and features involved.",
  },

  {
    triggers: [
      {
        text: "how much is the frontend website",
        language: "english",
      },
      {
        text: "how much is a frontend website",
        language: "english",
      },
      {
        text: "frontend website price",
        language: "english",
      },
      {
        text: "frontend price",
        language: "english",
      },
      {
        text: "frontend only price",
        language: "english",
      },
      {
        text: "how much for frontend only",
        language: "english",
      },
      {
        text: "magkano frontend website",
        language: "tagalog",
      },
      {
        text: "magkano frontend",
        language: "tagalog",
      },
      {
        text: "presyo ng frontend website",
        language: "tagalog",
      },
      {
        text: "magkano frontend only",
        language: "tagalog",
      },
    ],

    tagalog:
      "Para sa frontend-only website, depende ang presyo sa number of pages, design, responsiveness, animations, at complexity ng interface. Mas accurate ang quotation kapag alam na ang complete requirements ng project.",

    english:
      "For a frontend-only website, pricing depends on the number of pages, design requirements, responsiveness, animations, and interface complexity. A more accurate quotation can be provided once the complete project requirements are known.",
  },

  {
    triggers: [
      {
        text: "how much is a fully functional website",
        language: "english",
      },
      {
        text: "how much is the fully functional website",
        language: "english",
      },
      {
        text: "fully functional website price",
        language: "english",
      },
      {
        text: "full website price",
        language: "english",
      },
      {
        text: "full stack website price",
        language: "english",
      },
      {
        text: "how much for a complete website",
        language: "english",
      },
      {
        text: "magkano fully functional website",
        language: "tagalog",
      },
      {
        text: "magkano complete website",
        language: "tagalog",
      },
      {
        text: "magkano full website",
        language: "tagalog",
      },
      {
        text: "presyo ng fully functional website",
        language: "tagalog",
      },
    ],

    tagalog:
      "Mas mataas ang presyo ng fully functional website dahil maaaring kasama ang frontend, backend, database, authentication, forms, messaging, admin features, at iba pang functionality. Final pricing ay depende sa complete scope at requirements.",

    english:
      "A fully functional website generally costs more because it may include frontend development, backend functionality, a database, authentication, forms, messaging, admin features, and other systems. Final pricing depends on the complete scope and requirements.",
  },

  {
    triggers: [
      {
        text: "do you have an offer",
        language: "english",
      },
      {
        text: "what is your offer",
        language: "english",
      },
      {
        text: "any offer",
        language: "english",
      },
      {
        text: "do you offer packages",
        language: "english",
      },
      {
        text: "website package",
        language: "english",
      },
      {
        text: "packages",
        language: "english",
      },
      {
        text: "may offer ba",
        language: "tagalog",
      },
      {
        text: "ano offer",
        language: "tagalog",
      },
      {
        text: "may package ba",
        language: "tagalog",
      },
      {
        text: "ano package",
        language: "tagalog",
      },
    ],

    tagalog:
      "Pwedeng magbigay ng project-based offer depende sa kailangan mong website. Mas okay kung ibibigay mo muna ang features, number of pages, design requirements, at expected functionality para makagawa ng appropriate package.",

    english:
      "A project-based offer can be prepared depending on the type of website you need. Providing the required features, number of pages, design requirements, and expected functionality will help determine an appropriate package.",
  },

  {
    triggers: [
      {
        text: "can i get a quotation",
        language: "english",
      },
      {
        text: "quotation",
        language: "english",
      },
      {
        text: "can you give me a quote",
        language: "english",
      },
      {
        text: "website quotation",
        language: "english",
      },
      {
        text: "estimate",
        language: "english",
      },
      {
        text: "can i get an estimate",
        language: "english",
      },
      {
        text: "pwede makahingi quotation",
        language: "tagalog",
      },
      {
        text: "pwede magpa quote",
        language: "tagalog",
      },
      {
        text: "magkano estimate",
        language: "tagalog",
      },
      {
        text: "quotation ng website",
        language: "tagalog",
      },
    ],

    tagalog:
      "Oo. Para makagawa ng accurate quotation, kailangan muna ang basic project details tulad ng type ng website, number of pages, required features, design preference, at kung frontend-only o fully functional system ang kailangan.",

    english:
      "Yes. To prepare an accurate quotation, the basic project details are needed first, such as the type of website, number of pages, required features, design preferences, and whether you need a frontend-only site or a fully functional system.",
  },

  {
    triggers: [
      {
        text: "is the price negotiable",
        language: "english",
      },
      {
        text: "can you lower the price",
        language: "english",
      },
      {
        text: "can i get a discount",
        language: "english",
      },
      {
        text: "discount",
        language: "english",
      },
      {
        text: "negotiable",
        language: "english",
      },
      {
        text: "tawad",
        language: "tagalog",
      },
      {
        text: "pwede tumawad",
        language: "tagalog",
      },
      {
        text: "negotiable ba",
        language: "tagalog",
      },
      {
        text: "may discount ba",
        language: "tagalog",
      },
      {
        text: "pwede babaan presyo",
        language: "tagalog",
      },
    ],

    tagalog:
      "Maaaring pag-usapan ang pricing depende sa scope at requirements ng project. Kung may specific budget, pwede ring i-adjust ang scope o features para makahanap ng setup na workable para sa parehong sides.",

    english:
      "Pricing can be discussed depending on the project's scope and requirements. If you have a specific budget, the scope or features may also be adjusted to find an arrangement that works for both sides.",
  },
];

/* =========================================================
   LOCAL RESPONSE ENGINE
========================================================= */

function generateHiraReply(message, previousTopic) {
  const text = normalizeText(message);

  const tagalog = isTagalog(text);

  /* ---------------------------------------------------------
     CUSTOM REPLIES
  --------------------------------------------------------- */

  const customMatches = customReplies.flatMap((item) =>
    item.triggers.flatMap((trigger) => {
      const triggerOptions = trigger.text
        .split(",")
        .map((option) => normalizeText(option))
        .filter(Boolean);

      return triggerOptions
        .filter((option) => text === option || text.includes(option))
        .map((option) => ({
          item,
          language: trigger.language,
          matchLength: option.length,
        }));
    }),
  );

  const customMatch = customMatches.sort(
    (a, b) => b.matchLength - a.matchLength,
  )[0];

  if (customMatch) {
    return {
      topic: previousTopic,

      reply:
        customMatch.language === "tagalog"
          ? customMatch.item.tagalog
          : customMatch.item.english,
    };
  }
  /* ---------------------------------------------------------
     GREETINGS
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "kamusta",
      "kumusta",
    ])
  ) {
    return {
      topic: previousTopic,
      reply: tagalog
        ? "Hello! Ako si HIRA. Pwede mo akong tanungin tungkol kay Daniel, sa projects niya, skills, education, experience, o kung paano siya ma-contact."
        : "Hi! I'm HIRA. You can ask me about Daniel, his projects, skills, education, experience, or how to contact him.",
    };
  }

  /* ---------------------------------------------------------
     WHO IS HIRA
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "who are you",
      "what are you",
      "your name",
      "who is hira",
      "what is hira",
      "sino ka",
      "ano ka",
      "pangalan mo",
    ])
  ) {
    return {
      topic: "hira",
      reply: tagalog
        ? "Ako si HIRA, ang portfolio assistant ng Historia. Hindi ako si Daniel, pero matutulungan kitang hanapin at maintindihan ang information tungkol sa projects, skills, education, at experience niya."
        : "I'm HIRA, the portfolio assistant for Historia. I'm not Daniel, but I can help you explore information about his projects, skills, education, and experience.",
    };
  }

  /* ---------------------------------------------------------
     DANIEL GENERAL
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "who is daniel",
      "tell me about daniel",
      "about daniel",
      "who is daniel domingo",
      "sino si daniel",
      "sino si daniel domingo",
      "tungkol kay daniel",
    ])
  ) {
    return {
      topic: "daniel",
      reply: knowledge.daniel.detailed,
    };
  }

  /* ---------------------------------------------------------
     LOCATION
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "where is daniel",
      "where does daniel live",
      "location",
      "where is he from",
      "where are you from",
      "saan si daniel",
      "taga saan",
      "taga saan si daniel",
      "saan nakatira",
    ])
  ) {
    return {
      topic: "location",
      reply: knowledge.location.text,
    };
  }

  /* ---------------------------------------------------------
     EDUCATION / COURSE
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "education",
      "school",
      "college",
      "university",
      "course",
      "degree",
      "studied",
      "graduate",
      "computer engineering",
      "ano course",
      "anong course",
      "saan nag aral",
      "saan nagaral",
      "school ni daniel",
    ])
  ) {
    return {
      topic: "education",
      reply: knowledge.education.text,
    };
  }

  /* ---------------------------------------------------------
     INVENSION
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "invension",
      "thesis",
      "rfid project",
      "inventory project",
    ])
  ) {
    if (
      includesAny(text, [
        "contribution",
        "contribute",
        "role",
        "worked on",
        "responsibility",
        "what did daniel do",
        "what did he do",
        "ginawa",
        "ambag",
        "tulong",
      ])
    ) {
      return {
        topic: "invension",
        reply: knowledge.invension.contribution,
      };
    }

    if (
      includesAny(text, [
        "technology",
        "technologies",
        "tech stack",
        "stack",
        "framework",
        "language",
        "ginamit",
      ])
    ) {
      return {
        topic: "invension",
        reply: knowledge.invension.technologies,
      };
    }

    if (
      includesAny(text, [
        "result",
        "results",
        "metric",
        "metrics",
        "accuracy",
        "speed",
        "transaction",
        "performance",
      ])
    ) {
      return {
        topic: "invension",
        reply: knowledge.invension.metrics,
      };
    }

    if (
      includesAny(text, [
        "feature",
        "features",
        "function",
        "functions",
        "capabilities",
        "what can it do",
      ])
    ) {
      return {
        topic: "invension",
        reply: knowledge.invension.features,
      };
    }

    return {
      topic: "invension",
      reply: knowledge.invension.overview,
    };
  }

  /* ---------------------------------------------------------
     UNITRADE
  --------------------------------------------------------- */

  if (includesAny(text, ["unitrade", "marketplace", "campus marketplace"])) {
    if (
      includesAny(text, [
        "contribution",
        "contribute",
        "role",
        "worked on",
        "responsibility",
        "what did daniel do",
        "what did he do",
        "ginawa",
        "ambag",
        "tulong",
      ])
    ) {
      return {
        topic: "unitrade",
        reply: knowledge.unitrade.contribution,
      };
    }

    if (
      includesAny(text, [
        "technology",
        "technologies",
        "tech stack",
        "stack",
        "framework",
        "language",
        "ginamit",
      ])
    ) {
      return {
        topic: "unitrade",
        reply: knowledge.unitrade.technologies,
      };
    }

    if (
      includesAny(text, [
        "feature",
        "features",
        "function",
        "functions",
        "what can it do",
      ])
    ) {
      return {
        topic: "unitrade",
        reply: knowledge.unitrade.features,
      };
    }

    return {
      topic: "unitrade",
      reply: knowledge.unitrade.overview,
    };
  }

  /* ---------------------------------------------------------
     FOLLOW-UP: CONTRIBUTION
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "what did he contribute",
      "what was his contribution",
      "his contribution",
      "what did daniel do",
      "what was his role",
      "what did he do",
      "ano contribution",
      "ano ginawa niya",
      "ano ginawa nya",
      "ano ambag niya",
      "ano ambag nya",
    ])
  ) {
    if (previousTopic === "invension") {
      return {
        topic: "invension",
        reply: knowledge.invension.contribution,
      };
    }

    if (previousTopic === "unitrade") {
      return {
        topic: "unitrade",
        reply: knowledge.unitrade.contribution,
      };
    }
  }

  /* ---------------------------------------------------------
     FOLLOW-UP: TECHNOLOGY
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "what technologies",
      "what technology",
      "what tech",
      "what stack",
      "what did they use",
      "what was used",
      "ano ginamit",
      "anong technology",
      "anong technologies",
      "tech stack",
    ])
  ) {
    if (previousTopic === "invension") {
      return {
        topic: "invension",
        reply: knowledge.invension.technologies,
      };
    }

    if (previousTopic === "unitrade") {
      return {
        topic: "unitrade",
        reply: knowledge.unitrade.technologies,
      };
    }
  }

  /* ---------------------------------------------------------
     FOLLOW-UP: FEATURES
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "what are the features",
      "what features",
      "features",
      "what can it do",
      "ano features",
      "anong features",
    ])
  ) {
    if (previousTopic === "invension") {
      return {
        topic: "invension",
        reply: knowledge.invension.features,
      };
    }

    if (previousTopic === "unitrade") {
      return {
        topic: "unitrade",
        reply: knowledge.unitrade.features,
      };
    }
  }

  /* ---------------------------------------------------------
     PROJECTS GENERAL
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "projects",
      "project",
      "portfolio projects",
      "what has he built",
      "what did he build",
      "mga project",
      "projects niya",
      "projects nya",
    ])
  ) {
    return {
      topic: "projects",
      reply: knowledge.projects.text,
    };
  }

  /* ---------------------------------------------------------
     REACT
  --------------------------------------------------------- */

  if (includesAny(text, ["react", "does he know react", "can he use react"])) {
    return {
      topic: "frontend",
      reply:
        "Yes. React is included in Daniel's frontend development skill set, along with JavaScript / JSX, TypeScript, Vite, Tailwind CSS, React Router, HTML, and CSS.",
    };
  }

  /* ---------------------------------------------------------
     FRONTEND
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "frontend",
      "front end",
      "web development",
      "html",
      "css",
      "javascript",
      "tailwind",
      "vite",
      "typescript",
    ])
  ) {
    return {
      topic: "frontend",
      reply: knowledge.frontend.text,
    };
  }

  /* ---------------------------------------------------------
     BACKEND
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "backend",
      "back end",
      "spring boot",
      "mysql",
      "websocket",
      "rest api",
      "node js",
      "nodejs",
      "aws",
      "java",
    ])
  ) {
    return {
      topic: "backend",
      reply: knowledge.backend.text,
    };
  }

  /* ---------------------------------------------------------
     HARDWARE
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "hardware",
      "embedded",
      "raspberry pi",
      "rfid",
      "arduino",
      "microcontroller",
      "microcontrollers",
      "sensor",
      "electronics",
    ])
  ) {
    return {
      topic: "hardware",
      reply: knowledge.hardware.text,
    };
  }

  /* ---------------------------------------------------------
     IT SUPPORT
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "it support",
      "technical support",
      "troubleshooting",
      "computer assembly",
      "workstation",
      "maintenance",
    ])
  ) {
    return {
      topic: "itSupport",
      reply: knowledge.itSupport.text,
    };
  }

  /* ---------------------------------------------------------
     MULTIMEDIA
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "multimedia",
      "photography",
      "videography",
      "video editing",
      "editing",
      "davinci",
      "capcut",
      "photoshop",
      "canva",
      "camera",
    ])
  ) {
    return {
      topic: "multimedia",
      reply: knowledge.multimedia.text,
    };
  }

  /* ---------------------------------------------------------
     PROGRAMMING LANGUAGES
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "programming language",
      "programming languages",
      "languages",
      "python",
      "php",
      "c++",
      "cpp",
    ])
  ) {
    return {
      topic: "programming",
      reply: knowledge.programming.text,
    };
  }

  /* ---------------------------------------------------------
     TOOLS
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "tools",
      "software tools",
      "github",
      "vscode",
      "visual studio code",
      "autocad",
      "microsoft word",
      "excel",
      "powerpoint",
    ])
  ) {
    return {
      topic: "tools",
      reply: knowledge.tools.text,
    };
  }

  /* ---------------------------------------------------------
     SKILLS GENERAL
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "skills",
      "skill",
      "what can daniel do",
      "what does daniel know",
      "what is he good at",
      "kaya ni daniel",
      "skills ni daniel",
      "skills niya",
      "skills nya",
    ])
  ) {
    return {
      topic: "skills",
      reply: knowledge.skills.text,
    };
  }

  /* ---------------------------------------------------------
     STRENGTHS
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "strength",
      "strengths",
      "soft skills",
      "professional strengths",
      "qualities",
    ])
  ) {
    return {
      topic: "strengths",
      reply: knowledge.strengths.text,
    };
  }

  /* ---------------------------------------------------------
     PARADIGMA
  --------------------------------------------------------- */

  if (includesAny(text, ["paradigma"])) {
    return {
      topic: "experience",
      reply: knowledge.paradigma.text,
    };
  }

  /* ---------------------------------------------------------
     EXPERIENCE / OJT
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "experience",
      "ojt",
      "internship",
      "intern",
      "work experience",
      "employment",
      "worked",
      "trabaho",
      "experience niya",
      "experience nya",
    ])
  ) {
    return {
      topic: "experience",
      reply: knowledge.experience.text,
    };
  }

  /* ---------------------------------------------------------
     CONTACT
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "contact",
      "email",
      "message daniel",
      "message him",
      "talk to daniel",
      "talk to him",
      "reach daniel",
      "reach him",
      "linkedin",
      "facebook",
      "how can i contact",
      "how do i contact",
      "how to contact",
      "how can i talk to daniel",
      "how can i talk to him",
      "how do i talk to daniel",

      "paano contact",
      "paano ko contact",
      "paano ko siya macontact",
      "paano ko sya macontact",

      "paano makausap",
      "paano ko makausap",
      "paano ko siya makausap",
      "paano ko sya makausap",

      "paano ko siya makakausap",
      "paano ko sya makakausap",

      "makausap si daniel",
      "makakausap si daniel",
      "makakausap ko si daniel",

      "makausap",
      "makakausap",
      "kausapin",
      "makipag usap",
      "makipagusap",

      "kausapin si daniel",
      "paano kausapin si daniel",
      "paano ko kakausapin si daniel",

      "send message",
      "send him a message",
      "mag message",
      "magmessage",
      "message ko",
    ])
  ) {
    return {
      topic: "contact",
      reply: tagalog
        ? "Pwede mo siyang kontakin sa Contact page ng website na ito. Pwede ka rin magsimula ng private conversation sa website, o gamitin ang LinkedIn at Facebook links na nakalagay sa Contact page."
        : "You can contact him through the Contact page of this website. You can also start a private conversation on the website, or use the LinkedIn and Facebook links listed on the Contact page.",
    };
  }

  /* ---------------------------------------------------------
     THANK YOU
  --------------------------------------------------------- */

  if (includesAny(text, ["thank you", "thanks", "thankyou", "salamat"])) {
    return {
      topic: previousTopic,
      reply: tagalog
        ? "You're welcome! Pwede mo pa akong tanungin tungkol sa projects, skills, experience, education, o contact information ni Daniel."
        : "You're welcome! Feel free to ask me anything else about Daniel's projects, skills, experience, education, or contact information.",
    };
  }

  /* ---------------------------------------------------------
     HELP
  --------------------------------------------------------- */

  if (
    includesAny(text, [
      "help",
      "what can you do",
      "what can i ask",
      "what should i ask",
      "ano pwede itanong",
      "anong pwede itanong",
    ])
  ) {
    return {
      topic: previousTopic,
      reply: tagalog
        ? "Pwede mo akong tanungin tungkol kay Daniel, InvenSion, UniTrade, frontend development, hardware, IT support, multimedia, education, OJT experience, skills, at contact information."
        : "You can ask me about Daniel, InvenSion, UniTrade, frontend development, hardware, IT support, multimedia, education, OJT experience, skills, and contact information.",
    };
  }

  /* ---------------------------------------------------------
     FALLBACK
  --------------------------------------------------------- */

  return {
    topic: previousTopic,

    reply: tagalog
      ? "Wala pa akong sapat na information para sagutin nang maayos iyon. Pero pwede mo akong tanungin tungkol kay Daniel, InvenSion, UniTrade, skills, education, experience, hardware, multimedia, o contact information niya."
      : "I don't have enough portfolio information to answer that accurately yet. You can ask me about Daniel, InvenSion, UniTrade, his skills, education, experience, hardware work, multimedia experience, or contact information.",
  };
}

/* =========================================================
   LOAD CHAT
========================================================= */

function loadStoredChat() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        messages: [starterMessage],

        topic: null,
      };
    }

    const parsed = JSON.parse(stored);

    if (!parsed || !Array.isArray(parsed.messages)) {
      return {
        messages: [starterMessage],

        topic: null,
      };
    }

    return {
      messages: parsed.messages.length ? parsed.messages : [starterMessage],

      topic: parsed.topic || null,
    };
  } catch {
    return {
      messages: [starterMessage],

      topic: null,
    };
  }
}

/* =========================================================
   HIRA
========================================================= */

function Chatbot() {
  const navigate = useNavigate();

  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    const savedChat = loadStoredChat();

    return savedChat.messages;
  });

  const [currentTopic, setCurrentTopic] = useState(() => {
    const savedChat = loadStoredChat();

    return savedChat.topic;
  });

  const [input, setInput] = useState("");

  const [isThinking, setIsThinking] = useState(false);

  const scrollRef = useRef(null);

  const inputRef = useRef(null);

  const thinkingTimerRef = useRef(null);

  const isPrivateConversation = location.pathname.startsWith("/conversation/");

  /* =========================================================
     SAVE CHAT
  ========================================================= */

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,

        JSON.stringify({
          messages,
          topic: currentTopic,
        }),
      );
    } catch {
      // Ignore browser storage errors.
    }
  }, [messages, currentTopic]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,

        behavior: "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [messages, isThinking, isOpen]);

  /* =========================================================
     AUTO FOCUS
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  /* =========================================================
     CLEAN TIMER
  ========================================================= */

  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current);
      }
    };
  }, []);

  /* =========================================================
     RESET CHAT
  ========================================================= */

  const resetChat = () => {
    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current);
    }

    setIsThinking(false);

    setMessages([starterMessage]);

    setCurrentTopic(null);

    setInput("");

    sessionStorage.removeItem(STORAGE_KEY);
  };

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const sendMessage = (customMessage) => {
    const messageText = (customMessage ?? input).trim();

    if (!messageText || isThinking) {
      return;
    }

    const userMessage = {
      role: "user",
      content: messageText,
    };

    setMessages((current) => [...current, userMessage]);

    setInput("");

    setIsThinking(true);

    const result = generateHiraReply(messageText, currentTopic);

    /* Small delay so HIRA feels conversational */

    const responseDelay = 150;

    thinkingTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,

        {
          role: "assistant",
          content: result.reply,
        },
      ]);

      setCurrentTopic(result.topic);

      setIsThinking(false);

      thinkingTimerRef.current = null;
    }, responseDelay);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    sendMessage();
  };

  /* =========================================================
     ENTER TO SEND
  ========================================================= */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* =========================================================
     MESSAGE DANIEL
  ========================================================= */

  const openHumanChat = () => {
    setIsOpen(false);

    navigate("/contact");
  };

  /* =========================================================
     HIDE ON PRIVATE CONVERSATION
  ========================================================= */

  if (isPrivateConversation) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          CHAT WINDOW
      ====================================================== */}

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-[90] flex h-[min(620px,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-black/95 shadow-2xl shadow-black/70 backdrop-blur-xl sm:bottom-6 sm:right-6">
          {/* HEADER */}

          <div className="relative border-b border-white/[0.08] px-4 py-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-400/[0.035] via-cyan-400/[0.018] to-violet-400/[0.025]" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-orange-400/20 bg-black">
                  <img
                    src={historiaBot}
                    alt="HIRA"
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-400" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white">
                      HIRA
                    </p>

                    <Sparkles size={11} className="shrink-0 text-orange-400" />
                  </div>

                  <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                    Portfolio Assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] text-zinc-500 transition-all duration-300 hover:border-white/20 hover:text-white"
                aria-label="Close HIRA"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* =================================================
              MESSAGES
          ================================================== */}

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
          >
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex items-end gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="mb-1 h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-orange-400/15 bg-black">
                      <img
                        src={historiaBot}
                        alt="HIRA"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-3 text-xs leading-6 ${
                      isUser
                        ? "rounded-br-md border border-orange-400/20 bg-orange-400/[0.08] text-zinc-200"
                        : "rounded-bl-md border border-white/[0.07] bg-white/[0.025] text-zinc-400"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>

                  {isUser && (
                    <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-zinc-500">
                      <UserRound size={13} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* =================================================
                THINKING
            ================================================== */}

            {isThinking && (
              <div className="flex items-end gap-2">
                <div className="mb-1 h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-orange-400/15 bg-black">
                  <img
                    src={historiaBot}
                    alt="HIRA"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:150ms]" />

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                QUICK QUESTIONS
            ================================================== */}

            {messages.length === 1 && !isThinking && (
              <div className="ml-9 pt-1">
                <p className="mb-2 text-[7px] uppercase tracking-[0.22em] text-zinc-700">
                  Try asking
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="rounded-full border border-white/[0.07] bg-white/[0.015] px-3 py-1.5 text-[9px] text-zinc-500 transition-all duration-300 hover:border-orange-400/25 hover:text-zinc-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              MESSAGE DANIEL
          ================================================== */}

          <div className="border-t border-white/[0.07] px-4 py-3">
            <button
              type="button"
              onClick={openHumanChat}
              className="group flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-2.5 transition-all duration-300 hover:border-orange-400/20 hover:bg-orange-400/[0.025]"
            >
              <div>
                <p className="text-left text-[8px] uppercase tracking-[0.22em] text-zinc-600">
                  Need a real conversation?
                </p>

                <p className="mt-1 text-left text-[10px] text-zinc-300">
                  Message Daniel directly
                </p>
              </div>

              <ArrowUpRight
                size={13}
                className="text-orange-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* =================================================
              INPUT
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/[0.07] p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.018] p-2 transition-colors focus-within:border-orange-400/25">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={700}
                disabled={isThinking}
                placeholder="Ask HIRA about Daniel..."
                className="max-h-28 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-2 text-xs leading-5 text-white outline-none placeholder:text-zinc-700 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={isThinking || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-400 text-black transition-all duration-300 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Send message to HIRA"
              >
                <Send size={14} />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 px-1">
              <p className="text-[7px] leading-4 text-zinc-800">
                HIRA uses information available in this portfolio.
              </p>

              <button
                type="button"
                onClick={resetChat}
                className="shrink-0 text-[7px] uppercase tracking-[0.18em] text-zinc-700 transition-colors hover:text-zinc-400"
              >
                Reset chat
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          FLOATING HIRA BUTTON
      ====================================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.1] bg-black/90 text-orange-400 shadow-xl shadow-black/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/35 hover:bg-orange-400/[0.06] sm:bottom-6 sm:right-6"
          aria-label="Open HIRA"
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/[0.06] via-cyan-400/[0.04] to-violet-400/[0.06]" />

          <img
            src={historiaHead}
            alt="Open HIRA"
            className="relative z-10 h-full w-full rounded-full object-cover"
          />

          <span className="absolute right-1 top-1 z-20 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-400" />

          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-white/[0.07] bg-black/90 px-3 py-2 text-[9px] text-zinc-400 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 lg:block">
            Ask HIRA
          </span>
        </button>
      )}
    </>
  );
}

export default Chatbot;
