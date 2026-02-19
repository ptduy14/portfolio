/* =========================
   RAW DATA (source of truth)
   ========================= */

export const PROFILE = {
  name: "Tấn Duy (Phan Tan Duy)",
  location: "Ho Chi Minh City, Vietnam",
  education:
    "Bachelor of Engineering in Information Technology – Can Tho University of Technology (GPA 3.24/4.00), Graduated Jan 2025",
  role: "Frontend-focused Software Engineer",
  expertise: ["React", "JavaScript", "UI Engineering", "System Integration"],
  interests: ["Clean UI/UX", "AI-assisted products"],
  englishLevel: "Intermediate",
};

export const PROJECTS = [
  {
    title: "MovieX",
    role: "Front-End Developer",
    period: "August 2024 – Present",
    description:
      "An online movie streaming platform allowing users to stream movies, track progress, manage favorites, and view recently watched content.",
    responsibilities: [
      "Implemented video playback, episode selection, and user authentication",
      "Developed watch history and favorite lists",
      "Applied advanced Next.js concepts and Redux Toolkit",
    ],
    technologies: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Redux Toolkit",
      "Firebase",
      "Zod",
    ],
    githubUrl: "https://github.com/example/MovieX",
  },
  {
    title: "Laboratory Management",
    role: "Front-End Developer",
    period: "January – June 2024",
    description:
      "A web application for managing university laboratory operations and resources.",
    responsibilities: [
      "Implemented equipment tracking and chemical inventory management",
      "Built an Admin Dashboard",
      "Collaborated with Back-End developers on database design",
    ],
    technologies: [
      "React.js",
      "Next.js",
      "NextAuth",
      "NextUI",
      "SWR",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/example/LaboratoryManagement",
  },
  {
    title: "Blockchain Student Grade Management",
    role: "Full-Stack Developer",
    period: "September – December 2024",
    description:
      "A hybrid blockchain application for securely managing student scores.",
    responsibilities: [
      "Integrated MySQL with blockchain for on-chain/off-chain storage",
      "Deployed private chain using Geth and wrote Solidity smart contracts",
      "Integrated NestJS APIs with Next.js frontend",
    ],
    technologies: [
      "Next.js",
      "NestJS",
      "Solidity",
      "Ethers.js",
      "Geth",
      "MySQL",
    ],
    githubUrl: "https://github.com/example/StudentGradeManagement",
  },
];

export const EXPERIENCES = [
  {
    company: "FPT SOFTWARE HO CHI MINH CO.LTD",
    role: "Intern",
    location: "Can Tho",
    period: "November 2024 – January 2025",
    highlights: [
      "Trained on COBOL and Mainframe systems",
      "Migrated legacy systems from COBOL to Java + React",
      "Analyzed, tested, and optimized system source code",
    ],
  },
  {
    company: "FPT SOFTWARE INNOVATION COMPANY LIMITED",
    role: "Data Processing (Data Annotation)",
    location: "Can Tho",
    period: "August 2022 – October 2023",
    highlights: [
      "Annotated image, audio, and video data",
      "Reviewed data quality and documented discrepancies",
      "Logged bugs and collaborated to improve accuracy",
    ],
  },
];

export const SKILLS = [
  {
    category: "Languages",
    skills: ["JavaScript", "TypeScript", "PHP", "SQL"],
  },
  {
    category: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "NextAuth",
      "SWR",
      "Redux Toolkit",
      "Zustand",
      "Tailwind CSS",
      "ShadCN",
      "NextUI",
    ],
  },
  {
    category: "Backend & Database",
    skills: ["NestJS", "Laravel", "MySQL", "MSSQL", "RESTful APIs"],
  },
  {
    category: "Tools",
    skills: [
      "Git",
      "GitHub",
      "Firebase",
      "Postman",
      "Vercel",
      "Docker",
      "COBOL",
    ],
  },
];

/* =========================
     CONTEXT BUILDERS
     ========================= */

export const PROFILE_CONTEXT = `
  Name: ${PROFILE.name}
  Location: ${PROFILE.location}
  Education: ${PROFILE.education}
  Role: ${PROFILE.role}
  Expertise: ${PROFILE.expertise.join(", ")}
  Interests: ${PROFILE.interests.join(", ")}
  English Level: ${PROFILE.englishLevel}
  `;

export const PROJECTS_CONTEXT = `
  Projects:
  ${PROJECTS.map(
    (p) => `
  - ${p.title} (${p.role}, ${p.period})
    Description: ${p.description}
    Responsibilities: ${p.responsibilities.join("; ")}
    Technologies: ${p.technologies.join(", ")}
  `
  ).join("")}
  `;

export const EXPERIENCES_CONTEXT = `
  Experience:
  ${EXPERIENCES.map(
    (e) => `
  - ${e.company} – ${e.role} (${e.period})
    Location: ${e.location}
    Highlights: ${e.highlights.join("; ")}
  `
  ).join("")}
  `;

export const SKILLS_CONTEXT = `
  Skills:
  ${SKILLS.map((s) => `- ${s.category}: ${s.skills.join(", ")}`).join("\n")}
  `;

/* =========================
     INTENT → CONTEXT PICKER
     ========================= */

export function pickAssistantContext(prompt) {
  const q = prompt.toLowerCase();

  if (/project|portfolio|build|github/.test(q)) return PROJECTS_CONTEXT;
  if (/experience|company|intern|fpt|job/.test(q)) return EXPERIENCES_CONTEXT;
  if (/skill|tech|stack|react|frontend|backend/.test(q)) return SKILLS_CONTEXT;

  return PROFILE_CONTEXT; // safe fallback
}
