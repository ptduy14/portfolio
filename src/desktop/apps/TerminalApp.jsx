import { useEffect, useRef, useState } from "react";
import { askAssistant } from "../../services/chatbotService";
import handleBotAction from "../../utils/function-calling";
import { useTerminal } from "../TerminalProvider";
import { useDesktop } from "../DesktopProvider";
import { PROJECTS } from "./projects-data";
import { SKILLS, DOMAINS } from "./skills-data";
import { EXPERIENCE } from "./experience-data";

const BANNER = `+--------------------------------------------+
|   ___  _   ___   __                        |
|  |   \\| | | \\ \\ / /   duy@portfolio        |
|  | |) | |_| |\\ V /    Ask-Me - RAG v1.0    |
|  |___/ \\___/  |_|                          |
+--------------------------------------------+`;

const HELP = `Available commands
  help          show this help
  whoami        who is duy
  about         short bio
  skills        tech stack summary
  projects      list projects (with stars)
  experience    work history summary
  contact       contact channels
  socials       social links
  cv            download my CV
  neofetch      system info
  open <app>    open an app (bio · skills · projects · experience · contact · settings)
  clear         clear the screen
  exit          close this window

Or just type a question — it goes to my RAG agent.
↑/↓ browse history  ·  Tab to complete`;

const NEOFETCH = `   ╭──────────╮     duy@portfolio
   │  d  u  y │     ─────────────────────────────
   │  ◍ ◍ ◍ ◍ │     OS:      Portfolio OS 1.0 (GNOME × macOS)
   │  ◍ ◍ ◍ ◍ │     Host:    github.com/ptduy14
   ╰──────────╯     Shell:   ask-me v1.0 (RAG agent)
                    Stack:   React · Next · NestJS · Solidity
                    Focus:   Web · SaaS · AI
                    Uptime:  always learning ☕`;

const WHOAMI = "Phan Tan Duy — Software Engineer · full-stack web developer. Self-taught, HCM City.";
const ABOUT =
  "I build dynamic UIs (React/Next/Tailwind) and back-ends (NestJS/Laravel), with hands-on blockchain (Solidity/Ethers.js). Increasingly into SaaS platforms and AI.";
const SOCIALS = `GitHub    github.com/ptduy14
LinkedIn  linkedin.com/in/tan-duy-phan-6087a1311
Email     phantanduy14@gmail.com`;
const CONTACT = `Email     phantanduy14@gmail.com
GitHub    github.com/ptduy14
Location  HCM City, Vietnam  ·  Open to connect`;

const skillsSummary = () =>
  DOMAINS.map((d) => `${d}: ${SKILLS.filter((s) => s.domain === d).map((s) => s.name).join(", ")}`).join("\n");

const projectsSummary = () =>
  PROJECTS.map((p) => `★${String(p.stars).padEnd(2)} ${p.title}`).join("\n");

