// Work experience — newest first. `end: "present"` marks the current role.
// Company logos live in public/logos/ ; if a file is missing the app falls back
// to a coloured monogram tile (see ExperienceApp CompanyLogo).
// NOTE: Pixel Boss `start` is an estimate — confirm the real start month.
export const EXPERIENCE = [
  {
    id: "pixelboss",
    company: "Pixel Boss",
    url: "https://www.pixelboss.io/",
    logo: "/logos/pixelboss.svg",
    mono: "PB",
    color: "#3584e4",
    role: "Fullstack Developer",
    type: "Full-time",
    start: "2025-06",
    end: "present",
    location: "Ho Chi Minh City, Vietnam",
    summary:
      "Building Swiift — a SaaS loyalty & engagement platform for brands across Australia.",
    tech: ["React", "NestJS"],
    links: [{ label: "Product — Swiift", url: "https://swiiftstudio.com/" }],
    highlights: [
      {
        title: "Built a multi-tenant SaaS loyalty & engagement platform",
        blurb:
          "Swiift — a brand loyalty product used by companies across Australia.",
        challenge:
          "New to multi-tenancy architecture and its data-isolation and configuration trade-offs.",
        action:
          "Learned and implemented a multi-tenant model powering per-brand data, theming, and configuration.",
        result:
          "Shipped features running in production for brands across Australia.",
      },
      {
        title: "Built a visual theme editor with an embeddable script",
        blurb:
          "Let brands customise their loyalty experience and embed it across their storefront themes.",
        challenge:
          "Design a theme editor and an embed script that renders consistently across different storefront themes.",
        action:
          "Built the editor UI and an embeddable script injected across host themes.",
      },
    ],
  },
  {
    id: "fpt-intern",
    company: "FPT Software",
    url: "https://fptsoftware.com/",
    logo: "/logos/fpt.webp",
    mono: "FPT",
    color: "#ee7127",
    role: "Software Migration Intern",
    type: "Full-time",
    start: "2024-11",
    end: "2025-03",
    location: "Can Tho, Vietnam",
    summary:
      "Migrated a legacy COBOL system to a Java + React stack on a simulated project.",
    tech: ["COBOL", "Java", "React", "Mainframe"],
    highlights: [
      {
        title: "Completed a COBOL & Mainframe training program",
        blurb:
          "Built a solid understanding of the language and its working environment.",
      },
      {
        title: "Migrated a legacy system from COBOL to Java + React",
        blurb: "On a simulated migration project.",
        challenge:
          "Unfamiliar legacy COBOL & mainframe conventions and migration approaches.",
        action:
          "Analysed the source, converted business logic, tested, and optimised the system post-migration.",
        result:
          "A working migrated system; sharpened Java skills and legacy-to-modern migration insight.",
      },
      {
        title: "Debugging & post-migration validation",
        blurb:
          "Assisted in debugging and ensuring system functionality after migration.",
      },
    ],
  },
  {
    id: "fpt-innovation",
    company: "FPT Software Innovation",
    url: "https://fptsoftware.com/fpt-innovation-hub",
    logo: "/logos/fpt.webp",
    mono: "FPT",
    color: "#1a4b8c",
    role: "Data Annotator",
    type: "Part-time",
    start: "2022-08",
    end: "2023-10",
    location: "Can Tho, Vietnam",
    summary:
      "Annotated and quality-reviewed multimodal training data (60% annotation · 40% review).",
    tech: ["Data Annotation", "Quality Assurance", "Microsoft Office"],
    highlights: [
      {
        title: "Annotated diverse multimodal data",
        blurb:
          "Labeling, scoring, and manipulating data — human-skeleton scoring, object bounding, object classification, and traffic-line drawing.",
      },
      {
        title: "Quality assurance as a Reviewer",
        blurb:
          "Reviewed annotated data against quality standards; provided feedback and corrections.",
        challenge:
          "Maintain annotation accuracy across a large team and varied task types.",
        action:
          "Reviewed output, documented errors with tooling, and returned pending tasks to operators.",
        result:
          "Improved annotation accuracy and consistency across the project.",
      },
      {
        title: "Team collaboration & performance tracking",
        blurb:
          "Collaborated with the team lead on complex issues; monitored and reported daily performance against targets.",
      },
    ],
  },
];
