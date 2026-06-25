// Skills grouped by domain with a qualitative level (no percentages — see research).
// `icon` maps to a Simple Icons slug in SkillsApp; null → letter-badge fallback.
export const DOMAINS = ["Frontend", "Backend", "Blockchain", "DevOps & Tools"];

export const SKILLS = [
  { name: "React.js", domain: "Frontend", level: "Daily", icon: "react" },
  { name: "Next.js", domain: "Frontend", level: "Daily", icon: "nextjs" },
  { name: "Tailwind CSS", domain: "Frontend", level: "Daily", icon: "tailwind" },
  { name: "Redux", domain: "Frontend", level: "Proficient", icon: "redux" },
  { name: "NestJS", domain: "Backend", level: "Daily", icon: "nestjs" },
  { name: "Laravel", domain: "Backend", level: "Proficient", icon: "laravel" },
  { name: "MySQL", domain: "Backend", level: "Proficient", icon: "mysql" },
  { name: "MSSQL", domain: "Backend", level: "Proficient", icon: null },
  { name: "Solidity", domain: "Blockchain", level: "Proficient", icon: "solidity" },
  { name: "Ethers.js", domain: "Blockchain", level: "Familiar", icon: "ethers" },
  { name: "Geth", domain: "Blockchain", level: "Familiar", icon: null },
  { name: "Git", domain: "DevOps & Tools", level: "Daily", icon: "git" },
  { name: "Docker", domain: "DevOps & Tools", level: "Proficient", icon: "docker" },
  { name: "Firebase", domain: "DevOps & Tools", level: "Proficient", icon: "firebase" },
  { name: "Cloudinary", domain: "DevOps & Tools", level: "Familiar", icon: "cloudinary" },
];

export const LEARNING = ["Design systems", "Infrastructure", "AI RAG agents"];

export const LEVEL_RANK = { Daily: 3, Proficient: 2, Familiar: 1 };
