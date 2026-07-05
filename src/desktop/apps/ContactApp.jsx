import { useContext, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Icon } from "../shell/icons";
import { ToastContext } from "../../context/ToastContext";
import resume from "../../assets/resume/resume.pdf";

const EMAIL = "phantanduy14@gmail.com";

const CHANNELS = [
  { icon: "github", label: "GitHub", value: "github.com/ptduy14", href: "https://github.com/ptduy14" },
  {
    icon: "linkedin",
    label: "LinkedIn",
    value: "in/tan-duy-phan",
    href: "https://www.linkedin.com/in/tan-duy-phan-6087a1311/",
  },
];

export default function ContactApp() {
  const { handleShowingToast } = useContext(ToastContext);
  const formRef = useRef(null);
  const [input, setInput] = useState({ user_name: "", user_email: "", message: "" });
  const [error, setError] = useState({});
  const [sending, setSending] = useState(false);

  const onChange = (name, value) => {
    setInput((p) => ({ ...p, [name]: value }));
    setError((p) => ({ ...p, [name]: !value.trim() }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      handleShowingToast("Email copied to clipboard", "Contact");
    } catch {
      handleShowingToast(EMAIL, "Email");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {
      user_name: !input.user_name.trim(),
      user_email: !input.user_email.trim(),
      message: !input.message.trim(),
    };
    setError(errs);
    if (errs.user_name || errs.user_email || errs.message) return;

    setSending(true);
    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY }
      )
      .then(
        () => {
          handleShowingToast(
            "Thanks for reaching out — I'll reply as soon as I can.",
            "Message sent"
          );
          setInput({ user_name: "", user_email: "", message: "" });
          setSending(false);
        },
        () => {
          handleShowingToast("Something went wrong. Email me directly instead.", "Send failed");
          setSending(false);
        }
      );
  };

  const fieldClass = (name) =>
    `rounded-control border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-strong ${
      error[name] ? "border-destructive" : ""
    }`;

  return (
    <div className="flex h-full flex-wrap overflow-auto bg-window">
        {/* LEFT: channels (narrower sidebar) */}
        <div className="flex min-w-[240px] flex-[1_1_280px] flex-col gap-3.5 border-r bg-headerbar p-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-text-dim">Reach me</div>

          {/* email + copy */}
          <div className="flex items-center gap-3 rounded-card border bg-surface px-3 py-2.5">
            <Icon name="contact" size={18} className="flex-none text-text-dim" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">Email</div>
              <div className="truncate text-sm text-text">{EMAIL}</div>
            </div>
            <button
              onClick={copyEmail}
              title="Copy email"
              className="flex-none rounded-control border px-2 py-1 text-text-dim transition-colors hover:text-text"
            >
              <Icon name="copy" size={14} />
            </button>
          </div>

          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-card border bg-surface px-3 py-2.5 transition-colors hover:border-strong"
            >
              <Icon name={c.icon} size={18} className="flex-none text-text-dim" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">{c.label}</div>
                <div className="truncate text-sm text-text">{c.value}</div>
              </div>
              <Icon name="external" size={14} className="flex-none text-text-dim" />
            </a>
          ))}

          <div className="flex items-center gap-2.5 px-1 text-sm text-text-body">
            <Icon name="pin" size={16} className="text-text-dim" /> HCM City, Vietnam
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs text-text-body">
            <span className="h-2 w-2 rounded-full bg-success" /> Open to connect
          </span>
          <div className="flex items-center gap-2 px-1 text-xs text-text-dim">
            <Icon name="clock" size={14} /> Usually replies within a day
          </div>

          <button
            onClick={() => window.open(resume)}
            className="mt-auto flex items-center justify-center gap-2 rounded-control border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
          >
            <Icon name="download" size={16} /> Download CV
          </button>
        </div>

        {/* RIGHT: compose form */}
        <form ref={formRef} onSubmit={onSubmit} className="flex min-w-[340px] flex-[1.8_1_420px] flex-col gap-4 p-6">
          <div className="flex items-center gap-2 border-b pb-3 text-sm text-text-dim">
            To:
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-text">Phan Tan Duy</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-dim">Your name</label>
            <input
              name="user_name"
              value={input.user_name}
              onChange={(e) => onChange("user_name", e.target.value)}
              placeholder="Jane Doe"
              className={fieldClass("user_name")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-dim">Your email</label>
            <input
              name="user_email"
              value={input.user_email}
              onChange={(e) => onChange("user_email", e.target.value)}
              placeholder="jane@example.com"
              className={fieldClass("user_email")}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium text-text-dim">Message</label>
            <textarea
              name="message"
              value={input.message}
              onChange={(e) => onChange("message", e.target.value)}
              placeholder="Hi Duy, I'd love to talk about…"
              className={`min-h-[120px] flex-1 resize-none ${fieldClass("message")}`}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="flex w-fit items-center gap-2 rounded-control bg-accent px-5 py-2.5 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            <Icon name="send" size={16} /> {sending ? "Sending…" : "Send message"}
          </button>
        </form>
    </div>
  );
}
