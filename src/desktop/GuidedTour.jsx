import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSystem } from "./SystemProvider";
import { useDesktop } from "./DesktopProvider";
import handleBotAction from "../utils/function-calling";
import { TOUR_STEPS } from "./tour";

const CARD_W = 288;
const GAP = 14;
const PAD = 8; // breathing room around the spotlit element

// Pick the card side with room (prefer first), then position + clamp to viewport.
function placeCard(rect, prefer, cardH) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fits = {
    right: rect.right + GAP + CARD_W <= vw,
    left: rect.left - GAP - CARD_W >= 0,
    bottom: rect.bottom + GAP + cardH <= vh,
    top: rect.top - GAP - cardH >= 0,
  };
  const order = [prefer, "bottom", "right", "left", "top"].filter(
    (s, i, a) => a.indexOf(s) === i
  );
  const side = order.find((s) => fits[s]) || prefer;

  let left, top;
  if (side === "right") {
    left = rect.right + GAP;
    top = rect.top + rect.height / 2 - cardH / 2;
  } else if (side === "left") {
    left = rect.left - GAP - CARD_W;
    top = rect.top + rect.height / 2 - cardH / 2;
  } else if (side === "top") {
    left = rect.left + rect.width / 2 - CARD_W / 2;
    top = rect.top - GAP - cardH;
  } else {
    left = rect.left + rect.width / 2 - CARD_W / 2;
    top = rect.bottom + GAP;
  }

  left = Math.max(12, Math.min(left, vw - CARD_W - 12));
  top = Math.max(12, Math.min(top, vh - cardH - 12));

  // Beak sits on the card edge facing the target, aligned to the target centre.
  let beak;
  if (side === "right" || side === "left") {
    const cy = rect.top + rect.height / 2 - top;
    beak = { axis: "y", pos: Math.max(16, Math.min(cy, cardH - 16)), side };
  } else {
    const cx = rect.left + rect.width / 2 - left;
    beak = { axis: "x", pos: Math.max(16, Math.min(cx, CARD_W - 16)), side };
  }
  return { side, left, top, beak };
}

function Beak({ beak }) {
  const base = {
    position: "absolute",
    width: 11,
    height: 11,
    background: "var(--bg-window)",
    borderLeft: "1px solid var(--border-strong)",
    borderBottom: "1px solid var(--border-strong)",
  };
  const s = { ...base };
  if (beak.side === "right") {
    s.left = -6;
    s.top = beak.pos - 5;
    s.transform = "rotate(45deg)";
  } else if (beak.side === "left") {
    s.right = -6;
    s.top = beak.pos - 5;
    s.transform = "rotate(-135deg)";
  } else if (beak.side === "bottom") {
    s.top = -6;
    s.left = beak.pos - 5;
    s.transform = "rotate(135deg)";
  } else {
    s.bottom = -6;
    s.left = beak.pos - 5;
    s.transform = "rotate(-45deg)";
  }
  return <div style={s} aria-hidden="true" />;
}

