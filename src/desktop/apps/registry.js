import BioApp from "./BioApp";
import SkillsApp from "./SkillsApp";
import ProjectsApp from "./ProjectsApp";
import ExperienceApp from "./ExperienceApp";
import TerminalApp from "./TerminalApp";
import ContactApp from "./ContactApp";
import SettingsApp from "./SettingsApp";

// Single source of truth for dock + window manager.
// icon = key in shell/icons.jsx · bare = full-bleed body (no padding) · pinned:false = not on dock unless running.
// size = fraction of the viewport (computed to px on open in DesktopProvider, clamped + centered).
export const APPS = [
  { id: "bio", title: "Bio", icon: "bio", Component: BioApp, size: { w: 0.6, h: 0.76 } },
  { id: "skills", title: "Skills", icon: "skills", Component: SkillsApp, size: { w: 0.56, h: 0.74 }, bare: true },
  { id: "projects", title: "Projects", icon: "projects", Component: ProjectsApp, size: { w: 0.66, h: 0.8 }, bare: true },
  { id: "experience", title: "Experience", icon: "briefcase", Component: ExperienceApp, size: { w: 0.64, h: 0.78 }, bare: true },
  { id: "askme", title: "Ask Me — Terminal", icon: "terminal", Component: TerminalApp, size: { w: 0.56, h: 0.72 }, bare: true },
  { id: "contact", title: "Contact", icon: "contact", Component: ContactApp, size: { w: 0.58, h: 0.7 }, bare: true },
  { id: "settings", title: "Settings", icon: "gear", Component: SettingsApp, size: { w: 0.6, h: 0.74 } },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a]));