const fmtMonth = (v) => {
  if (v === "present") return "present";
  const [y, m] = v.split("-");
  return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m - 1]} ${y}`;
};
const experienceSummary = () =>
  EXPERIENCE.map(
    (e) => `${e.role} · ${e.company}\n  ${fmtMonth(e.start)} – ${fmtMonth(e.end)} · ${e.location}`
  ).join("\n");

const OPEN_ALIASES = {
  bio: "bio",
  skills: "skills",
  projects: "projects",
  experience: "experience",
  contact: "contact",
  settings: "settings",
  terminal: "askme",
  askme: "askme",
};

const COMMANDS = [
  "help", "whoami", "about", "skills", "projects", "experience", "contact",
  "socials", "cv", "resume", "neofetch", "open", "clear", "exit", "sudo",
];

const CHIPS = [
  "What's your tech stack?",
  "Show me your projects",
  "Download your CV",
];

export default function TerminalApp() {
  const { log, pushEntry, updateEntry, removeEntry, clearLog, initialized, setInitialized } = useTerminal();
  const { openApp, closeApp } = useDesktop();

  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(null); // { id, shown }
  const typingRef = useRef(null);
  const histRef = useRef([]);
  const [histIdx, setHistIdx] = useState(0);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // welcome (once; persists across reopen)
  useEffect(() => {
    if (!initialized) {
      pushEntry("banner", BANNER);
      pushEntry("system", "Ask me anything about my experience, skills, or projects.");
      pushEntry("system", "Type `help` for commands, or just ask a question.");
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    return () => typingRef.current && clearInterval(typingRef.current);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, typing]);

  const streamOut = (id, full) => {
    if (typingRef.current) clearInterval(typingRef.current);
    let i = 0;
    setTyping({ id, shown: "" });
    typingRef.current = setInterval(() => {
      i += 2;
      if (i >= full.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setTyping(null);
      } else {
        setTyping({ id, shown: full.slice(0, i) });
      }
    }, 12);
  };

  const agentReply = (text) => streamOut(pushEntry("agent", text), text);

  const ask = async (q) => {
    setBusy(true);
    const thinkId = pushEntry("think", "thinking…");
    const cold = setTimeout(
      () => updateEntry(thinkId, "waking up the agent (cold start, ~30s)…"),
      4000
    );
    try {
      const res = await askAssistant(q);
      clearTimeout(cold);
      removeEntry(thinkId);
      if (typeof res === "string") {
        agentReply(res);
      } else {
        if (res?.action) {
          pushEntry("tool", `⏺ ${res.action}()  ✓`);
          handleBotAction(res.action, res.data);
        }
        agentReply(res?.reply || "I'm not sure how to answer that.");
      }
    } catch {
      clearTimeout(cold);
      removeEntry(thinkId);
      agentReply("Connection error — feel free to email me directly: phantanduy14@gmail.com");
    } finally {
      setBusy(false);
    }
  };

  const handleCommand = (cmd, full) => {
    switch (cmd) {
      case "help": return pushEntry("output", HELP);
      case "whoami": return pushEntry("output", WHOAMI);
      case "about": return pushEntry("output", ABOUT);
      case "skills": return pushEntry("output", skillsSummary());
      case "projects": return pushEntry("output", projectsSummary());
      case "experience": return pushEntry("output", experienceSummary());
      case "contact": return pushEntry("output", CONTACT);
      case "socials": return pushEntry("output", SOCIALS);
      case "neofetch": return pushEntry("output", NEOFETCH);
      case "cv":
      case "resume":
        pushEntry("tool", "⏺ download_cv()  ✓");
        handleBotAction("download_cv");
        return;
      case "open": {
        const arg = full.split(/\s+/)[1]?.toLowerCase();
        const id = arg && OPEN_ALIASES[arg];
        if (id) {
          openApp(id);
          return pushEntry("system", `Opening ${arg}…`);
        }
        return pushEntry("output", `open: unknown app "${arg || ""}". Try: bio · skills · projects · contact · settings`);
      }
      case "exit": return closeApp("askme");
      case "clear": return clearLog();
      case "sudo":
        if (/hire[- ]?me/.test(full)) {
          pushEntry("system", "Excellent choice. Opening Contact… 😎");
          return openApp("contact");
        }
        return pushEntry("output", "duy is not in the sudoers file. This incident will be reported. 😏");
      default:
        return;
    }
  };

  const run = (raw) => {
    const text = raw.trim();
    if (!text || busy) return;
    histRef.current.push(text);
    setHistIdx(histRef.current.length);
    pushEntry("user", text);
    const cmd = text.split(/\s+/)[0].toLowerCase();
    if (COMMANDS.includes(cmd)) handleCommand(cmd, text);
    else ask(text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = histRef.current;
      if (h.length) {
        const i = Math.max(0, histIdx - 1);
        setHistIdx(i);
        setValue(h[i] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = histRef.current;
      const i = Math.min(h.length, histIdx + 1);
      setHistIdx(i);
      setValue(h[i] || "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match && value.trim()) setValue(match + " ");
    }
  };

  const display = (entry) => (typing && typing.id === entry.id ? typing.shown : entry.text);
  const hasChatted = log.some((e) => e.kind === "user");

  const renderEntry = (e) => {
    switch (e.kind) {
      case "banner":
        return <div key={e.id} className="whitespace-pre text-term-purple">{e.text}</div>;
      case "system":
        return <div key={e.id} className="whitespace-pre-wrap text-text-dim">{e.text}</div>;
      case "output":
        return <div key={e.id} className="my-1 whitespace-pre-wrap text-term-fg">{e.text}</div>;
      case "user":
        return (
          <div key={e.id} className="mt-1">
            <span className="text-term-green">duy@portfolio</span>
            <span className="text-text-dim">:</span>
            <span className="text-term-blue">~</span>
            <span className="text-text-dim">$ </span>
            {e.text}
          </div>
        );
      case "tool":
        return <div key={e.id} className="text-term-purple">{e.text}</div>;
      case "think":
        return (
          <div key={e.id} className="text-term-yellow">
            <span className="animate-blink">●</span> {e.text}
          </div>
        );
      case "agent":
        return <div key={e.id} className="my-1 whitespace-pre-wrap text-term-fg">{display(e)}</div>;
      default:
        return null;
    }
  };

  const userMsgs = log.filter((e) => e.kind === "user").length;

  return (
    <div
      className="flex h-full flex-col bg-term-bg font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      {/* log */}
      <div ref={scrollRef} role="log" aria-live="polite" aria-label="Terminal output" className="flex-1 overflow-auto px-4 py-3">
        {log.map(renderEntry)}
      </div>

      {/* suggested chips (before first chat) */}
      {!hasChatted && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => run(c)}
              className="rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-xs text-term-blue transition-colors hover:bg-white/5"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex items-center gap-2 border-t border-[#2a323d] px-4 py-2.5">
        <span className="flex-none text-term-green">duy@portfolio<span className="text-text-dim">:</span><span className="text-term-blue">~</span><span className="text-text-dim">$</span></span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          placeholder={busy ? "" : "ask me anything…"}
          className="flex-1 bg-transparent text-term-fg caret-term-green outline-none placeholder:text-text-dim disabled:opacity-50"
        />
      </div>

      {/* status line */}
      <div className="flex items-center justify-between border-t border-[#2a323d] bg-[#101318] px-4 py-1.5 text-[11px] text-text-dim">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-term-green" /> connected · hf.space
        </span>
        <span>rag-agent · {userMsgs} msgs · 1 tool</span>
      </div>
    </div>
  );
}
