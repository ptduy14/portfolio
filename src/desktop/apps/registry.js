import BioApp from "./BioApp";
import SkillsApp from "./SkillsApp";
import ProjectsApp from "./ProjectsApp";
import TerminalApp from "./TerminalApp";
import ContactApp from "./ContactApp";
import SettingsApp from "./SettingsApp";

// Single source of truth for dock + window manager.
// icon = key in shell/icons.jsx · bare = full-bleed body (no padding) · pinned:false = not on dock unless running.
export const APPS = [
  { id: "bio", title: "Bio", icon: "bio", Component: BioApp, defaultSize: { w: 560, h: 430 } },
  { id: "skills", title: "Skills", icon: "skills", Component: SkillsApp, defaultSize: { w: 560, h: 420 } },
  { id: "projects", title: "Projects", icon: "projects", Component: ProjectsApp, defaultSize: { w: 640, h: 440 } },
  { id: "askme", title: "Ask Me — Terminal", icon: "terminal", Component: TerminalApp, defaultSize: { w: 600, h: 440 }, bare: true },
  { id: "contact", title: "Contact", icon: "contact", Component: ContactApp, defaultSize: { w: 480, h: 360 } },
  { id: "settings", title: "Settings", icon: "gear", Component: SettingsApp, defaultSize: { w: 700, h: 480 } },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a]));
