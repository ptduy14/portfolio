// Curated showcase projects (order is intentional — RAG Agent ranked above Ride-hailing
// for trend value despite 0 stars). `repo` maps to live GitHub stats; star/fork are static
// fallbacks. `demo` = live URL or null (button hidden when null).
export const PROJECTS = [
  {
    title: "MOVIEX — Streaming Platform",
    repo: "movie-web",
    url: "https://github.com/ptduy14/movie-web",
    demo: null,
    category: "Frontend",
    featured: true,
    tags: ["Next.js", "TypeScript", "AI translation", "Firebase"],
    blurb: "A modern streaming platform with AI-powered translation, watch-progress sync and favorites.",
    description:
      "A modern Next.js streaming platform: browse and stream movies, AI-powered subtitle translation, watch-progress sync across devices, favorites, comments and recently-watched history. My most-starred project.",
    stars: 9,
    forks: 7,
  },
  {
    title: "Laboratory Management Admin",
    repo: "laboratory-management-admin",
    url: "https://github.com/ptduy14/laboratory-management-admin",
    demo: null,
    category: "Frontend",
    featured: false,
    tags: ["Next.js", "NextUI", "SWR", "Cloudinary"],
    blurb: "Admin dashboard to manage information and activities of a university laboratory.",
    description:
      "A complete admin dashboard for managing university laboratory resources — equipment, schedules and activities — built with Next.js, NextUI, NextAuth and SWR.",
    stars: 5,
    forks: 3,
  },
  {
    title: "Portfolio RAG Agent",
    repo: "portfolio-rag-agent",
    url: "https://github.com/ptduy14/portfolio-rag-agent",
    demo: null,
    category: "AI",
    featured: false,
    tags: ["RAG", "LLM", "Python"],
    blurb: "The retrieval-augmented agent that powers the 'Ask Me' terminal on this very site.",
    description:
      "A retrieval-augmented generation (RAG) agent that answers questions about me — it's the brain behind the 'Ask Me' terminal in this portfolio. Function-calling enabled (e.g. download CV).",
    stars: 0,
    forks: 0,
  },
  {
    title: "Ride-hailing Service",
    repo: "ride-hailing-service-web-app",
    url: "https://github.com/ptduy14/ride-hailing-service-app",
    demo: null,
    category: "Backend",
    featured: false,
    tags: ["Laravel", "Google Maps", "WebSocket", "Pusher"],
    blurb: "A ride-hailing website connecting drivers and passengers in real time.",
    description:
      "A user-friendly ride-hailing platform connecting drivers and passengers with live maps and real-time updates over WebSocket/Pusher.",
    stars: 3,
    forks: 1,
  },
  {
    title: "Student Grade — Blockchain",
    repo: "student-grade-management-using-blockchain",
    url: "https://github.com/ptduy14/student-grade-management-using-blockchain",
    demo: null,
    category: "Blockchain",
    featured: false,
    tags: ["Solidity", "Geth", "Ethers.js", "Next.js"],
    blurb: "Tamper-proof student grade management stored on a private blockchain.",
    description:
      "A private blockchain system for managing and storing student grades — Solidity smart contracts on a Geth node with an Ethers.js front end, making records tamper-proof.",
    stars: 1,
    forks: 0,
  },
  {
    title: "Laravel E-commerce API",
    repo: "laravel-api-v2",
    url: "https://github.com/ptduy14/laravel-api-v2",
    demo: null,
    category: "Backend",
    featured: false,
    tags: ["Laravel", "JWT", "Swagger"],
    blurb: "RESTful e-commerce API following REST architectural standards.",
    description:
      "An e-commerce API built with Laravel following REST standards, with JWT auth and Swagger documentation.",
    stars: 1,
    forks: 0,
  },
];

export const CATEGORIES = ["All", "Frontend", "Backend", "Blockchain", "AI"];