// pos: "welcome" | number (step index) | "outro"
export default function GuidedTour({ mobile = false }) {
  const { tourOpen, endTour } = useSystem();
  const { openApp, focusApp } = useDesktop();

  const [pos, setPos] = useState("welcome");
  const [optOut, setOptOut] = useState(false);
  const [rect, setRect] = useState(null);
  const [box, setBox] = useState(null);
  const cardRef = useRef(null);

  const isStep = typeof pos === "number";
  const step = isStep ? TOUR_STEPS[pos] : null;
  // Mobile shell has no dock/panel — collapse to welcome → outro only.
  const lastStep = mobile ? -1 : TOUR_STEPS.length - 1;

  // Reset to the welcome screen whenever the tour (re)opens.
  useEffect(() => {
    if (tourOpen) {
      setPos("welcome");
      setOptOut(false);
    }
  }, [tourOpen]);

  const finish = useCallback(
    (opt) => {
      endTour(opt);
    },
    [endTour]
  );

  const next = useCallback(() => {
    setPos((p) => {
      if (p === "welcome") return mobile ? "outro" : 0;
      if (p === "outro") return p;
      return p >= lastStep ? "outro" : p + 1;
    });
  }, [mobile, lastStep]);

  const back = useCallback(() => {
    setPos((p) => {
      if (p === "outro") return mobile ? "welcome" : lastStep;
      if (typeof p === "number") return p <= 0 ? "welcome" : p - 1;
      return p;
    });
  }, [mobile, lastStep]);

  // Resolve the current step's target; skip the step if it's not on screen.
  useLayoutEffect(() => {
    if (!tourOpen || !isStep) {
      setRect(null);
      return;
    }
    const measure = () => {
      const el = document.querySelector(step.selector);
      if (!el) {
        next(); // target missing → move on rather than point at nothing
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height, right: r.right, bottom: r.bottom });
    };
    measure();
    const raf = requestAnimationFrame(measure); // catch layout settle
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [tourOpen, isStep, step, next]);

  // Position the coach card next to the resolved target (after it's measured).
  useLayoutEffect(() => {
    if (!rect || !isStep) return;
    const cardH = cardRef.current?.offsetHeight || 168;
    setBox(placeCard(rect, step.prefer, cardH));
  }, [rect, isStep, step]);

  // Keyboard: →/Enter next · ← back · Esc skip.
  useEffect(() => {
    if (!tourOpen) return;
    const onKey = (e) => {
      // Enter is intentionally NOT handled here — the autofocused primary button
      // already activates on Enter; catching it too would advance twice.
      if (e.key === "Escape") {
        e.preventDefault();
        finish(optOut);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        back();
      } else if (e.key === "Tab") {
        // keep focus inside the dialog (aria-modal)
        const nodes = cardRef.current?.querySelectorAll(
          'button, input, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes || !nodes.length) return;
        const list = Array.from(nodes);
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement;
        const inside = cardRef.current.contains(active);
        if (e.shiftKey && (!inside || active === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || active === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourOpen, optOut, next, back, finish]);

  // Move focus into the dialog whenever the screen changes (a11y).
  useEffect(() => {
    if (!tourOpen) return;
    const id = requestAnimationFrame(() => {
      cardRef.current?.querySelector("[data-autofocus]")?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [tourOpen, pos]);

  if (!tourOpen) return null;

  const downloadCv = () => {
    handleBotAction("download_cv");
    finish(optOut);
  };
  const goContact = () => {
    openApp("contact");
    focusApp?.("contact");
    finish(optOut);
  };

  const stepCount = TOUR_STEPS.length;

  // ---- shared card chrome ----
  const dialogProps = {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "tour-title",
  };

  // ===== WELCOME =====
  if (pos === "welcome") {
    return (
      <div
        className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 px-4"
        style={mobile ? { alignItems: "flex-end", paddingBottom: 16 } : undefined}
      >
        <div
          ref={cardRef}
          {...dialogProps}
          className="animate-windowIn w-full max-w-[440px] rounded-[16px] border border-strong bg-window px-9 py-10 text-center text-text-body shadow-float"
        >
          <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-accent text-4xl font-extrabold text-text-on-accent shadow-float">
            D
          </div>
          <h2 id="tour-title" className="mb-3 text-[26px] font-bold leading-tight text-text">
            Welcome to Portfolio OS
          </h2>
          <p className="mx-auto max-w-[340px] text-[15px] leading-relaxed">
            This isn't a scrolling portfolio — it's a desktop you can actually use.
            Want a {mobile ? "quick" : "30-second"} tour of what's inside?
          </p>

          <div className="mt-8 flex flex-col gap-2.5">
            <button
              data-autofocus
              onClick={next}
              className="w-full rounded-control bg-accent px-4 py-3 text-[15px] font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
            >
              {mobile ? "Show me around" : "Take the tour"}
            </button>
            <button
              onClick={() => finish(optOut)}
              className="w-full rounded-control px-4 py-2.5 text-sm font-medium text-text-dim transition-colors hover:bg-surface-hover hover:text-text"
            >
              Skip — I'll explore
            </button>
          </div>

          <label className="mt-6 flex cursor-pointer items-center justify-center gap-2.5 text-[13px] text-text-dim">
            <input
              type="checkbox"
              checked={optOut}
              onChange={(e) => setOptOut(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Don't show this again
          </label>
        </div>
      </div>
    );
  }

  // ===== OUTRO =====
  if (pos === "outro") {
    return (
      <div
        className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 px-4"
        style={mobile ? { alignItems: "flex-end", paddingBottom: 16 } : undefined}
      >
        <div
          ref={cardRef}
          {...dialogProps}
          className="animate-windowIn w-full max-w-[440px] rounded-[16px] border border-strong bg-window px-9 py-10 text-center text-text-body shadow-float"
        >
          <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-success text-4xl font-bold text-text-on-accent shadow-float">
            ✓
          </div>
          <h2 id="tour-title" className="mb-3 text-[26px] font-bold leading-tight text-text">
            You're all set
          </h2>
          <p className="mx-auto max-w-[350px] text-[15px] leading-relaxed">
            Like what you see? Grab my CV, or drop me a message — I'm open to work.
          </p>
          <p className="mx-auto mt-2 max-w-[350px] text-[13px] text-text-dim">
            Replay this tour anytime from Settings → About.
          </p>

          <div className="mt-8 flex gap-3">
            <button
              data-autofocus
              onClick={downloadCv}
              className="flex-1 whitespace-nowrap rounded-control bg-accent px-4 py-3 text-[15px] font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
            >
              Download CV
            </button>
            <button
              onClick={goContact}
              className="flex-1 whitespace-nowrap rounded-control border border-strong px-4 py-3 text-[15px] font-medium text-text transition-colors hover:bg-surface-hover"
            >
              Contact me
            </button>
          </div>
          <button
            onClick={() => finish(optOut)}
            className="mt-4 w-full text-center text-sm text-text-dim transition-colors hover:text-text"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ===== SPOTLIGHT STEP =====
  return (
    <>
      {/* click-blocking backdrop — clicking it does nothing (advance via buttons/keys) */}
      <div className="fixed inset-0 z-[210]" />

      {/* spotlight cutout via oversized box-shadow; ring in the accent colour */}
      {rect && (
        <div
          className="pointer-events-none fixed z-[211]"
          style={{
            left: rect.left - PAD,
            top: rect.top - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            borderRadius: 12,
            border: "2px solid var(--accent)",
            boxShadow: "0 0 0 9999px rgba(6,9,15,0.72)",
            transition: "all var(--dur-base) cubic-bezier(.34,1.56,.64,1)",
          }}
        />
      )}

      {/* coach card */}
      {rect && box && (
        <div
          ref={cardRef}
          {...dialogProps}
          className="fixed z-[212] rounded-window border border-strong bg-window p-4 text-text-body shadow-float"
          style={{
            left: box.left,
            top: box.top,
            width: CARD_W,
            transition: "left var(--dur-base) cubic-bezier(.34,1.56,.64,1), top var(--dur-base) cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          <Beak beak={box.beak} />
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Step {pos + 1} / {stepCount}
          </div>
          <h2 id="tour-title" className="mb-1.5 mt-1 text-base font-bold text-text">
            {step.title}
          </h2>
          <p className="text-[13px] leading-relaxed">{step.body}</p>

          {/* progress dots */}
          <div className="mt-3.5 flex gap-1.5" aria-hidden="true">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === pos ? "w-4 bg-accent" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => finish(optOut)}
              className="text-xs text-text-dim transition-colors hover:text-text"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              <button
                onClick={back}
                className="rounded-control border border-strong px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-hover"
              >
                Back
              </button>
              <button
                data-autofocus
                onClick={next}
                className="rounded-control bg-accent px-3.5 py-1.5 text-xs font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
              >
                {pos >= lastStep ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
