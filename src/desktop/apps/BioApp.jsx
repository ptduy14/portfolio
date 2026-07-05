import { Icon } from "../shell/icons";
import { useDesktop } from "../DesktopProvider";
import avatar from "../../assets/img/avata.jpg";
import resume from "../../assets/resume/resume.pdf";

const SOCIALS = [
  { icon: "github", label: "GitHub", href: "https://github.com/ptduy14" },
  { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/tan-duy-phan-6087a1311/" },
  { icon: "contact", label: "Email", href: "mailto:phantanduy14@gmail.com" },
];

const FACTS = [
  ["Role", "Software Engineer"],
  ["Location", "HCM City, Vietnam"],
  ["Experience", "Over 1 year"],
  ["Focus", "Web · SaaS · AI"],
  ["Open to", "New connections"],
];

const TECH = ["React.js", "Next.js", "NestJS", "Solidity", "AI / LLM"];

function Label({ children }) {
  return (
    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-dim">{children}</div>
  );
}

export default function BioApp() {
  const { openApp } = useDesktop();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-5">
        <img
          src={avatar}
          alt="Phan Tan Duy"
          className="h-24 w-24 flex-none rounded-2xl border object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold leading-tight text-text">Phan Tan Duy</h1>
          <p className="text-sm text-text-dim">Software Engineer · Full-stack Web Developer</p>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs text-text-body">
            <span className="h-2 w-2 rounded-full bg-success" />
            Open to connect
          </span>
          <div className="mt-1 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-control border bg-surface text-text-dim transition-colors hover:text-text"
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* Quick Facts | About — wraps to stacked when the window is narrow */}
      <div className="flex flex-wrap gap-6">
        <div className="min-w-[240px] flex-1 basis-[38%]">
          <Label>Quick Facts</Label>
          <div className="rounded-card border bg-surface">
            {FACTS.map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
                  i < FACTS.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="text-sm text-text-dim">{k}</span>
                <span className="text-right text-sm font-medium text-text">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-[320px] flex-[1.4] basis-[52%]">
          <Label>About</Label>
          <div className="space-y-3 text-sm leading-relaxed text-text-body">
            <p>
              I'm a web developer with a solid foundation across front-end and back-end. I build
              dynamic UIs with <b className="text-text">React.js, Next.js, Tailwind CSS</b> and ship
              back-ends with <b className="text-text">NestJS, Laravel, MySQL/MSSQL</b> and RESTful APIs.
            </p>
            <p>
              Beyond web, I've built on-chain projects with{" "}
              <b className="text-text">Solidity, Geth &amp; Ethers.js</b>, and I'm increasingly drawn to{" "}
              <b className="text-text">SaaS platforms and AI</b>.
            </p>
            <p className="text-text-dim">
              Self-taught, endlessly curious, and happiest when shipping something real. 🚀
            </p>
            <blockquote className="border-l-2 border-accent pl-3 text-text-dim">
              "If you wish to reach the highest, begin at the lowest." — Publilius Syrus
            </blockquote>
          </div>
        </div>
      </div>

      {/* Tech Focus */}
      <div>
        <Label>Tech Focus</Label>
        <div className="flex flex-wrap gap-2">
          {TECH.map((t) => (
            <span
              key={t}
              className="rounded-control border bg-surface px-3 py-1 text-xs font-medium text-text-body"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => window.open(resume)}
          className="rounded-control bg-accent px-4 py-2 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
        >
          ⬇ Download CV
        </button>
        <button
          onClick={() => openApp("contact")}
          className="rounded-control border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
        >
          ✉ Contact
        </button>
      </div>
    </div>
  );
}
