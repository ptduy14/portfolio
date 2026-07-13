// Curated showcase projects. `repo` maps to live GitHub stats; star/fork are static fallbacks.
// `demo` = live URL or null. `caseStudy`/`deepDive` power the 2-tab detail view (both optional —
// projects without them fall back to the simple detail). Screenshots live in public/shots/<repo>/.
//
// NOTE: caseStudy/deepDive text below is a SKELETON drafted from the CV — verify for accuracy and
// fill real metrics (PostHog) / screenshots before shipping.
//
// heroMode RULE (detail page hero): "big" = the project has a user-facing UI worth showing
// (frontend / full-stack apps) → prominent 16:9 hero. "compact" = backend / API / agent with
// no UI to show → small figure (only if a screenshot exists) or none. Set it on EVERY project.
export const PROJECTS = [
  {
    title: "MOVIEX — Streaming Platform",
    repo: "movie-web",
    url: "https://github.com/ptduy14/movie-web",
    demo: "https://movieix.vercel.app/en",
    demoEmbeddable: true,
    category: "Frontend",
    featured: true,
    tags: ["Next.js", "TypeScript", "AI translation", "Firebase"],
    blurb: "A modern streaming platform with AI-powered translation, watch-progress sync and favorites.",
    oneLiner: "AI-subtitle movie streaming with cross-device watch-progress sync.",
    heroMode: "big",
    screenshots: [],
    stars: 9,
    forks: 7,
    caseStudy: {
      what: "A Next.js streaming app: browse and stream movies, AI-powered subtitle translation, watch-progress sync across devices, favorites, comments and recently-watched history.",
      problem: "Casual viewers want subtitles in their own language and to resume watching across devices — small streaming players rarely offer both.",
      solution: "On-demand AI subtitle translation plus cross-device progress sync (Firebase), wrapped in a fast Next.js UI.",
      role: "Sole developer — product, frontend architecture and all integrations. Applied advanced Next.js (RSC, streaming, caching) end-to-end.",
      metrics: [
        { value: "—", label: "Avg. watch time / session", source: "PostHog" },
        { value: "—", label: "Weekly active users", source: "PostHog" },
        { value: "—", label: "Subtitle translations run", source: "PostHog" },
      ],
    },
    deepDive: {
      architecture: ["Next.js App Router", "Server Actions / RSC", "Firebase (sync + auth)", "AI translate API", "PostHog"],
      decisions: [
        "Firebase realtime for cross-device sync — faster to ship than a custom backend (trade-off: vendor lock-in).",
        "Cache translated subtitle tracks to avoid re-hitting the AI API on every play.",
      ],
      challenges: [
        "Keeping first paint fast on a media-heavy UI → RSC + streaming.",
        "Consistent watch-progress across devices and sessions.",
      ],
      lessons: ["When a managed service is the right speed/scope trade-off for a solo build."],
    },
  },
  {
    title: "Laboratory Management Admin",
    repo: "laboratory-management-admin",
    url: "https://github.com/ptduy14/laboratory-management-admin",
    demo: null,
    demoEmbeddable: false,
    category: "Frontend",
    featured: false,
    tags: ["Next.js", "NextUI", "SWR", "Cloudinary"],
    blurb: "Admin dashboard to manage information and activities of a university laboratory.",
    oneLiner: "Admin dashboard for university lab resources — equipment, chemicals, scheduling.",
    heroMode: "big",
    screenshots: [],
    stars: 5,
    forks: 3,
    caseStudy: {
      what: "An admin dashboard for a university laboratory: equipment tracking, chemical inventory, lab scheduling, usage history, user management and per-department resource allocation.",
      problem: "Lab operations (equipment, chemicals, schedules) were tracked manually and hard to keep consistent across departments.",
      solution: "A single admin dashboard centralising inventory, scheduling and usage history with role-based access.",
      role: "Front-end developer — built the dashboard UI and collaborated with the back-end dev on the relational data model and data integrity.",
    },
    deepDive: {
      architecture: ["Next.js", "NextAuth", "SWR", "NextUI", "Cloudinary"],
      challenges: ["Modelling shared lab resources across departments without data conflicts."],
    },
  },
  {
    title: "Student Grade — Blockchain",
    repo: "student-grade-management-using-blockchain",
    url: "https://github.com/ptduy14/student-grade-management-using-blockchain",
    demo: null,
    demoEmbeddable: false,
    category: "Blockchain",
    featured: false,
    tags: ["Solidity", "Geth", "Ethers.js", "Next.js"],
    blurb: "Tamper-proof student grade management stored on a private blockchain.",
    oneLiner: "Tamper-proof student grades on a private blockchain (hybrid on/off-chain).",
    heroMode: "big",
    screenshots: [],
    stars: 1,
    forks: 0,
    caseStudy: {
      what: "A system for managing and storing student grades where grades live on a private blockchain and academic metadata (courses, semesters) lives in MySQL — a hybrid on/off-chain model.",
      problem: "Academic records must be tamper-proof and auditable, but a fully on-chain system is costly and slow to query.",
      solution: "Store grades on-chain for integrity while keeping queryable metadata off-chain in MySQL — best of both.",
      role: "Full-stack developer — designed the hybrid model, wrote the Solidity contracts, deployed a private Geth chain, built NestJS APIs and a Next.js admin.",
    },
    deepDive: {
      architecture: ["Next.js admin", "NestJS API", "Ethers.js", "Solidity contracts", "Geth private chain", "MySQL (off-chain)"],
      decisions: ["Hybrid on/off-chain: grades on-chain for tamper-proofing, academic metadata in MySQL for cheap, fast queries."],
    },
  },
  {
    title: "Portfolio RAG Agent",
    repo: "portfolio-rag-agent",
    url: "https://github.com/ptduy14/portfolio-rag-agent",
    demo: null,
    demoEmbeddable: false,
    category: "AI",
    featured: false,
    tags: ["RAG", "LLM", "Python"],
    blurb: "The retrieval-augmented agent that powers the 'Ask Me' terminal on this very site.",
    oneLiner: "The RAG agent powering the 'Ask Me' terminal in this portfolio.",
    heroMode: "compact",
    screenshots: [],
    stars: 0,
    forks: 0,
    caseStudy: {
      what: "A retrieval-augmented generation (RAG) agent that answers questions about me — the brain behind the 'Ask Me' terminal here, with function-calling (e.g. download CV).",
      role: "Built the retrieval pipeline, prompt/function-calling layer, and the Hugging Face Spaces deployment consumed by this site.",
    },
  },
  {
    title: "Ride-hailing Service",
    repo: "ride-hailing-service-web-app",
    url: "https://github.com/ptduy14/ride-hailing-service-app",
    demo: null,
    demoEmbeddable: false,
    category: "Backend",
    featured: false,
    tags: ["Laravel", "Google Maps", "WebSocket", "Pusher"],
    blurb: "A ride-hailing website connecting drivers and passengers in real time.",
    oneLiner: "Real-time ride-hailing web app with live maps and driver/passenger matching.",
    heroMode: "big",
    screenshots: [],
    stars: 3,
    forks: 1,
    description:
      "A user-friendly ride-hailing platform connecting drivers and passengers with live maps and real-time updates over WebSocket/Pusher.",
  },
  {
    title: "Laravel E-commerce API",
    repo: "laravel-api-v2",
    url: "https://github.com/ptduy14/laravel-api-v2",
    demo: null,
    demoEmbeddable: false,
    category: "Backend",
    featured: false,
    tags: ["Laravel", "JWT", "Swagger"],
    blurb: "RESTful e-commerce API following REST architectural standards.",
    oneLiner: "RESTful e-commerce API with JWT auth and Swagger docs.",
    heroMode: "compact",
    screenshots: [],
    stars: 1,
    forks: 0,
    description:
      "An e-commerce API built with Laravel following REST standards, with JWT auth and Swagger documentation.",
  },
];

export const CATEGORIES = ["All", "Frontend", "Backend", "Blockchain", "AI"];
